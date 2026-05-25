import { CheckCircle2 } from "lucide-react";
import { pipelineStages } from "@/lib/elyra-data";

export function PipelineTimeline() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {pipelineStages.map((stage, index) => (
        <div
          key={stage.name}
          className="relative overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 backdrop-blur-xl"
        >
          <div className="absolute right-4 top-4 text-[11px] uppercase tracking-[0.3em] text-[color:var(--muted)] opacity-40">
            0{index + 1}
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full border border-emerald-400/20 bg-emerald-400/12 p-2 text-emerald-600 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[color:var(--foreground)]">{stage.name}</h3>
              <p className="text-sm leading-6 text-[color:var(--muted)]">{stage.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}