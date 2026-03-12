import { useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";
import JuchuPageHeader from "../components/JuchuPageHeader";
import JuchuHanteiTable from "../components/JuchuHanteiTable";
import ContractActionPanel from "../components/ContractActionPanel";
import { fetchJuchuRows } from "../api/juchuApi";
import { salesOfficeOptions, statusOptions } from "../data/dummyData";
import { JuchuRow } from "../types";

export default function JuchuHanteiListPage() {
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
        const data = await fetchJuchuRows({
          salesOffice,
          keyword,
          status,
        });
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

    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rows.map((row) => row.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleNavigate = (path: string) => {
    console.log("navigate:", path);
  };

  const handleClearFilters = () => {
    setKeyword("");
    setStatus("すべて");
  };

  const handleContractConfirm = (contractDate: string) => {
    console.log("契約確定", {
      selectedIds,
      contractDate,
    });

    alert(
      `契約確定\n対象件数: ${selectedIds.length}件\n契約日: ${contractDate}`
    );

    // ここでSpring Boot APIへ送信する想定
    // await fetch('/api/juchu/contract', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     ids: selectedIds,
    //     contractDate,
    //   }),
    // });

    setSelectedIds([]);
  };

  const handleLost = () => {
    if (selectedIds.length === 0) {
      alert("先に対象データを選択してください。");
      return;
    }

    console.log("失注", selectedIds);
    alert(`失注\n対象件数: ${selectedIds.length}件`);
    setSelectedIds([]);
  };

  const handleHold = () => {
    if (selectedIds.length === 0) {
      alert("先に対象データを選択してください。");
      return;
    }

    console.log("保留", selectedIds);
    alert(`保留\n対象件数: ${selectedIds.length}件`);
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-[1800px] px-4 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <JuchuPageHeader
            salesOffice={salesOffice}
            keyword={keyword}
            status={status}
            officeOptions={salesOfficeOptions}
            statusOptions={statusOptions}
            selectedCount={selectedIds.length}
            totalCount={rows.length}
            onSalesOfficeChange={setSalesOffice}
            onKeywordChange={setKeyword}
            onStatusChange={setStatus}
            onClearFilters={handleClearFilters}
          />

          <div className="flex gap-5 p-5">
            <SideMenu
              isOpen={menuOpen}
              onToggle={() => setMenuOpen((prev) => !prev)}
              onNavigate={handleNavigate}
            />

            <div className="grid min-w-0 flex-1 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <JuchuHanteiTable
                rows={rows}
                loading={loading}
                selectedIds={selectedIds}
                onToggleOne={toggleOne}
                onToggleAll={toggleAll}
              />

              <ContractActionPanel
                selectedCount={selectedIds.length}
                onContractConfirm={handleContractConfirm}
                onLost={handleLost}
                onHold={handleHold}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}