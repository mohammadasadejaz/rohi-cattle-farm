import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useSaveSettings, useSettings } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/_gate/content")({
  component: ContentAdmin,
});

const FIELDS = [
  { key: "hero_heading", label: "Hero heading", type: "text" },
  { key: "hero_description", label: "Hero description", type: "textarea" },
  { key: "hero_cta_primary", label: "Primary button text", type: "text" },
  { key: "hero_cta_secondary", label: "Secondary button text", type: "text" },
  { key: "about_title", label: "About section title", type: "text" },
  { key: "about_description", label: "About section text", type: "textarea" },
] as const;

function ContentAdmin() {
  const { data, isLoading } = useSettings();
  const save = useSaveSettings();
  const [form, setForm] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (data) setForm(data as unknown as Record<string, string | null>);
  }, [data]);

  if (isLoading || !data) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">Website Content</h1>
        <p className="text-sm text-muted-foreground">
          Edit the homepage hero and about section text and images.
        </p>
      </div>

      <div className="max-w-2xl space-y-5 rounded-lg border border-border bg-card p-6">
        {FIELDS.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.key}
                rows={4}
                value={form[field.key] ?? ""}
                onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
              />
            ) : (
              <Input
                id={field.key}
                value={form[field.key] ?? ""}
                onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
              />
            )}
          </div>
        ))}

        <ImageUploader
          label="Hero background image"
          value={form["hero_image_url"] ?? null}
          onChange={(hero_image_url) => setForm({ ...form, hero_image_url })}
          folder="site"
        />
        <ImageUploader
          label="About section image"
          value={form["about_image_url"] ?? null}
          onChange={(about_image_url) => setForm({ ...form, about_image_url })}
          folder="site"
        />

        <Button
          disabled={save.isPending}
          onClick={() =>
            save.mutate({
              id: data.id,
              values: {
                ...Object.fromEntries(FIELDS.map((field) => [field.key, form[field.key] ?? ""])),
                hero_image_url: form["hero_image_url"] ?? null,
                about_image_url: form["about_image_url"] ?? null,
              },
            })
          }
        >
          {save.isPending && <Loader2 className="animate-spin" />} Save changes
        </Button>
      </div>
    </div>
  );
}
