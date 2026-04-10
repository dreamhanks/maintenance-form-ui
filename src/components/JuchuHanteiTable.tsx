import { useMemo } from "react";
import { JuchuRow } from "../types";

type JuchuHanteiTableProps = {
  rows: JuchuRow[];
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
  "ステータス",
  "大パ担当",
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
  loading,
  selectedIds,
  onToggleOne,
  onToggleAll,
}: JuchuHanteiTableProps) {
  const isAllSelected = useMemo(() => {
    if (rows.length === 0) return false;
    return rows.every((row) => selectedIds.includes(row.id));
  }, [rows, selectedIds]);

  return (
    <section className="min-w-0">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={`${header}-${index}`}
                    className="border-b border-r border-slate-300 px-3 py-2 text-left whitespace-nowrap"
                    style={{
                      backgroundColor: "#1e2d40",
                      color: "#ffffff",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-sm text-slate-500">
                    読み込み中...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-sm text-slate-500">
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