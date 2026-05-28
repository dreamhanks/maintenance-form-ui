import { useState } from "react";
import { toast } from "react-toastify";
import { sectionWrap } from "./EizenFormStyles";
import type { WorkflowStepDto, DaipaKachoUserDto } from "../../form/api";
import { workflowApi, formApi } from "../../form/api";

/** Role required for each of the 10 steps */
const STEP_ROLES: Record<number, string> = {
  1: "大パ担当者",
  2: "大パ管理職",
  3: "メンテ管理職",
  4: "設計管理職",
  5: "大パ担当者",
  6: "大パ管理職",
  7: "メンテ管理職",
  8: "大パ担当者",
  9: "大パ管理職",
  10: "業務管理職",
};

type Props = {
  formId: number | null;
  steps: WorkflowStepDto[];
  userRole: string | null | undefined;
  creatorRole?: string | null;
  orderResult?: string;
  designNeed?: string;
  onStepsChange: (steps: WorkflowStepDto[]) => void;
  isFormDirty?: () => boolean;
  onSaveForm?: () => Promise<number | null>;
  validateConfirm?: (stepNumber: number) => string | null;
};

function StepBox({
  step,
  seqNum,
  userRole,
  formId,
  prevConfirmed,
  onRequestConfirm,
  onRequestReject,
  isLoadingConfirm,
  rejectHidden,
}: {
  step: WorkflowStepDto;
  seqNum: number;
  userRole: string | null | undefined;
  formId: number | null;
  prevConfirmed: boolean;
  onRequestConfirm: (stepNumber: number) => void;
  onRequestReject: (stepNumber: number) => void;
  isLoadingConfirm?: boolean;
  rejectHidden?: boolean;
}) {
  const requiredRole = STEP_ROLES[step.stepNumber];
  const roleMatch = userRole === requiredRole || userRole === "admin";
  const isConfirmed = step.status === "confirmed";

  const canConfirm = !!formId && roleMatch && prevConfirmed && !isConfirmed && step.status !== "waiting";
  const canReject = !!formId && roleMatch && step.status === "pending" && step.stepNumber !== 1;

  return (
    <div className="w-32 rounded-xl border-2 border-slate-800">
      <div className="border-b-2 border-slate-800 bg-slate-50 px-3 py-2 text-center font-semibold text-sm">
        <div className="text-xs font-semibold text-[#17375E] border-b border-slate-300 pb-1 mb-1">Step {seqNum}</div>
        {step.stepLabel.replace(/[①②③④⑤⑥⑦⑧⑨⑩]/g, "")}
      </div>
      <div className="flex flex-col items-center justify-center px-2 py-2 text-center text-slate-800 min-h-14">
        {isConfirmed && (
          <>
            {step.actorEmployeeCode && (
              <>
                <span className="text-xs text-slate-500">{step.actorEmployeeCode}</span>
                <div className="w-full border-t border-slate-300 my-0.5" />
              </>
            )}
            <span className="text-sm font-medium">{step.actorName ?? ""}</span>
          </>
        )}
      </div>
      <div className={`${step.stepNumber === 1 ? "" : "grid grid-cols-2"} border-t-2 border-slate-800`}>
        {step.stepNumber !== 1 && !rejectHidden && (
          <button
            type="button"
            onClick={() => { if (canReject) onRequestReject(step.stepNumber); }}
            disabled={!canReject}
            className={`border-r-2 border-slate-800 px-2 py-2 text-center text-sm font-semibold transition-colors ${
              canReject
                ? "bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            差戻
          </button>
        )}
        <button
          type="button"
          onClick={() => { if (canConfirm) onRequestConfirm(step.stepNumber); }}
          disabled={!canConfirm || !!isLoadingConfirm}
          className={`${step.stepNumber === 1 ? "w-full" : ""} px-2 py-2 text-center text-sm font-semibold transition-colors ${
            canConfirm
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isLoadingConfirm ? "読み込み中..." : "確認"}
        </button>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="self-center flex items-center justify-center h-6 w-6">
      <div className="h-0.5 w-6 bg-slate-800 relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 border-y-4 border-l-4 border-y-transparent border-l-slate-800" />
      </div>
    </div>
  );
}

const DEFAULT_STEPS: WorkflowStepDto[] = Array.from({ length: 10 }, (_, i) => ({
  stepNumber: i + 1,
  stepName: `step_${i + 1}`,
  stepLabel: STEP_ROLES[i + 1] ?? `ステップ${i + 1}`,
  status: "waiting",
  actorEmployeeCode: null,
  actorName: null,
  comment: null,
  actionedAt: null,
}));

type PendingAction = {
  type: "confirm" | "reject";
  stepNumber: number;
  stepLabel: string;
} | null;

export default function ApprovalFlowSection({ formId, steps, userRole, creatorRole, orderResult, designNeed, onStepsChange, isFormDirty, onSaveForm, validateConfirm }: Props) {
  const effectiveSteps = steps.length > 0 ? steps : DEFAULT_STEPS;
  // Dirty-check dialog state (existing: "保存して確認")
  const [pendingConfirmStep, setPendingConfirmStep] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  // Action confirmation dialog state (new)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [eligibleDaipaUsers, setEligibleDaipaUsers] = useState<DaipaKachoUserDto[]>([]);
  const [eligibleMenteUsers, setEligibleMenteUsers] = useState<DaipaKachoUserDto[]>([]);
  const [designUser, setDesignUser] = useState<DaipaKachoUserDto | null>(null);
  const [businessUser, setBusinessUser] = useState<DaipaKachoUserDto | null>(null);
  const [rejectComment, setRejectComment] = useState<string>("");
  const [eligibleDaipaTantoUsers, setEligibleDaipaTantoUsers] = useState<DaipaKachoUserDto[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [loadingStepNumber, setLoadingStepNumber] = useState<number | null>(null);

  const getLabel = (stepNumber: number) =>
    effectiveSteps.find((s) => s.stepNumber === stepNumber)?.stepLabel ?? "";

  const runConfirm = async (stepNumber: number) => {
    if (!formId) return;
    try {
      const updated = await workflowApi.confirm(
        formId,
        stepNumber,
        (() => {
          if (stepNumber === 3 && designNeed === "必要") {
            return designUser
              ? [designUser.email].filter((e) => e.length > 0)
              : undefined;
          }
          if (stepNumber === 9 && orderResult !== "失注") {
            return businessUser
              ? [businessUser.email].filter((e) => e.length > 0)
              : undefined;
          }
          if (selectedCodes.length === 0) return undefined;
          let eligible: DaipaKachoUserDto[];
          if ([1, 5, 8].includes(stepNumber)) {
            eligible = eligibleDaipaUsers;
          } else if ([2, 6].includes(stepNumber)) {
            eligible = eligibleMenteUsers;
          } else if (stepNumber === 3 && creatorRole === "大パ担当者") {
            eligible = eligibleDaipaTantoUsers;
          } else if (stepNumber === 3 && creatorRole === "大パ管理職") {
            eligible = eligibleDaipaUsers;
          } else if (stepNumber === 4 && creatorRole === "大パ担当者") {
            eligible = eligibleDaipaTantoUsers;
          } else if (stepNumber === 4 && creatorRole === "大パ管理職") {
            eligible = eligibleDaipaUsers;
          } else if (stepNumber === 7 && creatorRole === "大パ担当者") {
            eligible = eligibleDaipaTantoUsers;
          } else if (stepNumber === 7 && creatorRole === "大パ管理職") {
            eligible = eligibleDaipaUsers;
          } else {
            return undefined;
          }
          const emails = eligible
            .filter((u) => selectedCodes.includes(u.employeeCode))
            .map((u) => u.email)
            .filter((e) => e.length > 0);
          return emails.length > 0 ? emails : undefined;
        })(),
      );
      onStepsChange(updated);
      setSelectedCodes([]);
      setEligibleDaipaUsers([]);
      setEligibleMenteUsers([]);
      setEligibleDaipaTantoUsers([]);
      setDesignUser(null);
      setBusinessUser(null);
      toast.success(`${getLabel(stepNumber)} を確認しました`);
    } catch (err: any) {
      toast.error(err?.message || "確認に失敗しました");
    }
  };

  const runReject = async (stepNumber: number) => {
    if (!formId) return;
    try {
      const recipientEmails = (() => {
        if (stepNumber === 6 && creatorRole === "大パ管理職" && designNeed === "必要") {
          return designUser
            ? [designUser.email].filter((e) => e.length > 0)
            : undefined;
        }
        if (stepNumber === 5 && designNeed === "必要") {
          return designUser
            ? [designUser.email].filter((e) => e.length > 0)
            : undefined;
        }
        if (selectedCodes.length === 0) return undefined;
        let eligible: DaipaKachoUserDto[];
        if (stepNumber === 10) {
          eligible = eligibleDaipaUsers;
        } else if (stepNumber === 9 && creatorRole === "大パ担当者") {
          eligible = eligibleDaipaTantoUsers;
        } else if (stepNumber === 9 && creatorRole === "大パ管理職") {
          eligible = eligibleMenteUsers;
        } else if (stepNumber === 8) {
          eligible = eligibleMenteUsers;
        } else if (stepNumber === 7) {
          eligible = eligibleDaipaUsers;
        } else if (stepNumber === 6 && creatorRole === "大パ担当者") {
          eligible = eligibleDaipaTantoUsers;
        } else if (stepNumber === 6 && creatorRole === "大パ管理職") {
          eligible = eligibleMenteUsers;
        } else if (stepNumber === 5) {
          eligible = eligibleMenteUsers;
        } else if (stepNumber === 4) {
          eligible = eligibleMenteUsers;
        } else if (stepNumber === 3) {
          eligible = eligibleDaipaUsers;
        } else if (stepNumber === 2) {
          eligible = eligibleDaipaTantoUsers;
        } else {
          return undefined;
        }
        const emails = eligible
          .filter((u) => selectedCodes.includes(u.employeeCode))
          .map((u) => u.email)
          .filter((e) => e.length > 0);
        return emails.length > 0 ? emails : undefined;
      })();
      const updated = await workflowApi.reject(
        formId,
        stepNumber,
        rejectComment.trim() || undefined,
        recipientEmails,
      );
      onStepsChange(updated);
      setRejectComment("");
      setSelectedCodes([]);
      setEligibleDaipaUsers([]);
      setEligibleMenteUsers([]);
      setEligibleDaipaTantoUsers([]);
      toast.success(`${getLabel(stepNumber)} を差戻しました`);
    } catch (err: any) {
      toast.error(err?.message || "差戻に失敗しました");
    }
  };

  // Show the action-confirmation dialog for confirm or reject
  const showActionDialog = (type: "confirm" | "reject", stepNumber: number) => {
    setPendingAction({ type, stepNumber, stepLabel: getLabel(stepNumber) });
  };

  // Fetch eligible recipients for the step, then open the confirm dialog
  const fetchUsersAndShowDialog = async (stepNumber: number) => {
    if ([1, 5, 8].includes(stepNumber) && formId) {
      setLoadingStepNumber(stepNumber);
      setSelectedCodes([]);
      setEligibleMenteUsers([]);
      setEligibleDaipaTantoUsers([]);
      setDesignUser(null);
      setBusinessUser(null);
      try {
        const users = await formApi.getDaipaKachoUsers(Number(formId));
        setEligibleDaipaUsers(users);
      } catch {
        setEligibleDaipaUsers([]);
      } finally {
        setLoadingStepNumber(null);
      }
    } else if ([2, 6].includes(stepNumber) && formId) {
      setLoadingStepNumber(stepNumber);
      setSelectedCodes([]);
      setEligibleDaipaUsers([]);
      setEligibleDaipaTantoUsers([]);
      setDesignUser(null);
      setBusinessUser(null);
      try {
        const users = await formApi.getMenteKanrishokuUsers(Number(formId));
        setEligibleMenteUsers(users);
      } catch {
        setEligibleMenteUsers([]);
      } finally {
        setLoadingStepNumber(null);
      }
    } else if (stepNumber === 3 && formId) {
      setLoadingStepNumber(stepNumber);
      setSelectedCodes([]);
      setEligibleDaipaUsers([]);
      setEligibleMenteUsers([]);
      setEligibleDaipaTantoUsers([]);
      setDesignUser(null);
      setBusinessUser(null);
      try {
        if (designNeed === "必要") {
          const users = await formApi.getDesignUser(Number(formId));
          setDesignUser(users.length > 0 ? users[0] : null);
        } else if (creatorRole === "大パ担当者") {
          const [tanto, multi] = await Promise.all([
            formApi.getDaipaTantoUsers(Number(formId)),
            formApi.getDaipaKachoMultiUsers(Number(formId)),
          ]);
          setEligibleDaipaTantoUsers([...tanto, ...multi]);
        } else if (creatorRole === "大パ管理職") {
          const users = await formApi.getDaipaKachoUsers(Number(formId));
          setEligibleDaipaUsers(users);
        }
      } catch {
        // silently fail
      } finally {
        setLoadingStepNumber(null);
      }
    } else if (stepNumber === 4 && formId) {
      setLoadingStepNumber(stepNumber);
      setSelectedCodes([]);
      setEligibleDaipaUsers([]);
      setEligibleMenteUsers([]);
      setEligibleDaipaTantoUsers([]);
      setDesignUser(null);
      setBusinessUser(null);
      try {
        if (creatorRole === "大パ担当者") {
          const [tanto, multi] = await Promise.all([
            formApi.getDaipaTantoUsers(Number(formId)),
            formApi.getDaipaKachoMultiUsers(Number(formId)),
          ]);
          setEligibleDaipaTantoUsers([...tanto, ...multi]);
        } else if (creatorRole === "大パ管理職") {
          const users = await formApi.getDaipaKachoUsers(Number(formId));
          setEligibleDaipaUsers(users);
        }
      } catch {
        // silently fail
      } finally {
        setLoadingStepNumber(null);
      }
    } else if (stepNumber === 7 && formId) {
      setLoadingStepNumber(stepNumber);
      setSelectedCodes([]);
      setEligibleDaipaUsers([]);
      setEligibleMenteUsers([]);
      setEligibleDaipaTantoUsers([]);
      setDesignUser(null);
      setBusinessUser(null);
      try {
        if (creatorRole === "大パ担当者") {
          const [tanto, multi] = await Promise.all([
            formApi.getDaipaTantoUsers(Number(formId)),
            formApi.getDaipaKachoMultiUsers(Number(formId)),
          ]);
          setEligibleDaipaTantoUsers([...tanto, ...multi]);
        } else if (creatorRole === "大パ管理職") {
          const users = await formApi.getDaipaKachoUsers(Number(formId));
          setEligibleDaipaUsers(users);
        }
      } catch {
        // silently fail
      } finally {
        setLoadingStepNumber(null);
      }
    } else if (stepNumber === 9 && formId) {
      setLoadingStepNumber(stepNumber);
      setSelectedCodes([]);
      setEligibleDaipaUsers([]);
      setEligibleMenteUsers([]);
      setEligibleDaipaTantoUsers([]);
      setDesignUser(null);
      setBusinessUser(null);
      try {
        if (orderResult !== "失注") {
          const users = await formApi.getBusinessUser(Number(formId));
          setBusinessUser(users.length > 0 ? users[0] : null);
        }
      } catch {
        // silently fail
      } finally {
        setLoadingStepNumber(null);
      }
    }
    showActionDialog("confirm", stepNumber);
  };

  // 確認 button clicked: validate, dirty check, optional user fetch, then action dialog
  const handleRequestConfirm = async (stepNumber: number) => {
    if (validateConfirm) {
      const errorMsg = validateConfirm(stepNumber);
      if (errorMsg) {
        toast.error(errorMsg);
        return;
      }
    }
    if (isFormDirty && isFormDirty()) {
      setPendingConfirmStep(stepNumber);
      return;
    }
    await fetchUsersAndShowDialog(stepNumber);
  };

  // 差戻 button clicked: show action dialog directly (no dirty check)
  const handleRequestReject = async (stepNumber: number) => {
    setRejectComment("");
    setSelectedCodes([]);
    if (stepNumber === 10 && formId) {
      setEligibleMenteUsers([]);
      setEligibleDaipaTantoUsers([]);
      try {
        const users = await formApi.getDaipaKachoUsers(Number(formId));
        setEligibleDaipaUsers(users);
      } catch {
        setEligibleDaipaUsers([]);
      }
    } else if (stepNumber === 9 && formId) {
      setEligibleDaipaUsers([]);
      try {
        if (creatorRole === "大パ担当者") {
          const [tanto, multi] = await Promise.all([
            formApi.getDaipaTantoUsers(Number(formId)),
            formApi.getDaipaKachoMultiUsers(Number(formId)),
          ]);
          setEligibleDaipaTantoUsers([...tanto, ...multi]);
          setEligibleMenteUsers([]);
        } else if (creatorRole === "大パ管理職") {
          const users = await formApi.getMenteKanrishokuUsers(Number(formId));
          setEligibleMenteUsers(users);
          setEligibleDaipaTantoUsers([]);
        } else {
          setEligibleMenteUsers([]);
          setEligibleDaipaTantoUsers([]);
        }
      } catch {
        setEligibleMenteUsers([]);
        setEligibleDaipaTantoUsers([]);
      }
    } else if (stepNumber === 8 && formId) {
      setEligibleDaipaUsers([]);
      setEligibleDaipaTantoUsers([]);
      try {
        const users = await formApi.getMenteKanrishokuUsers(Number(formId));
        setEligibleMenteUsers(users);
      } catch {
        setEligibleMenteUsers([]);
      }
    } else if (stepNumber === 7 && formId) {
      setEligibleMenteUsers([]);
      setEligibleDaipaTantoUsers([]);
      try {
        const users = await formApi.getDaipaKachoUsers(Number(formId));
        setEligibleDaipaUsers(users);
      } catch {
        setEligibleDaipaUsers([]);
      }
    } else if (stepNumber === 6 && formId) {
      setEligibleDaipaUsers([]);
      try {
        if (creatorRole === "大パ担当者") {
          setEligibleMenteUsers([]);
          setDesignUser(null);
          const [tanto, multi] = await Promise.all([
            formApi.getDaipaTantoUsers(Number(formId)),
            formApi.getDaipaKachoMultiUsers(Number(formId)),
          ]);
          setEligibleDaipaTantoUsers([...tanto, ...multi]);
        } else if (creatorRole === "大パ管理職" && designNeed === "必要") {
          setEligibleDaipaTantoUsers([]);
          setEligibleMenteUsers([]);
          const users = await formApi.getDesignUser(Number(formId));
          setDesignUser(users.length > 0 ? users[0] : null);
        } else if (creatorRole === "大パ管理職") {
          setEligibleDaipaTantoUsers([]);
          setDesignUser(null);
          const users = await formApi.getMenteKanrishokuUsers(Number(formId));
          setEligibleMenteUsers(users);
        } else {
          setEligibleDaipaTantoUsers([]);
          setEligibleMenteUsers([]);
          setDesignUser(null);
        }
      } catch {
        setEligibleDaipaTantoUsers([]);
        setEligibleMenteUsers([]);
        setDesignUser(null);
      }
    } else if (stepNumber === 5 && formId) {
      setEligibleDaipaUsers([]);
      setEligibleDaipaTantoUsers([]);
      try {
        if (designNeed === "必要") {
          setEligibleMenteUsers([]);
          const users = await formApi.getDesignUser(Number(formId));
          setDesignUser(users.length > 0 ? users[0] : null);
        } else {
          setDesignUser(null);
          const users = await formApi.getMenteKanrishokuUsers(Number(formId));
          setEligibleMenteUsers(users);
        }
      } catch {
        setEligibleMenteUsers([]);
        setDesignUser(null);
      }
    } else if (stepNumber === 4 && formId) {
      setEligibleDaipaUsers([]);
      setEligibleDaipaTantoUsers([]);
      try {
        const users = await formApi.getMenteKanrishokuUsers(Number(formId));
        setEligibleMenteUsers(users);
      } catch {
        setEligibleMenteUsers([]);
      }
    } else if (stepNumber === 3 && formId) {
      setEligibleMenteUsers([]);
      setEligibleDaipaTantoUsers([]);
      try {
        const users = await formApi.getDaipaKachoUsers(Number(formId));
        setEligibleDaipaUsers(users);
      } catch {
        setEligibleDaipaUsers([]);
      }
    } else if (stepNumber === 2 && formId) {
      setEligibleDaipaUsers([]);
      setEligibleMenteUsers([]);
      try {
        const [tanto, multi] = await Promise.all([
          formApi.getDaipaTantoUsers(Number(formId)),
          formApi.getDaipaKachoMultiUsers(Number(formId)),
        ]);
        setEligibleDaipaTantoUsers([...tanto, ...multi]);
      } catch {
        setEligibleDaipaTantoUsers([]);
      }
    } else {
      setEligibleDaipaUsers([]);
      setEligibleMenteUsers([]);
      setEligibleDaipaTantoUsers([]);
    }
    if (!(
      (stepNumber === 6 && creatorRole === "大パ管理職" && designNeed === "必要")
      ||
      (stepNumber === 5 && designNeed === "必要")
    )) {
      setDesignUser(null);
    }
    setBusinessUser(null);
    showActionDialog("reject", stepNumber);
  };

  // Dirty-check dialog: save then show action confirmation
  const handleSaveAndConfirm = async () => {
    if (pendingConfirmStep == null || !onSaveForm) return;
    setBusy(true);
    try {
      const savedId = await onSaveForm();
      if (!savedId) {
        toast.error("保存に失敗しました");
        return;
      }
      const stepNumber = pendingConfirmStep;
      setPendingConfirmStep(null);
      await fetchUsersAndShowDialog(stepNumber);
    } finally {
      setBusy(false);
    }
  };

  // Action dialog confirmed
  const handleActionConfirmed = async () => {
    if (!pendingAction) return;
    const { type, stepNumber } = pendingAction;
    setPendingAction(null);
    if (type === "confirm") {
      await runConfirm(stepNumber);
    } else {
      await runReject(stepNumber);
    }
  };

  // Hide 大パ担当者 steps (1, 5, 8) when the form was created by 大パ管理職.
  // Hide step 10 (業務管理職) when the form is a 失注 — workflow auto-completes at step 9.
  const skipDaipaTanto = creatorRole === "大パ管理職";
  const isHidden = (n: number) => {
    if (skipDaipaTanto && (n === 1 || n === 5 || n === 8)) return true;
    if (n === 10 && orderResult === "失注") return true;
    if (n === 4 && designNeed === "不要") return true;
    return false;
  };
  const visibleBoxNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => !isHidden(n));
  const getSeqBoxStep = (n: number): number => visibleBoxNums.indexOf(n) + 1;

  const getStep = (n: number) => effectiveSteps.find((s) => s.stepNumber === n);
  const isPrevConfirmed = (n: number) => {
    if (n === 1) return true;
    const prev = getStep(n - 1);
    return prev?.status === "confirmed";
  };

  const renderBox = (n: number) => {
    if (isHidden(n)) return null;
    const step = getStep(n);
    if (!step) return null;
    return (
      <StepBox
        step={step}
        seqNum={getSeqBoxStep(n)}
        userRole={userRole}
        formId={formId}
        prevConfirmed={isPrevConfirmed(n)}
        onRequestConfirm={handleRequestConfirm}
        onRequestReject={handleRequestReject}
        isLoadingConfirm={loadingStepNumber === step.stepNumber}
        rejectHidden={skipDaipaTanto && n === 2}
      />
    );
  };

  return (
    <section className={sectionWrap}>
      <div className="p-4">
        <h3 className="mb-3 text-lg font-bold text-slate-800">承認フロー</h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {renderBox(1)}
          {renderBox(2)}
          {renderBox(3)}
          {!isHidden(4) && <Arrow />}
          {renderBox(4)}
          <Arrow />
          {renderBox(5)}
          {renderBox(6)}
          {renderBox(7)}
          <Arrow />
          {renderBox(8)}
          {renderBox(9)}
          {renderBox(10)}
        </div>
      </div>
      {/* Dirty-check dialog (existing) */}
      {pendingConfirmStep != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
            <div className="text-base font-semibold text-slate-900">
              未保存の変更があります。保存してから確認しますか？
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={handleSaveAndConfirm}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                保存して確認
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setPendingConfirmStep(null)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Action confirmation dialog (new) */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
            <div className="text-lg font-semibold text-slate-900">
              {pendingAction.type === "confirm" ? "確認" : "差戻"}
            </div>
            <div className="mt-3 text-sm text-slate-700">
              {pendingAction.type === "confirm"
                ? (
                  <>
                    {`${pendingAction.stepLabel} を確認しますか？`}
                    {(() => {
                      const msg =
                        pendingAction.stepNumber === 5 && creatorRole === "大パ担当者"
                          ? "複数見積がある場合どこを指定したいか、グロスの物件があるか等を記載"
                          : pendingAction.stepNumber === 6 && creatorRole === "大パ管理職"
                          ? "複数見積がある場合どこを指定したいか、グロスの物件があるか等を記載"
                          : null;
                      return msg ? (
                        <>
                          <br />
                          <span className="mt-1 block text-slate-600">
                            {msg}
                          </span>
                        </>
                      ) : null;
                    })()}
                  </>
                )
                : (
                  <>
                    {pendingAction.stepLabel} を差戻しますか？
                    <br />
                    前のステップに戻ります。
                  </>
                )}
            </div>
            {pendingAction.type === "reject" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  差戻し理由
                  <span className="text-red-500 ml-1">＊</span>
                </div>
                <textarea
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="差戻しの理由を入力してください"
                />
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 10 && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 9 && creatorRole === "大パ担当者" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaTantoUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaTantoUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 9 && creatorRole === "大パ管理職" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleMenteUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleMenteUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 8 && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleMenteUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleMenteUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 7 && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 6 && creatorRole === "大パ担当者" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaTantoUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaTantoUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 6 && creatorRole === "大パ管理職" && designNeed === "必要" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  設計管理職へ通知します
                </div>
                {designUser ? (
                  <div className="text-sm text-slate-600 px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
                    {designUser.fullName} ({designUser.employeeCode})
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">通知先が見つかりません</div>
                )}
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 6 && creatorRole === "大パ管理職" && designNeed !== "必要" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleMenteUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleMenteUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 5 && designNeed === "必要" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  設計管理職へ通知します
                </div>
                {designUser ? (
                  <div className="text-sm text-slate-600 px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
                    {designUser.fullName} ({designUser.employeeCode})
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">通知先が見つかりません</div>
                )}
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 5 && designNeed !== "必要" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleMenteUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleMenteUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 4 && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleMenteUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleMenteUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 3 && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "reject" && pendingAction.stepNumber === 2 && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaTantoUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaTantoUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "confirm" && [1, 5, 8].includes(pendingAction.stepNumber) && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "confirm" && [2, 6].includes(pendingAction.stepNumber) && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleMenteUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleMenteUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "confirm" && pendingAction.stepNumber === 3 && designNeed === "必要" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  設計管理職へ通知します
                </div>
                {designUser ? (
                  <div className="text-sm text-slate-600 px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
                    {designUser.fullName} ({designUser.employeeCode})
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">通知先が見つかりません</div>
                )}
              </div>
            )}
            {pendingAction.type === "confirm" && pendingAction.stepNumber === 9 && orderResult !== "失注" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  業務管理職へ通知します
                </div>
                {businessUser ? (
                  <div className="text-sm text-slate-600 px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
                    {businessUser.fullName} ({businessUser.employeeCode})
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">通知先が見つかりません</div>
                )}
              </div>
            )}
            {pendingAction.type === "confirm" && pendingAction.stepNumber === 3 && designNeed !== "必要" && creatorRole === "大パ担当者" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaTantoUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaTantoUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "confirm" && pendingAction.stepNumber === 3 && designNeed !== "必要" && creatorRole === "大パ管理職" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "confirm" && pendingAction.stepNumber === 4 && creatorRole === "大パ担当者" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaTantoUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaTantoUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "confirm" && pendingAction.stepNumber === 4 && creatorRole === "大パ管理職" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "confirm" && pendingAction.stepNumber === 7 && creatorRole === "大パ担当者" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaTantoUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaTantoUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {pendingAction.type === "confirm" && pendingAction.stepNumber === 7 && creatorRole === "大パ管理職" && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-700 mb-2">
                  確認依頼メールの送信先を選択してください
                </div>
                {eligibleDaipaUsers.length === 0 ? (
                  <div className="text-sm text-slate-500">対象者がいません</div>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    {eligibleDaipaUsers.map((u) => (
                      <label
                        key={u.employeeCode}
                        className="flex items-center gap-2 py-1 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(u.employeeCode)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes((prev) => [...prev, u.employeeCode]);
                            } else {
                              setSelectedCodes((prev) =>
                                prev.filter((c) => c !== u.employeeCode),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-400 text-[#17375E]"
                        />
                        {u.fullName} ({u.employeeCode})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleActionConfirmed}
                disabled={
                  (pendingAction.type === "confirm" &&
                  (
                    ([1, 5, 8].includes(pendingAction.stepNumber) && eligibleDaipaUsers.length > 0) ||
                    ([2, 6].includes(pendingAction.stepNumber) && eligibleMenteUsers.length > 0) ||
                    (pendingAction.stepNumber === 3 && designNeed !== "必要" && creatorRole === "大パ担当者" && eligibleDaipaTantoUsers.length > 0) ||
                    (pendingAction.stepNumber === 3 && designNeed !== "必要" && creatorRole === "大パ管理職" && eligibleDaipaUsers.length > 0) ||
                    (pendingAction.stepNumber === 7 && creatorRole === "大パ担当者" && eligibleDaipaTantoUsers.length > 0) ||
                    (pendingAction.stepNumber === 7 && creatorRole === "大パ管理職" && eligibleDaipaUsers.length > 0) ||
                    (pendingAction.stepNumber === 4 && creatorRole === "大パ担当者" && eligibleDaipaTantoUsers.length > 0) ||
                    (pendingAction.stepNumber === 4 && creatorRole === "大パ管理職" && eligibleDaipaUsers.length > 0)
                  ) &&
                  selectedCodes.length === 0) ||
                  (pendingAction.type === "reject" && rejectComment.trim().length === 0) ||
                  (pendingAction.type === "reject" && pendingAction.stepNumber === 10 && eligibleDaipaUsers.length > 0 && selectedCodes.length === 0) ||
                  (pendingAction.type === "reject" && pendingAction.stepNumber === 9 && creatorRole === "大パ担当者" && eligibleDaipaTantoUsers.length > 0 && selectedCodes.length === 0) ||
                  (pendingAction.type === "reject" && pendingAction.stepNumber === 9 && creatorRole === "大パ管理職" && eligibleMenteUsers.length > 0 && selectedCodes.length === 0) ||
                  (pendingAction.type === "reject" && pendingAction.stepNumber === 8 && eligibleMenteUsers.length > 0 && selectedCodes.length === 0) ||
                  (pendingAction.type === "reject" && pendingAction.stepNumber === 7 && eligibleDaipaUsers.length > 0 && selectedCodes.length === 0) ||
                  (pendingAction.type === "reject" && pendingAction.stepNumber === 6 && creatorRole === "大パ担当者" && eligibleDaipaTantoUsers.length > 0 && selectedCodes.length === 0) ||
                  (pendingAction.type === "reject" && pendingAction.stepNumber === 6 && creatorRole === "大パ管理職" && designNeed !== "必要" && eligibleMenteUsers.length > 0 && selectedCodes.length === 0) ||
                  (pendingAction.type === "reject" && pendingAction.stepNumber === 5 && designNeed !== "必要" && eligibleMenteUsers.length > 0 && selectedCodes.length === 0) ||
                  (pendingAction.type === "reject" && pendingAction.stepNumber === 4 && eligibleMenteUsers.length > 0 && selectedCodes.length === 0) ||
                  (pendingAction.type === "reject" && pendingAction.stepNumber === 3 && eligibleDaipaUsers.length > 0 && selectedCodes.length === 0) ||
                  (pendingAction.type === "reject" && pendingAction.stepNumber === 2 && eligibleDaipaTantoUsers.length > 0 && selectedCodes.length === 0)
                }
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                  pendingAction.type === "confirm"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {pendingAction.type === "confirm" ? "確認する" : "差戻する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}