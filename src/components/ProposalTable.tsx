import { ProposalRow } from "../types";

type ProposalTableProps = {
  rows: ProposalRow[];
  loading: boolean;
  onRowClick?: (id: string) => void;
};

const headers = [
  "物件CD",
  "お施主様名",
  "建物名称",
  "営業所",
  "ステータス",
  "大パ担当",
  "回覧日",
  "大パ課長",
  "回覧日",
  "メンテ管理職",
  "回覧日",
  "設計管理職",
  "回覧日",
  "管理担当",
  "回覧日",
  "管理課長",
  "回覧日",
  "メンテ管理職",
  "回覧日",
  "設計管理職",
  "回覧日",
  "業務課確認者",
  "確認日",
];

function getStatusClass(status: string) {
  switch (status) {
    case "確認完了":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "設計管理職":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "メンテ管理職":
      return "bg-cyan-50 text-cyan-700 border border-cyan-200";
    case "管理課長":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "管理担当":
      return "bg-violet-50 text-violet-700 border border-violet-200";
    case "大パ課長":
      return "bg-indigo-50 text-indigo-700 border border-indigo-200";
    case "大パ担当":
      return "bg-slate-100 text-slate-700 border border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border border-slate-200";
  }
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
    row.gyomukaConfirmUser,
    row.confirmDate,
  ];
}

export default function ProposalTable({
  rows,
  loading,
  onRowClick,
}: ProposalTableProps) {
  return (
    <section className="min-w-0">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={`${header}-${index}`}
                    className="sticky top-0 z-10 border-b border-r border-slate-300 px-3 py-2 text-center whitespace-nowrap"
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
                  <td
                    colSpan={23}
                    className="px-4 py-16 text-center text-sm text-slate-500"
                  >
                    読み込み中...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={23}
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
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}
