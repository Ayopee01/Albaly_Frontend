"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiPieChart, FiLogOut } from "react-icons/fi";

type Props = { open?: boolean; onClose?: () => void };

export default function Sidebar({ open = false, onClose }: Props) {
  const pathname = usePathname();

  const itemBase = "relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors";
  const itemIdle = "text-slate-300 hover:bg-slate-700/40 hover:text-white";
  const itemActive = "bg-slate-700/60 text-white";

  const isOverview = pathname === "/" || pathname.startsWith("/overview");
  const isInsights = pathname.startsWith("/insights");

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5 text-lg font-semibold">
        Albaly Insights
      </div>

      {/* Nav */}
      <nav className="px-0">
        <ul className="space-y-1">
          {/* Overview */}
          <li>
            <Link
              href="/overview"
              aria-current={isOverview ? "page" : undefined}
              className={`${itemBase} ${isOverview ? itemActive : itemIdle}`}
              onClick={onClose}
            >
              {isOverview && (
                <span className="absolute left-0 top-0 h-full w-1 rounded-l bg-blue-500" />
              )}
              <FiHome className="h-4 w-4" />
              <span>Overview</span>
            </Link>
          </li>

          {/* Insights */}
          <li>
            <Link
              href="/insights"
              aria-current={isInsights ? "page" : undefined}
              className={`${itemBase} ${isInsights ? itemActive : itemIdle}`}
              onClick={onClose}
            >
              {isInsights && (
                <span className="absolute left-0 top-0 h-full w-1 rounded-l bg-blue-500" />
              )}
              <FiPieChart className="h-4 w-4" />
              <span>Insights</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout button*/}
      <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          className="cursor-pointer w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600 active:bg-blue-700"
          onClick={() => {
            console.log("logout");
            onClose?.();
          }}
        >
          <FiLogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop (>= lg)*/}
      <div className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:bg-slate-900 lg:text-white">
        <SidebarContent />
      </div>

      {/* Mobile*/}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={onClose}
        />

        {/* Drawer panel */}
        <div
          className={`absolute left-0 top-0 h-full bg-slate-900 text-white shadow-xl
                      overflow-y-auto w-64 
                      transform transition-transform duration-200 ease-out
                      ${open ? "translate-x-0" : "-translate-x-full"}`}
          role="dialog"
          aria-modal="true"
        >
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
