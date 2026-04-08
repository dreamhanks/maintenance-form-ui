import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppPageLayout from "../components/AppPageLayout";
import ListToolbar from "../components/ListToolbar";
import ShichuTable from "../components/ShichuTable";
import { fetchShichuRows } from "../api/shichuApi";
import { useUserOffices } from "../hooks/useUserOffices";
import { ShichuRow } from "../types";

const menuItems = [
  { label: "提案物件一覧へ", value: "/" },
  { label: "受注判定リストへ", value: "/juchu" },
  { label: "契約済みリストへ", value: "/keiyaku" },
];

export default function ShichuListPage() {
  const nav = useNavigate();
  const { officeOptions, defaultOffice, error: officeError } = useUserOffices();
  const [salesOffice, setSalesOffice] = useState("");
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState<ShichuRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(true);

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
      menuOpen={menuOpen}
      sideMenuItems={menuItems}
      onToggleMenu={() => setMenuOpen((prev) => !prev)}
      onNavigateMenu={(path) => nav(path, { replace: true })}
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