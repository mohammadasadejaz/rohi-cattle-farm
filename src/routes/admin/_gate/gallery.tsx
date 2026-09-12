import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Film, ImagePlus, Loader2, Trash2, Video } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteRow, useRows, useSaveRow } from "@/lib/admin-data";
import { deleteMedia, uploadMedia, uploadVideo } from "@/lib/admin";
import { GALLERY_CATEGORIES, mediaUrl } from "@/lib/site";

export const Route = createFileRoute("/admin/_gate/gallery")({
  component: GalleryAdmin,
});

type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
  category: string;
  media_type: string;
  is_active: boolean;
  sort_order: number;
};

function GalleryAdmin() {
  const { data } = useRows<GalleryImage>("gallery_images", [
    { column: "sort_order" },
    { column: "created_at", ascending: false },
  ]);
  const save = useSaveRow("gallery_images");
  const remove = useDeleteRow("gallery_images");
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<string>(GALLERY_CATEGORIES[0]);
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [replacing, setReplacing] = useState<GalleryImage | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const path =
          mediaType === "video"
            ? await uploadVideo(file, "gallery-videos")
            : await uploadMedia(file, "gallery");
        await save.mutateAsync({
          values: {
            image_url: path,
            caption: caption || null,
            category,
            media_type: mediaType,
            is_active: true,
          },
        });
      }
      setCaption("");
      toast.success(mediaType === "video" ? "Video added to the gallery" : "Photos added to the gallery");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleReplace(file?: File) {
    if (!file || !replacing) return;
    const item = replacing;
    setBusy(true);
    try {
      const path =
        item.media_type === "video"
          ? await uploadVideo(file, "gallery-videos")
          : await uploadMedia(file, "gallery");
      await save.mutateAsync({ id: item.id, values: { image_url: path } });
      await deleteMedia(item.image_url);
      toast.success("Media replaced");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
      setReplacing(null);
      if (replaceRef.current) replaceRef.current.value = "";
    }
  }

  const acceptFor = (type: string) =>
    type === "video" ? "video/mp4,video/webm,video/quicktime,video/ogg" : "image/jpeg,image/png,image/webp";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">Gallery</h1>
        <p className="text-sm text-muted-foreground">
          Upload farm photos and videos. They appear instantly in the website gallery.
        </p>
      </div>

      <div className="grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_auto] lg:items-end">
        <div className="space-y-2">
          <Label>Media type</Label>
          <Select value={mediaType} onValueChange={(value) => setMediaType(value as "photo" | "video")}>
            <SelectTrigger className="min-w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="photo">Photo</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {GALLERY_CATEGORIES.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="caption">Caption (optional)</Label>
          <Input id="caption" value={caption} onChange={(event) => setCaption(event.target.value)} />
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple={mediaType === "photo"}
          accept={acceptFor(mediaType)}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <Button disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? <Loader2 className="animate-spin" /> : mediaType === "video" ? <Video /> : <ImagePlus />}
          {mediaType === "video" ? "Upload video" : "Upload photos"}
        </Button>
      </div>

      <input
        ref={replaceRef}
        type="file"
        accept={acceptFor(replacing?.media_type ?? "photo")}
        className="hidden"
        onChange={(event) => handleReplace(event.target.files?.[0])}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(data ?? []).map((item) => (
          <figure key={item.id} className="overflow-hidden rounded-lg border border-border bg-card">
            {item.media_type === "video" ? (
              <video
                src={mediaUrl(item.image_url) ?? ""}
                controls
                preload="metadata"
                className="h-40 w-full bg-black object-cover"
              />
            ) : (
              <img
                src={mediaUrl(item.image_url) ?? ""}
                alt={item.caption ?? ""}
                className="h-40 w-full object-cover"
              />
            )}
            <figcaption className="space-y-3 p-3">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {item.media_type === "video" && <Film className="h-3 w-3" />}
                {item.category}
              </p>
              <Input
                defaultValue={item.caption ?? ""}
                placeholder="Caption"
                onBlur={(event) => {
                  const value = event.target.value.trim();
                  if (value === (item.caption ?? "")) return;
                  save.mutate({ id: item.id, values: { caption: value || null } });
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Category</Label>
                  <Select
                    value={item.category}
                    onValueChange={(value) => save.mutate({ id: item.id, values: { category: value } })}
                  >
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {GALLERY_CATEGORIES.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Order</Label>
                  <Input
                    type="number"
                    className="h-9"
                    defaultValue={item.sort_order}
                    onBlur={(event) => {
                      const value = Number(event.target.value) || 0;
                      if (value === item.sort_order) return;
                      save.mutate({ id: item.id, values: { sort_order: value } });
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Visible on website</Label>
                <Switch
                  checked={item.is_active}
                  onCheckedChange={(checked) => save.mutate({ id: item.id, values: { is_active: checked } })}
                />
              </div>
              <div className="flex flex-wrap gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => {
                    setReplacing(item);
                    setTimeout(() => replaceRef.current?.click(), 0);
                  }}
                >
                  Replace
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    if (!confirm("Delete this item?")) return;
                    await deleteMedia(item.image_url);
                    remove.mutate(item.id);
                  }}
                >
                  <Trash2 /> Delete
                </Button>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {(data ?? []).length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No gallery media yet.
        </p>
      )}
    </div>
  );
}
