import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppPageLayout from "../components/AppPageLayout";
import JuchuHanteiTable from "../components/JuchuHanteiTable";
import ContractActionPanel from "../components/ContractActionPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/layout/TopNavBar";
import { fetchJuchuColumnValues, fetchJuchuRows } from "../api/juchuApi";
import { judgmentApi } from "../form/api";
import { useUserOffices } from "../hooks/useUserOffices";
import { useAuth } from "../auth/AuthContext";
import { JuchuRow } from "../types";
import { API_BASE } from "../config";

const PAGE_SIZE = 100;

export default function JuchuHanteiListPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const canCreate =
    user?.role === "大パ担当者" ||
    user?.role === "大パ管理職";
  const { officeOptions, defaultOffice, error: officeError } = useUserOffices();
  const [salesOffice, setSalesOffice] = useState("");
  const [rows, setRows] = useState<JuchuRow[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [columnFilters, setColumnFilters] = useState<Record<string, Set<string>>>({});
  const [showLostDialog, setShowLostDialog] = useState(false);
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [pendingContractDate, setPendingContractDate] = useState("");

  const requestIdRef = useRef(0);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("logout failed");
      nav("/login", { replace: true });
    } catch {
      toast.error("ログアウトに失敗しました");
    }
  };

  useEffect(() => {
    if (defaultOffice && !salesOffice) setSalesOffice(defaultOffice);
  }, [defaultOffice, salesOffice]);

  const filtersToServer = useCallback((): Record<string, string[]> => {
    const out: Record<string, string[]> = {};
    for (const [col, set] of Object.entries(columnFilters)) {
      if (set.size > 0) out[col] = Array.from(set);
    }
    return out;
  }, [columnFilters]);

  const loadInitial = useCallback(async () => {
    if (!salesOffice) return;
    const reqId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchJuchuRows({
        salesOffice,
        page: 0,
        size: PAGE_SIZE,
        sortKey,
        sortDir,
        filters: filtersToServer(),
      });
      if (reqId !== requestIdRef.current) return;
      setRows(result.rows);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      setPage(1);
      setSelectedIds([]);
    } catch (err) {
      if (reqId !== requestIdRef.current) return;
      setError(err instanceof Error ? err.message : "データの取得に失敗しました");
      setRows([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      if (reqId === requestIdRef.current) setIsLoading(false);
    }
  }, [salesOffice, sortKey, sortDir, filtersToServer]);

  const loadMore = useCallback(async () => {
    if (!salesOffice || !hasMore || isLoadingMore || isLoading) return;
    setIsLoadingMore(true);
    try {
      const result = await fetchJuchuRows({
        salesOffice,
        page,
        size: PAGE_SIZE,
        sortKey,
        sortDir,
        filters: filtersToServer(),
      });
      setRows((prev) => [...prev, ...result.rows]);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      setPage((p) => p + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "データの取得に失敗しました");
    } finally {
      setIsLoadingMore(false);
    }
  }, [salesOffice, hasMore, isLoadingMore, isLoading, page, sortKey, sortDir, filtersToServer]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const displayError = officeError || error;

  const handleSort = (key: string, dir?: "asc" | "desc") => {
    if (dir) {
      setSortKey(key);
      setSortDir(dir);
      return;
    }
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleApplyFilter = (col: string, values: Set<string>) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      if (values.size === 0) delete next[col];
      else next[col] = values;
      return next;
    });
  };

  const handleFetchColumnValues = useCallback(
    (col: string) => fetchJuchuColumnValues(salesOffice, col),
    [salesOffice]
  );

  const toggleAll = () => {
    const allSelected =
      rows.length > 0 && rows.every((row) => selectedIds.includes(row.formId));
    setSelectedIds(allSelected ? [] : rows.map((row) => row.formId));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const today = new Date().toISOString().split("T")[0];

  const handleContractConfirm = (contractDate: string) => {
    setPendingContractDate(contractDate);
    setShowContractDialog(true);
  };

  const executeContract = async () => {
    try {
      await Promise.all(
        selectedIds.map((formId) =>
          judgmentApi.setJudgment(Number(formId), {
            judgment: "契約",
            contractDate: pendingContractDate,
            lostDate: null,
            holdDate: null,
          })
        )
      );
      setSelectedIds([]);
      setShowContractDialog(false);
      setPendingContractDate("");
      loadInitial();
    } catch {
      toast.error("エラーが発生しました");
    }
  };

  const handleLost = () => {
    setShowLostDialog(true);
  };

  const executeLost = async () => {
    try {
      await Promise.all(
        selectedIds.map((formId) =>
          judgmentApi.setJudgment(Number(formId), {
            judgment: "失注",
            contractDate: null,
            lostDate: today,
            holdDate: null,
          })
        )
      );
      setSelectedIds([]);
      setShowLostDialog(false);
      loadInitial();
    } catch {
      toast.error("エラーが発生しました");
    }
  };

  const handleHold = () => {
    setShowHoldDialog(true);
  };

  const executeHold = async () => {
    try {
      await Promise.all(
        selectedIds.map((formId) =>
          judgmentApi.setJudgment(Number(formId), {
            judgment: "保留",
            contractDate: null,
            lostDate: null,
            holdDate: today,
          })
        )
      );
      setSelectedIds([]);
      setShowHoldDialog(false);
      loadInitial();
    } catch {
      toast.error("エラーが発生しました");
    }
  };

  const canJudge =
    user?.role === "大パ担当者" ||
    user?.role === "大パ管理職" ||
    user?.role === "admin";

  return (
    <AppPageLayout
      title=""
      topNav={
        <TopNavBar
          activePage="order"
          onLogout={handleLogout}
          canCreate={canCreate}
          onNewCreate={() => nav("/form", { replace: true })}
        />
      }
      headerContent={
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#17375E]">受注判定リスト</h1>
            <div className="text-xs text-[#17375E]/70 mt-1">
              {rows.length}件表示 / 全{totalCount}件 / 選択件数: {selectedIds.length}件
            </div>
          </div>
          <div className="flex items-center gap-3">
            {officeOptions.length > 1 && (
              <>
                <span className="text-sm font-semibold text-[#17375E]">営業所名</span>
                <select
                  value={salesOffice}
                  onChange={(e) => setSalesOffice(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-[#17375E] outline-none focus:border-blue-500"
                >
                  {officeOptions.map((office) => (
                    <option key={office.value} value={office.value}>
                      {office.label}
                    </option>
                  ))}
                </select>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setSortKey(null);
                setSortDir("asc");
                setColumnFilters({});
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#17375E] transition hover:bg-slate-100"
            >
              条件クリア
            </button>
          </div>
        </div>
      }
      rightPanel={
        canJudge ? (
          <ContractActionPanel
            selectedCount={selectedIds.length}
            onContractConfirm={handleContractConfirm}
            onLost={handleLost}
            onHold={handleHold}
          />
        ) : undefined
      }
    >
      {displayError && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {displayError}
        </div>
      )}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <JuchuHanteiTable
          rows={rows}
          selectedIds={selectedIds}
          onToggleOne={toggleOne}
          onToggleAll={toggleAll}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          columnFilters={columnFilters}
          onApplyFilter={handleApplyFilter}
          fetchColumnValues={handleFetchColumnValues}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
          onRowClick={(id) => nav(`/form/${id}`, { state: { from: "/juchu", fromLabel: "受注判定リスト" } })}
        />
      )}
      {showLostDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
            <div className="text-base font-semibold text-slate-900">失注</div>
            <div className="mt-3 text-sm text-slate-700">
              以下の{selectedIds.length}件を失注にします。
            </div>
            <ul className="mt-2 max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {rows
                .filter((r) => selectedIds.includes(r.formId))
                .map((r) => (
                  <li
                    key={r.formId}
                    className="py-0.5 border-b border-slate-100 last:border-0"
                  >
                    {r.propertyCodeDisplay}
                  </li>
                ))}
            </ul>
            <div className="mt-3 text-sm text-slate-500">よろしいですか？</div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLostDialog(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={executeLost}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                失注する
              </button>
            </div>
          </div>
        </div>
      )}
      {showHoldDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
            <div className="text-base font-semibold text-slate-900">保留</div>
            <div className="mt-3 text-sm text-slate-700">
              以下の{selectedIds.length}件を保留にします。
            </div>
            <ul className="mt-2 max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {rows
                .filter((r) => selectedIds.includes(r.formId))
                .map((r) => (
                  <li
                    key={r.formId}
                    className="py-0.5 border-b border-slate-100 last:border-0"
                  >
                    {r.propertyCodeDisplay}
                  </li>
                ))}
            </ul>
            <div className="mt-3 text-sm text-slate-500">よろしいですか？</div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowHoldDialog(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={executeHold}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                保留する
              </button>
            </div>
          </div>
        </div>
      )}
      {showContractDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
            <div className="text-base font-semibold text-slate-900">契約</div>
            <div className="mt-3 text-sm text-slate-700">
              以下の{selectedIds.length}件を契約にします。
            </div>
            <ul className="mt-2 max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {rows
                .filter((r) => selectedIds.includes(r.formId))
                .map((r) => (
                  <li
                    key={r.formId}
                    className="py-0.5 border-b border-slate-100 last:border-0"
                  >
                    {r.propertyCodeDisplay}
                  </li>
                ))}
            </ul>
            <div className="mt-3 text-sm text-slate-500">
              契約日: {pendingContractDate}
              <br />
              よろしいですか？
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowContractDialog(false);
                  setPendingContractDate("");
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={executeContract}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                契約する
              </button>
            </div>
          </div>
        </div>
      )}
    </AppPageLayout>
  );
}
