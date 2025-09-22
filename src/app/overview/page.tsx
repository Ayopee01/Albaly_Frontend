"use client";

import { useEffect, useMemo, useState } from "react";
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

// ---- helper types
type RadiusType = number | [number, number, number, number];
type ChartPoint = Record<string, string | number>; 

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

  const {
    pageTitle = "Overview",
    subtitle = "",
    kpis,
    kpiDeltaNote,
    activityTitle = "Recent Activity",
    activityStyle,
    activity,
    display,
    monthly,
  } = data;

  // number formatters
  const locale = display?.locale ?? "en-US";
  const currencySymbol = display?.currencySymbol ?? "$";
  const nfInteger = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const iconMap: Record<NonNullable<typeof kpis[number]["iconType"]>, ReactNode> = {
    money: <BanknotesIcon className="h-5 w-5 text-gray-400" />,
    users: <UsersIcon className="h-5 w-5 text-gray-400" />,
    box:   <ArchiveBoxIcon className="h-5 w-5 text-gray-400" />,
  };

  const Delta = ({ pct }: { pct: number }) => (
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
      {kpiDeltaNote && (
        <span className="text-gray-500 dark:text-gray-400">
          {pct >= 0 ? kpiDeltaNote.good ?? "vs last period" : kpiDeltaNote.bad ?? "vs last period"}
        </span>
      )}
    </span>
  );

  // Monthly settings
  const barGradient = monthly.style?.barGradient ?? {
    lightFrom: "#6366F1",
    lightTo:   "#818CF8",
    darkFrom:  "#8B5CF6",
    darkTo:    "#6366F1",
  };
  const barRadius: RadiusType = monthly.style?.barRadius ?? [8, 8, 0, 0];
  const barSize = monthly.style?.barSize ?? 28;
  const tooltipLabel = monthly.labels?.tooltipLabel ?? "Revenue";
  const totalLabel   = monthly.labels?.totalLabel   ?? "Total Revenue";
  const deltaNote    = monthly.labels?.deltaNote    ?? "vs last period";

  const cFrom = isDark ? (barGradient.darkFrom ?? "#8B5CF6") : (barGradient.lightFrom ?? "#6366F1");
  const cTo   = isDark ? (barGradient.darkTo   ?? "#6366F1") : (barGradient.lightTo   ?? "#818CF8");

  const chartData: ChartPoint[] = (monthly.series as unknown as ChartPoint[]) ?? [];
  const xKey = monthly.keys?.x ?? "month";
  const yKey = monthly.keys?.y ?? "value";

  return (
    <section className="mx-auto max-w-7xl">
      <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
      {subtitle && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}

      {/* KPI Summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpis.map((kpi, idx) => (
          <div
            key={`${kpi.label}-${idx}`}
            className="rounded-lg border border-black/10 p-5 shadow-sm bg-white dark:bg-neutral-900 dark:border-white/10 transition"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</div>
              {kpi.iconType ? iconMap[kpi.iconType] : null}
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {kpi.isCurrency
                ? `${currencySymbol}${nfInteger.format(kpi.value)}`
                : nfInteger.format(kpi.value)}
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
            <h2 className="text-lg font-semibold">{activityTitle}</h2>
          </div>
          <div className="divide-y divide-black/10 dark:divide-white/10">
            {activity.map((a: Activity) => {
              const Icon = a.status === "success" ? CheckCircleIcon : ExclamationTriangleIcon;
              const color =
                a.status === "success"
                  ? (activityStyle?.successClass ?? "text-emerald-500")
                  : a.status === "warning"
                  ? (activityStyle?.warningClass ?? "text-amber-500")
                  : (activityStyle?.dangerClass ?? "text-rose-500");
              return (
                <div key={a.id} className="flex items-start gap-3 p-4">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <div className="flex-1">
                    <div className="font-medium">{a.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{a.description}</div>
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
          <h2 className="text-lg font-semibold">{monthly.title ?? "Monthly Performance"}</h2>

          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={cFrom} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={cTo}   stopOpacity={0.85} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.10)" />
                <XAxis
                  dataKey={xKey}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(0,0,0,0.10)" }}
                  tickLine={{ stroke: "rgba(0,0,0,0.10)" }}
                />
                <YAxis
                  tickFormatter={(v: number) => nfInteger.format(v)}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(0,0,0,0.10)" }}
                  tickLine={{ stroke: "rgba(0,0,0,0.10)" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: 8,
                    color: "#111827",
                    boxShadow: "0 10px 20px rgba(0,0,0,.15)",
                  }}
                  itemStyle={{ color: "#111827" }}
                  labelStyle={{ color: "#111827", fontWeight: 600 }}
                  formatter={(v: number) => [`${currencySymbol}${nfInteger.format(v)}`, tooltipLabel]}
                />
                <Bar
                  dataKey={yKey}
                  fill="url(#barFill)"
                  radius={barRadius} 
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
                {currencySymbol}{nfInteger.format(monthly.totalRevenue ?? 0)}
              </span>
            </div>
            <div className={(monthly.deltaPct ?? 0) >= 0 ? "text-emerald-600" : "text-amber-600"}>
              {(monthly.deltaPct ?? 0) >= 0 ? "↑" : "↓"} {Math.abs(monthly.deltaPct ?? 0)}% {deltaNote}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
