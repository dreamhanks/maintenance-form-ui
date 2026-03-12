import { SalesOfficeOption } from "../types";

type PageHeaderProps = {
  salesOffice: string;
  keyword: string;
  status: string;
  officeOptions: SalesOfficeOption[];
  statusOptions: string[];
  selectedCount: number;
  totalCount: number;
  onSalesOfficeChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  onUpdate: () => void;
  onCreate: () => void;
  onCopy: () => void;
};

export default function PageHeader({
  salesOffice,
  keyword,
  status,
  officeOptions,
  statusOptions,
  selectedCount,
  totalCount,
  onSalesOfficeChange,
  onKeywordChange,
  onStatusChange,
  onClearFilters,
  onUpdate,
  onCreate,
  onCopy,
}: PageHeaderProps) {
  return (
    <div className="border-b border-slate-200 px-6 py-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              提案物件一覧
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              提案物件の確認・更新・複製を行う画面
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <span>表示件数: {totalCount}件</span>
              <span>選択件数: {selectedCount}件</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onUpdate}
              className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              物件情報更新
            </button>

            <button
              onClick={onCreate}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              新規作成
            </button>

            <button
              onClick={onCopy}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              複製
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:grid-cols-[220px_minmax(260px,1fr)_220px_auto]">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">営業所名</label>
            <select
              value={salesOffice}
              onChange={(e) => onSalesOfficeChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              {officeOptions.map((office) => (
                <option key={office.value} value={office.value}>
                  {office.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              検索（物件CD / お施主様名 / 建物名称）
            </label>
            <input
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="例: 9101 / 山田 / 名古屋中央ビル"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">ステータス</label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={onClearFilters}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 xl:w-auto"
            >
              条件クリア
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}