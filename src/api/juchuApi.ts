import { judgmentApi } from "../form/api";
import { JuchuRow, PagedResponse } from "../types";

const JUCHU_JUDGMENT = "未契約,保留";

export type FetchJuchuParams = {
  salesOffice: string;
  page: number;
  size: number;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  filters: Record<string, string[]>;
};

function toJuchuRow(row: any): JuchuRow {
  return {
    id: row.id,
    formId: String(row.formId ?? row.id),
    propertyCodeDisplay: row.propertyCodeDisplay ?? row.propertyCode ?? "",
    ownerName: row.ownerName ?? row.customerName ?? "",
    buildingName: row.buildingName ?? "",
    salesOffice: row.salesOffice ?? "",
    status: row.status ?? row.judgment ?? "未契約",
    daipaTanto: row.daipaTanto ?? "",
  };
}

export async function fetchJuchuRows(
  params: FetchJuchuParams
): Promise<PagedResponse<JuchuRow>> {
  const result = await judgmentApi.list({
    salesOffice: params.salesOffice,
    judgment: JUCHU_JUDGMENT,
    page: params.page,
    size: params.size,
    sortKey: params.sortKey,
    sortDir: params.sortDir,
    filters: params.filters,
  });
  return {
    rows: (result.rows ?? []).map(toJuchuRow),
    totalCount: result.totalCount ?? 0,
    page: result.page ?? params.page,
    hasMore: !!result.hasMore,
  };
}

export async function fetchJuchuColumnValues(
  salesOffice: string,
  column: string
): Promise<string[]> {
  const result = await judgmentApi.columnValues({
    salesOffice,
    judgment: JUCHU_JUDGMENT,
    column,
  });
  return result.values ?? [];
}
