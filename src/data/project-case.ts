export type CaseFact = {
  label: string;
  value: string;
};

export type CaseBlock =
  | { type: "fullBleed"; src: string; tall?: boolean }
  | { type: "marks"; srcs: string[] }
  | {
      type: "copy";
      eyebrow: string;
      title: string[];
      paragraphs: string[];
      images?: string[];
      layout?: "thumbs-left" | "image-right" | "image-below";
    }
  | { type: "gallery"; srcs: string[]; columns?: 2 | 3 }
  | { type: "caption"; text: string }
  | { type: "labeled"; items: { src: string; label: string }[] }
  | {
      type: "review";
      quote: string;
      name: string;
      role?: string;
      org?: string;
      image?: string;
    };

export type ProjectCaseStudy = {
  slug: string;
  eyebrow: string;
  tags: string;
  title: string;
  titleLines: string[];
  intro: string;
  facts: CaseFact[];
  blocks: CaseBlock[];
};

export function splitTitleLines(title: string): string[] {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [title];
  if (words.length === 2) return words;
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export function eyebrowForTitle(title: string): string {
  const t = title.toLowerCase();
  if (/concept/.test(t)) return "Concept";
  if (/direction/.test(t)) return "Direction";
  if (/treatment|room|space/.test(t)) return "Spaces";
  if (/entrance|arrival/.test(t)) return "Arrival";
  if (/experience/.test(t)) return "Experience";
  if (/review/.test(t)) return "Client Review";
  if (/brand/.test(t)) return "Brand";
  if (/interior|design/.test(t)) return "Design";
  return "Chapter";
}
