import React from "react";

export const cn = (...a: Array<string | false | undefined | null>) => a.filter(Boolean).join(" ");

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed";
  const v: Record<string, string> = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 ring-1 ring-slate-700",
    ghost: "hover:bg-slate-800 text-slate-200",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-600/20",
  };
  return <button className={cn(base, v[variant], className)} {...props} />;
}

export function Input({
  label,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <label className={cn("block", className)}>
      {label && <div className="mb-1 text-sm text-slate-200">{label}</div>}
      <input
        {...props}
        className={cn(
          "w-full rounded-xl bg-slate-900/60 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-800 outline-none placeholder:text-slate-500",
          "focus:ring-2 focus:ring-blue-500/35"
        )}
      />
      {error && <div className="mt-1 text-xs text-red-300">{error}</div>}
    </label>
  );
}

export function Badge({ tone = "slate", children }: { tone?: "blue" | "green" | "red" | "slate"; children: React.ReactNode }) {
  const toneMap: Record<string, string> = {
    blue: "bg-blue-500/15 text-blue-300 ring-blue-500/25",
    green: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
    red: "bg-red-500/15 text-red-300 ring-red-500/25",
    slate: "bg-slate-500/15 text-slate-300 ring-slate-500/25",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1", toneMap[tone])}>{children}</span>;
}
