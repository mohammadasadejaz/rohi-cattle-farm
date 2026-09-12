import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";

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
import { MultiImageUploader } from "@/components/admin/ImageUploader";
import { useDeleteRow, useRows, useSaveRow } from "@/lib/admin-data";
import {
  ANIMAL_CATEGORIES,
  AVAILABILITIES,
  GENDERS,
  PURPOSES,
  mediaUrl,
} from "@/lib/site";

export const Route = createFileRoute("/admin/_gate/animals")({
  component: AnimalsAdmin,
});

type Animal = {
  id: string;
  title: string;
  category: string;
  breed: string | null;
  gender: string;
  purpose: string;
  availability: string;
  price: number | null;
  description: string | null;
  photos: string[];
  featured: boolean;
  sort_order: number;
};

type Draft = Omit<Animal, "id"> & { id?: string };

const emptyDraft: Draft = {
  title: "",
  category: ANIMAL_CATEGORIES[0],
  breed: "",
  gender: "Male",
  purpose: "Qurbani",
  availability: "Available",
  price: null,
  description: "",
  photos: [],
  featured: false,
  sort_order: 0,
};

function AnimalsAdmin() {
  const { data, isLoading } = useRows<Animal>("animals", [
    { column: "sort_order" },
    { column: "created_at", ascending: false },
  ]);
  const breeds = useRows<{ id: string; name: string; category: string }>("breeds", [
    { column: "sort_order" },
  ]);
  const save = useSaveRow("animals");
  const remove = useDeleteRow("animals");
  const [draft, setDraft] = useState<Draft | null>(null);

  function update(patch: Partial<Draft>) {
    setDraft((current) => (current ? { ...current, ...patch } : current));
  }

  function handleSave() {
    if (!draft) return;
    if (!draft.title.trim()) return;
    const { id, ...values } = draft;
    save.mutate(
      { id, values: { ...values, breed: values.breed || null, description: values.description || null } },
      { onSuccess: () => setDraft(null) },
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">Animals</h1>
          <p className="text-sm text-muted-foreground">
            Add, edit or remove the animals shown on your website.
          </p>
        </div>
        <Button onClick={() => setDraft({ ...emptyDraft })}>
          <Plus /> Add animal
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data ?? []).map((animal) => (
          <article key={animal.id} className="overflow-hidden rounded-lg border border-border bg-card">
            {animal.photos[0] ? (
              <img
                src={mediaUrl(animal.photos[0]) ?? ""}
                alt={animal.title}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="grid h-40 place-items-center bg-secondary text-sm text-muted-foreground">
                No photo
              </div>
            )}
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-lg leading-tight">{animal.title}</h2>
                <Badge variant="secondary">{animal.availability}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {animal.category} · {animal.gender} · {animal.purpose}
                {animal.breed ? ` · ${animal.breed}` : ""}
              </p>
              {animal.price ? (
                <p className="text-sm font-medium">PKR {animal.price.toLocaleString()}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Price on request</p>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDraft({ ...animal, breed: animal.breed ?? "", description: animal.description ?? "" })}
                >
                  <Pencil /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Delete "${animal.title}"?`)) remove.mutate(animal.id);
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
          No animals yet. Click “Add animal” to publish your first listing.
        </p>
      )}

      <Dialog open={!!draft} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit animal" : "Add animal"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title / name</Label>
                <Input
                  id="title"
                  value={draft.title}
                  onChange={(event) => update({ title: event.target.value })}
                  placeholder="Cholistani Bull — 2 Teeth"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <Select value={draft.category} onValueChange={(value) => update({ category: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ANIMAL_CATEGORIES.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Breed">
                  <Select
                    value={draft.breed || "none"}
                    onValueChange={(value) => update({ breed: value === "none" ? "" : value })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select breed" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not specified</SelectItem>
                      {(breeds.data ?? [])
                        .filter((breed) => breed.category === draft.category)
                        .map((breed) => (
                          <SelectItem key={breed.id} value={breed.name}>{breed.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Gender">
                  <Select value={draft.gender} onValueChange={(value) => update({ gender: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Purpose">
                  <Select value={draft.purpose} onValueChange={(value) => update({ purpose: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PURPOSES.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Availability">
                  <Select
                    value={draft.availability}
                    onValueChange={(value) => update({ availability: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AVAILABILITIES.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Price (PKR, optional)">
                  <Input
                    type="number"
                    min={0}
                    value={draft.price ?? ""}
                    onChange={(event) =>
                      update({ price: event.target.value ? Number(event.target.value) : null })
                    }
                  />
                </Field>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={draft.description ?? ""}
                  onChange={(event) => update({ description: event.target.value })}
                />
              </div>

              <MultiImageUploader
                value={draft.photos}
                onChange={(photos) => update({ photos })}
                folder="animals"
              />

              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Feature on homepage</p>
                  <p className="text-xs text-muted-foreground">Highlight this animal first.</p>
                </div>
                <Switch
                  checked={draft.featured}
                  onCheckedChange={(featured) => update({ featured })}
                />
              </div>

              <Field label="Display order">
                <Input
                  type="number"
                  value={draft.sort_order}
                  onChange={(event) => update({ sort_order: Number(event.target.value) || 0 })}
                />
              </Field>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
