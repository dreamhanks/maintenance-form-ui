import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckRow, NeedFlag, OrderResult, YesNo } from "../components/eizen/EizenFormTypes";
import { formApi, attachmentApi, workflowApi, mitsumoriApi } from "../form/api";
import type { WorkflowStepDto } from "../form/api";
import { useAuth } from "../auth/AuthContext";
import { FullForm, initialForm } from "../form/formTypes";
import { inputClass } from "../components/eizen/EizenFormStyles";
import BasicInfoSection from "../components/eizen/BasicInfoSection";
import AttachmentSection from "../components/eizen/AttachmentSection";
import TemporaryCheckSection from "../components/eizen/TemporaryCheckSection";
import TemporaryConfirmSection from "../components/eizen/TemporaryConfirmSection";
import MaintenanceAttachmentSection from "../components/eizen/MaintenanceAttachmentSection";
import DesignConfirmSection from "../components/eizen/DesignConfirmSection";
import EstimateFinalSection from "../components/eizen/EstimateFinalSection";
import RequestSection from "../components/eizen/RequestSection";
import ApprovalFlowSection from "../components/eizen/ApprovalFlowSection";

const makeRowsPage1 = (): CheckRow[] => [
  {
    id: "r1",
    category: "仮設",
    item: "第3者侵入防止策",
    need: "",
    checks: {
      "仮囲い（フラットパネル）": false,
      "仮囲い（ケアネット）": false,
      "仮囲い（ガードフェンス）": false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r2",
    category: "仮設",
    item: "仮設電気",
    need: "",
    checks: {
      "既存電気利用可（共益費内）": false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r3",
    category: "仮設",
    item: "仮設水道",
    need: "",
    checks: {
      "既存設備利用可（共益費内）": false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r4",
    category: "仮設",
    item: "仮設トイレ",
    need: "",
    checks: {
      "リース手配（要見積）": false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r5",
    category: "仮設",
    item: "電線防護管",
    need: "",
    checks: {
      "設置部分図面添付": false,
    },
    amount: "",
    amountNumeric: true,
    amountFirst: true,
    unit: "m必要（要見積）",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r6",
    category: "仮設",
    item: "工事駐車場",
    need: "",
    checks: {
      外部: false,
      場内: false,
    },
    amount: "",
    amountNumeric: true,
    unit: "台必要（要見積）",
    remark: "",
    managerConfirm: false,
    variant: "checksInConfirm",
  },
  {
    id: "r6b",
    category: "仮設",
    item: "（別途指示事項）",
    need: "",
    checks: {},
    remark: "",
    managerConfirm: false,
    variant: "betsuto",
  },
  {
    id: "r7",
    category: "足場",
    item: "足場設置",
    need: "",
    checks: {
      全周: false,
      一部: false,
      "仮設図面添付": false,
    },
    amount: "",
    amountNumeric: true,
    unit: "㎡",
    amountPrefix: "新築時",
    remark: "",
    managerConfirm: false,
    variant: "twoLine",
    splitAt: 1,
  },
  {
    id: "r8",
    category: "足場",
    item: "足場届出（機械設置届）",
    need: "",
    checks: {
      "建託準備届出実施": false,
    },
    amount: "",
    amountNumeric: true,
    amountFirst: true,
    unit: "円必要（要見積）",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r9",
    category: "足場",
    item: "昇降階段、巾木、中桟等",
    need: "",
    checks: {
      昇降階段: false,
      巾木: false,
      中桟: false,
      安全ブロック: false,
    },
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r10",
    category: "足場",
    item: "飛散防止措置",
    need: "",
    checks: {
      朝顔: false,
      防音シート: false,
      防音パネル: false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r11",
    category: "足場",
    item: "エントランス・共用部養生",
    need: "",
    checks: {
      柱養生材: false,
      床養生材: false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r12",
    category: "足場",
    item: "足場設置部の植栽剪定",
    need: "",
    checks: {
      剪定: false,
      図面添付: false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r13",
    category: "足場",
    item: "足場解体後の清掃費用",
    need: "",
    checks: {},
    amount: "",
    remark: "",
    managerConfirm: false,
    variant: "fullInput",
  },
  {
    id: "r13b",
    category: "足場",
    item: "（別途指示事項）",
    need: "",
    checks: {},
    remark: "",
    managerConfirm: false,
    variant: "betsuto",
  },
  {
    id: "r14",
    category: "防犯",
    item: "夜間照明・防犯カメラ",
    need: "",
    checks: {
      夜間灯: false,
      防犯カメラ: false,
      チューブライト: false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r15",
    category: "予算",
    item: "産廃費用",
    need: "",
    checks: {
      金額: false,
      その他: false,
    },
    otherText: "",
    amount: "",
    amountNumeric: true,
    unit: "円",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r16",
    category: "予算",
    item: "荷揚げ費用",
    need: "",
    checks: {
      レッカー: false,
      ユニック: false,
      "手運び（人工）": false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
  },
];

const makeRowsPage2 = (): CheckRow[] => [
  {
    id: "p2r1",
    category: "届出",
    item: "道路使用",
    need: "",
    checks: {
      "必要回数": false,
      搬入作業: false,
      道路占用: false,
      その他: false,
    },
    amount: "",
    amountNumeric: true,
    unit: "回",
    otherText: "",
    remark: "",
    managerConfirm: false,
    variant: "twoLine",
  },
  {
    id: "p2r2",
    category: "届出",
    item: "道路占用",
    need: "",
    checks: {
      "必要面積": false,
      足場設置: false,
      仮囲い設置: false,
      その他: false,
    },
    amount: "",
    amountNumeric: true,
    unit: "㎡",
    otherText: "",
    remark: "",
    managerConfirm: false,
    variant: "twoLine",
  },
  {
    id: "p2r3",
    category: "届出",
    item: "交通誘導員",
    need: "",
    checks: {
      "必要金額": false,
      道路使用: false,
      道路占用: false,
      その他: false,
    },
    amount: "",
    amountNumeric: true,
    unit: "円",
    otherText: "",
    remark: "",
    managerConfirm: false,
    variant: "twoLine",
  },
  {
    id: "p2r4",
    category: "届出",
    item: "アスベスト含有調査",
    need: "",
    checks: {
      "必要金額": false,
      その他: false,
    },
    amount: "",
    amountNumeric: true,
    unit: "円",
    otherText: "",
    remark: "",
    managerConfirm: false,
    variant: "twoLine",
  },
  {
    id: "p2r5",
    category: "届出",
    item: "景観条例対象届出",
    need: "",
    checks: {
      "必要金額": false,
      その他: false,
    },
    amount: "",
    amountNumeric: true,
    unit: "円",
    otherText: "",
    remark: "",
    managerConfirm: false,
    variant: "twoLine",
  },
  {
    id: "p2r5b",
    category: "届出",
    item: "（別途指示事項）",
    need: "",
    checks: {},
    remark: "",
    managerConfirm: false,
    variant: "betsuto",
  },
  {
    id: "p2r6",
    category: "調査",
    item: "打診（タイル・塗装）",
    need: "",
    checks: {
      タイル面: false,
      塗装面: false,
      素地面: false,
      その他: false,
    },
    otherText: "",
    amount: "",
    amountNumeric: true,
    unit: "円",
    remark: "",
    managerConfirm: false,
    variant: "twoLineReverse",
    line2Check: "必要金額",
    line2Checked: false,
  },
  {
    id: "p2r7",
    category: "調査",
    item: "下地調整",
    need: "",
    checks: {
      必要箇所: false,
    },
    otherText: "",
    amount: "",
    amountNumeric: true,
    unit: "円",
    remark: "",
    managerConfirm: false,
    variant: "twoLineReverse",
    line2Check: "必要金額",
    line2Checked: false,
  },
  {
    id: "p2r8",
    category: "確認",
    item: "新築時タイル等保存資料",
    need: "",
    checks: {},
    amount: "",
    remark: "",
    managerConfirm: false,
    variant: "fullInput",
    remarkExtra: [
      { label: "備考　保管先：", value: "" },
      { label: "状態確証及び枚数添付：", value: "", fileUploadFieldKey: "jotai_kakunin_tenpu", fileCheckboxValue: false },
    ],
  },
  {
    id: "p2r9",
    category: "確認",
    item: "施工業者の建設業許可確認",
    need: "",
    checks: {
      問題なし: false,
      期限切れ: false,
      要更新: false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "p2r10",
    category: "確認",
    item: "契約支店の建設業許可確認",
    need: "",
    checks: {
      一般申請起票: false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
    variant: "noRadioTwoLine",
    radioColKeys: ["問題なし", "許可未取得"],
    radioColAsRadio: true,
  },
  {
    id: "p2r11",
    category: "確認",
    item: "家電リサイクル法",
    need: "",
    checks: {
      お客様処分: false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
    variant: "noRadioTwoLine",
    radioColKeys: ["対象あり", "対象なし"],
    radioColAsRadio: true,
  },
  {
    id: "p2r12",
    category: "確認",
    item: "フロン排出抑制法",
    need: "",
    checks: {
      お客様処分: false,
      その他: false,
    },
    otherText: "",
    remark: "",
    managerConfirm: false,
    variant: "noRadioTwoLine",
    radioColKeys: ["対象あり", "対象なし"],
    radioColAsRadio: true,
  },
  {
    id: "p2r13",
    category: "確認",
    item: "防水工事等保証の確認",
    need: "",
    checks: {
      保証年数: false,
      その他: false,
    },
    amount: "",
    amountNumeric: true,
    amountInteger: true,
    unit: "年",
    otherText: "",
    remark: "",
    managerConfirm: false,
    variant: "twoLine",
  },
];

export default function EizenRequestAllInOnePage() {
 const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editId = id ? Number(id) : null;
  const [submitting, setSubmitting] = useState(false);
  const savedSnapshotRef = useRef<string | null>(null);
  const isInitialLoad = useRef(true);
  const [showMitsumoriDialog, setShowMitsumoriDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  // Attachment state: fieldKey → { filename, uploading }
  const [attachments, setAttachments] = useState<Record<string, { filename: string; uploading: boolean }>>({});
  // Pending file selections — only flushed to backend on save button click
  const pendingFilesRef = useRef<Record<string, File>>({});
  // Field keys whose existing server-side attachments should be deleted on save
  const deletedFieldKeysRef = useRef<Set<string>>(new Set());
  // Hidden file input refs per fieldKey
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Restore all form fields from a draft-format object (used by API load only)
  const restoreFromDraft = useCallback((d: any) => {
    if (d.furigana) setFurigana(d.furigana);
    if (d.customerName) setCustomerName(d.customerName);
    if (d.address) setAddress(d.address);
    if (d.propertyCd) setPropertyCd(d.propertyCd);
    if (d.propertyCd2) setPropertyCd2(d.propertyCd2);
    if (d.propertyCd3) setPropertyCd3(d.propertyCd3);
    if (d.buildingName) setBuildingName(d.buildingName);
    if (d.completionDate) setCompletionDate(d.completionDate);
    if (d.productName) setProductName(d.productName);
    if (d.repairHistory) setRepairHistory(d.repairHistory);
    if (d.roof != null) setRoof(d.roof);
    if (d.outsideWall != null) setOutsideWall(d.outsideWall);
    if (d.balcony != null) setBalcony(d.balcony);
    if (d.commonArea != null) setCommonArea(d.commonArea);
    if (d.privateArea != null) setPrivateArea(d.privateArea);
    if (d.otherWork != null) setOtherWork(d.otherWork);
    if (d.otherWorkText) setOtherWorkText(d.otherWorkText);
    if (d.workDetail) setWorkDetail(d.workDetail);
    if (d.ownerFlag) setOwnerFlag(d.ownerFlag);
    if (d.ownerText) setOwnerText(d.ownerText);
    if (d.residentFlag) setResidentFlag(d.residentFlag);
    if (d.residentText) setResidentText(d.residentText);
    if (d.neighborFlag) setNeighborFlag(d.neighborFlag);
    if (d.neighborText) setNeighborText(d.neighborText);
    if (d.plannedVendorName) setPlannedVendorName(d.plannedVendorName);
    if (d.plannedVendorCd) setPlannedVendorCd(d.plannedVendorCd);
    if (d.plannedVendorCd2) setPlannedVendorCd2(d.plannedVendorCd2);
    if (d.fixedVendorName) setFixedVendorName(d.fixedVendorName);
    if (d.fixedVendorCd) setFixedVendorCd(d.fixedVendorCd);
    if (d.fixedVendorCd2) setFixedVendorCd2(d.fixedVendorCd2);
    if (d.proposalDate) setProposalDate(d.proposalDate);
    if (d.contractDate) setContractDate(d.contractDate);
    if (d.startDate) setStartDate(d.startDate);
    if (d.photo4side != null) setPhoto4side(d.photo4side);
    if (d.photoPart != null) setPhotoPart(d.photoPart);
    if (d.photoOther != null) setPhotoOther(d.photoOther);
    if (d.photoOtherText) setPhotoOtherText(d.photoOtherText);
    if (d.attachRemark) setAttachRemark(d.attachRemark);
    if (d.dapManagerConfirmPhoto != null) setDapManagerConfirmPhoto(d.dapManagerConfirmPhoto);
    // Merge saved row state with current factory definitions so structural
    // fields (variant, fileUploadFieldKey, line2Check, etc.) added after
    // the form was saved are preserved while user-entered values are restored.
    const mergeRows = (saved: CheckRow[] | undefined, factory: CheckRow[]): CheckRow[] => {
      if (!saved) return factory;
      return factory.map((factoryRow) => {
        const savedRow = saved.find((r) => r.id === factoryRow.id);
        if (!savedRow) return factoryRow;
        // Merge remarkExtra by index, keeping factory's structural fields and saved values
        const mergedRemarkExtra = factoryRow.remarkExtra?.map((fe, idx) => ({
          ...fe,
          value: savedRow.remarkExtra?.[idx]?.value ?? fe.value,
          fileCheckboxValue: savedRow.remarkExtra?.[idx]?.fileCheckboxValue ?? fe.fileCheckboxValue,
        }));
        // Saved values first, then factory structural fields override
        return {
          ...savedRow,
          variant: factoryRow.variant,
          line2Check: factoryRow.line2Check,
          radioColKeys: factoryRow.radioColKeys,
          radioColAsRadio: factoryRow.radioColAsRadio,
          splitAt: factoryRow.splitAt,
          amountFirst: factoryRow.amountFirst,
          amountNumeric: factoryRow.amountNumeric,
          amountInteger: factoryRow.amountInteger,
          amountPrefix: factoryRow.amountPrefix,
          remarkExtra: mergedRemarkExtra,
        };
      });
    };
    if (d.page1Rows) setPage1Rows(mergeRows(d.page1Rows, makeRowsPage1()));
    if (d.page2Rows) setPage2Rows(mergeRows(d.page2Rows, makeRowsPage2()));
    if (d.siteInstruction1) setSiteInstruction1(d.siteInstruction1);
    if (d.siteInstruction2) setSiteInstruction2(d.siteInstruction2);
    if (d.sectionKasetsu != null) setSectionKasetsu(d.sectionKasetsu);
    if (d.sectionAshiba != null) setSectionAshiba(d.sectionAshiba);
    if (d.sectionBouhan != null) setSectionBouhan(d.sectionBouhan);
    if (d.sectionYosan != null) setSectionYosan(d.sectionYosan);
    if (d.grpTodokede != null) setGrpTodokede(d.grpTodokede);
    if (d.grpChosa != null) setGrpChosa(d.grpChosa);
    if (d.grpKakunin != null) setGrpKakunin(d.grpKakunin);
    if (d.requiredDrawing != null) setRequiredDrawing(d.requiredDrawing);
    if (d.requiredOther != null) setRequiredOther(d.requiredOther);
    if (d.requiredOtherText) setRequiredOtherText(d.requiredOtherText);
    if (d.maintenanceRemark) setMaintenanceRemark(d.maintenanceRemark);
    if (d.designNeed) setDesignNeed(d.designNeed);
    if (d.employeeCd) setEmployeeCd(d.employeeCd);
    if (d.employeeName) setEmployeeName(d.employeeName);
    if (d.confirmApplicationNeed) setConfirmApplicationNeed(d.confirmApplicationNeed);
    if (d.designInstruction) setDesignInstruction(d.designInstruction);
    if (d.designAttachment != null) setDesignAttachment(!!d.designAttachment);
    if (d.designDapConfirm != null) setDesignDapConfirm(d.designDapConfirm);
    if (d.designRemark) setDesignRemark(d.designRemark);
    if (d.estimateOutput != null) setEstimateOutput(d.estimateOutput);
    if (d.estimateAttach != null) setEstimateAttach(d.estimateAttach);
    if (d.estimateRemark) setEstimateRemark(d.estimateRemark);
    if (d.maintenanceEstimateAttach != null) setMaintenanceEstimateAttach(d.maintenanceEstimateAttach);
    if (d.maintenanceEstimateRemark) setMaintenanceEstimateRemark(d.maintenanceEstimateRemark);
    if (d.orderResult) setOrderResult(d.orderResult);
    // Migration: old saved forms may have juchuCheck/shitchuCheck instead of orderResult
    if (!d.orderResult) {
      if (d.juchuCheck === true) setOrderResult("受注");
      else if (d.shitchuCheck === true) setOrderResult("失注");
    }
    if (d.daipaFinalConfirm != null) setDaipaFinalConfirm(d.daipaFinalConfirm);
    if (d.lostOrder != null) setLostOrder(d.lostOrder);
    if (d.generalApplyAttach != null) setGeneralApplyAttach(d.generalApplyAttach);
    if (d.okyakusamaMitsumoriAttach != null) setOkyakusamaMitsumoriAttach(d.okyakusamaMitsumoriAttach);
    if (d.keiyakushoSakuseiAttach != null) setKeiyakushoSakuseiAttach(d.keiyakushoSakuseiAttach);
    if (d.finalReason) setFinalReason(d.finalReason);
    if (d.gyomuItakuCd) setGyomuItakuCd(d.gyomuItakuCd);
    if (d.gyomuItakuName) setGyomuItakuName(d.gyomuItakuName);
    if (d.partnerCd) setPartnerCd(d.partnerCd);
    if (d.partnerName) setPartnerName(d.partnerName);
  }, []);

  // For new (unsaved) forms there's nothing to load — finish init immediately
  useEffect(() => {
    if (editId) return;
    isInitialLoad.current = false;
  }, [editId]);

  // Load form detail on edit — restore all fields from payloadJson.uiState
  const formLoadedRef = useRef(false);
  useEffect(() => {
    if (!editId || formLoadedRef.current) return;
    formLoadedRef.current = true;
    formApi.get(editId).then((data: any) => {
      if (data.documentNumber) setDocumentNo(data.documentNumber);
      if (data.createdDate) setIssueDate(data.createdDate);
      if (data.creatorRole) setCreatorRole(data.creatorRole);

      if (!data.payloadJson) {
        setTimeout(() => {
          savedSnapshotRef.current = JSON.stringify(buildDraftRef.current());
          isInitialLoad.current = false;
        }, 0);
        return;
      }
      try {
        const p = typeof data.payloadJson === "string" ? JSON.parse(data.payloadJson) : data.payloadJson;
        // Restore from uiState (complete round-trip of all fields)
        if (p?.uiState) {
          restoreFromDraft(p.uiState);
          setTimeout(() => {
            savedSnapshotRef.current = JSON.stringify(buildDraftRef.current());
            isInitialLoad.current = false;
          }, 0);
          return;
        }
        // Fallback: restore from structured FullForm fields (legacy payloads)
        const prop = p?.property;
        if (prop) {
          if (prop.furigana) setFurigana(prop.furigana);
          if (prop.customerName) setCustomerName(prop.customerName);
          const b = prop.building;
          if (b) {
            if (b.address) setAddress(b.address);
            if (b.propertyCode) setPropertyCd(b.propertyCode);
            if (b.propertyCode2) setPropertyCd2(b.propertyCode2);
            if (b.propertyCode3) setPropertyCd3(b.propertyCode3);
            if (b.buildingName) setBuildingName(b.buildingName);
            if (b.completionYm) setCompletionDate(b.completionYm);
            if (b.branchName) setProductName(b.branchName);
            if (b.renovationHistory) setRepairHistory(b.renovationHistory);
          }
          if (prop.renovationContent) setWorkDetail(prop.renovationContent);
          const req = prop.requests;
          if (req) {
            if (req.owner) {
              setOwnerFlag(req.owner.has === "1" ? "あり" : req.owner.has === "0" ? "なし" : "");
              if (req.owner.note) setOwnerText(req.owner.note);
            }
            if (req.resident) {
              setResidentFlag(req.resident.has === "1" ? "あり" : req.resident.has === "0" ? "なし" : "");
              if (req.resident.note) setResidentText(req.resident.note);
            }
            if (req.neighbors) {
              setNeighborFlag(req.neighbors.has === "1" ? "あり" : req.neighbors.has === "0" ? "なし" : "");
              if (req.neighbors.note) setNeighborText(req.neighbors.note);
            }
          }
          const v = prop.vendor;
          if (v) {
            if (v.plannedVendorName) setPlannedVendorName(v.plannedVendorName);
            if (v.confirmed?.name) setFixedVendorName(v.confirmed.name);
          }
          const s = prop.schedule;
          if (s) {
            const toDate = (ymd: any) => ymd?.y && ymd?.m && ymd?.d ? `${ymd.y}-${ymd.m}-${ymd.d}` : "";
            const pd = toDate(s.proposal); if (pd) setProposalDate(pd);
            const cd = toDate(s.contract); if (cd) setContractDate(cd);
            const sd = toDate(s.start); if (sd) setStartDate(sd);
          }
        }
        const k = p?.kasetsu;
        if (k) {
          if (k.section_kasetsu != null) setSectionKasetsu(k.section_kasetsu);
          if (k.section_ashiba != null) setSectionAshiba(k.section_ashiba);
          if (k.section_bouhan != null) setSectionBouhan(k.section_bouhan);
          if (k.section_yosan != null) setSectionYosan(k.section_yosan);
        }
        const t = p?.todokede;
        if (t) {
          if (t.grp_todokede != null) setGrpTodokede(t.grp_todokede);
          if (t.grp_chosa != null) setGrpChosa(t.grp_chosa);
          if (t.grp_kakunin != null) setGrpKakunin(t.grp_kakunin);
        }
      } catch { /* ignore corrupt payloadJson */ }

      if (data.workflowSteps) setWorkflowSteps(data.workflowSteps);

      // Defer the clean-snapshot capture until after React has committed all
      // batched setState calls from this .then() callback.
      setTimeout(() => {
        savedSnapshotRef.current = JSON.stringify(buildDraftRef.current());
        isInitialLoad.current = false;
      }, 0);
    }).catch(() => {
      // Even on failure, release the initial-load gate so the user isn't stuck
      isInitialLoad.current = false;
    });
  }, [editId, restoreFromDraft]);

  // Load related forms (older phases of same building) on edit
  useEffect(() => {
    if (!editId) return;
    formApi.relatedForms(editId).then(setRelatedForms).catch(() => {});
  }, [editId]);

  // Load existing attachments on edit
  useEffect(() => {
    if (!editId) return;
    attachmentApi.list(editId).then((list) => {
      const map: Record<string, { filename: string; uploading: boolean }> = {};
      for (const att of list) {
        map[att.fieldKey] = { filename: att.originalFilename ?? att.fieldKey, uploading: false };
      }
      setAttachments(map);
    }).catch(() => {});
  }, [editId]);

  const handleFileCheckChange = (fieldKey: string, checked: boolean, setChecked: (v: boolean) => void) => {
    if (checked) {
      // Open file picker — actual selection handled by handleFileSelected
      const input = fileInputRefs.current[fieldKey];
      if (input) {
        input.value = "";
        input.click();
      }
    } else {
      // Uncheck → drop pending selection and mark existing server file for deletion on save.
      // No backend call here — deferred until the user clicks save.
      setChecked(false);
      delete pendingFilesRef.current[fieldKey];
      if (editId && attachments[fieldKey]) {
        deletedFieldKeysRef.current.add(fieldKey);
      }
      setAttachments((prev) => {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      });
    }
  };

  const handleFileSelected = (fieldKey: string, file: File, setChecked: (v: boolean) => void) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('PDFまたは画像ファイルのみアップロードできます');
      return;
    }
    const MAX_SIZE = 30 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error('ファイルサイズは30MB以下にしてください');
      return;
    }
    // Store the File in memory only — uploaded to backend on save button click.
    setChecked(true);
    pendingFilesRef.current[fieldKey] = file;
    deletedFieldKeysRef.current.delete(fieldKey);
    setAttachments((prev) => ({ ...prev, [fieldKey]: { filename: file.name + "（未保存）", uploading: false } }));
  };

  const getAttachmentUrl = (fieldKey: string): string | null => {
    // Pending (unsaved) selection takes precedence — use a blob URL
    const pending = pendingFilesRef.current[fieldKey];
    if (pending) {
      return URL.createObjectURL(pending);
    }
    if (editId && !deletedFieldKeysRef.current.has(fieldKey)) {
      return attachmentApi.openUrl(editId, fieldKey);
    }
    return null;
  };

  const [documentNo, setDocumentNo] = useState("");
  const todayStr = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, "0") + "-" + String(new Date().getDate()).padStart(2, "0");
  const [issueDate, setIssueDate] = useState(todayStr);

  const [furigana, setFurigana] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [propertyCd, setPropertyCd] = useState("");
  const [propertyCd2, setPropertyCd2] = useState("");
  const [propertyCd3, setPropertyCd3] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [productName, setProductName] = useState("");
  const [repairHistory, setRepairHistory] = useState("");
  const [relatedForms, setRelatedForms] = useState<import("../form/api").RelatedFormDto[]>([]);

  const [roof, setRoof] = useState(false);
  const [outsideWall, setOutsideWall] = useState(false);
  const [balcony, setBalcony] = useState(false);
  const [commonArea, setCommonArea] = useState(false);
  const [privateArea, setPrivateArea] = useState(false);
  const [otherWork, setOtherWork] = useState(false);
  const [otherWorkText, setOtherWorkText] = useState("");
  const [workDetail, setWorkDetail] = useState("");

  const [ownerFlag, setOwnerFlag] = useState<YesNo>("");
  const [ownerText, setOwnerText] = useState("");
  const [residentFlag, setResidentFlag] = useState<YesNo>("");
  const [residentText, setResidentText] = useState("");
  const [neighborFlag, setNeighborFlag] = useState<YesNo>("");
  const [neighborText, setNeighborText] = useState("");

  const [plannedVendorName, setPlannedVendorName] = useState("");
  const [plannedVendorCd, setPlannedVendorCd] = useState("");
  const [plannedVendorCd2, setPlannedVendorCd2] = useState("");
  const [fixedVendorName, setFixedVendorName] = useState("");
  const [fixedVendorCd, setFixedVendorCd] = useState("");
  const [fixedVendorCd2, setFixedVendorCd2] = useState("");
  const [proposalDate, setProposalDate] = useState("");
  const [contractDate, setContractDate] = useState("");
  const [startDate, setStartDate] = useState("");

  const [photo4side, setPhoto4side] = useState(false);
  const [photoPart, setPhotoPart] = useState(false);
  const [photoOther, setPhotoOther] = useState(false);
  const [photoOtherText, setPhotoOtherText] = useState("");
  const [attachRemark, setAttachRemark] = useState("");
  const [dapManagerConfirmPhoto, setDapManagerConfirmPhoto] = useState(false);

  const [page1Rows, setPage1Rows] = useState<CheckRow[]>(makeRowsPage1());
  const [page2Rows, setPage2Rows] = useState<CheckRow[]>(makeRowsPage2());
  const [siteInstruction1, setSiteInstruction1] = useState("");
  const [siteInstruction2, setSiteInstruction2] = useState("");

  const [sectionKasetsu, setSectionKasetsu] = useState(false);
  const [sectionAshiba, setSectionAshiba] = useState(false);
  const [sectionBouhan, setSectionBouhan] = useState(false);
  const [sectionYosan, setSectionYosan] = useState(false);
  const [grpTodokede, setGrpTodokede] = useState(false);
  const [grpChosa, setGrpChosa] = useState(false);
  const [grpKakunin, setGrpKakunin] = useState(false);

  const [requiredDrawing, setRequiredDrawing] = useState(false);
  const [requiredOther, setRequiredOther] = useState(false);
  const [requiredOtherText, setRequiredOtherText] = useState("");
  const [maintenanceRemark, setMaintenanceRemark] = useState("");

  const [designNeed, setDesignNeed] = useState<NeedFlag>("");
  const [employeeCd, setEmployeeCd] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [confirmApplicationNeed, setConfirmApplicationNeed] = useState<NeedFlag>("");
  const [designInstruction, setDesignInstruction] = useState("");
  const [designAttachment, setDesignAttachment] = useState(false);
  const [designDapConfirm, setDesignDapConfirm] = useState(false);
  const [designRemark, setDesignRemark] = useState("");

  const [estimateOutput, setEstimateOutput] = useState(false);
  const [estimateAttach, setEstimateAttach] = useState(false);
  const [estimateRemark, setEstimateRemark] = useState("");
  const [maintenanceEstimateAttach, setMaintenanceEstimateAttach] = useState(false);
  const [maintenanceEstimateRemark, setMaintenanceEstimateRemark] = useState("");
  const [orderResult, setOrderResult] = useState<OrderResult>("");
  const juchuCheck = orderResult === "受注";
  const shitchuCheck = orderResult === "失注";
  const [daipaFinalConfirm, setDaipaFinalConfirm] = useState(false);
  const [lostOrder, setLostOrder] = useState(false);
  const [generalApplyAttach, setGeneralApplyAttach] = useState(false);
  const [okyakusamaMitsumoriAttach, setOkyakusamaMitsumoriAttach] = useState(false);
  const [keiyakushoSakuseiAttach, setKeiyakushoSakuseiAttach] = useState(false);
  const [finalReason, setFinalReason] = useState("");

  const [gyomuItakuCd, setGyomuItakuCd] = useState("");
  const [gyomuItakuName, setGyomuItakuName] = useState("");
  const [partnerCd, setPartnerCd] = useState("");
  const [partnerName, setPartnerName] = useState("");

  const { user } = useAuth();
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStepDto[]>([]);
  const [creatorRole, setCreatorRole] = useState<string | null>(null);
  // While the workflow is being fetched on edit, hold the UI in a neutral
  // "checking permission" state to avoid the read-only banner flickering on
  // for matching users before the workflow response arrives.
  const [workflowLoading, setWorkflowLoading] = useState<boolean>(!!editId);

  // Compute read-only mode based on current pending step's required role.
  // - New (unsaved) form → editable
  // - admin → editable
  // - user.role matches the role of the pending step → editable
  // - otherwise → read-only
  const pendingStep = workflowSteps.find((s) => s.status === "pending");
  const isEditableRaw =
    !editId ||
    user?.role === "admin" ||
    (!!pendingStep && user?.role === pendingStep.stepName);
  // While loading on an edit page, treat as not-editable but suppress the banner.
  const isEditable = workflowLoading ? false : isEditableRaw;
  const readOnlyNotice = !workflowLoading && !isEditable && pendingStep
    ? `現在 ${pendingStep.stepLabel} が確認中です。編集できません。`
    : null;

  // Per-section edit gating: at the early workflow steps (1: 大パ担当者①, 2: 大パ管理職①)
  // only 物件概要 + 事前確認時 添付資料 are editable. Admin bypasses this.
  const pendingStepNumber = pendingStep?.stepNumber ?? 0;
  const isAdmin = user?.role === "admin";
  const isNewForm = !editId;
  const createdByDapaTanto = creatorRole === "大パ担当者";
  const createdByDapaKacho = creatorRole === "大パ管理職";

  const canEditBasicAndAttachment =
    isAdmin ||
    isNewForm ||
    (isEditable && pendingStepNumber === 1) ||
    (isEditable && pendingStepNumber === 2 && createdByDapaKacho);

  const canEditDapManagerConfirm =
    isAdmin ||
    (isNewForm && user?.role === "大パ管理職") ||
    (isEditable && pendingStepNumber === 2);

  const canEditTemporarySections =
    isAdmin ||
    (isEditable && pendingStepNumber === 3) ||
    (isEditable && pendingStepNumber === 5 && createdByDapaTanto) ||
    (isEditable && pendingStepNumber === 6 && createdByDapaKacho);

  const canEditMaintenanceSection =
    isAdmin || (isEditable && pendingStepNumber === 3);

  const disableDapConfirmAndRemark =
    !isAdmin && isEditable && pendingStepNumber === 3;

  const disableMainContent =
    !isAdmin && (
      (pendingStepNumber === 5 && createdByDapaTanto) ||
      (pendingStepNumber === 6 && createdByDapaKacho)
    );

  const disableCategoryCheckbox =
    !isAdmin && (
      (pendingStepNumber === 5 && createdByDapaTanto) ||
      (pendingStepNumber === 6 && createdByDapaKacho)
    );

  // DEBUG: step 5 permission flags
  console.log("DEBUG step5:", {
    userRole: user?.role,
    pendingStepNumber,
    creatorRole,
    createdByDapaTanto,
    isEditable,
    workflowLoading,
    disableMainContent,
    canEditTemporarySections,
    disableDapConfirmAndRemark,
    sectionKasetsu,
    sectionAshiba,
    sectionBouhan,
    sectionYosan,
    grpTodokede,
    grpChosa,
    grpKakunin,
  });

  const canEditDesignNeedRow =
    isAdmin || (isEditable && pendingStepNumber === 3);

  const canEditDesignConfirmSection =
    isAdmin || (isEditable && pendingStepNumber === 4);

  const disableDesignDapConfirm =
    !isAdmin && isEditable && pendingStepNumber === 4;

  const disableDesignRemark =
    !isAdmin && isEditable && pendingStepNumber === 4;

  const isStep9 = !isAdmin && isEditable && pendingStepNumber === 9;
  const isStep9CreatedByTanto = isStep9 && createdByDapaTanto;
  const isStep9CreatedByKacho = isStep9 && createdByDapaKacho;

  const showOnlyDaipaManagerConfirm = isStep9CreatedByTanto;
  const showOnlyDaipaFinalAndRequest = isStep9CreatedByKacho;

  const canEditEstimateSection =
    isAdmin ||
    (isEditable && pendingStepNumber === 5 && createdByDapaTanto) ||
    (isEditable && pendingStepNumber === 6 && createdByDapaKacho) ||
    (isEditable && pendingStepNumber === 7) ||
    (isEditable && pendingStepNumber === 8 && createdByDapaTanto) ||
    (isEditable && pendingStepNumber === 9);

  const showOnlyDaipaMitsumori =
    !isAdmin && isEditable && (
      (pendingStepNumber === 5 && createdByDapaTanto) ||
      (pendingStepNumber === 6 && createdByDapaKacho)
    );

  const showOnlyMaintenanceConfirm =
    !isAdmin && isEditable && pendingStepNumber === 7;

  const showOnlyDaipaFinal =
    !isAdmin && isEditable && pendingStepNumber === 8 && createdByDapaTanto;

  const disableDaipaFinalManagerConfirm =
    !isAdmin && pendingStepNumber === 8 && createdByDapaTanto;

  const canEditRequestSection =
    isAdmin ||
    (isEditable && pendingStepNumber === 8 && createdByDapaTanto) ||
    (isEditable && pendingStepNumber === 9 && createdByDapaKacho);

  const canOpenMitsumori = !isNewForm && (isAdmin || pendingStepNumber >= 5);

  // Fetch workflow state when editing an existing form
  useEffect(() => {
    if (!editId) {
      setWorkflowLoading(false);
      return;
    }
    setWorkflowLoading(true);
    workflowApi.get(editId)
      .then(setWorkflowSteps)
      .catch(() => {})
      .finally(() => setWorkflowLoading(false));
  }, [editId]);

  // ---- Build UI state snapshot for payload (no localStorage; DB only) ----
  // buildDraftRef always holds the latest buildDraft so closures (e.g. the
  // load effect's setTimeout) can read post-render state without stale captures.
  const buildDraftRef = useRef<() => any>(() => ({}));
  const buildDraft = useCallback(() => ({
    documentNo, issueDate, furigana, customerName, address, propertyCd, propertyCd2, propertyCd3, buildingName,
    completionDate, productName, repairHistory,
    roof, outsideWall, balcony, commonArea, privateArea, otherWork, otherWorkText, workDetail,
    ownerFlag, ownerText, residentFlag, residentText, neighborFlag, neighborText,
    plannedVendorName, plannedVendorCd, plannedVendorCd2, fixedVendorName, fixedVendorCd, fixedVendorCd2,
    proposalDate, contractDate, startDate,
    photo4side, photoPart, photoOther, photoOtherText,
    attachRemark, dapManagerConfirmPhoto,
    page1Rows, page2Rows, siteInstruction1, siteInstruction2,
    sectionKasetsu, sectionAshiba, sectionBouhan, sectionYosan,
    grpTodokede, grpChosa, grpKakunin,
    requiredDrawing, requiredOther, requiredOtherText, maintenanceRemark,
    designNeed, employeeCd, employeeName, confirmApplicationNeed,
    designInstruction, designAttachment, designDapConfirm, designRemark,
    estimateOutput, estimateAttach, estimateRemark,
    maintenanceEstimateAttach, maintenanceEstimateRemark,
    orderResult, juchuCheck, shitchuCheck, daipaFinalConfirm, lostOrder, generalApplyAttach, okyakusamaMitsumoriAttach, keiyakushoSakuseiAttach, finalReason,
    gyomuItakuCd, gyomuItakuName, partnerCd, partnerName,
  }), [
    documentNo, issueDate, furigana, customerName, address, propertyCd, propertyCd2, propertyCd3, buildingName,
    completionDate, productName, repairHistory,
    roof, outsideWall, balcony, commonArea, privateArea, otherWork, otherWorkText, workDetail,
    ownerFlag, ownerText, residentFlag, residentText, neighborFlag, neighborText,
    plannedVendorName, plannedVendorCd, plannedVendorCd2, fixedVendorName, fixedVendorCd, fixedVendorCd2,
    proposalDate, contractDate, startDate,
    photo4side, photoPart, photoOther, photoOtherText,
    attachRemark, dapManagerConfirmPhoto,
    page1Rows, page2Rows, siteInstruction1, siteInstruction2,
    sectionKasetsu, sectionAshiba, sectionBouhan, sectionYosan,
    grpTodokede, grpChosa, grpKakunin,
    requiredDrawing, requiredOther, requiredOtherText, maintenanceRemark,
    designNeed, employeeCd, employeeName, confirmApplicationNeed,
    designInstruction, designAttachment, designDapConfirm, designRemark,
    estimateOutput, estimateAttach, estimateRemark,
    maintenanceEstimateAttach, maintenanceEstimateRemark,
    orderResult, juchuCheck, shitchuCheck, daipaFinalConfirm, lostOrder, generalApplyAttach, okyakusamaMitsumoriAttach, keiyakushoSakuseiAttach, finalReason,
    gyomuItakuCd, gyomuItakuName, partnerCd, partnerName,
  ]);

  // Keep ref in sync with the latest buildDraft on every render.
  useEffect(() => {
    buildDraftRef.current = buildDraft;
  });

  const handleSubmit = async (skipNavigate = false): Promise<number | null> => {
    if (submitting) return null;
    const shouldValidatePropertyCd =
      !editId ||
      pendingStepNumber === 1 ||
      (pendingStepNumber === 2 && createdByDapaKacho);
    if (shouldValidatePropertyCd) {
      const isValidPropertyCd =
        propertyCd?.length === 7 &&
        propertyCd2?.length === 3 &&
        propertyCd3?.length === 2;
      if (!isValidPropertyCd) {
        toast.error("物件CDを正しく入力してください。\n受注コード7桁・追加コード3桁・棟番号2桁");
        return null;
      }
    }
    setSubmitting(true);
    try {
      const form: FullForm = {
        ...initialForm,
        property: {
          furigana,
          customerName,
          building: {
            address,
            propertyCode: propertyCd,
            propertyCode2: propertyCd2,
            propertyCode3: propertyCd3,
            buildingName,
            completionYm: completionDate,
            branchName: productName,
            renovationHistory: repairHistory,
          },
          renovationContent: workDetail,
          requests: {
            owner: { has: ownerFlag === "あり" ? "1" : ownerFlag === "なし" ? "0" : "", note: ownerText },
            resident: { has: residentFlag === "あり" ? "1" : residentFlag === "なし" ? "0" : "", note: residentText },
            neighbors: { has: neighborFlag === "あり" ? "1" : neighborFlag === "なし" ? "0" : "", note: neighborText },
          },
          vendor: {
            plannedVendorName,
            confirmed: { mode: fixedVendorName ? "1" : "", name: fixedVendorName },
          },
          schedule: {
            proposal: { y: proposalDate.slice(0, 4), m: proposalDate.slice(5, 7), d: proposalDate.slice(8, 10) },
            contract: { y: contractDate.slice(0, 4), m: contractDate.slice(5, 7), d: contractDate.slice(8, 10) },
            start: { y: startDate.slice(0, 4), m: startDate.slice(5, 7), d: startDate.slice(8, 10) },
          },
        },
        kasetsu: {
          ...initialForm.kasetsu,
          section_kasetsu: sectionKasetsu,
          section_ashiba: sectionAshiba,
          section_bouhan: sectionBouhan,
          section_yosan: sectionYosan,
          kasetsu_betsuto: page1Rows.find((r) => r.id === "r6b")?.amount ?? "",
          ashiba_betsuto: page1Rows.find((r) => r.id === "r13b")?.amount ?? "",
        },
        todokede: {
          ...initialForm.todokede,
          grp_todokede: grpTodokede,
          grp_chosa: grpChosa,
          grp_kakunin: grpKakunin,
        },
        tenpu: {
          checkedMap: {},
          fileMap: {},
          textMap: {},
        },
      };
      // Include full UI state for complete round-trip restoration
      const payloadWithUiState = {
        ...JSON.parse(JSON.stringify(form)),
        uiState: buildDraft(),
      };
      const fd = new FormData();
      fd.append("payload", JSON.stringify(payloadWithUiState));
      // Append files from tenpu
      for (const [key, file] of Object.entries(form.tenpu.fileMap)) {
        if (file) fd.append(key, file);
      }
      if (form.kasetsu.ashiba_partialFile) {
        fd.append("ashiba_partialFile", form.kasetsu.ashiba_partialFile);
      }
      let targetId: number | null = editId;
      if (editId) {
        await formApi.update(editId, fd);
      } else {
        const result = await formApi.create(fd);
        targetId = result?.id ?? null;
      }
      // After the form record exists, flush pending file deletions and uploads.
      if (targetId) {
        const deletions = Array.from(deletedFieldKeysRef.current);
        await Promise.all(
          deletions.map((key) => attachmentApi.delete(targetId!, key).catch(() => {}))
        );
        deletedFieldKeysRef.current.clear();

        const pending = Object.entries(pendingFilesRef.current);
        await Promise.all(
          pending.map(([key, file]) => attachmentApi.upload(targetId!, key, file).catch(() => {}))
        );
        pendingFilesRef.current = {};
      }
      savedSnapshotRef.current = JSON.stringify(buildDraft());
      toast.success("保存しました");
      if (!skipNavigate) nav("/", { replace: true });
      return targetId;
    } catch (err: any) {
      toast.error(err?.message || "保存に失敗しました");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const openMitsumoriFor = async (id: number) => {
    try {
      const existing = await mitsumoriApi.get(id);
      if (!existing) {
        await mitsumoriApi.create(id);
      }
      nav(`/mitsumori/${id}`);
    } catch {
      toast.error("エラーが発生しました");
    }
  };

  const isFormDirty = () => {
    if (isInitialLoad.current) return false;
    if (savedSnapshotRef.current == null) return true;
    return savedSnapshotRef.current !== JSON.stringify(buildDraft());
  };

  const handleOpenMitsumori = async () => {
    if (editId && !isFormDirty()) {
      await openMitsumoriFor(editId);
      return;
    }
    setShowMitsumoriDialog(true);
  };

  const handleConfirmSaveAndOpen = async () => {
    setShowMitsumoriDialog(false);
    const targetId = await handleSubmit(true);
    if (targetId) await openMitsumoriFor(targetId);
  };

  const updatePage1Row = (id: string, next: CheckRow) => {
    setPage1Rows((prev) => prev.map((r) => (r.id === id ? next : r)));
  };

  const updatePage2Row = (id: string, next: CheckRow) => {
    setPage2Rows((prev) => prev.map((r) => (r.id === id ? next : r)));
  };

  const clearRowFiles = (fieldKeys: string[]) => {
    setAttachments((prev) => {
      const next = { ...prev };
      fieldKeys.forEach((fk) => {
        delete pendingFilesRef.current[fk];
        if (editId && prev[fk]) {
          deletedFieldKeysRef.current.add(fk);
        }
        delete next[fk];
      });
      return next;
    });
  };

  const rowFileKeyMap: Record<string, string[]> = {
    r5: ["densenbogokan_zumen"],
    r7: ["ashiba_plan"],
    r12: ["planting_plan"],
    p2r6: ["danshin_sonota"],
    p2r7: ["shitaji_hitsuyokasho"],
    p2r8: ["jotai_kakunin_tenpu"],
  };

  const handleNeedChange = (rowId: string, newNeed: string) => {
    const page1Row = page1Rows.find((r) => r.id === rowId);
    const page2Row = page2Rows.find((r) => r.id === rowId);
    const row = page1Row ?? page2Row;
    if (!row) return;

    if (newNeed !== "不要") {
      const updated: CheckRow = { ...row, need: newNeed };
      if (page1Row) updatePage1Row(rowId, updated);
      else updatePage2Row(rowId, updated);
      return;
    }

    const clearedChecks: Record<string, boolean> = {};
    Object.keys(row.checks).forEach((k) => { clearedChecks[k] = false; });

    const cleared: CheckRow = {
      ...row,
      need: "不要",
      checks: clearedChecks,
      ...(row.amount !== undefined ? { amount: "" } : {}),
      ...(row.otherText !== undefined ? { otherText: "" } : {}),
      ...(row.remarkExtra
        ? {
            remarkExtra: row.remarkExtra.map((e) => ({
              ...e,
              value: "",
              ...(e.fileCheckboxValue !== undefined ? { fileCheckboxValue: false } : {}),
            })),
          }
        : {}),
    };

    if (page1Row) updatePage1Row(rowId, cleared);
    else updatePage2Row(rowId, cleared);

    const keys = rowFileKeyMap[rowId] ?? [];
    if (keys.length > 0) clearRowFiles(keys);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="sticky top-0 z-30 border-b border-slate-300 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-[1700px] px-4 py-4">
          <div className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-8">
              <h1 className="text-center text-3xl font-bold tracking-wide text-[#17375E]">
                営繕工事 事前確認依頼書 兼 見積確認依頼書
              </h1>
              <p className="mt-2 text-center text-sm text-[#2B547E]">
                下記営繕工事について、工事内容・仮設工事の検証を依頼致します。
              </p>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-semibold text-[#17375E]">文書番号</label>
              <input value={documentNo || "保存後に発行"} readOnly className={inputClass + " bg-slate-50 cursor-default"} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-semibold text-[#17375E]">起票日</label>
              <input value={issueDate ? issueDate.replace(/(\d{4})-(\d{2})-(\d{2})/, "$1年$2月$3日") : ""} readOnly className={inputClass + " bg-slate-50 cursor-default"} />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto flex max-w-[1700px] flex-col gap-6 px-4 py-6" style={{ paddingBottom: "80px" }}>
        {workflowLoading && editId && (
          <div className="text-sm text-gray-400">権限を確認中...</div>
        )}
        {readOnlyNotice && (
          <div className="rounded-lg border border-[#17375E] bg-[#DCE6F1] px-4 py-3 text-sm font-semibold text-[#17375E]">
            {readOnlyNotice}
          </div>
        )}
        <fieldset disabled={!canEditBasicAndAttachment} className="contents">
        <BasicInfoSection
          furigana={furigana}
          setFurigana={setFurigana}
          customerName={customerName}
          setCustomerName={setCustomerName}
          address={address}
          setAddress={setAddress}
          propertyCd={propertyCd}
          setPropertyCd={setPropertyCd}
          propertyCd2={propertyCd2}
          setPropertyCd2={setPropertyCd2}
          propertyCd3={propertyCd3}
          setPropertyCd3={setPropertyCd3}
          buildingName={buildingName}
          setBuildingName={setBuildingName}
          completionDate={completionDate}
          setCompletionDate={setCompletionDate}
          productName={productName}
          setProductName={setProductName}
          relatedForms={relatedForms}
          editId={editId}
          roof={roof}
          setRoof={setRoof}
          outsideWall={outsideWall}
          setOutsideWall={setOutsideWall}
          balcony={balcony}
          setBalcony={setBalcony}
          commonArea={commonArea}
          setCommonArea={setCommonArea}
          privateArea={privateArea}
          setPrivateArea={setPrivateArea}
          otherWork={otherWork}
          setOtherWork={setOtherWork}
          otherWorkText={otherWorkText}
          setOtherWorkText={setOtherWorkText}
          workDetail={workDetail}
          setWorkDetail={setWorkDetail}
          ownerFlag={ownerFlag}
          setOwnerFlag={setOwnerFlag}
          ownerText={ownerText}
          setOwnerText={setOwnerText}
          residentFlag={residentFlag}
          setResidentFlag={setResidentFlag}
          residentText={residentText}
          setResidentText={setResidentText}
          neighborFlag={neighborFlag}
          setNeighborFlag={setNeighborFlag}
          neighborText={neighborText}
          setNeighborText={setNeighborText}
          plannedVendorName={plannedVendorName}
          setPlannedVendorName={setPlannedVendorName}
          plannedVendorCd={plannedVendorCd}
          setPlannedVendorCd={setPlannedVendorCd}
          plannedVendorCd2={plannedVendorCd2}
          setPlannedVendorCd2={setPlannedVendorCd2}
          fixedVendorName={fixedVendorName}
          setFixedVendorName={setFixedVendorName}
          fixedVendorCd={fixedVendorCd}
          setFixedVendorCd={setFixedVendorCd}
          fixedVendorCd2={fixedVendorCd2}
          setFixedVendorCd2={setFixedVendorCd2}
          proposalDate={proposalDate}
          setProposalDate={setProposalDate}
          contractDate={contractDate}
          setContractDate={setContractDate}
          startDate={startDate}
          setStartDate={setStartDate}
        />

        </fieldset>

        <AttachmentSection
          photo4side={photo4side}
          setPhoto4side={setPhoto4side}
          photoPart={photoPart}
          setPhotoPart={setPhotoPart}
          photoOther={photoOther}
          setPhotoOther={setPhotoOther}
          photoOtherText={photoOtherText}
          setPhotoOtherText={setPhotoOtherText}
          attachRemark={attachRemark}
          setAttachRemark={setAttachRemark}
          dapManagerConfirmPhoto={dapManagerConfirmPhoto}
          setDapManagerConfirmPhoto={setDapManagerConfirmPhoto}
          contentDisabled={!canEditBasicAndAttachment}
          confirmCheckboxDisabled={!canEditDapManagerConfirm}
          attachments={attachments}
          fileInputRefs={fileInputRefs}
          onFileCheckChange={handleFileCheckChange}
          onFileSelected={handleFileSelected}
          getAttachmentUrl={getAttachmentUrl}
        />

        <fieldset disabled={!canEditTemporarySections} className="contents">
        <TemporaryCheckSection
          rows={page1Rows}
          updateRow={updatePage1Row}
          onNeedChange={handleNeedChange}
          siteInstruction={siteInstruction1}
          setSiteInstruction={setSiteInstruction1}
          sectionKasetsu={sectionKasetsu}
          setSectionKasetsu={setSectionKasetsu}
          sectionAshiba={sectionAshiba}
          setSectionAshiba={setSectionAshiba}
          sectionBouhan={sectionBouhan}
          setSectionBouhan={setSectionBouhan}
          sectionYosan={sectionYosan}
          setSectionYosan={setSectionYosan}
          disableDapConfirmAndRemark={disableDapConfirmAndRemark}
          disableMainContent={disableMainContent}
          disableCategoryCheckbox={disableCategoryCheckbox}
          densenbogokanFileUpload={{
            matchKey: "設置部分図面添付",
            fieldKey: "densenbogokan_zumen",
            attachments,
            fileInputRefs,
            onFileCheckChange: handleFileCheckChange,
            onFileSelected: handleFileSelected,
            getAttachmentUrl,
          }}
          ashibaPlanFileUpload={{
            matchKey: "仮設図面添付",
            fieldKey: "ashiba_plan",
            attachments,
            fileInputRefs,
            onFileCheckChange: handleFileCheckChange,
            onFileSelected: handleFileSelected,
            getAttachmentUrl,
          }}
          plantingPlanFileUpload={{
            matchKey: "図面添付",
            fieldKey: "planting_plan",
            attachments,
            fileInputRefs,
            onFileCheckChange: handleFileCheckChange,
            onFileSelected: handleFileSelected,
            getAttachmentUrl,
          }}
        />

        <TemporaryConfirmSection
          rows={page2Rows}
          updateRow={updatePage2Row}
          onNeedChange={handleNeedChange}
          siteInstruction={siteInstruction2}
          setSiteInstruction={setSiteInstruction2}
          grpTodokede={grpTodokede}
          setGrpTodokede={setGrpTodokede}
          grpChosa={grpChosa}
          setGrpChosa={setGrpChosa}
          grpKakunin={grpKakunin}
          setGrpKakunin={setGrpKakunin}
          disableDapConfirmAndRemark={disableDapConfirmAndRemark}
          disableMainContent={disableMainContent}
          disableCategoryCheckbox={disableCategoryCheckbox}
          danshinSonotaFileUpload={{
            matchKey: "その他",
            fieldKey: "danshin_sonota",
            attachments,
            fileInputRefs,
            onFileCheckChange: handleFileCheckChange,
            onFileSelected: handleFileSelected,
            getAttachmentUrl,
          }}
          shitajiFileUpload={{
            matchKey: "必要箇所",
            fieldKey: "shitaji_hitsuyokasho",
            attachments,
            fileInputRefs,
            onFileCheckChange: handleFileCheckChange,
            onFileSelected: handleFileSelected,
            getAttachmentUrl,
          }}
          remarkFileUpload={{
            attachments,
            fileInputRefs,
            onFileSelected: handleFileSelected,
            onFileCheckChange: handleFileCheckChange,
            getAttachmentUrl,
          }}
        />
        </fieldset>

        <fieldset disabled={!canEditMaintenanceSection} className="contents">
        <MaintenanceAttachmentSection
          requiredDrawing={requiredDrawing}
          setRequiredDrawing={setRequiredDrawing}
          requiredOther={requiredOther}
          setRequiredOther={setRequiredOther}
          requiredOtherText={requiredOtherText}
          setRequiredOtherText={setRequiredOtherText}
          maintenanceRemark={maintenanceRemark}
          setMaintenanceRemark={setMaintenanceRemark}
          attachments={attachments}
          fileInputRefs={fileInputRefs}
          onFileCheckChange={handleFileCheckChange}
          onFileSelected={handleFileSelected}
          getAttachmentUrl={getAttachmentUrl}
        />
        </fieldset>

        <fieldset disabled={!canEditDesignNeedRow} className="contents">
        <DesignConfirmSection
          designNeed={designNeed}
          setDesignNeed={setDesignNeed}
          employeeCd={employeeCd}
          setEmployeeCd={setEmployeeCd}
          employeeName={employeeName}
          setEmployeeName={setEmployeeName}
          confirmApplicationNeed={confirmApplicationNeed}
          setConfirmApplicationNeed={setConfirmApplicationNeed}
          designInstruction={designInstruction}
          setDesignInstruction={setDesignInstruction}
          designAttachment={designAttachment}
          setDesignAttachment={setDesignAttachment}
          designDapConfirm={designDapConfirm}
          setDesignDapConfirm={setDesignDapConfirm}
          designRemark={designRemark}
          setDesignRemark={setDesignRemark}
          attachments={attachments}
          fileInputRefs={fileInputRefs}
          onFileCheckChange={handleFileCheckChange}
          onFileSelected={handleFileSelected}
          getAttachmentUrl={getAttachmentUrl}
          showOnlyDesignNeedRow={true}
        />
        </fieldset>

        <fieldset disabled={!canEditDesignConfirmSection} className="contents">
        <DesignConfirmSection
          designNeed={designNeed}
          setDesignNeed={setDesignNeed}
          employeeCd={employeeCd}
          setEmployeeCd={setEmployeeCd}
          employeeName={employeeName}
          setEmployeeName={setEmployeeName}
          confirmApplicationNeed={confirmApplicationNeed}
          setConfirmApplicationNeed={setConfirmApplicationNeed}
          designInstruction={designInstruction}
          setDesignInstruction={setDesignInstruction}
          designAttachment={designAttachment}
          setDesignAttachment={setDesignAttachment}
          designDapConfirm={designDapConfirm}
          setDesignDapConfirm={setDesignDapConfirm}
          designRemark={designRemark}
          setDesignRemark={setDesignRemark}
          attachments={attachments}
          fileInputRefs={fileInputRefs}
          onFileCheckChange={handleFileCheckChange}
          onFileSelected={handleFileSelected}
          getAttachmentUrl={getAttachmentUrl}
          showOnlyDesignConfirmSection={true}
          disableDesignDapConfirm={disableDesignDapConfirm}
          disableDesignRemark={disableDesignRemark}
        />
        </fieldset>

        <fieldset disabled={!canEditEstimateSection} className="contents">
        <EstimateFinalSection
          estimateOutput={estimateOutput}
          setEstimateOutput={setEstimateOutput}
          estimateAttach={estimateAttach}
          setEstimateAttach={setEstimateAttach}
          estimateRemark={estimateRemark}
          setEstimateRemark={setEstimateRemark}
          maintenanceEstimateAttach={maintenanceEstimateAttach}
          setMaintenanceEstimateAttach={setMaintenanceEstimateAttach}
          maintenanceEstimateRemark={maintenanceEstimateRemark}
          setMaintenanceEstimateRemark={setMaintenanceEstimateRemark}
          orderResult={orderResult}
          setOrderResult={setOrderResult}
          daipaFinalConfirm={daipaFinalConfirm}
          setDaipaFinalConfirm={setDaipaFinalConfirm}
          generalApplyAttach={generalApplyAttach}
          setGeneralApplyAttach={setGeneralApplyAttach}
          okyakusamaMitsumoriAttach={okyakusamaMitsumoriAttach}
          setOkyakusamaMitsumoriAttach={setOkyakusamaMitsumoriAttach}
          keiyakushoSakuseiAttach={keiyakushoSakuseiAttach}
          setKeiyakushoSakuseiAttach={setKeiyakushoSakuseiAttach}
          lostOrder={lostOrder}
          setLostOrder={setLostOrder}
          finalReason={finalReason}
          setFinalReason={setFinalReason}
          attachments={attachments}
          fileInputRefs={fileInputRefs}
          onFileCheckChange={handleFileCheckChange}
          onFileSelected={handleFileSelected}
          getAttachmentUrl={getAttachmentUrl}
          onOpenMitsumori={handleOpenMitsumori}
          showOnlyMaintenanceConfirm={showOnlyMaintenanceConfirm}
          showOnlyDaipaFinal={showOnlyDaipaFinal}
          showOnlyDaipaMitsumori={showOnlyDaipaMitsumori}
          showOnlyDaipaManagerConfirm={showOnlyDaipaManagerConfirm}
          showOnlyDaipaFinalAndRequest={showOnlyDaipaFinalAndRequest}
          disableDaipaManagerConfirm={disableDaipaFinalManagerConfirm}
          canOpenMitsumori={canOpenMitsumori}
        />
        </fieldset>

        {orderResult !== "失注" && (
        <fieldset disabled={!canEditRequestSection} className="contents">
        <RequestSection
          gyomuItakuCd={gyomuItakuCd}
          setGyomuItakuCd={setGyomuItakuCd}
          gyomuItakuName={gyomuItakuName}
          setGyomuItakuName={setGyomuItakuName}
          partnerCd={partnerCd}
          setPartnerCd={setPartnerCd}
          partnerName={partnerName}
          setPartnerName={setPartnerName}
        />
        </fieldset>
        )}

        <ApprovalFlowSection
          formId={editId}
          steps={workflowSteps}
          userRole={user?.role}
          creatorRole={creatorRole}
          orderResult={orderResult}
          onStepsChange={setWorkflowSteps}
          isFormDirty={isFormDirty}
          onSaveForm={() => handleSubmit(true)}
          validateConfirm={(stepNumber) => {
            const isFirstActiveStep =
              stepNumber === 1 ||
              (stepNumber === 2 && creatorRole === "大パ管理職");
            if (isFirstActiveStep) {
              const isValidPropertyCd =
                propertyCd?.length === 7 &&
                propertyCd2?.length === 3 &&
                propertyCd3?.length === 2;
              if (!isValidPropertyCd) {
                return "物件CDを正しく入力してください。\n受注コード7桁・追加コード3桁・棟番号2桁";
              }
              const hasKaishuChecked =
                roof || outsideWall || balcony || commonArea || privateArea || otherWork;
              if (!hasKaishuChecked) {
                return "改修工事内容を選択してください。\n少なくとも1つのチェックが必要です。";
              }
              const youboRows = [
                { label: "オーナー様", flag: ownerFlag, text: ownerText },
                { label: "入居者様", flag: residentFlag, text: residentText },
                { label: "近隣様", flag: neighborFlag, text: neighborText },
              ];
              for (const row of youboRows) {
                if (!row.flag) {
                  return `要望注意点等の${row.label}を\n「なし」または「あり」で選択してください。`;
                }
                if (row.flag === "あり" && !row.text?.trim()) {
                  return `要望注意点等の${row.label}の\n内容を入力してください。`;
                }
              }
              if (!plannedVendorName?.trim()) {
                return "主要業者情報の予定業者名を入力してください。";
              }
              if (!plannedVendorCd?.trim() || !plannedVendorCd2?.trim()) {
                return "主要業者情報の予定業者CDを入力してください。\n6桁・3桁両方の入力が必要です。";
              }
              if (!fixedVendorName?.trim()) {
                return "主要業者情報の確定業者名を入力してください。";
              }
              if (!fixedVendorCd?.trim() || !fixedVendorCd2?.trim()) {
                return "主要業者情報の確定業者CDを入力してください。\n6桁・3桁両方の入力が必要です。";
              }
              if (!proposalDate?.trim()) {
                return "営繕提案予定日を入力してください。";
              }
              if (!contractDate?.trim()) {
                return "契約予定日を入力してください。";
              }
              if (!startDate?.trim()) {
                return "着工予定日を入力してください。";
              }
              if (!attachments["photo_exterior"]) {
                return "事前確認時 添付資料の\n建物外観4面【必須】をアップロードしてください。";
              }
              if (!attachments["photo_work"]) {
                return "事前確認時 添付資料の\n工事部位【必須】をアップロードしてください。";
              }
            }
            if (stepNumber === 2) {
              if (!dapManagerConfirmPhoto) {
                return "事前確認時 添付資料の\n現況写真の大パ管理職確認にチェックしてください。";
              }
            }
            if (stepNumber === 3) {
              const labelMap: Record<string, string> = {
                r1: "第3者侵入防止策",
                r2: "仮設電気",
                r3: "仮設水道",
                r4: "仮設トイレ",
                r5: "電線防護管",
                r6: "工事駐車場",
                r7: "足場設置",
                r8: "足場届出",
                r9: "昇降階段・巾木・中桟等",
                r10: "飛散防止措置",
                r11: "エントランス・共用部養生",
                r12: "足場設置部の植栽剪定",
                r13: "足場解体後の清掃費用",
                r14: "夜間照明・防犯カメラ",
                r15: "産廃費用",
                r16: "荷揚げ費用",
                p2r1: "道路使用",
                p2r2: "道路占用",
                p2r3: "交通誘導員",
                p2r4: "アスベスト含有調査",
                p2r5: "景観条例対象届出",
                p2r6: "打診（タイル・塗装）",
                p2r7: "下地調整",
                p2r9: "施工業者の建設業許可確認",
                p2r13: "防水工事等保証の確認",
              };
              const validateNormalRow = (row: CheckRow, label: string): string | null => {
                if (!row.need) {
                  return `${label}を「必要」または「不要」で選択してください。`;
                }
                if (row.need === "必要") {
                  const hasCheck = Object.values(row.checks).some((v) => v === true);
                  if (!hasCheck) {
                    return `${label}の必要項目を選択してください。`;
                  }
                }
                return null;
              };
              const validateAmountRow = (row: CheckRow, label: string): string | null => {
                if (!row.need) {
                  return `${label}を「必要」または「不要」で選択してください。`;
                }
                if (row.need === "必要") {
                  if (!row.amount?.trim()) {
                    return `${label}の数量・金額を入力してください。`;
                  }
                }
                return null;
              };
              const validateR5 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "電線防護管を「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  if (!row.amount?.trim()) {
                    return "電線防護管の必要ｍ数を入力してください。";
                  }
                  if (!attachments["densenbogokan_zumen"]) {
                    return "電線防護管の設置部分図面を\n添付してください。";
                  }
                }
                return null;
              };
              const validateR7 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "足場設置を「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  const hasZenshu = row.checks["全周"] === true;
                  const hasIchibu = row.checks["一部"] === true;
                  if (!hasZenshu && !hasIchibu) {
                    return "足場設置の「全周」または「一部」を選択してください。";
                  }
                  if (hasZenshu && !row.amount?.trim()) {
                    return "足場設置の新築時㎡数を入力してください。";
                  }
                  if (!attachments["ashiba_plan"]) {
                    return "足場設置の仮設図面を\n添付してください。";
                  }
                }
                return null;
              };
              const validateR10 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "飛散防止措置を「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  const hasRequired =
                    row.checks["朝顔"] === true ||
                    row.checks["防音シート"] === true ||
                    row.checks["防音パネル"] === true;
                  if (!hasRequired) {
                    return "飛散防止措置の「朝顔」「防音シート」「防音パネル」のいずれかを\n選択してください。";
                  }
                }
                return null;
              };
              const validateR11 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "エントランス・共用部養生を「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  const hasRequired =
                    row.checks["柱養生材"] === true ||
                    row.checks["床養生材"] === true;
                  if (!hasRequired) {
                    return "エントランス・共用部養生の\n「柱養生材」または「床養生材」を選択してください。";
                  }
                }
                return null;
              };
              const validateR12 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "足場設置部の植栽剪定を「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  const hasSentei = row.checks["剪定"] === true;
                  const hasSonota = row.checks["その他"] === true;
                  if (!hasSentei && !hasSonota) {
                    return "足場設置部の植栽剪定の\n「剪定」または「その他」を選択してください。";
                  }
                  if (hasSentei && !attachments["planting_plan"]) {
                    return "足場設置部の植栽剪定の\n図面を添付してください。";
                  }
                }
                return null;
              };
              const validateR13 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "足場解体後の清掃費用を\n「必要」または「不要」で選択してください。";
                }
                return null;
              };
              const validateR14 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "夜間照明・防犯カメラを\n「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  const hasRequired =
                    row.checks["夜間灯"] === true ||
                    row.checks["防犯カメラ"] === true ||
                    row.checks["チューブライト"] === true;
                  if (!hasRequired) {
                    return "防犯の「夜間灯」「防犯カメラ」\n「チューブライト」のいずれかを選択してください。";
                  }
                }
                return null;
              };
              const validateR15 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "産廃費用を「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  if (!row.checks["金額"]) {
                    return "産廃費用の「金額」を\n選択してください。";
                  }
                  if (!row.amount?.trim()) {
                    return "産廃費用の金額を入力してください。";
                  }
                }
                return null;
              };
              const validateR16 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "荷揚げ費用を「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  const hasRequired =
                    row.checks["レッカー"] === true ||
                    row.checks["ユニック"] === true ||
                    row.checks["手運び（人工）"] === true;
                  if (!hasRequired) {
                    return "荷揚げ費用の「レッカー」「ユニック」\n「手運び（人工）」のいずれかを選択してください。";
                  }
                }
                return null;
              };
              const validateP2r1 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "道路使用を「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  if (!row.checks["必要回数"]) {
                    return "道路使用の「必要回数」を\n選択してください。";
                  }
                  if (!row.amount?.trim()) {
                    return "道路使用の必要回数を\n入力してください。";
                  }
                  const hasRequired =
                    row.checks["搬入作業"] === true ||
                    row.checks["道路占用"] === true;
                  if (!hasRequired) {
                    return "道路使用の「搬入作業」または\n「道路占用」を選択してください。";
                  }
                }
                return null;
              };
              const validateP2r2 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "道路占用を「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  if (!row.checks["必要面積"]) {
                    return "道路占用の「必要面積」を\n選択してください。";
                  }
                  if (!row.amount?.trim()) {
                    return "道路占用の必要面積を\n入力してください。";
                  }
                  const hasRequired =
                    row.checks["足場設置"] === true ||
                    row.checks["仮囲い設置"] === true ||
                    row.checks["その他"] === true;
                  if (!hasRequired) {
                    return "道路占用の「足場設置」「仮囲い設置」\n「その他」のいずれかを選択してください。";
                  }
                }
                return null;
              };
              const validateP2r3 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "交通誘導員を「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  if (!row.checks["必要金額"]) {
                    return "交通誘導員の「必要金額」を\n選択してください。";
                  }
                  if (!row.amount?.trim()) {
                    return "交通誘導員の必要金額を\n入力してください。";
                  }
                  const hasRequired =
                    row.checks["道路使用"] === true ||
                    row.checks["道路占用"] === true ||
                    row.checks["その他"] === true;
                  if (!hasRequired) {
                    return "交通誘導員の「道路使用」「道路占用」\n「その他」のいずれかを選択してください。";
                  }
                }
                return null;
              };
              const validateP2r4 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "アスベスト含有調査を\n「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  if (!row.checks["必要金額"]) {
                    return "アスベスト含有調査の「必要金額」を\n選択してください。";
                  }
                  if (!row.amount?.trim()) {
                    return "アスベスト含有調査の金額を\n入力してください。";
                  }
                }
                return null;
              };
              const validateP2r5 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "景観条例対象届出を\n「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  if (!row.checks["必要金額"]) {
                    return "景観条例対象届出の「必要金額」を\n選択してください。";
                  }
                  if (!row.amount?.trim()) {
                    return "景観条例対象届出の金額を\n入力してください。";
                  }
                }
                return null;
              };
              const validateP2r6 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "打診（タイル・塗装）を\n「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  const hasRequired =
                    row.checks["タイル面"] === true ||
                    row.checks["塗装面"] === true ||
                    row.checks["素地面"] === true ||
                    row.checks["その他"] === true;
                  if (!hasRequired) {
                    return "打診（タイル・塗装）の\n「タイル面」「塗装面」「素地面」\n「その他」のいずれかを選択してください。";
                  }
                  if (!row.line2Checked) {
                    return "打診（タイル・塗装）の\n「必要金額」を選択してください。";
                  }
                  if (!row.amount?.trim()) {
                    return "打診（タイル・塗装）の\n金額を入力してください。";
                  }
                }
                return null;
              };
              const validateP2r7 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "下地調整を「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  if (!row.checks["必要箇所"]) {
                    return "下地調整の「必要箇所」を\n選択してください。";
                  }
                  if (!row.line2Checked) {
                    return "下地調整の「必要金額」を\n選択してください。";
                  }
                  if (!row.amount?.trim()) {
                    return "下地調整の金額を\n入力してください。";
                  }
                }
                return null;
              };
              const validateP2r9 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "施工業者の建設業許可確認を\n「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  const hasRequired =
                    row.checks["問題なし"] === true ||
                    row.checks["期限切れ"] === true ||
                    row.checks["要更新"] === true;
                  if (!hasRequired) {
                    return "施工業者の建設業許可確認の\n「問題なし」「期限切れ」「要更新」\nのいずれかを選択してください。";
                  }
                }
                return null;
              };
              const validateP2r13 = (row: CheckRow): string | null => {
                if (!row.need) {
                  return "防水工事等保証の確認を\n「必要」または「不要」で選択してください。";
                }
                if (row.need === "必要") {
                  if (!row.checks["保証年数"]) {
                    return "防水工事等保証の確認の\n「保証年数」を選択してください。";
                  }
                  if (!row.amount?.trim()) {
                    return "防水工事等保証の確認の\n保証年数を入力してください。";
                  }
                }
                return null;
              };
              const amountRowIds = new Set([
                "r6","r8",
              ]);
              const dispatchRow = (row: CheckRow, label: string) => {
                if (row.id === "r5") return validateR5(row);
                if (row.id === "r7") return validateR7(row);
                if (row.id === "r10") return validateR10(row);
                if (row.id === "r11") return validateR11(row);
                if (row.id === "r12") return validateR12(row);
                if (row.id === "r13") return validateR13(row);
                if (row.id === "r14") return validateR14(row);
                if (row.id === "r15") return validateR15(row);
                if (row.id === "r16") return validateR16(row);
                if (row.id === "p2r1") return validateP2r1(row);
                if (row.id === "p2r2") return validateP2r2(row);
                if (row.id === "p2r3") return validateP2r3(row);
                if (row.id === "p2r4") return validateP2r4(row);
                if (row.id === "p2r5") return validateP2r5(row);
                if (row.id === "p2r6") return validateP2r6(row);
                if (row.id === "p2r7") return validateP2r7(row);
                if (row.id === "p2r9") return validateP2r9(row);
                return amountRowIds.has(row.id)
                  ? validateAmountRow(row, label)
                  : validateNormalRow(row, label);
              };
              const page1Ids = [
                "r1","r2","r3","r4","r5","r6",
                "r7","r8","r9","r10","r11","r12","r13",
                "r14","r15","r16",
              ];
              for (const id of page1Ids) {
                const row = page1Rows.find((r) => r.id === id);
                if (!row) continue;
                const err = dispatchRow(row, labelMap[id]);
                if (err) return err;
              }
              const page2NormalIds = ["p2r1","p2r2","p2r3","p2r4","p2r5","p2r6","p2r7","p2r9"];
              for (const id of page2NormalIds) {
                const row = page2Rows.find((r) => r.id === id);
                if (!row) continue;
                const err = dispatchRow(row, labelMap[id]);
                if (err) return err;
              }
              const p2r10row = page2Rows.find((r) => r.id === "p2r10");
              if (p2r10row) {
                if (!p2r10row.need) {
                  return "契約支店の建設業許可確認を\n「問題なし」または「許可未取得」で選択してください。";
                }
                if (p2r10row.need === "許可未取得") {
                  const hasRequired =
                    p2r10row.checks["一般申請起票"] === true ||
                    p2r10row.checks["その他"] === true;
                  if (!hasRequired) {
                    return "契約支店の建設業許可確認の\n「一般申請起票」または「その他」を\n選択してください。";
                  }
                }
              }
              const validateRadioRow = (row: CheckRow, label: string): string | null => {
                if (!row.need) {
                  return `${label}を「対象あり」または「対象なし」で選択してください。`;
                }
                if (row.need === "対象あり") {
                  const hasCheck = !!row.checks["お客様処分"] || !!row.checks["その他"];
                  if (!hasCheck) {
                    return `${label}の対象あり内容を\n選択してください。`;
                  }
                }
                return null;
              };
              const p2r11row = page2Rows.find((r) => r.id === "p2r11");
              if (p2r11row) {
                const err = validateRadioRow(p2r11row, "家電リサイクル法");
                if (err) return err;
              }
              const p2r12row = page2Rows.find((r) => r.id === "p2r12");
              if (p2r12row) {
                const err = validateRadioRow(p2r12row, "フロン排出抑制法");
                if (err) return err;
              }
              const p2r13row = page2Rows.find((r) => r.id === "p2r13");
              if (p2r13row) {
                const err = validateP2r13(p2r13row);
                if (err) return err;
              }
              if (!designNeed) {
                return "設計管理職確認可否を\n「必要」または「不要」で選択してください。";
              }
              if (designNeed === "必要") {
                if (!employeeCd?.trim()) {
                  return "設計管理職確認可否の\n社員CDを入力してください。";
                }
              }
            }
            if (stepNumber === 4) {
              if (!confirmApplicationNeed) {
                return "建築基準法の確認申請の有無を\n「必要」または「不要」で選択してください。";
              }
              if (confirmApplicationNeed === "必要") {
                if (!designInstruction?.trim()) {
                  return "建築基準法の設計指示を\n入力してください。";
                }
              }
            }
            if (stepNumber === 5) {
              if (!attachments["estimate_output_pdf"]) {
                return "業者見積依頼書のPDF出力を\n実施してください。";
              }
              const step5LabelMap: Record<string, string> = {
                r1: "第3者侵入防止策",
                r2: "仮設電気",
                r3: "仮設水道",
                r4: "仮設トイレ",
                r5: "電線防護管",
                r6: "工事駐車場",
                r6b: "別途指示事項(仮設)",
                r7: "足場設置",
                r8: "足場届出",
                r9: "昇降階段・巾木・中桟等",
                r10: "飛散防止措置",
                r11: "エントランス・共用部養生",
                r12: "足場設置部の植栽剪定",
                r13: "足場解体後の清掃費用",
                r13b: "別途指示事項(足場)",
                r14: "夜間照明・防犯カメラ",
                r15: "産廃費用",
                r16: "荷揚げ費用",
                p2r1: "道路使用",
                p2r2: "道路占用",
                p2r3: "交通誘導員",
                p2r4: "アスベスト含有調査",
                p2r5: "景観条例対象届出",
                p2r5b: "別途指示事項(届出)",
                p2r6: "打診(タイル・塗装)",
                p2r7: "下地調整",
                p2r8: "新築時タイル等保存資料",
                p2r9: "施工業者の建設業許可確認",
                p2r10: "契約支店の建設業許可確認",
                p2r11: "家電リサイクル法",
                p2r12: "フロン排出抑制法",
                p2r13: "防水工事等保証の確認",
              };
              for (const row of page1Rows) {
                if (row.id === "r6") {
                  if (row.need === "不要") continue;
                  const hasRequired =
                    row.checks["外部"] === true ||
                    row.checks["場内"] === true;
                  if (!hasRequired) {
                    return "工事駐車場の「外部」または\n「場内」を選択してください。";
                  }
                  continue;
                }
                if (!row.managerConfirm) {
                  const label = step5LabelMap[row.id] ?? row.item;
                  return `${label}の大パ確認に\nチェックしてください。`;
                }
              }
              for (const row of page2Rows) {
                if (row.id === "p2r8") continue;
                if (!row.managerConfirm) {
                  const label = step5LabelMap[row.id] ?? row.item;
                  return `${label}の大パ確認に\nチェックしてください。`;
                }
              }
              const p2r8row = page2Rows.find((r) => r.id === "p2r8");
              if (p2r8row && p2r8row.need === "必要") {
                const hokanText = p2r8row.remarkExtra?.[0]?.value;
                if (!hokanText?.trim()) {
                  return "新築時タイル等保存資料の\n保管先を入力してください。";
                }
                const jotaiChecked = p2r8row.remarkExtra?.[1]?.fileCheckboxValue;
                if (!jotaiChecked) {
                  return "新築時タイル等保存資料の\n状態確証及び枚数添付を\n選択してください。";
                }
                const jotaiText = p2r8row.remarkExtra?.[1]?.value;
                if (!jotaiText?.trim()) {
                  return "新築時タイル等保存資料の\n状態確証及び枚数添付の\n内容を入力してください。";
                }
                if (!attachments["jotai_kakunin_tenpu"]) {
                  return "新築時タイル等保存資料の\n状態確証及び枚数添付ファイルを\nアップロードしてください。";
                }
              }
            }
            if (stepNumber === 6) {
              if (createdByDapaTanto) return null;
              if (!attachments["estimate_output_pdf"]) {
                return "業者見積依頼書のPDF出力を\n実施してください。";
              }
              const step6LabelMap: Record<string, string> = {
                r1: "第3者侵入防止策",
                r2: "仮設電気",
                r3: "仮設水道",
                r4: "仮設トイレ",
                r5: "電線防護管",
                r6: "工事駐車場",
                r6b: "別途指示事項(仮設)",
                r7: "足場設置",
                r8: "足場届出",
                r9: "昇降階段・巾木・中桟等",
                r10: "飛散防止措置",
                r11: "エントランス・共用部養生",
                r12: "足場設置部の植栽剪定",
                r13: "足場解体後の清掃費用",
                r13b: "別途指示事項(足場)",
                r14: "夜間照明・防犯カメラ",
                r15: "産廃費用",
                r16: "荷揚げ費用",
                p2r1: "道路使用",
                p2r2: "道路占用",
                p2r3: "交通誘導員",
                p2r4: "アスベスト含有調査",
                p2r5: "景観条例対象届出",
                p2r5b: "別途指示事項(届出)",
                p2r6: "打診(タイル・塗装)",
                p2r7: "下地調整",
                p2r8: "新築時タイル等保存資料",
                p2r9: "施工業者の建設業許可確認",
                p2r10: "契約支店の建設業許可確認",
                p2r11: "家電リサイクル法",
                p2r12: "フロン排出抑制法",
                p2r13: "防水工事等保証の確認",
              };
              for (const row of page1Rows) {
                if (row.id === "r6") {
                  if (row.need === "不要") continue;
                  const hasRequired =
                    row.checks["外部"] === true ||
                    row.checks["場内"] === true;
                  if (!hasRequired) {
                    return "工事駐車場の「外部」または\n「場内」を選択してください。";
                  }
                  continue;
                }
                if (!row.managerConfirm) {
                  const label = step6LabelMap[row.id] ?? row.item;
                  return `${label}の大パ確認に\nチェックしてください。`;
                }
              }
              for (const row of page2Rows) {
                if (row.id === "p2r8") continue;
                if (!row.managerConfirm) {
                  const label = step6LabelMap[row.id] ?? row.item;
                  return `${label}の大パ確認に\nチェックしてください。`;
                }
              }
              const p2r8row = page2Rows.find((r) => r.id === "p2r8");
              if (p2r8row && p2r8row.need === "必要") {
                const hokanText = p2r8row.remarkExtra?.[0]?.value;
                if (!hokanText?.trim()) {
                  return "新築時タイル等保存資料の\n保管先を入力してください。";
                }
                const jotaiChecked = p2r8row.remarkExtra?.[1]?.fileCheckboxValue;
                if (!jotaiChecked) {
                  return "新築時タイル等保存資料の\n状態確証及び枚数添付を\n選択してください。";
                }
                const jotaiText = p2r8row.remarkExtra?.[1]?.value;
                if (!jotaiText?.trim()) {
                  return "新築時タイル等保存資料の\n状態確証及び枚数添付の\n内容を入力してください。";
                }
                if (!attachments["jotai_kakunin_tenpu"]) {
                  return "新築時タイル等保存資料の\n状態確証及び枚数添付ファイルを\nアップロードしてください。";
                }
              }
            }
            if (stepNumber === 8) {
              if (!orderResult) {
                return "大パ最終確認欄の\n「受注」または「失注」を\n選択してください。";
              }
              if (orderResult === "失注" && !finalReason.trim()) {
                return "失注の理由を入力してください。";
              }
              if (!attachments["okyakusama_mitsumori"]) {
                return "お客様提案見積書を\n添付してください。";
              }
              if (orderResult === "受注") {
                if (!attachments["keiyakusho_sakusei"]) {
                  return "契約書作成依頼書を\n添付してください。";
                }
              }
              if (orderResult !== "失注" && !gyomuItakuCd?.trim() && !partnerCd?.trim()) {
                return "業務課依頼欄の\n建託またはパートナーズの\n社員CDを入力してください。";
              }
            }
            if (stepNumber === 9) {
              if (createdByDapaKacho) {
                if (!orderResult) {
                  return "大パ最終確認欄の\n「受注」または「失注」を\n選択してください。";
                }
                if (orderResult === "失注" && !finalReason?.trim()) {
                  return "失注の理由を入力してください。";
                }
                if (!attachments["okyakusama_mitsumori"]) {
                  return "お客様提案見積書を\n添付してください。";
                }
                if (orderResult === "受注") {
                  if (!attachments["keiyakusho_sakusei"]) {
                    return "契約書作成依頼書を\n添付してください。";
                  }
                }
                if (orderResult !== "失注" && !gyomuItakuCd?.trim() && !partnerCd?.trim()) {
                  return "業務課依頼欄の\n建託またはパートナーズの\n社員CDを入力してください。";
                }
              }
              if (!daipaFinalConfirm) {
                return "大パ最終確認欄の\n大パ管理職確認にチェックしてください。";
              }
            }
            return null;
          }}
        />

        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <button type="button" onClick={() => { if (isFormDirty()) { setShowLeaveDialog(true); } else { nav("/", { replace: true }); } }} className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
            提案物件一覧
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={!isEditable || submitting}
            className={`rounded-xl bg-[#17375E] px-6 py-3 font-semibold text-white hover:bg-[#1e2d40] disabled:opacity-50 ${!isEditable ? "cursor-not-allowed" : ""}`}
          >
            {submitting ? "登録中..." : "登録"}
          </button>
        </div>
      </main>
      {showLeaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
            <div className="text-base font-semibold text-slate-900">未保存の変更があります。</div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" disabled={submitting} onClick={async () => { const targetId = await handleSubmit(true); if (targetId) { setShowLeaveDialog(false); nav("/", { replace: true }); } else { setShowLeaveDialog(false); } }} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                保存して移動
              </button>
              <button type="button" onClick={() => { setShowLeaveDialog(false); nav("/", { replace: true }); }} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600">
                保存せずに移動
              </button>
              <button type="button" onClick={() => setShowLeaveDialog(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
      {showMitsumoriDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
            <div className="text-base font-semibold text-slate-900">未保存の変更があります。保存してから見積依頼書を開きますか？</div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setShowMitsumoriDialog(false)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                キャンセル
              </button>
              <button type="button" onClick={handleConfirmSaveAndOpen} disabled={submitting} className="rounded-lg bg-[#17375E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e2d40] disabled:opacity-50">
                保存して開く
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}