import { KeiyakuRow } from "../types";

type KeiyakuTableProps = {
  rows: KeiyakuRow[];
  loading: boolean;
};

const headers = [
  "物件CD",
  "お施主様名",
  "建物名称",
  "営業所",
  "契約日",
];

export default function KeiyakuTable({
  rows,
  loading,
}: KeiyakuTableProps) {
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
                      backgroundColor: "#2d4a6b",
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
                  <td colSpan={5} className="px-4 py-16 text-center text-sm text-slate-500">
                    読み込み中...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-sm text-slate-500">
                    データがありません
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr
                    key={`${row.id}-${index}`}
                    className="odd:bg-white even:bg-slate-50 hover:bg-emerald-50"
                  >
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
                      {row.contractDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}