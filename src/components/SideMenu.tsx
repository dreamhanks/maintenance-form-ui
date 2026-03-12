type SideMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (path: string) => void;
};

const menuItems = [
  { label: "受注判定リストへ", value: "juchu" },
  { label: "失注リストへ", value: "shichu" },
  { label: "契約済みリストへ", value: "keiyaku" },
];

export default function SideMenu({
  isOpen,
  onToggle,
  onNavigate,
}: SideMenuProps) {
  return (
    <aside
      className={`transition-all duration-300 ${
        isOpen ? "w-[220px]" : "w-[68px]"
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
            onClick={onToggle}
            className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            {isOpen ? "閉じる" : "開く"}
          </button>
        </div>

        <div className="space-y-3 p-3">
          {menuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onNavigate(item.value)}
              className={`group flex w-full items-center rounded-xl border border-slate-300 bg-slate-50 text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm ${
                isOpen
                  ? "justify-center px-4 py-4 text-base font-bold"
                  : "justify-center px-2 py-4 text-lg font-bold"
              }`}
              title={item.label}
            >
              {isOpen ? item.label : "•"}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}