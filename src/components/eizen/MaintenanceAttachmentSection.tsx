import React from "react";
import { inputClass, sectionHeader, sectionWrap, textareaClass } from "./EizenFormStyles";
import { Check, LabelCell, ValueCell } from "./EizenCommon";

type Props = {
  requiredDrawing: boolean;
  setRequiredDrawing: (v: boolean) => void;
  requiredOther: boolean;
  setRequiredOther: (v: boolean) => void;
  requiredOtherText: string;
  setRequiredOtherText: (v: string) => void;
  maintenanceRemark: string;
  setMaintenanceRemark: (v: string) => void;
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
      onClick={(e) => { if (!url) e.preventDefault(); }}
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
      accept="image/*,application/pdf"
      className="hidden"
      ref={(el) => { fileInputRefs.current[fieldKey] = el; }}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onFileSelected(fieldKey, file, setChecked);
      }}
    />
  );
}

export default function MaintenanceAttachmentSection(props: Props) {
  return (
    <section className={sectionWrap}>
      <div className={sectionHeader}>メンテ管理職添付欄</div>

      <div className="grid grid-cols-12">
        <LabelCell>必要書類関連</LabelCell>
        <ValueCell className="col-span-11">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Check label="図面" checked={props.requiredDrawing} onChange={(v) => props.onFileCheckChange("mente_kanri_zumen", v, props.setRequiredDrawing)} />
            <FileLink fieldKey="mente_kanri_zumen" attachments={props.attachments} getAttachmentUrl={props.getAttachmentUrl} />
            <HiddenFileInput fieldKey="mente_kanri_zumen" fileInputRefs={props.fileInputRefs} onFileSelected={props.onFileSelected} setChecked={props.setRequiredDrawing} />
            <Check label="その他" checked={props.requiredOther} onChange={(v) => props.onFileCheckChange("mente_kanri_sonota", v, props.setRequiredOther)} />
            <HiddenFileInput fieldKey="mente_kanri_sonota" fileInputRefs={props.fileInputRefs} onFileSelected={props.onFileSelected} setChecked={props.setRequiredOther} />
          </div>

          {props.requiredOther && (
            <div className="mt-3 max-w-md">
              <input value={props.requiredOtherText} onChange={(e) => props.setRequiredOtherText(e.target.value)} maxLength={100} className={inputClass} placeholder="その他" />
              <FileLink fieldKey="mente_kanri_sonota" attachments={props.attachments} getAttachmentUrl={props.getAttachmentUrl} />
            </div>
          )}
        </ValueCell>

        <LabelCell>備考</LabelCell>
        <ValueCell className="col-span-11">
          <textarea value={props.maintenanceRemark} onChange={(e) => props.setMaintenanceRemark(e.target.value)} rows={3} maxLength={200} className={textareaClass} />
        </ValueCell>
      </div>
    </section>
  );
}