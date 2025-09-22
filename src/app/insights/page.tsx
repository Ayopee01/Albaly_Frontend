"use client";

import { useEffect, useState } from "react";
import Loading from "@/component/Loading";
import type { InsightsResponse, FunnelStep } from "@/lib/types";

function DeltaBadge({ pct, upBg, upText, downBg, downText }: {
  pct: number;
  upBg?: string; upText?: string;
  downBg?: string; downText?: string;
}) {
  const up = pct >= 0;
  const bg = up ? (upBg ?? "bg-emerald-50") : (downBg ?? "bg-amber-50");
  const tx = up ? (upText ?? "text-emerald-600") : (downText ?? "text-amber-600");
  return (
    <span className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${bg} ${tx}`}>
      {up ? "↑" : "↓"} {Math.abs(pct)}%
    </span>
  );
}

function BarRow({
  label,
  value,
  rightText,
  colorClass = "bg-indigo-500",
  max = 1,
  trackClass = "bg-slate-200",
  textClass = "text-slate-700",
}: {
  label: string;
  value: number;
  rightText?: string;
  colorClass?: string;
  max?: number;
  trackClass?: string;
  textClass?: string;
}) {
  const pct = Math.max(2, Math.min(100, (value / (max || 1)) * 100));
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-sm">
        <span className={textClass}>{label}</span>
        {rightText && <span className={textClass}>{rightText}</span>}
      </div>
      <div className={`mt-2 h-2.5 rounded-full ${trackClass}`}>
        <div className={`h-2.5 rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function FunnelRow({
  step,
  max,
  currentClass = "bg-indigo-500",
  prevClass = "bg-slate-300",
  trackClass = "bg-slate-200",
  chipClass = "bg-slate-100 text-slate-600",
  valueTextClass = "text-slate-500",
}: {
  step: FunnelStep;
  max: number;
  currentClass?: string;
  prevClass?: string;
  trackClass?: string;
  chipClass?: string;
  valueTextClass?: string;
}) {
  const currentPct = Math.max(3, Math.min(100, (step.value / (max || 1)) * 100));
  const prevPct = Math.max(0, Math.min(100, (Math.max(step.prev ?? 0, step.value) / (max || 1)) * 100));
  return (
    <div className="mb-4">
      <div className={`mb-1 inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${chipClass}`}>
        {step.name}
      </div>
      <div className={`relative h-2.5 rounded-full ${trackClass}`}>
        <div className={`absolute left-0 top-0 h-2.5 rounded-full ${prevClass}`} style={{ width: `${prevPct}%` }} />
        <div className={`absolute left-0 top-0 h-2.5 rounded-full ${currentClass}`} style={{ width: `${currentPct}%` }} />
      </div>
      <div className={`mt-1 text-right text-xs ${valueTextClass}`}>
        {step.value.toLocaleString()}
      </div>
    </div>
  );
}

/* ===== Page ===== */
export default function InsightsPage() {
  const [data, setData] = useState<InsightsResponse | null>(null);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json() as Promise<InsightsResponse>)
      .then(setData)
      .catch((e) => console.error("insights fetch error:", e));
  }, []);

  if (!data) {
    return <Loading heightClass="h-40" barCount={4} barColorClass="bg-indigo-500" />;
  }

  const pageTitle = data.pageTitle ?? "Insights";

  // Top-Selling
  const ts = data.topSelling;
  const tsMax = Math.max(...(ts?.products ?? []).map((p) => p.value), 1);
  const currency = data.display?.currencySymbol ?? "$";
  const tsBarColor = ts?.style?.barColorClass ?? "bg-indigo-500";
  const tsTrack = ts?.style?.trackClass ?? "bg-slate-200";
  const tsText = ts?.style?.textClass ?? "text-slate-700";

  // Drop-Off
  const cd = data.customerDropOff;
  const cdTitle = cd?.title ?? "Customer Drop-Off";
  const cdNote = cd?.note ?? "";
  const cdWeeks = cd?.weeks ?? [];
  const cdRoseIndex = cd?.style?.highlightWeekIndex; // ให้ API ชี้สัปดาห์ที่เน้น
  const cdDotNormal = cd?.style?.dotColorClass ?? "bg-indigo-500";
  const cdDotHighlight = cd?.style?.dotHighlightClass ?? "bg-rose-500";
  const deltaUpBg = data.display?.deltaUpBg;
  const deltaUpText = data.display?.deltaUpText;
  const deltaDownBg = data.display?.deltaDownBg;
  const deltaDownText = data.display?.deltaDownText;

  // Regional
  const rp = data.regionalPerformance;
  const rpMax = Math.max(...(rp?.regions ?? []).map((r) => r.value), 1);
  const rpTitle = rp?.title ?? "Regional Performance";
  const rpNote = rp?.note ?? "";
  const rpBarColorDefault = rp?.style?.barColorClass ?? "bg-indigo-500";
  const rpTrack = rp?.style?.trackClass ?? "bg-slate-200";
  const rpText = rp?.style?.textClass ?? "text-slate-700";

  // Funnel
  const cf = data.conversionFunnel;
  const cfTitle = cf?.title ?? "Conversion Funnel";
  const cfNote = cf?.note ?? "";
  const funnelMax = Math.max(...(cf?.steps ?? []).map((s) => Math.max(s.prev ?? 0, s.value)), 1);
  const cfStyle = cf?.style ?? {};
  const cfCurrent = cfStyle.currentClass ?? "bg-indigo-500";
  const cfPrev = cfStyle.prevClass ?? "bg-slate-300";
  const cfTrack = cfStyle.trackClass ?? "bg-slate-200";
  const cfChip = cfStyle.chipClass ?? "bg-slate-100 text-slate-600";
  const cfValueText = cfStyle.valueTextClass ?? "text-slate-500";

  return (
    <section className="mx-auto max-w-7xl">
      <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Top-Selling Product */}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-sm transition">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {ts?.title ?? "Top-Selling Product"}
            </h3>
            <DeltaBadge
              pct={ts?.deltaPct ?? 0}
              upBg={deltaUpBg}
              upText={deltaUpText}
              downBg={deltaDownBg}
              downText={deltaDownText}
            />
          </div>
          {ts?.note && <p className="text-sm text-slate-600 dark:text-slate-300">{ts.note}</p>}

          <div className="mt-5">
            {(ts?.products ?? []).map((p) => (
              <BarRow
                key={p.name}
                label={p.name}
                value={p.value}
                rightText={`${currency}${p.value.toLocaleString()}`}
                colorClass={p.colorClass ?? tsBarColor}
                max={tsMax}
                trackClass={tsTrack}
                textClass={tsText}
              />
            ))}
          </div>
        </div>

        {/* Customer Drop-Off */}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-sm transition">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {cdTitle}
            </h3>
            <DeltaBadge
              pct={cd?.deltaPct ?? 0}
              upBg={deltaUpBg}
              upText={deltaUpText}
              downBg={deltaDownBg}
              downText={deltaDownText}
            />
          </div>
          {cdNote && <p className="text-sm text-slate-600 dark:text-slate-300">{cdNote}</p>}

          <ul className="mt-4 space-y-2 text-sm">
            {cdWeeks.map((w, i) => (
              <li key={i} className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    i === cdRoseIndex ? cdDotHighlight : cdDotNormal
                  }`}
                />
                <span className="text-slate-700 dark:text-slate-200">
                  {(w.label ?? `Week ${w.week}`)}: {w.churnRatePct}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Regional Performance */}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-sm transition">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {rpTitle}
            </h3>
            <DeltaBadge
              pct={rp?.deltaPct ?? 0}
              upBg={deltaUpBg}
              upText={deltaUpText}
              downBg={deltaDownBg}
              downText={deltaDownText}
            />
          </div>
          {rpNote && <p className="text-sm text-slate-600 dark:text-slate-300">{rpNote}</p>}

          <div className="mt-5">
            {(rp?.regions ?? []).map((r) => (
              <BarRow
                key={r.region}
                label={r.region}
                value={r.value}
                rightText={`${currency}${r.value.toLocaleString()}`}
                colorClass={r.colorClass ?? (r.region === rp?.style?.highlightRegion ? (rp?.style?.highlightColorClass ?? "bg-emerald-500") : rpBarColorDefault)}
                max={rpMax}
                trackClass={rpTrack}
                textClass={rpText}
              />
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-sm transition">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {cfTitle}
            </h3>
            <DeltaBadge
              pct={cf?.deltaPct ?? 0}
              upBg={deltaUpBg}
              upText={deltaUpText}
              downBg={deltaDownBg}
              downText={deltaDownText}
            />
          </div>
          {cfNote && <p className="text-sm text-slate-600 dark:text-slate-300">{cfNote}</p>}

          <div className="mt-5">
            {(cf?.steps ?? []).map((s) => (
              <FunnelRow
                key={s.name}
                step={s}
                max={funnelMax}
                currentClass={s.currentClass ?? cfCurrent}
                prevClass={s.prevClass ?? cfPrev}
                trackClass={cfTrack}
                chipClass={cfChip}
                valueTextClass={cfValueText}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
