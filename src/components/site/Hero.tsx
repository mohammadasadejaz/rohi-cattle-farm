import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFallback from "@/assets/hero-cattle.jpg";
import { mediaUrl, telHref, whatsappHref, type SiteSettings } from "@/lib/site";

export function Hero({ settings }: { settings: SiteSettings }) {
  const image = mediaUrl(settings.hero_image_url) ?? heroFallback;

  return (
    <section id="home" className="relative isolate overflow-hidden">
      <img
        src={image}
        alt={`${settings.farm_name} livestock in Cholistan`}
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="section-shell relative flex min-h-[88svh] flex-col justify-end pt-24 pb-16 md:min-h-[92svh] md:pb-24">
        <div className="max-w-3xl text-[oklch(0.97_0.012_85)]">
          <p className="eyebrow">Est. {settings.established_year} · Cholistan, Bahawalpur</p>
          <h1 className="mt-4 font-display text-4xl leading-tight uppercase sm:text-5xl md:text-6xl">
            {settings.hero_heading}
          </h1>
          <p className="mt-4 font-display text-xl italic opacity-95 sm:text-2xl">
            {settings.slogan}
          </p>
          <p className="mt-4 max-w-xl text-base opacity-90 sm:text-lg">{settings.hero_description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#animals">
                {settings.hero_cta_primary} <ArrowRight />
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#booking">{settings.hero_cta_secondary}</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-inherit">
              <a href={telHref(settings.phone)}>
                <Phone /> Call Now
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-inherit">
              <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer">
                <MessageCircle /> WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
