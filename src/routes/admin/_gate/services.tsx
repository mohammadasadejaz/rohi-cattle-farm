import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useDeleteRow, useRows, useSaveRow } from "@/lib/admin-data";
import { mediaUrl } from "@/lib/site";

export const Route = createFileRoute("/admin/_gate/services")({
  component: ServicesAdmin,
});

type Service = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  cta_label: string | null;
  sort_order: number;
};
type Draft = Omit<Service, "id"> & { id?: string };

const emptyDraft: Draft = {
  title: "",
  description: "",
  image_url: null,
  cta_label: "Enquire",
  sort_order: 0,
};

function ServicesAdmin() {
  const { data } = useRows<Service>("services", [{ column: "sort_order" }]);
  const save = useSaveRow("services");
  const remove = useDeleteRow("services");
  const [draft, setDraft] = useState<Draft | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">Services</h1>
          <p className="text-sm text-muted-foreground">Manage the services listed on your website.</p>
        </div>
        <Button onClick={() => setDraft({ ...emptyDraft })}><Plus /> Add service</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data ?? []).map((service) => (
          <article key={service.id} className="overflow-hidden rounded-lg border border-border bg-card">
            {service.image_url && (
              <img src={mediaUrl(service.image_url) ?? ""} alt="" className="h-32 w-full object-cover" />
            )}
            <div className="space-y-2 p-4">
              <h2 className="font-display text-lg">{service.title}</h2>
              <p className="line-clamp-3 text-sm text-muted-foreground">{service.description}</p>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setDraft({ ...service })}>
                  <Pencil /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Delete "${service.title}"?`)) remove.mutate(service.id);
                  }}
                >
                  <Trash2 /> Delete
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={!!draft} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit service" : "Add service"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service-title">Title</Label>
                <Input
                  id="service-title"
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-description">Description</Label>
                <Textarea
                  id="service-description"
                  rows={4}
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                />
              </div>
              <ImageUploader
                value={draft.image_url}
                onChange={(image_url) => setDraft({ ...draft, image_url })}
                folder="services"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cta">Button label</Label>
                  <Input
                    id="cta"
                    value={draft.cta_label ?? ""}
                    onChange={(event) => setDraft({ ...draft, cta_label: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Display order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={draft.sort_order}
                    onChange={(event) =>
                      setDraft({ ...draft, sort_order: Number(event.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
            <Button
              disabled={save.isPending}
              onClick={() => {
                if (!draft?.title.trim()) return;
                const { id, ...values } = draft;
                save.mutate({ id, values }, { onSuccess: () => setDraft(null) });
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
