import aboutHeroDesktop from "@/Assets/about-us-desktop.webp";
import aboutHeroMobile from "@/Assets/about-us-mobile.webp";
import servicesHeroImage from "@/Assets/projects-twentyone06.jpg";
import projectsHeroImage from "@/Assets/background.webp";
import philosophyImage from "@/Assets/we-design-for-twentyone06.webp";

export const SECTION_BACKGROUND_SETTING_KEY = "section_backgrounds";

export const SECTION_BACKGROUND_KEYS = [
  "newHomeHero",
  "newHomePhilosophy",
  "newHomeContact",
  "about",
  "contact",
  "faq",
  "journal",
  "services",
  "projects",
] as const;

export type SectionBackgroundKey = (typeof SECTION_BACKGROUND_KEYS)[number];

export type SectionBackgroundSet = {
  desktop: string;
  tablet: string;
  mobile: string;
};

export type SectionBackgroundConfig = Record<
  SectionBackgroundKey,
  SectionBackgroundSet
>;

export const SECTION_BACKGROUND_META: Record<
  SectionBackgroundKey,
  { label: string; description: string }
> = {
  about: {
    label: "About",
    description: "About page hero background",
  },
  contact: {
    label: "Contact",
    description: "Contact page hero background",
  },
  faq: {
    label: "FAQ",
    description: "FAQ page hero background",
  },
  journal: {
    label: "Our Blogs",
    description: "Journal / blogs index hero background",
  },
  services: {
    label: "Services",
    description: "Services page hero background",
  },
  projects: {
    label: "Projects",
    description: "Projects page full-bleed hero background",
  },
  newHomeHero: {
    label: "New home - Hero",
    description: "Homepage hero atmosphere image",
  },
  newHomePhilosophy: {
    label: "New home - Philosophy",
    description: "Philosophy section art panel",
  },
  newHomeContact: {
    label: "New home - Contact panel",
    description:
      "Desktop right-side image beside the homepage contact form (~60% width)",
  },
};

/** Built-in asset fallbacks when CMS fields are empty. */
export const SECTION_BACKGROUND_DEFAULTS: SectionBackgroundConfig = {
  about: {
    desktop: aboutHeroDesktop,
    tablet: aboutHeroDesktop,
    mobile: aboutHeroMobile,
  },
  contact: {
    desktop: aboutHeroDesktop,
    tablet: aboutHeroDesktop,
    mobile: aboutHeroMobile,
  },
  faq: {
    desktop: aboutHeroDesktop,
    tablet: aboutHeroDesktop,
    mobile: aboutHeroMobile,
  },
  journal: {
    desktop: aboutHeroDesktop,
    tablet: aboutHeroDesktop,
    mobile: aboutHeroMobile,
  },
  services: {
    desktop: servicesHeroImage,
    tablet: servicesHeroImage,
    mobile: servicesHeroImage,
  },
  projects: {
    desktop: projectsHeroImage,
    tablet: projectsHeroImage,
    mobile: projectsHeroImage,
  },
  newHomeHero: {
    desktop: "",
    tablet: "",
    mobile: "",
  },
  newHomePhilosophy: {
    desktop: philosophyImage,
    tablet: philosophyImage,
    mobile: philosophyImage,
  },
  newHomeContact: {
    desktop: aboutHeroDesktop,
    tablet: aboutHeroDesktop,
    mobile: aboutHeroMobile,
  },
};

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function readUrl(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseSet(
  value: unknown,
  fallback: SectionBackgroundSet,
): SectionBackgroundSet {
  const r = asRecord(value);
  return {
    desktop: readUrl(r.desktop) || fallback.desktop,
    tablet: readUrl(r.tablet) || fallback.tablet || fallback.desktop,
    mobile: readUrl(r.mobile) || fallback.mobile || fallback.desktop,
  };
}

/** Raw CMS values (empty string allowed) for the admin editor. */
export function parseSectionBackgroundsDraft(
  value: unknown,
): Record<SectionBackgroundKey, SectionBackgroundSet> {
  const root = asRecord(value);
  const out = {} as Record<SectionBackgroundKey, SectionBackgroundSet>;
  for (const key of SECTION_BACKGROUND_KEYS) {
    const r = asRecord(root[key]);
    out[key] = {
      desktop: readUrl(r.desktop),
      tablet: readUrl(r.tablet),
      mobile: readUrl(r.mobile),
    };
  }
  return out;
}

/** Resolved URLs with asset fallbacks for the public site. */
export function resolveSectionBackgrounds(
  siteSettings: Record<string, unknown> | undefined | null,
): SectionBackgroundConfig {
  const raw = siteSettings?.[SECTION_BACKGROUND_SETTING_KEY];
  const root = asRecord(raw);
  const out = {} as SectionBackgroundConfig;
  for (const key of SECTION_BACKGROUND_KEYS) {
    out[key] = parseSet(root[key], SECTION_BACKGROUND_DEFAULTS[key]);
  }
  return out;
}

export function getSectionBackground(
  siteSettings: Record<string, unknown> | undefined | null,
  key: SectionBackgroundKey,
): SectionBackgroundSet {
  return resolveSectionBackgrounds(siteSettings)[key];
}
