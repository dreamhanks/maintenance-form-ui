import React from "react";
import CommonSideMenu, { SideMenuItem } from "./CommonSideMenu";

type AppPageLayoutProps = {
  title: string;
  menuOpen?: boolean;
  sideMenuItems?: SideMenuItem[];
  onToggleMenu?: () => void;
  onNavigateMenu?: (path: string) => void;
  headerContent: React.ReactNode;
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  maxWidthClassName?: string;
  topNav?: React.ReactNode;
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
  topNav,
}: AppPageLayoutProps) {
  const showSideMenu =
    !topNav &&
    sideMenuItems !== undefined &&
    onToggleMenu !== undefined &&
    onNavigateMenu !== undefined;

  return (
    <div className="min-h-screen bg-slate-100">
      {topNav}
      <div className={`mx-auto ${maxWidthClassName} px-4 py-6`}>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              {title}
            </h1>
            <div className="mt-4">{headerContent}</div>
          </div>

          <div className="flex gap-5 p-5">
            {showSideMenu && (
              <CommonSideMenu
                isOpen={menuOpen ?? false}
                items={sideMenuItems!}
                onToggle={onToggleMenu!}
                onNavigate={onNavigateMenu!}
              />
            )}

            {rightPanel ? (
              <div className="flex min-w-0 flex-1 flex-col gap-5 lg:flex-row">
                <div className="order-last min-w-0 flex-1 lg:order-first">{children}</div>
                <div className="order-first w-full lg:order-last lg:w-[360px] lg:flex-shrink-0">{rightPanel}</div>
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
