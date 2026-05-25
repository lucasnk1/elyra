import { cn } from "@/lib/cn";

export function CategoryChip({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-full border px-4 py-2 text-sm shadow-[0_10px_24px_rgba(2,6,23,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(2,6,23,0.12)]",
        active
          ? "border-[color:var(--border)] bg-[color:var(--foreground)] text-[color:var(--background)] dark:bg-white dark:text-slate-950"
          : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted)] hover:border-[color:var(--accent)] hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--foreground)]",
      )}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}