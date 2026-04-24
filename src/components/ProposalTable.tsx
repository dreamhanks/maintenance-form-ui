import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProposalRow } from "../types";

type ProposalTableProps = {
  rows: ProposalRow[];
  onRowClick?: (id: string) => void;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  onSort: (key: string, dir?: "asc" | "desc") => void;
  columnFilters: Record<string, Set<string>>;
  onApplyFilter: (col: string, values: Set<string>) => void;
  fetchColumnValues: (col: string) => Promise<string[]>;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
};

const headers: { label: string; key: string }[] = [
  { label: "物件CD", key: "propertyCodeDisplay" },
  { label: "お施主様名", key: "ownerName" },
  { label: "建物名称", key: "buildingName" },
  { label: "営業所", key: "salesOffice" },
  { label: "ステータス", key: "status" },
  // Step 1
  { label: "大パ担当者①", key: "daipaTanto" },
  { label: "回覧日", key: "daipaTantoDate" },
  // Step 2
  { label: "大パ管理職①", key: "daipaKacho" },
  { label: "回覧日", key: "daipaKachoDate" },
  // Step 3
  { label: "メンテ管理職①", key: "maintenanceManager1" },
  { label: "回覧日", key: "maintenanceManager1Date" },
  // Step 4
  { label: "設計管理職", key: "designManager1" },
  { label: "回覧日", key: "designManager1Date" },
  // Step 5
  { label: "大パ担当者②", key: "kanriTanto" },
  { label: "回覧日", key: "kanriTantoDate" },
  // Step 6
  { label: "大パ管理職②", key: "kanriKacho" },
  { label: "回覧日", key: "kanriKachoDate" },
  // Step 7
  { label: "メンテ管理職②", key: "maintenanceManager2" },
  { label: "回覧日", key: "maintenanceManager2Date" },
  // Step 8
  { label: "大パ担当者③", key: "designManager2" },
  { label: "回覧日", key: "designManager2Date" },
  // Step 9
  { label: "大パ管理職③", key: "daipaKacho3" },
  { label: "回覧日", key: "daipaKacho3Date" },
  // Step 10
  { label: "業務管理職", key: "gyomukaConfirmUser" },
  { label: "確認日", key: "confirmDate" },
];

function getStatusClass(status: string) {
  if (status === "確認完了") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (status === "設計管理職") return "bg-rose-50 text-rose-700 border border-rose-200";
  if (status === "業務管理職") return "bg-amber-50 text-amber-700 border border-amber-200";
  if (status.startsWith("メンテ管理職")) return "bg-cyan-50 text-cyan-700 border border-cyan-200";
  if (status.startsWith("大パ管理職")) return "bg-indigo-50 text-indigo-700 border border-indigo-200";
  if (status.startsWith("大パ担当者")) return "bg-slate-100 text-slate-700 border border-slate-200";
  return "bg-slate-50 text-slate-700 border border-slate-200";
}

function tableRowCells(row: ProposalRow) {
  return [
    row.propertyCodeDisplay,
    row.ownerName,
    row.buildingName,
    row.salesOffice,
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
  ];
}

export default function ProposalTable({
  rows,
  onRowClick,
  sortKey,
  sortDir,
  onSort,
  columnFilters,
  onApplyFilter,
  fetchColumnValues,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: ProposalTableProps) {
  const [openFilterCol, setOpenFilterCol] = useState<string | null>(null);
  const [tempChecked, setTempChecked] = useState<Set<string>>(new Set());
  const [tempSearch, setTempSearch] = useState("");
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const [uniqueValues, setUniqueValues] = useState<string[]>([]);
  const [uniqueValuesLoading, setUniqueValuesLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLTableRowElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const DROPDOWN_WIDTH = 240;
  const DROPDOWN_EST_HEIGHT = 360;

  useEffect(() => {
    if (!openFilterCol) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenFilterCol(null);
        setDropdownPos(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openFilterCol]);

  // Infinite scroll: observe the sentinel row and trigger loadMore when it enters
  // the scroll container (not the viewport, since the table now scrolls inside a
  // bounded container with its own height).
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { root: scrollContainerRef.current, threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  const handleOpenFilter = async (col: string, btn: HTMLElement) => {
    setTempSearch("");
    const rect = btn.getBoundingClientRect();
    let left = rect.left;
    let top = rect.bottom;
    if (left + DROPDOWN_WIDTH > window.innerWidth) {
      left = Math.max(8, rect.right - DROPDOWN_WIDTH);
    }
    if (top + DROPDOWN_EST_HEIGHT > window.innerHeight && rect.top > DROPDOWN_EST_HEIGHT) {
      top = Math.max(8, rect.top - DROPDOWN_EST_HEIGHT);
    }
    setDropdownPos({ top, left });
    setOpenFilterCol(col);
    setUniqueValues([]);
    setUniqueValuesLoading(true);
    try {
      const values = await fetchColumnValues(col);
      setUniqueValues(values);
      const existing = columnFilters[col];
      if (!existing || existing.size === 0) {
        setTempChecked(new Set(values));
      } else {
        setTempChecked(new Set(existing));
      }
    } catch {
      setUniqueValues([]);
      setTempChecked(new Set());
    } finally {
      setUniqueValuesLoading(false);
    }
  };

  return (
    <section className="min-w-0">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-auto w-full"
          style={{ height: "calc(100vh - 220px)" }}
        >
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                {headers.map((header, index) => {
                  const hasFilter = (columnFilters[header.key]?.size ?? 0) > 0;
                  const isOpen = openFilterCol === header.key;
                  return (
                    <th
                      key={`${header.label}-${index}`}
                      className="sticky top-0 z-10 border-b border-r border-slate-300 px-3 py-2 text-left whitespace-nowrap"
                      style={{
                        backgroundColor: "#2d4a6b",
                        color: "#ffffff",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>{header.label}</span>
                        <span className="text-xs ml-1">
                          {sortKey === header.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenFilter(header.key, e.currentTarget);
                          }}
                          className={`ml-auto text-xs px-1 rounded ${
                            isOpen ? "bg-white/30" : "hover:bg-white/20"
                          } ${hasFilter ? "text-yellow-300" : "text-white/70"}`}
                        >
                          ▼
                        </button>
                      </div>
                      {isOpen && dropdownPos && createPortal(
                        <div
                          ref={wrapperRef}
                          onClick={(e) => e.stopPropagation()}
                          style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999, width: DROPDOWN_WIDTH, fontWeight: 400 }}
                          className="bg-white border border-gray-200 rounded shadow-lg text-left text-slate-800"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onSort(header.key, "asc");
                              setOpenFilterCol(null);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                          >
                            ↑ 昇順
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onSort(header.key, "desc");
                              setOpenFilterCol(null);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                          >
                            ↓ 降順
                          </button>
                          <div className="border-t border-gray-200 my-1" />
                          <div className="px-2 py-1">
                            <input
                              type="text"
                              value={tempSearch}
                              onChange={(e) => setTempSearch(e.target.value)}
                              placeholder="検索..."
                              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                            />
                          </div>
                          {uniqueValuesLoading ? (
                            <div style={{ padding: "12px", textAlign: "center", fontSize: "12px", color: "#475569" }}>
                              読み込み中...
                            </div>
                          ) : (() => {
                            const allValues = uniqueValues;
                            const visible = tempSearch
                              ? allValues.filter((v) =>
                                  v.toLowerCase().includes(tempSearch.toLowerCase())
                                )
                              : allValues;
                            const allVisibleChecked =
                              visible.length > 0 && visible.every((v) => tempChecked.has(v));
                            const someVisibleChecked = visible.some((v) => tempChecked.has(v));
                            const handleSelectAll = () => {
                              setTempChecked((prev) => {
                                const next = new Set(prev);
                                if (allVisibleChecked) {
                                  visible.forEach((v) => next.delete(v));
                                } else {
                                  visible.forEach((v) => next.add(v));
                                }
                                return next;
                              });
                            };
                            const toggle = (v: string) => {
                              setTempChecked((prev) => {
                                const next = new Set(prev);
                                if (next.has(v)) next.delete(v);
                                else next.add(v);
                                return next;
                              });
                            };
                            return (
                              <div className="max-h-48 overflow-y-auto px-2 py-1">
                                <label className="flex items-center gap-2 py-0.5 cursor-pointer text-sm font-semibold">
                                  <input
                                    type="checkbox"
                                    checked={allVisibleChecked}
                                    ref={(el) => { if (el) el.indeterminate = someVisibleChecked && !allVisibleChecked; }}
                                    onChange={handleSelectAll}
                                  />
                                  (すべて選択)
                                </label>
                                {visible.map((val) => (
                                  <label
                                    key={val}
                                    className="flex items-center gap-2 py-0.5 cursor-pointer text-sm"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={tempChecked.has(val)}
                                      onChange={() => toggle(val)}
                                    />
                                    {val === "" ? "(空白)" : val}
                                  </label>
                                ))}
                              </div>
                            );
                          })()}
                          <div className="border-t border-gray-200 mt-1" />
                          <div className="flex justify-end gap-2 px-2 py-2">
                            <button
                              type="button"
                              onClick={() => setOpenFilterCol(null)}
                              className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                            >
                              キャンセル
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const allValues = uniqueValues;
                                const allChecked =
                                  allValues.length > 0 &&
                                  allValues.every((v) => tempChecked.has(v));
                                onApplyFilter(
                                  header.key,
                                  allChecked ? new Set() : new Set(tempChecked)
                                );
                                setOpenFilterCol(null);
                              }}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              OK
                            </button>
                          </div>
                        </div>,
                        document.body
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 && !isLoadingMore ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="px-4 py-16 text-center text-sm text-slate-500"
                  >
                    データがありません
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr
                    key={`${row.id}-${index}`}
                    className={`odd:bg-white even:bg-slate-50 hover:bg-amber-50${onRowClick ? " cursor-pointer" : ""}`}
                    onClick={() => onRowClick?.(row.id)}
                  >
                    {tableRowCells(row).map((cell, cellIndex) => {
                      const isStatus = cellIndex === 4;

                      return (
                        <td
                          key={`${row.id}-${cellIndex}`}
                          className="border-b border-r border-slate-200 px-3 py-2 text-xs whitespace-nowrap text-slate-700"
                        >
                          {isStatus ? (
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${getStatusClass(
                                String(cell)
                              )}`}
                            >
                              {cell || "-"}
                            </span>
                          ) : (
                            cell || ""
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}

              {isLoadingMore && (
                <tr>
                  <td colSpan={headers.length} style={{ textAlign: "center", padding: "16px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#17375E" }}>
                      <span
                        style={{
                          width: "18px",
                          height: "18px",
                          border: "2px solid #E6EEF5",
                          borderTop: "2px solid #17375E",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                          display: "inline-block",
                        }}
                      />
                      読み込み中...
                    </div>
                  </td>
                </tr>
              )}

              {/* Sentinel row — IntersectionObserver triggers loadMore when this scrolls into view. */}
              <tr ref={sentinelRef} aria-hidden="true">
                <td colSpan={headers.length} style={{ height: "1px", padding: 0, border: 0 }} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}
