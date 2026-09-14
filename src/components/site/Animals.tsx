import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import bullsImg from "@/assets/bulls.jpg";
import sheepImg from "@/assets/sheep.jpg";
import goatsImg from "@/assets/goats.jpg";
import { mediaUrl, whatsappHref, type SiteSettings } from "@/lib/site";
import type { Animal, AnimalCard, Breed } from "@/lib/queries";

const DEFAULT_CARD_IMAGES: Record<string, string> = {
  "Bulls / Cattle": bullsImg,
  Sheep: sheepImg,
  Goats: goatsImg,
};

function availabilityVariant(availability: string) {
  if (availability === "Available") return "default" as const;
  if (availability === "Reserved") return "secondary" as const;
  return "outline" as const;
}

export function Animals({
  settings,
  breeds,
  animals,
  cards,
}: {
  settings: SiteSettings;
  breeds: Breed[];
  animals: Animal[];
  cards: AnimalCard[];
}) {
  return (
    <section id="animals" className="scroll-mt-20 bg-secondary/40 py-24 md:py-32">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Selected from the Rohi</p>
          <h2 className="mt-3 font-display text-4xl leading-[0.95] md:text-6xl">{settings.animals_title}</h2>
          <p className="mt-4 text-muted-foreground">{settings.animals_description}</p>
          <Button asChild variant="outline" className="mt-5">
            <Link to="/animals/">Browse all animals</Link>
          </Button>
        </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((card) => {
            const categoryBreeds = breeds.filter((breed) => breed.category === card.category);
            const image =
              mediaUrl(card.image_url) ?? DEFAULT_CARD_IMAGES[card.category] ?? bullsImg;
            return (
              <article
                key={card.id}
                className="group overflow-hidden border border-border bg-card shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]"
              >
                <img
                  src={image}
                  alt={card.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="p-6">
                  <h3 className="font-display text-2xl">{card.title}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {categoryBreeds.map((breed) => (
                      <li key={breed.id}>
                        <Badge variant="secondary">{breed.name}</Badge>
                      </li>
                    ))}
                  </ul>
                  {card.description && (
                    <p className="mt-4 text-sm text-muted-foreground">{card.description}</p>
                  )}
                  <Button asChild className="mt-5 w-full">
                    <a
                      href={whatsappHref(
                        settings.whatsapp,
                        `Assalam-o-Alaikum, I would like to inquire about ${card.title.toLowerCase()} at ${settings.farm_name}.`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle /> {card.cta_label}
                    </a>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {animals.length > 0 && (
          <div className="mt-16">
            <h3 className="font-display text-2xl">Current Listings</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {animals.map((animal) => {
                const photo = mediaUrl(animal.photos?.[0]);
                return (
                  <article
                    key={animal.id}
                    className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-soft)]"
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt={animal.title}
                        loading="lazy"
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-48 w-full place-items-center bg-muted text-sm text-muted-foreground">
                        Photo coming soon
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-display text-xl">{animal.title}</h4>
                        <Badge variant={availabilityVariant(animal.availability)}>
                          {animal.availability}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {[animal.category, animal.breed, animal.gender, animal.purpose]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {animal.description && (
                        <p className="mt-3 text-sm text-foreground/80">{animal.description}</p>
                      )}
                      {animal.price != null && (
                        <p className="mt-3 font-display text-lg">
                          PKR {Number(animal.price).toLocaleString("en-PK")}
                        </p>
                      )}
                      <div className="mt-4 grid gap-2">
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/animals/$animalId" params={{ animalId: animal.id }}>View details</Link>
                        </Button>
                        <Button
                          asChild
                          variant={animal.availability === "Available" ? "default" : "outline"}
                          className="w-full"
                        >
                        <a
                          href={whatsappHref(
                            settings.whatsapp,
                            `Assalam-o-Alaikum, I would like to inquire about "${animal.title}" at ${settings.farm_name}.`,
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle />
                          {animal.availability === "Available" ? "Inquire" : "Ask About Similar"}
                        </a>
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
