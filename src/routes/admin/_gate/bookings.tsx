import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteRow, useRows, useSaveRow } from "@/lib/admin-data";
import { INQUIRY_STATUSES, formatDate, telHref, whatsappHref } from "@/lib/site";

export const Route = createFileRoute("/admin/_gate/bookings")({
  component: BookingsAdmin,
});

type Inquiry = {
  id: string;
  full_name: string;
  phone: string;
  whatsapp: string | null;
  animal_type: string;
  breed: string | null;
  quantity: number;
  purpose: string;
  delivery: string;
  message: string | null;
  status: string;
  created_at: string;
};

function BookingsAdmin() {
  const { data } = useRows<Inquiry>("inquiries", [{ column: "created_at", ascending: false }]);
  const save = useSaveRow("inquiries");
  const remove = useDeleteRow("inquiries");
  const [filter, setFilter] = useState<string>("All");

  const rows = (data ?? []).filter((row) => filter === "All" || row.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">Bookings & Inquiries</h1>
          <p className="text-sm text-muted-foreground">
            Every request submitted through the website booking form.
          </p>
        </div>
        <div className="w-48">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              {INQUIRY_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((inquiry) => (
          <article key={inquiry.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg">{inquiry.full_name}</h2>
                <p className="text-xs text-muted-foreground">{formatDate(inquiry.created_at)}</p>
              </div>
              <Badge variant={inquiry.status === "New" ? "default" : "secondary"}>
                {inquiry.status}
              </Badge>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Animal" value={`${inquiry.animal_type}${inquiry.breed ? ` (${inquiry.breed})` : ""}`} />
              <Detail label="Quantity" value={String(inquiry.quantity)} />
              <Detail label="Purpose" value={inquiry.purpose} />
              <Detail label="Delivery" value={inquiry.delivery} />
              <Detail label="Phone" value={inquiry.phone} />
              {inquiry.whatsapp && <Detail label="WhatsApp" value={inquiry.whatsapp} />}
            </dl>

            {inquiry.message && (
              <p className="mt-4 rounded-md bg-secondary p-3 text-sm">{inquiry.message}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <a href={telHref(inquiry.phone)}><Phone /> Call</a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a
                  href={whatsappHref(
                    inquiry.whatsapp || inquiry.phone,
                    `Assalam-o-Alaikum ${inquiry.full_name}, regarding your inquiry at Iqbal Cattle Farm (Rohi).`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle /> WhatsApp
                </a>
              </Button>
              <div className="w-40">
                <Select
                  value={inquiry.status}
                  onValueChange={(status) => save.mutate({ id: inquiry.id, values: { status } })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INQUIRY_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (confirm("Delete this inquiry?")) remove.mutate(inquiry.id);
                }}
              >
                <Trash2 /> Delete
              </Button>
            </div>
          </article>
        ))}

        {rows.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No inquiries to show.
          </p>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
