import { formApi } from "../form/api";
import { ProposalRow, ProposalSearchParams } from "../types";

export async function fetchProposals(
  params: ProposalSearchParams
): Promise<ProposalRow[]> {
  const data = await formApi.list({
    salesOffice: params.salesOffice,
    keyword: params.keyword,
    status: params.status === "すべて" ? undefined : params.status,
  });

  return data.map((row: any) => ({
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

    gyomukaConfirmUser: row.gyomukaConfirmUser ?? "",
    confirmDate: row.confirmDate ?? "",
  }));
}