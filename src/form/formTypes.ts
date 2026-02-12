// src/form/formTypes.ts
export type FileMeta = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

export const fileToMeta = (f: File): FileMeta => ({
  name: f.name,
  size: f.size,
  type: f.type,
  lastModified: f.lastModified,
});

export type DateYMD = { y: string; m: string; d: string };

export type PropertyOverviewForm = {
  furigana: string;
  customerName: string;

  building: {
    address: string;
    propertyCode: string;
    buildingName: string;
    completionYm: string;
    branchName: string;
    renovationHistory: string;
  };

  renovationContent: string;

  requests: {
    owner: { has: "0" | "1" | ""; note: string };
    resident: { has: "0" | "1" | ""; note: string };
    neighbors: { has: "0" | "1" | ""; note: string };
  };

  vendor: {
    plannedVendorName: string;
    confirmed: { mode: "0" | "1" | ""; name: string };
  };

  schedule: {
    proposal: DateYMD;
    contract: DateYMD;
    start: DateYMD;
  };
};

export type KasetsuForm = {
  // section checkboxes
  section_kasetsu: boolean;
  section_ashiba: boolean;
  section_bouhan: boolean;
  section_yosan: boolean;

  // 現場指示事項
  genba_shiji: string;

  // 仮設: need/ans + underline notes + betsuto
  kasetsu_betsuto: string;

  kasetsu_intrusion_need: "0" | "1" | "";
  kasetsu_intrusion_need_note: string;
  kasetsu_intrusion_ans: "1" | "2" | "3" | "";
  kasetsu_intrusion_ans_note: string;

  kasetsu_denki_need: "0" | "1" | "";
  kasetsu_denki_need_note: string;
  kasetsu_denki_ans: "1" | "2" | "";
  kasetsu_denki_ans_note: string;

  kasetsu_suido_need: "0" | "1" | "";
  kasetsu_suido_need_note: string;
  kasetsu_suido_ans: "1" | "2" | "";
  kasetsu_suido_ans_note: string;

  kasetsu_toilet_need: "0" | "1" | "";
  kasetsu_toilet_need_note: string;
  kasetsu_toilet_ans: "1" | "2" | "";
  kasetsu_toilet_ans_note: string;

  kasetsu_densen_need: "0" | "1" | "";
  kasetsu_densen_need_note: string;
  kasetsu_densen_ans: "1" | "2" | "";
  kasetsu_densen_ans_note: string;

  kasetsu_parking_need: "0" | "1" | "";
  kasetsu_parking_need_dai: string; // 「台」
  kasetsu_parking_ans: "1" | "2" | "3" | "";
  kasetsu_parking_ans_note: string;

  // 足場
  ashiba_betsuto: string;

  ashiba_setchi_need: "1" | "2" | "";
  ashiba_partialFile: File | null;

  ashiba_setchi_ans: "1" | "2" | "3" | "";
  ashiba_setchi_ans_note: string;

  ashiba_todokede_need: "0" | "1" | "";
  ashiba_todokede_need_note: string;
  ashiba_todokede_ans: "1" | "2" | "";
  ashiba_todokede_ans_note: string;

  ashiba_kyoukai_need: "0" | "1" | "";
  ashiba_kyoukai_need_note: string;
  ashiba_kyoukai_ans: "1" | "2" | "";
  ashiba_kyoukai_ans_note: string;

  ashiba_te_suri_need: "1" | "2" | "3" | "4" | "";
  ashiba_te_suri_need_note: string; // value=4 の (   )
  ashiba_te_suri_ans: "1" | "2" | "3" | "4" | "";
  ashiba_te_suri_ans_note: string;

  ashiba_hisan_need: "0" | "1" | "";
  ashiba_hisan_need_note: string;
  ashiba_hisan_ans: "1" | "2" | "";
  ashiba_hisan_ans_note: string;

  // 防犯
  bouhan_need: "1" | "2" | "";
  bouhan_ans: "1" | "2" | "3" | "";
  bouhan_ans_note: string;

  // 予算
  yosan_sanpai_need: "1" | "";
  yosan_sanpai_ans: "1" | "2" | "";
  yosan_sanpai_ans_note: string;

  yosan_niaage_need: "0" | "1" | "";
  yosan_niaage_need_note: string;
  yosan_niaage_ans: "1" | "2" | "";
  yosan_niaage_ans_note: string;
};

// ---- Todokede/Chosa/Kakunin ----
export type TodokedeChosaForm = {
  grp_todokede: boolean;
  grp_chosa: boolean;
  grp_kakunin: boolean;

  // 届出
  road_use: "1" | "2" | "";
  road_use_ans: "1" | "2" | "";
  road_use_other: string;

  asbestos_need: "0" | "1" | "";
  asbestos_need_note: string;
  asbestos_ans: "1" | "2" | "";
  asbestos_other: string;

  keikan_need: "0" | "1" | "";
  keikan_need_note: string;
  keikan_ans: "1" | "2" | "";
  keikan_other: string;

  // 調査
  dashin_left: "1" | "2" | "3" | "";
  dashin_left_other: string;
  dashin_ans: "1" | "2" | "3" | "";
  dashin_ans_other: string;

  chosa_asb: "0" | "1" | "";
  chosa_asb_ans: "1" | "2" | "";
  chosa_asb_other: string;

  shitaji: "0" | "1" | "";
  shitaji_note: string;
  shitaji_ans: "1" | "2" | "";
  shitaji_other: string;

  // 確認
  hozon: "0" | "1" | "";
  hozon_note: string;
  hozon_ans: "1" | "2" | "";
  hozon_place: string;

  sekou_kyoka: "0" | "1" | "";
  sekou_kyoka_note: string;
  sekou_kyoka_ans: "1" | "2" | "";
  sekou_kyoka_other: string;

  shiten_kyoka: "1" | "2" | "";
  shiten_kyoka_note: string;
  shiten_kyoka_ans: "1" | "2" | "";
  shiten_kyoka_other: string;

  kaden: "1" | "2" | "";
  kaden_ans: "1" | "2" | "";
  kaden_other: string;

  furon: "1" | "2" | "";
  furon_ans: "1" | "2" | "";
  furon_other: string;

  bousui: "0" | "1" | "";
  bousui_note: string;
  bousui_ans: "1" | "2" | "";
  bousui_years: string;
  bousui_other: string;

  genba_shiji: string;

  sekkei: "0" | "1" | "";
  sekkei_comment: string;
};

// ---- Tenpu (your id system: pre_site_plan etc) ----
export type TenpuForm = {
  checkedMap: Record<string, boolean>;
  fileMap: Record<string, File | null>;
  textMap: Record<string, string>; // for "その他：" text inputs
};

export type FullForm = {
  property: PropertyOverviewForm;
  kasetsu: KasetsuForm;
  todokede: TodokedeChosaForm;
  tenpu: TenpuForm;
};

export const initialForm: FullForm = {
  property: {
    furigana: "",
    customerName: "",
    building: {
      address: "",
      propertyCode: "",
      buildingName: "",
      completionYm: "",
      branchName: "",
      renovationHistory: "",
    },
    renovationContent: "",
    requests: {
      owner: { has: "", note: "" },
      resident: { has: "", note: "" },
      neighbors: { has: "", note: "" },
    },
    vendor: {
      plannedVendorName: "",
      confirmed: { mode: "", name: "" },
    },
    schedule: {
      proposal: { y: "", m: "", d: "" },
      contract: { y: "", m: "", d: "" },
      start: { y: "", m: "", d: "" },
    },
  },

  kasetsu: {
    section_kasetsu: false,
    section_ashiba: false,
    section_bouhan: false,
    section_yosan: false,

    genba_shiji: "",
    kasetsu_betsuto: "",

    kasetsu_intrusion_need: "",
    kasetsu_intrusion_need_note: "",
    kasetsu_intrusion_ans: "",
    kasetsu_intrusion_ans_note: "",

    kasetsu_denki_need: "",
    kasetsu_denki_need_note: "",
    kasetsu_denki_ans: "",
    kasetsu_denki_ans_note: "",

    kasetsu_suido_need: "",
    kasetsu_suido_need_note: "",
    kasetsu_suido_ans: "",
    kasetsu_suido_ans_note: "",

    kasetsu_toilet_need: "",
    kasetsu_toilet_need_note: "",
    kasetsu_toilet_ans: "",
    kasetsu_toilet_ans_note: "",

    kasetsu_densen_need: "",
    kasetsu_densen_need_note: "",
    kasetsu_densen_ans: "",
    kasetsu_densen_ans_note: "",

    kasetsu_parking_need: "",
    kasetsu_parking_need_dai: "",
    kasetsu_parking_ans: "",
    kasetsu_parking_ans_note: "",

    ashiba_betsuto: "",
    ashiba_setchi_need: "",
    ashiba_partialFile: null,

    ashiba_setchi_ans: "",
    ashiba_setchi_ans_note: "",

    ashiba_todokede_need: "",
    ashiba_todokede_need_note: "",
    ashiba_todokede_ans: "",
    ashiba_todokede_ans_note: "",

    ashiba_kyoukai_need: "",
    ashiba_kyoukai_need_note: "",
    ashiba_kyoukai_ans: "",
    ashiba_kyoukai_ans_note: "",

    ashiba_te_suri_need: "",
    ashiba_te_suri_need_note: "",
    ashiba_te_suri_ans: "",
    ashiba_te_suri_ans_note: "",

    ashiba_hisan_need: "",
    ashiba_hisan_need_note: "",
    ashiba_hisan_ans: "",
    ashiba_hisan_ans_note: "",

    bouhan_need: "",
    bouhan_ans: "",
    bouhan_ans_note: "",

    yosan_sanpai_need: "",
    yosan_sanpai_ans: "",
    yosan_sanpai_ans_note: "",

    yosan_niaage_need: "",
    yosan_niaage_need_note: "",
    yosan_niaage_ans: "",
    yosan_niaage_ans_note: "",
  },

  todokede: {
    grp_todokede: false,
    grp_chosa: false,
    grp_kakunin: false,

    road_use: "",
    road_use_ans: "",
    road_use_other: "",

    asbestos_need: "",
    asbestos_need_note: "",
    asbestos_ans: "",
    asbestos_other: "",

    keikan_need: "",
    keikan_need_note: "",
    keikan_ans: "",
    keikan_other: "",

    dashin_left: "",
    dashin_left_other: "",
    dashin_ans: "",
    dashin_ans_other: "",

    chosa_asb: "",
    chosa_asb_ans: "",
    chosa_asb_other: "",

    shitaji: "",
    shitaji_note: "",
    shitaji_ans: "",
    shitaji_other: "",

    hozon: "",
    hozon_note: "",
    hozon_ans: "",
    hozon_place: "",

    sekou_kyoka: "",
    sekou_kyoka_note: "",
    sekou_kyoka_ans: "",
    sekou_kyoka_other: "",

    shiten_kyoka: "",
    shiten_kyoka_note: "",
    shiten_kyoka_ans: "",
    shiten_kyoka_other: "",

    kaden: "",
    kaden_ans: "",
    kaden_other: "",

    furon: "",
    furon_ans: "",
    furon_other: "",

    bousui: "",
    bousui_note: "",
    bousui_ans: "",
    bousui_years: "",
    bousui_other: "",

    genba_shiji: "",

    sekkei: "",
    sekkei_comment: "",
  },

  tenpu: {
    checkedMap: {},
    fileMap: {},
    textMap: {}, // "pre_site_other_text" etc
  },
};

// Convert to JSON (files become metadata)
export function toJson(form: FullForm) {
  const tenpuFiles: Record<string, FileMeta | null> = {};
  for (const [k, f] of Object.entries(form.tenpu.fileMap)) {
    tenpuFiles[k] = f ? fileToMeta(f) : null;
  }

  return {
    property: form.property,
    kasetsu: {
      ...form.kasetsu,
      ashiba_partialFile: form.kasetsu.ashiba_partialFile
        ? fileToMeta(form.kasetsu.ashiba_partialFile)
        : null,
    },
    todokede: form.todokede,
    tenpu: {
      checkedMap: form.tenpu.checkedMap,
      fileMap: tenpuFiles,
      textMap: form.tenpu.textMap,
    },
    submittedAt: new Date().toISOString(),
  };
}
