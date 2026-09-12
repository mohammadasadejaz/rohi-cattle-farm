import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Phone, MessageCircle } from "lucide-react";

import { siteDataQueryOptions } from "@/lib/queries";
import { telHref, whatsappHref, type SiteSettings } from "@/lib/site";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Animals } from "@/components/site/Animals";
import { AvailabilityNotice } from "@/components/site/AvailabilityNotice";
import { Services } from "@/components/site/Services";
import { Gallery } from "@/components/site/Gallery";
import { BookingForm } from "@/components/site/BookingForm";
import { ContactLocation } from "@/components/site/ContactLocation";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteDataQueryOptions),
  head: () => ({
    meta: [
      {
        title: "Iqbal Cattle Farm (Rohi) | Cholistani Cattle, Qurbani Animals in Bahawalpur",
      },
      {
        name: "description",
        content:
          "Iqbal Cattle Farm (Rohi), Yazman, Bahawalpur — premium Cholistani bulls, Brahman & Gir cattle, Kajla and Bungi sheep, Makhi Cheeni, Rajanpuri and Kamori goats for Qurbani, meat and breeding.",
      },
      {
        name: "keywords",
        content:
          "Iqbal Cattle Farm, Iqbal Cattle Farm Rohi, Cholistani cattle Bahawalpur, Cholistani bulls, Qurbani animals Bahawalpur, Qurbani cattle Bahawalpur, Kajla sheep, Bungi sheep, Makhi Cheeni goats, Rajanpuri goats, Kamori goats, cattle farm Yazman, livestock farm Bahawalpur",
      },
      {
        property: "og:title",
        content: "Iqbal Cattle Farm (Rohi) — The Spirit of Cholistan, Delivered.",
      },
      {
        property: "og:description",
        content:
          "Premium livestock from the heart of Cholistan — Qurbani, meat and breeding animals from Yazman, Bahawalpur.",
      },
      {
        name: "twitter:title",
        content: "Iqbal Cattle Farm (Rohi) — The Spirit of Cholistan, Delivered.",
      },
      {
        name: "twitter:description",
        content:
          "Premium Cholistani cattle, sheep and goats for Qurbani, meat and breeding in Bahawalpur.",
      },
    ],
  }),
  component: Index,
  errorComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <p className="text-muted-foreground">
        The website content could not be loaded. Please refresh the page.
      </p>
    </div>
  ),
});

function Index() {
  const { data } = useSuspenseQuery(siteDataQueryOptions);
  const settings = data.settings as SiteSettings | null;

  if (!settings) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center text-muted-foreground">
        Website content is being set up.
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.farm_name,
    description: settings.hero_description,
    telephone: `+${settings.phone.replace(/^0/, "92")}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Yazman",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader settings={settings} />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <Animals
          settings={settings}
          breeds={data.breeds}
          animals={data.animals}
          cards={data.animalCards}
        />
        <AvailabilityNotice />
        <Services settings={settings} services={data.services} />
        <Gallery images={data.gallery} />
        <BookingForm settings={settings} breeds={data.breeds} />
        <ContactLocation settings={settings} />
      </main>
      <SiteFooter settings={settings} />

      {/* Mobile quick actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-px border-t border-border bg-border sm:hidden">
        <a
          href={telHref(settings.phone)}
          className="flex items-center justify-center gap-2 bg-card py-3 text-sm font-medium"
        >
          <Phone className="h-4 w-4" /> Call Now
        </a>
        <a
          href={whatsappHref(settings.whatsapp)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-primary py-3 text-sm font-medium text-primary-foreground"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </div>
      <div className="h-12 sm:hidden" />
    </div>
  );
}
