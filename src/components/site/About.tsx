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
    <section id="about" className="section-shell scroll-mt-20 py-24 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative lg:pr-8">
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

        <div>
          <p className="eyebrow">A place with a point of view</p>
          <h2 className="mt-3 max-w-lg font-display text-4xl leading-[0.95] md:text-6xl">{settings.about_title}</h2>
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
    </section>
  );
}
