import { judgmentApi } from "../form/api";
import { KeiyakuRow, KeiyakuSearchParams } from "../types";

export async function fetchKeiyakuRows(
  params: KeiyakuSearchParams
): Promise<KeiyakuRow[]> {
  const keyword = (params.keyword ?? "").trim().toLowerCase();

  const data = await judgmentApi.list({
    salesOffice: params.salesOffice,
    judgment: "契約",
  });

  const rows: KeiyakuRow[] = data.map((row: any) => ({
    id: row.id ?? row.propertyCode ?? "",
    ownerName: row.ownerName ?? row.customerName ?? "",
    buildingName: row.buildingName ?? "",
    salesOffice: row.salesOffice ?? "",
    contractDate: row.contractDate ?? "",
  }));

  return rows.filter((row) => {
    const matchKeyword =
      keyword.length === 0 ||
      row.id.toLowerCase().includes(keyword) ||
      row.ownerName.toLowerCase().includes(keyword) ||
      row.buildingName.toLowerCase().includes(keyword);

    return matchKeyword;
  });
}