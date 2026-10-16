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
    <section id="gallery" className="py-24 md:py-32 bg-[#f5eee3] border-t border-[#e4dacb]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header & Interactive Filter Bar */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-[#e4dacb] pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#9e7030]">
              <span className="h-px w-6 bg-[#9e7030]" />
              <span>06 / Visual Archive</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-[#1f1b18] font-normal">
              Moments at the Farm
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5c544d] font-light">
              High-resolution glimpses into daily life, pedigree care, and seasonal pasture across our Cholistan estate.
            </p>
          </div>

          {/* Filter Pills with warm calm styling */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const isActive = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  className={`rounded-full px-5 py-2 text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#b07d37] text-white font-semibold shadow-sm"
                      : "border border-[#d9ccbc] bg-white text-[#5c544d] hover:border-[#b07d37] hover:text-[#1f1b18]"
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
                className="overflow-hidden rounded-2xl border border-[#e4dacb] bg-white shadow-sm transition-all hover:border-[#b07d37]/60 hover:shadow-md"
              >
                <video
                  src={item.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-60 w-full bg-[#1f1b18] object-cover"
                />
                <figcaption className="flex items-center justify-between p-4">
                  <span className="text-sm text-[#1f1b18] font-medium truncate">{item.caption}</span>
                  <span className="shrink-0 rounded border border-[#e4dacb] bg-[#f8f3eb] px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#8e6022]">
                    {item.category}
                  </span>
                </figcaption>
              </figure>
            ) : (
              <button
                key={`${item.src}-${index}`}
                type="button"
                onClick={() => setActive(item)}
                className="group overflow-hidden rounded-2xl border border-[#e4dacb] bg-white text-left shadow-sm transition-all duration-300 hover:border-[#b07d37]/60 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="relative h-60 w-full overflow-hidden bg-[#e9e1d5]">
                  <img
                    src={item.src}
                    alt={item.caption}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-[#1f1b18] font-medium truncate">{item.caption}</span>
                  <span className="shrink-0 rounded border border-[#e4dacb] bg-[#f8f3eb] px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#8e6022]">
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
        <DialogContent className="max-w-4xl border border-[#e4dacb] bg-[#fcfaf6] p-6 text-[#1f1b18] shadow-2xl sm:rounded-2xl">
          <DialogTitle className="flex items-center gap-2 font-serif text-lg text-[#1f1b18]">
            {active?.isVideo && <Play className="h-4 w-4 text-[#b07d37]" />}
            {active?.caption}
          </DialogTitle>
          {active && (
            <div className="mt-4 overflow-hidden rounded-xl border border-[#e4dacb] bg-black">
              <img src={active.src} alt={active.caption} className="max-h-[75vh] w-full object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
