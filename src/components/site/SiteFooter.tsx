import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { telHref, type SiteSettings } from "@/lib/site";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Animals", href: "#animals" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Booking", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="earth-panel">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl uppercase">{settings.farm_name}</h3>
          <p className="mt-1 text-xs tracking-[0.22em] uppercase opacity-70">
            Est. {settings.established_year}
          </p>
          <p className="mt-4 font-display text-lg italic opacity-90">“{settings.slogan}”</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-[0.18em] uppercase opacity-80">Quick Links</h4>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="opacity-85 transition-opacity hover:opacity-100">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <h4 className="text-sm font-semibold tracking-[0.18em] uppercase opacity-80">Contact</h4>
          <p className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
            <a href={telHref(settings.phone)} className="hover:underline">
              {settings.phone}
            </a>
          </p>
          <p className="flex items-start gap-2 opacity-90">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
            <span>{settings.address}</span>
          </p>

          {(settings.instagram_url || settings.facebook_url) && (
            <div className="pt-2">
              <h4 className="text-sm font-semibold tracking-[0.18em] uppercase opacity-80">Follow Us</h4>
              <div className="mt-3 flex items-center gap-3">
                {settings.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/20 opacity-85 transition-opacity hover:opacity-100"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/20 opacity-85 transition-opacity hover:opacity-100"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-2 py-5 text-xs opacity-70 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {settings.farm_name}. All rights reserved.
          </span>
          <a href="/admin/login" className="hover:underline">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
