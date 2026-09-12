import { createFileRoute, Link } from "@tanstack/react-router";
import { Beef, CheckCircle2, Clock, Inbox, XCircle } from "lucide-react";

import { useRows } from "@/lib/admin-data";
import { formatDate } from "@/lib/site";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/_gate/dashboard")({
  component: Dashboard,
});

type AnimalRow = {
  id: string;
  title: string;
  category: string;
  availability: string;
  created_at: string;
};
type InquiryRow = {
  id: string;
  full_name: string;
  phone: string;
  animal_type: string;
  purpose: string;
  status: string;
  created_at: string;
};

function Dashboard() {
  const animals = useRows<AnimalRow>("animals", [{ column: "created_at", ascending: false }]);
  const inquiries = useRows<InquiryRow>("inquiries", [{ column: "created_at", ascending: false }]);

  const list = animals.data ?? [];
  const stats = [
    { label: "Total animals", value: list.length, icon: Beef },
    {
      label: "Available",
      value: list.filter((animal) => animal.availability === "Available").length,
      icon: CheckCircle2,
    },
    {
      label: "Reserved",
      value: list.filter((animal) => animal.availability === "Reserved").length,
      icon: Clock,
    },
    {
      label: "Sold / unavailable",
      value: list.filter((animal) => animal.availability === "Sold").length,
      icon: XCircle,
    },
    { label: "Inquiries", value: (inquiries.data ?? []).length, icon: Inbox },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your farm website.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-5">
            <stat.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 font-display text-3xl">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Recent inquiries</h2>
            <Link to="/admin/bookings" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {(inquiries.data ?? []).slice(0, 5).map((inquiry) => (
              <li key={inquiry.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{inquiry.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {inquiry.animal_type} · {inquiry.purpose} · {formatDate(inquiry.created_at)}
                  </p>
                </div>
                <Badge variant={inquiry.status === "New" ? "default" : "secondary"}>
                  {inquiry.status}
                </Badge>
              </li>
            ))}
            {(inquiries.data ?? []).length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">No inquiries yet.</li>
            )}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Recent animals added</h2>
            <Link to="/admin/animals" className="text-sm text-primary hover:underline">
              Manage
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {list.slice(0, 5).map((animal) => (
              <li key={animal.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{animal.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {animal.category} · {formatDate(animal.created_at)}
                  </p>
                </div>
                <Badge variant="secondary">{animal.availability}</Badge>
              </li>
            ))}
            {list.length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">No animals added yet.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
