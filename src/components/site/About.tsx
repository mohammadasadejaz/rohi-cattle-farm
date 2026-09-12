import { Beef, HeartHandshake, Dna } from "lucide-react";
import aboutFallback from "@/assets/cholistan.jpg";
import { mediaUrl, type SiteSettings } from "@/lib/site";

const PILLARS = [
  { icon: Beef, title: "Qurbani & Meat", text: "Male animals selected and prepared for Qurbani and meat." },
  { icon: Dna, title: "Breeding Stock", text: "Female animals available for breeding and herd building." },
  { icon: HeartHandshake, title: "Animal Care", text: "Responsible husbandry with year-round vaccination and health care." },
];

export function About({ settings }: { settings: SiteSettings }) {
  const image = mediaUrl(settings.about_image_url) ?? aboutFallback;

  return (
    <section id="about" className="scroll-mt-20 bg-secondary/45 py-24 md:py-32">
      <div className="section-shell grid items-start gap-12 lg:grid-cols-[0.65fr_1.35fr]">
        <div className="sticky top-28">
          <p className="eyebrow">01 / The place</p>
          <h2 className="mt-5 max-w-sm font-display text-5xl leading-[0.86] md:text-7xl">Raised in the rhythm of the Rohi.</h2>
          <p className="mt-6 max-w-xs text-sm leading-7 text-muted-foreground">A farm shaped by open land, long horizons, and a commitment to animals chosen for their character.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div className="relative">
          <img
            src={image}
            alt="Cholistan landscape around the farm"
            loading="lazy"
            width={1400}
            height={900}
            className="aspect-[4/3] w-full object-cover shadow-[var(--shadow-lift)]"
          />
          <div className="absolute -bottom-6 -right-1 hidden bg-earth px-7 py-5 text-primary-foreground shadow-[var(--shadow-lift)] sm:block">
            <p className="font-display text-2xl">Rohi</p>
            <p className="text-xs tracking-[0.18em] uppercase opacity-80">Cholistan</p>
          </div>
        </div>

        <div className="md:pb-2">
          <p className="eyebrow">Our approach</p>
          <h3 className="mt-3 max-w-lg font-display text-3xl leading-tight md:text-4xl">{settings.about_title}</h3>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {settings.about_description}
          </p>

          <div className="mt-10 grid gap-0 border-y border-border sm:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="border-b border-border py-5 last:border-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-0">
                <pillar.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-display text-xl">{pillar.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
