import React, { useMemo, useRef, useState } from "react";

/**
 * 添付資料（事前確認時／見積確認時）レイアウト
 * - 画像の罫線・列構成に合わせた「設計図（blueprint）」版
 * - TailwindCSS 前提
 */

const outer = "border-2 border-black";
const inner = "border border-black";
const headL = "bg-gray-200 font-semibold";
const headD = "bg-gray-400 font-semibold"; // 見積確認時の見出しは少し濃い
const cell = "text-sm";
const pad = "px-3 py-2";
const labelColW = "w-[140px]";
const rightColW = "w-[70px]";

/**
 * File-checkbox:
 * - click checkbox => open file picker
 * - select file => show file name under checkbox
 * - uncheck => clear file
 */
function FileCB({
  id,
  label,
  required,
  checked,
  file,
  onToggle,
  onFileSelected,
}: {
  id: string;
  label: React.ReactNode;
  required?: boolean;
  checked: boolean;
  file: File | null;
  onToggle: (nextChecked: boolean) => void;
  onFileSelected: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  if(id) {
    console.log('');
  }

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextChecked = e.target.checked;
    onToggle(nextChecked);

    if (nextChecked) {
      // open picker immediately when checked
      setTimeout(() => openPicker(), 0);
    } else {
      // clear file when unchecked
      onFileSelected(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    onFileSelected(f);

    // If user cancels file dialog, keep checkbox checked (your choice).
    // If you want cancel => uncheck, uncomment below:
    // if (!f) onToggle(false);
  };

  return (
    <div className="inline-block mr-6 align-top">
      <label className="inline-flex items-center gap-2 whitespace-nowrap">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={checked}
          onChange={handleCheckboxChange}
          // If user clicks already-checked checkbox (no change), nothing happens.
          // That's okay; they can uncheck/recheck to re-upload.
        />
        <span className="text-sm">
          {label}{" "}
          {required ? <span className="font-semibold">【必須】</span> : null}
        </span>
      </label>

      {/* hidden file input for this checkbox */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* show file under the checkbox */}
      {checked && file && (
        <div className="ml-6 mt-1 text-xs text-gray-700 whitespace-nowrap">
          📎 {file.name}
        </div>
      )}
    </div>
  );
}

function SmallRightCheck() {
  return (
    <div className="flex items-center justify-center">
      <input type="checkbox" className="h-4 w-4" />
    </div>
  );
}

/** 白抜き（アウトライン）の左向き矢印（画像の形に近い） */
function OutlineLeftArrow() {
  return (
    <svg width="210" height="28" viewBox="0 0 210 28" className="block">
      <rect
        x="18"
        y="12"
        width="185"
        height="4"
        fill="white"
        stroke="#1d4ed8"
        strokeWidth="2"
      />
      <polygon
        points="18,14 34,4 34,24"
        fill="white"
        stroke="#1d4ed8"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/** 左側の太い下向き矢印 */
function BigDownArrow() {
  return (
    <svg width="46" height="210" viewBox="0 0 46 210" className="block">
      <rect
        x="16"
        y="0"
        width="14"
        height="160"
        fill="#60a5fa"
        stroke="#1f2937"
        strokeWidth="2"
      />
      <polygon
        points="23,210 2,160 44,160"
        fill="#60a5fa"
        stroke="#1f2937"
        strokeWidth="2"
      />
    </svg>
  );
}

/** 右側の承認テーブル（事前確認時／契約前 見積確認時） */
function ApprovalTable({ title }: { title: string }) {
  return (
    <table className={`${outer} border-collapse`}>
      <thead>
        <tr>
          <th className={`${inner} ${cell} ${pad} text-center`} colSpan={3}>
            {title}
          </th>
        </tr>
        <tr>
          <th className={`${inner} ${cell} ${pad} text-center w-[160px]`}>
            工事・メンテナンス
            <br />
            センター管理職
          </th>
          <th className={`${inner} ${cell} ${pad} text-center w-[140px]`}>
            大ハ管理職
          </th>
          <th className={`${inner} ${cell} ${pad} text-center w-[140px]`}>
            大ハ担当
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td className={`${inner} ${cell} p-0 align-top`}>
            <div className="h-[95px] relative">
              <div className="absolute bottom-2 left-0 right-0 text-center text-sm">
                確認
              </div>
            </div>
          </td>
          <td className={`${inner} ${cell} p-0 align-top`}>
            <div className="h-[95px] relative">
              <div className="absolute bottom-2 left-0 right-0 text-center text-sm">
                確認
              </div>
            </div>
          </td>
          <td className={`${inner} ${cell} p-0 align-top`}>
            <div className="h-[95px] relative">
              <div className="absolute bottom-2 left-0 right-0 text-center text-sm">
                起票
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function AttachmentTable({
  title,
  headerClass,
  includeEstimateRow,
}: {
  title: string;
  headerClass: string;
  includeEstimateRow?: boolean;
}) {
  /**
   * We store checked state + file per checkbox.
   * Keys are unique per table instance (title) and item name.
   */
  const prefix = useMemo(() => (title === "事前確認時" ? "pre" : "est"), [title]);

  type ItemKey =
    | "site_plan" // 配置図
    | "floor_plan" // 平面図
    | "elevation" // 立面図
    | "site_other" // 図面 その他(checkbox)
    | "photo_4faces" // 建物外観４面
    | "photo_parts" // 工事部位
    | "photo_other" // 現場写真 その他(checkbox)
    | "pre_estimate" // 事見積書
    | "schedule"; // 工程表

  const makeId = (k: ItemKey) => `${prefix}_${k}`;

  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [fileMap, setFileMap] = useState<Record<string, File | null>>({});

  const isChecked = (id: string) => !!checkedMap[id];
  const getFile = (id: string) => fileMap[id] ?? null;

  const setChecked = (id: string, v: boolean) =>
    setCheckedMap((prev) => ({ ...prev, [id]: v }));

  const setFile = (id: string, f: File | null) =>
    setFileMap((prev) => ({ ...prev, [id]: f }));

  return (
    <table className={`${outer} border-collapse w-full`}>
      <colgroup>
        <col className={labelColW} />
        <col />
        <col className={rightColW} />
      </colgroup>

      <thead>
        <tr>
          <th className={`${inner} ${cell} ${pad} ${headerClass} text-left w-48`}>
            ◆{title}添付資料
          </th>
          <th className={`${inner} ${cell} ${pad} ${headerClass}`}></th>
          <th
            className={`${inner} ${cell} ${pad} ${headerClass} text-center w-24`}
          >
            大ハ管理職
            <br />
            確認
          </th>
        </tr>
      </thead>

      <tbody>
        {/* 図面 */}
        <tr>
          <td className={`${inner} ${cell} ${pad}`}>図面</td>
          <td className={`${inner} ${cell} ${pad}`}>
            <FileCB
              id={makeId("site_plan")}
              label="配置図"
              required
              checked={isChecked(makeId("site_plan"))}
              file={getFile(makeId("site_plan"))}
              onToggle={(v) => setChecked(makeId("site_plan"), v)}
              onFileSelected={(f) => setFile(makeId("site_plan"), f)}
            />

            <FileCB
              id={makeId("floor_plan")}
              label="平面図"
              checked={isChecked(makeId("floor_plan"))}
              file={getFile(makeId("floor_plan"))}
              onToggle={(v) => setChecked(makeId("floor_plan"), v)}
              onFileSelected={(f) => setFile(makeId("floor_plan"), f)}
            />

            <FileCB
              id={makeId("elevation")}
              label="立面図"
              checked={isChecked(makeId("elevation"))}
              file={getFile(makeId("elevation"))}
              onToggle={(v) => setChecked(makeId("elevation"), v)}
              onFileSelected={(f) => setFile(makeId("elevation"), f)}
            />

            {/* その他： checkbox + text input (text stays as your original) */}
            <span className="inline-flex items-start gap-2 whitespace-nowrap">
              <FileCB
                id={makeId("site_other")}
                label={<span className="text-sm">その他：</span>}
                checked={isChecked(makeId("site_other"))}
                file={getFile(makeId("site_other"))}
                onToggle={(v) => setChecked(makeId("site_other"), v)}
                onFileSelected={(f) => setFile(makeId("site_other"), f)}
              />
              <input
                className="border border-black h-6 w-[180px] px-2 text-sm mt-[2px]"
                type="text"
              />
            </span>
          </td>
          <td className={`${inner} ${cell} ${pad}`}>
            <SmallRightCheck />
          </td>
        </tr>

        {/* 現場写真 */}
        <tr>
          <td className={`${inner} ${cell} ${pad}`}>現場写真</td>
          <td className={`${inner} ${cell} ${pad}`}>
            <FileCB
              id={makeId("photo_4faces")}
              label="建物外観４面"
              required
              checked={isChecked(makeId("photo_4faces"))}
              file={getFile(makeId("photo_4faces"))}
              onToggle={(v) => setChecked(makeId("photo_4faces"), v)}
              onFileSelected={(f) => setFile(makeId("photo_4faces"), f)}
            />

            <FileCB
              id={makeId("photo_parts")}
              label="工事部位"
              required
              checked={isChecked(makeId("photo_parts"))}
              file={getFile(makeId("photo_parts"))}
              onToggle={(v) => setChecked(makeId("photo_parts"), v)}
              onFileSelected={(f) => setFile(makeId("photo_parts"), f)}
            />

            <span className="inline-flex items-start gap-2 whitespace-nowrap">
              <FileCB
                id={makeId("photo_other")}
                label={<span className="text-sm">その他：</span>}
                checked={isChecked(makeId("photo_other"))}
                file={getFile(makeId("photo_other"))}
                onToggle={(v) => setChecked(makeId("photo_other"), v)}
                onFileSelected={(f) => setFile(makeId("photo_other"), f)}
              />
              <input
                className="border border-black h-6 w-[180px] px-2 text-sm mt-[2px]"
                type="text"
              />
            </span>
          </td>
          <td className={`${inner} ${cell} ${pad}`}>
            <SmallRightCheck />
          </td>
        </tr>

        {/* 見積書・工程表（見積確認時のみ） */}
        {includeEstimateRow ? (
          <tr>
            <td className={`${inner} ${cell} ${pad}`}>見積書・工程表</td>
            <td className={`${inner} ${cell} ${pad}`}>
              <FileCB
                id={makeId("pre_estimate")}
                label="事見積書"
                required
                checked={isChecked(makeId("pre_estimate"))}
                file={getFile(makeId("pre_estimate"))}
                onToggle={(v) => setChecked(makeId("pre_estimate"), v)}
                onFileSelected={(f) => setFile(makeId("pre_estimate"), f)}
              />
              <FileCB
                id={makeId("schedule")}
                label="工程表"
                checked={isChecked(makeId("schedule"))}
                file={getFile(makeId("schedule"))}
                onToggle={(v) => setChecked(makeId("schedule"), v)}
                onFileSelected={(f) => setFile(makeId("schedule"), f)}
              />
            </td>
            <td className={`${inner} ${cell} ${pad}`}>
              <SmallRightCheck />
            </td>
          </tr>
        ) : null}

        {/* 備考 */}
        <tr>
          <td className={`${inner} ${cell} ${pad} text-center`}>備 考</td>
          <td className={`${inner} ${cell} ${pad}`} colSpan={2}>
            <div className="h-[54px]" />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function DesignManagerBox() {
  return (
    <div className="w-[120px] border-2 border-black">
      <div className="border-b border-black text-center py-2 text-sm font-semibold">
        設計管理職
      </div>
      <div className="h-[95px] relative">
        <div className="absolute bottom-2 right-3 text-sm">確認</div>
      </div>
    </div>
  );
}

export function TenpuShiryoTable() {
  return (
    <div className="w-full form-text">
      {/* ====== 事前確認時 添付資料 ====== */}
      <AttachmentTable
        title="事前確認時"
        headerClass={headL}
        includeEstimateRow={false}
      />

      {/* ====== 中央フロー（矢印・設計管理職・承認テーブル） ====== */}
      <div className="relative mt-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="pl-6 pt-3">
            <BigDownArrow />
          </div>

          <div className="flex-1 flex items-center justify-end gap-8 pr-10">
            <div className="flex flex-col items-center">
              <DesignManagerBox />
              <div className="mt-2 text-sm font-semibold whitespace-nowrap">
                ↑ 設計コメントがある場合は押印
              </div>
            </div>

            <div className="pt-2">
              <OutlineLeftArrow />
            </div>

            <ApprovalTable title="事前確認時" />
          </div>
        </div>
      </div>

      {/* ====== 見積確認時 添付資料 ====== */}
      <AttachmentTable
        title="見積確認時"
        headerClass={headD}
        includeEstimateRow={true}
      />

      {/* ====== 右下：契約前 見積確認時 承認テーブル ====== */}
      <div className="mt-6 flex justify-end pr-10">
        <ApprovalTable title="契約前 見積確認時" />
      </div>
    </div>
  );
}
