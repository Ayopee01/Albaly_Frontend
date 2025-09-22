"use client";

import "./globals.css";
import { useState } from "react";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <html lang="en" className="h-full">
      <body className="min-h-[100dvh] bg-gray-50 text-gray-900">
        {/* dark:bg-neutral-950 dark:text-neutral-100 */}
        <div className="flex min-h-[100dvh] overflow-hidden">
          <Sidebar open={open} onClose={() => setOpen(false)} />
          <div className="flex-1 flex flex-col">
            <Navbar onMenuClick={() => setOpen(true)} />
            <main className="flex-1">
              <div className="max-w-8xl mx-auto p-4 md:p-6">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
