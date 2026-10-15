import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Sprout,
  Wheat,
  HeartHandshake,
  Beef,
  Dna,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { getPublicSiteData } from "@/lib/public-data-browser";
import {
  SITE_URL,
  telHref,
  whatsappHref,
  mediaUrl,
  availabilityVariant,
  isSold,
  withSoldLast,
  type SiteSettings,
} from "@/lib/site";
import type { Animal, AnimalCard, Breed } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimalPhoto } from "@/components/site/AnimalPhoto";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Services } from "@/components/site/Services";
import { Gallery } from "@/components/site/Gallery";
import { BookingForm } from "@/components/site/BookingForm";
import { ContactLocation } from "@/components/site/ContactLocation";
import { SiteFooter } from "@/components/site/SiteFooter";

import heroFallback from "@/assets/hero-cattle.jpg";
import aboutFallback from "@/assets/cholistan.jpg";
import fieldsFallback from "@/assets/sheep.jpg";
import embryoFallback from "@/assets/bulls.jpg";
import bullsImg from "@/assets/bulls.jpg";
import sheepImg from "@/assets/sheep.jpg";
import goatsImg from "@/assets/goats.jpg";

export const Route = createFileRoute("/redesign")({
  head: () => ({
    meta: [
      { title: "Redesign Preview | Iqbal Cattle Farm (Rohi)" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RedesignPage,
});

const DEFAULT_CARD_IMAGES: Record<string, string> = {
  "Bulls / Cattle": bullsImg,
  Sheep: sheepImg,
  Goats: goatsImg,
};

function RedesignPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["site-data"],
    queryFn: getPublicSiteData,
    staleTime: 30_000,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Loading Redesign Preview...
      </div>
    );
  }

  if (error || !data || !data.settings) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center text-muted-foreground">
        Could not load site data.
      </div>
    );
  }

  const settings = data.settings as SiteSettings;
  const animals = (data.animals ?? []) as Animal[];
  const breeds = (data.breeds ?? []) as Breed[];
  const cards = (data.animalCards ?? []) as AnimalCard[];

  // Filter listings
  const filteredAnimals =
    selectedCategory === "All"
      ? animals
      : animals.filter((a) => a.category.toLowerCase().includes(selectedCategory.toLowerCase()));
  const sortedListings = withSoldLast(filteredAnimals);

  const heroImg = mediaUrl(settings.hero_image_url) ?? heroFallback;
  const aboutImg = mediaUrl(settings.about_image_url) ?? aboutFallback;
  const agriImg = mediaUrl(settings.agriculture_image_url) ?? fieldsFallback;
  const embryoImg = mediaUrl(settings.embryo_image_url) ?? embryoFallback;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* PREVIEW BANNER */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/20 bg-primary/95 px-4 py-2 text-xs font-medium text-primary-foreground backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-amber-300" />
          <span>
            <strong>Redesign Prototype:</strong> Experience the clean, streamlined interface.
          </span>
        </div>
        <Link to="/" className="underline underline-offset-2 hover:opacity-80">
          Back to Live Site ↗
        </Link>
      </div>

      <SiteHeader settings={settings} />

      <main>
        {/* =========================================
            1. HERO SECTION (Refined, Modern, Impactful)
           ========================================= */}
        <section id="home" className="relative isolate min-h-[92svh] overflow-hidden bg-earth">
          <img
            src={heroImg}
            alt={`${settings.farm_name} livestock in Cholistan`}
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Subtle multi-stop gradient for superior text contrast without dark mud */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-radial-[at_center_center] from-transparent via-black/20 to-black/70 pointer-events-none" />

          <div className="section-shell relative flex min-h-[92svh] flex-col justify-end pb-16 pt-32 md:pb-24">
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wider uppercase text-amber-200 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                Est. {settings.established_year} · The Rohi, Bahawalpur
              </div>

              <h1 className="mt-6 font-display text-4xl leading-[0.96] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                {settings.hero_heading}
              </h1>

              <p className="mt-4 font-display text-xl italic text-white/90 sm:text-2xl md:text-3xl">
                {settings.slogan}
              </p>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                {settings.hero_description}
              </p>

              {/* STREAMLINED CTAs: 2 strong actions */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="h-12 px-7 text-base shadow-lg">
                  <a href="#animals">
                    {settings.hero_cta_primary || "Explore Livestock"} <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-emerald-500/50 bg-emerald-950/40 text-emerald-100 hover:bg-emerald-900/60 hover:text-white backdrop-blur-sm"
                >
                  <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5 text-emerald-400" /> WhatsApp Inquiry
                  </a>
                </Button>

                <a
                  href={telHref(settings.phone)}
                  className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors ml-1"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  <span>Call {settings.phone}</span>
                </a>
              </div>
            </div>

            {/* SLEEK STATS & HERITAGE PILLARS */}
            <div className="mt-14 grid grid-cols-1 gap-3 border-t border-white/15 pt-6 sm:grid-cols-3 sm:gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="font-display text-lg font-medium text-white">Rohi Cholistan Origin</p>
                  <p className="text-xs text-white/70">Purebred Cholistani cattle & desert livestock</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="font-display text-lg font-medium text-white">Natural Farm Fodder</p>
                  <p className="text-xs text-white/70">Fresh feed cut daily, zero artificial shortcuts</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="font-display text-lg font-medium text-white">Complete Animal Care</p>
                  <p className="text-xs text-white/70">Open grounds, vaccinated & vetted year-round</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            2. ABOUT SECTION (Editorial Magazine Style)
           ========================================= */}
        <section id="about" className="scroll-mt-20 py-24 md:py-32 bg-card">
          <div className="section-shell">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              {/* Photo on left with subtle depth */}
              <div className="relative lg:col-span-5">
                <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-lift)]">
                  <img
                    src={aboutImg}
                    alt="Cholistan landscape around Iqbal Cattle Farm"
                    loading="lazy"
                    width={1400}
                    height={900}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-5 -right-3 rounded-xl border border-border/80 bg-earth px-6 py-4 text-white shadow-xl">
                  <p className="font-display text-2xl leading-none">Rohi</p>
                  <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-amber-200/90 mt-1">
                    Cholistan Desert
                  </p>
                </div>
              </div>

              {/* Story on right */}
              <div className="lg:col-span-7 lg:pl-6">
                <span className="eyebrow">Our Heritage & Story</span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl leading-[1.05]">
                  {settings.about_title}
                </h2>
                <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                  {settings.about_description}
                </p>

                {/* 3 Value Pillars */}
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-border/70 bg-background/60 p-5 transition-colors hover:border-primary/40">
                    <Beef className="h-6 w-6 text-primary" />
                    <h3 className="mt-3 font-display text-lg font-semibold">Qurbani & Meat</h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Male animals raised patiently on natural fodder, primed for Qurbani.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-background/60 p-5 transition-colors hover:border-primary/40">
                    <Dna className="h-6 w-6 text-primary" />
                    <h3 className="mt-3 font-display text-lg font-semibold">Breeding Stock</h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Select females and genetics for healthy, resilient herds.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-background/60 p-5 transition-colors hover:border-primary/40">
                    <HeartHandshake className="h-6 w-6 text-primary" />
                    <h3 className="mt-3 font-display text-lg font-semibold">Animal Care</h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Clean desert air, open paddocks, and scheduled vaccination.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            3. LIVESTOCK SHOWCASE (Clean, Filterable, User-Friendly)
           ========================================= */}
        <section id="animals" className="scroll-mt-20 py-24 md:py-32 bg-secondary/30">
          <div className="section-shell">
            {/* Header + Integrated Availability Badge */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="eyebrow">Selected from the Rohi</span>
                <h2 className="mt-2 font-display text-3xl sm:text-5xl leading-[1.05]">
                  {settings.animals_title || "Animals at the Farm"}
                </h2>
                <p className="mt-3 text-base text-muted-foreground">
                  {settings.animals_description ||
                    "Cholistani cattle, sheep and goats raised on the farm."}
                </p>

                {/* INTEGRATED AVAILABILITY NOTICE (Replaces the awkward standalone box) */}
                <div className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-lg border border-primary/25 bg-primary/5 px-4 py-2.5 text-xs sm:text-sm text-foreground">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <strong>Availability:</strong> Males prepared for Qurbani & Meat · Females for
                    Breeding & Dairy.
                  </span>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {["All", "Bulls / Cattle", "Sheep", "Goats"].map((cat) => {
                  const label = cat === "Bulls / Cattle" ? "Bulls" : cat;
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        active
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animal Category Overview Cards */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {cards.map((card) => {
                const categoryBreeds = breeds.filter((b) => b.category === card.category);
                const image =
                  mediaUrl(card.image_url) ?? DEFAULT_CARD_IMAGES[card.category] ?? bullsImg;
                return (
                  <article
                    key={card.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-xl hover:border-primary/40"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={image}
                        alt={card.title}
                        loading="lazy"
                        width={1024}
                        height={768}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-xs uppercase tracking-wider text-amber-300 font-medium">
                          {card.category}
                        </span>
                        <h3 className="font-display text-2xl text-white mt-0.5">{card.title}</h3>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {categoryBreeds.map((breed) => (
                            <Badge key={breed.id} variant="secondary" className="text-[11px]">
                              {breed.name}
                            </Badge>
                          ))}
                        </div>
                        {card.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {card.description}
                          </p>
                        )}
                      </div>

                      <Button asChild className="mt-6 w-full" variant="outline">
                        <a
                          href={whatsappHref(
                            settings.whatsapp,
                            `Assalam-o-Alaikum, I would like to inquire about ${card.title} at ${settings.farm_name}.`,
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="mr-2 h-4 w-4" /> {card.cta_label || "Inquire"}
                        </a>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Individual Animal Listings (if any) */}
            {sortedListings.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-2xl font-medium">
                    Available Listings ({sortedListings.length})
                  </h3>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/animals/">View All Catalog ↗</Link>
                  </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedListings.slice(0, 6).map((animal) => {
                    const photo = mediaUrl(animal.photos?.[0]);
                    const sold = isSold(animal.availability);
                    return (
                      <article
                        key={animal.id}
                        className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
                      >
                        <AnimalPhoto
                          src={photo}
                          alt={animal.title}
                          sold={sold}
                          loading="lazy"
                          className="h-52 w-full"
                          stampClassName="text-lg px-4"
                        />
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-display text-xl font-semibold">{animal.title}</h4>
                            <Badge variant={availabilityVariant(animal.availability)}>
                              {animal.availability}
                            </Badge>
                          </div>

                          <p className="mt-2 text-xs text-muted-foreground">
                            {[animal.category, animal.breed, animal.gender, animal.purpose]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>

                          {animal.price && (
                            <p className="mt-3 font-display text-lg text-primary font-bold">
                              PKR {animal.price.toLocaleString()}
                            </p>
                          )}

                          {!sold && (
                            <Button asChild size="sm" className="mt-4 w-full">
                              <a
                                href={whatsappHref(
                                  settings.whatsapp,
                                  `Assalam-o-Alaikum, I am inquiring about "${animal.title}" listed on your website.`,
                                )}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp Inquire
                              </a>
                            </Button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================================
            4. AGRICULTURE & FIELDS SECTION (Warm, Natural, Elevated)
           ========================================= */}
        <section id="our-fields" className="scroll-mt-20 py-24 md:py-32 bg-card">
          <div className="section-shell">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <span className="eyebrow">
                  {settings.agriculture_eyebrow || "Grown on our own land"}
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">
                  {settings.agriculture_title || "The animals eat what we grow"}
                </h2>
                <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {settings.agriculture_description ||
                    "Their feed comes from our own fields in the Cholistan, cut fresh and brought in through the year. Nothing artificial goes into them."}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-border/80 bg-secondary/20 p-4">
                    <Wheat className="h-5 w-5 text-primary" />
                    <h3 className="mt-2 font-display text-base font-semibold">
                      {settings.agriculture_point1_title || "Our Own Fields"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {settings.agriculture_point1_text ||
                        "Fodder cut fresh through the year on our land."}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/80 bg-secondary/20 p-4">
                    <Sprout className="h-5 w-5 text-primary" />
                    <h3 className="mt-2 font-display text-base font-semibold">
                      {settings.agriculture_point2_title || "Nothing Artificial"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {settings.agriculture_point2_text || "No chemical hormones or quick weight hacks."}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/80 bg-secondary/20 p-4">
                    <HeartHandshake className="h-5 w-5 text-primary" />
                    <h3 className="mt-2 font-display text-base font-semibold">
                      {settings.agriculture_point3_title || "Raised With Care"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {settings.agriculture_point3_text || "Patient, day-to-day attention and clean water."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-lift)]">
                  <img
                    src={agriImg}
                    alt="Animals grazing in Cholistan fields"
                    loading="lazy"
                    width={1400}
                    height={900}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            5. EMBRYO TRANSFER SECTION (Modern Breeding & Genetics)
           ========================================= */}
        <section id="embryo-transfer" className="scroll-mt-20 py-24 md:py-32 bg-secondary/30">
          <div className="section-shell">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="order-2 lg:order-1 lg:col-span-6">
                <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-lift)]">
                  <img
                    src={embryoImg}
                    alt="Cholistani cattle raised through the farm's breeding programme"
                    loading="lazy"
                    width={1400}
                    height={900}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              <div className="order-1 lg:order-2 lg:col-span-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                  <Dna className="h-3.5 w-3.5" />
                  {settings.embryo_eyebrow || "Advanced Breeding"}
                </div>

                <h2 className="mt-4 font-display text-3xl sm:text-5xl leading-[1.05]">
                  {settings.embryo_title || "Embryo transfer for stronger Cholistani herds"}
                </h2>

                <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {settings.embryo_description ||
                    "Embryo transfer lets one outstanding cow produce far more calves than she could naturally. We collect embryos from proven Cholistani donors and place them in recipient cows."}
                </p>

                <Button asChild size="lg" className="mt-8">
                  <a
                    href={whatsappHref(
                      settings.whatsapp,
                      settings.embryo_whatsapp_message ||
                        "Assalam-o-Alaikum, I would like to know more about your embryo transfer services.",
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {settings.embryo_cta_text || "Ask About Embryo Transfer"}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            6. SERVICES
           ========================================= */}
        <Services settings={settings} services={data.services} />

        {/* =========================================
            7. GALLERY
           ========================================= */}
        <Gallery images={data.gallery} />

        {/* =========================================
            8. BOOKING FORM & CONTACT
           ========================================= */}
        <BookingForm settings={settings} breeds={data.breeds} />
        <ContactLocation settings={settings} />
      </main>

      <SiteFooter settings={settings} />
    </div>
  );
}
