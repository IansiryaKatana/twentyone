export const adminBtnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius-lg)] bg-[var(--admin-primary)] px-4 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

export const adminBtnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-white px-4 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-[var(--admin-ink)] transition hover:bg-[var(--admin-bg)] disabled:cursor-not-allowed disabled:opacity-50";

export const adminBtnGhost =
  "inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius-lg)] px-3 py-2 text-sm font-medium text-[var(--admin-muted)] transition hover:bg-white hover:text-[var(--admin-ink)] disabled:cursor-not-allowed disabled:opacity-50";

export const adminBtnDanger =
  "inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius-lg)] border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50";

export const adminInput =
  "w-full rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-white px-3 py-2.5 text-sm text-[var(--admin-ink)] placeholder:text-[var(--admin-muted)] outline-none ring-0 focus:border-[var(--admin-primary)] focus:outline-none focus:ring-0 focus-visible:border-[var(--admin-primary)] focus-visible:outline-none focus-visible:ring-0";

export const adminTextarea =
  "min-h-[120px] w-full resize-y rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-white px-3 py-2.5 text-sm text-[var(--admin-ink)] placeholder:text-[var(--admin-muted)] outline-none ring-0 focus:border-[var(--admin-primary)] focus:outline-none focus:ring-0 focus-visible:border-[var(--admin-primary)] focus-visible:outline-none focus-visible:ring-0";

export const adminSelect =
  "w-full appearance-none rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-white px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none ring-0 focus:border-[var(--admin-primary)] focus:outline-none focus:ring-0 focus-visible:border-[var(--admin-primary)] focus-visible:outline-none focus-visible:ring-0";

export const adminLabel =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[var(--admin-muted)]";

export const adminNavLink =
  "flex items-center gap-3 rounded-[var(--admin-radius-lg)] px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white";

export const adminNavLinkActive =
  "flex items-center gap-3 rounded-[var(--admin-radius-lg)] bg-white/10 px-3 py-2.5 text-sm font-medium text-white";

export const adminCard =
  "rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-white p-5 shadow-sm";

export const adminPageTitle =
  "font-display text-2xl font-medium uppercase tracking-tight text-[var(--admin-ink)]";

/** Same weight/size as page titles — use for in-page section heads (e.g. dashboard blocks). */
export const adminSectionTitle = adminPageTitle;

export const adminMuted =
  "text-sm font-light text-[var(--admin-muted)]";

export const adminTableWrap =
  "overflow-x-auto rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-white";

export const adminTable =
  "min-w-full divide-y divide-[var(--admin-border)] text-sm";

export const adminTableHeadCell =
  "px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-[var(--admin-muted)]";

export const adminTableCell =
  "px-4 py-3 align-middle text-[var(--admin-ink)]";

export const adminSidebar =
  "flex h-full flex-col bg-[var(--admin-surface)] text-white";

export const adminShell =
  "bg-[var(--admin-bg)] text-[var(--admin-ink)]";

export const adminToolbar =
  "flex flex-wrap items-center justify-between gap-3 border-b border-[var(--admin-border)] bg-white px-5 py-4";

export const adminStepActive =
  "rounded-full bg-[var(--admin-primary)] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-white";

export const adminStepInactive =
  "rounded-full border border-[var(--admin-border)] bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[var(--admin-muted)]";

export function adminNavClass(active: boolean): string {
  return active ? adminNavLinkActive : adminNavLink;
}
