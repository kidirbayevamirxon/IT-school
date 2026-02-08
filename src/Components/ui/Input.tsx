// src/components/ui/Input.tsx
import React, { useState } from "react";
import { cn } from "./utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  hint,
  error,
  className,
  icon,
  ...props
}: InputProps) {
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
        <div className={cn(
          "absolute -inset-[1px] rounded-2xl blur transition-all duration-500",
          hasError 
            ? "bg-gradient-to-r from-rose-500/40 via-orange-500/30 to-amber-500/20"
            : isFocused
              ? "bg-gradient-to-r from-cyan-400/50 via-blue-400/30 to-purple-400/30 opacity-70"
              : "bg-gradient-to-r from-cyan-400/20 via-blue-400/15 to-purple-400/15 opacity-30"
        )} />

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
          {isFocused && (
            <div 
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
              style={{ animation: 'scanline 2s linear infinite' }}
            />
          )}

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

          <div className="absolute bottom-0 left-1/2 h-px w-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent transition-all duration-500 group-hover:w-full group-hover:left-0" />
        </div>

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