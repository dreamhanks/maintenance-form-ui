import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type RequestForm = {
  topTantosha: string;

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
  mitsumoriIraiNaiyo: string;

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

function pad2(v: number) {
  return String(v).padStart(2, "0");
}

function toDateString(year: string, month: string, day: string) {
  if (!year || !month || !day) return "";
  return `${year}-${pad2(Number(month))}-${pad2(Number(day))}`;
}

function splitDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return {
    year: y ?? "",
    month: m ? String(Number(m)) : "",
    day: d ? String(Number(d)) : "",
  };
}

function DatePickerButton({
  year,
  month,
  day,
  onChange,
  buttonLabel = "日付選択",
}: {
  year: string;
  month: string;
  day: string;
  onChange: (next: { year: string; month: string; day: string }) => void;
  buttonLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOpen = () => {
    const el = inputRef.current;
    if (!el) return;

    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.click();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <input
        ref={inputRef}
        type="date"
        lang="ja-JP"
        className="absolute h-0 w-0 opacity-0 pointer-events-none"
        value={toDateString(year, month, day)}
        onChange={(e) => onChange(splitDate(e.target.value))}
      />
      <button
        type="button"
        onClick={handleOpen}
        className="rounded border border-gray-500 bg-white px-2 py-[2px] text-[10px] hover:bg-gray-50"
      >
        {buttonLabel}
      </button>
    </div>
  );
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
  onYearChange: (v: string) => void;
  onMonthChange: (v: string) => void;
  onDayChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 text-[12px]">
      <input
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        className="w-12 border-b border-black bg-transparent text-center outline-none"
      />
      <span>年</span>
      <input
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        className="w-8 border-b border-black bg-transparent text-center outline-none"
      />
      <span>月</span>
      <input
        value={day}
        onChange={(e) => onDayChange(e.target.value)}
        className="w-8 border-b border-black bg-transparent text-center outline-none"
      />
      <span>日</span>
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
  onYearChange: (v: string) => void;
  onMonthChange: (v: string) => void;
  onDayChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1 text-[12px]">
      <input
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        className="w-9 border-b border-black bg-transparent text-center outline-none"
      />
      <span>年</span>
      <input
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        className="w-5 border-b border-black bg-transparent text-center outline-none"
      />
      <span>月</span>
      <input
        value={day}
        onChange={(e) => onDayChange(e.target.value)}
        className="w-5 border-b border-black bg-transparent text-center outline-none"
      />
      <span>日</span>
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
  const [form, setForm] = useState<RequestForm>({
    topTantosha: "",

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
    mitsumoriIraiNaiyo: "別紙見積仕様書を参照",

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
  };

  const updateSpecRow = (
    index: number,
    key: keyof Omit<SpecRow, "no">,
    value: string
  ) => {
    setSpecRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };

  const handleAddPage = () => {
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
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="form-text min-h-screen bg-neutral-200 p-4 print:bg-white print:p-0">
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
        <div className="print-hidden flex justify-end gap-2">
          <button
            type="button"
            onClick={() => nav("/form", { replace: true })}
            className="rounded border border-black bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            戻る
          </button>
          <button
            type="button"
            onClick={handleAddPage}
            className="rounded border border-black bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            見積仕様書 ページ追加
          </button>

          <button
            type="button"
            onClick={handleDeleteLastPage}
            className="rounded border border-black bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            最終ページ削除
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="rounded border border-black bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            PDF出力
          </button>
        </div>

        {/* PAGE 1 */}
        <div className={`${pageClass} px-8 pt-4 pb-6`}>
          <div className="flex justify-between">
            <div className="w-[240px]">
              {/* <div className="mb-3 text-center text-[11px]">御中</div> */}
              <div className="flex items-end justify-between border-b border-black px-1 mb-4 text-[12px]">
                <input type="text" className="w-48 bg-transparent px-1 py-0.5 text-[12px] outline-none"/>
                <span>御中</span>
              </div>
              <div className="flex items-end justify-between border-b border-black px-1 text-[12px]">
                <span>ご担当者</span>
                <div className="flex">
                  <input type="text" className="w-36 bg-transparent px-1 text-[12px] outline-none"/>
                  <span className="text-[12px]">{form.topTantosha ? `${form.topTantosha} 様` : "様"}</span>
                </div>
              </div>
            </div>

            <div className="w-[300px] text-right">
              <div className="mb-1 flex justify-end gap-5 pr-1 text-[12px]">
                <DatePickerButton
                  year={form.year}
                  month={form.month}
                  day={form.day}
                  onChange={(next) => {
                    updateForm("year", next.year);
                    updateForm("month", next.month);
                    updateForm("day", next.day);
                  }}
                />
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

                <td className={tdBase}>
                  <DatePickerButton
                    year={form.requestYear}
                    month={form.requestMonth}
                    day={form.requestDay}
                    onChange={(next) => {
                      updateForm("requestYear", next.year);
                      updateForm("requestMonth", next.month);
                      updateForm("requestDay", next.day);
                    }}
                  />
                </td>

                <td className={tdBase} colSpan={5}>
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
                    <DatePickerButton
                      year={form.eigyoTeianYear}
                      month={form.eigyoTeianMonth}
                      day={form.eigyoTeianDay}
                      onChange={(next) => {
                        updateForm("eigyoTeianYear", next.year);
                        updateForm("eigyoTeianMonth", next.month);
                        updateForm("eigyoTeianDay", next.day);
                      }}
                    />
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
                    <DatePickerButton
                      year={form.keiyakuYear}
                      month={form.keiyakuMonth}
                      day={form.keiyakuDay}
                      onChange={(next) => {
                        updateForm("keiyakuYear", next.year);
                        updateForm("keiyakuMonth", next.month);
                        updateForm("keiyakuDay", next.day);
                      }}
                    />
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
                    <DatePickerButton
                      year={form.chakkoYear}
                      month={form.chakkoMonth}
                      day={form.chakkoDay}
                      onChange={(next) => {
                        updateForm("chakkoYear", next.year);
                        updateForm("chakkoMonth", next.month);
                        updateForm("chakkoDay", next.day);
                      }}
                    />
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
                  <div className="flex justify-center items-center">
                    <div style={{fontSize: 12}} className="w-16">メール:</div>
                    <input
                      value={form.teishutsuMethod}
                      onChange={(e) => updateForm("teishutsuMethod", e.target.value)}
                      className={inputClass}
                    />
                  </div>
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

                <td className={tdBase}>
                  <DatePickerButton
                    year={form.deadlineYear}
                    month={form.deadlineMonth}
                    day={form.deadlineDay}
                    onChange={(next) => {
                      updateForm("deadlineYear", next.year);
                      updateForm("deadlineMonth", next.month);
                      updateForm("deadlineDay", next.day);
                    }}
                  />
                </td>

                <td className={tdBase}>
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
                  <textarea
                    rows={1}
                    value={form.mitsumoriIraiNaiyo}
                    onChange={(e) => updateForm("mitsumoriIraiNaiyo", e.target.value)}
                    className={`${textareaClass} h-[24px]`}
                  />
                </td>
              </tr>

              {Array.from({ length: 5 }).map((_, i) => (
                <tr className="h-[30px]" key={i}>
                  <td className={tdBase} colSpan={9}></td>
                </tr>
              ))}

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
    </div>
  );
}