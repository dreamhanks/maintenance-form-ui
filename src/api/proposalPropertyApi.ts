import { formApi } from "../form/api";
import { PagedResponse, ProposalRow } from "../types";

export type FetchProposalsParams = {
  salesOffice: string;
  page: number;
  size: number;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  filters: Record<string, string[]>;
};

function toProposalRow(row: any): ProposalRow {
  return {
    id: String(row.id ?? ""),
    propertyCode: row.propertyCode ?? "",
    propertyCode2: row.propertyCode2 ?? "",
    propertyCode3: row.propertyCode3 ?? "",
    propertyCodeDisplay: row.propertyCodeDisplay ?? row.propertyCode ?? "",
    ownerName: row.ownerName ?? row.customerName ?? "",
    buildingName: row.buildingName ?? "",
    salesOffice: row.salesOffice ?? "",
    status: row.status ?? "",

    daipaTanto: row.daipaTanto ?? "",
    daipaTantoDate: row.daipaTantoDate ?? "",

    daipaKacho: row.daipaKacho ?? "",
    daipaKachoDate: row.daipaKachoDate ?? "",

    maintenanceManager1: row.maintenanceManager1 ?? "",
    maintenanceManager1Date: row.maintenanceManager1Date ?? "",

    designManager1: row.designManager1 ?? "",
    designManager1Date: row.designManager1Date ?? "",

    kanriTanto: row.kanriTanto ?? "",
    kanriTantoDate: row.kanriTantoDate ?? "",

    kanriKacho: row.kanriKacho ?? "",
    kanriKachoDate: row.kanriKachoDate ?? "",

    maintenanceManager2: row.maintenanceManager2 ?? "",
    maintenanceManager2Date: row.maintenanceManager2Date ?? "",

    designManager2: row.designManager2 ?? "",
    designManager2Date: row.designManager2Date ?? "",

    daipaKacho3: row.daipaKacho3 ?? "",
    daipaKacho3Date: row.daipaKacho3Date ?? "",

    gyomukaConfirmUser: row.gyomukaConfirmUser ?? "",
    confirmDate: row.confirmDate ?? "",
  };
}

export async function fetchProposals(
  params: FetchProposalsParams
): Promise<PagedResponse<ProposalRow>> {
  const result = await formApi.list({
    salesOffice: params.salesOffice,
    page: params.page,
    size: params.size,
    sortKey: params.sortKey,
    sortDir: params.sortDir,
    filters: params.filters,
  });
  return {
    rows: (result.rows ?? []).map(toProposalRow),
    totalCount: result.totalCount ?? 0,
    page: result.page ?? params.page,
    hasMore: !!result.hasMore,
  };
}

export async function fetchProposalColumnValues(
  salesOffice: string,
  column: string
): Promise<string[]> {
  const result = await formApi.columnValues({ salesOffice, column });
  return result.values ?? [];
}
