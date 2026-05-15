import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppPageLayout from "../components/AppPageLayout";
import KeiyakuTable from "../components/KeiyakuTable";
import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/layout/TopNavBar";
import { fetchKeiyakuColumnValues, fetchKeiyakuRows } from "../api/keiyakuApi";
import { useAuth } from "../auth/AuthContext";
import { KeiyakuRow } from "../types";
import { API_BASE } from "../config";

const PAGE_SIZE = 100;

export default function KeiyakuListPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const canCreate =
    user?.role === "大パ担当者" ||
    user?.role === "大パ管理職";
  const [rows, setRows] = useState<KeiyakuRow[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [columnFilters, setColumnFilters] = useState<Record<string, Set<string>>>({});

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
      const result = await fetchKeiyakuRows({
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
  }, [user, sortKey, sortDir, filtersToServer]);

  const loadMore = useCallback(async () => {
    if (!user || !hasMore || isLoadingMore || isLoading) return;
    setIsLoadingMore(true);
    try {
      const result = await fetchKeiyakuRows({
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
    (col: string) => fetchKeiyakuColumnValues(col),
    []
  );

  return (
    <AppPageLayout
      title=""
      topNav={
        <TopNavBar
          activePage="contract"
          onLogout={handleLogout}
          canCreate={canCreate}
          onNewCreate={() => nav("/form", { replace: true })}
        />
      }
      headerContent={
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#17375E]">契約済みリスト</h1>
            <div className="text-xs text-[#17375E]/70 mt-1">
              {rows.length}件表示 / 全{totalCount}件
            </div>
          </div>
          <div className="flex items-center gap-3">
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
        <KeiyakuTable
          rows={rows}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          columnFilters={columnFilters}
          onApplyFilter={handleApplyFilter}
          fetchColumnValues={handleFetchColumnValues}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
          onRowClick={(id) => nav(`/form/${id}`, { state: { from: "/keiyaku", fromLabel: "契約済みリスト" } })}
        />
      )}
    </AppPageLayout>
  );
}
