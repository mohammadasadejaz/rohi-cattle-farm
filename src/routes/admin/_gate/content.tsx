import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Sparkles, Sprout, Dna } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useSaveSettings, useSettings } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/_gate/content")({
  component: ContentAdmin,
});

const DEFAULT_VALUES: Record<string, string> = {
  agriculture_eyebrow: "Grown on our own land",
  agriculture_title: "The animals eat what we grow",
  agriculture_description:
    "Their feed comes from our own fields in the Cholistan, cut fresh and brought in through the year. Nothing artificial goes into them, and nothing is rushed to put on weight quickly. They are raised slowly, on clean water and open ground, with the same care you would give your own herd.",
  agriculture_point1_title: "Our Own Fields",
  agriculture_point1_text: "Fodder is grown on our own land and cut fresh through the year.",
  agriculture_point2_title: "Nothing Artificial",
  agriculture_point2_text: "No artificial feed and no shortcuts taken to put on weight quickly.",
  agriculture_point3_title: "Raised With Care",
  agriculture_point3_text: "Open ground, clean water, and patient day-to-day attention.",
  embryo_eyebrow: "Advanced breeding",
  embryo_title: "Embryo transfer for stronger Cholistani herds",
  embryo_description:
    "Embryo transfer lets one outstanding cow produce far more calves than she could naturally. We collect embryos from proven Cholistani donors and place them in recipient cows, so the genetics worth keeping spread through the herd in a fraction of the time.",
  embryo_cta_text: "Ask about embryo transfer",
  embryo_whatsapp_message:
    "Assalam-o-Alaikum, I would like to know more about your embryo transfer services.",
};

const HERO_ABOUT_FIELDS = [
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
    if (data) {
      const row = data as unknown as Record<string, string | null>;
      const merged: Record<string, string | null> = { ...DEFAULT_VALUES };
      for (const [k, v] of Object.entries(row)) {
        if (v !== undefined && v !== null && v !== "") {
          merged[k] = v;
        } else if (v === null) {
          merged[k] = null;
        }
      }
      setForm(merged);
    }
  }, [data]);

  if (isLoading || !data) return <p className="text-sm text-muted-foreground">Loading…</p>;

  function handleSave(fieldKeys: string[]) {
    if (!data) return;
    const values: Record<string, unknown> = {};
    for (const key of fieldKeys) {
      values[key] = form[key] ?? null;
    }
    save.mutate({ id: data.id, values });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">Website Content</h1>
        <p className="text-sm text-muted-foreground">
          Manage headings, text descriptions, and photos for key homepage sections.
        </p>
      </div>

      <Tabs defaultValue="hero-about" className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-3">
          <TabsTrigger value="hero-about" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Hero & About</span>
          </TabsTrigger>
          <TabsTrigger value="agriculture" className="flex items-center gap-2">
            <Sprout className="h-4 w-4" />
            <span>Agriculture</span>
          </TabsTrigger>
          <TabsTrigger value="embryo" className="flex items-center gap-2">
            <Dna className="h-4 w-4" />
            <span>Embryo Transfer</span>
          </TabsTrigger>
        </TabsList>

        {/* HERO & ABOUT TAB */}
        <TabsContent value="hero-about">
          <div className="max-w-2xl space-y-6 rounded-lg border border-border bg-card p-6">
            <div>
              <h2 className="font-display text-lg">Hero & About Section</h2>
              <p className="text-xs text-muted-foreground">
                Edit the introductory hero banner and the about section.
              </p>
            </div>

            <div className="space-y-4">
              {HERO_ABOUT_FIELDS.map((field) => (
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
            </div>

            <Button
              disabled={save.isPending}
              onClick={() =>
                handleSave([
                  ...HERO_ABOUT_FIELDS.map((f) => f.key),
                  "hero_image_url",
                  "about_image_url",
                ])
              }
            >
              {save.isPending && <Loader2 className="animate-spin" />} Save Hero & About
            </Button>
          </div>
        </TabsContent>

        {/* AGRICULTURE TAB */}
        <TabsContent value="agriculture">
          <div className="max-w-2xl space-y-6 rounded-lg border border-border bg-card p-6">
            <div>
              <h2 className="font-display text-lg">Our Agriculture Section</h2>
              <p className="text-xs text-muted-foreground">
                Edit the "Grown on our own land" / fields section title, text, photo, and features.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agriculture_eyebrow">Small label above title (Eyebrow)</Label>
                <Input
                  id="agriculture_eyebrow"
                  value={form["agriculture_eyebrow"] ?? ""}
                  placeholder="Grown on our own land"
                  onChange={(e) => setForm({ ...form, agriculture_eyebrow: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agriculture_title">Section Title</Label>
                <Input
                  id="agriculture_title"
                  value={form["agriculture_title"] ?? ""}
                  placeholder="The animals eat what we grow"
                  onChange={(e) => setForm({ ...form, agriculture_title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agriculture_description">Section Description</Label>
                <Textarea
                  id="agriculture_description"
                  rows={4}
                  value={form["agriculture_description"] ?? ""}
                  placeholder="Their feed comes from our own fields in the Cholistan..."
                  onChange={(e) => setForm({ ...form, agriculture_description: e.target.value })}
                />
              </div>

              <ImageUploader
                label="Agriculture Section Image"
                value={form["agriculture_image_url"] ?? null}
                onChange={(agriculture_image_url) =>
                  setForm({ ...form, agriculture_image_url })
                }
                folder="site"
              />

              <div className="border-t border-border pt-4">
                <h3 className="font-display text-base mb-3">Feature Points</h3>
                <div className="space-y-4">
                  {/* Point 1 */}
                  <div className="rounded-md border border-border/80 bg-secondary/20 p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Feature 1
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="agriculture_point1_title">Title</Label>
                      <Input
                        id="agriculture_point1_title"
                        value={form["agriculture_point1_title"] ?? ""}
                        placeholder="Our Own Fields"
                        onChange={(e) =>
                          setForm({ ...form, agriculture_point1_title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agriculture_point1_text">Text</Label>
                      <Input
                        id="agriculture_point1_text"
                        value={form["agriculture_point1_text"] ?? ""}
                        placeholder="Fodder is grown on our own land and cut fresh through the year."
                        onChange={(e) =>
                          setForm({ ...form, agriculture_point1_text: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div className="rounded-md border border-border/80 bg-secondary/20 p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Feature 2
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="agriculture_point2_title">Title</Label>
                      <Input
                        id="agriculture_point2_title"
                        value={form["agriculture_point2_title"] ?? ""}
                        placeholder="Nothing Artificial"
                        onChange={(e) =>
                          setForm({ ...form, agriculture_point2_title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agriculture_point2_text">Text</Label>
                      <Input
                        id="agriculture_point2_text"
                        value={form["agriculture_point2_text"] ?? ""}
                        placeholder="No artificial feed and no shortcuts taken to put on weight quickly."
                        onChange={(e) =>
                          setForm({ ...form, agriculture_point2_text: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Point 3 */}
                  <div className="rounded-md border border-border/80 bg-secondary/20 p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Feature 3
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="agriculture_point3_title">Title</Label>
                      <Input
                        id="agriculture_point3_title"
                        value={form["agriculture_point3_title"] ?? ""}
                        placeholder="Raised With Care"
                        onChange={(e) =>
                          setForm({ ...form, agriculture_point3_title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agriculture_point3_text">Text</Label>
                      <Input
                        id="agriculture_point3_text"
                        value={form["agriculture_point3_text"] ?? ""}
                        placeholder="Open ground, clean water, and patient day-to-day attention."
                        onChange={(e) =>
                          setForm({ ...form, agriculture_point3_text: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              disabled={save.isPending}
              onClick={() =>
                handleSave([
                  "agriculture_eyebrow",
                  "agriculture_title",
                  "agriculture_description",
                  "agriculture_image_url",
                  "agriculture_point1_title",
                  "agriculture_point1_text",
                  "agriculture_point2_title",
                  "agriculture_point2_text",
                  "agriculture_point3_title",
                  "agriculture_point3_text",
                ])
              }
            >
              {save.isPending && <Loader2 className="animate-spin" />} Save Agriculture Content
            </Button>
          </div>
        </TabsContent>

        {/* EMBRYO TRANSFER TAB */}
        <TabsContent value="embryo">
          <div className="max-w-2xl space-y-6 rounded-lg border border-border bg-card p-6">
            <div>
              <h2 className="font-display text-lg">Embryo Transfer Section</h2>
              <p className="text-xs text-muted-foreground">
                Edit the Embryo Transfer section heading, description, WhatsApp button text, and photo.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="embryo_eyebrow">Small label above title (Eyebrow)</Label>
                <Input
                  id="embryo_eyebrow"
                  value={form["embryo_eyebrow"] ?? ""}
                  placeholder="Advanced breeding"
                  onChange={(e) => setForm({ ...form, embryo_eyebrow: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="embryo_title">Section Title</Label>
                <Input
                  id="embryo_title"
                  value={form["embryo_title"] ?? ""}
                  placeholder="Embryo transfer for stronger Cholistani herds"
                  onChange={(e) => setForm({ ...form, embryo_title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="embryo_description">Section Description</Label>
                <Textarea
                  id="embryo_description"
                  rows={4}
                  value={form["embryo_description"] ?? ""}
                  placeholder="Embryo transfer lets one outstanding cow produce far more calves than she could naturally..."
                  onChange={(e) => setForm({ ...form, embryo_description: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="embryo_cta_text">Button Label</Label>
                  <Input
                    id="embryo_cta_text"
                    value={form["embryo_cta_text"] ?? ""}
                    placeholder="Ask about embryo transfer"
                    onChange={(e) => setForm({ ...form, embryo_cta_text: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="embryo_whatsapp_message">WhatsApp Inquiry Message</Label>
                  <Input
                    id="embryo_whatsapp_message"
                    value={form["embryo_whatsapp_message"] ?? ""}
                    placeholder="Assalam-o-Alaikum, I would like to know more..."
                    onChange={(e) =>
                      setForm({ ...form, embryo_whatsapp_message: e.target.value })
                    }
                  />
                </div>
              </div>

              <ImageUploader
                label="Embryo Transfer Section Image"
                value={form["embryo_image_url"] ?? null}
                onChange={(embryo_image_url) => setForm({ ...form, embryo_image_url })}
                folder="site"
              />
            </div>

            <Button
              disabled={save.isPending}
              onClick={() =>
                handleSave([
                  "embryo_eyebrow",
                  "embryo_title",
                  "embryo_description",
                  "embryo_image_url",
                  "embryo_cta_text",
                  "embryo_whatsapp_message",
                ])
              }
            >
              {save.isPending && <Loader2 className="animate-spin" />} Save Embryo Transfer Content
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
