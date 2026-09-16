import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { AnimalPhoto } from "@/components/site/AnimalPhoto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicSiteData } from "@/lib/public-data-browser";
import { availabilityVariant, isSold, mediaUrl, whatsappHref } from "@/lib/site";

export const Route = createFileRoute("/animals/$animalId")({
  component: AnimalDetailsPage,
});

function AnimalDetailsPage() {
  const { animalId } = useParams({ from: "/animals/$animalId" });
  const { data, isLoading } = useQuery({
    queryKey: ["site-data"],
    queryFn: getPublicSiteData,
    staleTime: 30_000,
  });
  const animal = data?.animals.find((item) => item.id === animalId);

  if (isLoading) return <div className="grid min-h-screen place-items-center">Loading animal...</div>;
  if (!animal) return <main className="grid min-h-screen place-items-center p-6 text-center"><div><h1 className="font-display text-3xl">Animal not found</h1><Link to="/animals/" className="mt-4 inline-block text-primary hover:underline">Browse listings</Link></div></main>;

  const photos = (animal.photos ?? []).map((photo) => mediaUrl(photo)).filter(Boolean) as string[];
  const sold = isSold(animal.availability);
  return (
    <main className="min-h-screen bg-secondary/30 py-10 md:py-16">
      <div className="section-shell">
        <Link to="/animals/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline"><ArrowLeft className="h-4 w-4" /> All animals</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {photos.length ? photos.map((photo, index) => <AnimalPhoto key={photo} src={photo} alt={animal.title} sold={sold && index === 0} className="h-64 w-full rounded-lg border border-border sm:h-80" />) : <AnimalPhoto src={null} alt={animal.title} sold={sold} className="h-80 w-full rounded-lg" />}
          </div>
          <div>
            <Badge variant={availabilityVariant(animal.availability)}>{animal.availability}</Badge>
            <h1 className="mt-4 font-display text-4xl md:text-5xl">{animal.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{[animal.category, animal.breed, animal.gender, animal.purpose].filter(Boolean).join(" · ")}</p>
            {animal.price != null && <p className="mt-6 font-display text-3xl">PKR {Number(animal.price).toLocaleString("en-PK")}</p>}
            {animal.description && <p className="mt-6 whitespace-pre-line leading-7 text-foreground/80">{animal.description}</p>}
            {sold && <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground/80">This animal has been sold. We usually have similar animals coming up — message us and we will share what is available.</p>}
            <Button asChild variant={sold ? "outline" : "default"} className="mt-8 w-full sm:w-auto"><a href={whatsappHref(data.settings?.whatsapp ?? "", sold ? `Assalam-o-Alaikum, I saw ${animal.title} is sold. Do you have similar animals available?` : `Assalam-o-Alaikum, I would like to inquire about ${animal.title}.`)} target="_blank" rel="noreferrer"><MessageCircle /> {sold ? "Ask About Similar" : "Inquire on WhatsApp"}</a></Button>
          </div>
        </div>
      </div>
    </main>
  );
}