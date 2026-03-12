import { inputClass, sectionWrap } from "./EizenFormStyles";
import { LabelCell, ValueCell } from "./EizenCommon";

type Props = {
  gyomuItakuCd: string;
  setGyomuItakuCd: (v: string) => void;
  gyomuItakuName: string;
  setGyomuItakuName: (v: string) => void;
  partnerCd: string;
  setPartnerCd: (v: string) => void;
  partnerName: string;
  setPartnerName: (v: string) => void;
};

export default function RequestSection(props: Props) {
  return (
    <section className={sectionWrap}>
      <div className="grid grid-cols-12">
        <div className="col-span-4 border border-yellow-400 bg-yellow-300 px-4 py-3 text-center text-xl font-bold text-slate-900">
          業務課依頼欄
        </div>
        <div className="col-span-8 border border-slate-300 bg-white" />

        <LabelCell>建託</LabelCell>
        <LabelCell>社員CD</LabelCell>
        <ValueCell className="col-span-2">
          <input value={props.gyomuItakuCd} onChange={(e) => props.setGyomuItakuCd(e.target.value)} className={inputClass} />
        </ValueCell>
        <LabelCell>氏名</LabelCell>
        <ValueCell className="col-span-2">
          <input value={props.gyomuItakuName} onChange={(e) => props.setGyomuItakuName(e.target.value)} className={inputClass} />
        </ValueCell>
        <ValueCell className="col-span-5" />

        <LabelCell>パートナーズ</LabelCell>
        <LabelCell>社員CD</LabelCell>
        <ValueCell className="col-span-2">
          <input value={props.partnerCd} onChange={(e) => props.setPartnerCd(e.target.value)} className={inputClass} />
        </ValueCell>
        <LabelCell>氏名</LabelCell>
        <ValueCell className="col-span-2">
          <input value={props.partnerName} onChange={(e) => props.setPartnerName(e.target.value)} className={inputClass} />
        </ValueCell>
        <ValueCell className="col-span-5" />
      </div>
    </section>
  );
}