import { judgmentApi } from "../form/api";
import { PagedResponse, ShichuRow } from "../types";

const SHICHU_JUDGMENT = "失注";

export type FetchShichuParams = {
  page: number;
  size: number;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  filters: Record<string, string[]>;
};

function toShichuRow(row: any): ShichuRow {
  return {
    id: row.id,
    formId: String(row.formId ?? row.id),
    propertyCodeDisplay: row.propertyCodeDisplay ?? row.propertyCode ?? "",
    ownerName: row.ownerName ?? row.customerName ?? "",
    buildingName: row.buildingName ?? "",
    branchCode: row.branchCode ?? "",
    branchName: row.branchName ?? "",
    lostDate: row.lostDate ?? "",
  };
}

export async function fetchShichuRows(
  params: FetchShichuParams
): Promise<PagedResponse<ShichuRow>> {
  const result = await judgmentApi.list({
    judgment: SHICHU_JUDGMENT,
    page: params.page,
    size: params.size,
    sortKey: params.sortKey,
    sortDir: params.sortDir,
    filters: params.filters,
  });
  return {
    rows: (result.rows ?? []).map(toShichuRow),
    totalCount: result.totalCount ?? 0,
    page: result.page ?? params.page,
    hasMore: !!result.hasMore,
  };
}

export async function fetchShichuColumnValues(
  column: string
): Promise<string[]> {
  const result = await judgmentApi.columnValues({
    judgment: SHICHU_JUDGMENT,
    column,
  });
  return result.values ?? [];
}
