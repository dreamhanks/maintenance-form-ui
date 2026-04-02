import React from "react";
import { OrderResult } from "./EizenFormTypes";
import { inputClass, sectionWrap, textareaClass } from "./EizenFormStyles";
import { LabelCell, ValueCell } from "./EizenCommon";
import { Link } from "react-router-dom";

type Props = {
  estimateOutput: boolean;
  setEstimateOutput: (v: boolean) => void;
  estimateAttach: boolean;
  setEstimateAttach: (v: boolean) => void;
  estimateRemark: string;
  setEstimateRemark: (v: string) => void;

  maintenanceEstimateAttach: boolean;
  setMaintenanceEstimateAttach: (v: boolean) => void;
  maintenanceEstimateRemark: string;
  setMaintenanceEstimateRemark: (v: string) => void;

  orderResult: OrderResult;
  setOrderResult: (v: OrderResult) => void;
  generalApplyAttach: boolean;
  setGeneralApplyAttach: (v: boolean) => void;
  generalApplyNotNeed: boolean;
  setGeneralApplyNotNeed: (v: boolean) => void;
  lostOrder: boolean;
  setLostOrder: (v: boolean) => void;
  finalReason: string;
  setFinalReason: (v: string) => void;

  attachments: Record<string, { filename: string; uploading: boolean }>;
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onFileCheckChange: (fieldKey: string, checked: boolean, setChecked: (v: boolean) => void) => void;
  onFileSelected: (fieldKey: string, file: File, setChecked: (v: boolean) => void) => void;
  getAttachmentUrl: (fieldKey: string) => string | null;
};

function FileLink({ fieldKey, attachments, getAttachmentUrl }: {
  fieldKey: string;
  attachments: Record<string, { filename: string; uploading: boolean }>;
  getAttachmentUrl: (fieldKey: string) => string | null;
}) {
  const att = attachments[fieldKey];
  if (!att) return null;
  if (att.uploading) return <div className="text-xs text-slate-400 mt-1">アップロード中...</div>;
  const url = getAttachmentUrl(fieldKey);
  return (
    <a
      href={url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-blue-600 cursor-pointer mt-1 block"
      onClick={(e) => {
        console.log("[FileLink click]", { fieldKey, url });
        if (!url) {
          e.preventDefault();
          console.warn("[FileLink] URL is null — file not yet uploaded to server");
        }
      }}
    >
      {att.filename}
    </a>
  );
}

function HiddenFileInput({ fieldKey, fileInputRefs, onFileSelected, setChecked }: {
  fieldKey: string;
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onFileSelected: (fieldKey: string, file: File, setChecked: (v: boolean) => void) => void;
  setChecked: (v: boolean) => void;
}) {
  return (
    <input
      type="file"
      accept="application/pdf"
      className="hidden"
      ref={(el) => { fileInputRefs.current[fieldKey] = el; }}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onFileSelected(fieldKey, file, setChecked);
      }}
    />
  );
}

export default function EstimateFinalSection(props: Props) {
  return (
    <section className={sectionWrap}>
      <div className="grid grid-cols-12">
        <div className="col-span-4 border border-yellow-400 bg-yellow-300 px-4 py-3 text-center text-xl font-bold text-slate-900">
          ◆大パ見積書添付
        </div>
        <div className="col-span-3 border border-slate-300 bg-slate-200 px-4 py-3 text-center text-xl font-bold text-slate-900">
          メンテ管理職確認
        </div>
        <div className="col-span-5 border border-yellow-400 bg-yellow-300 px-4 py-3 text-center text-xl font-bold text-slate-900">
          ◆大パ最終確認欄
        </div>

        <LabelCell>見積書</LabelCell>
        <div className="col-span-3 grid grid-cols-12">
          <Link to="/mitsumori" className="col-span-8 border border-slate-400 px-3 py-2 underline">業者見積依頼書出力</Link>
          <ValueCell className="col-span-4 flex items-center justify-center border border-slate-400 gap-2">
            <input type="checkbox" checked={props.estimateOutput} onChange={(e) => props.onFileCheckChange("vendor_estimate_request", e.target.checked, props.setEstimateOutput)} className="h-5 w-5 rounded border-slate-400 text-sky-600 focus:ring-sky-500" />
            <div>出力</div>
            <HiddenFileInput fieldKey="vendor_estimate_request" fileInputRefs={props.fileInputRefs} onFileSelected={props.onFileSelected} setChecked={props.setEstimateOutput} />
            <FileLink fieldKey="vendor_estimate_request" attachments={props.attachments} getAttachmentUrl={props.getAttachmentUrl} />
          </ValueCell>
          <div className="col-span-8 border border-slate-400 px-3 py-2">見積書の添付</div>
          <ValueCell className="col-span-4 flex items-center justify-center border border-slate-400 gap-2">
            <input type="checkbox" checked={props.estimateAttach} onChange={(e) => props.onFileCheckChange("estimate_attached", e.target.checked, props.setEstimateAttach)} className="h-5 w-5 rounded border-slate-400 text-sky-600 focus:ring-sky-500" />
            <div>見積書</div>
            <HiddenFileInput fieldKey="estimate_attached" fileInputRefs={props.fileInputRefs} onFileSelected={props.onFileSelected} setChecked={props.setEstimateAttach} />
            <FileLink fieldKey="estimate_attached" attachments={props.attachments} getAttachmentUrl={props.getAttachmentUrl} />
          </ValueCell>
          <ValueCell className="col-span-12 border border-slate-400">
            <input value={props.estimateRemark} onChange={(e) => props.setEstimateRemark(e.target.value)} className={inputClass} placeholder="備考" />
          </ValueCell>
        </div>

        <LabelCell>見積書</LabelCell>
        <div className="col-span-2 grid grid-cols-12">
          <div className="col-span-6 border border-slate-400 px-3 pt-3">見積書添付</div>
          <ValueCell className="col-span-6 flex items-center justify-center border border-slate-400 gap-2">
            <input type="checkbox" checked={props.maintenanceEstimateAttach} onChange={(e) => props.setMaintenanceEstimateAttach(e.target.checked)} className="h-5 w-5 rounded border-slate-400 text-sky-600 focus:ring-sky-500" />
            <div>見積書</div>
          </ValueCell>
          <ValueCell className="col-span-12 pt-5">
            <input value={props.maintenanceEstimateRemark} onChange={(e) => props.setMaintenanceEstimateRemark(e.target.value)} className={inputClass} placeholder="備考" />
          </ValueCell>
        </div>

        <div className="col-span-5 grid grid-cols-12">
          {/* <LabelCell>受注</LabelCell> */}
          <ValueCell className="col-span-3 flex items-center justify-center border border-slate-400 gap-2">
            <input type="checkbox" className="h-5 w-5 rounded border-slate-400 text-sky-600 focus:ring-sky-500" />
            {/* <input type="radio" name="orderResult" checked={props.orderResult === "受注"} onChange={() => props.setOrderResult("受注")} className="h-5 w-5 border-slate-400 text-sky-600 focus:ring-sky-500" /> */}
            <div>受注</div>
          </ValueCell>
          {/* <LabelCell>失注</LabelCell> */}
          <ValueCell className="col-span-3 flex items-center justify-center border border-slate-400 gap-2">
            <input type="checkbox" className="h-5 w-5 rounded border-slate-400 text-sky-600 focus:ring-sky-500" />
            <div>失注</div>
            {/* <input type="radio" name="orderResult" checked={props.orderResult === "失注"} onChange={() => props.setOrderResult("失注")} className="h-5 w-5 border-slate-400 text-sky-600 focus:ring-sky-500" /> */}
          </ValueCell>
          <div className="col-span-4 border border-slate-400 text-center pt-2">大パ管理職確認</div>
          <ValueCell className="col-span-2 flex items-center justify-center">
            <input type="checkbox" className="h-5 w-5 rounded border-slate-400 text-sky-600 focus:ring-sky-500" />
          </ValueCell>
          <div className="col-span-3 border border-slate-400 text-center">一般申請</div>
          {/* <ValueCell className="col-span-3 flex items-center justify-center">
            <input type="checkbox" checked={props.generalApplyAttach} onChange={(e) => props.setGeneralApplyAttach(e.target.checked)} className="h-5 w-5 rounded border-slate-400 text-sky-600 focus:ring-sky-500" />
          </ValueCell> */}
            
          <ValueCell className="col-span-3 flex items-center justify-center border border-slate-400 gap-2">
            <input type="checkbox" checked={props.lostOrder} onChange={(e) => props.setLostOrder(e.target.checked)} className="h-5 w-5 rounded border-slate-400 text-sky-600 focus:ring-sky-500" />
            <div>添付</div>
          </ValueCell>
          <ValueCell className="col-span-6 flex items-center justify-center border border-slate-400 gap-2">
            <input type="checkbox" checked={props.generalApplyNotNeed} onChange={(e) => props.setGeneralApplyNotNeed(e.target.checked)} className="h-5 w-5 rounded border-slate-400 text-sky-600 focus:ring-sky-500" />
            <div>一般申請不要</div>
          </ValueCell>
        <ValueCell className="col-span-12 flex items-start justify-center border border-slate-400 gap-2">
            <div className="w-12">理由:</div>
          <textarea value={props.finalReason} onChange={(e) => props.setFinalReason(e.target.value)} rows={1} className={textareaClass} />
        </ValueCell>
        </div>

        {/* <LabelCell>理由</LabelCell> */}
        {/* <ValueCell className="col-span-11">
          <textarea value={props.finalReason} onChange={(e) => props.setFinalReason(e.target.value)} rows={3} className={textareaClass} />
        </ValueCell> */}
      </div>
    </section>
  );
}