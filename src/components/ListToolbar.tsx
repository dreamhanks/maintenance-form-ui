import { SalesOfficeOption } from "../types";

type ListToolbarProps = {
  salesOffice: string;
  officeOptions: SalesOfficeOption[];
  keyword?: string;
  keywordPlaceholder?: string;
  status?: string;
  statusOptions?: string[];
  selectedCount?: number;
  totalCount?: number;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  tertiaryActionLabel?: string;
  onSalesOfficeChange: (value: string) => void;
  onKeywordChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  onClearFilters?: () => void;
};

export default function ListToolbar({
  salesOffice,
  officeOptions,
  keyword = "",
  keywordPlaceholder = "検索",
  status,
  statusOptions,
  selectedCount,
  totalCount,
  primaryActionLabel,
  secondaryActionLabel,
  tertiaryActionLabel,
  onSalesOfficeChange,
  onKeywordChange,
  onStatusChange,
  onPrimaryAction,
  onSecondaryAction,
  onTertiaryAction,
  onClearFilters,
}: ListToolbarProps) {
  const hasStatus = !!statusOptions && !!onStatusChange;
  const hasKeyword = !!onKeywordChange;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            {typeof totalCount === "number" && <span>表示件数: {totalCount}件</span>}
            {typeof selectedCount === "number" && <span>選択件数: {selectedCount}件</span>}
          </div>
        </div>

        {(primaryActionLabel || secondaryActionLabel || tertiaryActionLabel) && (
          <div className="flex flex-wrap items-center gap-2">
            {primaryActionLabel && onPrimaryAction && (
              <button
                type="button"
                onClick={onPrimaryAction}
                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                {primaryActionLabel}
              </button>
            )}

            {secondaryActionLabel && onSecondaryAction && (
              <button
                type="button"
                onClick={onSecondaryAction}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {secondaryActionLabel}
              </button>
            )}

            {tertiaryActionLabel && onTertiaryAction && (
              <button
                type="button"
                onClick={onTertiaryAction}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {tertiaryActionLabel}
              </button>
            )}
          </div>
        )}
      </div>

      <div
        className={`grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 ${
          hasStatus
            ? "xl:grid-cols-[220px_minmax(260px,1fr)_220px_auto]"
            : "xl:grid-cols-[220px_minmax(260px,1fr)_auto]"
        }`}
      >
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

        {hasKeyword && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              検索（物件CD / お施主様名 / 建物名称）
            </label>
            <input
              value={keyword}
              onChange={(e) => onKeywordChange?.(e.target.value)}
              placeholder={keywordPlaceholder}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500"
            />
          </div>
        )}

        {hasStatus && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">ステータス</label>
            <select
              value={status}
              onChange={(e) => onStatusChange?.(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              {statusOptions?.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}

        {onClearFilters && (
          <div className="flex items-end">
            <button
              type="button"
              onClick={onClearFilters}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 xl:w-auto"
            >
              条件クリア
            </button>
          </div>
        )}
      </div>
    </div>
  );
}