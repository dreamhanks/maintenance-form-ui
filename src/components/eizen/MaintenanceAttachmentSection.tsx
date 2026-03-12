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
};

export default function MaintenanceAttachmentSection(props: Props) {
  return (
    <section className={sectionWrap}>
      <div className={sectionHeader}>メンテ管理職添付欄</div>

      <div className="grid grid-cols-12">
        <LabelCell>必要書類関連</LabelCell>
        <ValueCell className="col-span-11">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Check label="図面" checked={props.requiredDrawing} onChange={props.setRequiredDrawing} />
            <Check label="その他" checked={props.requiredOther} onChange={props.setRequiredOther} />
          </div>

          {props.requiredOther && (
            <div className="mt-3 max-w-md">
              <input value={props.requiredOtherText} onChange={(e) => props.setRequiredOtherText(e.target.value)} className={inputClass} placeholder="その他" />
            </div>
          )}
        </ValueCell>

        <LabelCell>備考</LabelCell>
        <ValueCell className="col-span-11">
          <textarea value={props.maintenanceRemark} onChange={(e) => props.setMaintenanceRemark(e.target.value)} rows={3} className={textareaClass} />
        </ValueCell>
      </div>
    </section>
  );
}