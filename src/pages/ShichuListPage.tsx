import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppPageLayout from "../components/AppPageLayout";
import ListToolbar from "../components/ListToolbar";
import ShichuTable from "../components/ShichuTable";
import TopNavBar from "../components/layout/TopNavBar";
import { fetchShichuRows } from "../api/shichuApi";
import { useUserOffices } from "../hooks/useUserOffices";
import { useAuth } from "../auth/AuthContext";
import { ShichuRow } from "../types";

export default function ShichuListPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const canCreate =
    user?.role === "大パ担当者" ||
    user?.role === "大パ管理職" ||
    user?.role === "admin";
  const { officeOptions, defaultOffice, error: officeError } = useUserOffices();
  const [salesOffice, setSalesOffice] = useState("");
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState<ShichuRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
        const data = await fetchShichuRows({ salesOffice, keyword });
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
  }, [salesOffice, keyword]);

  const displayError = officeError || error;

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
      title="失注リスト"
      topNav={
        <TopNavBar
          activePage="lost"
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
          selectedCount={selectedIds.length}
          totalCount={rows.length}
          primaryActionLabel="受注判定へ復元"
          onSalesOfficeChange={setSalesOffice}
          onKeywordChange={setKeyword}
          onPrimaryAction={() => console.log("復元", selectedIds)}
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
      <ShichuTable
        rows={rows}
        loading={loading}
        selectedIds={selectedIds}
        onToggleOne={toggleOne}
        onToggleAll={toggleAll}
      />
    </AppPageLayout>
  );
}