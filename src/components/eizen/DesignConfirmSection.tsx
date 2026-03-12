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
  designAttachment: string;
  setDesignAttachment: (v: string) => void;
  designDapConfirm: boolean;
  setDesignDapConfirm: (v: boolean) => void;
  designRemark: string;
  setDesignRemark: (v: string) => void;
};

export default function DesignConfirmSection(props: Props) {
  return (
    <section className={sectionWrap}>
        <div className="grid grid-cols-12">
            <div className="col-span-2 bg-slate-100 text-slate-800 font-semibold border border-slate-300 text-center pt-3">設計管理職確認可否</div>
            <ValueCell className="col-span-2">
            <NeedSwitch name="designNeed" value={props.designNeed} onChange={props.setDesignNeed} />
            </ValueCell>
            <LabelCell>社員CD</LabelCell>
            <ValueCell className="col-span-2">
            <input value={props.employeeCd} onChange={(e) => props.setEmployeeCd(e.target.value)} className={inputClass} />
            </ValueCell>
            <LabelCell>氏名</LabelCell>
            <ValueCell className="col-span-4">
            <input value={props.employeeName} onChange={(e) => props.setEmployeeName(e.target.value)} className={inputClass} />
            </ValueCell>
        </div>

        <div className="grid grid-cols-12">
            <div className={`${sectionHeader} col-span-7`}>◆設計確認</div>
            <div className={`${sectionHeader} col-span-5`}>大パ確認</div>
        </div>

      <div className="grid grid-cols-12">
        <LabelCell>建築基準法</LabelCell>
        <LabelCell>確認申請の有無</LabelCell>
        <ValueCell className="col-span-5">
          <div className="grid grid-cols-12 gap-1">
            <div className="col-span-3 ">
              <NeedSwitch name="confirmApplicationNeed" value={props.confirmApplicationNeed} onChange={props.setConfirmApplicationNeed} />
            </div>
            <div className="col-span-9 space-y-3">
              <div className="flex ">
                <label className="mb-1 w-24 block text-sm font-semibold text-slate-700">設計指示：</label>
                <input value={props.designInstruction} onChange={(e) => props.setDesignInstruction(e.target.value)} className={inputClass} />
              </div>
              <div>
                <div className="flex ">
                    <label className="mb-1 w-24 block text-sm font-semibold text-slate-700">資料添付：</label>
                    <input value={props.designAttachment} onChange={(e) => props.setDesignAttachment(e.target.value)} className={inputClass} />
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
            className="h-5 w-5 rounded border-slate-400 text-sky-600 focus:ring-sky-500"
          />
        </ValueCell>
        <ValueCell className="col-span-4">
            <textarea value={props.designRemark} onChange={(e) => props.setDesignRemark(e.target.value)} rows={3} placeholder="備考" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
          {/* <input value={props.designRemark} onChange={(e) => props.setDesignRemark(e.target.value)} className={inputClass} placeholder="備考" /> */}
        </ValueCell>
      </div>
    </section>
  );
}