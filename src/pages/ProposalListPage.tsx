import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppPageLayout from "../components/AppPageLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import ProposalTable from "../components/ProposalTable";
import TopNavBar from "../components/layout/TopNavBar";
import { fetchProposalColumnValues, fetchProposals } from "../api/proposalPropertyApi";
import { formApi } from "../form/api";
import { useAuth } from "../auth/AuthContext";
import { ProposalRow } from "../types";
import { API_BASE } from "../config";

const PAGE_SIZE = 100;

export default function ProposalListPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const canCreate =
    user?.role === "大パ担当者" ||
    user?.role === "大パ管理職";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Guard against out-of-order responses when the user changes filter/sort rapidly.
  const requestIdRef = useRef(0);

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
      const result = await fetchProposals({
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
      const result = await fetchProposals({
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

  const handleDuplicate = async () => {
    if (!selectedId || !canCreate) return;
    try {
      const data = await formApi.get(Number(selectedId));
      let uiState: any = null;
      if (data?.payloadJson) {
        try {
          const parsed = JSON.parse(data.payloadJson);
          uiState = parsed?.uiState ?? null;
        } catch {}
      }
      const copyFrom = {
        furigana: data.customerNameKana ?? "",
        customerName: data.customerName ?? "",
        address: data.buildingAddress ?? "",
        propertyCd: data.buildingCode ?? "",
        propertyCd3: data.buildingCode3 ?? "",
        buildingName: data.buildingName ?? "",
        completionDate: data.completionDate ?? "",
        productName: data.productName ?? "",
        branchCode: data.branchCode ?? "",
        branchName: data.branchName ?? "",
        roof: uiState?.roof ?? false,
        outsideWall: uiState?.outsideWall ?? false,
        balcony: uiState?.balcony ?? false,
        commonArea: uiState?.commonArea ?? false,
        privateArea: uiState?.privateArea ?? false,
        otherWork: uiState?.otherWork ?? false,
        otherWorkText: uiState?.otherWorkText ?? "",
        workDetail: uiState?.workDetail ?? "",
        ownerFlag: uiState?.ownerFlag ?? "",
        ownerText: uiState?.ownerText ?? "",
        residentFlag: uiState?.residentFlag ?? "",
        residentText: uiState?.residentText ?? "",
        neighborFlag: uiState?.neighborFlag ?? "",
        neighborText: uiState?.neighborText ?? "",
        proposalDate: uiState?.proposalDate ?? "",
        contractDate: uiState?.contractDate ?? "",
        startDate: uiState?.startDate ?? "",
      };
      nav("/form", {
        state: {
          from: "/",
          fromLabel: "提案物件一覧",
          copyFrom,
        },
      });
    } catch {
      toast.error("複製に失敗しました");
    }
  };

  const handleExportCsv = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const result = await fetchProposals({
        page: 0,
        size: 100000,
        sortKey,
        sortDir,
        filters: filtersToServer(),
      });

      const csvHeaders = [
        "物件CD", "お施主様名",
        "建物名称", "営業所",
        "ステータス",
        "大パ担当者①",
        "回覧日",
        "大パ管理職①",
        "回覧日",
        "メンテ管理職①",
        "回覧日",
        "設計管理職",
        "回覧日",
        "大パ担当者②",
        "回覧日",
        "大パ管理職②",
        "回覧日",
        "メンテ管理職②",
        "回覧日",
        "大パ担当者③",
        "回覧日",
        "大パ管理職③",
        "回覧日",
        "業務管理職",
        "確認日",
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
          row.status,
          row.daipaTanto,
          row.daipaTantoDate,
          row.daipaKacho,
          row.daipaKachoDate,
          row.maintenanceManager1,
          row.maintenanceManager1Date,
          row.designManager1,
          row.designManager1Date,
          row.kanriTanto,
          row.kanriTantoDate,
          row.kanriKacho,
          row.kanriKachoDate,
          row.maintenanceManager2,
          row.maintenanceManager2Date,
          row.designManager2,
          row.designManager2Date,
          row.daipaKacho3,
          row.daipaKacho3Date,
          row.gyomukaConfirmUser,
          row.confirmDate,
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
      a.download = `提案物件一覧_${ts}.csv`;
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
    (col: string) => fetchProposalColumnValues(col),
    []
  );

  const displayError = error;

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
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={isExporting}
              className="rounded-xl border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExporting ? "書き出し中..." : "CSV書き出し"}
            </button>
            {canCreate && (
              <button
                type="button"
                onClick={handleDuplicate}
                disabled={!selectedId}
                className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                複製
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
          onRowClick={(id) => nav(`/form/${id}`, { state: { from: "/", fromLabel: "提案物件一覧" } })}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          columnFilters={columnFilters}
          onApplyFilter={handleApplyFilter}
          fetchColumnValues={handleFetchColumnValues}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
          showCheckbox={canCreate}
          selectedId={selectedId}
          onSelectRow={(id) => setSelectedId((prev) => (prev === id ? null : id))}
        />
      )}
    </AppPageLayout>
  );
}
