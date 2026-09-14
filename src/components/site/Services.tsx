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
    <section id="services" className="section-shell scroll-mt-20 py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="eyebrow">What We Offer</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">Farm Services</h2>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const image = mediaUrl(service.image_url);
          return (
            <article
              key={service.id}
              className="flex flex-col overflow-hidden border border-border/80 bg-card/75 shadow-[var(--shadow-soft)] backdrop-blur-sm"
            >
              {image && (
                <img src={image} alt={service.title} loading="lazy" className="h-40 w-full object-cover" />
              )}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{service.description}</p>
                {service.cta_label && (
                  <Button asChild variant="outline" className="mt-5">
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
