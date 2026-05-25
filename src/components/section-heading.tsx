import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[color:var(--border)] pb-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">{eyebrow}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-3xl">{title}</h2>
        <p className="max-w-xl text-sm leading-6 text-[color:var(--muted)]">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}