import { judgmentApi } from "../form/api";
import { JuchuRow, JuchuSearchParams } from "../types";

export async function fetchJuchuRows(
  params: JuchuSearchParams
): Promise<JuchuRow[]> {
  const status = params.status ?? "すべて";
  const keyword = (params.keyword ?? "").trim().toLowerCase();

  // Fetch 未契約 and 保留 rows for the 受注判定 list
  const [mikeiyaku, horyu] = await Promise.all([
    judgmentApi.list({ salesOffice: params.salesOffice, judgment: "未契約" }),
    judgmentApi.list({ salesOffice: params.salesOffice, judgment: "保留" }),
  ]);

  const all: JuchuRow[] = [...mikeiyaku, ...horyu].map((row: any) => ({
    id: row.id ?? row.propertyCode ?? "",
    ownerName: row.ownerName ?? row.customerName ?? "",
    buildingName: row.buildingName ?? "",
    salesOffice: row.salesOffice ?? "",
    status: row.status ?? row.judgment ?? "未契約",
    daipaTanto: row.daipaTanto ?? "",
  }));

  return all.filter((row) => {
    const matchKeyword =
      keyword.length === 0 ||
      row.id.toLowerCase().includes(keyword) ||
      row.ownerName.toLowerCase().includes(keyword) ||
      row.buildingName.toLowerCase().includes(keyword);

    const matchStatus = status === "すべて" || row.status === status;

    return matchKeyword && matchStatus;
  });
}