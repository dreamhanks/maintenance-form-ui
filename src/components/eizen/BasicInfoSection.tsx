import { inputClass, sectionHeader, sectionWrap, textareaClass } from "./EizenFormStyles";
import { Check, LabelCell, ValueCell, YesNoSwitch } from "./EizenCommon";
import { YesNo } from "./EizenFormTypes";
import JaDatePicker from "../JaDatePicker";

type Props = {
  furigana: string;
  setFurigana: (v: string) => void;
  customerName: string;
  setCustomerName: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  propertyCd: string;
  setPropertyCd: (v: string) => void;
  buildingName: string;
  setBuildingName: (v: string) => void;
  completionDate: string;
  setCompletionDate: (v: string) => void;
  productName: string;
  setProductName: (v: string) => void;
  repairHistory: string;
  setRepairHistory: (v: string) => void;

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
  fixedVendorName: string;
  setFixedVendorName: (v: string) => void;
  fixedVendorCd: string;
  setFixedVendorCd: (v: string) => void;
  proposalDate: string;
  setProposalDate: (v: string) => void;
  contractDate: string;
  setContractDate: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
};

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
                <input value={props.propertyCd} onChange={(e) => props.setPropertyCd(e.target.value)} className={inputClass} />
                <div>ー</div>
                <input className={inputClass} />
                <div>ー</div>
                <input className={inputClass} />
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
            <textarea value={props.repairHistory} onChange={(e) => props.setRepairHistory(e.target.value)} rows={3} className={textareaClass} />
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
            <div>
                <Check label="その他" checked={props.otherWork} onChange={props.setOtherWork} />
                <span>(
                    <input className={`w-48 border-b border-black outline-none bg-transparent`} type="text"/>
                    )
                </span>
            </div>
          </div>

          {props.otherWork && (
            <div className="mt-3 max-w-md">
              <input value={props.otherWorkText} onChange={(e) => props.setOtherWorkText(e.target.value)} className={inputClass} placeholder="その他" />
            </div>
          )}

          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">工事内容詳細：</label>
            <textarea value={props.workDetail} onChange={(e) => props.setWorkDetail(e.target.value)} rows={3} className={textareaClass} />
          </div>
        </ValueCell>

        <LabelCell>要望注意点等</LabelCell>
        <div className="col-span-11 grid grid-cols-12">
          <LabelCell>オーナー様</LabelCell>
          <ValueCell className="col-span-11">
            <div className="mb-3">
              <YesNoSwitch name="owner" value={props.ownerFlag} onChange={props.setOwnerFlag} />
            </div>
            <input value={props.ownerText} onChange={(e) => props.setOwnerText(e.target.value)} className={inputClass} placeholder="内容" />
          </ValueCell>

          <LabelCell>入居者様</LabelCell>
          <ValueCell className="col-span-11">
            <div className="mb-3">
              <YesNoSwitch name="resident" value={props.residentFlag} onChange={props.setResidentFlag} />
            </div>
            <input value={props.residentText} onChange={(e) => props.setResidentText(e.target.value)} className={inputClass} placeholder="内容" />
          </ValueCell>

          <LabelCell>近隣様</LabelCell>
          <ValueCell className="col-span-11">
            <div className="mb-3">
              <YesNoSwitch name="neighbor" value={props.neighborFlag} onChange={props.setNeighborFlag} />
            </div>
            <input value={props.neighborText} onChange={(e) => props.setNeighborText(e.target.value)} className={inputClass} placeholder="内容" />
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
                <input value={props.plannedVendorCd} onChange={(e) => props.setPlannedVendorCd(e.target.value)} className={inputClass} />
                <div>ー</div>
                <input className={inputClass} />
            </div>
          </ValueCell>
          {/* <LabelCell>ー</LabelCell> */}
          <div className="col-span-4 bg-slate-100 border border-slate-300" />
          {/* <ValueCell className="col-span-4 bg-slate-300" /> */}

          <LabelCell>確定業者名</LabelCell>
          <ValueCell className="col-span-3">
            <input value={props.fixedVendorName} onChange={(e) => props.setFixedVendorName(e.target.value)} className={inputClass} />
          </ValueCell>
          <LabelCell>業者CD</LabelCell>
          <ValueCell className="col-span-3">
            <div className="flex items-center justify-center gap-2">
                <input value={props.fixedVendorCd} onChange={(e) => props.setFixedVendorCd(e.target.value)} className={inputClass} />
                <div>ー</div>
                <input className={inputClass} />
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