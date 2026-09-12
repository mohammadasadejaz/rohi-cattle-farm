import { queryOptions } from "@tanstack/react-query";
import { getSiteData } from "./public-data.functions";

export const siteDataQueryOptions = queryOptions({
  queryKey: ["site-data"],
  queryFn: () => getSiteData(),
  staleTime: 30_000,
});

export type SiteData = Awaited<ReturnType<typeof getSiteData>>;
export type Animal = SiteData["animals"][number];
export type Service = SiteData["services"][number];
export type GalleryImage = SiteData["gallery"][number];
export type AnimalCard = SiteData["animalCards"][number];
export type Breed = SiteData["breeds"][number];
