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
  onStepsChange: (steps: WorkflowStepDto[]) => void;
};

function StepBox({
  step,
  userRole,
  formId,
  prevConfirmed,
  onStepsChange,
}: {
  step: WorkflowStepDto;
  userRole: string | null | undefined;
  formId: number | null;
  prevConfirmed: boolean;
  onStepsChange: (steps: WorkflowStepDto[]) => void;
}) {
  const requiredRole = STEP_ROLES[step.stepNumber];
  const roleMatch = userRole === requiredRole || userRole === "admin";
  const isConfirmed = step.status === "confirmed";

  const canConfirm = !!formId && roleMatch && prevConfirmed && !isConfirmed && step.status !== "waiting";
  const canReject = !!formId && roleMatch && isConfirmed;

  const handleConfirm = async () => {
    if (!formId || !canConfirm) return;
    try {
      const updated = await workflowApi.confirm(formId, step.stepNumber);
      onStepsChange(updated);
      toast.success(`${step.stepLabel} を確認しました`);
    } catch (err: any) {
      toast.error(err?.message || "確認に失敗しました");
    }
  };

  const handleReject = async () => {
    if (!formId || !canReject) return;
    try {
      const updated = await workflowApi.reject(formId, step.stepNumber);
      onStepsChange(updated);
      toast.success(`${step.stepLabel} を差戻しました`);
    } catch (err: any) {
      toast.error(err?.message || "差戻に失敗しました");
    }
  };

  return (
    <div className="rounded-xl border-2 border-slate-800">
      <div className="border-b-2 border-slate-800 bg-slate-50 px-3 py-2 text-center font-semibold text-sm">
        {step.stepLabel}
      </div>
      <div className="flex h-14 items-center justify-center px-2 text-center text-sm font-medium text-slate-800">
        {isConfirmed ? step.actorName : ""}
      </div>
      <div className="grid grid-cols-2 border-t-2 border-slate-800">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={`border-r-2 border-slate-800 px-2 py-2 text-center text-sm font-semibold transition-colors ${
            canConfirm
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          確認
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={!canReject}
          className={`px-2 py-2 text-center text-sm font-semibold transition-colors ${
            canReject
              ? "bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          差戻
        </button>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center">
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

export default function ApprovalFlowSection({ formId, steps, userRole, onStepsChange }: Props) {
  const effectiveSteps = steps.length > 0 ? steps : DEFAULT_STEPS;

  const getStep = (n: number) => effectiveSteps.find((s) => s.stepNumber === n);
  const isPrevConfirmed = (n: number) => {
    if (n === 1) return true;
    const prev = getStep(n - 1);
    return prev?.status === "confirmed";
  };

  const renderBox = (n: number) => {
    const step = getStep(n);
    if (!step) return null;
    return (
      <StepBox
        step={step}
        userRole={userRole}
        formId={formId}
        prevConfirmed={isPrevConfirmed(n)}
        onStepsChange={onStepsChange}
      />
    );
  };

  return (
    <section className={sectionWrap}>
      <div className="p-4">
        <h3 className="mb-3 text-lg font-bold text-slate-800">承認フロー</h3>
        <div className="grid [grid-template-columns:repeat(24,minmax(0,1fr))] gap-3">
          {/* Row: steps 1-4, arrow, steps 5-7, arrow, steps 8-10 */}
          <div />
          <div className="col-span-2">{renderBox(1)}</div>
          <div className="col-span-2">{renderBox(2)}</div>
          <div className="col-span-2">{renderBox(3)}</div>
          <Arrow />
          <div className="col-span-2">{renderBox(4)}</div>
          <Arrow />
          <div className="col-span-2">{renderBox(5)}</div>
          <div className="col-span-2">{renderBox(6)}</div>
          <div className="col-span-2">{renderBox(7)}</div>
          <Arrow />
          <div className="col-span-2">{renderBox(8)}</div>
          <div className="col-span-2">{renderBox(9)}</div>
          <div className="col-span-2">{renderBox(10)}</div>
        </div>
      </div>
    </section>
  );
}
