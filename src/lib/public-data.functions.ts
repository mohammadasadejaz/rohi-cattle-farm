import { createServerFn } from "@tanstack/react-start";

/** Public, read-only website content used by the marketing site (SSR friendly). */
export const getSiteData = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const url = import.meta.env.VITE_SUPABASE_URL || process.env["SUPABASE_URL"];
  const key =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env["SUPABASE_PUBLISHABLE_KEY"];

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables for public site data");
  }

  const client = createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });

  const [settings, services, animals, animalCards, gallery, breeds] = await Promise.all([
    client.from("site_settings").select("*").limit(1).maybeSingle(),
    client.from("services").select("*").order("sort_order"),
    client
      .from("animals")
      .select("*")
      .order("featured", { ascending: false })
      .order("sort_order")
      .order("created_at", { ascending: false }),
    client
      .from("animal_cards")
      .select("*")
      .eq("is_active", true)
      .order("featured", { ascending: false })
      .order("sort_order")
      .order("created_at"),
    client
      .from("gallery_images")
      .select("*")
      .eq("is_active", true)
      .order("featured", { ascending: false })
      .order("sort_order")
      .order("created_at", { ascending: false }),
    client.from("breeds").select("*").order("category").order("sort_order"),
  ]);

  return {
    settings: settings.data,
    services: services.data ?? [],
    animals: animals.data ?? [],
    animalCards: animalCards.data ?? [],
    gallery: gallery.data ?? [],
    breeds: breeds.data ?? [],
  };
});
