import { useState } from "react";
import { toast } from "react-toastify";
import { sectionWrap } from "./EizenFormStyles";
import type { WorkflowStepDto } from "../../form/api";
import { workflowApi } from "../../form/api";

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
  onStepsChange: (steps: WorkflowStepDto[]) => void;
  isFormDirty?: () => boolean;
  onSaveForm?: () => Promise<number | null>;
  validateConfirm?: (stepNumber: number) => string | null;
};

function StepBox({
  step,
  userRole,
  formId,
  prevConfirmed,
  onRequestConfirm,
  onRequestReject,
}: {
  step: WorkflowStepDto;
  userRole: string | null | undefined;
  formId: number | null;
  prevConfirmed: boolean;
  onRequestConfirm: (stepNumber: number) => void;
  onRequestReject: (stepNumber: number) => void;
}) {
  const requiredRole = STEP_ROLES[step.stepNumber];
  const roleMatch = userRole === requiredRole || userRole === "admin";
  const isConfirmed = step.status === "confirmed";

  const canConfirm = !!formId && roleMatch && prevConfirmed && !isConfirmed && step.status !== "waiting";
  const canReject = !!formId && roleMatch && step.status === "pending" && step.stepNumber !== 1;

  return (
    <div className="w-32 rounded-xl border-2 border-slate-800">
      <div className="border-b-2 border-slate-800 bg-slate-50 px-3 py-2 text-center font-semibold text-sm">
        {step.stepLabel.replace(/[①②③④⑤⑥⑦⑧⑨⑩]/g, "")}
      </div>
      <div className="flex h-14 items-center justify-center px-2 text-center text-sm font-medium text-slate-800">
        {isConfirmed ? step.actorName : ""}
      </div>
      <div className={`${step.stepNumber === 1 ? "" : "grid grid-cols-2"} border-t-2 border-slate-800`}>
        {step.stepNumber !== 1 && (
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
          disabled={!canConfirm}
          className={`${step.stepNumber === 1 ? "w-full" : ""} px-2 py-2 text-center text-sm font-semibold transition-colors ${
            canConfirm
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          確認
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

export default function ApprovalFlowSection({ formId, steps, userRole, creatorRole, onStepsChange, isFormDirty, onSaveForm, validateConfirm }: Props) {
  const effectiveSteps = steps.length > 0 ? steps : DEFAULT_STEPS;
  // Dirty-check dialog state (existing: "保存して確認")
  const [pendingConfirmStep, setPendingConfirmStep] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  // Action confirmation dialog state (new)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const getLabel = (stepNumber: number) =>
    effectiveSteps.find((s) => s.stepNumber === stepNumber)?.stepLabel ?? "";

  const runConfirm = async (stepNumber: number) => {
    if (!formId) return;
    try {
      const updated = await workflowApi.confirm(formId, stepNumber);
      onStepsChange(updated);
      toast.success(`${getLabel(stepNumber)} を確認しました`);
    } catch (err: any) {
      toast.error(err?.message || "確認に失敗しました");
    }
  };

  const runReject = async (stepNumber: number) => {
    if (!formId) return;
    try {
      const updated = await workflowApi.reject(formId, stepNumber);
      onStepsChange(updated);
      toast.success(`${getLabel(stepNumber)} を差戻しました`);
    } catch (err: any) {
      toast.error(err?.message || "差戻に失敗しました");
    }
  };

  // Show the action-confirmation dialog for confirm or reject
  const showActionDialog = (type: "confirm" | "reject", stepNumber: number) => {
    setPendingAction({ type, stepNumber, stepLabel: getLabel(stepNumber) });
  };

  // 確認 button clicked: validate, dirty check, then action dialog
  const handleRequestConfirm = (stepNumber: number) => {
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
    showActionDialog("confirm", stepNumber);
  };

  // 差戻 button clicked: show action dialog directly (no dirty check)
  const handleRequestReject = (stepNumber: number) => {
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
      showActionDialog("confirm", stepNumber);
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
  const skipDaipaTanto = creatorRole === "大パ管理職";
  const isHidden = (n: number) => skipDaipaTanto && (n === 1 || n === 5 || n === 8);

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
        userRole={userRole}
        formId={formId}
        prevConfirmed={isPrevConfirmed(n)}
        onRequestConfirm={handleRequestConfirm}
        onRequestReject={handleRequestReject}
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
          <Arrow />
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
                ? `${pendingAction.stepLabel} を確認しますか？`
                : (
                  <>
                    {pendingAction.stepLabel} を差戻しますか？
                    <br />
                    前のステップに戻ります。
                  </>
                )}
            </div>
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
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
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