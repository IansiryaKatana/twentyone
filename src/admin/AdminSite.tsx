import { useCallback, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/database.types";
import { useCms } from "@/contexts/CmsContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminPageHeading } from "@/admin/components/AdminPageHeading";
import {
  adminBtnPrimary,
  adminCard,
  adminInput,
  adminLabel,
  adminSectionTitle,
  adminTextarea,
} from "@/admin/adminClassNames";

type SettingRow = Tables<"site_settings">;

type BrandSettings = {
  name: string;
  primary: string;
  surface: string;
  background: string;
  ink: string;
  muted: string;
  crimson: string;
};

type TypographySettings = {
  displayFont: string;
  bodyFont: string;
  displayWeight: number;
  bodyWeight: number;
};

type ContactSettings = {
  email: string;
  phone: string;
  phoneHref: string;
  addressLines: string[];
};

type LegalControllerSettings = {
  name: string;
  email: string;
  phone: string;
  phoneHref: string;
  web: string;
  webHref: string;
  lines: string[];
};

type SocialLink = { label: string; href: string };

const SETTING_KEYS = [
  "brand",
  "typography",
  "contact",
  "social",
  "legal_controller",
  "nav",
  "footer",
  "admin_theme",
] as const;

const DEFAULT_BRAND: BrandSettings = {
  name: "Twentyone06",
  primary: "#e01e26",
  surface: "#111111",
  background: "#f7f5f2",
  ink: "#1a1a1a",
  muted: "#6b6b6b",
  crimson: "#cc0001",
};

const DEFAULT_TYPOGRAPHY: TypographySettings = {
  displayFont: "Zeuxis",
  bodyFont: "Inter Tight",
  displayWeight: 500,
  bodyWeight: 300,
};

const DEFAULT_CONTACT: ContactSettings = {
  email: "info@twentyone06.com",
  phone: "04 554 8082",
  phoneHref: "tel:+97145548082",
  addressLines: [],
};

const DEFAULT_LEGAL: LegalControllerSettings = {
  name: "",
  email: "",
  phone: "",
  phoneHref: "",
  web: "",
  webHref: "",
  lines: [],
};

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function arrayToLines(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value.filter((v): v is string => typeof v === "string").join("\n");
}

function parseBrand(value: unknown): BrandSettings {
  const r = asRecord(value);
  return {
    name: typeof r.name === "string" ? r.name : DEFAULT_BRAND.name,
    primary: typeof r.primary === "string" ? r.primary : DEFAULT_BRAND.primary,
    surface: typeof r.surface === "string" ? r.surface : DEFAULT_BRAND.surface,
    background: typeof r.background === "string" ? r.background : DEFAULT_BRAND.background,
    ink: typeof r.ink === "string" ? r.ink : DEFAULT_BRAND.ink,
    muted: typeof r.muted === "string" ? r.muted : DEFAULT_BRAND.muted,
    crimson: typeof r.crimson === "string" ? r.crimson : DEFAULT_BRAND.crimson,
  };
}

function parseTypography(value: unknown): TypographySettings {
  const r = asRecord(value);
  return {
    displayFont: typeof r.displayFont === "string" ? r.displayFont : DEFAULT_TYPOGRAPHY.displayFont,
    bodyFont: typeof r.bodyFont === "string" ? r.bodyFont : DEFAULT_TYPOGRAPHY.bodyFont,
    displayWeight: typeof r.displayWeight === "number" ? r.displayWeight : DEFAULT_TYPOGRAPHY.displayWeight,
    bodyWeight: typeof r.bodyWeight === "number" ? r.bodyWeight : DEFAULT_TYPOGRAPHY.bodyWeight,
  };
}

function parseContact(value: unknown): ContactSettings {
  const r = asRecord(value);
  return {
    email: typeof r.email === "string" ? r.email : DEFAULT_CONTACT.email,
    phone: typeof r.phone === "string" ? r.phone : DEFAULT_CONTACT.phone,
    phoneHref: typeof r.phoneHref === "string" ? r.phoneHref : DEFAULT_CONTACT.phoneHref,
    addressLines: Array.isArray(r.addressLines)
      ? r.addressLines.filter((line): line is string => typeof line === "string")
      : [],
  };
}

function parseLegal(value: unknown): LegalControllerSettings {
  const r = asRecord(value);
  return {
    name: typeof r.name === "string" ? r.name : "",
    email: typeof r.email === "string" ? r.email : "",
    phone: typeof r.phone === "string" ? r.phone : "",
    phoneHref: typeof r.phoneHref === "string" ? r.phoneHref : "",
    web: typeof r.web === "string" ? r.web : "",
    webHref: typeof r.webHref === "string" ? r.webHref : "",
    lines: Array.isArray(r.lines) ? r.lines.filter((line): line is string => typeof line === "string") : [],
  };
}

function parseSocial(value: unknown): { facebook: string; instagram: string; linkedin: string } {
  const links = Array.isArray(value) ? value : [];
  const find = (label: string) => {
    const match = links.find(
      (item) =>
        item &&
        typeof item === "object" &&
        "label" in item &&
        typeof (item as { label: unknown }).label === "string" &&
        (item as { label: string }).label.toLowerCase() === label.toLowerCase(),
    );
    if (match && typeof match === "object" && "href" in match && typeof (match as { href: unknown }).href === "string") {
      return (match as { href: string }).href;
    }
    return "";
  };
  return {
    facebook: find("Facebook"),
    instagram: find("Instagram"),
    linkedin: find("Linkedin") || find("LinkedIn"),
  };
}

function buildSocialLinks(facebook: string, instagram: string, linkedin: string): SocialLink[] {
  const links: SocialLink[] = [];
  if (facebook.trim()) links.push({ label: "Facebook", href: facebook.trim() });
  if (instagram.trim()) links.push({ label: "Instagram", href: instagram.trim() });
  if (linkedin.trim()) links.push({ label: "Linkedin", href: linkedin.trim() });
  return links;
}

function ColorField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const safeColor = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";
  return (
    <div>
      <label className={adminLabel}>{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          className="h-10 w-12 shrink-0 cursor-pointer rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-white p-1"
          value={safeColor}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label={`${label} color picker`}
        />
        <input
          className={adminInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="#e01e26"
        />
      </div>
    </div>
  );
}

export function AdminSite() {
  const { refetch } = useCms();
  const { role } = useAdminAuth();
  const canMutate = role !== "viewer";

  const [passthrough, setPassthrough] = useState<Record<string, Json>>({});
  const [brand, setBrand] = useState<BrandSettings>(DEFAULT_BRAND);
  const [typography, setTypography] = useState<TypographySettings>(DEFAULT_TYPOGRAPHY);
  const [contact, setContact] = useState<ContactSettings>(DEFAULT_CONTACT);
  const [contactAddressText, setContactAddressText] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");
  const [legal, setLegal] = useState<LegalControllerSettings>(DEFAULT_LEGAL);
  const [legalLinesText, setLegalLinesText] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const applyRows = useCallback((rows: SettingRow[]) => {
    const byKey = Object.fromEntries(rows.map((row) => [row.key, row.value]));

    const nextPassthrough: Record<string, Json> = {};
    for (const key of SETTING_KEYS) {
      if (byKey[key] !== undefined) {
        nextPassthrough[key] = byKey[key] as Json;
      }
    }
    setPassthrough(nextPassthrough);

    setBrand(parseBrand(byKey.brand));
    setTypography(parseTypography(byKey.typography));

    const parsedContact = parseContact(byKey.contact);
    setContact(parsedContact);
    setContactAddressText(arrayToLines(parsedContact.addressLines));

    const social = parseSocial(byKey.social);
    setSocialFacebook(social.facebook);
    setSocialInstagram(social.instagram);
    setSocialLinkedin(social.linkedin);

    const parsedLegal = parseLegal(byKey.legal_controller);
    setLegal(parsedLegal);
    setLegalLinesText(arrayToLines(parsedLegal.lines));
  }, []);

  const refresh = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data, error } = await sb.from("site_settings").select("*").order("key");
    if (error) setErr(error.message);
    else {
      setErr(null);
      applyRows(data ?? []);
    }
  }, [applyRows]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveAll = async () => {
    if (!canMutate) return;
    const sb = getSupabase();
    if (!sb) return;

    setSaving(true);
    setSaveErr(null);

    const now = new Date().toISOString();
    const upserts: SettingRow[] = [
      {
        key: "brand",
        value: { ...asRecord(passthrough.brand), ...brand } as Json,
        updated_at: now,
      },
      {
        key: "typography",
        value: { ...asRecord(passthrough.typography), ...typography } as Json,
        updated_at: now,
      },
      {
        key: "contact",
        value: {
          ...asRecord(passthrough.contact),
          email: contact.email.trim(),
          phone: contact.phone.trim(),
          phoneHref: contact.phoneHref.trim(),
          addressLines: linesToArray(contactAddressText),
        } as Json,
        updated_at: now,
      },
      {
        key: "social",
        value: buildSocialLinks(socialFacebook, socialInstagram, socialLinkedin) as unknown as Json,
        updated_at: now,
      },
      {
        key: "legal_controller",
        value: {
          ...asRecord(passthrough.legal_controller),
          name: legal.name.trim(),
          email: legal.email.trim(),
          phone: legal.phone.trim(),
          phoneHref: legal.phoneHref.trim(),
          web: legal.web.trim(),
          webHref: legal.webHref.trim(),
          lines: linesToArray(legalLinesText),
        } as Json,
        updated_at: now,
      },
    ];

    for (const key of ["nav", "footer", "admin_theme"] as const) {
      if (passthrough[key] !== undefined) {
        upserts.push({ key, value: passthrough[key], updated_at: now });
      }
    }

    const { error } = await sb.from("site_settings").upsert(upserts, { onConflict: "key" });
    setSaving(false);

    if (error) {
      setSaveErr(error.message);
      return;
    }

    await refresh();
    await refetch();

    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--admin-primary", brand.primary || "#e01e26");
    }
  };

  return (
    <div>
      <AdminPageHeading
        title="Site settings"
        description="Brand, contact, social, and legal configuration."
        actions={
          canMutate ? (
            <button type="button" className={adminBtnPrimary} onClick={() => void saveAll()} disabled={saving}>
              <Save className="size-4" />
              {saving ? "Saving…" : "Save all"}
            </button>
          ) : null
        }
      />

      {err ? <p className="mb-4 text-sm text-red-600">{err}</p> : null}
      {saveErr ? <p className="mb-4 text-sm text-red-600">{saveErr}</p> : null}

      <div className="space-y-6">
        <section className={`${adminCard} space-y-4`}>
          <h2 className={adminSectionTitle}>Brand &amp; colors</h2>
          <div>
            <label className={adminLabel}>Brand name</label>
            <input
              className={adminInput}
              value={brand.name}
              onChange={(e) => setBrand({ ...brand, name: e.target.value })}
              disabled={!canMutate}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ColorField
              label="Primary"
              value={brand.primary}
              onChange={(primary) => setBrand({ ...brand, primary })}
              disabled={!canMutate}
            />
            <ColorField
              label="Surface"
              value={brand.surface}
              onChange={(surface) => setBrand({ ...brand, surface })}
              disabled={!canMutate}
            />
            <ColorField
              label="Background"
              value={brand.background}
              onChange={(background) => setBrand({ ...brand, background })}
              disabled={!canMutate}
            />
            <ColorField
              label="Ink"
              value={brand.ink}
              onChange={(ink) => setBrand({ ...brand, ink })}
              disabled={!canMutate}
            />
            <ColorField
              label="Muted"
              value={brand.muted}
              onChange={(muted) => setBrand({ ...brand, muted })}
              disabled={!canMutate}
            />
            <ColorField
              label="Crimson"
              value={brand.crimson}
              onChange={(crimson) => setBrand({ ...brand, crimson })}
              disabled={!canMutate}
            />
          </div>
        </section>

        <section className={`${adminCard} space-y-4`}>
          <h2 className={adminSectionTitle}>Typography</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabel}>Display font</label>
              <input
                className={adminInput}
                value={typography.displayFont}
                onChange={(e) => setTypography({ ...typography, displayFont: e.target.value })}
                disabled={!canMutate}
              />
            </div>
            <div>
              <label className={adminLabel}>Body font</label>
              <input
                className={adminInput}
                value={typography.bodyFont}
                onChange={(e) => setTypography({ ...typography, bodyFont: e.target.value })}
                disabled={!canMutate}
              />
            </div>
            <div>
              <label className={adminLabel}>Display weight</label>
              <input
                type="number"
                className={adminInput}
                value={typography.displayWeight}
                onChange={(e) =>
                  setTypography({ ...typography, displayWeight: Number(e.target.value) || 0 })
                }
                disabled={!canMutate}
              />
            </div>
            <div>
              <label className={adminLabel}>Body weight</label>
              <input
                type="number"
                className={adminInput}
                value={typography.bodyWeight}
                onChange={(e) => setTypography({ ...typography, bodyWeight: Number(e.target.value) || 0 })}
                disabled={!canMutate}
              />
            </div>
          </div>
        </section>

        <section className={`${adminCard} space-y-4`}>
          <h2 className={adminSectionTitle}>Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabel}>Email</label>
              <input
                className={adminInput}
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                disabled={!canMutate}
              />
            </div>
            <div>
              <label className={adminLabel}>Phone</label>
              <input
                className={adminInput}
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                disabled={!canMutate}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={adminLabel}>Phone href</label>
              <input
                className={adminInput}
                value={contact.phoneHref}
                onChange={(e) => setContact({ ...contact, phoneHref: e.target.value })}
                disabled={!canMutate}
                placeholder="tel:+97145548082"
              />
            </div>
          </div>
          <div>
            <label className={adminLabel}>Address lines (one per line)</label>
            <textarea
              className={adminTextarea}
              value={contactAddressText}
              onChange={(e) => setContactAddressText(e.target.value)}
              disabled={!canMutate}
              rows={4}
            />
          </div>
        </section>

        <section className={`${adminCard} space-y-4`}>
          <h2 className={adminSectionTitle}>Social</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabel}>Facebook URL</label>
              <input
                className={adminInput}
                value={socialFacebook}
                onChange={(e) => setSocialFacebook(e.target.value)}
                disabled={!canMutate}
                placeholder="https://www.facebook.com/…"
              />
            </div>
            <div>
              <label className={adminLabel}>Instagram URL</label>
              <input
                className={adminInput}
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                disabled={!canMutate}
                placeholder="https://www.instagram.com/…"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={adminLabel}>LinkedIn URL</label>
              <input
                className={adminInput}
                value={socialLinkedin}
                onChange={(e) => setSocialLinkedin(e.target.value)}
                disabled={!canMutate}
                placeholder="https://www.linkedin.com/company/…"
              />
            </div>
          </div>
        </section>

        <section className={`${adminCard} space-y-4`}>
          <h2 className={adminSectionTitle}>Legal controller</h2>
          <div>
            <label className={adminLabel}>Name</label>
            <input
              className={adminInput}
              value={legal.name}
              onChange={(e) => setLegal({ ...legal, name: e.target.value })}
              disabled={!canMutate}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabel}>Email</label>
              <input
                className={adminInput}
                type="email"
                value={legal.email}
                onChange={(e) => setLegal({ ...legal, email: e.target.value })}
                disabled={!canMutate}
              />
            </div>
            <div>
              <label className={adminLabel}>Phone</label>
              <input
                className={adminInput}
                value={legal.phone}
                onChange={(e) => setLegal({ ...legal, phone: e.target.value })}
                disabled={!canMutate}
              />
            </div>
            <div>
              <label className={adminLabel}>Phone href</label>
              <input
                className={adminInput}
                value={legal.phoneHref}
                onChange={(e) => setLegal({ ...legal, phoneHref: e.target.value })}
                disabled={!canMutate}
              />
            </div>
            <div>
              <label className={adminLabel}>Website label</label>
              <input
                className={adminInput}
                value={legal.web}
                onChange={(e) => setLegal({ ...legal, web: e.target.value })}
                disabled={!canMutate}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={adminLabel}>Website href</label>
              <input
                className={adminInput}
                value={legal.webHref}
                onChange={(e) => setLegal({ ...legal, webHref: e.target.value })}
                disabled={!canMutate}
              />
            </div>
          </div>
          <div>
            <label className={adminLabel}>Address lines (one per line)</label>
            <textarea
              className={adminTextarea}
              value={legalLinesText}
              onChange={(e) => setLegalLinesText(e.target.value)}
              disabled={!canMutate}
              rows={4}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
