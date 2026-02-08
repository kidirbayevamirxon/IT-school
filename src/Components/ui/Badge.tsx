// src/components/ui/Badge.tsx
import React, { useState } from "react";
import { cn } from "./utils";

export type BadgeTone = "blue" | "green" | "red" | "slate" | "amber" | "purple" | "cyan" | "cosmic";
export type BadgeVariant = "default" | "glowing" | "hologram";

export interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
  pulsating?: boolean;
  variant?: BadgeVariant;
}

export function Badge({
  tone = "cyan",
  children,
  className,
  pulsating = false,
  variant = "default",
}: BadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const toneMap: Record<BadgeTone, string> = {
    cyan: cn(
      "bg-gradient-to-r from-cyan-500/30 via-cyan-500/20 to-cyan-500/30",
      "text-cyan-100",
      "ring-1 ring-cyan-300/30",
      "shadow-[0_16px_45px_-34px_rgba(34,211,238,0.85)]"
    ),
    blue: cn(
      "bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-blue-500/30",
      "text-blue-100",
      "ring-1 ring-blue-300/30",
      "shadow-[0_16px_45px_-34px_rgba(59,130,246,0.85)]"
    ),
    green: cn(
      "bg-gradient-to-r from-emerald-500/30 via-emerald-500/20 to-emerald-500/30",
      "text-emerald-100",
      "ring-1 ring-emerald-300/30",
      "shadow-[0_16px_45px_-34px_rgba(16,185,129,0.80)]"
    ),
    red: cn(
      "bg-gradient-to-r from-rose-500/30 via-rose-500/20 to-rose-500/30",
      "text-rose-100",
      "ring-1 ring-rose-300/30",
      "shadow-[0_16px_45px_-34px_rgba(244,63,94,0.80)]"
    ),
    amber: cn(
      "bg-gradient-to-r from-amber-500/30 via-amber-500/20 to-amber-500/30",
      "text-amber-100",
      "ring-1 ring-amber-300/30",
      "shadow-[0_16px_45px_-34px_rgba(245,158,11,0.80)]"
    ),
    purple: cn(
      "bg-gradient-to-r from-fuchsia-500/30 via-fuchsia-500/20 to-fuchsia-500/30",
      "text-fuchsia-100",
      "ring-1 ring-fuchsia-300/30",
      "shadow-[0_16px_45px_-34px_rgba(217,70,239,0.85)]"
    ),
    slate: cn(
      "bg-gradient-to-r from-white/20 via-white/15 to-white/20",
      "text-slate-100",
      "ring-1 ring-white/20",
      "shadow-[0_16px_45px_-38px_rgba(255,255,255,0.15)]"
    ),
    cosmic: cn(
      "bg-gradient-to-r from-fuchsia-500/40 via-purple-500/30 to-cyan-500/40",
      "text-white",
      "ring-1 ring-white/25",
      "shadow-[0_20px_50px_-25px_rgba(168,85,247,0.7)]",
      "animate-gradient-shift"
    ),
  };

  const variantClasses: Record<BadgeVariant, string> = {
    default: "",
    glowing: "shadow-[0_0_25px_-5px_rgba(var(--color-glow),0.6)]",
    hologram: cn(
      "backdrop-blur-sm bg-gradient-to-r from-transparent via-white/10 to-transparent",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-fuchsia-500/20 before:via-purple-500/15 before:to-cyan-500/20",
      "before:blur-sm"
    ),
  };

  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide",
        "ring-1 backdrop-blur transition-all duration-300",
        toneMap[tone],
        variantClasses[variant],
        pulsating && "animate-pulse",
        isHovered && "scale-105",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative flex h-2 w-2">
        <span className={cn(
          "absolute inline-flex h-full w-full rounded-full bg-current opacity-75",
          pulsating && "animate-ping"
        )} />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
      </span>
      
      {children}
      
      {isHovered && (
        <div className="absolute -inset-1 -z-10 rounded-full bg-current/10 blur"></div>
      )}
    </span>
  );
}