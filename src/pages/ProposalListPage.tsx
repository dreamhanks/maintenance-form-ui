import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppPageLayout from "../components/AppPageLayout";
import ListToolbar from "../components/ListToolbar";
import ProposalTable from "../components/ProposalTable";
import { fetchProposals } from "../api/proposalPropertyApi";
import { statusOptions } from "../data/dummyData";
import { useUserOffices } from "../hooks/useUserOffices";
import { useAuth } from "../auth/AuthContext";
import { ProposalRow } from "../types";

const menuItems = [
  { label: "受注判定リストへ", value: "/juchu" },
  { label: "失注リストへ", value: "/shichu" },
  { label: "契約済みリストへ", value: "/keiyaku" },
];

export default function ProposalListPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const canCreate =
    user?.role === "大パ担当者" ||
    user?.role === "大パ管理職" ||
    user?.role === "admin";
  const { officeOptions, defaultOffice, error: officeError } = useUserOffices();
  const [salesOffice, setSalesOffice] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("すべて");
  const [rows, setRows] = useState<ProposalRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(true);

  // Set default office once loaded
  useEffect(() => {
    if (defaultOffice && !salesOffice) setSalesOffice(defaultOffice);
  }, [defaultOffice, salesOffice]);

  useEffect(() => {
    if (!salesOffice) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProposals({ salesOffice, keyword, status });
        setRows(data);
        setSelectedIds([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "データの取得に失敗しました");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [salesOffice, keyword, status]);

  const displayError = officeError || error;

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("logout failed");
      nav("/login", { replace: true });
    } catch {
      toast.error("ログアウトに失敗しました");
    }
  };

  const toggleAll = () => {
    const allSelected =
      rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));
    setSelectedIds(allSelected ? [] : rows.map((row) => row.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <AppPageLayout
      title="提案物件一覧"
      menuOpen={menuOpen}
      sideMenuItems={menuItems}
      onToggleMenu={() => setMenuOpen((prev) => !prev)}
      onNavigateMenu={(path) => nav(path, { replace: true })}
      headerContent={
        <ListToolbar
          salesOffice={salesOffice}
          officeOptions={officeOptions}
          keyword={keyword}
          status={status}
          statusOptions={statusOptions}
          selectedCount={selectedIds.length}
          totalCount={rows.length}
          leadingAction={
            <button
              type="button"
              onClick={handleLogout}
              className="bg-white border border-gray-300 text-sm text-gray-600 px-4 py-2 rounded hover:bg-gray-50"
            >
              ログアウト
            </button>
          }
          secondaryActionLabel="新規作成"
          secondaryActionDisabled={!canCreate}
          onSalesOfficeChange={setSalesOffice}
          onKeywordChange={setKeyword}
          onStatusChange={setStatus}
          onSecondaryAction={() => nav("/form", { replace: true })}
          onClearFilters={() => {
            setKeyword("");
            setStatus("すべて");
          }}
        />
      }
    >
      {displayError && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {displayError}
        </div>
      )}
      <ProposalTable
        rows={rows}
        loading={loading}
        selectedIds={selectedIds}
        onToggleOne={toggleOne}
        onToggleAll={toggleAll}
        onRowClick={(id) => nav(`/form/${id}`)}
      />
    </AppPageLayout>
  );
}