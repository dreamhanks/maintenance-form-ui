import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { mitsumoriApi, workflowApi, type WorkflowStepDto } from "../form/api";
import { useAuth } from "../auth/AuthContext";
import DatePicker, { registerLocale } from "react-datepicker";

const API_BASE = "http://localhost:8080";
import { ja } from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ja", ja);

type RequestForm = {
  topAtena: string;
  topTantosha: string;
  mitsumoriIraiNaiyo: string;
  mitsumoriIraiNaiyo2: string;
  mitsumoriIraiNaiyo3: string;
  mitsumoriIraiNaiyo4: string;
  mitsumoriIraiNaiyo5: string;
  mitsumoriIraiNaiyo6: string;

  year: string;
  month: string;
  day: string;

  companyName: string;
  requestYear: string;
  requestMonth: string;
  requestDay: string;

  zipCode: string;
  address: string;
  bushoName: string;
  tantosha: string;
  tel: string;
  email: string;

  buildingAddress: string;
  buildingName: string;
  roomNo: string;
  eigyoTeianYear: string;
  eigyoTeianMonth: string;
  eigyoTeianDay: string;
  keiyakuYear: string;
  keiyakuMonth: string;
  keiyakuDay: string;
  chakkoYear: string;
  chakkoMonth: string;
  chakkoDay: string;

  teishutsuMethod: string;
  deadlineYear: string;
  deadlineMonth: string;
  deadlineDay: string;

  kaishuBui: string;
  kojiNaiyoShosai: string;

  kouishoSagyo: "有" | "無" | "";
  kouishoShiyo: string;

  genkyoShashin: "有" | "無" | "";
  annaizu: "有" | "無" | "";
  annaizuOther: string;

  zumen: "有" | "無" | "";
  kojiBuiShashin: "有" | "無" | "";
  shashinOther: string;
};

type SpecRow = {
  no: number;
  gyomuNaiyo: string;
  suuryo: string;
  tani: string;
  shosai: string;
};

const LINES_PER_PAGE = 20;

const pageClass = "mx-auto w-[794px] bg-white text-black border border-blue-700 print:border-none";
const tdBase = "border border-black align-middle";
const blueCell = `${tdBase} bg-sky-100 text-center`;
const whiteCell = `${tdBase} bg-white text-center`;
const inputClass = "w-full bg-transparent px-1 py-0.5 text-[12px] outline-none";
const textareaClass = "w-full resize-none bg-transparent px-1 py-0.5 text-[12px] leading-[1.25] outline-none";

function createEmptyRow(no: number): SpecRow {
  return {
    no,
    gyomuNaiyo: "",
    suuryo: "",
    tani: "",
    shosai: "",
  };
}

function createRows(pageCount: number): SpecRow[] {
  return Array.from({ length: pageCount * LINES_PER_PAGE }, (_, i) =>
    createEmptyRow(i + 1)
  );
}

function createInitialRows(): SpecRow[] {
  const rows = createRows(1);

  rows[0] = {
    no: 1,
    gyomuNaiyo: "足場設置",
    suuryo: "",
    tani: "m2",
    shosai: "昇降階段　巾木　中桟　安全ブロック\n朝顔　防音シート　防音パネル",
  };
  rows[1] = {
    no: 2,
    gyomuNaiyo: "エントランス・共用部養生",
    suuryo: "",
    tani: "式",
    shosai: "柱養生　床養生",
  };
  rows[2] = {
    no: 3,
    gyomuNaiyo: "足場解体後の清掃",
    suuryo: "",
    tani: "式",
    shosai: "足場下部高圧洗浄費用",
  };
  rows[3] = {
    no: 4,
    gyomuNaiyo: "夜間照明・防犯カメラ",
    suuryo: "",
    tani: "式",
    shosai: "夜間灯　防犯カメラ　チューブライト",
  };
  rows[4] = {
    no: 5,
    gyomuNaiyo: "荷揚げ費用",
    suuryo: "",
    tani: "式",
    shosai: "レッカー　ユニック　手運び（人工）",
  };

  return rows;
}

function toPickerDate(year: string, month: string, day: string): Date | null {
  if (!year || !month || !day) return null;
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return isNaN(d.getTime()) ? null : d;
}

type YmdOnChange = {
  onYearChange: (v: string) => void;
  onMonthChange: (v: string) => void;
  onDayChange: (v: string) => void;
};

function handlePickerChange(
  d: Date | null,
  fns: YmdOnChange,
) {
  if (!d) return;
  fns.onYearChange(String(d.getFullYear()));
  fns.onMonthChange(String(d.getMonth() + 1));
  fns.onDayChange(String(d.getDate()));
}

function YmdInputGroup({
  year,
  month,
  day,
  onYearChange,
  onMonthChange,
  onDayChange,
}: {
  year: string;
  month: string;
  day: string;
} & YmdOnChange) {
  const [open, setOpen] = useState(false);
  const openPicker = () => setOpen(true);

  return (
    <div className="relative flex items-center justify-center gap-2 text-[12px]">
      <input
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        onClick={openPicker}
        readOnly
        className="w-12 border-b border-black bg-transparent text-center outline-none cursor-pointer"
      />
      <span>年</span>
      <input
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        onClick={openPicker}
        readOnly
        className="w-8 border-b border-black bg-transparent text-center outline-none cursor-pointer"
      />
      <span>月</span>
      <input
        value={day}
        onChange={(e) => onDayChange(e.target.value)}
        onClick={openPicker}
        readOnly
        className="w-8 border-b border-black bg-transparent text-center outline-none cursor-pointer"
      />
      <span>日</span>
      <div className="absolute left-0 top-0 h-0 w-0 overflow-visible">
        <DatePicker
          locale="ja"
          dateFormat="yyyy/MM/dd"
          selected={toPickerDate(year, month, day)}
          onChange={(d: Date | null) => { handlePickerChange(d, { onYearChange, onMonthChange, onDayChange }); setOpen(false); }}
          open={open}
          onClickOutside={() => setOpen(false)}
          className="absolute h-0 w-0 opacity-0 pointer-events-none"
        />
      </div>
    </div>
  );
}

function SmallYmdInputGroup({
  year,
  month,
  day,
  onYearChange,
  onMonthChange,
  onDayChange,
}: {
  year: string;
  month: string;
  day: string;
} & YmdOnChange) {
  const [open, setOpen] = useState(false);
  const openPicker = () => setOpen(true);

  return (
    <div className="relative flex items-center justify-center gap-1 text-[12px]">
      <input
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        onClick={openPicker}
        readOnly
        className="w-9 border-b border-black bg-transparent text-center outline-none cursor-pointer"
      />
      <span>年</span>
      <input
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        onClick={openPicker}
        readOnly
        className="w-5 border-b border-black bg-transparent text-center outline-none cursor-pointer"
      />
      <span>月</span>
      <input
        value={day}
        onChange={(e) => onDayChange(e.target.value)}
        onClick={openPicker}
        readOnly
        className="w-5 border-b border-black bg-transparent text-center outline-none cursor-pointer"
      />
      <span>日</span>
      <div className="absolute left-0 top-0 h-0 w-0 overflow-visible">
        <DatePicker
          locale="ja"
          dateFormat="yyyy/MM/dd"
          selected={toPickerDate(year, month, day)}
          onChange={(d: Date | null) => { handlePickerChange(d, { onYearChange, onMonthChange, onDayChange }); setOpen(false); }}
          open={open}
          onClickOutside={() => setOpen(false)}
          className="absolute h-0 w-0 opacity-0 pointer-events-none"
        />
      </div>
    </div>
  );
}

function YesNoRadio({
  value,
  onChange,
}: {
  value: "有" | "無" | "";
  onChange: (v: "有" | "無") => void;
}) {
  return (
    <>
      <td className={`${whiteCell} w-[44px]`}>
        <label className="flex cursor-pointer items-center justify-center gap-1 text-[12px]">
          <input
            type="radio"
            checked={value === "有"}
            onChange={() => onChange("有")}
          />
          <span>有</span>
        </label>
      </td>
      <td className={`${whiteCell} w-[44px]`}>
        <label className="flex cursor-pointer items-center justify-center gap-1 text-[12px]">
          <input
            type="radio"
            checked={value === "無"}
            onChange={() => onChange("無")}
          />
          <span>無</span>
        </label>
      </td>
    </>
  );
}

function SpecSheetPage({
  rows,
  pageIndex,
  updateRow,
}: {
  rows: SpecRow[];
  pageIndex: number;
  updateRow: (
    globalIndex: number,
    key: keyof Omit<SpecRow, "no">,
    value: string
  ) => void;
}) {
  return (
    <div className={`${pageClass} px-8`}>
      <div className="px-6 pt-3 pb-2 text-center text-[12px]">見積仕様書</div>

      <table className="w-full border-collapse table-fixed mb-4">
        <colgroup>
          <col className="w-[28px]" />
          <col className="w-[180px]" />
          <col className="w-[50px]" />
          <col className="w-[30px]" />
          <col />
        </colgroup>

        <thead>
          <tr className="h-[34px]">
            <th className={`${whiteCell} text-[11px] font-normal`}>項番</th>
            <th className={`${whiteCell} text-[11px] font-normal`}>業務内容</th>
            <th className={`${whiteCell} text-[11px] font-normal`}>数量</th>
            <th className={`${whiteCell} text-[11px] font-normal`}>単位</th>
            <th className={`${whiteCell} text-[11px] font-normal`}>詳細</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, localIndex) => {
            const globalIndex = pageIndex * LINES_PER_PAGE + localIndex;

            return (
              <tr key={row.no} className="h-[34px]">
                <td className={`${whiteCell} text-[11px]`}>{row.no}</td>

                <td className={tdBase}>
                  <textarea
                    value={row.gyomuNaiyo}
                    onChange={(e) =>
                      updateRow(globalIndex, "gyomuNaiyo", e.target.value)
                    }
                    className={`${textareaClass} h-[32px]`}
                  />
                </td>

                <td className={tdBase}>
                  <input
                    value={row.suuryo}
                    onChange={(e) =>
                      updateRow(globalIndex, "suuryo", e.target.value)
                    }
                    className={inputClass}
                  />
                </td>

                <td className={tdBase}>
                  <input
                    value={row.tani}
                    onChange={(e) =>
                      updateRow(globalIndex, "tani", e.target.value)
                    }
                    className={inputClass}
                  />
                </td>

                <td className={tdBase}>
                  <textarea
                    value={row.shosai}
                    onChange={(e) =>
                      updateRow(globalIndex, "shosai", e.target.value)
                    }
                    className={`${textareaClass} h-[32px]`}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function MitsumoriIraishoPage() {
  const nav = useNavigate();
  const { formRecordId: formRecordIdParam } = useParams<{ formRecordId: string }>();
  const formRecordId = formRecordIdParam ? Number(formRecordIdParam) : null;
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isInitialLoad = useRef(true);
  const [showBackDialog, setShowBackDialog] = useState(false);
  const markDirty = () => { if (!isInitialLoad.current) setIsDirty(true); };
  const [pdfBusy, setPdfBusy] = useState(false);
  const [form, setForm] = useState<RequestForm>({
    topAtena: "",
    topTantosha: "",
    mitsumoriIraiNaiyo: "",
    mitsumoriIraiNaiyo2: "",
    mitsumoriIraiNaiyo3: "",
    mitsumoriIraiNaiyo4: "",
    mitsumoriIraiNaiyo5: "",
    mitsumoriIraiNaiyo6: "",

    year: "",
    month: "",
    day: "",

    companyName: "大東建託株式会社",
    requestYear: "",
    requestMonth: "",
    requestDay: "",

    zipCode: "",
    address: "",
    bushoName: "",
    tantosha: "",
    tel: "",
    email: "",

    buildingAddress: "",
    buildingName: "",
    roomNo: "",
    eigyoTeianYear: "",
    eigyoTeianMonth: "",
    eigyoTeianDay: "",
    keiyakuYear: "",
    keiyakuMonth: "",
    keiyakuDay: "",
    chakkoYear: "",
    chakkoMonth: "",
    chakkoDay: "",

    teishutsuMethod: "",
    deadlineYear: "",
    deadlineMonth: "",
    deadlineDay: "",

    kaishuBui: "",
    kojiNaiyoShosai: "",

    kouishoSagyo: "",
    kouishoShiyo: "",

    genkyoShashin: "",
    annaizu: "",
    annaizuOther: "",

    zumen: "",
    kojiBuiShashin: "",
    shashinOther: "",
  });

  const [specRows, setSpecRows] = useState<SpecRow[]>(createInitialRows());

  const { user } = useAuth();
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStepDto[]>([]);
  const [workflowLoading, setWorkflowLoading] = useState<boolean>(!!formRecordId);
  const pendingStep = workflowSteps.find((s) => s.status === "pending");
  const isEditableRaw =
    !formRecordId ||
    user?.role === "admin" ||
    (!!pendingStep && user?.role === pendingStep.stepName);
  // While loading on a saved form, treat as not-editable but suppress the banner
  // so non-matching users don't see a flicker before the workflow arrives.
  const isEditable = workflowLoading ? false : isEditableRaw;
  const readOnlyNotice = !workflowLoading && !isEditable && pendingStep
    ? `現在 ${pendingStep.stepLabel} が確認中です。編集できません。`
    : null;

  useEffect(() => {
    if (!formRecordId) {
      setWorkflowLoading(false);
      return;
    }
    setWorkflowLoading(true);
    workflowApi.get(formRecordId)
      .then(setWorkflowSteps)
      .catch(() => {})
      .finally(() => setWorkflowLoading(false));
  }, [formRecordId]);

  const specPages = useMemo(() => {
    const pageCount = Math.ceil(specRows.length / LINES_PER_PAGE);
    return Array.from({ length: pageCount }, (_, pageIndex) =>
      specRows.slice(
        pageIndex * LINES_PER_PAGE,
        pageIndex * LINES_PER_PAGE + LINES_PER_PAGE
      )
    );
  }, [specRows]);

  const updateForm = <K extends keyof RequestForm>(
    key: K,
    value: RequestForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    markDirty();
  };

  const updateSpecRow = (
    index: number,
    key: keyof Omit<SpecRow, "no">,
    value: string
  ) => {
    setSpecRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
    markDirty();
  };

  const handleAddPage = () => {
    markDirty();
    setSpecRows((prev) => {
      const nextRows = [...prev];
      const currentCount = prev.length;
      const nextStartNo = currentCount + 1;

      for (let i = 0; i < LINES_PER_PAGE; i += 1) {
        nextRows.push(createEmptyRow(nextStartNo + i));
      }

      return nextRows;
    });
  };

  const handleDeleteLastPage = () => {
    if (specRows.length <= LINES_PER_PAGE) return;
    setSpecRows((prev) => prev.slice(0, prev.length - LINES_PER_PAGE));
    markDirty();
  };

  const handleExportPdf = async () => {
    if (!formRecordId) {
      toast.warning("先にフォームを保存してください");
      return;
    }
    if (pdfBusy) return;

    setPdfBusy(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/pdf/generate-mitsumori/${formRecordId}`,
        { method: "POST", credentials: "include" },
      );
      if (res.status === 401 || res.status === 403) { window.location.href = "/login"; return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("PDF出力が完了しました");
    } catch {
      toast.error("PDF出力に失敗しました");
    } finally {
      setPdfBusy(false);
    }
  };

  // Scroll to top on mount so the page always opens at the first page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load saved form_data from backend on mount
  useEffect(() => {
    if (!formRecordId) return;
    let cancelled = false;
    mitsumoriApi.get(formRecordId)
      .then((dto) => {
        if (cancelled || !dto) return;
        const d = dto.formData ?? {};
        if (d.form && typeof d.form === "object") {
          setForm((prev) => ({ ...prev, ...(d.form as Partial<RequestForm>) }));
        }
        if (Array.isArray(d.specRows) && d.specRows.length > 0) {
          setSpecRows(d.specRows as SpecRow[]);
        }

        // ALWAYS re-sync auto-populated rows (足場設置 row 0 and 飛散防止 row)
        // from the latest Eizen form data on every page load — regardless of any
        // saved specRows. Other rows (エントランス, 足場解体後の清掃, etc.) are
        // never touched.
        fetch(`${API_BASE}/api/forms/${formRecordId}/eizen-data`, { credentials: "include" })
          .then((r) => {
            if (r.status === 401 || r.status === 403) { window.location.href = "/login"; return null; }
            return r.ok ? r.json() : null;
          })
          .then((eizen: any) => {
            if (cancelled) return;
            const e = eizen ?? {};

            // ALWAYS overwrite 住所 / 建物名称 / 営繕提案予定日 / 契約予定日 /
            // 着工予定日 from the latest Eizen form data on every page load,
            // so 見積依頼書 reflects updates made in EizenRequestAllInOnePage.
            const splitYmd = (s: any): [string, string, string] => {
              if (!s || typeof s !== "string") return ["", "", ""];
              const parts = s.split("/");
              return [parts[0] ?? "", parts[1] ?? "", parts[2] ?? ""];
            };
            const [pY, pM, pD] = splitYmd(e.proposalDate);
            const [kY, kM, kD] = splitYmd(e.contractDate);
            const [cY, cM, cD] = splitYmd(e.startDate);
            setForm((prev) => ({
              ...prev,
              buildingAddress: typeof e.address === "string" ? e.address : "",
              buildingName: typeof e.buildingName === "string" ? e.buildingName : "",
              eigyoTeianYear: pY,
              eigyoTeianMonth: pM,
              eigyoTeianDay: pD,
              keiyakuYear: kY,
              keiyakuMonth: kM,
              keiyakuDay: kD,
              chakkoYear: cY,
              chakkoMonth: cM,
              chakkoDay: cD,
            }));

            const ashibaActive = !!e.ashibaEnabled && e.ashibaSetsuchiNeed === "必要";
            let row0Gyomu = "";
            let row0Suuryo = "";
            let row0Tani = "";
            const shosaiParts: string[] = [];
            if (ashibaActive) {
              row0Gyomu = "足場設置";
              if (e.ashibaSetsuchiM2) {
                row0Suuryo = String(e.ashibaSetsuchiM2);
                row0Tani = "m2";
              }
              // 昇降階段 items first
              if (e.shoshoNeed === "必要") {
                const c = e.shoshoChecks ?? {};
                if (c.shoshodan) shosaiParts.push("昇降階段");
                if (c.habaki) shosaiParts.push("巾木");
                if (c.nakasan) shosaiParts.push("中桟");
                if (c.anzenBlock) shosaiParts.push("安全ブロック");
              }
              // 飛散防止 items appended after
              if (e.hisanNeed === "必要") {
                const c = e.hisanChecks ?? {};
                if (c.asagao) shosaiParts.push("朝顔");
                if (c.boonSheet) shosaiParts.push("防音シート");
                if (c.boonPanel) shosaiParts.push("防音パネル");
                if (c.sonotaChecked && c.sonotaText) shosaiParts.push(String(c.sonotaText));
              }
            }
            const row0Shosai = shosaiParts.join("　");

            // Row 1 — エントランス・共用部養生
            const entranceActive = !!e.ashibaEnabled && e.entranceNeed === "必要";
            let row1Gyomu = "";
            let row1Tani = "";
            let row1Shosai = "";
            if (entranceActive) {
              row1Gyomu = "エントランス・共用部養生";
              row1Tani = "式";
              const c = e.entranceChecks ?? {};
              const parts: string[] = [];
              if (c.hashiraYojo) parts.push("柱養生材");
              if (c.yukaYojo) parts.push("床養生材");
              if (c.sonotaChecked && c.sonotaText) parts.push(String(c.sonotaText));
              row1Shosai = parts.join("　");
            }

            // Row 2 — 足場解体後の清掃費用
            const cleanActive = !!e.ashibaEnabled && e.ashibaCleanNeed === "必要";
            let row2Gyomu = "";
            let row2Tani = "";
            let row2Shosai = "";
            if (cleanActive) {
              row2Gyomu = "足場解体後の清掃費用";
              row2Tani = "式";
              row2Shosai = e.ashibaCleanText ? String(e.ashibaCleanText) : "";
            }

            // Row 3 — 夜間照明・防犯カメラ (防犯 section)
            const bouhanActive = !!e.bouhanEnabled && e.bouhanNeed === "必要";
            let row3Gyomu = "";
            let row3Tani = "";
            let row3Shosai = "";
            if (bouhanActive) {
              row3Gyomu = "夜間照明・防犯カメラ";
              row3Tani = "式";
              const c = e.bouhanChecks ?? {};
              const parts: string[] = [];
              if (c.yakanTo) parts.push("夜間灯");
              if (c.bouhanCamera) parts.push("防犯カメラ");
              if (c.tubeLite) parts.push("チューブライト");
              if (c.sonotaChecked && c.sonotaText) parts.push(String(c.sonotaText));
              row3Shosai = parts.join("　");
            }

            // Row 4 — 荷揚げ費用 (予算 section)
            const niagekiActive = !!e.yosanEnabled && e.niagekiNeed === "必要";
            let row4Gyomu = "";
            let row4Tani = "";
            let row4Shosai = "";
            if (niagekiActive) {
              row4Gyomu = "荷揚げ費用";
              row4Tani = "式";
              const c = e.niagekiChecks ?? {};
              const parts: string[] = [];
              if (c.riccar) parts.push("レッカー");
              if (c.unic) parts.push("ユニック");
              if (c.tehakobi) parts.push("手運び（人工）");
              if (c.sonotaChecked && c.sonotaText) parts.push(String(c.sonotaText));
              row4Shosai = parts.join("　");
            }

            setSpecRows((prev) => {
              const next = prev.map((r) => ({ ...r }));

              // Row 0 — always overwrite with the latest 足場設置 values (or clear).
              if (next[0]) {
                next[0].gyomuNaiyo = row0Gyomu;
                next[0].suuryo = row0Suuryo;
                next[0].tani = row0Tani;
                next[0].shosai = row0Shosai;
              }

              // Row 1 — always overwrite with the latest エントランス・共用部養生 values (or clear).
              if (next[1]) {
                next[1].gyomuNaiyo = row1Gyomu;
                next[1].suuryo = "";
                next[1].tani = row1Tani;
                next[1].shosai = row1Shosai;
              }

              // Row 2 — always overwrite with the latest 足場解体後の清掃費用 values (or clear).
              if (next[2]) {
                next[2].gyomuNaiyo = row2Gyomu;
                next[2].suuryo = "";
                next[2].tani = row2Tani;
                next[2].shosai = row2Shosai;
              }

              // Row 3 — always overwrite with the latest 夜間照明・防犯カメラ values (or clear).
              if (next[3]) {
                next[3].gyomuNaiyo = row3Gyomu;
                next[3].suuryo = "";
                next[3].tani = row3Tani;
                next[3].shosai = row3Shosai;
              }

              // Row 4 — always overwrite with the latest 荷揚げ費用 values (or clear).
              if (next[4]) {
                next[4].gyomuNaiyo = row4Gyomu;
                next[4].suuryo = "";
                next[4].tani = row4Tani;
                next[4].shosai = row4Shosai;
              }

              // Clean up any leftover stand-alone 飛散防止措置 row from a prior
              // version that placed it on its own line — everything now lives
              // on row 0.
              const hisanIdx = next.findIndex(
                (r, i) => i !== 0 && r.gyomuNaiyo === "飛散防止措置",
              );
              if (hisanIdx >= 0) {
                next[hisanIdx].gyomuNaiyo = "";
                next[hisanIdx].shosai = "";
                next[hisanIdx].suuryo = "";
                next[hisanIdx].tani = "";
              }

              return next;
            });
          })
          .catch(() => { /* ignore — keep whatever was loaded */ });
      })
      .catch(() => { /* ignore — keep defaults */ })
      .finally(() => {
        if (cancelled) return;
        // Release the initial-load gate after state updates have been queued.
        setTimeout(() => {
          isInitialLoad.current = false;
          setIsDirty(false);
        }, 0);
      });
    return () => { cancelled = true; };
  }, [formRecordId]);

  // For pages opened without a formRecordId, finish init immediately
  useEffect(() => {
    if (formRecordId) return;
    isInitialLoad.current = false;
  }, [formRecordId]);

  const handleSave = async (): Promise<boolean> => {
    if (!formRecordId || saving) return false;
    setSaving(true);
    try {
      await mitsumoriApi.update(formRecordId, { form, specRows });
      setIsDirty(false);
      toast.success("保存しました");
      return true;
    } catch {
      toast.error("保存に失敗しました");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const navBack = () => nav(formRecordId ? `/form/${formRecordId}` : "/form", { replace: true });

  const handleBack = () => {
    if (!isDirty) {
      navBack();
      return;
    }
    setShowBackDialog(true);
  };

  const handleSaveAndBack = async () => {
    const ok = await handleSave();
    if (ok) {
      setShowBackDialog(false);
      navBack();
    }
  };

  return (
    <div className="form-text min-h-screen bg-neutral-200 p-4 print:bg-white print:p-0">
      {pdfBusy && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-700 font-medium">PDF出力中...しばらくお待ちください</p>
          </div>
        </div>
      )}
      <style>
        {`
          @page {
            size: A4 portrait;
            margin: 0;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .print-hidden {
              display: none !important;
            }

            .page-break {
              page-break-after: always;
            }
          }
        `}
      </style>

      <div className="mx-auto w-fit space-y-4 print:space-y-0">
        {!pdfBusy && (
        <div className="print-hidden flex justify-end gap-2 mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="rounded border border-black bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            戻る
          </button>
          <button
            type="button"
            onClick={handleAddPage}
            disabled={!isEditable}
            className={`rounded border border-black bg-white px-4 py-2 text-sm hover:bg-gray-50 ${!isEditable ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            見積仕様書 ページ追加
          </button>

          <button
            type="button"
            onClick={handleDeleteLastPage}
            disabled={!isEditable}
            className={`rounded border border-black bg-white px-4 py-2 text-sm hover:bg-gray-50 ${!isEditable ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            最終ページ削除
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isEditable || saving || !formRecordId}
            className={`rounded border border-black bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 ${!isEditable ? "cursor-not-allowed" : ""}`}
          >
            {saving ? "保存中..." : "保存"}
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!isEditable || pdfBusy || !formRecordId}
            className={`rounded border border-black bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 ${!isEditable ? "cursor-not-allowed" : ""}`}
          >
            {pdfBusy ? "出力中..." : "PDF出力"}
          </button>
        </div>
        )}

        {readOnlyNotice && (
          <div className="print-hidden rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {readOnlyNotice}
          </div>
        )}
        <fieldset disabled={!isEditable} className="contents">
        <div>
        {/* PAGE 1 */}
        <div className={`${pageClass} px-8 pt-4 pb-6`}>
          <div className="flex justify-between">
            <div className="w-[240px]">
              {/* <div className="mb-3 text-center text-[11px]">御中</div> */}
              <div className="flex items-end justify-between border-b border-black px-1 mb-4 text-[12px]">
                <input type="text" value={form.topAtena} onChange={(e) => updateForm("topAtena", e.target.value)} className="w-48 bg-transparent px-1 py-0.5 text-[12px] outline-none"/>
                <span>御中</span>
              </div>
              <div className="flex items-end justify-between border-b border-black px-1 text-[12px]">
                <span>ご担当者</span>
                <div className="flex">
                  <input type="text" value={form.topTantosha} onChange={(e) => updateForm("topTantosha", e.target.value)} className="w-36 bg-transparent px-1 text-[12px] outline-none"/>
                  <span className="text-[12px]">様</span>
                </div>
              </div>
            </div>

            <div className="w-[300px] text-right">
              <div className="mb-1 flex justify-end gap-5 pr-1 text-[12px]">
                <YmdInputGroup
                  year={form.year}
                  month={form.month}
                  day={form.day}
                  onYearChange={(v) => updateForm("year", v)}
                  onMonthChange={(v) => updateForm("month", v)}
                  onDayChange={(v) => updateForm("day", v)}
                />
              </div>
              <div className="mt-8 text-[20px] font-bold">{form.companyName}</div>
            </div>
          </div>

          <div className="mt-12 text-center text-[24px] font-bold tracking-[0.3em]">
            見 積 依 頼 書
          </div>

          <div className="mt-6 ml-2 text-[13px]">
            下記営繕工事において、工事見積書の作成を依頼致します。
          </div>

          <div className="mt-8 text-[14px] font-bold">1．依頼主情報</div>
          <table className="mt-1 w-full border-collapse table-fixed">
            <colgroup>
              <col className="w-[60px]" />
              <col className="w-[220px]" />
              <col className="w-[58px]" />
              <col className="w-[92px]" />
              <col className="w-[58px]" />
              <col className="w-[48px]" />
              <col className="w-[48px]" />
              <col className="w-[48px]" />
              <col className="w-[70px]" />
            </colgroup>

            <tbody>
              <tr className="h-[22px]">
                <td className={`${blueCell} text-[12px]`}>社名</td>
                <td className={tdBase}>
                  <input
                    value={form.companyName}
                    onChange={(e) => updateForm("companyName", e.target.value)}
                    className={inputClass}
                  />
                </td>

                <td className={`${blueCell} text-[12px]`}>依頼日</td>

                <td className={tdBase} colSpan={6}>
                  <YmdInputGroup
                    year={form.requestYear}
                    month={form.requestMonth}
                    day={form.requestDay}
                    onYearChange={(v) => updateForm("requestYear", v)}
                    onMonthChange={(v) => updateForm("requestMonth", v)}
                    onDayChange={(v) => updateForm("requestDay", v)}
                  />
                </td>
              </tr>

              <tr className="h-[22px]">
                <td className={`${blueCell} text-[12px]`}>住所</td>
                <td className={tdBase} colSpan={8}>
                  <div className="flex items-center gap-1">
                    <span className="px-1 text-[12px]">〒</span>
                    <input
                      value={form.zipCode}
                      onChange={(e) => updateForm("zipCode", e.target.value)}
                      className="w-[80px] bg-transparent text-[12px] outline-none"
                    />
                    <div className="h-4 border border-r-1 border-black"/>
                    <input
                      value={form.address}
                      onChange={(e) => updateForm("address", e.target.value)}
                      className="flex-1 bg-transparent text-[12px] outline-none"
                    />
                  </div>
                </td>
              </tr>

              <tr className="h-[22px]">
                <td className={`${blueCell} text-[12px]`}>部署名</td>
                <td className={tdBase} colSpan={8}>
                  <input
                    value={form.bushoName}
                    onChange={(e) => updateForm("bushoName", e.target.value)}
                    className={inputClass}
                  />
                </td>
              </tr>

              <tr className="h-[22px]">
                <td className={`${blueCell} text-[12px]`}>担当者</td>
                <td className={tdBase} colSpan={8}>
                  <input
                    value={form.tantosha}
                    onChange={(e) => updateForm("tantosha", e.target.value)}
                    className={inputClass}
                  />
                </td>
              </tr>

              <tr className="h-[24px]">
                <td className={`${blueCell} text-[12px]`}>TEL</td>
                <td className={tdBase}>
                  <input
                    value={form.tel}
                    onChange={(e) => updateForm("tel", e.target.value)}
                    className={inputClass}
                  />
                </td>

                <td className={`${blueCell} text-[12px]`} colSpan={2}>
                  E-mail
                </td>

                <td className={tdBase} colSpan={5}>
                  <input
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    className={inputClass}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3 text-[14px] font-bold">2．建物情報</div>
          <table className="mt-1 w-full border-collapse table-fixed">
            <colgroup>
              <col className="w-[60px]" />
              <col className="w-[82px]" />
              <col className="w-[100px]" />
              <col className="w-[60px]" />
              <col className="w-[100px]" />
              <col className="w-[82px]" />
              <col className="w-[60px]" />
            </colgroup>

            <tbody>
              <tr className="h-[22px]">
                <td className={`${blueCell} text-[12px]`} rowSpan={2}>
                  建物情報
                </td>
                <td className={`${whiteCell} text-[12px]`}>住所</td>
                <td className={tdBase} colSpan={7}>
                  <input
                    value={form.buildingAddress}
                    onChange={(e) => updateForm("buildingAddress", e.target.value)}
                    className={inputClass}
                  />
                </td>
              </tr>

              <tr className="h-[22px]">
                <td className={`${whiteCell} text-[12px]`}>建物名称</td>
                <td className={tdBase} colSpan={4}>
                  <input
                    value={form.buildingName}
                    onChange={(e) => updateForm("buildingName", e.target.value)}
                    className={inputClass}
                  />
                </td>
                <td className={`${whiteCell} text-[12px]`}>部屋番号</td>
                <td className={tdBase} colSpan={2}>
                  <input
                    value={form.roomNo}
                    onChange={(e) => updateForm("roomNo", e.target.value)}
                    className={inputClass}
                  />
                </td>
              </tr>

              <tr className="h-[38px]">
                <td className={`${blueCell} text-[12px]`}>
                  <div>営繕提案</div>
                  <div>予定日</div>
                </td>
                <td colSpan={2} className={tdBase}>
                  {/* <input
                    value={form.eigyoTeianDate}
                    onChange={(e) => updateForm("eigyoTeianDate", e.target.value)}
                    className={`${inputClass} text-center`}
                    placeholder="YYYY/MM/DD"
                  /> */}
                  <div className="flex items-center justify-center gap-2">
                    <SmallYmdInputGroup
                      year={form.eigyoTeianYear}
                      month={form.eigyoTeianMonth}
                      day={form.eigyoTeianDay}
                      onYearChange={(v) => updateForm("eigyoTeianYear", v)}
                      onMonthChange={(v) => updateForm("eigyoTeianMonth", v)}
                      onDayChange={(v) => updateForm("eigyoTeianDay", v)}
                    />
                  </div>
                </td>
                <td className={`${blueCell} text-[12px]`}>
                    <div>契約</div>
                    <div>予定日</div>
                </td>
                <td className={tdBase} colSpan={2}>
                  {/* <input
                    value={form.keiyakuDate}
                    onChange={(e) => updateForm("keiyakuDate", e.target.value)}
                    className={`${inputClass} text-center`}
                    placeholder="YYYY/MM/DD"
                  /> */}
                                    <div className="flex items-center justify-center gap-2">
                    <SmallYmdInputGroup
                      year={form.keiyakuYear}
                      month={form.keiyakuMonth}
                      day={form.keiyakuDay}
                      onYearChange={(v) => updateForm("keiyakuYear", v)}
                      onMonthChange={(v) => updateForm("keiyakuMonth", v)}
                      onDayChange={(v) => updateForm("keiyakuDay", v)}
                    />
                  </div>
                </td>
                <td  className={`${blueCell} text-[12px]`}>
                  <div>着工</div>
                  <div>予定日</div>
                </td>
                <td className={tdBase} colSpan={2}>
                  {/* <input
                    value={form.chakkoDate}
                    onChange={(e) => updateForm("chakkoDate", e.target.value)}
                    className={`${inputClass} text-center`}
                    placeholder="YYYY/MM/DD"
                  /> */}
                  <div className="flex items-center justify-center gap-2">
                    <SmallYmdInputGroup
                      year={form.chakkoYear}
                      month={form.chakkoMonth}
                      day={form.chakkoDay}
                      onYearChange={(v) => updateForm("chakkoYear", v)}
                      onMonthChange={(v) => updateForm("chakkoMonth", v)}
                      onDayChange={(v) => updateForm("chakkoDay", v)}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3 text-[14px] font-bold">3．見積提出方法</div>
          <table className="mt-1 w-full border-collapse table-fixed">
            <colgroup>
              <col className="w-[60px]" />
              <col />
            </colgroup>
            <tbody>
              <tr className="h-[22px]">
                <td className={`${blueCell} text-[12px]`}>提出方法</td>
                <td className={tdBase}>
                    <input
                      value={form.teishutsuMethod}
                      onChange={(e) => updateForm("teishutsuMethod", e.target.value)}
                      className={inputClass}
                    />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3 text-[14px] font-bold">4．見積提出期限</div>
          <table className="mt-1 w-full border-collapse table-fixed">
            <colgroup>
              <col className="w-[60px]" />
              <col className="w-[90px]" />
              <col />
            </colgroup>
            <tbody>
              <tr className="h-[22px]">
                <td className={`${blueCell} text-[12px]`}>提出期限</td>

                <td className={tdBase} colSpan={2}>
                  <YmdInputGroup
                    year={form.deadlineYear}
                    month={form.deadlineMonth}
                    day={form.deadlineDay}
                    onYearChange={(v) => updateForm("deadlineYear", v)}
                    onMonthChange={(v) => updateForm("deadlineMonth", v)}
                    onDayChange={(v) => updateForm("deadlineDay", v)}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3 text-[14px] font-bold">5．工事内容</div>
          <table className="mt-1 w-full border-collapse table-fixed">
            <colgroup>
              <col className="w-[60px]" />
              <col className="w-[60px]" />
              <col />
              <col className="w-[52px]" />
              <col className="w-[44px]" />
              <col className="w-[44px]" />
              <col className="w-[72px]" />
              <col className="w-[44px]" />
              <col className="w-[44px]" />
              <col />
            </colgroup>

            <tbody>
              <tr className="h-[30px]">
                <td className={`${blueCell} text-[12px]`} rowSpan={2}>
                  改修工事
                  <br />
                  内容
                </td>
                <td className={`${whiteCell} text-[12px]`}>部位</td>
                <td className={tdBase} colSpan={8}>
                  <input
                    value={form.kaishuBui}
                    onChange={(e) => updateForm("kaishuBui", e.target.value)}
                    className={inputClass}
                  />
                </td>
              </tr>

              <tr className="h-[32px]">
                <td className={`${whiteCell} text-[12px]`}>工事内容詳細</td>
                <td className={tdBase} colSpan={8}>
                  <textarea
                    rows={1}
                    value={form.kojiNaiyoShosai}
                    onChange={(e) => updateForm("kojiNaiyoShosai", e.target.value)}
                    className={`${textareaClass} h-[24px]`}
                  />
                </td>
              </tr>

              <tr className="h-[30px]">
                <td className={`${blueCell} text-[12px]`} rowSpan={6}>
                  見積依頼
                  <br />
                  内容
                </td>
                <td className={tdBase} colSpan={9}>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[12px] whitespace-nowrap">別紙見積仕様書を参照</span>
                    <input
                      value={form.mitsumoriIraiNaiyo}
                      onChange={(e) => updateForm("mitsumoriIraiNaiyo", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </td>
              </tr>

              {([2, 3, 4, 5, 6] as const).map((n) => {
                const key = `mitsumoriIraiNaiyo${n}` as const;
                return (
                  <tr className="h-[30px]" key={n}>
                    <td className={tdBase} colSpan={9}>
                      <input
                        value={form[key]}
                        onChange={(e) => updateForm(key, e.target.value)}
                        className={inputClass}
                      />
                    </td>
                  </tr>
                );
              })}

              <tr className="h-[44px]">
                <td className={`${blueCell} text-[12px]`}>
                  高所作業
                  <br />
                  有無
                </td>

                <td className={`${whiteCell} text-[12px]`}>
                  <label className="flex cursor-pointer items-center justify-center gap-1">
                    <input
                      type="radio"
                      checked={form.kouishoSagyo === "有"}
                      onChange={() => updateForm("kouishoSagyo", "有")}
                    />
                    <span>有</span>
                  </label>
                </td>

                <td className={`${whiteCell} text-[12px]`}>
                  <label className="flex cursor-pointer items-center justify-center gap-1">
                    <input
                      type="radio"
                      checked={form.kouishoSagyo === "無"}
                      onChange={() => updateForm("kouishoSagyo", "無")}
                    />
                    <span>無</span>
                  </label>
                </td>

                <td className={`${blueCell} text-[12px]`}>仕様</td>
                <td className={tdBase} colSpan={6}>
                  <input
                    value={form.kouishoShiyo}
                    onChange={(e) => updateForm("kouishoShiyo", e.target.value)}
                    className={inputClass}
                  />
                </td>
              </tr>

              <tr className="h-[42px]">
                <td className={`${blueCell} text-[12px]`} rowSpan={2}>
                  添付資料
                </td>

                <td className={`${whiteCell} text-[12px]`}>現況写真</td>
                <YesNoRadio
                  value={form.genkyoShashin}
                  onChange={(v) => updateForm("genkyoShashin", v)}
                />

                <td className={`${whiteCell} text-[12px]`}>案内図</td>
                <YesNoRadio
                  value={form.annaizu}
                  onChange={(v) => updateForm("annaizu", v)}
                />

                <td className={tdBase} colSpan={3}>
                  <div className="flex items-center justify-center gap-1 text-[12px]">
                    <span>その他（</span>
                    <input
                      value={form.annaizuOther}
                      onChange={(e) => updateForm("annaizuOther", e.target.value)}
                      className="w-[80px] border-b border-black bg-transparent text-center outline-none"
                    />
                    <span>）</span>
                  </div>
                </td>
              </tr>

              <tr className="h-[42px]">
                <td className={`${whiteCell} text-[12px]`}>図面</td>
                <YesNoRadio
                  value={form.zumen}
                  onChange={(v) => updateForm("zumen", v)}
                />

                <td className={`${whiteCell} text-[12px]`}>工事部位写真</td>
                <YesNoRadio
                  value={form.kojiBuiShashin}
                  onChange={(v) => updateForm("kojiBuiShashin", v)}
                />

                <td className={tdBase} colSpan={3}>
                  <div className="flex items-center justify-center gap-1 text-[12px]">
                    <span>その他（</span>
                    <input
                      value={form.shashinOther}
                      onChange={(e) => updateForm("shashinOther", e.target.value)}
                      className="w-[80px] border-b border-black bg-transparent text-center outline-none"
                    />
                    <span>）</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="page-break" />

        {/* SPEC PAGES */}
        {specPages.map((pageRows, pageIndex) => (
          <React.Fragment key={pageIndex}>
            <SpecSheetPage
              rows={pageRows}
              pageIndex={pageIndex}
              updateRow={updateSpecRow}
            />
            {pageIndex !== specPages.length - 1 && <div className="page-break" />}
          </React.Fragment>
        ))}
        </div>
        </fieldset>
      </div>
      {showBackDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[440px] rounded-xl bg-white p-6 shadow-xl">
            <div className="text-base font-semibold text-slate-900">見積依頼書に未保存の変更があります。</div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" disabled={saving} onClick={handleSaveAndBack} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                保存して戻る
              </button>
              <button type="button" onClick={() => { setShowBackDialog(false); navBack(); }} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600">
                保存せずに戻る
              </button>
              <button type="button" onClick={() => setShowBackDialog(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}