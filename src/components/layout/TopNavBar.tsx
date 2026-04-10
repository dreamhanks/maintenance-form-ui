import { useNavigate } from "react-router-dom";

type ActivePage = "proposal" | "order" | "lost" | "contract";

type TopNavBarProps = {
  activePage: ActivePage;
  onLogout: () => void;
  canCreate: boolean;
  onNewCreate: () => void;
};

type Tab = {
  key: ActivePage;
  label: string;
  path: string;
};

const TABS: Tab[] = [
  { key: "proposal", label: "提案物件一覧", path: "/" },
  { key: "order", label: "受注判定", path: "/juchu" },
  { key: "lost", label: "失注", path: "/shichu" },
  { key: "contract", label: "契約済み", path: "/keiyaku" },
];

export default function TopNavBar({
  activePage,
  onLogout,
  canCreate,
  onNewCreate,
}: TopNavBarProps) {
  const nav = useNavigate();

  return (
    <div
      className="flex w-full items-center justify-between"
      style={{
        height: 52,
        backgroundColor: "#1e2d40",
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <div className="flex h-full flex-row">
        {TABS.map((tab) => {
          const isActive = tab.key === activePage;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => nav(tab.path)}
              className="group flex h-full items-center transition-colors"
              style={{
                fontSize: 13,
                padding: "0 18px",
                borderBottom: isActive
                  ? "3px solid #4A9EE8"
                  : "3px solid transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                fontWeight: isActive ? 500 : 400,
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-row gap-2">
        <button
          type="button"
          onClick={onLogout}
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.7)",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 6,
            padding: "6px 14px",
          }}
        >
          ログアウト
        </button>
        <button
          type="button"
          onClick={onNewCreate}
          disabled={!canCreate}
          className={!canCreate ? "opacity-50" : ""}
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#fff",
            background: "#2a9d5c",
            border: "none",
            borderRadius: 6,
            padding: "6px 16px",
            cursor: canCreate ? "pointer" : "not-allowed",
          }}
        >
          ＋ 新規作成
        </button>
      </div>
    </div>
  );
}
