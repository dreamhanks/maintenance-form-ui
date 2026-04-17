import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { JuchuRow } from "../types";

type JuchuHanteiTableProps = {
  rows: JuchuRow[];
  selectedIds: string[];
  onToggleOne: (id: string) => void;
  onToggleAll: () => void;
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
  { label: "物件CD", key: "id" },
  { label: "お施主様名", key: "ownerName" },
  { label: "建物名称", key: "buildingName" },
  { label: "営業所", key: "salesOffice" },
  { label: "ステータス", key: "status" },
  { label: "大パ担当", key: "daipaTanto" },
];

function getStatusClass(status: string) {
  switch (status) {
    case "契約":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "失注":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "保留":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
}

export default function JuchuHanteiTable({
  rows,
  selectedIds,
  onToggleOne,
  onToggleAll,
  sortKey,
  sortDir,
  onSort,
  columnFilters,
  onApplyFilter,
  fetchColumnValues,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: JuchuHanteiTableProps) {
  const [openFilterCol, setOpenFilterCol] = useState<string | null>(null);
  const [tempChecked, setTempChecked] = useState<Set<string>>(new Set());
  const [tempSearch, setTempSearch] = useState("");
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const [uniqueValues, setUniqueValues] = useState<string[]>([]);
  const [uniqueValuesLoading, setUniqueValuesLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLTableRowElement>(null);

  const DROPDOWN_WIDTH = 240;
  const DROPDOWN_EST_HEIGHT = 360;

  const isAllSelected = useMemo(() => {
    if (rows.length === 0) return false;
    return rows.every((row) => selectedIds.includes(row.id));
  }, [rows, selectedIds]);

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

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
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

  const totalColCount = 1 + headers.length;

  return (
    <section className="min-w-0">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th
                  className="sticky top-0 z-10 border-b border-r border-slate-300 px-3 py-2 text-left whitespace-nowrap"
                  style={{
                    backgroundColor: "#2d4a6b",
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  選択
                </th>
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
                  <td colSpan={totalColCount} className="px-4 py-16 text-center text-sm text-slate-500">
                    データがありません
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr
                    key={`${row.id}-${index}`}
                    className="odd:bg-white even:bg-slate-50 hover:bg-blue-50"
                  >
                    <td className="border-b border-r border-slate-200 px-3 py-2 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => onToggleOne(row.id)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </td>
                    <td className="border-b border-r border-slate-200 px-3 py-2 text-sm whitespace-nowrap text-slate-700">
                      {row.id}
                    </td>
                    <td className="border-b border-r border-slate-200 px-3 py-2 text-sm whitespace-nowrap text-slate-700">
                      {row.ownerName}
                    </td>
                    <td className="border-b border-r border-slate-200 px-3 py-2 text-sm whitespace-nowrap text-slate-700">
                      {row.buildingName}
                    </td>
                    <td className="border-b border-r border-slate-200 px-3 py-2 text-sm whitespace-nowrap text-slate-700">
                      {row.salesOffice}
                    </td>
                    <td className="border-b border-r border-slate-200 px-3 py-2 text-sm whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${getStatusClass(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="border-b border-r border-slate-200 px-3 py-2 text-sm whitespace-nowrap text-slate-700">
                      {row.daipaTanto}
                    </td>
                  </tr>
                ))
              )}

              {isLoadingMore && (
                <tr>
                  <td colSpan={totalColCount} style={{ textAlign: "center", padding: "16px" }}>
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

              <tr ref={sentinelRef} aria-hidden="true">
                <td colSpan={totalColCount} style={{ height: "1px", padding: 0, border: 0 }} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onToggleAll}
            className="h-4 w-4 rounded border-slate-300"
          />
          表示中の行をすべて選択
        </label>

        <div className="text-sm text-slate-500">
          対象物件を選択して判定できます
        </div>
      </div>
    </section>
  );
}
