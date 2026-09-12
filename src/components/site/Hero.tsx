import { Phone, MessageCircle, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFallback from "@/assets/hero-cattle.jpg";
import { mediaUrl, telHref, whatsappHref, type SiteSettings } from "@/lib/site";

export function Hero({ settings }: { settings: SiteSettings }) {
  const image = mediaUrl(settings.hero_image_url) ?? heroFallback;

  return (
    <section id="home" className="relative overflow-hidden bg-earth pt-28 text-primary-foreground md:pt-36">
      <div className="mx-auto grid min-h-[calc(100svh-1.5rem)] max-w-[90rem] items-stretch gap-0 px-4 pb-4 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:pb-8">
        <div className="relative z-10 flex flex-col justify-between bg-background px-6 py-10 text-foreground md:px-12 md:py-14 lg:px-16">
          <div className="reveal-up">
            <p className="eyebrow">{settings.established_year} / The Rohi / Bahawalpur</p>
            <h1 className="mt-8 max-w-xl font-display text-6xl leading-[0.82] sm:text-7xl lg:text-[7.5rem]">{settings.hero_heading}</h1>
            <p className="mt-8 max-w-md font-display text-2xl leading-tight text-primary sm:text-3xl">{settings.slogan}</p>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">{settings.hero_description}</p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="lg"><a href="#animals">{settings.hero_cta_primary}</a></Button>
            <Button asChild size="lg" variant="outline"><a href="#booking">{settings.hero_cta_secondary}</a></Button>
          </div>
          <a href="#about" className="mt-12 hidden items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground md:flex"><ArrowDown className="h-4 w-4" /> Scroll to explore</a>
        </div>
        <div className="relative min-h-[48svh] overflow-hidden md:min-h-0">
          <img src={image} alt={`${settings.farm_name} livestock in Cholistan`} width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,oklch(0.12_0.02_35/0.75)_100%)]" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white md:bottom-10 md:left-10 md:right-10">
            <div><p className="font-display text-4xl">Rohi</p><p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Animals with a sense of place</p></div>
            <div className="flex gap-2"><a href={telHref(settings.phone)} aria-label="Call now" className="grid h-11 w-11 place-items-center border border-white/40 bg-black/20 backdrop-blur-md"><Phone className="h-4 w-4" /></a><a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-11 w-11 place-items-center border border-white/40 bg-black/20 backdrop-blur-md"><MessageCircle className="h-4 w-4" /></a></div>
          </div>
        </div>
      </div>
    </section>
  );
}
