import { juchuDummyData } from "../data/dummyData";
import { JuchuRow, JuchuSearchParams } from "../types";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchJuchuRows(
  params: JuchuSearchParams
): Promise<JuchuRow[]> {
  await wait(250);

  const keyword = (params.keyword ?? "").trim().toLowerCase();
  const status = params.status ?? "すべて";

  return juchuDummyData.filter((row) => {
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