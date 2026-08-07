import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/client";
import { uploadCmsImage } from "@/lib/cms/uploadCmsImage";
import { adminBtnGhost, adminInput, adminLabel } from "@/admin/adminClassNames";
import { MediaPickerModal } from "@/admin/components/MediaPickerModal";

type ImageUploadFieldProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  disabled?: boolean;
};

export function ImageUploadField({
  label = "Image",
  value,
  onChange,
  folder = "general",
  disabled = false,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const onFile = async (file: File | null) => {
    if (!file || disabled) return;
    const sb = getSupabase();
    if (!sb) {
      setErr("Supabase is not configured.");
      return;
    }

    setUploading(true);
    setErr(null);
    try {
      const url = await uploadCmsImage(sb, file, { folder });
      onChange(url);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label ? <label className={adminLabel}>{label}</label> : null}
      <div className="space-y-3">
        {value ? (
          <img
            src={value}
            alt=""
            className="h-32 w-full max-w-xs rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] object-cover"
          />
        ) : (
          <div className="flex h-32 max-w-xs items-center justify-center rounded-[var(--admin-radius-lg)] border border-dashed border-[var(--admin-border)] bg-[var(--admin-bg)] text-[var(--admin-muted)]">
            <ImageIcon className="size-8 opacity-40" />
          </div>
        )}

        <input
          className={adminInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          disabled={disabled || uploading}
        />

        {!disabled ? (
          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              className={adminBtnGhost}
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              Upload
            </button>
            <button
              type="button"
              className={adminBtnGhost}
              disabled={uploading}
              onClick={() => setPickerOpen(true)}
            >
              Media library
            </button>
            {value ? (
              <button
                type="button"
                className={adminBtnGhost}
                onClick={() => onChange("")}
              >
                Clear
              </button>
            ) : null}
          </div>
        ) : null}

        {err ? <p className="text-sm text-red-600">{err}</p> : null}
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        kind="image"
        onSelect={(url) => {
          onChange(url);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
