import { NextResponse } from "next/server";
import type { InsightsResponse } from "@/lib/types";

/**
 * NOTE:
 * - ตัวอย่าง API ที่ให้หน้าบ้าน “ไม่ fix ค่า” และควบคุมทุกอย่างจาก JSON
 * - ปรับไปเชื่อมต่อฐานข้อมูล หรือบริการ analytics ได้ตามจริง
 */
export async function GET() {
  // === ตัวอย่างข้อมูล (อาจมาจากบริการรายงาน/คลังข้อมูล) ===
  const payload: InsightsResponse = {
    pageTitle: "Insights",
    display: {
      currencySymbol: "$",
      deltaUpBg: "bg-emerald-50",
      deltaUpText: "text-emerald-600",
      deltaDownBg: "bg-amber-50",
      deltaDownText: "text-amber-600",
    },

    topSelling: {
      title: "Top-Selling Product",
      note: "Product A outperformed by 23% this month.",
      deltaPct: 23,
      products: [
        { name: "Product A", value: 35230, colorClass: "bg-indigo-500" },
        { name: "Product B", value: 32180, colorClass: "bg-indigo-500" },
      ],
      style: {
        fullAt: 50000,
        barColorClass: "bg-indigo-500",
        trackClass: "bg-slate-200",
        textClass: "text-slate-700",
      },
    },

    customerDropOff: {
      title: "Customer Drop-Off",
      note: "Week 3 saw a 17% increase in user churn.",
      // หมายเหตุ: ให้ backend ตีความค่า +/− เองว่าถือว่าดี/แย่
      deltaPct: 17, // เพิ่มขึ้น (ถือว่าแย่ในมุม churn)
      weeks: [
        { week: 1, label: "Week 1", churnRatePct: 3 },
        { week: 2, label: "Week 2", churnRatePct: 5 },
        { week: 3, label: "Week 3", churnRatePct: 17 },
        { week: 4, label: "Week 4", churnRatePct: 8 },
      ],
      style: {
        highlightWeekIndex: 2,          // เน้น week 3 (index เริ่ม 0)
        dotColorClass: "bg-indigo-500", // จุดปกติ
        dotHighlightClass: "bg-rose-500",
      },
    },

    regionalPerformance: {
      title: "Regional Performance",
      note: "APAC region showing strongest growth this quarter.",
      deltaPct: 8,
      regions: [
        { region: "North America", value: 245000, colorClass: "bg-indigo-500" },
        { region: "Europe", value: 190000, colorClass: "bg-indigo-500" },
        { region: "APAC", value: 340000, colorClass: "bg-emerald-500" },
      ],
      style: {
        highlightRegion: "APAC",
        fullAt: 400000,
        highlightColorClass: "bg-emerald-500",
        barColorClass: "bg-indigo-500",
        trackClass: "bg-slate-200",
        textClass: "text-slate-700",
      },
    },

    conversionFunnel: {
      title: "Conversion Funnel",
      note: "Checkout to purchase conversion decreased by 5%.",
      deltaPct: -5,
      steps: [
        { name: "VISITORS", value: 12000 },
        { name: "PRODUCT VIEWS", value: 8400 },
        { name: "ADD TO CART", value: 3600 },
        { name: "PURCHASE", value: 1440 },
      ],
      style: {
        fullAt: 15000,
        currentClass: "bg-indigo-500",
        prevClass: "bg-slate-300",
        trackClass: "bg-slate-200",
        chipClass: "bg-slate-100 text-slate-600",
        valueTextClass: "text-slate-500",
      },
    },
  };

  return NextResponse.json(payload, { status: 200 });
}
