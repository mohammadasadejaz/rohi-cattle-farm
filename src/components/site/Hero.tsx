import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFallback from "@/assets/hero-cattle.jpg";
import { mediaUrl, telHref, whatsappHref, type SiteSettings } from "@/lib/site";

export function Hero({ settings }: { settings: SiteSettings }) {
  const image = mediaUrl(settings.hero_image_url) ?? heroFallback;

  return (
    <section id="home" className="relative isolate overflow-hidden bg-earth">
      <img
        src={image}
        alt={`${settings.farm_name} livestock in Cholistan`}
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="section-shell relative flex min-h-[88svh] flex-col justify-end pb-14 pt-32 md:min-h-[92svh] md:pb-20">
        <div className="reveal-up max-w-3xl text-[oklch(0.97_0.012_85)]">
          <p className="eyebrow">Est. {settings.established_year} · The Rohi, Bahawalpur</p>
          <h1 className="mt-5 max-w-2xl font-display text-5xl leading-[0.92] sm:text-6xl md:text-8xl">
            {settings.hero_heading}
          </h1>
          <p className="mt-6 font-display text-2xl italic opacity-95 sm:text-3xl">
            {settings.slogan}
          </p>
          <p className="mt-5 max-w-xl text-sm leading-7 opacity-90 sm:text-base">{settings.hero_description}</p>

          <div className="mt-9 flex flex-wrap gap-3">
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
        <div className="mt-14 grid max-w-2xl grid-cols-3 border-t border-white/25 pt-5 text-white/80">
          <div><p className="font-display text-2xl text-white">Rohi</p><p className="text-[10px] uppercase tracking-[0.18em]">Cholistan origin</p></div>
          <div><p className="font-display text-2xl text-white">Qurbani</p><p className="text-[10px] uppercase tracking-[0.18em]">Meat & breeding</p></div>
          <div><p className="font-display text-2xl text-white">Care</p><p className="text-[10px] uppercase tracking-[0.18em]">Raised responsibly</p></div>
        </div>
      </div>
    </section>
  );
}
