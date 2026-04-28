import { useState } from "react";
import { toast } from "react-toastify";
import JaDatePicker from "./JaDatePicker";

type ContractActionPanelProps = {
  selectedCount: number;
  onContractConfirm: (contractDate: string) => void;
  onLost: () => void;
  onHold: () => void;
};

export default function ContractActionPanel({
  selectedCount,
  onContractConfirm,
  onLost,
  onHold,
}: ContractActionPanelProps) {
  const [showContractDateArea, setShowContractDateArea] = useState(false);
  const [contractDate, setContractDate] = useState("");

  const handleClickContract = () => {
    if (selectedCount === 0) {
      toast.warning("先に対象データを選択してください。");
      return;
    }
    setShowContractDateArea(true);
  };

  const handleCancelContract = () => {
    setShowContractDateArea(false);
    setContractDate("");
  };

  const handleConfirmContract = () => {
    if (!contractDate) {
      toast.warning("契約日を入力してください。");
      return;
    }
    onContractConfirm(contractDate);
    setShowContractDateArea(false);
    setContractDate("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-700">判定欄</h2>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          選択: {selectedCount}件
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleClickContract}
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={selectedCount === 0}
        >
          契約
        </button>

        <button
          onClick={onLost}
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={selectedCount === 0}
        >
          失注
        </button>

        <button
          onClick={onHold}
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={selectedCount === 0}
        >
          保留
        </button>
      </div>

      {showContractDateArea && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="mb-2 text-sm font-semibold text-emerald-800">
            契約日入力
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                契約日
              </label>
              <JaDatePicker
                value={contractDate}
                onChange={setContractDate}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleConfirmContract}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                契約確定
              </button>

              <button
                onClick={handleCancelContract}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-xs leading-6 text-slate-600">
        選択を押して「契約」ボタンを押すと契約日入力欄が表示されます。
        <br />
        契約日入力後、「契約確定」で更新処理を実行できます。
      </div>
    </div>
  );
}