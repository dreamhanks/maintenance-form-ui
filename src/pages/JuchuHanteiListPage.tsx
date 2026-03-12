import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppPageLayout from "../components/AppPageLayout";
import ListToolbar from "../components/ListToolbar";
import JuchuHanteiTable from "../components/JuchuHanteiTable";
import ContractActionPanel from "../components/ContractActionPanel";
import { fetchJuchuRows } from "../api/juchuApi";
import { salesOfficeOptions, statusJuchuOptions } from "../data/dummyData";
import { JuchuRow } from "../types";

const menuItems = [
  { label: "提案物件一覧へ", value: "/" },
  { label: "失注リストへ", value: "/shichu" },
  { label: "契約済みリストへ", value: "/keiyaku" },
];

export default function JuchuHanteiListPage() {
  const nav = useNavigate();
  const [salesOffice, setSalesOffice] = useState("名古屋");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("すべて");
  const [rows, setRows] = useState<JuchuRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchJuchuRows({ salesOffice, keyword, status });
        setRows(data);
        setSelectedIds([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [salesOffice, keyword, status]);

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
      title="受注判定リスト"
      menuOpen={menuOpen}
      sideMenuItems={menuItems}
      onToggleMenu={() => setMenuOpen((prev) => !prev)}
      onNavigateMenu={(path) => nav(path, { replace: true })}
      headerContent={
        <ListToolbar
          salesOffice={salesOffice}
          officeOptions={salesOfficeOptions}
          keyword={keyword}
          status={status}
          statusOptions={statusJuchuOptions}
          selectedCount={selectedIds.length}
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
      rightPanel={
        <ContractActionPanel
          selectedCount={selectedIds.length}
          onContractConfirm={(contractDate) =>
            console.log("契約確定", selectedIds, contractDate)
          }
          onLost={() => console.log("失注", selectedIds)}
          onHold={() => console.log("保留", selectedIds)}
        />
      }
    >
      <JuchuHanteiTable
        rows={rows}
        loading={loading}
        selectedIds={selectedIds}
        onToggleOne={toggleOne}
        onToggleAll={toggleAll}
      />
    </AppPageLayout>
  );
}