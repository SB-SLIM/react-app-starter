---
name: responsive-ui-review
description: >
  Review the entire codebase for responsive UI quality. Detect layout,
  styling, accessibility, performance, and UX issues related to
  responsiveness, then automatically implement fixes. Acts as a senior
  frontend architect with expertise in responsive design, React, Next.js,
  Tailwind v4, accessibility, and design systems. Never stops at reporting —
  always modifies files directly.
---

# Responsive UI Review — Autonomous Audit & Fix

You are a senior staff frontend engineer performing a production-grade responsive
UI audit. Your standard is Vercel, Stripe, Linear, Airbnb, Shopify. You detect
issues **and fix them immediately** in the same pass. You never ask for
permission, never suggest alternatives, never leave issues unfixed if a safe
automatic fix exists.

---

## Execution Workflow

Run these phases in order. Never skip a phase.

### Phase 0 — Orientation

Before touching any file:

1. Read `CLAUDE.md` to understand the stack (Tailwind version, component library,
   framework, breakpoint system).
2. Identify all UI source directories:
   - `apps/web/app/**` — Next.js App Router
   - `apps/admin/src/**` — Vite + React
   - `apps/superadmin/src/**` — Vite + React
   - `packages/ui-components/src/**` — shared design system
   - Any additional `src/` or `app/` directories at repo root.
3. Read the shared theme/CSS entry point (e.g. `packages/ui-components/src/theme.css`)
   to extract the breakpoint scale and design token names.
4. Note the styling system in use per app: Tailwind utility classes, CSS Modules,
   Styled Components, Emotion, plain CSS — record which applies where.

### Phase 1 — Static Analysis

Scan every `.tsx`, `.jsx`, `.ts`, `.js`, `.css`, `.scss`, `.module.css` file in
the UI source directories identified above.

For each file, check every item in the **Detection Checklist** below. Log every
hit as: `FILE:LINE — CATEGORY — description`.

### Phase 2 — Fix Pass

For every logged issue that has a safe automatic fix (see **Auto-Fix Rules**),
apply the fix directly to the file. Preserve:

- Visual intent and existing design
- Component API (props, exports, class names consumed by callers)
- Accessibility attributes

Apply fixes in batches per file — one `Edit` call per changed file, not one per
issue.

### Phase 3 — Report

After all fixes are applied, output the **Report Template** below filled in with
real data.

---

## Detection Checklist

Work through every category for every file. Mark each hit for the fix pass.

### L — Layout

| ID  | Pattern to detect                                                                                  | Severity |
| --- | -------------------------------------------------------------------------------------------------- | -------- |
| L1  | `width: <number>px` on a container (not an icon/avatar)                                            | High     |
| L2  | `min-width: <number>px` > 375 on a container                                                       | High     |
| L3  | `height: <number>px` on a container that may clip content                                          | Medium   |
| L4  | `overflow: hidden` without a max-height or scroll fallback                                         | Medium   |
| L5  | `position: absolute/fixed` without responsive bounding                                             | Medium   |
| L6  | Missing `max-w-*` or `max-width` on page-level containers                                          | Medium   |
| L7  | Flex/grid children with no `min-width: 0` / `min-w-0` on text-holding nodes                        | Medium   |
| L8  | `flex-wrap: nowrap` (or missing `flex-wrap`) on multi-item rows with no overflow guard             | High     |
| L9  | `grid-template-columns` with fixed `px` column widths                                              | High     |
| L10 | `white-space: nowrap` without text-overflow truncation                                             | Medium   |
| L11 | Scrollable container without `-webkit-overflow-scrolling: touch` (legacy) or `overscroll-behavior` | Low      |
| L12 | Viewport units (`100vw`, `100vh`) without fallback for mobile browser chrome                       | Medium   |

### T — Typography

| ID  | Pattern to detect                                                                   | Severity |
| --- | ----------------------------------------------------------------------------------- | -------- |
| T1  | `font-size: <number>px` without responsive scaling                                  | High     |
| T2  | `line-height: <number>px` (absolute, not relative)                                  | Medium   |
| T3  | Text nodes missing `overflow-wrap: break-word` / `break-words` in narrow containers | Medium   |
| T4  | Long single-word strings (URLs, tokens) without `word-break: break-all`             | Medium   |
| T5  | `text-overflow: ellipsis` without `overflow: hidden` + `white-space: nowrap` triad  | Medium   |
| T6  | Heading font sizes that don't scale between mobile and desktop                      | High     |
| T7  | `letter-spacing` / `word-spacing` in `px` on responsive text                        | Low      |

### S — Spacing

| ID  | Pattern to detect                                                                          | Severity |
| --- | ------------------------------------------------------------------------------------------ | -------- |
| S1  | Hardcoded `margin: <number>px` / `padding: <number>px` on containers (not fine-grained UI) | Medium   |
| S2  | Spacing values not from the design token scale (magic numbers)                             | Low      |
| S3  | Missing responsive padding on section/page wrappers (no `px-4 sm:px-6 lg:px-8` equivalent) | High     |
| S4  | `gap` fixed in `px` on a responsive grid/flex container                                    | Medium   |

### C — Components

| ID  | Pattern to detect                                                                  | Severity |
| --- | ---------------------------------------------------------------------------------- | -------- |
| C1  | Modal / Dialog without `max-h-[90dvh]` + `overflow-y-auto`                         | High     |
| C2  | Drawer without `max-w-full` on narrow viewports                                    | High     |
| C3  | Table without horizontal scroll wrapper (`overflow-x-auto`)                        | High     |
| C4  | Card with fixed width instead of fluid width                                       | Medium   |
| C5  | Navigation with no mobile collapse/hamburger pattern                               | High     |
| C6  | Form `<input>` / `<textarea>` without `w-full` inside a responsive form            | Medium   |
| C7  | Button touch target < 44px height (no `min-h-[44px]` or `py-2.5` equivalent)       | High     |
| C8  | Clickable element without `:focus-visible` outline                                 | Medium   |
| C9  | Sidebar layout with no mobile-stack fallback                                       | High     |
| C10 | Hero section with `min-h-screen` + fixed children causing overflow on small phones | Medium   |

### I — Images & Media

| ID  | Pattern to detect                                                                  | Severity |
| --- | ---------------------------------------------------------------------------------- | -------- |
| I1  | `<img>` without `width` + `height` attributes (causes CLS)                         | High     |
| I2  | `<img>` without `object-fit` in a fixed-dimension container                        | Medium   |
| I3  | Background image without `background-size: cover/contain`                          | Medium   |
| I4  | Next.js `<Image>` without explicit `sizes` prop on variable-width images           | Medium   |
| I5  | `<video>` without `max-width: 100%`                                                | Medium   |
| I6  | SVG icons with hardcoded `width`/`height` in `px` > 32 without responsive override | Low      |

### A — Accessibility / Touch

| ID  | Pattern to detect                                                                     | Severity |
| --- | ------------------------------------------------------------------------------------- | -------- |
| A1  | Interactive element with no explicit `role` and not a native interactive element      | Medium   |
| A2  | Touch target smaller than 44×44 CSS px (button, link, icon-button)                    | High     |
| A3  | `user-scalable=no` or `maximum-scale=1` in viewport meta                              | Critical |
| A4  | Colour contrast not meeting WCAG AA at small text sizes (flag only — cannot auto-fix) | Medium   |
| A5  | `aria-hidden` on focusable elements                                                   | High     |
| A6  | Missing `aria-label` on icon-only buttons                                             | High     |

### P — Performance / Progressive Enhancement

| ID  | Pattern to detect                                                                    | Severity |
| --- | ------------------------------------------------------------------------------------ | -------- |
| P1  | Large inline `style` objects with responsive overrides (should be Tailwind/CSS)      | Low      |
| P2  | `useEffect` + `window.innerWidth` for responsive logic (use CSS / container queries) | Medium   |
| P3  | `window.matchMedia` without SSR guard in Next.js                                     | High     |
| P4  | Layout-triggering JS animation without `will-change` or `transform`                  | Low      |

---

## Auto-Fix Rules

Apply automatically — no confirmation needed.

### Safe Auto-Fixes (always apply)

| Issue IDs | Fix                                                                                           |
| --------- | --------------------------------------------------------------------------------------------- |
| L1        | Replace `width: Xpx` with `width: 100%` + `max-width: Xpx` (or Tailwind `w-full max-w-[Xpx]`) |
| L2        | Replace `min-width: Xpx` with `min-width: min(Xpx, 100%)`                                     |
| L7        | Add `min-w-0` to flex/grid children that hold text                                            |
| L8        | Add `flex-wrap` or convert to responsive grid                                                 |
| L12       | Replace `height: 100vh` with `height: 100dvh` (with `100vh` as fallback via `@supports`)      |
| T3        | Add `overflow-wrap: break-word` / Tailwind `break-words`                                      |
| T5        | Add missing `overflow-hidden` + `whitespace-nowrap` siblings to truncation                    |
| T6        | Add responsive text-size classes (`text-2xl sm:text-3xl lg:text-4xl`)                         |
| S3        | Add responsive horizontal padding to section wrappers                                         |
| C1        | Add `max-h-[90dvh] overflow-y-auto` to Dialog content containers                              |
| C3        | Wrap bare `<table>` in `<div className="overflow-x-auto">`                                    |
| C6        | Add `w-full` to inputs missing it inside forms                                                |
| C7        | Add `min-h-[44px]` to buttons with insufficient touch target                                  |
| I1        | Add `width` + `height` attributes to `<img>` tags                                             |
| I4        | Add `sizes` prop to Next.js `<Image>` based on usage context                                  |
| A3        | Remove `user-scalable=no` / `maximum-scale` from viewport meta                                |
| A5        | Remove `aria-hidden` from focusable elements                                                  |
| A6        | Add `aria-label` to icon-only buttons where icon name is inferable                            |
| P3        | Wrap `window.matchMedia` in `typeof window !== 'undefined'` guard                             |

### Require Judgement (fix only if intent is clear)

| Issue IDs | Approach                                                                        |
| --------- | ------------------------------------------------------------------------------- |
| L3        | Only fix if surrounding context shows clipping — convert to `min-height`        |
| L6        | Add `max-w-screen-xl mx-auto` to root page containers without one               |
| L9        | Convert to `grid-template-columns: repeat(auto-fit, minmax(Xpx, 1fr))`          |
| C5        | Add `md:hidden` / `hidden md:flex` toggle pattern if nav items are identifiable |
| C9        | Add `flex-col md:flex-row` to sidebar+content wrappers                          |

### Never Auto-Fix (flag only)

| Issue IDs | Reason                                                          |
| --------- | --------------------------------------------------------------- |
| A4        | Colour contrast requires design decision                        |
| P4        | `will-change` can increase memory usage — note and move on      |
| C8        | Focus styles depend on design system — note the missing outline |

---

## Tailwind v4 Patterns (this repo)

This repo uses **Tailwind v4** with a CSS-first config. Key conventions:

```css
/* Breakpoints (mobile-first) */
/* default   → all screens   */
/* sm:       → ≥ 640px       */
/* md:       → ≥ 768px       */
/* lg:       → ≥ 1024px      */
/* xl:       → ≥ 1280px      */
/* 2xl:      → ≥ 1536px      */
```

**Preferred Tailwind responsive patterns:**

```tsx
// Section wrapper — always
<section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">

// Page container — always
<div className="mx-auto w-full max-w-6xl">

// Responsive grid — prefer over fixed columns
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

// Responsive text
<h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">

// Responsive flex stack
<div className="flex flex-col gap-3 sm:flex-row sm:items-center">

// Mobile nav toggle
<button className="md:hidden" aria-label="Open menu">…</button>
<nav className="hidden md:flex items-center gap-6">…</nav>

// Touch-safe button
<button className="min-h-[44px] px-4 …">…</button>

// Fluid image
<img className="h-auto w-full object-cover" … />

// Modal safe height
<div className="max-h-[90dvh] overflow-y-auto …">…</div>

// Table scroll wrapper
<div className="overflow-x-auto">
  <table className="min-w-full …">…</table>
</div>
```

**Forbidden in this repo:**

```tsx
// ❌ Fixed container widths
className="w-[800px]"
style={{ width: 800 }}

// ❌ Viewport hacks
style={{ height: '100vh' }}   // use h-dvh or 100dvh fallback

// ❌ JS for responsive logic
useEffect(() => { if (window.innerWidth < 768) … }, [])

// ❌ Blocking zoom
<meta name="viewport" content="width=device-width, user-scalable=no">
```

---

## Fix Examples

### Example 1 — Fixed-width container

```tsx
// BEFORE — L1
<div className="w-[960px] mx-auto px-4">

// AFTER
<div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
```

### Example 2 — Non-responsive heading

```tsx
// BEFORE — T6
<h1 className="text-5xl font-black">Ship your SaaS</h1>

// AFTER
<h1 className="text-3xl font-black sm:text-4xl lg:text-5xl">Ship your SaaS</h1>
```

### Example 3 — Bare table

```tsx
// BEFORE — C3
<table className="w-full border-collapse">…</table>

// AFTER
<div className="overflow-x-auto">
  <table className="min-w-full border-collapse">…</table>
</div>
```

### Example 4 — Non-responsive section padding

```tsx
// BEFORE — S3
<section className="py-24 px-8">

// AFTER
<section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
```

### Example 5 — Modal clipping on mobile

```tsx
// BEFORE — C1
<DialogContent className="bg-white rounded-xl p-6">

// AFTER
<DialogContent className="max-h-[90dvh] overflow-y-auto rounded-xl bg-white p-6">
```

### Example 6 — SSR-unsafe matchMedia

```tsx
// BEFORE — P3
const isMobile = window.matchMedia('(max-width: 768px)').matches

// AFTER
const isMobile =
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 768px)').matches
```

### Example 7 — Missing sizes on Next.js Image

```tsx
// BEFORE — I4
<Image src={hero} alt="Hero" fill className="object-cover" />

// AFTER
<Image
  src={hero}
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
  className="object-cover"
/>
```

### Example 8 — Touch target too small

```tsx
// BEFORE — C7
<button className="p-1 rounded">
  <ChevronRight className="h-4 w-4" />
</button>

// AFTER
<button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded p-2" aria-label="Next">
  <ChevronRight className="h-4 w-4" />
</button>
```

---

## Report Template

Fill this in after Phase 3. Output it verbatim with real numbers and file paths.

```
## Responsive Audit Summary

| Metric | Value |
|--------|-------|
| Files analyzed | N |
| Issues detected | N |
| Issues auto-fixed | N |
| Issues requiring manual review | N |

### Issues requiring manual review
- [ ] FILE:LINE — CATEGORY — description (reason fix was not applied)

---

## Changes Made

### `path/to/file.tsx`
- L1 — Fixed width `w-[Xpx]` → `w-full max-w-[Xpx]` on main container
- T6 — Heading scaled: `text-5xl` → `text-3xl sm:text-4xl lg:text-5xl`

### `path/to/other.css`
- S3 — Added responsive horizontal padding to `.section-wrapper`

---

## Responsive Quality Score

| Dimension | Before | After |
|-----------|--------|-------|
| Mobile (320–480px) | /100 | /100 |
| Tablet (481–1024px) | /100 | /100 |
| Desktop (1025–1440px) | /100 | /100 |
| Ultrawide (1441px+) | /100 | /100 |
| Accessibility | /100 | /100 |
| Maintainability | /100 | /100 |
| Performance | /100 | /100 |
| **Overall** | **/100** | **/100** |

### Scoring Rubric

**Mobile (320–480px)**
- 100: No horizontal scroll, all content readable, touch targets ≥ 44px
- 80: Minor spacing issues, no critical layout breaks
- 60: Some content clipping or fixed widths causing scroll
- 40: Significant layout breaks on small screens
- 0–20: Unusable on mobile

**Tablet (481–1024px)**
- 100: Grid layouts collapse gracefully, navigation adapts, images scale
- 80: Minor overlaps or spacing inconsistencies
- 60: Some components not adapting between breakpoints
- 40: Multiple components broken at tablet widths
- 0–20: Tablet experience not considered

**Desktop (1025–1440px)**
- 100: Content centred, max-width applied, no line-length issues
- 80: Minor alignment issues
- 60: Content stretches too wide or too narrow
- 40: Layouts broken at 1024–1280 range
- 0–20: Desktop not considered

**Ultrawide (1441px+)**
- 100: max-width + `mx-auto` on all sections, no content drift
- 80: Most sections bounded, minor edge cases
- 60: Some sections stretch to full viewport width
- 40: Significant line-length or layout issues above 1440px
- 0–20: No ultrawide consideration

**Accessibility**
- 100: Touch targets ≥ 44px, zoom works, focus visible, ARIA correct
- 80: Minor touch target issues, no critical ARIA violations
- 60: Some small touch targets, focus styles missing in places
- 40: Zoom blocked or multiple ARIA violations
- 0–20: Critical accessibility failures

**Maintainability**
- 100: All responsive logic in CSS/Tailwind, zero JS layout hacks, no magic numbers
- 80: Rare JS fallbacks, mostly CSS-driven
- 60: Some `window.innerWidth` checks, some magic numbers
- 40: Significant JS-driven layout, hard to maintain
- 0–20: Impossible to maintain responsively

**Performance**
- 100: No CLS, images sized, no layout-triggering animations, no redundant reflows
- 80: Minor CLS risk, most images sized
- 60: Some unsized images, minor reflow risks
- 40: Significant CLS, multiple unsized images
- 0–20: Severe performance issues from layout
```

---

## Execution Checklist

Before reporting done, confirm every item:

- [ ] Read `CLAUDE.md` and the theme CSS entry point
- [ ] Scanned all `.tsx/.jsx/.css/.scss` files in UI directories
- [ ] Checked every item in the Detection Checklist for every file
- [ ] Applied all safe auto-fixes from the Auto-Fix Rules table
- [ ] Every modified file was edited directly (not described in chat only)
- [ ] Report template filled in with real numbers
- [ ] Responsive Quality Score calculated per rubric
- [ ] Manual review list populated for unfixed issues
