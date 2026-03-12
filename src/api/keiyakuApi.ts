import { keiyakuDummyData } from "../data/dummyData";
import { KeiyakuRow, KeiyakuSearchParams } from "../types";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchKeiyakuRows(
  params: KeiyakuSearchParams
): Promise<KeiyakuRow[]> {
  await wait(250);

  const keyword = (params.keyword ?? "").trim().toLowerCase();

  return keiyakuDummyData.filter((row) => {
    const matchOffice = params.salesOffice
      ? row.salesOffice === params.salesOffice
      : true;

    const matchKeyword =
      keyword.length === 0
        ? true
        : row.id.toLowerCase().includes(keyword) ||
          row.ownerName.toLowerCase().includes(keyword) ||
          row.buildingName.toLowerCase().includes(keyword);

    return matchOffice && matchKeyword;
  });
}