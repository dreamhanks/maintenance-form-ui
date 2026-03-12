import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppPageLayout from "../components/AppPageLayout";
import ListToolbar from "../components/ListToolbar";
import ShichuTable from "../components/ShichuTable";
import { fetchShichuRows } from "../api/shichuApi";
import { salesOfficeOptions } from "../data/dummyData";
import { ShichuRow } from "../types";

const menuItems = [
  { label: "提案物件一覧へ", value: "/" },
  { label: "受注判定リストへ", value: "/juchu" },
  { label: "契約済みリストへ", value: "/keiyaku" },
];

export default function ShichuListPage() {
  const nav = useNavigate();
  const [salesOffice, setSalesOffice] = useState("名古屋");
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState<ShichuRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchShichuRows({ salesOffice, keyword });
        setRows(data);
        setSelectedIds([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [salesOffice, keyword]);

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
          officeOptions={salesOfficeOptions}
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