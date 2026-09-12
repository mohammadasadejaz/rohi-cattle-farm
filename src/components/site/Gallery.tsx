import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

export function Gallery({ images }: { images: GalleryImage[] }) {
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
    <section id="gallery" className="scroll-mt-20 bg-secondary/40 py-24 md:py-32">
      <div className="section-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">04 / The atmosphere</p>
            <h2 className="mt-3 font-display text-5xl leading-[0.86] md:text-7xl">A life lived outdoors.</h2>
            {images.length === 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                Sample imagery shown — real farm photographs will replace these once uploaded.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
          {visible.map((item, index) =>
            item.isVideo ? (
              <figure
                key={`${item.src}-${index}`}
                className="overflow-hidden border border-border bg-card/80 shadow-[var(--shadow-soft)] backdrop-blur-sm lg:col-span-4"
              >
                <video
                  src={item.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-56 w-full bg-black object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">{item.caption}</figcaption>
              </figure>
            ) : (
              <button
                key={`${item.src}-${index}`}
                type="button"
                onClick={() => setActive(item)}
                className={`group overflow-hidden border border-border bg-card/80 text-left shadow-[var(--shadow-soft)] backdrop-blur-sm lg:col-span-${index % 3 === 0 ? "6" : "3"}`}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <p className="px-4 py-3 text-sm text-muted-foreground">{item.caption}</p>
              </button>
            ),
          )}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="flex items-center gap-2 font-display text-lg">
            {active?.isVideo && <Play className="h-4 w-4" />}
            {active?.caption}
          </DialogTitle>
          {active && (
            <img src={active.src} alt={active.caption} className="w-full rounded-md object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
