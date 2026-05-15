import { judgmentApi } from "../form/api";
import { KeiyakuRow, PagedResponse } from "../types";

const KEIYAKU_JUDGMENT = "契約";

export type FetchKeiyakuParams = {
  page: number;
  size: number;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  filters: Record<string, string[]>;
};

function toKeiyakuRow(row: any): KeiyakuRow {
  return {
    id: String(row.id),
    formId: String(row.formId ?? row.id),
    propertyCodeDisplay: row.propertyCodeDisplay ?? row.propertyCode ?? "",
    ownerName: row.ownerName ?? row.customerName ?? "",
    buildingName: row.buildingName ?? "",
    branchCode: row.branchCode ?? "",
    branchName: row.branchName ?? "",
    contractDate: row.contractDate ?? "",
  };
}

export async function fetchKeiyakuRows(
  params: FetchKeiyakuParams
): Promise<PagedResponse<KeiyakuRow>> {
  const result = await judgmentApi.list({
    judgment: KEIYAKU_JUDGMENT,
    page: params.page,
    size: params.size,
    sortKey: params.sortKey,
    sortDir: params.sortDir,
    filters: params.filters,
  });
  return {
    rows: (result.rows ?? []).map(toKeiyakuRow),
    totalCount: result.totalCount ?? 0,
    page: result.page ?? params.page,
    hasMore: !!result.hasMore,
  };
}

export async function fetchKeiyakuColumnValues(
  column: string
): Promise<string[]> {
  const result = await judgmentApi.columnValues({
    judgment: KEIYAKU_JUDGMENT,
    column,
  });
  return result.values ?? [];
}
