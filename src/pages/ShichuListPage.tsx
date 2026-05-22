import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppPageLayout from "../components/AppPageLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import ShichuTable from "../components/ShichuTable";
import TopNavBar from "../components/layout/TopNavBar";
import { fetchShichuColumnValues, fetchShichuRows } from "../api/shichuApi";
import { judgmentApi } from "../form/api";
import { useAuth } from "../auth/AuthContext";
import { ShichuRow } from "../types";
import { API_BASE } from "../config";

const PAGE_SIZE = 100;

export default function ShichuListPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const canCreate =
    user?.role === "大パ担当者" ||
    user?.role === "大パ管理職";
  const [rows, setRows] = useState<ShichuRow[]>([]);
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
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const requestIdRef = useRef(0);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("logout failed");
      nav("/unauthorized", { replace: true });
    } catch {
      toast.error("ログアウトに失敗しました");
    }
  };

  const filtersToServer = useCallback((): Record<string, string[]> => {
    const out: Record<string, string[]> = {};
    for (const [col, set] of Object.entries(columnFilters)) {
      if (set.size > 0) out[col] = Array.from(set);
    }
    return out;
  }, [columnFilters]);

  const loadInitial = useCallback(async () => {
    if (!user) return;
    const reqId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchShichuRows({
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
  }, [user, sortKey, sortDir, filtersToServer]);

  const loadMore = useCallback(async () => {
    if (!user || !hasMore || isLoadingMore || isLoading) return;
    setIsLoadingMore(true);
    try {
      const result = await fetchShichuRows({
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
  }, [user, hasMore, isLoadingMore, isLoading, page, sortKey, sortDir, filtersToServer]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleExportCsv = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const result = await fetchShichuRows({
        page: 0,
        size: 100000,
        sortKey,
        sortDir,
        filters: filtersToServer(),
      });

      const csvHeaders = [
        "物件CD",
        "お施主様名",
        "建物名称",
        "営業所",
        "失注日",
      ];

      const esc = (v: unknown) => {
        const s = v == null
          ? ""
          : String(v)
              .replace(/\n/g, " ")
              .replace(/\r/g, "")
              .replace(/"/g, '""');
        return `"${s}"`;
      };

      const lines: string[] = [
        csvHeaders.map(esc).join(","),
        ...result.rows.map((row) => [
          row.propertyCodeDisplay,
          row.ownerName,
          row.buildingName,
          row.branchName,
          row.lostDate,
        ].map(esc).join(",")),
      ];

      const content = "﻿" + lines.join("\r\n");
      const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const ts =
        now.getFullYear() +
        pad(now.getMonth() + 1) +
        pad(now.getDate()) + "_" +
        pad(now.getHours()) +
        pad(now.getMinutes()) +
        pad(now.getSeconds());
      a.href = url;
      a.download = `失注リスト_${ts}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("CSV書き出しに失敗しました");
    } finally {
      setIsExporting(false);
    }
  };

  const displayError = error;

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
    (col: string) => fetchShichuColumnValues(col),
    []
  );

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const canRestore =
    user?.role === "大パ担当者" ||
    user?.role === "大パ管理職" ||
    user?.role === "admin";

  const handleRestore = async () => {
    try {
      await Promise.all(
        selectedIds.map((formId) => judgmentApi.restore(Number(formId)))
      );
      setSelectedIds([]);
      setShowRestoreDialog(false);
      loadInitial();
    } catch {
      toast.error("エラーが発生しました");
    }
  };

  return (
    <AppPageLayout
      title=""
      topNav={
        <TopNavBar
          activePage="lost"
          onLogout={handleLogout}
          canCreate={canCreate}
          onNewCreate={() => nav("/form", { replace: true })}
        />
      }
      headerContent={
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#17375E]">失注リスト</h1>
            <div className="text-xs text-[#17375E]/70 mt-1">
              {rows.length}件表示 / 全{totalCount}件 / 選択件数: {selectedIds.length}件
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={isExporting}
              className="rounded-xl border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExporting ? "書き出し中..." : "CSV書き出し"}
            </button>
            {canRestore && (
              <button
                type="button"
                onClick={() => {
                  if (selectedIds.length === 0) return;
                  setShowRestoreDialog(true);
                }}
                disabled={selectedIds.length === 0}
                className="rounded-xl border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                受注判定へ復元
              </button>
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
      maxWidthClassName="max-w-[1700px]"
    >
      {displayError && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {displayError}
        </div>
      )}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ShichuTable
          rows={rows}
          selectedIds={selectedIds}
          onToggleOne={toggleOne}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          columnFilters={columnFilters}
          onApplyFilter={handleApplyFilter}
          fetchColumnValues={handleFetchColumnValues}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
          onRowClick={(id) => nav(`/form/${id}`, { state: { from: "/shichu", fromLabel: "失注リスト" } })}
        />
      )}
      {showRestoreDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
            <div className="text-base font-semibold text-slate-900">受注判定へ復元</div>
            <div className="mt-3 text-sm text-slate-700">
              以下の{selectedIds.length}件を受注判定リストへ復元します。
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
              よろしいですか？
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRestoreDialog(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleRestore}
                className="rounded-lg bg-[#17375E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#17375E]/90"
              >
                復元する
              </button>
            </div>
          </div>
        </div>
      )}
    </AppPageLayout>
  );
}
