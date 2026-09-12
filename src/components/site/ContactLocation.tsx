import { MapPin, Phone, MessageCircle, Navigation, CalendarCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { directionsHref, telHref, whatsappHref, type SiteSettings } from "@/lib/site";

export function ContactLocation({ settings }: { settings: SiteSettings }) {
  const directions = directionsHref(settings);

  return (
    <section id="contact" className="scroll-mt-20 bg-secondary/40 py-20 md:py-28">
      <div className="section-shell grid gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Contact & Location</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">{settings.farm_name}</h2>

          <div className="mt-6 space-y-4 text-sm md:text-base">
            <p className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <span>{settings.address}</span>
            </p>
            <p className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <a href={telHref(settings.phone)} className="hover:underline">
                {settings.phone}
              </a>
            </p>
            <p className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <span>{settings.contact_person}</span>
            </p>
            {settings.email && (
              <p className="flex items-start gap-3">
                <span className="mt-1 h-5 w-5 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:underline">
                  {settings.email}
                </a>
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href={telHref(settings.phone)}>
                <Phone /> Call Now
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer">
                <MessageCircle /> WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={directions} target="_blank" rel="noreferrer">
                <Navigation /> Get Directions
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#booking">
                <CalendarCheck /> Book an Animal
              </a>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-soft)]">
          {settings.maps_url ? (
            <iframe
              title="Farm location map"
              src={settings.maps_url}
              className="h-72 w-full border-0 md:h-[22rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="grid h-72 w-full place-items-center bg-muted px-6 text-center text-sm text-muted-foreground md:h-[22rem]">
              <div>
                <MapPin className="mx-auto h-6 w-6" />
                <p className="mt-3">
                  An exact map pin has not been added yet. Use “Get Directions” for the farm address,
                  or call us for guidance.
                </p>
              </div>
            </div>
          )}
          <div className="p-6">
            <h3 className="font-display text-xl">Finding the Farm</h3>
            <p className="mt-2 text-sm text-muted-foreground">{settings.location_description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
