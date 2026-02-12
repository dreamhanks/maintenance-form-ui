import React, { useRef } from "react";
import { TenpuForm } from "../form/formTypes";

/**
 * 添付資料（事前確認時／見積確認時）レイアウト
 * - value/onChange で App.tsx の state に統合（checkedMap/fileMap/textMap）
 */

const outer = "border-2 border-black";
const inner = "border border-black";
const headL = "bg-gray-200 font-semibold";
const headD = "bg-gray-400 font-semibold";
const cell = "text-sm";
const pad = "px-3 py-2";
const labelColW = "w-[140px]";
const rightColW = "w-[70px]";

// Accept: PDF, images, Excel (xls/xlsx)
const ACCEPT_FILES = "application/pdf,image/*,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.pdf,.xls,.xlsx";

function getFileKind(file: File): "PDF" | "IMG" | "EXCEL" | "FILE" {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) return "PDF";
  if (file.type.startsWith("image/")) return "IMG";
  if (file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls"))
    return "EXCEL";
  return "FILE";
}

/**
 * File-checkbox:
 * - click checkbox => open file picker
 * - select file => show clickable file name under checkbox
 * - uncheck => clear file
 */
function FileCB({
  label,
  required,
  checked,
  file,
  onToggle,
  onFileSelected,
}: {
  label: React.ReactNode;
  required?: boolean;
  checked: boolean;
  file: File | null;
  onToggle: (nextChecked: boolean) => void;
  onFileSelected: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => inputRef.current?.click();

  const openFilePreview = (f: File) => {
    const url = URL.createObjectURL(f);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextChecked = e.target.checked;

    if (nextChecked) {
      onToggle(true);
      setTimeout(openPicker, 0);
    } else {
      // IMPORTANT: only call onToggle(false)
      // Parent will clear the file in the same update (because we passed ...(v?{}:{file:null}))
      onToggle(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const nextChecked = e.target.checked;
  //   onToggle(nextChecked);

  //   if (nextChecked) {
  //     setTimeout(() => openPicker(), 0);
  //   } else {
  //     onFileSelected(null);
  //     if (inputRef.current) inputRef.current.value = "";
  //   }
  // };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const f = e.target.files?.[0] ?? null;
  //   onFileSelected(f);
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    // If user cancels picker
    if (!files || files.length === 0) {
      // If there was NO file before, checkbox ON makes no sense -> turn it OFF
      if (!file) {
        onToggle(false);
      }
      // If there WAS a file before, keep it (do nothing)
      return;
    }

    // User picked a file
    onFileSelected(files[0]);
  };

  const kind = file ? getFileKind(file) : null;

  return (
    <div className="inline-block mr-6 align-top">
      <label className="inline-flex items-center gap-2 whitespace-nowrap">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={checked}
          onChange={handleCheckboxChange}
        />
        <span className="text-sm">
          {label} {required ? <span className="font-semibold">【必須】</span> : null}
        </span>
      </label>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={ACCEPT_FILES}
        onChange={handleFileChange}
      />

      {checked && file && (
        <div className="ml-6 mt-1 text-xs text-gray-700 whitespace-nowrap">
          <span className="mr-1 font-semibold">[{kind}]</span> 📎{" "}
          <button
            type="button"
            className="underline text-blue-700 hover:text-blue-900"
            onClick={() => openFilePreview(file)}
            title="開く"
          >
            {file.name}
          </button>

          {/* ✅ Change file without touching checkbox */}
          <button
            type="button"
            className="px-2 py-[1px] border border-black bg-white hover:bg-gray-100 text-xs"
            onClick={openPicker}
            title="ファイルを変更"
          >
            変更
          </button>
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
      <rect x="18" y="12" width="185" height="4" fill="white" stroke="#1d4ed8" strokeWidth="2" />
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
      <rect x="16" y="0" width="14" height="160" fill="#60a5fa" stroke="#1f2937" strokeWidth="2" />
      <polygon points="23,210 2,160 44,160" fill="#60a5fa" stroke="#1f2937" strokeWidth="2" />
    </svg>
  );
}


function PendingManagerApprovalTable({ title }: { title: string }) {
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
            工事・メンテナンス <br />
            センター管理職
          </th>
          <th className={`${inner} ${cell} ${pad} text-center w-[140px]`}>大パ管理職</th>
          <th className={`${inner} ${cell} ${pad} text-center w-[140px]`}>大パ担当</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={`${inner} ${cell} p-0 align-top`}>
            <div className="h-[95px] relative">
              <div className="absolute bottom-2 left-0 right-0 text-center text-sm">確認</div>
            </div>
          </td>
          <td className={`${inner} ${cell} p-0 align-top`}>
            <div className="h-[95px] relative">
              <div className="absolute bottom-2 left-0 right-0 text-center text-sm">確認</div>
            </div>
          </td>
          <td className={`${inner} ${cell} p-0 align-top`}>
            <div className="h-[95px] relative">
              <div className="absolute bottom-2 left-0 right-0 text-center text-sm">起票</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function ApprovedDesignManagerTable({ title }: { title: string }) {
  return (
    <table className={`${outer} border-collapse`}>
      <thead>
        <tr>
          <th className={`${inner} ${cell} ${pad} text-center`} colSpan={4}>
            {title}
          </th>
        </tr>
        <tr>
          <th className={`${inner} ${cell} ${pad} text-center w-[140px]`}>
            業務課確認者
          </th>
          <th className={`${inner} ${cell} ${pad} text-center w-[160px]`}>
            工事・メンテナンス <br />
            センター管理職
          </th>
          <th className={`${inner} ${cell} ${pad} text-center w-[140px]`}>大パ管理職</th>
          <th className={`${inner} ${cell} ${pad} text-center w-[140px]`}>大パ担当</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={`${inner} ${cell} p-0 align-top`}>
            <div className="h-[95px] relative">
              <div className="absolute bottom-2 left-0 right-0 text-center text-sm">確認</div>
            </div>
          </td>          
          <td className={`${inner} ${cell} p-0 align-top`}>
            <div className="h-[95px] relative">
              <div className="absolute bottom-2 left-0 right-0 text-center text-sm">確認</div>
            </div>
          </td>
          <td className={`${inner} ${cell} p-0 align-top`}>
            <div className="h-[95px] relative">
              <div className="absolute bottom-2 left-0 right-0 text-center text-sm">確認</div>
            </div>
          </td>
          <td className={`${inner} ${cell} p-0 align-top`}>
            <div className="h-[95px] relative">
              <div className="absolute bottom-2 left-0 right-0 text-center text-sm">起票</div>
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
  prefix,
  value,
  onChange,
}: {
  title: string;
  headerClass: string;
  includeEstimateRow?: boolean;
  prefix: "pre" | "est";
  value: TenpuForm;
  onChange: (next: TenpuForm) => void;
}) {
  type ItemKey =
    | "site_plan"
    | "floor_plan"
    | "elevation"
    | "site_other"
    | "photo_4faces"
    | "photo_parts"
    | "photo_other"
    | "pre_estimate"
    | "schedule";

  const makeId = (k: ItemKey) => `${prefix}_${k}`;
  const otherTextKey = (k: ItemKey) => `${makeId(k)}_text`;

  const isChecked = (id: string) => !!value.checkedMap[id];
  const getFile = (id: string) => value.fileMap[id] ?? null;
  const getText = (id: string) => value.textMap[id] ?? "";

  // const setChecked = (id: string, v: boolean) =>
  //   onChange({ ...value, checkedMap: { ...value.checkedMap, [id]: v } });

  // const setFile = (id: string, f: File | null) =>
  //   onChange({ ...value, fileMap: { ...value.fileMap, [id]: f } });

  const setText = (id: string, t: string) =>
    onChange({ ...value, textMap: { ...value.textMap, [id]: t } });

  const updateItem = (id: string, patch: { checked?: boolean; file?: File | null }) => {
    onChange({
      ...value,
      checkedMap:
        patch.checked === undefined
          ? value.checkedMap
          : { ...value.checkedMap, [id]: patch.checked },
      fileMap:
        patch.file === undefined
          ? value.fileMap
          : { ...value.fileMap, [id]: patch.file },
    });
  };

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
          <th className={`${inner} ${cell} ${pad} ${headerClass} text-center w-24`}>
            大ハ管理職 <br />
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
              label="配置図"
              required
              checked={isChecked(makeId("site_plan"))}
              file={getFile(makeId("site_plan"))}
              // onToggle={(v) => setChecked(makeId("site_plan"), v)}
              // onFileSelected={(f) => setFile(makeId("site_plan"), f)}
              onToggle={(v) => updateItem(makeId("site_plan"), { checked: v, ...(v ? {} : { file: null }) })}
              onFileSelected={(f) => updateItem(makeId("site_plan"), { file: f, ...(f ? { checked: true } : {}) })}
            />

            <FileCB
              label="平面図"
              checked={isChecked(makeId("floor_plan"))}
              file={getFile(makeId("floor_plan"))}
              // onToggle={(v) => setChecked(makeId("floor_plan"), v)}
              // onFileSelected={(f) => setFile(makeId("floor_plan"), f)}
              onToggle={(v) => updateItem(makeId("floor_plan"), { checked: v, ...(v ? {} : { file: null }) })}
              onFileSelected={(f) => updateItem(makeId("floor_plan"), { file: f, ...(f ? { checked: true } : {}) })}
            />

            <FileCB
              label="立面図"
              checked={isChecked(makeId("elevation"))}
              file={getFile(makeId("elevation"))}
              // onToggle={(v) => setChecked(makeId("elevation"), v)}
              // onFileSelected={(f) => setFile(makeId("elevation"), f)}
              onToggle={(v) => updateItem(makeId("elevation"), { checked: v, ...(v ? {} : { file: null }) })}
              onFileSelected={(f) => updateItem(makeId("elevation"), { file: f, ...(f ? { checked: true } : {}) })}
            />

            <span className="inline-flex items-start gap-2 whitespace-nowrap">
              <FileCB
                label={<span className="text-sm">その他：</span>}
                checked={isChecked(makeId("site_other"))}
                file={getFile(makeId("site_other"))}
                // onToggle={(v) => setChecked(makeId("site_other"), v)}
                // onFileSelected={(f) => setFile(makeId("site_other"), f)}
                onToggle={(v) => updateItem(makeId("site_other"), { checked: v, ...(v ? {} : { file: null }) })}
                onFileSelected={(f) => updateItem(makeId("site_other"), { file: f, ...(f ? { checked: true } : {}) })}
              />
              <input
                className="border border-black h-6 w-[180px] px-2 text-sm mt-[2px]"
                type="text"
                value={getText(otherTextKey("site_other"))}
                onChange={(e) => setText(otherTextKey("site_other"), e.target.value)}
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
              label="建物外観４面"
              required
              checked={isChecked(makeId("photo_4faces"))}
              file={getFile(makeId("photo_4faces"))}
              // onToggle={(v) => setChecked(makeId("photo_4faces"), v)}
              // onFileSelected={(f) => setFile(makeId("photo_4faces"), f)}
              onToggle={(v) => updateItem(makeId("photo_4faces"), { checked: v, ...(v ? {} : { file: null }) })}
              onFileSelected={(f) => updateItem(makeId("photo_4faces"), { file: f, ...(f ? { checked: true } : {}) })}
            />

            <FileCB
              label="工事部位"
              required
              checked={isChecked(makeId("photo_parts"))}
              file={getFile(makeId("photo_parts"))}
              // onToggle={(v) => setChecked(makeId("photo_parts"), v)}
              // onFileSelected={(f) => setFile(makeId("photo_parts"), f)}
              onToggle={(v) => updateItem(makeId("photo_parts"), { checked: v, ...(v ? {} : { file: null }) })}
              onFileSelected={(f) => updateItem(makeId("photo_parts"), { file: f, ...(f ? { checked: true } : {}) })}
            />

            <span className="inline-flex items-start gap-2 whitespace-nowrap">
              <FileCB
                label={<span className="text-sm">その他：</span>}
                checked={isChecked(makeId("photo_other"))}
                file={getFile(makeId("photo_other"))}
                // onToggle={(v) => setChecked(makeId("photo_other"), v)}
                // onFileSelected={(f) => setFile(makeId("photo_other"), f)}
                onToggle={(v) => updateItem(makeId("photo_other"), { checked: v, ...(v ? {} : { file: null }) })}
                onFileSelected={(f) => updateItem(makeId("photo_other"), { file: f, ...(f ? { checked: true } : {}) })}
              />
              <input
                className="border border-black h-6 w-[180px] px-2 text-sm mt-[2px]"
                type="text"
                value={getText(otherTextKey("photo_other"))}
                onChange={(e) => setText(otherTextKey("photo_other"), e.target.value)}
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
                label="事見積書"
                required
                checked={isChecked(makeId("pre_estimate"))}
                file={getFile(makeId("pre_estimate"))}
                // onToggle={(v) => setChecked(makeId("pre_estimate"), v)}
                // onFileSelected={(f) => setFile(makeId("pre_estimate"), f)}
                onToggle={(v) => updateItem(makeId("pre_estimate"), { checked: v, ...(v ? {} : { file: null }) })}
                onFileSelected={(f) => updateItem(makeId("pre_estimate"), { file: f, ...(f ? { checked: true } : {}) })}
              />

              <FileCB
                label="工程表"
                checked={isChecked(makeId("schedule"))}
                file={getFile(makeId("schedule"))}
                // onToggle={(v) => setChecked(makeId("schedule"), v)}
                // onFileSelected={(f) => setFile(makeId("schedule"), f)}
                onToggle={(v) => updateItem(makeId("schedule"), { checked: v, ...(v ? {} : { file: null }) })}
                onFileSelected={(f) => updateItem(makeId("schedule"), { file: f, ...(f ? { checked: true } : {}) })}
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

export function TenpuShiryoTable({
  value,
  onChange,
}: {
  value: TenpuForm;
  onChange: (next: TenpuForm) => void;
}) {
  return (
    <div className="w-full">
      <AttachmentTable
        title="事前確認時"
        headerClass={headL}
        includeEstimateRow={false}
        prefix="pre"
        value={value}
        onChange={onChange}
      />

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

            <PendingManagerApprovalTable title="事前確認時" />
          </div>
        </div>
      </div>

      <AttachmentTable
        title="見積確認時"
        headerClass={headD}
        includeEstimateRow={true}
        prefix="est"
        value={value}
        onChange={onChange}
      />

      <div className="mt-6 flex justify-end pr-10">
        <ApprovedDesignManagerTable title="契約前 見積確認時" />
      </div>
    </div>
  );
}
