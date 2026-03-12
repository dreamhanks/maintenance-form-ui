import { proposalDummyData } from "../data/dummyData";
import { ProposalRow, ProposalSearchParams } from "../types";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchProposals(
  params: ProposalSearchParams
): Promise<ProposalRow[]> {
  await wait(300);

  const keyword = (params.keyword ?? "").trim().toLowerCase();
  const status = params.status ?? "すべて";

  return proposalDummyData.filter((row) => {
    const matchOffice = params.salesOffice
      ? row.salesOffice === params.salesOffice
      : true;

    const matchKeyword =
      keyword.length === 0
        ? true
        : row.id.toLowerCase().includes(keyword) ||
          row.ownerName.toLowerCase().includes(keyword) ||
          row.buildingName.toLowerCase().includes(keyword);

    const matchStatus = status === "すべて" ? true : row.status === status;

    return matchOffice && matchKeyword && matchStatus;
  });
}