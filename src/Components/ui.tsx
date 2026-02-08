import React, { useState, useEffect } from "react";

export const cn = (...a: Array<string | false | undefined | null>) =>
  a.filter(Boolean).join(" ");

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "cosmic" | "quantum";

export function Button({
  variant = "primary",
  className,
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [particleCount, setParticleCount] = useState(0);

  // Particle animation on hover
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

  // Cosmic glow effects
  const cosmicGlow =
    "before:absolute before:inset-0 before:-z-10 before:rounded-2xl " +
    "before:blur-xl before:opacity-0 hover:before:opacity-100 " +
    "before:transition-all before:duration-500 " +
    "after:absolute after:inset-0 after:-z-20 after:rounded-2xl " +
    "after:blur-2xl after:opacity-0 group-hover:after:opacity-100 " +
    "after:transition-all after:duration-700";

  const v: Record<ButtonVariant, string> = {
    // 🌌 Cosmic Nebula Button
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

    // 🚀 Quantum Cyber Button
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

    // 👻 Ghost with cosmic outline
    ghost: cn(
      "group text-slate-200",
      "bg-transparent",
      "ring-1 ring-white/10 hover:ring-cyan-300/30",
      "hover:bg-gradient-to-r hover:from-cyan-500/5 hover:via-purple-500/5 hover:to-fuchsia-500/5",
      "hover:shadow-[0_20px_60px_-40px_rgba(217,70,239,0.5)]",
      "transition-all duration-300"
    ),

    // 🔥 Cosmic Danger (supernova)
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

    // 🌟 Special Cosmic Variant
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

    // ⚡ Quantum Variant (electric)
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
      {/* Cosmic particles animation */}
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
      
      {/* Animated glow effect */}
      <div className="absolute inset-0 -z-30 rounded-2xl bg-gradient-to-r from-cyan-300/0 via-cyan-300/10 to-cyan-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
           style={{ animation: 'glow-sweep 2s ease-in-out infinite' }} />
      
      {/* Content with shine effect */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      {/* Corner accents */}
      <div className="absolute left-3 top-3 h-2 w-2 border-l border-t border-cyan-300/40 rounded-tl opacity-60" />
      <div className="absolute right-3 top-3 h-2 w-2 border-r border-t border-cyan-300/40 rounded-tr opacity-60" />
      <div className="absolute left-3 bottom-3 h-2 w-2 border-l border-b border-cyan-300/30 rounded-bl opacity-40" />
      <div className="absolute right-3 bottom-3 h-2 w-2 border-r border-b border-cyan-300/30 rounded-br opacity-40" />
    </button>
  );
}

export function Input({
  label,
  hint,
  error,
  className,
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <label className={cn("block group", className)}>
      {(label || hint) && (
        <div className="mb-2 flex items-end justify-between">
          {label ? (
            <div className="text-xs font-semibold text-cyan-100 tracking-wider flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"></span>
              {label}
            </div>
          ) : (
            <span />
          )}
          {hint ? (
            <div className="text-[11px] text-slate-400/80 font-mono">{hint}</div>
          ) : null}
        </div>
      )}

      <div className="relative">
        {/* Outer glow layer */}
        <div className={cn(
          "absolute -inset-[1px] rounded-2xl blur transition-all duration-500",
          hasError 
            ? "bg-gradient-to-r from-rose-500/40 via-orange-500/30 to-amber-500/20"
            : isFocused
              ? "bg-gradient-to-r from-cyan-400/50 via-blue-400/30 to-purple-400/30 opacity-70"
              : "bg-gradient-to-r from-cyan-400/20 via-blue-400/15 to-purple-400/15 opacity-30"
        )} />

        {/* Main input container */}
        <div className={cn(
          "relative rounded-2xl ring-1 outline-none transition-all duration-300",
          "bg-gradient-to-br from-white/10 via-white/8 to-white/5",
          "backdrop-blur-sm",
          hasError
            ? "ring-rose-500/40 hover:ring-rose-400/50"
            : cn(
                "ring-white/15",
                isFocused
                  ? "ring-cyan-300/40 shadow-[0_0_40px_-10px_rgba(34,211,238,0.4)]"
                  : "hover:ring-white/25"
              )
        )}>
          {/* Animated scanline */}
          {isFocused && (
            <div 
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
              style={{ animation: 'scanline 2s linear infinite' }}
            />
          )}

          {/* Input with icon */}
          <div className="relative flex items-center">
            {icon && (
              <div className="absolute left-4 text-slate-400/80 group-hover:text-cyan-300/80 transition-colors">
                {icon}
              </div>
            )}
            
            <input
              {...props}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              className={cn(
                "w-full bg-transparent py-3 text-sm text-slate-100 placeholder:text-slate-400/70",
                "outline-none font-mono tracking-wide",
                "transition-all duration-300",
                icon ? "pl-12 pr-4" : "px-4",
                isFocused && "placeholder:text-cyan-300/40"
              )}
            />
            
            {/* Status indicator */}
            <div className={cn(
              "absolute right-4 h-2 w-2 rounded-full transition-all duration-300",
              hasError 
                ? "bg-gradient-to-r from-rose-400 to-orange-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                : isFocused
                  ? "bg-gradient-to-r from-cyan-400 to-blue-400 shadow-[0_0_12px_rgba(34,211,238,0.6)] animate-pulse"
                  : "bg-slate-600/70"
            )}>
              {!hasError && props.value && (
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-400/30 blur-sm"></div>
              )}
            </div>
          </div>

          {/* Corner accents */}
          <div className={cn(
            "absolute left-3 top-3 h-2 w-2 border-l border-t transition-colors duration-300",
            isFocused ? "border-cyan-300/60" : "border-cyan-300/30"
          )} />
          <div className={cn(
            "absolute right-3 top-3 h-2 w-2 border-r border-t transition-colors duration-300",
            isFocused ? "border-cyan-300/60" : "border-cyan-300/30"
          )} />
          <div className={cn(
            "absolute left-3 bottom-3 h-2 w-2 border-l border-b transition-colors duration-300",
            isFocused ? "border-cyan-300/40" : "border-cyan-300/20"
          )} />
          <div className={cn(
            "absolute right-3 bottom-3 h-2 w-2 border-r border-b transition-colors duration-300",
            isFocused ? "border-cyan-300/40" : "border-cyan-300/20"
          )} />

          {/* Hover effect line */}
          <div className="absolute bottom-0 left-1/2 h-px w-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent transition-all duration-500 group-hover:w-full group-hover:left-0" />
        </div>

        {/* Character counter for non-password */}
        {props.type !== 'password' && props.maxLength && (
          <div className="absolute -bottom-6 right-2 text-[10px] font-mono text-slate-500">
            <span className={cn(
              "transition-colors",
              Number(props.value?.toString().length) > props.maxLength! * 0.9 
                ? "text-amber-300" 
                : "text-slate-500"
            )}>
              {props.value?.toString().length || 0}/{props.maxLength}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-rose-200">
          <div className="h-1.5 w-1.5 rounded-full bg-rose-400"></div>
          <span>{error}</span>
        </div>
      )}
    </label>
  );
}

export function Badge({
  tone = "cyan",
  children,
  className,
  pulsating = false,
  variant = "default",
}: {
  tone?: "blue" | "green" | "red" | "slate" | "amber" | "purple" | "cyan" | "cosmic";
  children: React.ReactNode;
  className?: string;
  pulsating?: boolean;
  variant?: "default" | "glowing" | "hologram";
}) {
  const [isHovered, setIsHovered] = useState(false);

  const toneMap: Record<string, string> = {
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

  const variantClasses = {
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
      {/* Animated indicator dot */}
      <span className="relative flex h-2 w-2">
        <span className={cn(
          "absolute inline-flex h-full w-full rounded-full bg-current opacity-75",
          pulsating && "animate-ping"
        )} />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
      </span>
      
      {children}
      
      {/* Hover glow effect */}
      {isHovered && (
        <div className="absolute -inset-1 -z-10 rounded-full bg-current/10 blur"></div>
      )}
    </span>
  );
}

// Additional cosmic components

export function Card({
  children,
  className,
  glowing = false,
  hoverable = false,
}: {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
  hoverable?: boolean;
}) {
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
      {/* Corner accents */}
      <div className="absolute left-4 top-4 h-3 w-3 border-l border-t border-cyan-300/30 rounded-tl" />
      <div className="absolute right-4 top-4 h-3 w-3 border-r border-t border-cyan-300/30 rounded-tr" />
      <div className="absolute left-4 bottom-4 h-3 w-3 border-l border-b border-cyan-300/20 rounded-bl" />
      <div className="absolute right-4 bottom-4 h-3 w-3 border-r border-b border-cyan-300/20 rounded-br" />
      
      {children}
    </div>
  );
}

export function Divider({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("relative flex items-center py-4", className)}>
      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
      {label && (
        <span className="px-4 text-xs font-semibold text-slate-400/80 tracking-wider">
          {label}
        </span>
      )}
      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
    </div>
  );
}

// CSS animations for global styles
export const CosmicStyles = () => (
  <style jsx global>{`
    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    @keyframes gradient-flow {
      0% { background-position: 0% 0%; }
      100% { background-position: 400% 400%; }
    }
    
    @keyframes particle-float {
      0% { 
        opacity: 1;
        transform: translate(0, 0) scale(1);
      }
      100% { 
        opacity: 0;
        transform: translate(
          ${(Math.random() - 0.5) * 60}px,
          ${(Math.random() - 0.5) * 60}px
        ) scale(0);
      }
    }
    
    @keyframes scanline {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes glow-sweep {
      0%, 100% { opacity: 0; }
      50% { opacity: 0.5; }
    }
    
    .animate-gradient-shift {
      background-size: 200% 200%;
      animation: gradient-shift 3s ease infinite;
    }
    
    .animate-gradient-flow {
      animation: gradient-flow 8s linear infinite;
    }
  `}</style>
);