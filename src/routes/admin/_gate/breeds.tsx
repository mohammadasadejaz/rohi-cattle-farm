import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteRow, useRows, useSaveRow } from "@/lib/admin-data";
import { ANIMAL_CATEGORIES } from "@/lib/site";

export const Route = createFileRoute("/admin/_gate/breeds")({
  component: BreedsAdmin,
});

type Breed = { id: string; name: string; category: string; sort_order: number };

function BreedsAdmin() {
  const { data } = useRows<Breed>("breeds", [{ column: "category" }, { column: "sort_order" }]);
  const save = useSaveRow("breeds");
  const remove = useDeleteRow("breeds");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(ANIMAL_CATEGORIES[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">Breeds</h1>
        <p className="text-sm text-muted-foreground">
          Breeds appear as badges on the category cards and in the animal form.
        </p>
      </div>

      <div className="grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="breed-name">Breed name</Label>
          <Input
            id="breed-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Cholistani"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ANIMAL_CATEGORIES.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={!name.trim() || save.isPending}
          onClick={() =>
            save.mutate(
              { values: { name: name.trim(), category } },
              { onSuccess: () => setName("") },
            )
          }
        >
          <Plus /> Add breed
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {ANIMAL_CATEGORIES.map((group) => (
          <section key={group} className="rounded-lg border border-border bg-card p-5">
            <h2 className="font-display text-lg">{group}</h2>
            <ul className="mt-3 divide-y divide-border">
              {(data ?? [])
                .filter((breed) => breed.category === group)
                .map((breed) => (
                  <li key={breed.id} className="flex items-center justify-between gap-2 py-2">
                    <span className="text-sm">{breed.name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${breed.name}`}
                      onClick={() => remove.mutate(breed.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              {(data ?? []).filter((breed) => breed.category === group).length === 0 && (
                <li className="py-2 text-sm text-muted-foreground">No breeds yet.</li>
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
