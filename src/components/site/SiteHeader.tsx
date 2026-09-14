import { useState } from "react";
import { Menu, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { mediaUrl, telHref, whatsappHref, type SiteSettings } from "@/lib/site";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Animals", href: "#animals" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Booking", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const logo = mediaUrl(settings.logo_url);

  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-white/15 bg-earth/30 text-white backdrop-blur-md">
      <div className="section-shell flex h-16 items-center justify-between gap-4 md:h-20">
        <a href="#home" className="flex items-center gap-3 min-w-0">
          {logo ? (
            <img src={logo} alt={settings.farm_name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary font-display text-primary-foreground">
              IC
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate font-display text-base leading-tight md:text-lg">
              {settings.farm_name}
            </span>
            <span className="block text-[11px] uppercase tracking-[0.2em] text-white/65">
              Est. {settings.established_year}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="hidden border-white/30 bg-transparent text-white hover:bg-white/10 sm:inline-flex">
            <a href={telHref(settings.phone)}>
              <Phone /> Call Now
            </a>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer">
              <MessageCircle /> WhatsApp
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-white/30 bg-transparent text-white lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-xs">
              <SheetTitle className="font-display text-lg">{settings.farm_name}</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-secondary"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-2">
                <Button asChild variant="outline">
                  <a href={telHref(settings.phone)}>
                    <Phone /> Call {settings.phone}
                  </a>
                </Button>
                <Button asChild>
                  <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer">
                    <MessageCircle /> WhatsApp Us
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
