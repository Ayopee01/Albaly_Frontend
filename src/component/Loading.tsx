"use client";

import React from "react";

type LoadingProps = {
  heightClass?: string;
  barCount?: number;
  barColorClass?: string;
  delayStepMs?: number;
  waveDurationMs?: number;
  hueRotateDurationMs?: number;
  sweepDurationMs?: number;
  className?: string;
};

export default function Loading({
  heightClass = "h-40",
  barCount = 6,
  barColorClass = "bg-indigo-500",
  delayStepMs = 120,
  waveDurationMs = 900,
  hueRotateDurationMs = 3500,
  sweepDurationMs = 1400,
  className = "",
}: LoadingProps) {
  return (
    <div
      className={`relative flex ${heightClass} items-center justify-center ${className}`}
    >
      <div
        className="relative flex items-end space-x-1 px-2"
        role="status"
        aria-label="Loading"
        style={
          {
            ["--hueMs" as any]: `${hueRotateDurationMs}ms`,
            ["--sweepMs" as any]: `${sweepDurationMs}ms`,
          } as React.CSSProperties
        }
      >
        <div className="pointer-events-none absolute inset-y-0 -left-8 w-16 sweep-mask" />

        {Array.from({ length: barCount }).map((_, i) => (
          <div
            key={i}
            className={`bar ${barColorClass}`}
            style={
              {
                animationDelay: `${i * delayStepMs}ms`,
                ["--waveMs" as any]: `${waveDurationMs}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <style jsx>{`
        /* ไล่สีทั้งชุดด้วย hue-rotate */
        [role="status"] {
          filter: hue-rotate(0deg);
          animation: hue var(--hueMs) linear infinite;
        }

        /* แต่ละแท่ง */
        .bar {
          width: 0.28rem;               /* ~w-1.25 */
          height: 1.25rem;              /* h-5 */
          border-radius: 9999px;
          animation: wave var(--waveMs) ease-in-out infinite;
          transform-origin: 50% 100%;
        }

        /* หน้าจอใหญ่ขึ้น ให้แท่งกว้างนิด */
        @media (min-width: 768px) {
          .bar { width: 0.33rem; }      /* ~w-1.5 */
        }

        /* แถบสว่างที่พุ่งผ่านชุดแท่ง */
        .sweep-mask {
          background: radial-gradient(
              24px 120px at 0% 50%,
              rgba(255, 255, 255, 0.42) 0%,
              rgba(255, 255, 255, 0.24) 40%,
              rgba(255, 255, 255, 0.0) 80%
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.0) 0%,
              rgba(255, 255, 255, 0.2) 50%,
              rgba(255, 255, 255, 0.0) 100%
            );
          mix-blend-mode: screen;       /* ให้ดูสว่างทับสีแท่ง */
          animation: sweep var(--sweepMs) linear infinite;
        }

        /* ===== Keyframes ===== */

        /* wave: โยกสูง-ต่ำ + scaleY */
        @keyframes wave {
          0%   { transform: translateY(0) scaleY(0.6); }
          25%  { transform: translateY(-6px) scaleY(1.0); }
          50%  { transform: translateY(0) scaleY(0.7); }
          75%  { transform: translateY(6px)  scaleY(0.5); }
          100% { transform: translateY(0) scaleY(0.6); }
        }

        /* hue: ไล่เฉดสีทั้งหมด */
        @keyframes hue {
          0%   { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        /* sweep: แถบสว่างพุ่งจากซ้ายไปขวา */
        @keyframes sweep {
          0%   { transform: translateX(-20%); opacity: 0.9; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(120%); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
