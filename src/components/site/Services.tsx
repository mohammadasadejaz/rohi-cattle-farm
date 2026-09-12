import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mediaUrl, whatsappHref, type SiteSettings } from "@/lib/site";
import type { Service } from "@/lib/queries";

export function Services({
  settings,
  services,
}: {
  settings: SiteSettings;
  services: Service[];
}) {
  return (
    <section id="services" className="section-shell scroll-mt-20 py-24 md:py-32">
      <div className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr]">
        <div>
          <p className="eyebrow">03 / The service</p>
          <h2 className="mt-4 max-w-sm font-display text-5xl leading-[0.86] md:text-7xl">Everything needed for a confident choice.</h2>
        </div>
        <p className="max-w-xl self-end text-sm leading-7 text-muted-foreground">From selection to delivery, our team keeps the process direct, considered, and personal.</p>
      </div>

      <div className="mt-14 divide-y divide-border border-y border-border">
        {services.map((service, index) => {
          const image = mediaUrl(service.image_url);
          return (
            <article
              key={service.id}
              className="grid gap-5 py-7 md:grid-cols-[5rem_1fr_1.2fr_auto] md:items-center"
            >
              <span className="font-display text-3xl text-primary/50">0{index + 1}</span>
              <h3 className="font-display text-2xl">{service.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{service.description}</p>
              <div>
                {service.cta_label && (
                  <Button asChild variant="outline">
                    <a
                      href={whatsappHref(
                        settings.whatsapp,
                        `Assalam-o-Alaikum, I would like to ask about "${service.title}" at ${settings.farm_name}.`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle /> {service.cta_label}
                    </a>
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
