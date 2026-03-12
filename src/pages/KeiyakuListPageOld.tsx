import { useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";
import KeiyakuPageHeader from "../components/KeiyakuPageHeader";
import KeiyakuTable from "../components/KeiyakuTable";
import { fetchKeiyakuRows } from "../api/keiyakuApi";
import { salesOfficeOptions } from "../data/dummyData";
import { KeiyakuRow } from "../types";

export default function KeiyakuListPage() {
  const [salesOffice, setSalesOffice] = useState("名古屋");
  const [keyword, setKeyword] = useState("");

  const [rows, setRows] = useState<KeiyakuRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchKeiyakuRows({
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

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-[1700px] px-4 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <KeiyakuPageHeader
            salesOffice={salesOffice}
            keyword={keyword}
            officeOptions={salesOfficeOptions}
            selectedCount={selectedIds.length}
            totalCount={rows.length}
            onSalesOfficeChange={setSalesOffice}
            onKeywordChange={setKeyword}
            onClearFilters={handleClearFilters}
          />

          <div className="flex gap-5 p-5">
            <SideMenu
              isOpen={menuOpen}
              onToggle={() => setMenuOpen((prev) => !prev)}
              onNavigate={handleNavigate}
            />

            <div className="min-w-0 flex-1">
              <KeiyakuTable
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