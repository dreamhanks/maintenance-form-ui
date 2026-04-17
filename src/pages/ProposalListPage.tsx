import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppPageLayout from "../components/AppPageLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import ProposalTable from "../components/ProposalTable";
import TopNavBar from "../components/layout/TopNavBar";
import { fetchProposalColumnValues, fetchProposals } from "../api/proposalPropertyApi";
import { useUserOffices } from "../hooks/useUserOffices";
import { useAuth } from "../auth/AuthContext";
import { ProposalRow } from "../types";

const PAGE_SIZE = 100;

export default function ProposalListPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const canCreate =
    user?.role === "大パ担当者" ||
    user?.role === "大パ管理職";
  const { officeOptions, defaultOffice, error: officeError } = useUserOffices();
  const [salesOffice, setSalesOffice] = useState("");
  const [rows, setRows] = useState<ProposalRow[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [columnFilters, setColumnFilters] = useState<Record<string, Set<string>>>({});

  // Guard against out-of-order responses when the user changes filter/sort rapidly.
  const requestIdRef = useRef(0);

  // Set default office once loaded
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

  // Initial load: called on every salesOffice / sort / filter change.
  const loadInitial = useCallback(async () => {
    if (!salesOffice) return;
    const reqId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchProposals({
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
      const result = await fetchProposals({
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

  // Re-fetch from page 0 whenever salesOffice / sort / filter changes.
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

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
    (col: string) => fetchProposalColumnValues(salesOffice, col),
    [salesOffice]
  );

  const displayError = officeError || error;

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("logout failed");
      nav("/login", { replace: true });
    } catch {
      toast.error("ログアウトに失敗しました");
    }
  };

  return (
    <AppPageLayout
      title=""
      topNav={
        <TopNavBar
          activePage="proposal"
          onLogout={handleLogout}
          canCreate={canCreate}
          onNewCreate={() => nav("/form", { replace: true })}
        />
      }
      headerContent={
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#17375E]">提案物件一覧</h1>
            <div className="text-xs text-[#17375E]/70 mt-1">
              {rows.length}件表示 / 全{totalCount}件
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
    >
      {displayError && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {displayError}
        </div>
      )}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ProposalTable
          rows={rows}
          onRowClick={(id) => nav(`/form/${id}`)}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          columnFilters={columnFilters}
          onApplyFilter={handleApplyFilter}
          fetchColumnValues={handleFetchColumnValues}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
        />
      )}
    </AppPageLayout>
  );
}
