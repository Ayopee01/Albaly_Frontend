"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  UsersIcon,
  ArchiveBoxIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Loading from "@/component/Loading";
import type { OverviewResponse, ActivityItem as Activity } from "@/lib/types";

export default function OverviewPage() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    fetch("/api/overview")
      .then((res) => res.json() as Promise<OverviewResponse>)
      .then(setData)
      .catch((e) => console.error("overview fetch error:", e));
  }, []);

  if (!data) {
    return <Loading heightClass="h-40" barCount={4} barColorClass="bg-indigo-500" />;
  }

  const pageTitle = data.pageTitle ?? "Overview";
  const pageSubtitle = data.subtitle ?? "";

  const kpis = data.kpis ?? [];
  const iconMap: Record<string, ReactNode> = {
    money: <BanknotesIcon className="h-5 w-5 text-gray-400" />,
    users: <UsersIcon className="h-5 w-5 text-gray-400" />,
    box: <ArchiveBoxIcon className="h-5 w-5 text-gray-400" />,
  };

  const Delta = ({ pct, textGood, textBad }: { pct: number; textGood?: string; textBad?: string }) => (
    <span className="inline-flex items-center gap-1 text-sm">
      {pct >= 0 ? (
        <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-500" />
      ) : (
        <ArrowTrendingDownIcon className="h-4 w-4 text-amber-600" />
      )}
      <span className={pct >= 0 ? "text-emerald-600" : "text-amber-600"}>
        {pct >= 0 ? "+" : ""}
        {Math.abs(pct)}%
      </span>
      {data.kpiDeltaNote && (
        <span className="text-gray-500 dark:text-gray-400">
          {pct >= 0 ? (textGood ?? data.kpiDeltaNote.good) : (textBad ?? data.kpiDeltaNote.bad)}
        </span>
      )}
    </span>
  );

  const activities = data.activity ?? [];
  const currency = data.display?.currencySymbol ?? "$";
  const monthly = data.monthly;
  const barGradient = monthly?.style?.barGradient ?? {
    lightFrom: "#6366F1",
    lightTo: "#818CF8",
    darkFrom: "#8B5CF6",
    darkTo: "#6366F1",
  };
  const barRadius = monthly?.style?.barRadius ?? [8, 8, 0, 0];
  const barSize = monthly?.style?.barSize ?? 28;
  const tooltipLabel = monthly?.labels?.tooltipLabel ?? "Revenue";
  const totalLabel = monthly?.labels?.totalLabel ?? "Total Revenue";
  const deltaNote = monthly?.labels?.deltaNote ?? "vs last period";

  // ช่วยเลือกสีตามโหมด
  const cFrom = isDark ? (barGradient.darkFrom ?? "#8B5CF6") : (barGradient.lightFrom ?? "#6366F1");
  const cTo = isDark ? (barGradient.darkTo ?? "#6366F1") : (barGradient.lightTo ?? "#818CF8");

  return (
    <section className="mx-auto max-w-7xl">
      <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
      {pageSubtitle && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{pageSubtitle}</p>
      )}

      {/* KPI Summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-lg border border-black/10 p-5 shadow-sm bg-white dark:bg-neutral-900 dark:border-white/10 transition"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</div>
              {iconMap[kpi.iconType ?? ""] ?? null}
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {kpi.isCurrency ? `${currency}${kpi.value.toLocaleString()}` : kpi.value.toLocaleString()}
            </div>
            <div className="mt-2">
              <Delta pct={kpi.deltaPct} />
            </div>
          </div>
        ))}
      </div>

      {/* 2 คอลัมน์ */}
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900">
          <div className="p-5">
            <h2 className="text-lg font-semibold">{data.activityTitle ?? "Recent Activity"}</h2>
          </div>
          <div className="divide-y divide-black/10 dark:divide-white/10">
            {activities.map((a: Activity) => {
              const Icon =
                a.status === "success" ? CheckCircleIcon : ExclamationTriangleIcon;
              const color =
                a.status === "success"
                  ? (data.activityStyle?.successClass ?? "text-emerald-500")
                  : a.status === "warning"
                    ? (data.activityStyle?.warningClass ?? "text-amber-500")
                    : (data.activityStyle?.dangerClass ?? "text-rose-500");
              return (
                <div key={a.id} className="flex items-start gap-3 p-4">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <div className="flex-1">
                    <div className="font-medium">{a.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {a.description}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <ClockIcon className="h-4 w-4" />
                      <span>{a.timeAgo}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="rounded-lg border border-black/10 dark:border-white/10 p-5 bg-white dark:bg-neutral-900">
          <h2 className="text-lg font-semibold">{monthly?.title ?? "Monthly Performance"}</h2>

          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly?.series ?? []} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={cFrom} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={cTo} stopOpacity={0.85} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={"rgba(0,0,0,0.10)"} />
                <XAxis
                  dataKey={monthly?.keys?.x ?? "month"}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(0,0,0,0.10)" }}
                  tickLine={{ stroke: "rgba(0,0,0,0.10)" }}
                />
                <YAxis
                  tickFormatter={(v: number) => v.toLocaleString()}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(0,0,0,0.10)" }}
                  tickLine={{ stroke: "rgba(0,0,0,0.10)" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${"rgba(0,0,0,0.12)"}`,
                    borderRadius: 8,
                    color: "#111827",
                    boxShadow: "0 10px 20px rgba(0,0,0,.15)",
                  }}
                  itemStyle={{ color: "#111827" }}
                  labelStyle={{ color: "#111827", fontWeight: 600 }}
                  formatter={(v: number) => [`${currency}${v.toLocaleString()}`, tooltipLabel]}
                />
                <Bar
                  dataKey={monthly?.keys?.y ?? "value"}
                  fill="url(#barFill)"
                  radius={barRadius as any}
                  barSize={barSize}
                  animationDuration={600}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-gray-600 dark:text-gray-300">
              {totalLabel}:{" "}
              <span className="font-semibold">
                {currency}{(monthly?.totalRevenue ?? 0).toLocaleString()}
              </span>
            </div>
            <div className={(monthly?.deltaPct ?? 0) >= 0 ? "text-emerald-600" : "text-amber-600"}>
              {(monthly?.deltaPct ?? 0) >= 0 ? "↑" : "↓"} {Math.abs(monthly?.deltaPct ?? 0)}% {deltaNote}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
