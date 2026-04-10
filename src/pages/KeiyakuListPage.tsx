import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppPageLayout from "../components/AppPageLayout";
import ListToolbar from "../components/ListToolbar";
import KeiyakuTable from "../components/KeiyakuTable";
import TopNavBar from "../components/layout/TopNavBar";
import { fetchKeiyakuRows } from "../api/keiyakuApi";
import { useUserOffices } from "../hooks/useUserOffices";
import { useAuth } from "../auth/AuthContext";
import { KeiyakuRow } from "../types";

export default function KeiyakuListPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const canCreate =
    user?.role === "大パ担当者" ||
    user?.role === "大パ管理職" ||
    user?.role === "admin";
  const { officeOptions, defaultOffice, error: officeError } = useUserOffices();
  const [salesOffice, setSalesOffice] = useState("");
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState<KeiyakuRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (defaultOffice && !salesOffice) setSalesOffice(defaultOffice);
  }, [defaultOffice, salesOffice]);

  useEffect(() => {
    if (!salesOffice) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchKeiyakuRows({ salesOffice, keyword });
        setRows(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "データの取得に失敗しました");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [salesOffice, keyword]);

  const displayError = officeError || error;

  return (
    <AppPageLayout
      title="契約済みリスト"
      topNav={
        <TopNavBar
          activePage="contract"
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
          selectedCount={0}
          totalCount={rows.length}
          onSalesOfficeChange={setSalesOffice}
          onKeywordChange={setKeyword}
          onClearFilters={() => setKeyword("")}
        />
      }
      maxWidthClassName="max-w-[1700px]"
    >
      {displayError && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {displayError}
        </div>
      )}
      <KeiyakuTable rows={rows} loading={loading} />
    </AppPageLayout>
  );
}