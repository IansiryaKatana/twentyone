import { useCallback, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/database.types";
import { useCms } from "@/contexts/CmsContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminPageHeading } from "@/admin/components/AdminPageHeading";
import { ImageUploadField } from "@/admin/components/ImageUploadField";
import {
  adminBtnPrimary,
  adminCard,
  adminMuted,
  adminSectionTitle,
} from "@/admin/adminClassNames";
import {
  SECTION_BACKGROUND_DEFAULTS,
  SECTION_BACKGROUND_KEYS,
  SECTION_BACKGROUND_META,
  SECTION_BACKGROUND_SETTING_KEY,
  parseSectionBackgroundsDraft,
  type SectionBackgroundKey,
  type SectionBackgroundSet,
} from "@/lib/cms/sectionBackgrounds";

type Draft = Record<SectionBackgroundKey, SectionBackgroundSet>;

function emptyDraft(): Draft {
  return parseSectionBackgroundsDraft({});
}

export function AdminBackgrounds() {
  const { refetch } = useCms();
  const { role } = useAdminAuth();
  const canMutate = role !== "viewer";

  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) {
      setErr("Supabase is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErr(null);
    const { data, error } = await sb
      .from("site_settings")
      .select("value, updated_at")
      .eq("key", SECTION_BACKGROUND_SETTING_KEY)
      .maybeSingle();

    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    setDraft(parseSectionBackgroundsDraft(data?.value ?? {}));
    setSavedAt(
      typeof data?.updated_at === "string" ? data.updated_at : null,
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const persist = useCallback(
    async (next: Draft) => {
      const sb = getSupabase();
      if (!sb) {
        setSaveErr("Supabase is not configured.");
        return false;
      }

      setSaving(true);
      setSaveErr(null);

      const value = Object.fromEntries(
        SECTION_BACKGROUND_KEYS.map((key) => [
          key,
          {
            desktop: next[key].desktop.trim(),
            tablet: next[key].tablet.trim(),
            mobile: next[key].mobile.trim(),
          },
        ]),
      );

      const { error } = await sb.from("site_settings").upsert(
        {
          key: SECTION_BACKGROUND_SETTING_KEY,
          value: value as Json,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      );

      setSaving(false);
      if (error) {
        setSaveErr(error.message);
        return false;
      }

      setSavedAt(new Date().toISOString());
      await refetch();
      return true;
    },
    [refetch],
  );

  const updateField = (
    key: SectionBackgroundKey,
    field: keyof SectionBackgroundSet,
    url: string,
  ) => {
    setDraft((prev) => {
      const next = {
        ...prev,
        [key]: { ...prev[key], [field]: url },
      };
      // Persist immediately so uploads survive refresh without a separate Save click.
      if (canMutate) {
        void persist(next);
      }
      return next;
    });
  };

  const onSave = async () => {
    if (!canMutate) return;
    await persist(draft);
  };

  return (
    <div>
      <AdminPageHeading
        title="Section backgrounds"
        description="Homepage hero is under “New home - Hero”. Empty slots show the live built-in fallback; uploads save automatically."
        actions={
          canMutate ? (
            <button
              type="button"
              className={adminBtnPrimary}
              disabled={saving || loading}
              onClick={() => void onSave()}
            >
              <Save className="size-4" />
              {saving ? "Saving…" : "Save backgrounds"}
            </button>
          ) : null
        }
      />

      {err ? (
        <p className="mb-4 text-sm text-[var(--admin-danger,#c0392b)]">{err}</p>
      ) : null}
      {saveErr ? (
        <p className="mb-4 text-sm text-[var(--admin-danger,#c0392b)]">
          {saveErr}
        </p>
      ) : null}
      {!err && !saveErr && savedAt ? (
        <p className={`${adminMuted} mb-4`}>
          Last saved {new Date(savedAt).toLocaleString()}
        </p>
      ) : null}

      {loading ? (
        <p className={adminMuted}>Loading backgrounds…</p>
      ) : (
        <div className="space-y-6">
          {SECTION_BACKGROUND_KEYS.map((key) => {
            const meta = SECTION_BACKGROUND_META[key];
            const set = draft[key];
            const defaults = SECTION_BACKGROUND_DEFAULTS[key];
            return (
              <section key={key} className={adminCard}>
                <div className="mb-5">
                  <h2 className={adminSectionTitle}>{meta.label}</h2>
                  <p className={`${adminMuted} mt-1`}>{meta.description}</p>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {(
                    [
                      ["desktop", "Desktop"],
                      ["tablet", "Tablet"],
                      ["mobile", "Mobile"],
                    ] as const
                  ).map(([field, label]) => {
                    const cmsValue = set[field];
                    const fallback = defaults[field];
                    const usingFallback = !cmsValue && Boolean(fallback);
                    return (
                      <div key={field}>
                        <ImageUploadField
                          label={label}
                          value={cmsValue}
                          previewFallback={fallback}
                          onChange={(url) => updateField(key, field, url)}
                          folder={`backgrounds/${key}/${field}`}
                          disabled={!canMutate}
                        />
                        {usingFallback ? (
                          <p className={`${adminMuted} mt-2 text-[11px]`}>
                            Showing built-in fallback - upload to replace
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
