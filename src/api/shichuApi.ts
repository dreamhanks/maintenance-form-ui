import { judgmentApi } from "../form/api";
import { PagedResponse, ShichuRow } from "../types";

const SHICHU_JUDGMENT = "失注";

export type FetchShichuParams = {
  salesOffice: string;
  page: number;
  size: number;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  filters: Record<string, string[]>;
};

function toShichuRow(row: any): ShichuRow {
  return {
    id: row.id ?? row.propertyCode ?? "",
    ownerName: row.ownerName ?? row.customerName ?? "",
    buildingName: row.buildingName ?? "",
    salesOffice: row.salesOffice ?? "",
    lostDate: row.lostDate ?? "",
  };
}

export async function fetchShichuRows(
  params: FetchShichuParams
): Promise<PagedResponse<ShichuRow>> {
  const result = await judgmentApi.list({
    salesOffice: params.salesOffice,
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
  salesOffice: string,
  column: string
): Promise<string[]> {
  const result = await judgmentApi.columnValues({
    salesOffice,
    judgment: SHICHU_JUDGMENT,
    column,
  });
  return result.values ?? [];
}
