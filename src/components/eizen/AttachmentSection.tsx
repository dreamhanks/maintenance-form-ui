import { inputClass, sectionHeader, sectionWrap, textareaClass } from "./EizenFormStyles";
import { Check, LabelCell, ValueCell } from "./EizenCommon";

type Props = {
  drawing: boolean;
  setDrawing: (v: boolean) => void;
  otherMaterial: boolean;
  setOtherMaterial: (v: boolean) => void;
  photo4side: boolean;
  setPhoto4side: (v: boolean) => void;
  photoPart: boolean;
  setPhotoPart: (v: boolean) => void;
  photoOther: boolean;
  setPhotoOther: (v: boolean) => void;
  photoOtherText: string;
  setPhotoOtherText: (v: string) => void;
  attachRemark: string;
  setAttachRemark: (v: string) => void;
  dapManagerConfirmDrawing: boolean;
  setDapManagerConfirmDrawing: (v: boolean) => void;
  dapManagerConfirmPhoto: boolean;
  setDapManagerConfirmPhoto: (v: boolean) => void;
};

export default function AttachmentSection(props: Props) {
  return (
    <section className={sectionWrap}>
        <div className={sectionHeader}>
            <div className="flex justify-between items-center">
                <div className="col-span-11">◆事前確認時 添付資料</div>
                <div>大パ管理職確認</div>
            </div>
        </div>
      <div className="grid grid-cols-12">
        <LabelCell>図面</LabelCell>
        <ValueCell className="col-span-10">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Check label="図面" checked={props.drawing} onChange={props.setDrawing} />
            <Check label="その他資料" checked={props.otherMaterial} onChange={props.setOtherMaterial} />
            <span className="text-sm text-slate-600">
              ※図面：配置図、平面図、立面図、矩計図、屋根伏せ図、案内図は必ず添付すること。
            </span>
          </div>
        </ValueCell>
        <ValueCell className="flex items-center justify-center">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-slate-400 text-sky-600 focus:ring-sky-500"
          />
        </ValueCell>

        <LabelCell>現況写真</LabelCell>
        <ValueCell className="col-span-10">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Check label="建物外観4面【必須】" checked={props.photo4side} onChange={props.setPhoto4side} />
            <Check label="工事部位【必須】" checked={props.photoPart} onChange={props.setPhotoPart} />
            <Check label="その他" checked={props.photoOther} onChange={props.setPhotoOther} />
          </div>
          {props.photoOther && (
            <div className="mt-3 max-w-md">
              <input value={props.photoOtherText} onChange={(e) => props.setPhotoOtherText(e.target.value)} className={inputClass} placeholder="その他" />
            </div>
          )}
        </ValueCell>
        <ValueCell className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={props.dapManagerConfirmPhoto || props.dapManagerConfirmDrawing}
            onChange={(e) => {
              props.setDapManagerConfirmDrawing(e.target.checked);
              props.setDapManagerConfirmPhoto(e.target.checked);
            }}
            className="h-5 w-5 rounded border-slate-400 text-sky-600 focus:ring-sky-500"
          />
        </ValueCell>

        <LabelCell>備考</LabelCell>
        <ValueCell className="col-span-11">
          <textarea value={props.attachRemark} onChange={(e) => props.setAttachRemark(e.target.value)} rows={3} className={textareaClass} />
        </ValueCell>
      </div>
    </section>
  );
}