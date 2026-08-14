# Twentyone06 — Brand UI/UX Bible

This is the source of truth for visual and interaction design on the site. **All new pages and major UI changes must follow it.** Cursor agents load a condensed version via `.cursor/rules/brand-uiux-bible.mdc`.

**Reference build:** `/new-home` → `src/components/pages/new-home-page.tsx` + `src/components/new-home/*`  
**Tokens:** `src/styles/app.css`  
**Shell:** `src/components/page-shell.tsx`

---

## 1. Brand surfaces

Two complementary languages. Pick one per section; don’t muddy them mid-block.

### Cream (warm interior / studio pages)

| Token | Hex | Use |
|-------|-----|-----|
| `--cream` | `#f4ebdf` | Page background |
| `--cream-2` / `--cream-3` | `#efe3d3` / `#e9dcc9` | Soft depth |
| `--espresso` | `#35291d` | Primary text / dark UI |
| `--crimson` | `#cc0001` | Accent (sparingly) |
| `--ink` / `--muted-ink` | `#2b2117` / `#8c7d6b` | Body / secondary |
| `--sand` / `--line` | `#d9c9b2` / `#ddccb6` | Borders, soft fills |

### Dark editorial (high-impact / new-home)

| Token | Hex | Use |
|-------|-----|-----|
| `--nh-black` | `#000000` | Background / footer |
| `--nh-white` | `#ffffff` | Text on dark |
| `--nh-red` | `#cc0001` | Accent, CTA, emphasis line |
| `--nh-gray` | `#f2f2f2` | Light band on dark pages |
| `--nh-muted` | `#8a8a8a` | Secondary copy |
| `--nh-panel` | `#141414` | Panels |
| `--nh-line` | `rgba(255,255,255,0.18)` | Hairlines |

Always use CSS variables (`bg-[var(--nh-red)]`, `text-espresso`, etc.). Do not invent new brand hexes.

---

## 2. Typography

| Role | Face | Weight | Tracking / case |
|------|------|--------|------------------|
| Display titles | **Zeuxis** (`font-display`) | **500+** (medium; semibold for hero emphasis) | Uppercase (built into `.font-display`); letter-spacing **`0.02em`** + word-spacing **`0.04em`** (Zeuxis is condensed — do **not** use `tracking-tighter`); leading **~1.02–1.08** |
| Body / UI | **Inter Tight** (`font-sans`) | **300** (light) | Slight positive tracking on body (`0.01em` on `body`) |
| Section eyebrows | Inter Tight | 300–400 | Small caps style: `uppercase` + wide tracking `~0.22em` |

### Rules

- Titles must use `font-display`. Never set display titles to `font-normal` (400) — it overrides the brand medium weight.
- Size with `clamp()` for fluid display type (see hero / services / projects on `/new-home`).
- Multi-line heroes: one line per masked row; optional last line in `--nh-red` for emphasis.
- Do not use Inter, Roboto, Arial, or system UI as display faces.

---

## 3. Page shell & chrome

1. **Header:** `NhHeader` only (`src/components/new-home/nh-header.tsx`).
   - `variant="overlay"` — dark full-bleed heroes (transparent over media).
   - `variant="solid"` — cream / light pages.
2. **Footer:** `SiteFooter` — black/white sitewide; `showCta` defaults **off**.
3. **404:** dedicated not-found page; no footer.
4. Prefer `PageShell` for cream routes so header/footer stay consistent.

Nav pattern: logo left, primary links centered, red cut-corner hex **Let’s Talk**, circular menu control + full-screen menu.

---

## 4. Layout & composition

- **Full width** marketing sections. Gutters: `px-5`, `md:px-10` or `md:px-[7vw]`.
- Avoid wrapping entire pages in `max-w-[1440px]` unless a reading column truly needs it.
- **One job per section:** one purpose, one headline, usually one short supporting sentence.
- **Hero budget (first viewport):** brand presence + one headline + one support + one CTA group + one dominant **edge-to-edge** image. No stats, schedules, badges, or chips over hero media.
- First viewport must read as **one composition**, not a dashboard.
- Brand test: if removing the nav makes the first screen feel like another brand, branding is too weak.
- **Cards:** default none. Never in the hero. Prefer editorial full-bleed image panels (services) over bordered/shadow cards. Cards only when they contain a real user interaction.

---

## 5. Section patterns (from `/new-home`)

| Section | Pattern |
|---------|---------|
| Hero | Full-bleed image, bottom-aligned display headline, line-mask reveal |
| Philosophy | Split dark panel + media; accent line in red |
| Services | Light gray band; display title + “View All”; editorial image cards; number above icon; desktop hover detail; mobile one-card carousel + flat dots |
| Projects | Dark band; title + View All; desktop circle prev/next; carousel; no orphan trailing card |
| Clients | Infinite CSS marquee (`.marquee-track`), pause on hover |
| Testimonial | Image + quote sync; flat dots; ~7s autoplay pause on hover |
| Contact strip | Red CTA square + form; custom select (not native); optional large brand graphic |

Reuse these rhythms on new pages rather than inventing new section types.

---

## 6. Motion

- Shared helpers: `EASE`, `Reveal`, `useReducedMotionSafe` from `@/components/anim`.
- Ship **2–3 intentional** motions per visually led page (masked titles, fade-up sections, carousel).
- Always respect `prefers-reduced-motion`.
- Marquees and carousels should pause when the user is interacting / hovering when appropriate.

---

## 7. Content & assets

- Structured copy in `src/data/content.ts` (or dedicated data modules).
- Prefer local assets in `src/Assets/` over anonymous stock when brand photography exists.
- Imagery should show place, product, craft, or atmosphere — not abstract decoration as the main idea.

---

## 8. Anti-patterns

- Purple / indigo gradient “AI default” themes  
- Warm cream + terracotta serif cliché when it fights this system (cream here is brand-specific with Zeuxis, not generic)  
- Glow effects, heavy multi-layer shadows, pill clusters, emoji UI  
- Rounded pill CTAs — use `BrandButton` / `.btn-cut` (pointed hex ends) 
- Inset / rounded hero cards instead of full-bleed heroes on landing surfaces  
- Mixing `--nh-*` and cream tokens inside one undecided section  
- Restoring the old cream `SiteHeader` for new work  

---

## 9. New page checklist

- [ ] Route + page component + section components  
- [ ] Copy in content data, not scattered strings  
- [ ] `PageShell` / `NhHeader` variant + `SiteFooter` correct  
- [ ] Display titles: `font-display`, weight ≥ 500, no `font-normal`  
- [ ] Full-width section rhythm + correct gutters  
- [ ] One job per section; hero budget respected  
- [ ] Motion + reduced-motion  
- [ ] Desktop and mobile verified  
