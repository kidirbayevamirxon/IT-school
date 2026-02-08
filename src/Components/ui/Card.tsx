
import React from "react";
import { cn } from "./utils";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
  hoverable?: boolean;
}

export function Card({
  children,
  className,
  glowing = false,
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-3xl p-6 transition-all duration-300",
        "bg-gradient-to-br from-white/10 via-white/8 to-white/5",
        "backdrop-blur-sm",
        "ring-1 ring-white/15",
        glowing && "shadow-[0_0_60px_-20px_rgba(168,85,247,0.4)]",
        hoverable && "hover:ring-white/25 hover:shadow-[0_0_80px_-15px_rgba(34,211,238,0.3)]",
        className
      )}
    >
      <div className="absolute left-4 top-4 h-3 w-3 border-l border-t border-cyan-300/30 rounded-tl" />
      <div className="absolute right-4 top-4 h-3 w-3 border-r border-t border-cyan-300/30 rounded-tr" />
      <div className="absolute left-4 bottom-4 h-3 w-3 border-l border-b border-cyan-300/20 rounded-bl" />
      <div className="absolute right-4 bottom-4 h-3 w-3 border-r border-b border-cyan-300/20 rounded-br" />
      
      {children}
    </div>
  );
}