
import React, { useState, useEffect } from "react";
import { cn } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "cosmic" | "quantum";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  variant = "primary",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [particleCount, setParticleCount] = useState(0);

  useEffect(() => {
    if (isHovered && !disabled && variant === "cosmic") {
      const interval = setInterval(() => {
        setParticleCount(prev => {
          if (prev < 10) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setParticleCount(0);
    }
  }, [isHovered, disabled, variant]);

  const base =
    "relative inline-flex items-center justify-center gap-2 select-none " +
    "rounded-2xl px-4 py-2.5 text-sm font-semibold tracking-wide " +
    "transition-all duration-300 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35 " +
    "disabled:opacity-50 disabled:cursor-not-allowed " +
    "active:translate-y-[1px] overflow-hidden";

  const cosmicGlow =
    "before:absolute before:inset-0 before:-z-10 before:rounded-2xl " +
    "before:blur-xl before:opacity-0 hover:before:opacity-100 " +
    "before:transition-all before:duration-500 " +
    "after:absolute after:inset-0 after:-z-20 after:rounded-2xl " +
    "after:blur-2xl after:opacity-0 group-hover:after:opacity-100 " +
    "after:transition-all after:duration-700";

  const v: Record<ButtonVariant, string> = {
    primary: cn(
      cosmicGlow,
      "group text-white",
      "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-600",
      "bg-[length:200%_100%] hover:bg-[length:100%_100%]",
      "hover:from-fuchsia-500 hover:via-purple-500 hover:to-cyan-500",
      "ring-1 ring-white/20",
      "shadow-[0_20px_70px_-25px_rgba(139,92,246,0.8)]",
      "hover:shadow-[0_25px_80px_-15px_rgba(168,85,247,0.9)]",
      "before:bg-gradient-to-r before:from-fuchsia-500/60 before:via-purple-500/50 before:to-cyan-500/60",
      "after:bg-gradient-to-r after:from-fuchsia-400/30 after:via-purple-400/25 after:to-cyan-400/30",
      "animate-gradient-shift"
    ),

    secondary: cn(
      cosmicGlow,
      "group text-cyan-100",
      "bg-gradient-to-br from-white/12 via-white/8 to-transparent",
      "backdrop-blur-sm",
      "ring-1 ring-white/20 ring-inset",
      "shadow-[0_16px_50px_-30px_rgba(0,0,0,0.8)]",
      "hover:shadow-[0_20px_60px_-20px_rgba(34,211,238,0.4)]",
      "hover:ring-cyan-300/40",
      "before:bg-gradient-to-r before:from-cyan-400/25 before:via-sky-400/20 before:to-blue-400/25",
      "after:bg-gradient-to-r after:from-cyan-300/15 after:via-sky-300/10 after:to-blue-300/15"
    ),

    ghost: cn(
      "group text-slate-200",
      "bg-transparent",
      "ring-1 ring-white/10 hover:ring-cyan-300/30",
      "hover:bg-gradient-to-r hover:from-cyan-500/5 hover:via-purple-500/5 hover:to-fuchsia-500/5",
      "hover:shadow-[0_20px_60px_-40px_rgba(217,70,239,0.5)]",
      "transition-all duration-300"
    ),

    danger: cn(
      cosmicGlow,
      "group text-white",
      "bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600",
      "bg-[length:200%_100%] hover:bg-[length:100%_100%]",
      "hover:from-rose-500 hover:via-orange-500 hover:to-amber-500",
      "ring-1 ring-white/20",
      "shadow-[0_20px_70px_-25px_rgba(244,63,94,0.8)]",
      "hover:shadow-[0_25px_80px_-15px_rgba(251,113,133,0.9)]",
      "before:bg-gradient-to-r before:from-rose-500/60 before:via-orange-500/50 before:to-amber-500/60",
      "after:bg-gradient-to-r after:from-rose-400/30 after:via-orange-400/25 after:to-amber-400/30",
      "animate-gradient-shift"
    ),

    cosmic: cn(
      cosmicGlow,
      "group text-white relative overflow-visible",
      "bg-gradient-to-br from-fuchsia-600/90 via-purple-600/90 to-cyan-600/90",
      "bg-[length:400%_400%] animate-gradient-flow",
      "ring-1 ring-white/30",
      "shadow-[0_0_60px_-15px_rgba(168,85,247,0.7),inset_0_1px_0_0_rgba(255,255,255,0.2)]",
      "hover:shadow-[0_0_80px_-10px_rgba(139,92,246,0.9),inset_0_1px_0_0_rgba(255,255,255,0.3)]",
      "before:bg-gradient-to-r before:from-fuchsia-500/70 before:via-purple-500/60 before:to-cyan-500/70",
      "after:bg-gradient-to-r after:from-fuchsia-400/40 after:via-purple-400/35 after:to-cyan-400/40",
      "hover:scale-[1.02]"
    ),

    quantum: cn(
      cosmicGlow,
      "group text-cyan-50",
      "bg-gradient-to-br from-cyan-600/20 via-blue-600/15 to-purple-600/20",
      "backdrop-blur-md",
      "ring-1 ring-cyan-300/30 ring-inset",
      "shadow-[0_0_40px_-10px_rgba(34,211,238,0.5),inset_0_1px_0_0_rgba(255,255,255,0.1)]",
      "hover:ring-cyan-300/50 hover:shadow-[0_0_60px_-5px_rgba(56,189,248,0.7)]",
      "before:bg-gradient-to-r before:from-cyan-400/40 before:via-blue-400/35 before:to-purple-400/40",
      "after:bg-gradient-to-r after:from-cyan-300/25 after:via-blue-300/20 after:to-purple-300/25",
      "hover:bg-gradient-to-br hover:from-cyan-600/25 hover:via-blue-600/20 hover:to-purple-600/25"
    ),
  };

  return (
    <button 
      className={cn(base, v[variant], className, "group")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      {...props}
    >
      {variant === "cosmic" && !disabled && Array.from({ length: particleCount }).map((_, i) => (
        <div
          key={i}
          className="absolute -z-10 h-1 w-1 rounded-full bg-cyan-300/70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particle-float ${0.5 + Math.random()}s ease-out forwards`,
            filter: 'blur(1px)'
          }}
        />
      ))}
      
      <div className="absolute inset-0 -z-30 rounded-2xl bg-gradient-to-r from-cyan-300/0 via-cyan-300/10 to-cyan-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
           style={{ animation: 'glow-sweep 2s ease-in-out infinite' }} />
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      <div className="absolute left-3 top-3 h-2 w-2 border-l border-t border-cyan-300/40 rounded-tl opacity-60" />
      <div className="absolute right-3 top-3 h-2 w-2 border-r border-t border-cyan-300/40 rounded-tr opacity-60" />
      <div className="absolute left-3 bottom-3 h-2 w-2 border-l border-b border-cyan-300/30 rounded-bl opacity-40" />
      <div className="absolute right-3 bottom-3 h-2 w-2 border-r border-b border-cyan-300/30 rounded-br opacity-40" />
    </button>
  );
}