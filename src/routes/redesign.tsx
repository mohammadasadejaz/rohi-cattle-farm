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
import { LuxuryBookingSection } from "@/components/site/LuxuryBookingSection";
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
      {
        title: "Iqbal Cattle Farm (Rohi) — Premium Livestock Sanctuary",
      },
      {
        name: "description",
        content:
          "Preserving pure Cholistani livestock lineages. Qurbani bulls, dairy stock, embryo transfer genetics and registered breeding herd in Yazman, Bahawalpur.",
      },
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
    queryKey: ["public-site-data"],
    queryFn: getPublicSiteData,
    staleTime: 30_000,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#fcfaf6] text-[#b07d37]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b07d37] border-t-transparent" />
          <p className="font-serif tracking-widest uppercase text-xs text-[#5c544d]">
            Welcome to Iqbal Cattle Farm...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data || !data.settings) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#fcfaf6] p-6 text-center text-[#5c544d]">
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
    <div className="min-h-screen bg-[#fcfaf6] text-[#1f1b18] antialiased selection:bg-[#b07d37]/20 selection:text-[#1f1b18]">
      {/* =========================================
          PROTOTYPE BANNER (Warm Calm Notice)
         ========================================= */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e4dacb] bg-[#f5eee3]/95 px-4 py-2 text-xs text-[#70665c] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Crown className="h-3.5 w-3.5 text-[#b07d37]" />
          <span>
            <strong>Warm & Calm Prototype:</strong> Warm Desert Sand & Organic Alabaster Edition.
          </span>
        </div>
        <Link to="/" className="text-[#9e7030] font-medium underline underline-offset-2 hover:text-[#1f1b18]">
          Return to Old Homepage ↗
        </Link>
      </div>

      {/* =========================================
          WARM & CALM FLOATING NAVBAR
         ========================================= */}
      <header className="sticky top-[33px] z-40 border-b border-[#e4dacb] bg-[#fcfaf6]/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* Logo / Brandmark */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-[#b07d37]/40 bg-[#f8f3eb] text-[#8e6022] shadow-sm transition-transform group-hover:scale-105">
              <span className="font-serif text-sm font-bold tracking-wider">ICF</span>
            </div>
            <div>
              <span className="block font-serif text-lg tracking-wide text-[#1f1b18] group-hover:text-[#b07d37] transition-colors">
                {settings.farm_name}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#9e7030] font-mono">
                Rohi Desert · Est. {settings.established_year}
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#about" className="text-xs uppercase tracking-[0.2em] text-[#5c544d] hover:text-[#b07d37] transition-colors font-medium">
              The Estate
            </a>
            <a href="#animals" className="text-xs uppercase tracking-[0.2em] text-[#5c544d] hover:text-[#b07d37] transition-colors font-medium">
              Collection
            </a>
            <a href="#agriculture" className="text-xs uppercase tracking-[0.2em] text-[#5c544d] hover:text-[#b07d37] transition-colors font-medium">
              Pastures
            </a>
            <a href="#embryo-transfer" className="text-xs uppercase tracking-[0.2em] text-[#5c544d] hover:text-[#b07d37] transition-colors font-medium">
              Genetics
            </a>
            <a href="#services" className="text-xs uppercase tracking-[0.2em] text-[#5c544d] hover:text-[#b07d37] transition-colors font-medium">
              Services
            </a>
            <a href="#booking" className="text-xs uppercase tracking-[0.2em] text-[#5c544d] hover:text-[#b07d37] transition-colors font-medium">
              Inquire
            </a>
          </nav>

          {/* Direct WhatsApp Button (Warm Sand & Camel) */}
          <div className="flex items-center gap-3">
            <a
              href={whatsappHref(settings.whatsapp, "Assalam-o-Alaikum, I would like to inquire regarding livestock and services at Iqbal Cattle Farm.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#d9ccbc] bg-white px-4 py-2 text-xs font-medium text-[#1f1b18] shadow-sm transition-all hover:border-[#b07d37] hover:bg-[#f8f3eb]"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#b07d37]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* =========================================
            HERO SECTION: High-End Heritage Estate (Warm Sunset)
           ========================================= */}
        <section id="home" className="relative min-h-[88svh] flex items-center justify-center overflow-hidden">
          {/* Hero Image with Warm Cinematic Vignette */}
          <img
            src={heroImg}
            alt={settings.farm_name}
            className="absolute inset-0 h-full w-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Warm dusk/golden hour gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf6] via-[#1f1b18]/70 to-[#1f1b18]/40" />

          <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center">
            {/* Hallmark Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#e5c158]" />
              <span className="font-serif text-xs tracking-[0.25em] uppercase text-[#f5eee3]">
                The Imperial Livestock of Cholistan
              </span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="mt-8 font-serif text-5xl font-normal leading-[1.05] tracking-tight text-white sm:text-7xl md:text-8xl">
              Where Heritage <br />
              <span className="italic text-[#e5c158]">Breeds Excellence.</span>
            </h1>

            {/* Slogan & Subtext */}
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-xl text-white/90 font-light leading-relaxed">
              {settings.slogan || "The Spirit of Cholistan, Delivered."}
            </p>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-[#e5c158]/95 tracking-wide font-mono uppercase">
              {settings.hero_description}
            </p>

            {/* High-Impact Actions */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#animals"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#b07d37] hover:bg-[#97692b] px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-semibold text-white shadow-lg transition-all hover:scale-[1.02]"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={whatsappHref(settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium text-white backdrop-blur-md transition-all hover:bg-black/60"
              >
                <MessageCircle className="h-4 w-4 text-[#e5c158]" />
                <span>WhatsApp Inquiry</span>
              </a>
            </div>

            {/* 3 Metric Cards with Warm Alabaster Glass */}
            <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6 border-t border-white/20 pt-8 text-left">
              <div className="rounded-2xl border border-[#e4dacb] bg-white/90 p-5 shadow-sm backdrop-blur-md">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#9e7030] font-mono font-medium">Pedigree</span>
                <p className="font-serif text-lg text-[#1f1b18] mt-1">Cholistani Bloodlines</p>
                <p className="text-xs text-[#5c544d] mt-0.5">Directly preserved in Tehsil Yazman</p>
              </div>

              <div className="rounded-2xl border border-[#e4dacb] bg-white/90 p-5 shadow-sm backdrop-blur-md">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#9e7030] font-mono font-medium">Feed</span>
                <p className="font-serif text-lg text-[#1f1b18] mt-1">100% Farm-Grown</p>
                <p className="text-xs text-[#5c544d] mt-0.5">Natural fodder cut fresh daily</p>
              </div>

              <div className="rounded-2xl border border-[#e4dacb] bg-white/90 p-5 shadow-sm backdrop-blur-md">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#9e7030] font-mono font-medium">Standards</span>
                <p className="font-serif text-lg text-[#1f1b18] mt-1">Ethical Husbandry</p>
                <p className="text-xs text-[#5c544d] mt-0.5">Year-round veterinarian protocol</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CHAPTER 01: THE HERITAGE (CLEAN & REFINED)
           ========================================= */}
        <section id="about" className="relative py-20 md:py-28 bg-[#fcfaf6] border-y border-[#e4dacb]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Column: Pure Landscape Photography */}
              <div className="overflow-hidden rounded-2xl border border-[#e4dacb] shadow-md">
                <img
                  src={aboutImg}
                  alt="Iqbal Cattle Farm Estate"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Right Column: Narrative & Minimalist Pillars */}
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#9e7030]">
                  <span className="h-px w-6 bg-[#9e7030]" />
                  <span>01 / The Heritage</span>
                </div>

                <h2 className="mt-4 font-serif text-3xl sm:text-5xl text-[#1f1b18] font-normal leading-tight">
                  {settings.about_title || "About Iqbal Cattle Farm"}
                </h2>

                <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#5c544d] font-light whitespace-pre-line">
                  {settings.about_description}
                </p>

                {/* Minimalist 3-Pillar Row */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 border-t border-[#e4dacb] pt-8">
                  <div>
                    <Beef className="h-5 w-5 text-[#b07d37]" />
                    <h3 className="mt-3 font-serif text-base text-[#1f1b18] font-medium">Qurbani & Meat</h3>
                    <p className="mt-1 text-xs text-[#70665c] leading-relaxed font-light">
                      Handpicked males fed slowly with zero chemical shortcuts.
                    </p>
                  </div>

                  <div className="sm:border-l sm:border-[#e4dacb] sm:pl-4">
                    <Dna className="h-5 w-5 text-[#b07d37]" />
                    <h3 className="mt-3 font-serif text-base text-[#1f1b18] font-medium">Purebred Lines</h3>
                    <p className="mt-1 text-xs text-[#70665c] leading-relaxed font-light">
                      Resilient genetics selected for desert hardiness & high milk yield.
                    </p>
                  </div>

                  <div className="sm:border-l sm:border-[#e4dacb] sm:pl-4">
                    <HeartHandshake className="h-5 w-5 text-[#b07d37]" />
                    <h3 className="mt-3 font-serif text-base text-[#1f1b18] font-medium">Ethical Care</h3>
                    <p className="mt-1 text-xs text-[#70665c] leading-relaxed font-light">
                      Continuous fresh water, open paddocks, and scheduled immunization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CHAPTER 02: THE LIVESTOCK COLLECTION (WARM SAND)
           ========================================= */}
        <section id="animals" className="relative py-24 md:py-32 bg-[#f5eee3]">
          <div className="mx-auto max-w-7xl px-6">
            {/* Header + Integrated Protocol Pill */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#9e7030]">
                  <span className="h-px w-6 bg-[#9e7030]" />
                  <span>02 / The Collection</span>
                </div>
                <h2 className="mt-3 font-serif text-4xl sm:text-6xl text-[#1f1b18] font-normal">
                  {settings.animals_title || "Imperial Livestock Portfolio"}
                </h2>
                <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#5c544d] font-light">
                  {settings.animals_description ||
                    "Cholistani cattle, sheep and goats raised on the farm. Contact us for current availability and acquisition."}
                </p>

                {/* Integrated Protocol Banner (Warm Sand / Caramel) */}
                <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-[#e4dacb] bg-[#f8f3eb] px-4 py-2.5 text-xs text-[#8e6022]">
                  <ShieldCheck className="h-4 w-4 text-[#b07d37] shrink-0" />
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
                          ? "bg-[#b07d37] text-white font-bold shadow-sm"
                          : "border border-[#d9ccbc] bg-white text-[#5c544d] hover:border-[#b07d37] hover:text-[#1f1b18]"
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
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e4dacb] bg-white shadow-sm transition-all duration-300 hover:border-[#b07d37]/60 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="relative h-72 overflow-hidden bg-[#e9e1d5]">
                      <img
                        src={image}
                        alt={card.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full border border-white/30 bg-white/90 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#8e6022] backdrop-blur-md font-semibold">
                          {card.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-6 right-6">
                        <h3 className="font-serif text-2xl text-white drop-shadow-sm">{card.title}</h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {categoryBreeds.map((breed) => (
                            <span
                              key={breed.id}
                              className="rounded-md border border-[#e4dacb] bg-[#f8f5ee] px-2.5 py-1 text-[11px] text-[#5c544d] font-mono"
                            >
                              {breed.name}
                            </span>
                          ))}
                        </div>
                        {card.description && (
                          <p className="text-xs sm:text-sm text-[#5c544d] leading-relaxed font-light">
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
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9ccbc] bg-[#fcfaf6] py-3 text-xs uppercase tracking-wider font-semibold text-[#1f1b18] transition-all hover:bg-[#b07d37] hover:text-white hover:border-[#b07d37]"
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
              <div className="mt-20 border-t border-[#e4dacb] pt-16">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.25em] text-[#9e7030] font-mono">
                      Real-Time Inventory
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-[#1f1b18] mt-1">
                      Available Stock & Pedigrees
                    </h3>
                  </div>
                  <p className="text-xs text-[#70665c]">
                    Showing {sortedListings.length} registered specimens
                  </p>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedListings.map((animal) => {
                    const sold = isSold(animal.status);
                    return (
                      <article
                        key={animal.id}
                        className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e4dacb] bg-white transition-all shadow-sm duration-300 hover:shadow-xl hover:border-[#b07d37]/60 ${
                          sold ? "opacity-60" : ""
                        }`}
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e9e1d5]">
                          <AnimalPhoto
                            photoUrl={animal.photo_url}
                            alt={animal.title}
                            category={animal.category}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-3 right-3">
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-medium tracking-wide uppercase font-mono shadow-sm ${
                                sold
                                  ? "bg-stone-200 text-stone-600"
                                  : "bg-[#f8f3eb] text-[#8e6022] border border-[#e4dacb]"
                              }`}
                            >
                              {animal.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-baseline justify-between gap-2">
                            <h4 className="font-serif text-xl text-[#1f1b18] font-normal">{animal.title}</h4>
                            {animal.price && (
                              <span className="font-serif text-lg font-medium text-[#1f1b18]">
                                PKR {Number(animal.price).toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-[#70665c] font-mono">
                            {animal.breed && (
                              <span className="rounded bg-[#f8f5ee] border border-[#e4dacb] px-2 py-0.5">
                                {animal.breed}
                              </span>
                            )}
                            {animal.weight && (
                              <span className="rounded bg-[#f8f5ee] border border-[#e4dacb] px-2 py-0.5">
                                {animal.weight}
                              </span>
                            )}
                            {animal.age && (
                              <span className="rounded bg-[#f8f5ee] border border-[#e4dacb] px-2 py-0.5">
                                {animal.age}
                              </span>
                            )}
                          </div>

                          {animal.description && (
                            <p className="mt-3 text-xs text-[#5c544d] line-clamp-2 font-light">
                              {animal.description}
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
                              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#b07d37] hover:bg-[#97692b] py-2.5 text-xs font-semibold text-white transition-all shadow-sm"
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
            CHAPTER 03: NATURAL AGRICULTURE & PASTURES
           ========================================= */}
        <section id="agriculture" className="relative py-24 md:py-32 bg-[#fcfaf6] border-t border-[#e4dacb]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-16 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#9e7030]">
                  <span className="h-px w-6 bg-[#9e7030]" />
                  <span>03 / Pure Sustenance</span>
                </div>

                <h2 className="mt-4 font-serif text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.08] text-[#1f1b18]">
                  {settings.agriculture_title || "Our Agriculture & Natural Pastures"}
                </h2>

                <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#5c544d] font-light whitespace-pre-line">
                  {settings.agriculture_description}
                </p>

                {/* 3 Pillar Cards for Agriculture */}
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#e4dacb] bg-white p-5 shadow-sm">
                    <Wheat className="h-5 w-5 text-[#b07d37]" />
                    <h3 className="mt-3 font-serif text-lg text-[#1f1b18]">
                      {settings.agriculture_point1_title || "Homegrown Fodder"}
                    </h3>
                    <p className="mt-1 text-xs text-[#70665c] leading-relaxed font-light">
                      {settings.agriculture_point1_text ||
                        "Alfalfa, sorghum and seasonal green feed cultivated right here."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e4dacb] bg-white p-5 shadow-sm">
                    <Sprout className="h-5 w-5 text-[#b07d37]" />
                    <h3 className="mt-3 font-serif text-lg text-[#1f1b18]">
                      {settings.agriculture_point2_title || "Pure & Organic"}
                    </h3>
                    <p className="mt-1 text-xs text-[#70665c] leading-relaxed font-light">
                      {settings.agriculture_point2_text ||
                        "Zero artificial feed or unnatural growth shortcuts."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e4dacb] bg-white p-5 shadow-sm">
                    <HeartHandshake className="h-5 w-5 text-[#b07d37]" />
                    <h3 className="mt-3 font-serif text-lg text-[#1f1b18]">
                      {settings.agriculture_point3_title || "Patience & Care"}
                    </h3>
                    <p className="mt-1 text-xs text-[#70665c] leading-relaxed font-light">
                      {settings.agriculture_point3_text ||
                        "Raised slowly on clean water and open desert ground."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-3xl border border-[#e4dacb] shadow-md">
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
        <section id="embryo-transfer" className="relative py-24 md:py-32 bg-[#f5eee3]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#e4dacb] bg-white p-8 sm:p-14 lg:p-16 shadow-md">
              <div className="grid items-center gap-12 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#e4dacb] bg-[#f8f3eb] px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-[#8e6022]">
                    <Dna className="h-3.5 w-3.5" />
                    <span>{settings.embryo_eyebrow || "Advanced Reproductive Biotechnology"}</span>
                  </div>

                  <h2 className="mt-6 font-serif text-3xl sm:text-5xl md:text-6xl text-[#1f1b18] font-normal leading-[1.08]">
                    {settings.embryo_title || "Embryo Transfer for Superior Cholistani Lineages"}
                  </h2>

                  <p className="mt-6 text-base sm:text-lg text-[#5c544d] font-light leading-relaxed whitespace-pre-line">
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
                      className="inline-flex items-center gap-2 rounded-full bg-[#b07d37] hover:bg-[#97692b] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white transition-all shadow-md"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{settings.embryo_cta_text || "Consult on Embryo Transfer"}</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="overflow-hidden rounded-2xl border border-[#e4dacb] shadow-md">
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
        <section id="services" className="py-24 md:py-32 bg-[#fcfaf6] border-t border-[#e4dacb]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#9e7030]">
                <span className="h-px w-6 bg-[#9e7030]" />
                <span>05 / Farm Services</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-[#1f1b18] font-normal">
                Comprehensive Farm Services
              </h2>
              <p className="mt-3 text-[#5c544d] font-light text-sm sm:text-base">
                From advance Qurbani booking to specialized veterinary protocols and regional delivery.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const img = mediaUrl(service.image_url);
                return (
                  <article
                    key={service.id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e4dacb] bg-white p-6 transition-all hover:border-[#b07d37]/50 shadow-sm hover:shadow-md"
                  >
                    <div>
                      {img && (
                        <img
                          src={img}
                          alt={service.title}
                          className="mb-5 h-44 w-full rounded-xl object-cover"
                        />
                      )}
                      <h3 className="font-serif text-2xl text-[#1f1b18]">{service.title}</h3>
                      <p className="mt-3 text-xs sm:text-sm text-[#5c544d] leading-relaxed font-light">
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
                        className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#9e7030] font-semibold hover:text-[#1f1b18]"
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
            CHAPTER 06: VISUAL ARCHIVE / GALLERY (WARM SAND)
           ========================================= */}
        <LuxuryGallery images={gallery} />

        {/* =========================================
            CHAPTER 07: PRIVATE INQUIRY & LOCATION (WARM ALABASTER)
           ========================================= */}
        <LuxuryBookingSection settings={settings} breeds={breeds} />
      </main>

      {/* =========================================
          WARM CALM ESTATE FOOTER (Deep Earth / Espresso)
         ========================================= */}
      <footer className="border-t border-[#302a24] bg-[#1c1815] py-16 text-[#d9cfc4]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-serif text-2xl text-white">{settings.farm_name}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-[#e5c158] font-mono">
                Est. {settings.established_year} · Cholistan, Pakistan
              </p>
              <p className="mt-4 text-xs text-[#a89d91] leading-relaxed">
                {settings.slogan}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-white font-mono mb-3">Sections</p>
              <ul className="space-y-2 text-xs">
                <li><a href="#about" className="hover:text-[#e5c158] transition-colors">The Estate Heritage</a></li>
                <li><a href="#animals" className="hover:text-[#e5c158] transition-colors">Imperial Collection</a></li>
                <li><a href="#agriculture" className="hover:text-[#e5c158] transition-colors">Pastures & Fodder</a></li>
                <li><a href="#embryo-transfer" className="hover:text-[#e5c158] transition-colors">Embryo Genetics</a></li>
                <li><a href="#services" className="hover:text-[#e5c158] transition-colors">Services & Delivery</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-white font-mono mb-3">Direct Contact</p>
              <ul className="space-y-2 text-xs">
                <li><span className="text-[#a89d91]">{settings.contact_person}</span></li>
                <li><a href={telHref(settings.phone)} className="hover:text-[#e5c158] transition-colors">{settings.phone}</a></li>
                {settings.email && <li><a href={`mailto:${settings.email}`} className="hover:text-[#e5c158] transition-colors">{settings.email}</a></li>}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-white font-mono mb-3">Sanctuary Location</p>
              <p className="text-xs text-[#a89d91] leading-relaxed">
                {settings.address}
              </p>
              <div className="mt-4">
                <Link to="/admin" className="text-[11px] text-[#e5c158] hover:underline">
                  Estate Admin Portal ↗
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#302a24] pt-8 text-xs text-[#877c70] sm:flex-row">
            <p>© {new Date().getFullYear()} {settings.farm_name}. All rights reserved.</p>
            <p className="text-[11px] font-mono">Preserving Rohi Bloodlines in Yazman, Bahawalpur</p>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Quick Actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-px border-t border-[#e4dacb] bg-[#e4dacb] sm:hidden">
        <a
          href={telHref(settings.phone)}
          className="flex items-center justify-center gap-2 bg-white py-3.5 text-xs font-semibold uppercase tracking-wider text-[#1f1b18]"
        >
          <Phone className="h-4 w-4 text-[#b07d37]" /> Call Estate
        </a>
        <a
          href={whatsappHref(settings.whatsapp)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-[#b07d37] py-3.5 text-xs font-semibold uppercase tracking-wider text-white"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
