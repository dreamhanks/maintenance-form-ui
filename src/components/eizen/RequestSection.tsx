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
  onGyomuSearch?: () => void;
  onPartnerSearch?: () => void;
};

export default function RequestSection(props: Props) {
  const kenDisabled = !!props.partnerCd;
  const partDisabled = !!props.gyomuItakuCd;

  return (
    <section className={sectionWrap}>
      <div className="grid grid-cols-12">
        <div className="col-span-4 border border-[#17375E] bg-[#17375E] px-4 py-3 text-center text-xl font-bold text-[#F5C518]">
          業務課依頼欄
        </div>
        <div className="col-span-8 border border-slate-300 bg-white" />

        <LabelCell>建託</LabelCell>
        <LabelCell>社員CD</LabelCell>
        <ValueCell className="col-span-2">
          <input value={props.gyomuItakuCd} onChange={(e) => props.setGyomuItakuCd(e.target.value.replace(/[^0-9]/g, ""))} maxLength={6} inputMode="numeric" pattern="[0-9]*" disabled={kenDisabled} className={`${inputClass}${kenDisabled ? " opacity-50 cursor-not-allowed" : ""}`} />
        </ValueCell>
        <LabelCell>氏名</LabelCell>
        <ValueCell className="col-span-2">
          <div className="flex items-center gap-2">
            <input value={props.gyomuItakuName} readOnly className={`${inputClass} bg-slate-50 cursor-default${kenDisabled ? " opacity-50" : ""}`} />
            <button
              type="button"
              onClick={props.onGyomuSearch}
              disabled={kenDisabled}
              className={`rounded-lg bg-[#17375E] px-3 py-2 text-sm font-semibold text-white hover:bg-[#17375E]/90 whitespace-nowrap${kenDisabled ? " opacity-50 cursor-not-allowed" : ""}`}
            >
              検索
            </button>
          </div>
        </ValueCell>
        <ValueCell className="col-span-5" />

        <LabelCell>パートナーズ</LabelCell>
        <LabelCell>社員CD</LabelCell>
        <ValueCell className="col-span-2">
          <input value={props.partnerCd} onChange={(e) => props.setPartnerCd(e.target.value.replace(/[^0-9]/g, ""))} maxLength={6} inputMode="numeric" pattern="[0-9]*" disabled={partDisabled} className={`${inputClass}${partDisabled ? " opacity-50 cursor-not-allowed" : ""}`} />
        </ValueCell>
        <LabelCell>氏名</LabelCell>
        <ValueCell className="col-span-2">
          <div className="flex items-center gap-2">
            <input value={props.partnerName} readOnly className={`${inputClass} bg-slate-50 cursor-default${partDisabled ? " opacity-50" : ""}`} />
            <button
              type="button"
              onClick={props.onPartnerSearch}
              disabled={partDisabled}
              className={`rounded-lg bg-[#17375E] px-3 py-2 text-sm font-semibold text-white hover:bg-[#17375E]/90 whitespace-nowrap${partDisabled ? " opacity-50 cursor-not-allowed" : ""}`}
            >
              検索
            </button>
          </div>
        </ValueCell>
        <ValueCell className="col-span-5" />
      </div>
    </section>
  );
}
