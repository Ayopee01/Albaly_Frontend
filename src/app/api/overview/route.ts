import { NextResponse } from "next/server";
import type { OverviewResponse } from "@/lib/types";

/**
 * NOTE:
 * - ตรงนี้เป็น mock API ตัวอย่างที่หน้าบ้านจะ “อ่านทุกอย่างจาก JSON นี้”
 * - เปลี่ยนไปดึงจาก DB/Service จริงได้ตามสะดวก แล้วให้ return ใน shape เดิม
 */
export async function GET() {
  // === ตัวอย่างข้อมูล (สมมติอ่านจากฐานข้อมูล) ===
  const series = [
    { month: "Jan", value: 11320 },
    { month: "Feb", value: 12640 },
    { month: "Mar", value: 13550 },
    { month: "Apr", value: 16800 },
    { month: "May", value: 18220 },
    { month: "Jun", value: 19690 },
    { month: "Jul", value: 21100 },
  ];

  const totalRevenue = series.reduce((acc, d) => acc + d.value, 0);
  const deltaPct = 23; // ให้ backend คำนวณเองจริง ๆ

  const payload: OverviewResponse = {
    pageTitle: "Overview",
    subtitle: "KPI, recent activity, and monthly performance.",
    display: { currencySymbol: "$" },
    kpiDeltaNote: { good: "vs last period", bad: "vs last period" },
    kpis: [
      { label: "Total Sales", value: 1245, deltaPct: 12, isCurrency: false, iconType: "money" },
      { label: "Active Customers", value: 320, deltaPct: 8, isCurrency: false, iconType: "users" },
      { label: "Inventory Status", value: 5600, deltaPct: -3, isCurrency: false, iconType: "box" },
    ],
    activityTitle: "Recent Activity",
    activityStyle: {
      successClass: "text-emerald-500",
      warningClass: "text-amber-500",
      dangerClass: "text-rose-500",
    },
    activity: [
      {
        id: "a1",
        title: "New customer sign-up",
        description: "Enterprise client from Germany",
        timeAgo: "2 hours ago",
        status: "danger",
      },
      {
        id: "a2",
        title: "Order #88492 completed",
        description: "$4,320.00 – 8 items",
        timeAgo: "5 hours ago",
        status: "success",
      },
      {
        id: "a3",
        title: "Low inventory alert",
        description: "Product SKU-8829 below threshold",
        timeAgo: "1 day ago",
        status: "warning",
      },
    ],
    monthly: {
      title: "Monthly Performance",
      totalRevenue,
      deltaPct,
      series,
      keys: { x: "month", y: "value" }, // หน้าบ้านจะอ่าน key ตามนี้
      labels: {
        tooltipLabel: "Revenue",
        totalLabel: "Total Revenue",
        deltaNote: "vs last period",
      },
      style: {
        barGradient: {
          lightFrom: "#6366F1",
          lightTo: "#818CF8",
          darkFrom: "#8B5CF6",
          darkTo: "#6366F1",
        },
        barRadius: [8, 8, 0, 0],
        barSize: 28,
      },
    },
  };

  return NextResponse.json(payload, { status: 200 });
}
