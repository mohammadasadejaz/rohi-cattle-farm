import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSaveSettings, useSettings } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/_gate/contact")({
  component: ContactAdmin,
});

const FIELDS = [
  { key: "contact_person", label: "Contact person", type: "text" },
  { key: "phone", label: "Phone number", type: "text" },
  { key: "whatsapp", label: "WhatsApp number", type: "text" },
  { key: "email", label: "Email (optional)", type: "text" },
  { key: "address", label: "Farm address", type: "textarea" },
  { key: "location_description", label: "Location description / directions", type: "textarea" },
  { key: "maps_url", label: "Google Maps link", type: "text" },
  { key: "facebook_url", label: "Facebook page link", type: "text" },
  { key: "instagram_url", label: "Instagram link", type: "text" },
] as const;

function ContactAdmin() {
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
        <h1 className="font-display text-2xl md:text-3xl">Contact & Location</h1>
        <p className="text-sm text-muted-foreground">
          These details power the call, WhatsApp and directions buttons across the website.
        </p>
      </div>

      <div className="max-w-2xl space-y-5 rounded-lg border border-border bg-card p-6">
        {FIELDS.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.key}
                rows={3}
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

        <Button
          disabled={save.isPending}
          onClick={() =>
            save.mutate({
              id: data.id,
              values: Object.fromEntries(
                FIELDS.map((field) => [field.key, form[field.key] || (field.key === "phone" || field.key === "whatsapp" || field.key === "address" || field.key === "contact_person" || field.key === "location_description" ? "" : null)]),
              ),
            })
          }
        >
          {save.isPending && <Loader2 className="animate-spin" />} Save changes
        </Button>
      </div>
    </div>
  );
}
