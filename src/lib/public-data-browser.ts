import { supabase } from "@/integrations/supabase/client";

export async function getPublicSiteData() {
  const [settings, services, animals, animalCards, gallery, breeds] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("services").select("*").order("sort_order"),
    supabase
      .from("animals")
      .select("*")
      .order("featured", { ascending: false })
      .order("sort_order")
      .order("created_at", { ascending: false }),
    supabase
      .from("animal_cards")
      .select("*")
      .eq("is_active", true)
      .order("featured", { ascending: false })
      .order("sort_order")
      .order("created_at"),
    supabase
      .from("gallery_images")
      .select("*")
      .eq("is_active", true)
      .order("featured", { ascending: false })
      .order("sort_order")
      .order("created_at", { ascending: false }),
    supabase.from("breeds").select("*").order("category").order("sort_order"),
  ]);

  const firstError = [settings, services, animals, animalCards, gallery, breeds].find(
    (result) => result.error,
  )?.error;
  if (firstError) throw firstError;

  return {
    settings: settings.data,
    services: services.data ?? [],
    animals: animals.data ?? [],
    animalCards: animalCards.data ?? [],
    gallery: gallery.data ?? [],
    breeds: breeds.data ?? [],
  };
}