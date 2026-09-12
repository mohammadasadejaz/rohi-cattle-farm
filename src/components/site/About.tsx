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
    <section id="about" className="section-shell scroll-mt-20 py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <img
            src={image}
            alt="Cholistan landscape around the farm"
            loading="lazy"
            width={1400}
            height={900}
            className="w-full rounded-lg object-cover shadow-[var(--shadow-lift)]"
          />
          <div className="absolute -bottom-6 -right-4 hidden rounded-lg bg-primary px-6 py-4 text-primary-foreground shadow-[var(--shadow-lift)] sm:block">
            <p className="font-display text-2xl">Rohi</p>
            <p className="text-xs tracking-[0.18em] uppercase opacity-80">Cholistan</p>
          </div>
        </div>

        <div>
          <p className="eyebrow">About the Farm</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">{settings.about_title}</h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {settings.about_description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="rounded-lg border border-border bg-card p-4">
                <pillar.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-display text-lg">{pillar.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
