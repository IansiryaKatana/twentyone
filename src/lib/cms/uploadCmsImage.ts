import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/database.types";

const CMS_MEDIA_BUCKET = "cms-media";

function safeFileName(name: string): string {
  return name
    .trim()
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120) || "upload";
}

function inferKind(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "file";
}

export type UploadCmsImageOptions = {
  folder?: string;
  metadata?: Json;
};

export async function uploadCmsImage(
  sb: SupabaseClient<Database>,
  file: File,
  options: UploadCmsImageOptions = {},
): Promise<string> {
  const folder = options.folder ?? "general";
  const safeName = safeFileName(file.name);
  const storagePath = `${folder}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await sb.storage
    .from(CMS_MEDIA_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicData } = sb.storage
    .from(CMS_MEDIA_BUCKET)
    .getPublicUrl(storagePath);

  const publicUrl = publicData.publicUrl;

  const { error: insertError } = await sb.from("cms_media").insert({
    public_url: publicUrl,
    storage_path: storagePath,
    folder,
    kind: inferKind(file.type || ""),
    file_name: file.name,
    mime_type: file.type || "application/octet-stream",
    size_bytes: file.size,
    metadata: options.metadata ?? {},
  });

  if (insertError) {
    await sb.storage.from(CMS_MEDIA_BUCKET).remove([storagePath]);
    throw new Error(insertError.message);
  }

  return publicUrl;
}
