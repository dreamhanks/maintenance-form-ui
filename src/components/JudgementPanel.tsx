
type JudgementPanelProps = {
  selectedCount: number;
  onContract: () => void;
  onLost: () => void;
  onHold: () => void;
};

export default function JudgementPanel({
  selectedCount,
  onContract,
  onLost,
  onHold,
}: JudgementPanelProps) {
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
          onClick={onContract}
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
        >
          契約
        </button>
        <button
          onClick={onLost}
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
        >
          失注
        </button>
        <button
          onClick={onHold}
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
        >
          保留
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-xs leading-6 text-slate-600">
        選択を押して判定ボタンを押すと、対象物件のステータスを更新します。
        <br />
        契約を押した場合は、別途日付選択欄を表示する想定にできます。
      </div>
    </div>
  );
}