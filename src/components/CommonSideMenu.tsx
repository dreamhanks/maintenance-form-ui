export type SideMenuItem = {
  label: string;
  value: string;
};

type CommonSideMenuProps = {
  isOpen: boolean;
  items: SideMenuItem[];
  onToggle: () => void;
  onNavigate: (path: string) => void;
};

export default function CommonSideMenu({
  isOpen,
  items,
  onToggle,
  onNavigate,
}: CommonSideMenuProps) {
  return (
    <aside
      className={`shrink-0 transition-all duration-300 ${
        isOpen ? "w-[220px]" : "w-[76px]"
      }`}
    >
      <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-3">
          {isOpen ? (
            <span className="text-sm font-bold text-slate-700">メニュー</span>
          ) : (
            <span className="mx-auto text-sm font-bold text-slate-700">≡</span>
          )}

          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {isOpen ? "閉じる" : "開く"}
          </button>
        </div>

        <div className="space-y-3 p-3">
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onNavigate(item.value)}
              title={item.label}
              className={`flex w-full items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm ${
                isOpen
                  ? "px-4 py-4 text-base font-bold"
                  : "px-2 py-4 text-lg font-bold"
              }`}
            >
              {isOpen ? item.label : "•"}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}