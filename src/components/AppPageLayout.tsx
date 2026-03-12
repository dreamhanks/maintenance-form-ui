import React from "react";
import CommonSideMenu, { SideMenuItem } from "./CommonSideMenu";

type AppPageLayoutProps = {
  title: string;
  menuOpen: boolean;
  sideMenuItems: SideMenuItem[];
  onToggleMenu: () => void;
  onNavigateMenu: (path: string) => void;
  headerContent: React.ReactNode;
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  maxWidthClassName?: string;
};

export default function AppPageLayout({
  title,
  menuOpen,
  sideMenuItems,
  onToggleMenu,
  onNavigateMenu,
  headerContent,
  children,
  rightPanel,
  maxWidthClassName = "max-w-[1900px]",
}: AppPageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className={`mx-auto ${maxWidthClassName} px-4 py-6`}>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              {title}
            </h1>
            <div className="mt-4">{headerContent}</div>
          </div>

          <div className="flex gap-5 p-5">
            <CommonSideMenu
              isOpen={menuOpen}
              items={sideMenuItems}
              onToggle={onToggleMenu}
              onNavigate={onNavigateMenu}
            />

            {rightPanel ? (
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="min-w-0">{children}</div>
                <div>{rightPanel}</div>
              </div>
            ) : (
              <div className="min-w-0 flex-1">{children}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}