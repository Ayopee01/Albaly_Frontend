"use client";

import { FiStar, FiUser, FiMenu } from "react-icons/fi";

type Props = {
  onMenuClick?: () => void;
  appName?: string;
};

export default function Navbar({
  onMenuClick,
  appName = "Albaly Insights",
}: Props) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Hamburger*/}
            <button
              type="button"
              aria-label="Open menu"
              onClick={onMenuClick}
              className="cursor-pointer lg:hidden inline-flex items-center justify-center rounded-md border border-slate-200 w-9 h-9 text-slate-700 hover:bg-slate-50 active:bg-slate-100"
            >
              <FiMenu className="h-5 w-5" />
            </button>

            <h1 className="text-[15px] font-semibold text-slate-800">{appName}</h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100"
            >
              <FiStar className="h-4 w-4" />
              Star
            </button>

            {/* Avatar Icon */}
            <div className="cursor-pointer h-11 w-11 grid place-items-center rounded-full bg-blue-500 text-white">
              <FiUser className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
