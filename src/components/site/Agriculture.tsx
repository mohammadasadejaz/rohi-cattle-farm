import { Sprout, Wheat, HeartHandshake } from "lucide-react";

import fieldsFallback from "@/assets/sheep.jpg";
import { mediaUrl, type SiteSettings } from "@/lib/site";

export function Agriculture({ settings }: { settings?: SiteSettings | null }) {
  const eyebrow = settings?.agriculture_eyebrow || "Grown on our own land";
  const title = settings?.agriculture_title || "The animals eat what we grow";
  const description =
    settings?.agriculture_description ||
    "Their feed comes from our own fields in the Cholistan, cut fresh and brought in through the year. Nothing artificial goes into them, and nothing is rushed to put on weight quickly. They are raised slowly, on clean water and open ground, with the same care you would give your own herd.";
  const image = mediaUrl(settings?.agriculture_image_url) ?? fieldsFallback;

  const points = [
    {
      icon: Wheat,
      title: settings?.agriculture_point1_title || "Our Own Fields",
      text: settings?.agriculture_point1_text || "Fodder is grown on our own land and cut fresh through the year.",
    },
    {
      icon: Sprout,
      title: settings?.agriculture_point2_title || "Nothing Artificial",
      text: settings?.agriculture_point2_text || "No artificial feed and no shortcuts taken to put on weight quickly.",
    },
    {
      icon: HeartHandshake,
      title: settings?.agriculture_point3_title || "Raised With Care",
      text: settings?.agriculture_point3_text || "Open ground, clean water, and patient day-to-day attention.",
    },
  ];

  return (
    <section id="our-fields" className="section-shell scroll-mt-20 py-24 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative lg:pr-8">
          <img
            src={image}
            alt="Animals grazing on the farm's own land"
            loading="lazy"
            width={1400}
            height={900}
            className="aspect-[4/3] w-full object-cover shadow-[var(--shadow-lift)]"
          />
        </div>

        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 max-w-lg font-display text-4xl leading-[0.95] md:text-6xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground whitespace-pre-line">
            {description}
          </p>

          <div className="mt-10 grid gap-0 border-y border-border sm:grid-cols-3">
            {points.map((point) => (
              <div
                key={point.title}
                className="border-b border-border py-5 last:border-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-0"
              >
                <point.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-display text-xl">{point.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

