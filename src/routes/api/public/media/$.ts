import { createFileRoute } from "@tanstack/react-router";

const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "ogg", "ogv", "m4v"];

/**
 * Streams media from the private "media" storage bucket so the public website
 * can display admin-uploaded photos and videos without exposing credentials.
 */
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const raw = (params as Record<string, string>)["_splat"] ?? "";
        const path = raw
          .split("/")
          .map((segment) => decodeURIComponent(segment))
          .join("/");

        if (!path || path.includes("..")) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const extension = path.split(".").pop()?.toLowerCase() ?? "";
        if (VIDEO_EXTENSIONS.includes(extension)) {
          // Redirect videos to a short-lived signed URL so the browser player
          // can use range requests (seeking) directly against storage.
          const { data, error } = await supabaseAdmin.storage
            .from("media")
            .createSignedUrl(path, 60 * 60);
          if (error || !data?.signedUrl) {
            return new Response("Not found", { status: 404 });
          }
          return new Response(null, {
            status: 302,
            headers: { location: data.signedUrl, "cache-control": "public, max-age=1800" },
          });
        }

        const { data, error } = await supabaseAdmin.storage.from("media").download(path);

        if (error || !data) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(await data.arrayBuffer(), {
          headers: {
            "content-type": data.type || "application/octet-stream",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
