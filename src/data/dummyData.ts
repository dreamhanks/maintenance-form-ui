import { ProposalRow, SalesOfficeOption, JuchuRow, JuchuStatus, ShichuRow, KeiyakuRow } from "../types";

export const salesOfficeOptions: SalesOfficeOption[] = [
  { label: "名古屋", value: "名古屋" },
  { label: "東京", value: "東京" },
  { label: "大阪", value: "大阪" },
  { label: "福岡", value: "福岡" },
  { label: "横浜", value: "横浜" },
];

export const statusOptions = [
  "すべて",
  "大パ担当",
  "大パ課長",
  "メンテ管理職",
  "設計管理職",
  "管理担当",
  "管理課長",
  "確認完了",
];

const ownerNames = [
  "山田 太郎",
  "鈴木 花子",
  "佐藤 一郎",
  "高橋 美咲",
  "伊藤 健",
  "渡辺 真由",
  "中村 翔",
  "小林 愛",
  "加藤 大輔",
  "吉田 菜々",
  "山本 直樹",
  "松本 優子",
  "井上 恒一",
  "田中 真理",
  "石川 健太",
  "長谷川 愛子",
];

const buildingNames = [
  "名古屋中央ビル",
  "栄レジデンス",
  "名駅マンション",
  "金山ハイツ",
  "大曽根タワー",
  "千種アパート",
  "伏見レジデンス",
  "丸の内オフィス",
  "新宿ガーデン",
  "梅田スクエア",
  "博多コート",
  "横浜ベイサイド",
  "豊洲タワー",
  "天神レジデンス",
];

const people = [
  "上村 大樹",
  "山田 太郎",
  "山田 五郎",
  "山田 芝之助",
  "田中 一郎",
  "高橋 次郎",
  "井上 三郎",
  "中村 四郎",
  "松本 五郎",
  "伊藤 六郎",
  "田中 花子",
  "小川 健太",
  "佐々木 優",
  "清水 恒一",
];

function pad(num: number, size = 2) {
  return String(num).padStart(size, "0");
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function makeDate(seed: number) {
  const month = (seed % 12) + 1;
  const day = (seed % 27) + 1;
  return `2026/${pad(month)}/${pad(day)}`;
}

function makeCode(index: number) {
  return `91${pad((index % 900) + 100, 4)}-${pad((index % 900) + 1, 3)}-${pad((index % 30) + 1, 2)}`;
}

/**
 * step:
 * 1: 大パ担当
 * 2: 大パ課長
 * 3: メンテ管理職(左)
 * 4: 設計管理職(左)
 * 5: 管理担当
 * 6: 管理課長
 * 7: メンテ管理職(右)
 * 8: 設計管理職(右)
 * 9: 業務課確認者
 */
function createStepFlow(index: number) {
  const step = index % 10;
  const currentStep = step === 0 ? 9 : step;

  const p1 = pick(people, index + 1);
  const p2 = pick(people, index + 2);
  const p3 = pick(people, index + 3);
  const p4 = pick(people, index + 4);
  const p5 = pick(people, index + 5);
  const p6 = pick(people, index + 6);
  const p7 = pick(people, index + 7);
  const p8 = pick(people, index + 8);
  const p9 = pick(people, index + 9);

  return {
    status:
      currentStep >= 9
        ? "確認完了"
        : currentStep === 8
        ? "設計管理職"
        : currentStep === 7
        ? "メンテ管理職"
        : currentStep === 6
        ? "管理課長"
        : currentStep === 5
        ? "管理担当"
        : currentStep === 4
        ? "設計管理職"
        : currentStep === 3
        ? "メンテ管理職"
        : currentStep === 2
        ? "大パ課長"
        : "大パ担当",

    daipaTanto: currentStep >= 1 ? p1 : "",
    daipaTantoDate: currentStep >= 1 ? makeDate(index + 1) : "",

    daipaKacho: currentStep >= 2 ? p2 : "",
    daipaKachoDate: currentStep >= 2 ? makeDate(index + 2) : "",

    maintenanceManager1: currentStep >= 3 ? p3 : "",
    maintenanceManager1Date: currentStep >= 3 ? makeDate(index + 3) : "",

    designManager1: currentStep >= 4 ? p4 : "",
    designManager1Date: currentStep >= 4 ? makeDate(index + 4) : "",

    kanriTanto: currentStep >= 5 ? p5 : "",
    kanriTantoDate: currentStep >= 5 ? makeDate(index + 5) : "",

    kanriKacho: currentStep >= 6 ? p6 : "",
    kanriKachoDate: currentStep >= 6 ? makeDate(index + 6) : "",

    maintenanceManager2: currentStep >= 7 ? p7 : "",
    maintenanceManager2Date: currentStep >= 7 ? makeDate(index + 7) : "",

    designManager2: currentStep >= 8 ? p8 : "",
    designManager2Date: currentStep >= 8 ? makeDate(index + 8) : "",

    daipaKacho3: "",
    daipaKacho3Date: "",

    gyomukaConfirmUser: currentStep >= 9 ? p9 : "",
    confirmDate: currentStep >= 9 ? makeDate(index + 9) : "",
  };
}

function createRow(index: number, salesOffice: string): ProposalRow {
  const flow = createStepFlow(index);

  return {
    id: makeCode(index),
    propertyCode: makeCode(index),
    propertyCode2: "",
    propertyCode3: "",
    propertyCodeDisplay: makeCode(index),
    ownerName: pick(ownerNames, index),
    buildingName: pick(buildingNames, index + 2),
    salesOffice,
    status: flow.status,

    daipaTanto: flow.daipaTanto,
    daipaTantoDate: flow.daipaTantoDate,

    daipaKacho: flow.daipaKacho,
    daipaKachoDate: flow.daipaKachoDate,

    maintenanceManager1: flow.maintenanceManager1,
    maintenanceManager1Date: flow.maintenanceManager1Date,

    designManager1: flow.designManager1,
    designManager1Date: flow.designManager1Date,

    kanriTanto: flow.kanriTanto,
    kanriTantoDate: flow.kanriTantoDate,

    kanriKacho: flow.kanriKacho,
    kanriKachoDate: flow.kanriKachoDate,

    maintenanceManager2: flow.maintenanceManager2,
    maintenanceManager2Date: flow.maintenanceManager2Date,

    designManager2: flow.designManager2,
    designManager2Date: flow.designManager2Date,

    daipaKacho3: flow.daipaKacho3,
    daipaKacho3Date: flow.daipaKacho3Date,

    gyomukaConfirmUser: flow.gyomukaConfirmUser,
    confirmDate: flow.confirmDate,
  };
}

export const proposalDummyData: ProposalRow[] = [
  ...Array.from({ length: 80 }, (_, i) => createRow(i + 1, "名古屋")),
  ...Array.from({ length: 35 }, (_, i) => createRow(i + 101, "東京")),
  ...Array.from({ length: 28 }, (_, i) => createRow(i + 201, "大阪")),
  ...Array.from({ length: 22 }, (_, i) => createRow(i + 301, "福岡")),
  ...Array.from({ length: 18 }, (_, i) => createRow(i + 401, "横浜")),
];

export const statusJuchuOptions: Array<"すべて" | JuchuStatus> = [
  "すべて",
  "未契約",
  "契約",
  "失注",
  "保留",
];

const juchuOwnerNames = [
  "山田 太郎",
  "鈴木 花子",
  "佐藤 一郎",
  "高橋 美咲",
  "伊藤 健",
  "渡辺 真由",
  "中村 翔",
  "小林 愛",
  "加藤 大輔",
  "吉田 菜々",
  "山本 直樹",
  "松本 優子",
  "井上 恒一",
  "田中 真理",
  "石川 健太",
  "長谷川 愛子",
];

const juchuBuildingNames = [
  "名古屋中央ビル",
  "栄レジデンス",
  "名駅マンション",
  "金山ハイツ",
  "大曽根タワー",
  "千種アパート",
  "伏見レジデンス",
  "丸の内オフィス",
  "新宿ガーデン",
  "梅田スクエア",
  "博多コート",
  "横浜ベイサイド",
  "豊洲タワー",
  "天神レジデンス",
];

const juchuPeople = [
  "上村 大樹",
  "山田 太郎",
  "山田 五郎",
  "山田 芝之助",
  "田中 一郎",
  "高橋 次郎",
  "井上 三郎",
  "中村 四郎",
  "松本 五郎",
  "伊藤 六郎",
];

function makeStatus(index: number): JuchuStatus {
  if (index % 11 === 0) return "契約";
  if (index % 7 === 0) return "失注";
  if (index % 5 === 0) return "保留";
  return "未契約";
}

function createJuchuRow(index: number, salesOffice: string): JuchuRow {
  return {
    id: makeCode(index),
    ownerName: pick(juchuOwnerNames, index),
    buildingName: pick(juchuBuildingNames, index + 3),
    salesOffice,
    status: makeStatus(index),
    daipaTanto: pick(juchuPeople, index + 2),
  };
}

export const juchuDummyData: JuchuRow[] = [
  ...Array.from({ length: 80 }, (_, i) => createJuchuRow(i + 1, "名古屋")),
  ...Array.from({ length: 30 }, (_, i) => createJuchuRow(i + 101, "東京")),
  ...Array.from({ length: 25 }, (_, i) => createJuchuRow(i + 201, "大阪")),
  ...Array.from({ length: 18 }, (_, i) => createJuchuRow(i + 301, "福岡")),
  ...Array.from({ length: 15 }, (_, i) => createJuchuRow(i + 401, "横浜")),
];


const shichuOwnerNames = [
  "山田 太郎",
  "鈴木 花子",
  "佐藤 一郎",
  "高橋 美咲",
  "伊藤 健",
  "渡辺 真由",
  "中村 翔",
  "小林 愛",
  "加藤 大輔",
  "吉田 菜々",
  "山本 直樹",
  "松本 優子",
  "井上 恒一",
  "田中 真理",
  "石川 健太",
  "長谷川 愛子",
];

const shichuBuildingNames = [
  "名古屋中央ビル",
  "栄レジデンス",
  "名駅マンション",
  "金山ハイツ",
  "大曽根タワー",
  "千種アパート",
  "伏見レジデンス",
  "丸の内オフィス",
  "新宿ガーデン",
  "梅田スクエア",
  "博多コート",
  "横浜ベイサイド",
  "豊洲タワー",
  "天神レジデンス",
];


function makeLostDate(seed: number) {
  const month = (seed % 12) + 1;
  const day = (seed % 27) + 1;
  return `2026-${pad(month)}-${pad(day)}`;
}

function shichuCreateRow(index: number, salesOffice: string): ShichuRow {
  return {
    id: makeCode(index),
    ownerName: pick(shichuOwnerNames, index),
    buildingName: pick(shichuBuildingNames, index + 2),
    salesOffice,
    lostDate: index % 4 === 0 ? "" : makeLostDate(index + 10),
  };
}

export const shichuDummyData: ShichuRow[] = [
  ...Array.from({ length: 70 }, (_, i) => shichuCreateRow(i + 1, "名古屋")),
  ...Array.from({ length: 28 }, (_, i) => shichuCreateRow(i + 101, "東京")),
  ...Array.from({ length: 22 }, (_, i) => shichuCreateRow(i + 201, "大阪")),
  ...Array.from({ length: 16 }, (_, i) => shichuCreateRow(i + 301, "福岡")),
  ...Array.from({ length: 14 }, (_, i) => shichuCreateRow(i + 401, "横浜")),
];


const keiyakuOwnerNames = [
  "山田 太郎",
  "鈴木 花子",
  "佐藤 一郎",
  "高橋 美咲",
  "伊藤 健",
  "渡辺 真由",
  "中村 翔",
  "小林 愛",
  "加藤 大輔",
  "吉田 菜々",
  "山本 直樹",
  "松本 優子",
  "井上 恒一",
  "田中 真理",
  "石川 健太",
  "長谷川 愛子",
];

const keiyakuBuildingNames = [
  "名古屋中央ビル",
  "栄レジデンス",
  "名駅マンション",
  "金山ハイツ",
  "大曽根タワー",
  "千種アパート",
  "伏見レジデンス",
  "丸の内オフィス",
  "新宿ガーデン",
  "梅田スクエア",
  "博多コート",
  "横浜ベイサイド",
  "豊洲タワー",
  "天神レジデンス",
];

function makeContractDate(seed: number) {
  const month = (seed % 12) + 1;
  const day = (seed % 27) + 1;
  return `2026-${pad(month)}-${pad(day)}`;
}

function createRowKeiyaku(index: number, salesOffice: string): KeiyakuRow {
  return {
    id: makeCode(index),
    ownerName: pick(keiyakuOwnerNames, index),
    buildingName: pick(keiyakuBuildingNames, index + 2),
    salesOffice,
    contractDate: makeContractDate(index + 20),
  };
}

export const keiyakuDummyData: KeiyakuRow[] = [
  ...Array.from({ length: 72 }, (_, i) => createRowKeiyaku(i + 1, "名古屋")),
  ...Array.from({ length: 32 }, (_, i) => createRowKeiyaku(i + 101, "東京")),
  ...Array.from({ length: 24 }, (_, i) => createRowKeiyaku(i + 201, "大阪")),
  ...Array.from({ length: 18 }, (_, i) => createRowKeiyaku(i + 301, "福岡")),
  ...Array.from({ length: 14 }, (_, i) => createRowKeiyaku(i + 401, "横浜")),
];

