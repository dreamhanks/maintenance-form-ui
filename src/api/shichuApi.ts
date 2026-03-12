import { shichuDummyData } from "../data/dummyData";
import { ShichuRow, ShichuSearchParams } from "../types";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchShichuRows(
  params: ShichuSearchParams
): Promise<ShichuRow[]> {
  await wait(250);

  const keyword = (params.keyword ?? "").trim().toLowerCase();

  return shichuDummyData.filter((row) => {
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