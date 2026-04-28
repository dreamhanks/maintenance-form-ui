export type ProposalRow = {
  id: string;
  propertyCode: string;
  propertyCode2: string;
  propertyCode3: string;
  propertyCodeDisplay: string;
  ownerName: string;
  buildingName: string;
  salesOffice: string;
  status: string;

  daipaTanto: string;
  daipaTantoDate: string;

  daipaKacho: string;
  daipaKachoDate: string;

  maintenanceManager1: string;
  maintenanceManager1Date: string;

  designManager1: string;
  designManager1Date: string;

  kanriTanto: string;
  kanriTantoDate: string;

  kanriKacho: string;
  kanriKachoDate: string;

  maintenanceManager2: string;
  maintenanceManager2Date: string;

  designManager2: string;
  designManager2Date: string;

  daipaKacho3: string;
  daipaKacho3Date: string;

  gyomukaConfirmUser: string;
  confirmDate: string;
};

export type SalesOfficeOption = {
  label: string;
  value: string;
};

export type PagedResponse<T> = {
  rows: T[];
  totalCount: number;
  page: number;
  hasMore: boolean;
};

export type ListQueryParams = {
  salesOffice: string;
  page: number;
  size: number;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  filters: Record<string, string[]>;
};

export type JuchuStatus = "未契約" | "契約" | "失注" | "保留";

export type JuchuRow = {
  id: string; // OrderJudgment.id (used for selection)
  formId: string; // form_records.id (used for navigation to /form/:id)
  propertyCodeDisplay: string; // 物件CD
  ownerName: string; // お施主様名
  buildingName: string; // 建物名称
  salesOffice: string; // 営業所
  status: JuchuStatus; // ステータス
  daipaTanto: string; // 大パ担当
};

export type ContractConfirmRequest = {
  ids: string[];
  contractDate: string; // yyyy-MM-dd
};


export type ShichuRow = {
  id: string; // OrderJudgment.id (used for selection)
  formId: string; // form_records.id (used for navigation to /form/:id)
  propertyCodeDisplay: string; // 物件CD
  ownerName: string; // お施主様名
  buildingName: string; // 建物名称
  salesOffice: string; // 営業所
  lostDate: string; // 失注日
};

export type KeiyakuRow = {
  id: string; // OrderJudgment.id
  formId: string; // form_records.id (used for navigation to /form/:id)
  propertyCodeDisplay: string; // 物件CD
  ownerName: string;
  buildingName: string;
  salesOffice: string;
  contractDate: string;
};










