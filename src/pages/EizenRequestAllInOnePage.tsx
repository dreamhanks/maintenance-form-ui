import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckRow, NeedFlag, OrderResult, YesNo } from "../components/eizen/EizenFormTypes";
import { formApi, attachmentApi } from "../form/api";
import { buildMultipartFormData } from "../form/payload_multipart";
import { FullForm, initialForm } from "../form/formTypes";
import { inputClass } from "../components/eizen/EizenFormStyles";
import JaDatePicker from "../components/JaDatePicker";
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
    unit: "m",
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
    unit: "台",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r7",
    category: "足場",
    item: "足場設置",
    need: "",
    checks: {
      全周: false,
      一部: false,
      新築時: false,
      "仮設図面添付": false,
    },
    amount: "",
    unit: "㎡",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r8",
    category: "足場",
    item: "足場届出（機械設置届）",
    need: "",
    checks: {
      "建設準備届出実施": false,
    },
    amount: "",
    unit: "円",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r9",
    category: "足場",
    item: "昇降階段、中木、中桟等",
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
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r11",
    category: "足場",
    item: "エントランス・共用部養生",
    need: "",
    checks: {
      枠養生材: false,
      床養生材: false,
      その他: false,
    },
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
    remark: "",
    managerConfirm: false,
  },
  {
    id: "r13",
    category: "足場",
    item: "足場解体後の清掃費用",
    need: "",
    checks: {},
    remark: "",
    managerConfirm: false,
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
    amount: "",
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
      リッカー: false,
      ユニック: false,
      "手運び（人工）": false,
      その他: false,
    },
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
    unit: "回",
    remark: "",
    managerConfirm: false,
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
    unit: "㎡",
    remark: "",
    managerConfirm: false,
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
    unit: "円",
    remark: "",
    managerConfirm: false,
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
    unit: "円",
    remark: "",
    managerConfirm: false,
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
    unit: "円",
    remark: "",
    managerConfirm: false,
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
    amount: "",
    unit: "円",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "p2r7",
    category: "調査",
    item: "下地調整",
    need: "",
    checks: {
      必要箇所: false,
    },
    amount: "",
    unit: "円",
    remark: "",
    managerConfirm: false,
  },
  {
    id: "p2r8",
    category: "確認",
    item: "新築時タイル等保存資料",
    need: "",
    checks: {},
    remark: "",
    managerConfirm: false,
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
    remark: "",
    managerConfirm: false,
  },
  {
    id: "p2r10",
    category: "確認",
    item: "契約支店の建設業許可確認",
    need: "",
    checks: {
      問題なし: false,
      一般申請起票: false,
      許可未取得: false,
      その他: false,
    },
    remark: "",
    managerConfirm: false,
  },
  {
    id: "p2r11",
    category: "確認",
    item: "家電リサイクル法",
    need: "",
    checks: {
      対象あり: false,
      お客様処分: false,
      対象なし: false,
      その他: false,
    },
    remark: "",
    managerConfirm: false,
  },
  {
    id: "p2r12",
    category: "確認",
    item: "フロン排出抑制法",
    need: "",
    checks: {
      対象あり: false,
      お客様処分: false,
      対象なし: false,
      その他: false,
    },
    remark: "",
    managerConfirm: false,
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
    unit: "年",
    remark: "",
    managerConfirm: false,
  },
];

export default function EizenRequestAllInOnePage() {
 const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editId = id ? Number(id) : null;
  const [submitting, setSubmitting] = useState(false);

  // Attachment state: fieldKey → { filename, uploading }
  const [attachments, setAttachments] = useState<Record<string, { filename: string; uploading: boolean }>>({});
  // Pending files for unsaved forms (no editId yet)
  const pendingFilesRef = useRef<Record<string, File>>({});
  // Hidden file input refs per fieldKey
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Load existing attachments on edit
  useEffect(() => {
    if (!editId) return;
    attachmentApi.list(editId).then((list) => {
      const map: Record<string, { filename: string; uploading: boolean }> = {};
      for (const att of list) {
        map[att.fieldKey] = { filename: att.originalName ?? att.fieldKey, uploading: false };
      }
      setAttachments(map);
    }).catch(() => {});
  }, [editId]);

  const handleFileCheckChange = (fieldKey: string, checked: boolean, setChecked: (v: boolean) => void) => {
    if (checked) {
      // Open file picker
      const input = fileInputRefs.current[fieldKey];
      if (input) {
        input.value = "";
        input.click();
      }
    } else {
      // Uncheck → delete file
      setChecked(false);
      if (editId && attachments[fieldKey]) {
        attachmentApi.delete(editId, fieldKey).catch(() => {});
      }
      delete pendingFilesRef.current[fieldKey];
      setAttachments((prev) => {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      });
    }
  };

  const handleFileSelected = (fieldKey: string, file: File, setChecked: (v: boolean) => void) => {
    setChecked(true);
    if (editId) {
      setAttachments((prev) => ({ ...prev, [fieldKey]: { filename: file.name, uploading: true } }));
      attachmentApi.upload(editId, fieldKey, file)
        .then(() => {
          setAttachments((prev) => ({ ...prev, [fieldKey]: { filename: file.name, uploading: false } }));
        })
        .catch(() => {
          toast.error("ファイルアップロードに失敗しました");
          setChecked(false);
          setAttachments((prev) => {
            const next = { ...prev };
            delete next[fieldKey];
            return next;
          });
        });
    } else {
      // Store locally until form is created
      pendingFilesRef.current[fieldKey] = file;
      setAttachments((prev) => ({ ...prev, [fieldKey]: { filename: file.name, uploading: false } }));
    }
  };

  const getAttachmentUrl = (fieldKey: string): string | null => {
    if (editId) {
      return attachmentApi.openUrl(editId, fieldKey);
    }
    // For unsaved forms, create a blob URL from the pending file
    const pending = pendingFilesRef.current[fieldKey];
    if (pending) {
      return URL.createObjectURL(pending);
    }
    return null;
  };

  const [documentNo, setDocumentNo] = useState("");
  const [issueDate, setIssueDate] = useState("");

  const [furigana, setFurigana] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [propertyCd, setPropertyCd] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [productName, setProductName] = useState("");
  const [repairHistory, setRepairHistory] = useState("");

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
  const [fixedVendorName, setFixedVendorName] = useState("");
  const [fixedVendorCd, setFixedVendorCd] = useState("");
  const [proposalDate, setProposalDate] = useState("");
  const [contractDate, setContractDate] = useState("");
  const [startDate, setStartDate] = useState("");

  const [drawing, setDrawing] = useState(false);
  const [otherMaterial, setOtherMaterial] = useState(false);
  const [photo4side, setPhoto4side] = useState(false);
  const [photoPart, setPhotoPart] = useState(false);
  const [photoOther, setPhotoOther] = useState(false);
  const [photoOtherText, setPhotoOtherText] = useState("");
  const [attachRemark, setAttachRemark] = useState("");
  const [dapManagerConfirmDrawing, setDapManagerConfirmDrawing] = useState(false);
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
  const [designAttachment, setDesignAttachment] = useState("");
  const [designDapConfirm, setDesignDapConfirm] = useState(false);
  const [designRemark, setDesignRemark] = useState("");

  const [estimateOutput, setEstimateOutput] = useState(false);
  const [estimateAttach, setEstimateAttach] = useState(false);
  const [estimateRemark, setEstimateRemark] = useState("");
  const [maintenanceEstimateAttach, setMaintenanceEstimateAttach] = useState(false);
  const [maintenanceEstimateRemark, setMaintenanceEstimateRemark] = useState("");
  const [orderResult, setOrderResult] = useState<OrderResult>("");
  const [lostOrder, setLostOrder] = useState(false);
  const [generalApplyAttach, setGeneralApplyAttach] = useState(false);
  const [generalApplyNotNeed, setGeneralApplyNotNeed] = useState(false);
  const [finalReason, setFinalReason] = useState("");

  const [gyomuItakuCd, setGyomuItakuCd] = useState("");
  const [gyomuItakuName, setGyomuItakuName] = useState("");
  const [partnerCd, setPartnerCd] = useState("");
  const [partnerName, setPartnerName] = useState("");

  const [approval1, setApproval1] = useState("");
  const [approval2, setApproval2] = useState("");
  const [approval3, setApproval3] = useState("");
  const [approval4, setApproval4] = useState("");
  const [approval5, setApproval5] = useState("");
  const [approval6, setApproval6] = useState("");
  const [approval7, setApproval7] = useState("");

  const handleSubmit = async () => {
    if (submitting) return;
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
      const fd = buildMultipartFormData(form);
      if (editId) {
        await formApi.update(editId, fd);
      } else {
        const result = await formApi.create(fd);
        // Upload any pending files that were selected before form was saved
        const newId = result?.id;
        if (newId) {
          const pending = Object.entries(pendingFilesRef.current);
          await Promise.all(
            pending.map(([key, file]) => attachmentApi.upload(newId, key, file).catch(() => {}))
          );
          pendingFilesRef.current = {};
        }
      }
      nav("/", { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "保存に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  const updatePage1Row = (id: string, next: CheckRow) => {
    setPage1Rows((prev) => prev.map((r) => (r.id === id ? next : r)));
  };

  const updatePage2Row = (id: string, next: CheckRow) => {
    setPage2Rows((prev) => prev.map((r) => (r.id === id ? next : r)));
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="sticky top-0 z-30 border-b border-slate-300 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-[1700px] px-4 py-4">
          <div className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-8">
              <h1 className="text-center text-3xl font-bold tracking-wide text-slate-900">
                営繕工事 事前確認依頼書 兼 見積確認依頼書
              </h1>
              <p className="mt-2 text-center text-sm text-slate-600">
                下記営繕工事について、工事内容・仮設工事の検証を依頼致します。
              </p>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">文書番号</label>
              <input value={documentNo} onChange={(e) => setDocumentNo(e.target.value)} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">起票日</label>
              <JaDatePicker value={issueDate} onChange={setIssueDate} className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto flex max-w-[1700px] flex-col gap-6 px-4 py-6">
        <BasicInfoSection
          furigana={furigana}
          setFurigana={setFurigana}
          customerName={customerName}
          setCustomerName={setCustomerName}
          address={address}
          setAddress={setAddress}
          propertyCd={propertyCd}
          setPropertyCd={setPropertyCd}
          buildingName={buildingName}
          setBuildingName={setBuildingName}
          completionDate={completionDate}
          setCompletionDate={setCompletionDate}
          productName={productName}
          setProductName={setProductName}
          repairHistory={repairHistory}
          setRepairHistory={setRepairHistory}
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
          fixedVendorName={fixedVendorName}
          setFixedVendorName={setFixedVendorName}
          fixedVendorCd={fixedVendorCd}
          setFixedVendorCd={setFixedVendorCd}
          proposalDate={proposalDate}
          setProposalDate={setProposalDate}
          contractDate={contractDate}
          setContractDate={setContractDate}
          startDate={startDate}
          setStartDate={setStartDate}
        />

        <AttachmentSection
          drawing={drawing}
          setDrawing={setDrawing}
          otherMaterial={otherMaterial}
          setOtherMaterial={setOtherMaterial}
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
          dapManagerConfirmDrawing={dapManagerConfirmDrawing}
          setDapManagerConfirmDrawing={setDapManagerConfirmDrawing}
          dapManagerConfirmPhoto={dapManagerConfirmPhoto}
          setDapManagerConfirmPhoto={setDapManagerConfirmPhoto}
          attachments={attachments}
          fileInputRefs={fileInputRefs}
          onFileCheckChange={handleFileCheckChange}
          onFileSelected={handleFileSelected}
          getAttachmentUrl={getAttachmentUrl}
        />

        <TemporaryCheckSection
          rows={page1Rows}
          updateRow={updatePage1Row}
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
        />

        <TemporaryConfirmSection
          rows={page2Rows}
          updateRow={updatePage2Row}
          siteInstruction={siteInstruction2}
          setSiteInstruction={setSiteInstruction2}
          grpTodokede={grpTodokede}
          setGrpTodokede={setGrpTodokede}
          grpChosa={grpChosa}
          setGrpChosa={setGrpChosa}
          grpKakunin={grpKakunin}
          setGrpKakunin={setGrpKakunin}
        />

        <MaintenanceAttachmentSection
          requiredDrawing={requiredDrawing}
          setRequiredDrawing={setRequiredDrawing}
          requiredOther={requiredOther}
          setRequiredOther={setRequiredOther}
          requiredOtherText={requiredOtherText}
          setRequiredOtherText={setRequiredOtherText}
          maintenanceRemark={maintenanceRemark}
          setMaintenanceRemark={setMaintenanceRemark}
        />

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
        />

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
          generalApplyAttach={generalApplyAttach}
          setGeneralApplyAttach={setGeneralApplyAttach}
          generalApplyNotNeed={generalApplyNotNeed}
          setGeneralApplyNotNeed={setGeneralApplyNotNeed}
          lostOrder={lostOrder}
          setLostOrder={setLostOrder}
          finalReason={finalReason}
          setFinalReason={setFinalReason}
          attachments={attachments}
          fileInputRefs={fileInputRefs}
          onFileCheckChange={handleFileCheckChange}
          onFileSelected={handleFileSelected}
          getAttachmentUrl={getAttachmentUrl}
        />

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

        <ApprovalFlowSection
          approval1={approval1}
          setApproval1={setApproval1}
          approval2={approval2}
          setApproval2={setApproval2}
          approval3={approval3}
          setApproval3={setApproval3}
          approval4={approval4}
          setApproval4={setApproval4}
          approval5={approval5}
          setApproval5={setApproval5}
          approval6={approval6}
          setApproval6={setApproval6}
          approval7={approval7}
          setApproval7={setApproval7}
        />

        <div className="flex justify-end gap-3 pb-10">
          <button type="button" onClick={() => nav("/", { replace: true })} className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
            提案物件一覧
          </button>
          <button type="button" onClick={handleSubmit} disabled={submitting} className="rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-50">
            {submitting ? "登録中..." : "登録"}
          </button>
        </div>
      </main>
    </div>
  );
}