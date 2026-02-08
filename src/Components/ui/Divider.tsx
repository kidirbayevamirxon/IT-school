
import { cn } from "./utils";

export interface DividerProps {
  className?: string;
  label?: string;
}

export function Divider({
  className,
  label,
}: DividerProps) {
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