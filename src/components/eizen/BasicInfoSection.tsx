import { useEffect, useRef, useState } from "react";
import { inputClass, sectionHeader, sectionWrap, textareaClass } from "./EizenFormStyles";
import { Check, LabelCell, ValueCell, YesNoSwitch } from "./EizenCommon";
import { YesNo } from "./EizenFormTypes";
import JaDatePicker from "../JaDatePicker";
import type { RelatedFormDto } from "../../form/api";

type Props = {
  furigana: string;
  setFurigana: (v: string) => void;
  customerName: string;
  setCustomerName: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  propertyCd: string;
  setPropertyCd: (v: string) => void;
  propertyCd2: string;
  setPropertyCd2: (v: string) => void;
  propertyCd3: string;
  setPropertyCd3: (v: string) => void;
  buildingName: string;
  setBuildingName: (v: string) => void;
  completionDate: string;
  setCompletionDate: (v: string) => void;
  productName: string;
  setProductName: (v: string) => void;
  relatedForms: RelatedFormDto[];
  editId: number | null;

  roof: boolean;
  setRoof: (v: boolean) => void;
  outsideWall: boolean;
  setOutsideWall: (v: boolean) => void;
  balcony: boolean;
  setBalcony: (v: boolean) => void;
  commonArea: boolean;
  setCommonArea: (v: boolean) => void;
  privateArea: boolean;
  setPrivateArea: (v: boolean) => void;
  otherWork: boolean;
  setOtherWork: (v: boolean) => void;
  otherWorkText: string;
  setOtherWorkText: (v: string) => void;
  workDetail: string;
  setWorkDetail: (v: string) => void;

  ownerFlag: YesNo;
  setOwnerFlag: (v: YesNo) => void;
  ownerText: string;
  setOwnerText: (v: string) => void;
  residentFlag: YesNo;
  setResidentFlag: (v: YesNo) => void;
  residentText: string;
  setResidentText: (v: string) => void;
  neighborFlag: YesNo;
  setNeighborFlag: (v: YesNo) => void;
  neighborText: string;
  setNeighborText: (v: string) => void;

  plannedVendorName: string;
  setPlannedVendorName: (v: string) => void;
  plannedVendorCd: string;
  setPlannedVendorCd: (v: string) => void;
  plannedVendorCd2: string;
  setPlannedVendorCd2: (v: string) => void;
  fixedVendorName: string;
  setFixedVendorName: (v: string) => void;
  fixedVendorCd: string;
  setFixedVendorCd: (v: string) => void;
  fixedVendorCd2: string;
  setFixedVendorCd2: (v: string) => void;
  proposalDate: string;
  setProposalDate: (v: string) => void;
  contractDate: string;
  setContractDate: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
};

function RelatedFormsDropdown({ editId, relatedForms }: { editId: number | null; relatedForms: RelatedFormDto[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen]);

  if (editId == null) {
    return <div className={inputClass + " bg-slate-50 text-slate-400 cursor-default"}>保存後に表示されます</div>;
  }
  if (relatedForms.length === 0) {
    return <div className={inputClass + " bg-slate-50 text-slate-400 cursor-default"}>履歴なし</div>;
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsOpen(!isOpen); }}
        className={inputClass + " cursor-pointer flex items-center justify-between border border-slate-300 rounded-md bg-white"}
      >
        <span className="text-slate-500">--- 過去の改修履歴を選択 ---</span>
        <span className="text-xs text-slate-400 ml-2">▼</span>
      </div>
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-slate-300 bg-white shadow-lg">
          {relatedForms.map((rf) => (
            <div
              key={rf.formRecordId}
              role="button"
              tabIndex={0}
              onClick={() => {
                window.open(`/form/${rf.formRecordId}`, "_blank");
                setIsOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.open(`/form/${rf.formRecordId}`, "_blank");
                  setIsOpen(false);
                }
              }}
              className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              {rf.documentNo || `(文書番号なし) [${rf.buildingCode2}]`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BasicInfoSection(props: Props) {
  return (
    <section className={sectionWrap}>
      <div className={sectionHeader}>【物件概要】</div>

      <div className="grid grid-cols-12">
        <LabelCell>フリガナ</LabelCell>
        <ValueCell className="col-span-11">
          <input value={props.furigana} onChange={(e) => props.setFurigana(e.target.value)} className={inputClass} />
        </ValueCell>

        <LabelCell>お客様名</LabelCell>
        <ValueCell className="col-span-11">
          <input value={props.customerName} onChange={(e) => props.setCustomerName(e.target.value)} className={inputClass} />
        </ValueCell>

        <LabelCell>建物情報</LabelCell>
        <div className="col-span-11 grid grid-cols-12">
          <LabelCell>住所</LabelCell>
          <ValueCell className="col-span-11">
            <input value={props.address} onChange={(e) => props.setAddress(e.target.value)} className={inputClass} />
          </ValueCell>

          <LabelCell>物件CD</LabelCell>
          <ValueCell className="col-span-3">
            <div className="flex items-center justify-center gap-1" >
                <input
                  type="text"
                  value={props.propertyCd}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    if (v.length <= 7) props.setPropertyCd(v);
                  }}
                  maxLength={7}
                  placeholder="7桁"
                  className={inputClass}
                />
                <div>ー</div>
                <input
                  type="text"
                  value={props.propertyCd2}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    if (v.length <= 3) props.setPropertyCd2(v);
                  }}
                  maxLength={3}
                  placeholder="3桁"
                  className={inputClass}
                />
                <div>ー</div>
                <input
                  type="text"
                  value={props.propertyCd3}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    if (v.length <= 2) props.setPropertyCd3(v);
                  }}
                  maxLength={2}
                  placeholder="2桁"
                  className={inputClass}
                />
            </div>
          </ValueCell>
          <LabelCell>建物名称</LabelCell>
          <ValueCell className="col-span-7">
            <input value={props.buildingName} onChange={(e) => props.setBuildingName(e.target.value)} className={inputClass} />
          </ValueCell>

          <LabelCell>完成年月日</LabelCell>
          <ValueCell className="col-span-3">
            <JaDatePicker value={props.completionDate} onChange={props.setCompletionDate} className={inputClass} />
          </ValueCell>
          <LabelCell>商品名称</LabelCell>
          <ValueCell className="col-span-7">
            <input value={props.productName} onChange={(e) => props.setProductName(e.target.value)} className={inputClass} />
          </ValueCell>

          <LabelCell>過去の改修履歴</LabelCell>
          <ValueCell className="col-span-11">
            <RelatedFormsDropdown editId={props.editId} relatedForms={props.relatedForms} />
          </ValueCell>
        </div>

        <LabelCell>改修工事内容</LabelCell>
        <ValueCell className="col-span-11">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Check label="屋根" checked={props.roof} onChange={props.setRoof} />
            <Check label="外壁" checked={props.outsideWall} onChange={props.setOutsideWall} />
            <Check label="バルコニー・ベランダ" checked={props.balcony} onChange={props.setBalcony} />
            <Check label="共用部（廊下・エントランス）" checked={props.commonArea} onChange={props.setCommonArea} />
            <Check label="専有部（室内）" checked={props.privateArea} onChange={props.setPrivateArea} />
            <div className="inline-flex items-center gap-1">
                <Check label="その他" checked={props.otherWork} onChange={props.setOtherWork} />
                <span>(</span>
                <input value={props.otherWorkText} onChange={(e) => props.setOtherWorkText(e.target.value)} maxLength={60} className="w-48 border-b border-black outline-none bg-transparent" type="text"/>
                <span>)</span>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">工事内容詳細：</label>
            <textarea value={props.workDetail} onChange={(e) => props.setWorkDetail(e.target.value)} rows={3} maxLength={60} className={textareaClass} />
          </div>
        </ValueCell>

        <LabelCell>要望注意点等</LabelCell>
        <div className="col-span-11 grid grid-cols-12">
          <LabelCell>オーナー様</LabelCell>
          <ValueCell className="col-span-11">
            <div className="mb-3">
              <YesNoSwitch name="owner" value={props.ownerFlag} onChange={(v) => { props.setOwnerFlag(v); if (v === "なし") props.setOwnerText(""); }} />
            </div>
            <input value={props.ownerText} onChange={(e) => props.setOwnerText(e.target.value)} disabled={props.ownerFlag === "なし"} maxLength={100} className={inputClass + (props.ownerFlag === "なし" ? " opacity-50 cursor-not-allowed bg-gray-100" : "")} placeholder="内容" />
          </ValueCell>

          <LabelCell>入居者様</LabelCell>
          <ValueCell className="col-span-11">
            <div className="mb-3">
              <YesNoSwitch name="resident" value={props.residentFlag} onChange={(v) => { props.setResidentFlag(v); if (v === "なし") props.setResidentText(""); }} />
            </div>
            <input value={props.residentText} onChange={(e) => props.setResidentText(e.target.value)} disabled={props.residentFlag === "なし"} maxLength={100} className={inputClass + (props.residentFlag === "なし" ? " opacity-50 cursor-not-allowed bg-gray-100" : "")} placeholder="内容" />
          </ValueCell>

          <LabelCell>近隣様</LabelCell>
          <ValueCell className="col-span-11">
            <div className="mb-3">
              <YesNoSwitch name="neighbor" value={props.neighborFlag} onChange={(v) => { props.setNeighborFlag(v); if (v === "なし") props.setNeighborText(""); }} />
            </div>
            <input value={props.neighborText} onChange={(e) => props.setNeighborText(e.target.value)} disabled={props.neighborFlag === "なし"} maxLength={100} className={inputClass + (props.neighborFlag === "なし" ? " opacity-50 cursor-not-allowed bg-gray-100" : "")} placeholder="内容" />
          </ValueCell>
        </div>

        <LabelCell>主要業者情報</LabelCell>
        <div className="col-span-11 grid grid-cols-12">
          <LabelCell>予定業者名</LabelCell>
          <ValueCell className="col-span-3">
            <input value={props.plannedVendorName} onChange={(e) => props.setPlannedVendorName(e.target.value)} className={inputClass} />
          </ValueCell>
          <LabelCell>業者CD</LabelCell>
          <ValueCell className="col-span-3 ">
            <div className="flex items-center justify-center gap-2">
                <input value={props.plannedVendorCd} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); props.setPlannedVendorCd(v); }} maxLength={6} inputMode="numeric" pattern="[0-9]*" className={inputClass} />
                <div>ー</div>
                <input value={props.plannedVendorCd2} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); props.setPlannedVendorCd2(v); }} maxLength={3} inputMode="numeric" pattern="[0-9]*" className={inputClass} />
            </div>
          </ValueCell>
          <div className="col-span-4 bg-slate-100 border border-slate-300" />

          <LabelCell>確定業者名</LabelCell>
          <ValueCell className="col-span-3">
            <input value={props.fixedVendorName} onChange={(e) => props.setFixedVendorName(e.target.value)} className={inputClass} />
          </ValueCell>
          <LabelCell>業者CD</LabelCell>
          <ValueCell className="col-span-3">
            <div className="flex items-center justify-center gap-2">
                <input value={props.fixedVendorCd} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); props.setFixedVendorCd(v); }} maxLength={6} inputMode="numeric" pattern="[0-9]*" className={inputClass} />
                <div>ー</div>
                <input value={props.fixedVendorCd2} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); props.setFixedVendorCd2(v); }} maxLength={3} inputMode="numeric" pattern="[0-9]*" className={inputClass} />
            </div>
          </ValueCell>
          <div className="col-span-4 bg-slate-100 border border-slate-300" />
          {/* <LabelCell>ー</LabelCell> */}
          {/* <ValueCell className="col-span-4" /> */}
        </div>

        {/* <LabelCell >営繕提案予定日</LabelCell> */}
        <div className=" bg-slate-100 text-slate-800 font-semibold border border-slate-300 pt-1">
            <div className="text-center">営繕提案</div>
            <div className="text-center">予定日</div>
        </div>
        <ValueCell className="col-span-3">
          <JaDatePicker value={props.proposalDate} onChange={props.setProposalDate} className={inputClass} />
        </ValueCell>
        <LabelCell><div className="text-center pt-1">契約予定日</div></LabelCell>
        <ValueCell className="col-span-3">
          <JaDatePicker value={props.contractDate} onChange={props.setContractDate} className={inputClass} />
        </ValueCell>
        <LabelCell><div className="text-center pt-1">着工予定日</div></LabelCell>
        <ValueCell className="col-span-3">
          <JaDatePicker value={props.startDate} onChange={props.setStartDate} className={inputClass} />
        </ValueCell>
      </div>
    </section>
  );
}