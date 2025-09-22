/* ===== Shared display config ===== */
export type DisplayConfig = {
  currencySymbol?: string;          // "$" | "฿" | ...
  deltaUpBg?: string;               // eg. "bg-emerald-50"
  deltaUpText?: string;             // eg. "text-emerald-600"
  deltaDownBg?: string;             // eg. "bg-amber-50"
  deltaDownText?: string;           // eg. "text-amber-600"
};

/* ===== Overview ===== */
export type KPIItem = {
  label: string;
  value: number;
  deltaPct: number;
  isCurrency?: boolean;
  iconType?: "money" | "users" | "box";
};

export type ActivityItem = {
  id: string | number;
  title: string;
  description: string;
  timeAgo: string;
  status: "success" | "warning" | "danger";
};

export type OverviewMonthly = {
  title?: string;
  totalRevenue: number;
  deltaPct: number;
  series: Array<Record<string, any>>;
  keys?: { x: string; y: string }; // default {month,value}
  labels?: {
    tooltipLabel?: string; // default "Revenue"
    totalLabel?: string;   // default "Total Revenue"
    deltaNote?: string;    // default "vs last period"
  };
  style?: {
    barGradient?: {
      lightFrom?: string; lightTo?: string;
      darkFrom?: string;  darkTo?: string;
    };
    barRadius?: [number, number, number, number];
    barSize?: number;
  };
};

export type OverviewResponse = {
  pageTitle?: string;
  subtitle?: string;
  display?: DisplayConfig;
  kpis: KPIItem[];
  kpiDeltaNote?: { good: string; bad: string };
  activityTitle?: string;
  activityStyle?: {
    successClass?: string;
    warningClass?: string;
    dangerClass?: string;
  };
  activity: ActivityItem[];
  monthly: OverviewMonthly;
};

/* ===== Insights ===== */
export type BarDatum = { name: string; value: number; colorClass?: string };

export type TopSellingBlock = {
  title?: string;
  note?: string;
  deltaPct: number;
  products: BarDatum[];
  style?: { barColorClass?: string; trackClass?: string; textClass?: string };
};

export type DropOffWeek = { week?: number; label?: string; churnRatePct: number };

export type CustomerDropOffBlock = {
  title?: string;
  note?: string;
  deltaPct: number; // + คือดีขึ้น/- แย่ลง ให้ backend ตีความเอง
  weeks: DropOffWeek[];
  style?: {
    highlightWeekIndex?: number;
    dotColorClass?: string;
    dotHighlightClass?: string;
  };
};

export type RegionDatum = { region: string; value: number; colorClass?: string };

export type RegionalPerformanceBlock = {
  title?: string;
  note?: string;
  deltaPct: number;
  regions: RegionDatum[];
  style?: {
    highlightRegion?: string;
    highlightColorClass?: string;
    barColorClass?: string;
    trackClass?: string;
    textClass?: string;
  };
};

export type FunnelStep = {
  name: string;
  value: number;
  prev?: number;
  currentClass?: string;
  prevClass?: string;
};
export type ConversionFunnelBlock = {
  title?: string;
  note?: string;
  deltaPct: number;
  steps: FunnelStep[];
  style?: {
    currentClass?: string;
    prevClass?: string;
    trackClass?: string;
    chipClass?: string;
    valueTextClass?: string;
  };
};

export type InsightsResponse = {
  pageTitle?: string;
  display?: DisplayConfig;
  topSelling: TopSellingBlock;
  customerDropOff: CustomerDropOffBlock;
  regionalPerformance: RegionalPerformanceBlock;
  conversionFunnel: ConversionFunnelBlock;
};
