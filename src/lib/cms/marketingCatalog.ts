import {
  aboutPage,
  contactPage,
  faqPage,
  journalPage,
  newHome,
  notFoundPage,
  privacyPage,
  projectsPage,
  servicesPage,
  termsPage,
} from "../../data/content";
import type { PageSeo } from "./pageSeo";

export type MarketingCatalogEntry = {
  slug: string;
  title: string;
  content: Record<string, unknown>;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphsToHtml(paragraphs: string[]): string {
  return paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
}

function sectionsToHtml(
  sections: { title: string; paragraphs: string[] }[],
): string {
  return sections
    .map((section) => {
      const paras = paragraphsToHtml(section.paragraphs);
      return `<h2>${escapeHtml(section.title)}</h2>${paras}`;
    })
    .join("\n");
}

function withChrome(
  seo: PageSeo,
  chrome: {
    eyebrow?: string;
    title?: string[];
    description?: string;
    body_html?: string;
  },
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    ...extra,
    ...chrome,
    seo,
  };
}

/**
 * Canonical marketing records, built from the live page copy in content.ts.
 * Used to seed / align admin Marketing — never the other way around.
 */
export function getMarketingCatalog(): MarketingCatalogEntry[] {
  const homeTitle = newHome.hero.titleLines.map(
    (line) => `${line.before}${line.accent}`,
  );

  return [
    {
      slug: "home",
      title: "Home",
      content: withChrome(
        newHome.seo,
        {
          eyebrow: newHome.hero.eyebrow,
          title: homeTitle,
          description: newHome.hero.description,
          body_html: `<p>${escapeHtml(newHome.philosophy.body)}</p>`,
        },
        { ...newHome },
      ),
    },
    {
      slug: "about",
      title: "About",
      content: withChrome(
        aboutPage.seo,
        {
          eyebrow: aboutPage.eyebrow,
          title: [...aboutPage.title],
          description: aboutPage.storyTitle.join(" "),
          body_html: paragraphsToHtml(aboutPage.story),
        },
        {
          storyTitle: aboutPage.storyTitle,
          story: aboutPage.story,
          recognition: aboutPage.recognition,
          recognitionCredits: aboutPage.recognitionCredits,
          cta: aboutPage.cta,
          team: aboutPage.team,
          milestones: aboutPage.milestones,
          workTogether: aboutPage.workTogether,
        },
      ),
    },
    {
      slug: "contact",
      title: "Contact",
      content: withChrome(
        contactPage.seo,
        {
          eyebrow: contactPage.eyebrow,
          title: [...contactPage.title],
          description: contactPage.description,
          body_html: `<p>${escapeHtml(contactPage.body)}</p>`,
        },
        {
          body: contactPage.body,
          map: contactPage.map,
          details: contactPage.details,
          form: contactPage.form,
        },
      ),
    },
    {
      slug: "services",
      title: "Services",
      content: withChrome(
        servicesPage.seo,
        {
          eyebrow: servicesPage.eyebrow,
          title: [...servicesPage.title],
          description: servicesPage.description,
          body_html: servicesPage.sections
            .map(
              (section) =>
                `<h2>${escapeHtml(section.title)}</h2>${paragraphsToHtml(section.body)}`,
            )
            .join("\n"),
        },
        {
          contact: servicesPage.contact,
        },
      ),
    },
    {
      slug: "projects",
      title: "Projects",
      content: withChrome(
        projectsPage.seo,
        {
          eyebrow: projectsPage.hero.eyebrow,
          title: projectsPage.hero.titleLines.map((line) => line.text),
          description: projectsPage.hero.description,
          body_html: `<p>${escapeHtml(projectsPage.philosophy.body)}</p>`,
        },
        {
          philosophy: projectsPage.philosophy,
        },
      ),
    },
    {
      slug: "journal",
      title: "Our Blogs",
      content: withChrome(journalPage.seo, {
        eyebrow: journalPage.eyebrow,
        title: [...journalPage.title],
        description: journalPage.seo.description,
        body_html: "",
      }),
    },
    {
      slug: "faq",
      title: "FAQ",
      content: withChrome(
        faqPage.seo,
        {
          eyebrow: faqPage.eyebrow,
          title: [...faqPage.title],
          description: faqPage.description,
          body_html: "",
        },
      ),
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      content: withChrome(
        privacyPage.seo,
        {
          eyebrow: privacyPage.eyebrow,
          title: [...privacyPage.title],
          description: privacyPage.description,
          body_html: sectionsToHtml(privacyPage.sections),
        },
        {
          sections: privacyPage.sections,
          controller: privacyPage.controller,
          image: privacyPage.image ?? null,
        },
      ),
    },
    {
      slug: "terms",
      title: "Terms and Conditions",
      content: withChrome(
        termsPage.seo,
        {
          eyebrow: termsPage.eyebrow,
          title: [...termsPage.title],
          description: termsPage.description,
          body_html: sectionsToHtml(termsPage.sections),
        },
        {
          sections: termsPage.sections,
          controller: termsPage.controller,
          image: termsPage.image ?? null,
        },
      ),
    },
    {
      slug: "404",
      title: "404",
      content: withChrome(notFoundPage.seo, {
        eyebrow: notFoundPage.eyebrow,
        title: [...notFoundPage.title],
        description: notFoundPage.description,
        body_html: `<p>${escapeHtml(notFoundPage.description)}</p>`,
      }),
    },
  ];
}

export const HOME_SEO_SLUGS = ["home", "new-home"] as const;
