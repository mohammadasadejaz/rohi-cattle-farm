import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Play } from "lucide-react";
import bullsImg from "@/assets/bulls.jpg";
import sheepImg from "@/assets/sheep.jpg";
import goatsImg from "@/assets/goats.jpg";
import cholistanImg from "@/assets/cholistan.jpg";
import heroImg from "@/assets/hero-cattle.jpg";
import { mediaUrl } from "@/lib/site";
import type { GalleryImage } from "@/lib/queries";

type Item = { src: string; caption: string; category: string; isVideo: boolean };

const PLACEHOLDERS: Item[] = [
  { src: heroImg, caption: "Cholistani cattle at sunset", category: "Bulls", isVideo: false },
  { src: bullsImg, caption: "Bull at the farm", category: "Bulls", isVideo: false },
  { src: sheepImg, caption: "Sheep flock", category: "Sheep", isVideo: false },
  { src: goatsImg, caption: "Goats at the farm", category: "Goats", isVideo: false },
  { src: cholistanImg, caption: "Cholistan surroundings", category: "Cholistan", isVideo: false },
];

export function LuxuryGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<Item | null>(null);
  const [filter, setFilter] = useState("All");

  const items: Item[] =
    images.length > 0
      ? images.map((image) => ({
          src: mediaUrl(image.image_url) ?? "",
          caption: image.caption ?? "Farm media",
          category: image.category,
          isVideo: (image as { media_type?: string }).media_type === "video",
        }))
      : PLACEHOLDERS;

  const hasVideos = items.some((item) => item.isVideo);
  const categories = [
    "All",
    ...(hasVideos ? ["Photos", "Videos"] : []),
    ...Array.from(new Set(items.map((item) => item.category))),
  ];

  const visible =
    filter === "All"
      ? items
      : filter === "Photos"
        ? items.filter((item) => !item.isVideo)
        : filter === "Videos"
          ? items.filter((item) => item.isVideo)
          : items.filter((item) => item.category === filter);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-[#09090b] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header & Interactive Filter Bar */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#c5a059]">
              <span className="h-px w-6 bg-[#c5a059]" />
              <span>06 / Visual Archive</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-white font-normal">
              Moments at the Farm
            </h2>
            <p className="mt-3 text-sm text-white/60 font-light">
              High-resolution glimpses into daily life, pedigree care, and seasonal pasture across our Cholistan estate.
            </p>
          </div>

          {/* Filter Pills with 100% visible, high-contrast text */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const isActive = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  className={`rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#c5a059] text-black font-semibold shadow-[0_0_15px_rgba(197,160,89,0.35)] scale-105"
                      : "border border-white/20 bg-[#16161c] text-white hover:border-[#c5a059]/60 hover:bg-[#202028] hover:text-[#e5c158]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Media Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, index) =>
            item.isVideo ? (
              <figure
                key={`${item.src}-${index}`}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#121216] shadow-xl transition-all hover:border-[#c5a059]/40"
              >
                <video
                  src={item.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-60 w-full bg-black object-cover"
                />
                <figcaption className="flex items-center justify-between p-4">
                  <span className="text-sm text-white/90 font-medium truncate">{item.caption}</span>
                  <span className="shrink-0 rounded border border-[#c5a059]/30 bg-[#c5a059]/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#d4af37]">
                    {item.category}
                  </span>
                </figcaption>
              </figure>
            ) : (
              <button
                key={`${item.src}-${index}`}
                type="button"
                onClick={() => setActive(item)}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#121216] text-left shadow-xl transition-all duration-300 hover:border-[#c5a059]/50 hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative h-60 w-full overflow-hidden bg-black/40">
                  <img
                    src={item.src}
                    alt={item.caption}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-white/90 font-medium truncate">{item.caption}</span>
                  <span className="shrink-0 rounded border border-[#c5a059]/30 bg-[#c5a059]/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#d4af37]">
                    {item.category}
                  </span>
                </div>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-4xl border border-white/15 bg-[#121216] p-6 text-white shadow-2xl sm:rounded-2xl">
          <DialogTitle className="flex items-center gap-2 font-serif text-lg text-white">
            {active?.isVideo && <Play className="h-4 w-4 text-[#d4af37]" />}
            {active?.caption}
          </DialogTitle>
          {active && (
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/60">
              <img src={active.src} alt={active.caption} className="max-h-[75vh] w-full object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
