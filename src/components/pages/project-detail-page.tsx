import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { NhHeader } from "@/components/new-home/nh-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { PdIntro } from "@/components/projects/pd-intro";
import { PdCase } from "@/components/projects/pd-case";
import { PdGallery } from "@/components/projects/pd-gallery";
import { PdRelated } from "@/components/projects/pd-related";
import { ProjectCaseView } from "@/components/projects/project-case";
import { getProjectCase } from "@/data/cases.generated";

function pickGallery(project: Project) {
  const unique = Array.from(new Set([project.hero, ...project.gallery])).filter(
    Boolean,
  );
  // Prefer non-hero shots for case study frames
  const rest = unique.filter((src) => src !== project.hero);
  const pool = rest.length >= 3 ? rest : unique;

  const featured = [
    pool[0],
    pool[1],
    pool[2],
    pool[pool.length - 1] !== pool[2] ? pool[pool.length - 1] : pool[3],
  ].filter(Boolean) as string[];

  const used = new Set(featured);
  const grid = pool.filter((src) => !used.has(src));
  // Ensure the grid still feels rich - re-include mid frames if needed
  const galleryImages =
    grid.length >= 3
      ? grid
      : pool.filter((src) => src !== featured[0]).slice(0, 6);

  return { featured, galleryImages };
}

function nextProject(list: Project[], slug: string): Project | null {
  if (list.length < 2) return null;
  const idx = list.findIndex((p) => p.slug === slug);
  if (idx < 0) return list[0] ?? null;
  return list[(idx + 1) % list.length] ?? null;
}

export function ProjectDetailPage({ project: projectProp }: { project: Project }) {
  const {
    getProject,
    getRelatedProjects: getRelated,
    projects: allProjects,
  } = useCmsContent();
  const project = getProject(projectProp.slug) ?? projectProp;

  if (!project) {
    return (
      <div className="relative min-h-screen bg-[var(--nh-black)]">
        <NhHeader variant="overlay" />
        <main>
          <section className="px-5 pb-28 pt-28 sm:pt-36 md:px-10">
            <h1 className="font-display text-4xl font-medium uppercase text-[var(--nh-white)]">
              Project not found
            </h1>
            <Link
              to="/projects"
              className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--nh-muted)] transition-colors hover:text-[var(--nh-white)]"
            >
              <ArrowLeft className="size-4" />
              Back to projects
            </Link>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const related = getRelated(project.slug, 4);
  const next = nextProject(allProjects, project.slug);
  const { featured, galleryImages } = pickGallery(project);
  const study = getProjectCase(project.slug);

  return (
    <div className="relative min-h-screen bg-[var(--nh-black)]">
      <NhHeader variant="overlay" />
      <main>
        {study ? (
          <ProjectCaseView study={study} />
        ) : (
          <>
            <PdIntro project={project} />
            <PdCase project={project} featured={featured} />
            <PdGallery project={project} images={galleryImages} />
          </>
        )}
        <PdRelated next={next} related={related} />
      </main>
      <SiteFooter />
    </div>
  );
}
