import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { getSupabase } from "@/integrations/supabase/client";
import { uploadCmsImage } from "@/lib/cms/uploadCmsImage";
import { adminBtnGhost, adminLabel } from "@/admin/adminClassNames";
import { MediaPickerModal } from "@/admin/components/MediaPickerModal";

type ImageGalleryFieldProps = {
  label?: string;
  value: unknown;
  onChange: (urls: string[]) => void;
  folder?: string;
  disabled?: boolean;
};

function asUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function ImageGalleryField({
  label = "Gallery",
  value,
  onChange,
  folder = "general",
  disabled = false,
}: ImageGalleryFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const targetIndexRef = useRef<number | "append">("append");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | "append">("append");

  const items = asUrls(value);

  const setItems = (next: string[]) => onChange(next);

  const setTarget = (index: number | "append") => {
    targetIndexRef.current = index;
    setTargetIndex(index);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length || disabled) return;
    const sb = getSupabase();
    if (!sb) {
      setErr("Supabase is not configured.");
      return;
    }

    const target = targetIndexRef.current;
    setUploading(true);
    setErr(null);
    try {
      const list = Array.from(files);
      if (target === "append") {
        const urls: string[] = [];
        for (const file of list) {
          urls.push(await uploadCmsImage(sb, file, { folder }));
        }
        setItems([...items, ...urls]);
      } else {
        const url = await uploadCmsImage(sb, list[0], { folder });
        const next = [...items];
        next[target] = url;
        setItems(next);
      }
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      setTarget("append");
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const openUpload = (index: number | "append") => {
    setTarget(index);
    fileRef.current?.click();
  };

  const openLibrary = (index: number | "append") => {
    setTarget(index);
    setPickerOpen(true);
  };

  const move = (index: number, dir: -1 | 1) => {
    const nextIndex = index + dir;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    setItems(next);
  };

  return (
    <div>
      {label ? (
        <label className={adminLabel}>
          {label}
          {items.length > 0 ? ` · ${items.length}` : ""}
        </label>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => void onFiles(e.target.files)}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="group relative overflow-hidden rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-bg)]"
          >
            <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
            {!disabled ? (
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-1 bg-black/70 p-1.5">
                <button
                  type="button"
                  className="rounded px-1.5 py-0.5 text-[11px] font-medium text-white hover:bg-white/15 disabled:opacity-50"
                  disabled={uploading || index === 0}
                  onClick={() => move(index, -1)}
                  aria-label="Move earlier"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <button
                  type="button"
                  className="rounded px-1.5 py-0.5 text-[11px] font-medium text-white hover:bg-white/15 disabled:opacity-50"
                  disabled={uploading || index === items.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label="Move later"
                >
                  <ChevronRight className="size-3.5" />
                </button>
                <button
                  type="button"
                  className="rounded px-1.5 py-0.5 text-[11px] font-medium text-white hover:bg-white/15 disabled:opacity-50"
                  disabled={uploading}
                  onClick={() => openUpload(index)}
                >
                  Replace
                </button>
                <button
                  type="button"
                  className="rounded px-1.5 py-0.5 text-[11px] font-medium text-white hover:bg-white/15 disabled:opacity-50"
                  disabled={uploading}
                  onClick={() => openLibrary(index)}
                >
                  Library
                </button>
                <button
                  type="button"
                  className="ml-auto rounded px-1.5 py-0.5 text-[11px] font-medium text-red-200 hover:bg-white/15 disabled:opacity-50"
                  disabled={uploading}
                  onClick={() => setItems(items.filter((_, i) => i !== index))}
                  aria-label="Remove"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ) : null}
          </div>
        ))}

        {!disabled ? (
          <button
            type="button"
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[var(--admin-radius-lg)] border border-dashed border-[var(--admin-border)] bg-white text-[var(--admin-muted)] transition hover:border-[var(--admin-primary)] hover:text-[var(--admin-ink)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={uploading}
            onClick={() => openUpload("append")}
          >
            {uploading && targetIndex === "append" ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <Plus className="size-6 opacity-50" />
            )}
            <span className="text-xs font-medium uppercase tracking-[0.12em]">Add images</span>
          </button>
        ) : items.length === 0 ? (
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[var(--admin-radius-lg)] border border-dashed border-[var(--admin-border)] bg-[var(--admin-bg)] text-[var(--admin-muted)]">
            <ImageIcon className="size-8 opacity-40" />
            <span className="text-xs">No images</span>
          </div>
        ) : null}
      </div>

      {!disabled ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius-lg)] border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={uploading}
            onClick={() => openUpload("append")}
          >
            {uploading && targetIndex === "append" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            Upload
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius-lg)] border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-800 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={uploading}
            onClick={() => openLibrary("append")}
          >
            Media library
          </button>
          {items.length > 0 ? (
            <button type="button" className={adminBtnGhost} onClick={() => setItems([])}>
              Clear all
            </button>
          ) : null}
        </div>
      ) : null}

      {err ? <p className="mt-2 text-sm text-red-600">{err}</p> : null}

      <MediaPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        kind="image"
        onSelect={(url) => {
          const target = targetIndexRef.current;
          if (target === "append") {
            setItems([...items, url]);
          } else {
            const next = [...items];
            next[target] = url;
            setItems(next);
          }
          setTarget("append");
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
