import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppPageLayout from "../components/AppPageLayout";
import ListToolbar from "../components/ListToolbar";
import ProposalTable from "../components/ProposalTable";
import TopNavBar from "../components/layout/TopNavBar";
import { fetchProposals } from "../api/proposalPropertyApi";
import { statusOptions } from "../data/dummyData";
import { useUserOffices } from "../hooks/useUserOffices";
import { useAuth } from "../auth/AuthContext";
import { ProposalRow } from "../types";

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

  return (
    <AppPageLayout
      title="提案物件一覧"
      topNav={
        <TopNavBar
          activePage="proposal"
          onLogout={handleLogout}
          canCreate={canCreate}
          onNewCreate={() => nav("/form", { replace: true })}
        />
      }
      headerContent={
        <ListToolbar
          salesOffice={salesOffice}
          officeOptions={officeOptions}
          keyword={keyword}
          status={status}
          statusOptions={statusOptions}
          selectedCount={0}
          totalCount={rows.length}
          onSalesOfficeChange={setSalesOffice}
          onKeywordChange={setKeyword}
          onStatusChange={setStatus}
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
        onRowClick={(id) => nav(`/form/${id}`)}
      />
    </AppPageLayout>
  );
}