import { judgmentApi } from "../form/api";
import { ShichuRow, ShichuSearchParams } from "../types";

export async function fetchShichuRows(
  params: ShichuSearchParams
): Promise<ShichuRow[]> {
  const keyword = (params.keyword ?? "").trim().toLowerCase();

  const data = await judgmentApi.list({
    salesOffice: params.salesOffice,
    judgment: "失注",
  });

  const rows: ShichuRow[] = data.map((row: any) => ({
    id: row.id ?? row.propertyCode ?? "",
    ownerName: row.ownerName ?? row.customerName ?? "",
    buildingName: row.buildingName ?? "",
    salesOffice: row.salesOffice ?? "",
    lostDate: row.lostDate ?? "",
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