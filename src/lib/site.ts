export type SiteSettings = {
  id: string;
  farm_name: string;
  established_year: string;
  slogan: string;
  hero_heading: string;
  hero_description: string;
  hero_image_url: string | null;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  animals_eyebrow: string;
  animals_title: string;
  animals_description: string;
  about_title: string;
  about_description: string;
  about_image_url: string | null;
  contact_person: string;
  phone: string;
  whatsapp: string;
  email: string | null;
  address: string;
  location_description: string;
  maps_url: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
};

export const ANIMAL_CATEGORIES = ["Bulls / Cattle", "Sheep", "Goats"] as const;
export const PURPOSES = ["Qurbani", "Meat", "Breeding"] as const;
export const GENDERS = ["Male", "Female"] as const;
export const AVAILABILITIES = ["Available", "Reserved", "Sold"] as const;
export const DELIVERY_OPTIONS = ["Farm Pickup", "Home Delivery"] as const;
export const INQUIRY_STATUSES = ["New", "Contacted", "Reserved", "Completed", "Cancelled"] as const;
export const GALLERY_CATEGORIES = [
  "Bulls",
  "Sheep",
  "Goats",
  "Farm",
  "Cholistan",
  "Breeding",
  "Other",
] as const;

/** Resolve a stored media reference (storage object path or absolute URL) to a usable src. */
export function mediaUrl(value?: string | null): string | null {
  if (!value) return null;
  if (/^(https?:)?\/\//.test(value) || value.startsWith("/")) return value;
  return `/api/public/media/${value.split("/").map(encodeURIComponent).join("/")}`;
}

/** Convert a local Pakistani number (03218114646) to international format (923218114646). */
export function toInternational(phone: string): string {
  const digits = (phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  return digits;
}

export function telHref(phone: string): string {
  return `tel:+${toInternational(phone)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Assalam-o-Alaikum, I would like to inquire about animals available at Iqbal Cattle Farm (Rohi).";

export function whatsappHref(whatsapp: string, message: string = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${toInternational(whatsapp)}?text=${encodeURIComponent(message)}`;
}

export function directionsHref(settings: { maps_url?: string | null; address: string }): string {
  if (settings.maps_url) return settings.maps_url;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
