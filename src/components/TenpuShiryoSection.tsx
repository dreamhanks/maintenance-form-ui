import React, { useRef } from "react";

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

function CB({
  label,
  required,
}: {
  label: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-2 mr-6 whitespace-nowrap">
      <input type="checkbox" className="h-4 w-4" />
      <span className="text-sm">
        {label} {required ? <span className="font-semibold">【必須】</span> : null}
      </span>
    </label>
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
      {/* shaft */}
      <rect
        x="18"
        y="12"
        width="185"
        height="4"
        fill="white"
        stroke="#1d4ed8"
        strokeWidth="2"
      />
      {/* head (open triangle) */}
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
          {/* 大きい空白エリア（下にラベル） */}
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
            <button type="button" onClick={openFileDialog} className="px-2 py-1 border border-black">
              ◆{title}添付資料
            </button>
          </th>
          <th className={`${inner} ${cell} ${pad} ${headerClass}`}>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </th>
          <th className={`${inner} ${cell} ${pad} ${headerClass} text-center w-24`}>
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
            <CB label="配置図" required />
            <CB label="平面図" />
            <CB label="立面図" />
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <label className="inline-flex items-center gap-2 mr-2">
                <input type="checkbox" className="h-4 w-4" />
                <span className="text-sm">その他：</span>
              </label>
              <input
                className="border border-black h-6 w-[180px] px-2 text-sm"
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
            <CB label="建物外観４面" required />
            <CB label="工事部位" required />
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <label className="inline-flex items-center gap-2 mr-2">
                <input type="checkbox" className="h-4 w-4" />
                <span className="text-sm">その他：</span>
              </label>
              <input
                className="border border-black h-6 w-[180px] px-2 text-sm"
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
              <CB label="事見積書" required />
              <CB label="工程表" />
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

export function TenpuShiryoSection() {
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
          {/* 左の大きい下矢印 */}
          <div className="pl-6 pt-3">
            <BigDownArrow />
          </div>

          {/* 中央（設計管理職）＋右（事前確認時 承認） */}
          <div className="flex-1 flex items-center justify-end gap-8 pr-10">
            {/* 設計管理職 */}
            <div className="flex flex-col items-center">
              <DesignManagerBox />
              <div className="mt-2 text-sm font-semibold whitespace-nowrap">
                ↑ 設計コメントがある場合は押印
              </div>
            </div>

            {/* 左向きアウトライン矢印 */}
            <div className="pt-2">
              <OutlineLeftArrow />
            </div>

            {/* 事前確認時 承認テーブル */}
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
