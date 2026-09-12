import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useSaveSettings, useSettings } from "@/lib/admin-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/_gate/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const { data, isLoading } = useSettings();
  const save = useSaveSettings();
  const [form, setForm] = useState<Record<string, string | null>>({});
  const [password, setPassword] = useState("");
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    if (data) setForm(data as unknown as Record<string, string | null>);
  }, [data]);

  async function changePassword() {
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    setChanging(true);
    const { error } = await supabase.auth.updateUser({ password });
    setChanging(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      setPassword("");
    }
  }

  if (isLoading || !data) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Farm identity, branding and admin security.</p>
      </div>

      <div className="max-w-2xl space-y-5 rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-lg">Farm identity</h2>
        {[
          { key: "farm_name", label: "Farm name" },
          { key: "slogan", label: "Slogan" },
          { key: "established_year", label: "Established year" },
        ].map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              value={form[field.key] ?? ""}
              onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
            />
          </div>
        ))}

        <ImageUploader
          label="Logo"
          value={form["logo_url"] ?? null}
          onChange={(logo_url) => setForm({ ...form, logo_url })}
          folder="site"
        />

        <Button
          disabled={save.isPending}
          onClick={() =>
            save.mutate({
              id: data.id,
              values: {
                farm_name: form["farm_name"] ?? "",
                slogan: form["slogan"] ?? "",
                established_year: form["established_year"] ?? "",
                logo_url: form["logo_url"] ?? null,
              },
            })
          }
        >
          {save.isPending && <Loader2 className="animate-spin" />} Save changes
        </Button>
      </div>

      <div className="max-w-2xl space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-lg">Change admin password</h2>
        <div className="space-y-2">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button variant="outline" disabled={changing} onClick={changePassword}>
          {changing && <Loader2 className="animate-spin" />} Update password
        </Button>
      </div>
    </div>
  );
}
