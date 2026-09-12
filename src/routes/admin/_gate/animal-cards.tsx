import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  useDeleteRow,
  useRows,
  useSaveRow,
  useSaveSettings,
  useSettings,
} from "@/lib/admin-data";
import { ANIMAL_CATEGORIES, mediaUrl } from "@/lib/site";

export const Route = createFileRoute("/admin/_gate/animal-cards")({
  component: AnimalCardsAdmin,
});

type AnimalCard = {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  cta_label: string;
  sort_order: number;
  featured: boolean;
  is_active: boolean;
};

type Draft = Omit<AnimalCard, "id"> & { id?: string };

const emptyDraft: Draft = {
  title: "",
  category: ANIMAL_CATEGORIES[0],
  description: "",
  image_url: null,
  cta_label: "Inquire",
  sort_order: 0,
  featured: false,
  is_active: true,
};

function AnimalCardsAdmin() {
  const settings = useSettings();
  const saveSettings = useSaveSettings();
  const [heading, setHeading] = useState<Record<string, string>>({});

  const { data, isLoading } = useRows<AnimalCard>("animal_cards", [
    { column: "sort_order" },
    { column: "created_at" },
  ]);
  const save = useSaveRow("animal_cards");
  const remove = useDeleteRow("animal_cards");
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    if (settings.data) {
      const row = settings.data as unknown as Record<string, string>;
      setHeading({
        animals_eyebrow: row["animals_eyebrow"] ?? "",
        animals_title: row["animals_title"] ?? "",
        animals_description: row["animals_description"] ?? "",
      });
    }
  }, [settings.data]);

  function update(patch: Partial<Draft>) {
    setDraft((current) => (current ? { ...current, ...patch } : current));
  }

  function handleSave() {
    if (!draft?.title.trim()) return;
    const { id, ...values } = draft;
    save.mutate({ id, values }, { onSuccess: () => setDraft(null) });
  }

  const settingsId = (settings.data as { id?: string } | null | undefined)?.id;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">Animals at Farm</h1>
          <p className="text-sm text-muted-foreground">
            Edit the section heading and the animal cards shown on the homepage.
          </p>
        </div>
        <Button onClick={() => setDraft({ ...emptyDraft, sort_order: (data?.length ?? 0) + 1 })}>
          <Plus /> Add card
        </Button>
      </div>

      <div className="max-w-2xl space-y-5 rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-lg">Section heading</h2>
        <div className="space-y-2">
          <Label htmlFor="animals_eyebrow">Small label above title</Label>
          <Input
            id="animals_eyebrow"
            value={heading["animals_eyebrow"] ?? ""}
            onChange={(event) => setHeading({ ...heading, animals_eyebrow: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="animals_title">Section title</Label>
          <Input
            id="animals_title"
            value={heading["animals_title"] ?? ""}
            onChange={(event) => setHeading({ ...heading, animals_title: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="animals_description">Section description</Label>
          <Textarea
            id="animals_description"
            rows={3}
            value={heading["animals_description"] ?? ""}
            onChange={(event) =>
              setHeading({ ...heading, animals_description: event.target.value })
            }
          />
        </div>
        <Button
          disabled={!settingsId || saveSettings.isPending}
          onClick={() => settingsId && saveSettings.mutate({ id: settingsId, values: heading })}
        >
          {saveSettings.isPending && <Loader2 className="animate-spin" />} Save heading
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data ?? []).map((card) => (
          <article key={card.id} className="overflow-hidden rounded-lg border border-border bg-card">
            {card.image_url ? (
              <img
                src={mediaUrl(card.image_url) ?? ""}
                alt={card.title}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="grid h-40 place-items-center bg-secondary text-xs text-muted-foreground">
                Using default image
              </div>
            )}
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-lg leading-tight">{card.title}</h2>
                <Badge variant={card.is_active ? "secondary" : "outline"}>
                  {card.is_active ? "Visible" : "Hidden"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {card.category} · order {card.sort_order}
                {card.featured ? " · featured" : ""}
              </p>
              <p className="text-sm text-foreground/80">{card.description}</p>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setDraft({ ...card })}>
                  <Pencil /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Delete "${card.title}"?`)) remove.mutate(card.id);
                  }}
                >
                  <Trash2 /> Delete
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!isLoading && (data ?? []).length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No cards yet. Click “Add card” to create one.
        </p>
      )}

      <Dialog open={!!draft} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit card" : "Add card"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-title">Animal name</Label>
                <Input
                  id="card-title"
                  value={draft.title}
                  onChange={(event) => update({ title: event.target.value })}
                  placeholder="Premium Bulls"
                />
              </div>

              <div className="space-y-2">
                <Label>Category (controls which breed tags show)</Label>
                <Select value={draft.category} onValueChange={(value) => update({ category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ANIMAL_CATEGORIES.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-description">Description</Label>
                <Textarea
                  id="card-description"
                  rows={3}
                  value={draft.description}
                  onChange={(event) => update({ description: event.target.value })}
                />
              </div>

              <ImageUploader
                value={draft.image_url}
                onChange={(image_url) => update({ image_url })}
                folder="animal-cards"
                label="Card image"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="card-cta">Button text</Label>
                  <Input
                    id="card-cta"
                    value={draft.cta_label}
                    onChange={(event) => update({ cta_label: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-order">Display order</Label>
                  <Input
                    id="card-order"
                    type="number"
                    value={draft.sort_order}
                    onChange={(event) => update({ sort_order: Number(event.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Show on website</p>
                  <p className="text-xs text-muted-foreground">Turn off to hide this card.</p>
                </div>
                <Switch
                  checked={draft.is_active}
                  onCheckedChange={(is_active) => update({ is_active })}
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Featured</p>
                  <p className="text-xs text-muted-foreground">Featured cards show first.</p>
                </div>
                <Switch
                  checked={draft.featured}
                  onCheckedChange={(featured) => update({ featured })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={save.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
