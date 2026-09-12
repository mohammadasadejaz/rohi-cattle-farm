import { supabase } from "@/integrations/supabase/client";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_VIDEO = ["video/mp4", "video/webm", "video/quicktime", "video/ogg"];

/** Upload an image to the media bucket and return its storage path. */
export async function uploadMedia(file: File, folder = "uploads"): Promise<string> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG or WebP image.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be smaller than 8 MB.");
  }
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
  });
  if (error) throw error;
  return path;
}

/** Upload a video to the media bucket and return its storage path. */
export async function uploadVideo(file: File, folder = "videos"): Promise<string> {
  if (!ALLOWED_VIDEO.includes(file.type)) {
    throw new Error("Please upload an MP4, WebM, MOV or OGG video.");
  }
  if (file.size > 100 * 1024 * 1024) {
    throw new Error("Video must be smaller than 100 MB.");
  }
  const extension = file.name.split(".").pop()?.toLowerCase() || "mp4";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
  });
  if (error) throw error;
  return path;
}

export async function deleteMedia(path?: string | null) {
  if (!path || /^https?:/.test(path)) return;
  await supabase.storage.from("media").remove([path]);
}

export async function signOutAdmin() {
  await supabase.auth.signOut();
}
