import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchProposals } from "../api/proposalPropertyApi";
import PageHeader from "../components/PageHeader";
import ProposalTable from "../components/ProposalTable";
import SideMenu from "../components/SideMenu";
import { salesOfficeOptions, statusOptions } from "../data/dummyData";
import { ProposalRow } from "../types";

export default function ProposalPropertyListPage() {
  const nav = useNavigate();

  const [salesOffice, setSalesOffice] = useState("名古屋");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("すべて");

  const [rows, setRows] = useState<ProposalRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchProposals({
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

  const handleUpdate = () => {
    console.log("物件情報更新", selectedIds);
  };

  const handleCreate = () => {
    console.log("新規作成");
  };

  const handleCopy = () => {
    console.log("複製", selectedIds);
  };

  const handleNavigate = (path: string) => {
    console.log("navigate:", path);

    if(path === 'juchu') {
      nav("/juchu", { replace: true });
    } else if(path === 'shichu') {
      nav("/shichu", { replace: true });
    } else if(path === 'keiyaku') {
      nav("/keiyaku", { replace: true });
    }
  };

  const handleClearFilters = () => {
    setKeyword("");
    setStatus("すべて");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-[1900px] px-4 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <PageHeader
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
            onUpdate={handleUpdate}
            onCreate={handleCreate}
            onCopy={handleCopy}
          />

          <div className="flex gap-5 p-5">
            <SideMenu
              isOpen={menuOpen}
              onToggle={() => setMenuOpen((prev) => !prev)}
              onNavigate={handleNavigate}
            />

            <div className="min-w-0 flex-1">
              <ProposalTable
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