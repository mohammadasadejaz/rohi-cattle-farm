import { MessageCircle } from "lucide-react";

import embryoFallback from "@/assets/bulls.jpg";
import { Button } from "@/components/ui/button";
import { whatsappHref, type SiteSettings } from "@/lib/site";

export function EmbryoTransfer({ settings }: { settings: SiteSettings }) {
  return (
    <section id="embryo-transfer" className="scroll-mt-20 py-24 md:py-32">
      <div className="section-shell">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Advanced breeding</p>
            <h2 className="mt-3 max-w-lg font-display text-4xl leading-[0.95] md:text-6xl">
              Embryo transfer for stronger Cholistani herds
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Embryo transfer lets one outstanding cow produce far more calves than she could
              naturally. We collect embryos from proven Cholistani donors and place them in
              recipient cows, so the genetics worth keeping spread through the herd in a fraction of
              the time.
            </p>
            <Button asChild className="mt-8 w-full sm:w-auto">
              <a
                href={whatsappHref(
                  settings.whatsapp,
                  "Assalam-o-Alaikum, I would like to know more about your embryo transfer services.",
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle /> Ask about embryo transfer
              </a>
            </Button>
          </div>

          <div className="relative lg:pl-8">
            <img
              src={embryoFallback}
              alt="Cholistani cattle raised through the farm's breeding programme"
              loading="lazy"
              width={1400}
              height={900}
              className="aspect-[4/3] w-full object-cover shadow-[var(--shadow-lift)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
