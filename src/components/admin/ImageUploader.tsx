import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadMedia, deleteMedia } from "@/lib/admin";
import { mediaUrl } from "@/lib/site";

type Props = {
  value?: string | null;
  onChange: (path: string | null) => void;
  folder?: string;
  label?: string;
};

export function ImageUploader({ value, onChange, folder = "uploads", label = "Image" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const preview = mediaUrl(value);

  async function handleFile(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      const path = await uploadMedia(file, folder);
      if (value) await deleteMedia(value);
      onChange(path);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap items-center gap-3">
        {preview ? (
          <img src={preview} alt="" className="h-20 w-28 rounded-md border border-border object-cover" />
        ) : (
          <div className="grid h-20 w-28 place-items-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
            No image
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        <Button type="button" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          {value ? "Replace" : "Upload"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            onClick={async () => {
              await deleteMedia(value);
              onChange(null);
            }}
          >
            <Trash2 /> Remove
          </Button>
        )}
      </div>
    </div>
  );
}

export function MultiImageUploader({
  value,
  onChange,
  folder = "animals",
}: {
  value: string[];
  onChange: (paths: string[]) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadMedia(file, folder));
      }
      onChange([...value, ...uploaded]);
      toast.success(`${uploaded.length} photo(s) uploaded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Photos</p>
      <div className="flex flex-wrap gap-3">
        {value.map((path) => (
          <div key={path} className="relative">
            <img
              src={mediaUrl(path) ?? ""}
              alt=""
              className="h-20 w-28 rounded-md border border-border object-cover"
            />
            <button
              type="button"
              aria-label="Delete photo"
              onClick={async () => {
                await deleteMedia(path);
                onChange(value.filter((item) => item !== path));
              }}
              className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <Button type="button" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />} Add photos
        </Button>
      </div>
    </div>
  );
}
