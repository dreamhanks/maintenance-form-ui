import { useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";
import ShichuPageHeader from "../components/ShichuPageHeader";
import ShichuTable from "../components/ShichuTable";
import { fetchShichuRows } from "../api/shichuApi";
import { salesOfficeOptions } from "../data/dummyData";
import { ShichuRow } from "../types";

export default function ShichuListPage() {
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
        const data = await fetchShichuRows({
          salesOffice,
          keyword,
        });
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
  };

  const handleRestore = () => {
    if (selectedIds.length === 0) {
      alert("先に対象データを選択してください。");
      return;
    }

    console.log("受注判定へ復元", selectedIds);
    alert(`受注判定へ復元\n対象件数: ${selectedIds.length}件`);

    // Spring Boot API example
    // await fetch("/api/shichu/restore", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ ids: selectedIds }),
    // });

    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-[1700px] px-4 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ShichuPageHeader
            salesOffice={salesOffice}
            keyword={keyword}
            officeOptions={salesOfficeOptions}
            selectedCount={selectedIds.length}
            totalCount={rows.length}
            onSalesOfficeChange={setSalesOffice}
            onKeywordChange={setKeyword}
            onClearFilters={handleClearFilters}
            onRestore={handleRestore}
          />

          <div className="flex gap-5 p-5">
            <SideMenu
              isOpen={menuOpen}
              onToggle={() => setMenuOpen((prev) => !prev)}
              onNavigate={handleNavigate}
            />

            <div className="min-w-0 flex-1">
              <ShichuTable
                rows={rows}
                loading={loading}
                selectedIds={selectedIds}
                onToggleOne={toggleOne}
                onToggleAll={toggleAll}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}