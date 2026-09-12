import { Info } from "lucide-react";

export function AvailabilityNotice() {
  return (
    <section className="section-shell py-4">
      <div className="rounded-lg border border-accent/50 bg-accent/15 p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/40">
            <Info className="h-5 w-5 text-primary" />
          </span>
          <div>
            <h2 className="font-display text-xl md:text-2xl">Important Availability</h2>
            <ul className="mt-3 space-y-1 text-sm text-foreground/80 md:text-base">
              <li>Males are available for Qurbani and meat.</li>
              <li>Females are available for breeding.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
