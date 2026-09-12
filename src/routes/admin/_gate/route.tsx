import { useState } from "react";
import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Beef,
  Tags,
  Wrench,
  Images,
  Inbox,
  FileText,
  MapPin,
  Settings as SettingsIcon,
  LogOut,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/animals", label: "Animals", icon: Beef },
  { to: "/admin/animal-cards", label: "Animals at Farm", icon: Beef },
  { to: "/admin/breeds", label: "Breeds", icon: Tags },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/bookings", label: "Bookings", icon: Inbox },
  { to: "/admin/content", label: "Website Content", icon: FileText },
  { to: "/admin/contact", label: "Contact & Location", icon: MapPin },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
] as const;

export const Route = createFileRoute("/admin/_gate")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roles) {
      await supabase.auth.signOut();
      throw redirect({ to: "/admin/login" });
    }

    return { user: data.user };
  },
  component: AdminLayout,
});

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-card p-4 lg:block">
          <div className="px-2 py-3">
            <p className="font-display text-lg leading-tight">Iqbal Cattle Farm</p>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
          <div className="mt-4">
            <NavLinks />
          </div>
          <Button variant="outline" className="mt-6 w-full" onClick={handleSignOut}>
            <LogOut /> Logout
          </Button>
          <a
            href="/"
            className="mt-3 block px-3 text-xs text-muted-foreground hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            View public website ↗
          </a>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-card px-4 lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open admin menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetTitle className="font-display">Admin Dashboard</SheetTitle>
                <div className="mt-6">
                  <NavLinks onNavigate={() => setOpen(false)} />
                </div>
                <Button variant="outline" className="mt-6 w-full" onClick={handleSignOut}>
                  <LogOut /> Logout
                </Button>
              </SheetContent>
            </Sheet>
            <span className="font-display">Admin</span>
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Logout">
              <LogOut />
            </Button>
          </header>

          <main className="p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
