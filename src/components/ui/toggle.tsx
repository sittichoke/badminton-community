import { cn } from "@/lib/utils";
import { type InputHTMLAttributes } from "react";

type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

export function Toggle({ className, label, ...props }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800">
      <div className="relative">
        <input
          type="checkbox"
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            "h-5 w-9 rounded-full bg-slate-300 transition peer-checked:bg-blue-600",
            className,
          )}
        />
        <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4 peer-checked:bg-white" />
      </div>
      {label}
    </label>
  );
}
