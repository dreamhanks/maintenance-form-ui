import { SalesOfficeOption } from "../types";

type KeiyakuPageHeaderProps = {
  salesOffice: string;
  keyword: string;
  officeOptions: SalesOfficeOption[];
  selectedCount: number;
  totalCount: number;
  onSalesOfficeChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  onClearFilters: () => void;
};

export default function KeiyakuPageHeader({
  salesOffice,
  keyword,
  officeOptions,
  selectedCount,
  totalCount,
  onSalesOfficeChange,
  onKeywordChange,
  onClearFilters,
}: KeiyakuPageHeaderProps) {
  return (
    <div className="border-b border-slate-200 px-6 py-5">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            契約済みリスト
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span>表示件数: {totalCount}件</span>
            <span>選択件数: {selectedCount}件</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:grid-cols-[220px_minmax(280px,1fr)_auto]">
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