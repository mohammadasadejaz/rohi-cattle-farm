import { cn } from "@/lib/utils";

/**
 * Listing photo with the sold treatment: the image fades back and a stamp sits
 * across it, so a sold animal still reads as part of the farm's record without
 * looking like something a buyer can still take.
 */
export function AnimalPhoto({
  src,
  alt,
  sold,
  className,
  imgClassName,
  stampClassName,
  loading,
}: {
  src: string | null;
  alt: string;
  sold: boolean;
  /** Sizing for the frame, e.g. "h-52 w-full". */
  className?: string;
  imgClassName?: string;
  stampClassName?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={cn("h-full w-full object-cover", sold && "opacity-60 grayscale", imgClassName)}
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-muted text-sm text-muted-foreground">
          Photo coming soon
        </div>
      )}
      {sold && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span
            className={cn(
              "-rotate-12 border-2 border-destructive bg-background/85 px-6 py-1.5 font-display text-2xl font-semibold uppercase tracking-[0.3em] text-destructive shadow-[var(--shadow-soft)]",
              stampClassName,
            )}
          >
            Sold
          </span>
        </div>
      )}
    </div>
  );
}
