import { useMemo } from "react";
import { ShichuRow } from "../types";

type ShichuTableProps = {
  rows: ShichuRow[];
  loading: boolean;
  selectedIds: string[];
  onToggleOne: (id: string) => void;
  onToggleAll: () => void;
};

const headers = [
  "選択",
  "物件CD",
  "お施主様名",
  "建物名称",
  "営業所",
  "失注日",
];

export default function ShichuTable({
  rows,
  loading,
  selectedIds,
  onToggleOne,
  onToggleAll,
}: ShichuTableProps) {
  const isAllSelected = useMemo(() => {
    if (rows.length === 0) return false;
    return rows.every((row) => selectedIds.includes(row.id));
  }, [rows, selectedIds]);

  return (
    <section className="min-w-0">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] border-collapse">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={`${header}-${index}`}
                    className="border-b border-r border-slate-300 bg-slate-800 px-3 py-3 text-left text-xs font-bold whitespace-nowrap text-white"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-slate-500">
                    読み込み中...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-slate-500">
                    データがありません
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr
                    key={`${row.id}-${index}`}
                    className="odd:bg-white even:bg-slate-50 hover:bg-blue-50"
                  >
                    <td className="border-b border-r border-slate-200 px-3 py-2 text-center">
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
                    <td className="border-b border-r border-slate-200 px-3 py-2 text-sm whitespace-nowrap text-slate-700">
                      {row.lostDate}
                    </td>
                  </tr>
                ))
              )}
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
          選択した物件を受注判定へ復元できます
        </div>
      </div>
    </section>
  );
}