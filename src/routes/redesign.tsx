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
  MapPin,
  ArrowUpRight,
  Award,
  Crown,
  ChevronRight,
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
import type { Animal, AnimalCard, Breed, Service, GalleryImage } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimalPhoto } from "@/components/site/AnimalPhoto";
import { BookingForm } from "@/components/site/BookingForm";
import { LuxuryGallery } from "@/components/site/LuxuryGallery";

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
      { title: "Iqbal Cattle Farm (Rohi) | Ultra-Premium Livestock Estate" },
      { name: "description", content: "Premier Cholistani cattle estate, ethical breeding, and elite livestock in Bahawalpur." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LuxuryRedesignPage,
});

const DEFAULT_CARD_IMAGES: Record<string, string> = {
  "Bulls / Cattle": bullsImg,
  Sheep: sheepImg,
  Goats: goatsImg,
};

function LuxuryRedesignPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["site-data"],
    queryFn: getPublicSiteData,
    staleTime: 30_000,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#09090b] text-[#d4af37]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#d4af37] border-t-transparent" />
          <p className="font-serif tracking-widest uppercase text-xs text-white/70">
            Entering The Estate...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data || !data.settings) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#09090b] p-6 text-center text-white/70">
        <p>Could not connect to the farm registry. Please refresh.</p>
      </div>
    );
  }

  const settings = data.settings as SiteSettings;
  const animals = (data.animals ?? []) as Animal[];
  const breeds = (data.breeds ?? []) as Breed[];
  const cards = (data.animalCards ?? []) as AnimalCard[];
  const services = (data.services ?? []) as Service[];
  const gallery = (data.gallery ?? []) as GalleryImage[];

  const filteredAnimals =
    selectedCategory === "All"
      ? animals
      : animals.filter((a) =>
          (a.category || "").toLowerCase().includes(selectedCategory.toLowerCase()),
        );
  const sortedListings = withSoldLast(filteredAnimals);

  const heroImg = mediaUrl(settings.hero_image_url) ?? heroFallback;
  const aboutImg = mediaUrl(settings.about_image_url) ?? aboutFallback;
  const agriImg = mediaUrl(settings.agriculture_image_url) ?? fieldsFallback;
  const embryoImg = mediaUrl(settings.embryo_image_url) ?? embryoFallback;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4efe6] selection:bg-[#c5a059] selection:text-black font-sans">
      {/* =========================================
          PROTOTYPE BANNER (Discrete Top Pill)
         ========================================= */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-[#c5a059]/30 bg-[#09090b]/95 px-4 py-2 text-xs text-[#e8d5b5] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Crown className="h-3.5 w-3.5 text-[#d4af37]" />
          <span>
            <strong>Ultra-Premium Overhaul Prototype:</strong> Obsidian & Imperial Gold Edition.
          </span>
        </div>
        <Link to="/" className="text-[#d4af37] underline underline-offset-2 hover:text-white">
          Return to Old Homepage ↗
        </Link>
      </div>

      {/* =========================================
          LUXURY FLOATING NAVBAR
         ========================================= */}
      <header className="sticky top-[33px] z-40 border-b border-white/10 bg-[#0e0e12]/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* Logo / Brandmark */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-[#c5a059]/60 bg-gradient-to-br from-[#c5a059]/25 to-black text-[#d4af37] shadow-inner transition-transform group-hover:scale-105">
              <span className="font-serif text-sm font-bold tracking-wider">ICF</span>
            </div>
            <div>
              <span className="block font-serif text-lg tracking-wide text-white group-hover:text-[#d4af37] transition-colors">
                {settings.farm_name}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.28em] text-[#c5a059]">
                Rohi Desert · Est. {settings.established_year}
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#about" className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#d4af37] transition-colors">
              The Estate
            </a>
            <a href="#animals" className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#d4af37] transition-colors">
              Collection
            </a>
            <a href="#agriculture" className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#d4af37] transition-colors">
              Pastures
            </a>
            <a href="#embryo-transfer" className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#d4af37] transition-colors">
              Genetics
            </a>
            <a href="#services" className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#d4af37] transition-colors">
              Services
            </a>
            <a href="#booking" className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#d4af37] transition-colors">
              Inquire
            </a>
          </nav>

          {/* Direct WhatsApp Button (Gold / Obsidian) */}
          <div className="flex items-center gap-3">
            <a
              href={whatsappHref(settings.whatsapp, "Assalam-o-Alaikum, I would like to inquire regarding livestock and services at Iqbal Cattle Farm.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#c5a059]/50 bg-[#1a1712] px-4 py-2 text-xs font-medium text-[#e5c158] shadow-[0_0_15px_rgba(197,160,89,0.15)] transition-all hover:border-[#c5a059] hover:bg-[#c5a059] hover:text-black"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* =========================================
            HERO SECTION: High-End Heritage Estate
           ========================================= */}
        <section id="home" className="relative min-h-[90svh] flex items-center justify-center overflow-hidden">
          {/* Hero Image with Cinematic Vignette */}
          <img
            src={heroImg}
            alt={settings.farm_name}
            className="absolute inset-0 h-full w-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/75 to-[#09090b]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#09090b_85%)]" />

          <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center">
            {/* Hallmark Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#c5a059]/40 bg-[#121216]/90 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
              <span className="font-serif text-xs tracking-[0.25em] uppercase text-[#e5c158]">
                The Imperial Livestock of Cholistan
              </span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="mt-8 font-serif text-5xl font-normal leading-[1.05] tracking-tight text-white sm:text-7xl md:text-8xl">
              Where Heritage <br />
              <span className="italic text-[#e5c158]">Breeds Excellence.</span>
            </h1>

            {/* Slogan & Subtext */}
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-xl text-white/80 font-light leading-relaxed">
              {settings.slogan || "The Spirit of Cholistan, Delivered."}
            </p>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-[#c5a059]/90 tracking-wide font-mono uppercase">
              {settings.hero_description}
            </p>

            {/* High-Impact Actions */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#animals"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#c5a059] to-[#dfc17b] px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-semibold text-black shadow-[0_10px_25px_rgba(197,160,89,0.3)] transition-all hover:brightness-110 hover:scale-[1.02]"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={whatsappHref(settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium text-white backdrop-blur-md transition-all hover:border-[#c5a059] hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4 text-[#d4af37]" />
                <span>WhatsApp Inquiry</span>
              </a>
            </div>

            {/* 3 Metric Cards */}
            <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6 border-t border-white/10 pt-8 text-left">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#c5a059] font-mono">Pedigree</span>
                <p className="font-serif text-lg text-white mt-1">Cholistani Bloodlines</p>
                <p className="text-xs text-white/60 mt-0.5">Directly preserved in Tehsil Yazman</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#c5a059] font-mono">Feed</span>
                <p className="font-serif text-lg text-white mt-1">100% Farm-Grown</p>
                <p className="text-xs text-white/60 mt-0.5">Natural fodder cut fresh daily</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#c5a059] font-mono">Standards</span>
                <p className="font-serif text-lg text-white mt-1">Ethical Husbandry</p>
                <p className="text-xs text-white/60 mt-0.5">Year-round veterinarian protocol</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CHAPTER 01: THE HERITAGE (CLEAN & REFINED)
           ========================================= */}
        <section id="about" className="relative py-20 md:py-28 bg-[#0e0e12] border-y border-white/5">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Column: Pure Landscape Photography */}
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <img
                  src={aboutImg}
                  alt="Iqbal Cattle Farm Estate"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Right Column: Narrative & Minimalist Pillars */}
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#c5a059]">
                  <span className="h-px w-6 bg-[#c5a059]" />
                  <span>01 / The Heritage</span>
                </div>

                <h2 className="mt-4 font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
                  {settings.about_title || "About Iqbal Cattle Farm"}
                </h2>

                <p className="mt-5 text-sm sm:text-base leading-relaxed text-white/70 font-light whitespace-pre-line">
                  {settings.about_description}
                </p>

                {/* Minimalist 3-Pillar Row */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 border-t border-white/10 pt-8">
                  <div>
                    <Beef className="h-5 w-5 text-[#d4af37]" />
                    <h3 className="mt-3 font-serif text-base text-white font-medium">Qurbani & Meat</h3>
                    <p className="mt-1 text-xs text-white/60 leading-relaxed font-light">
                      Handpicked males fed slowly with zero chemical shortcuts.
                    </p>
                  </div>

                  <div className="sm:border-l sm:border-white/10 sm:pl-4">
                    <Dna className="h-5 w-5 text-[#d4af37]" />
                    <h3 className="mt-3 font-serif text-base text-white font-medium">Purebred Lines</h3>
                    <p className="mt-1 text-xs text-white/60 leading-relaxed font-light">
                      Resilient genetics selected for desert hardiness & high milk yield.
                    </p>
                  </div>

                  <div className="sm:border-l sm:border-white/10 sm:pl-4">
                    <HeartHandshake className="h-5 w-5 text-[#d4af37]" />
                    <h3 className="mt-3 font-serif text-base text-white font-medium">Ethical Care</h3>
                    <p className="mt-1 text-xs text-white/60 leading-relaxed font-light">
                      Continuous fresh water, open paddocks, and scheduled immunization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CHAPTER 02: THE LIVESTOCK COLLECTION (PURE OBSIDIAN & GOLD)
           ========================================= */}
        <section id="animals" className="relative py-28 md:py-36 bg-[#09090b]">
          <div className="mx-auto max-w-7xl px-6">
            {/* Header + Integrated Protocol Pill */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#c5a059]">
                  <span className="h-px w-6 bg-[#c5a059]" />
                  <span>02 / The Collection</span>
                </div>
                <h2 className="mt-3 font-serif text-4xl sm:text-6xl text-white font-normal">
                  {settings.animals_title || "Imperial Livestock Portfolio"}
                </h2>
                <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/70 font-light">
                  {settings.animals_description ||
                    "Cholistani cattle, sheep and goats raised on the farm. Contact us for current availability and acquisition."}
                </p>

                {/* Integrated Protocol Banner (Warm Amber / Gold) */}
                <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-[#c5a059]/30 bg-[#151419] px-4 py-2.5 text-xs text-[#e8d5b5]">
                  <ShieldCheck className="h-4 w-4 text-[#d4af37] shrink-0" />
                  <span>
                    <strong>Acquisition Protocol:</strong> Males prepared for Qurbani & Meat · Females reserved for Breeding & Dairy.
                  </span>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {["All", "Bulls / Cattle", "Sheep", "Goats"].map((cat) => {
                  const label = cat === "Bulls / Cattle" ? "Bulls & Cattle" : cat;
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                        active
                          ? "bg-[#c5a059] text-black font-bold shadow-[0_0_15px_rgba(197,160,89,0.4)]"
                          : "border border-white/10 bg-[#141419] text-white/70 hover:border-[#c5a059]/50 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Overview Cards (Bulls, Sheep, Goats) */}
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {cards.map((card) => {
                const categoryBreeds = breeds.filter((b) => b.category === card.category);
                const image =
                  mediaUrl(card.image_url) ?? DEFAULT_CARD_IMAGES[card.category] ?? bullsImg;
                return (
                  <article
                    key={card.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#131318] transition-all duration-500 hover:border-[#c5a059]/70 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={image}
                        alt={card.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#131318] via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full border border-black/40 bg-black/60 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#d4af37] backdrop-blur-md">
                          {card.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-6 right-6">
                        <h3 className="font-serif text-2xl text-white">{card.title}</h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {categoryBreeds.map((breed) => (
                            <span
                              key={breed.id}
                              className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80 font-mono"
                            >
                              {breed.name}
                            </span>
                          ))}
                        </div>
                        {card.description && (
                          <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                            {card.description}
                          </p>
                        )}
                      </div>

                      <a
                        href={whatsappHref(
                          settings.whatsapp,
                          `Assalam-o-Alaikum, I am inquiring about ${card.title} at ${settings.farm_name}.`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-[#c5a059]/40 bg-[#1b1915] py-3 text-xs uppercase tracking-wider font-semibold text-[#e5c158] transition-all hover:bg-[#c5a059] hover:text-black"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{card.cta_label || "Inquire on WhatsApp"}</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Individual Live Animal Listings */}
            {sortedListings.length > 0 && (
              <div className="mt-20">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-serif text-2xl sm:text-3xl text-white">
                    Available Live Stock ({sortedListings.length})
                  </h3>
                  <Link
                    to="/animals"
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#c5a059] hover:text-white"
                  >
                    <span>View All Catalog</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedListings.map((animal) => {
                    const photo = mediaUrl(animal.photos?.[0]);
                    const sold = isSold(animal.availability);
                    return (
                      <article
                        key={animal.id}
                        className="group overflow-hidden rounded-2xl border border-white/10 bg-[#131318] transition-all hover:border-[#c5a059]/50 hover:shadow-xl"
                      >
                        <AnimalPhoto
                          src={photo}
                          alt={animal.title}
                          sold={sold}
                          loading="lazy"
                          className="h-56 w-full"
                          stampClassName="text-base px-4 font-serif"
                        />
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif text-xl text-white group-hover:text-[#d4af37] transition-colors">
                              {animal.title}
                            </h4>
                            <span
                              className={`rounded-md px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
                                sold
                                  ? "bg-red-950/50 text-red-300 border border-red-800/40"
                                  : animal.availability === "Reserved"
                                    ? "bg-amber-950/50 text-amber-300 border border-amber-800/40"
                                    : "bg-[#c5a059]/20 text-[#e5c158] border border-[#c5a059]/40"
                              }`}
                            >
                              {animal.availability}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-white/50 font-mono">
                            {[animal.category, animal.breed, animal.gender, animal.purpose]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>

                          {animal.price && (
                            <p className="mt-3 font-serif text-2xl font-bold text-[#e5c158]">
                              PKR {Number(animal.price).toLocaleString("en-PK")}
                            </p>
                          )}

                          {!sold && (
                            <a
                              href={whatsappHref(
                                settings.whatsapp,
                                `Assalam-o-Alaikum, I am inquiring about "${animal.title}" (PKR ${animal.price ? Number(animal.price).toLocaleString() : 'N/A'}) listed on your website.`,
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#dfc17b] py-2.5 text-xs font-semibold text-black transition-all hover:brightness-110 shadow-md"
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span>Inquire on WhatsApp</span>
                            </a>
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
            CHAPTER 03: SUSTENANCE & PASTURES (AGRICULTURE)
           ========================================= */}
        <section id="agriculture" className="relative py-28 md:py-36 bg-[#111116] border-y border-white/5">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-16 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#c5a059]">
                  <span className="h-px w-6 bg-[#c5a059]" />
                  <span>03 / Natural Sustenance</span>
                </div>

                <h2 className="mt-4 font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-white leading-[1.08]">
                  {settings.agriculture_title || "The animals eat what we grow"}
                </h2>

                <p className="mt-6 text-base sm:text-lg text-white/70 font-light leading-relaxed whitespace-pre-line">
                  {settings.agriculture_description ||
                    "Their feed comes from our own fields in the Cholistan, cut fresh and brought in through the year. Nothing artificial goes into them."}
                </p>

                {/* 3 Hallmark Cards */}
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#17171e] p-5">
                    <Wheat className="h-5 w-5 text-[#d4af37]" />
                    <h3 className="mt-3 font-serif text-lg text-white">
                      {settings.agriculture_point1_title || "Our Own Land"}
                    </h3>
                    <p className="mt-1 text-xs text-white/60 leading-relaxed font-light">
                      {settings.agriculture_point1_text ||
                        "Fodder is grown on our own land and harvested fresh."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#17171e] p-5">
                    <Sprout className="h-5 w-5 text-[#d4af37]" />
                    <h3 className="mt-3 font-serif text-lg text-white">
                      {settings.agriculture_point2_title || "Pure & Organic"}
                    </h3>
                    <p className="mt-1 text-xs text-white/60 leading-relaxed font-light">
                      {settings.agriculture_point2_text ||
                        "Zero artificial feed or unnatural growth shortcuts."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#17171e] p-5">
                    <HeartHandshake className="h-5 w-5 text-[#d4af37]" />
                    <h3 className="mt-3 font-serif text-lg text-white">
                      {settings.agriculture_point3_title || "Patience & Care"}
                    </h3>
                    <p className="mt-1 text-xs text-white/60 leading-relaxed font-light">
                      {settings.agriculture_point3_text ||
                        "Raised slowly on clean water and open desert ground."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-3xl border border-[#c5a059]/30 shadow-2xl">
                  <img
                    src={agriImg}
                    alt="Pastures and fodder fields"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CHAPTER 04: BIOTECHNOLOGY & EMBRYO TRANSFER
           ========================================= */}
        <section id="embryo-transfer" className="relative py-28 md:py-36 bg-[#09090b]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#c5a059]/30 bg-gradient-to-br from-[#18161f] via-[#121217] to-[#09090b] p-8 sm:p-14 lg:p-20 shadow-2xl">
              <div className="grid items-center gap-12 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                    <Dna className="h-3.5 w-3.5" />
                    <span>{settings.embryo_eyebrow || "Advanced Reproductive Biotechnology"}</span>
                  </div>

                  <h2 className="mt-6 font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal leading-[1.08]">
                    {settings.embryo_title || "Embryo Transfer for Superior Cholistani Lineages"}
                  </h2>

                  <p className="mt-6 text-base sm:text-lg text-white/70 font-light leading-relaxed whitespace-pre-line">
                    {settings.embryo_description ||
                      "Embryo transfer lets one outstanding cow produce far more calves than she could naturally. We collect embryos from proven Cholistani donors and place them in recipient cows, spreading superior genetics in a fraction of the time."}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      href={whatsappHref(
                        settings.whatsapp,
                        settings.embryo_whatsapp_message ||
                          "Assalam-o-Alaikum, I would like to consult with your breeding team regarding embryo transfer services.",
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c5a059] to-[#dfc17b] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-black transition-all hover:scale-[1.02] hover:brightness-110 shadow-lg"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{settings.embryo_cta_text || "Consult on Embryo Transfer"}</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                    <img
                      src={embryoImg}
                      alt="Embryo transfer breeding programme"
                      className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CHAPTER 05: ESTATE SERVICES
           ========================================= */}
        <section id="services" className="py-28 md:py-36 bg-[#111116] border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#c5a059]">
                <span className="h-px w-6 bg-[#c5a059]" />
                <span>05 / Farm Services</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-white font-normal">
                Comprehensive Farm Services
              </h2>
              <p className="mt-3 text-white/60 font-light text-sm sm:text-base">
                From advance Qurbani booking to specialized veterinary protocols and regional delivery.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const img = mediaUrl(service.image_url);
                return (
                  <article
                    key={service.id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#17171e] p-6 transition-all hover:border-[#c5a059]/50 hover:shadow-xl"
                  >
                    <div>
                      {img && (
                        <img
                          src={img}
                          alt={service.title}
                          className="mb-5 h-44 w-full rounded-xl object-cover"
                        />
                      )}
                      <h3 className="font-serif text-2xl text-white">{service.title}</h3>
                      <p className="mt-3 text-xs sm:text-sm text-white/60 leading-relaxed font-light">
                        {service.description}
                      </p>
                    </div>

                    {service.cta_label && (
                      <a
                        href={whatsappHref(
                          settings.whatsapp,
                          `Assalam-o-Alaikum, I would like to inquire about "${service.title}" at ${settings.farm_name}.`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#d4af37] hover:text-white"
                      >
                        <span>{service.cta_label}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================
            CHAPTER 06: VISUAL ARCHIVE / GALLERY
           ========================================= */}
        <LuxuryGallery images={gallery} />

        {/* =========================================
            CHAPTER 07: PRIVATE INQUIRY & LOCATION
           ========================================= */}
        <section id="booking" className="py-28 md:py-36 bg-[#111116] border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-16 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#c5a059]">
                  <span className="h-px w-6 bg-[#c5a059]" />
                  <span>07 / Acquisition Request</span>
                </div>
                <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-white font-normal">
                  Reserve Your Livestock
                </h2>
                <p className="mt-4 text-sm sm:text-base text-white/70 font-light leading-relaxed">
                  Submit your custom livestock request. The farm management will personally verify availability and discuss direct inspection or reservation.
                </p>

                <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-[#17171e] p-6 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#d4af37] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Farm Location</p>
                      <p className="text-white/60 text-xs mt-0.5">{settings.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                    <Phone className="h-5 w-5 text-[#d4af37] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Direct Line</p>
                      <a href={telHref(settings.phone)} className="text-xs text-[#d4af37] hover:underline">
                        {settings.phone} ({settings.contact_person})
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-white/10 bg-[#16161c] p-8 shadow-2xl">
                  <BookingForm settings={settings} breeds={breeds} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================
          LUXURY ESTATE FOOTER
         ========================================= */}
      <footer className="border-t border-white/10 bg-[#070709] py-16 text-white/70">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-serif text-2xl text-white">{settings.farm_name}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-[#c5a059]">
                Est. {settings.established_year} · Cholistan, Pakistan
              </p>
              <p className="mt-4 text-xs text-white/50 leading-relaxed">
                {settings.slogan}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-white font-mono mb-3">Sections</p>
              <ul className="space-y-2 text-xs">
                <li><a href="#about" className="hover:text-[#d4af37]">The Estate Heritage</a></li>
                <li><a href="#animals" className="hover:text-[#d4af37]">Imperial Collection</a></li>
                <li><a href="#agriculture" className="hover:text-[#d4af37]">Pastures & Fodder</a></li>
                <li><a href="#embryo-transfer" className="hover:text-[#d4af37]">Embryo Genetics</a></li>
                <li><a href="#services" className="hover:text-[#d4af37]">Services & Delivery</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-white font-mono mb-3">Direct Contact</p>
              <ul className="space-y-2 text-xs">
                <li><span>{settings.contact_person}</span></li>
                <li><a href={telHref(settings.phone)} className="hover:text-[#d4af37]">{settings.phone}</a></li>
                {settings.email && <li><a href={`mailto:${settings.email}`} className="hover:text-[#d4af37]">{settings.email}</a></li>}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-white font-mono mb-3">Sanctuary Location</p>
              <p className="text-xs text-white/50 leading-relaxed">
                {settings.address}
              </p>
              <div className="mt-4">
                <Link to="/admin" className="text-[11px] text-[#c5a059] hover:underline">
                  Estate Admin Portal ↗
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/5 pt-6 text-center text-xs text-white/40">
            © {new Date().getFullYear()} {settings.farm_name}. All rights reserved. Registered Livestock Estate.
          </div>
        </div>
      </footer>
    </div>
  );
}
