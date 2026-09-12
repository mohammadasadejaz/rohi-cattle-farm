import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getPublicSiteData } from "@/lib/public-data-browser";
import { mediaUrl } from "@/lib/site";

export const Route = createFileRoute("/animals/")({
  component: AnimalsPage,
});

function AnimalsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["site-data"],
    queryFn: getPublicSiteData,
    staleTime: 30_000,
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");

  const animals = data?.animals ?? [];
  const categories = ["All", ...Array.from(new Set(animals.map((animal) => animal.category)))];
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return animals.filter((animal) => {
      const searchable = [animal.title, animal.category, animal.breed, animal.gender, animal.purpose]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        (!term || searchable.includes(term)) &&
        (category === "All" || animal.category === category) &&
        (availability === "All" || animal.availability === availability)
      );
    });
  }, [animals, availability, category, search]);

  if (isLoading) return <div className="grid min-h-screen place-items-center">Loading animals...</div>;
  if (error || !data) return <div className="grid min-h-screen place-items-center">Unable to load animals.</div>;

  return (
    <main className="min-h-screen bg-secondary/30 py-16">
      <div className="section-shell">
        <Link to="/" className="text-sm text-muted-foreground hover:underline">← Back to website</Link>
        <div className="mt-8 max-w-2xl">
          <p className="eyebrow">Farm listings</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Find your animal</h1>
          <p className="mt-4 text-muted-foreground">Browse current livestock and open a listing for full details.</p>
        </div>

        <div className="mt-10 grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_220px_180px]">
          <label className="relative block">
            <span className="sr-only">Search animals</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, breed, or purpose" />
          </label>
          <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
            {categories.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={availability} onChange={(event) => setAvailability(event.target.value)} aria-label="Filter by availability">
            {['All', 'Available', 'Reserved', 'Sold'].map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>

        <p className="mt-5 text-sm text-muted-foreground">{filtered.length} listing{filtered.length === 1 ? "" : "s"}</p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((animal) => {
            const image = mediaUrl(animal.photos?.[0]);
            return (
              <Link key={animal.id} to="/animals/$animalId" params={{ animalId: animal.id }} className="group overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)]">
                {image ? <img src={image} alt={animal.title} className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="grid h-52 place-items-center bg-muted text-sm text-muted-foreground">Photo coming soon</div>}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3"><h2 className="font-display text-xl">{animal.title}</h2><Badge>{animal.availability}</Badge></div>
                  <p className="mt-2 text-sm text-muted-foreground">{[animal.category, animal.breed, animal.purpose].filter(Boolean).join(" · ")}</p>
                  {animal.price != null && <p className="mt-4 font-display text-lg">PKR {Number(animal.price).toLocaleString("en-PK")}</p>}
                </div>
              </Link>
            );
          })}
        </div>
        {!filtered.length && <p className="mt-10 rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">No animals match those filters.</p>}
      </div>
    </main>
  );
}