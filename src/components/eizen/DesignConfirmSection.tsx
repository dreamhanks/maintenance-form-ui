import React from "react";
import { NeedFlag } from "./EizenFormTypes";
import { inputClass, sectionHeader, sectionWrap } from "./EizenFormStyles";
import { LabelCell, NeedSwitch, ValueCell } from "./EizenCommon";

type Props = {
  designNeed: NeedFlag;
  setDesignNeed: (v: NeedFlag) => void;
  employeeCd: string;
  setEmployeeCd: (v: string) => void;
  employeeName: string;
  setEmployeeName: (v: string) => void;
  confirmApplicationNeed: NeedFlag;
  setConfirmApplicationNeed: (v: NeedFlag) => void;
  designInstruction: string;
  setDesignInstruction: (v: string) => void;
  designAttachment: boolean;
  setDesignAttachment: (v: boolean) => void;
  designDapConfirm: boolean;
  setDesignDapConfirm: (v: boolean) => void;
  designRemark: string;
  setDesignRemark: (v: string) => void;
  attachments: Record<string, { filename: string; uploading: boolean }>;
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onFileCheckChange: (fieldKey: string, checked: boolean, setChecked: (v: boolean) => void) => void;
  onFileSelected: (fieldKey: string, file: File, setChecked: (v: boolean) => void) => void;
  getAttachmentUrl: (fieldKey: string) => string | null;
  showOnlyDesignNeedRow?: boolean;
  showOnlyDesignConfirmSection?: boolean;
  disableDesignDapConfirm?: boolean;
  disableDesignRemark?: boolean;
};

export default function DesignConfirmSection(props: Props) {
  const designNeedRow = (
    <div className="grid grid-cols-12">
        <div className="col-span-2 bg-[#DCE6F1] text-[#1e2d40] font-semibold border border-slate-300 text-center pt-3">設計管理職確認可否</div>
        <ValueCell className="col-span-2">
        <NeedSwitch name="designNeed" value={props.designNeed} onChange={props.setDesignNeed} />
        </ValueCell>
        <div className={`col-span-8 grid grid-cols-8 ${props.designNeed === "不要" ? "opacity-50 pointer-events-none" : ""}`}>
          <LabelCell>社員CD</LabelCell>
          <ValueCell className="col-span-2">
          <input value={props.employeeCd} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); props.setEmployeeCd(v); }} maxLength={6} inputMode="numeric" pattern="[0-9]*" className={inputClass} />
          </ValueCell>
          <LabelCell>氏名</LabelCell>
          <ValueCell className="col-span-4">
          <input value={props.employeeName} onChange={(e) => props.setEmployeeName(e.target.value)} className={inputClass} />
          </ValueCell>
        </div>
    </div>
  );

  const designConfirmHeader = (
    <div className="grid grid-cols-12">
        <div className={`${sectionHeader} col-span-7`}>◆設計確認</div>
        <div className={`${sectionHeader} col-span-5`}>大パ確認</div>
    </div>
  );

  const designConfirmContent = (
    <div className="grid grid-cols-12">
      <LabelCell>建築基準法</LabelCell>
      <LabelCell>確認申請の有無</LabelCell>
      <ValueCell className="col-span-5">
        <div className="grid grid-cols-12 gap-1">
          <div className="col-span-3 ">
            <NeedSwitch name="confirmApplicationNeed" value={props.confirmApplicationNeed} onChange={props.setConfirmApplicationNeed} />
          </div>
          <div className={`col-span-9 space-y-3 ${props.confirmApplicationNeed === "不要" ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex ">
              <label className="mb-1 w-24 block text-sm font-semibold text-slate-700">設計指示：</label>
              <input value={props.designInstruction} onChange={(e) => props.setDesignInstruction(e.target.value)} maxLength={20} className={inputClass} />
            </div>
            <div>
              <div className="flex items-center">
                  <label className="mb-1 w-24 block text-sm font-semibold text-slate-700">資料添付：</label>
                  <input
                    type="checkbox"
                    checked={props.designAttachment}
                    onChange={(e) => props.onFileCheckChange("design_shiryo_tenpu", e.target.checked, props.setDesignAttachment)}
                    className="h-4 w-4 rounded border-slate-400 text-[#17375E] focus:ring-[#17375E]"
                  />
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    ref={(el) => { props.fileInputRefs.current["design_shiryo_tenpu"] = el; }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) props.onFileSelected("design_shiryo_tenpu", file, props.setDesignAttachment);
                    }}
                  />
                  {props.attachments["design_shiryo_tenpu"] && (
                    props.attachments["design_shiryo_tenpu"].uploading ? (
                      <span className="ml-2 text-xs text-slate-400">アップロード中...</span>
                    ) : (
                      <a
                        href={props.getAttachmentUrl("design_shiryo_tenpu") ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-xs text-blue-600"
                        onClick={(e) => { if (!props.getAttachmentUrl("design_shiryo_tenpu")) e.preventDefault(); }}
                      >
                        {props.attachments["design_shiryo_tenpu"].filename}
                      </a>
                    )
                  )}
              </div>
            </div>
          </div>
        </div>
      </ValueCell>

      <ValueCell className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={props.designDapConfirm}
          onChange={(e) => props.setDesignDapConfirm(e.target.checked)}
          disabled={props.disableDesignDapConfirm}
          className={`h-5 w-5 rounded border-slate-400 text-[#17375E] focus:ring-[#17375E]${props.disableDesignDapConfirm ? " opacity-50 cursor-not-allowed" : ""}`}
        />
      </ValueCell>
      <ValueCell className="col-span-4">
          <textarea value={props.designRemark} onChange={(e) => props.setDesignRemark(e.target.value)} rows={3} maxLength={100} placeholder="備考" disabled={props.disableDesignRemark} className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#17375E] focus:ring-2 focus:ring-[#17375E]/20${props.disableDesignRemark ? " opacity-50 cursor-not-allowed" : ""}`} />
      </ValueCell>
    </div>
  );

  if (props.showOnlyDesignNeedRow) {
    return (
      <section className={sectionWrap}>
        {designNeedRow}
      </section>
    );
  }

  if (props.showOnlyDesignConfirmSection) {
    return (
      <section className={sectionWrap}>
        {designConfirmHeader}
        {designConfirmContent}
      </section>
    );
  }

  return (
    <section className={sectionWrap}>
      {designNeedRow}
      {designConfirmHeader}
      {designConfirmContent}
    </section>
  );
}