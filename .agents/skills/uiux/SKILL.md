---
name: uiux
description: >-
  Comprehensive UI/UX, motion, typography, visual design, and perceived-performance
  guidelines. Use this skill when designing, building, reviewing, or auditing user
  interfaces, CSS, animations, or frontend components.
---

# UI/UX & Motion Craft Skill

Use these principles when designing, building, or auditing interfaces. Deduplicated and organized across motion, typography, visual hierarchy, and perceived performance.

---

## 1. Motion & Micro-interactions

- **Ease-out for entrances**: Elements entering the viewport or appearing should decelerate smoothly (`cubic-bezier(0.16, 1, 0.3, 1)` or `ease-out`).
- **Ease-in-out for on-screen movements**: Elements moving from A to B while already on screen should use `ease-in-out`—never `linear`.
- **Shorter exits (~20% faster)**: Exit animations should be shorter than entrances; users don't want to wait for things to leave.
- **Dropdown timing (150–250ms)**: Keep dropdowns and menus snappy within 150–250ms.
- **Popovers start at 0.95 scale**: Never animate popovers from `scale(0)` or from the center—start at `scale(0.95)` and transition in from / out to the trigger (`transform-origin` anchored to trigger).
- **Button press feedback (`scale(0.97)`)**: Scale interactive buttons to `0.97` on `:active` / press.
- **Stagger list rows (30–50ms)**: Stagger sequential list items by 30ms (up to 50ms) so lists feel alive without feeling slow.
- **Follow-through / settle stagger**: Move the container first, then stagger when inner details settle.
- **Cross-state overlap**: Bring the new state in as the old state leaves instead of waiting for a hard gap.
- **No spring bounce on everyday UI**: Save bounce for moments of delight; dialogs, menus, and standard controls should not jiggle.
- **Squash & stretch on moving knobs**: Stretch moving toggle/slider knobs by ~12% along the axis of motion.
- **Anticipation & arcs**: Add a subtle wind-up before major movements and move objects along arcs rather than rigid straight lines.
- **Masks for reveals & color changes**: Prefer clip-path/mask wipes over plain fades for intentional reveals and theme/color transitions.
- **Crossfade icons with scale + blur**: Morph swapped icons with opacity, subtle scale, and `blur(...)` rather than a hard swap.
- **Reuse `layoutId` across shared objects**: Share layout IDs (e.g., Framer Motion `layoutId`) for tabs, pills, and expanding elements so the eye never loses track.
- **Rubber band past drag boundaries**: Apply resistance when dragging past edges instead of a hard stop.
- **Interruptible animations & handheld**: All UI animations must be interruptible; never tween handheld/gesture-driven motion.
- **Pulse to confirm success**: Pair "Saved" / success states with a subtle pulse so users feel the confirmation.
- **Stage the focus**: Dim or recede surrounding chrome to highlight the active element.
- **Frequency of use**: The more frequently a control is used, the less it should animate.

---

## 2. Typography & Text Craft

- **Fluid headlines with `clamp()`**: Scale display/headline sizes smoothly with `clamp()` instead of abrupt breakpoint jumps.
- **Tighter line-height on headlines**: Headlines need tighter `line-height` (e.g., `1.05`–`1.2`) than body copy (`1.5`–`1.65`).
- **Balanced headlines**: Use `text-wrap: balance` on headings and `text-wrap: pretty` on body paragraphs.
- **Keep body text regular**: Reserve bold weights for emphasis and hierarchy; if everything is bold, nothing stands out.
- **Reserve bold width on interactive rows**: Prevent layout shift on hover/active bolding (e.g., via `font-variation-settings`, `text-shadow`, or hidden pseudo-element reserving bold width).
- **Tabular numbers**: Use `font-variant-numeric: tabular-nums` for counters, timers, prices, scores, and table numbers; right-align numbers in tables.
- **Baseline-align mixed text sizes**: Align mixed font sizes on `baseline`, not `center`.
- **Underline offset**: Set `text-underline-offset` (and `text-decoration-skip-ink: auto`) so underlines don't collide with descenders (`g`, `y`, `p`, `q`).
- **Text-box trim**: Use `text-box-trim` / optical vertical alignment when descender space makes single-line labels/badges look off-center.
- **`sup` line-height**: Set `sup { line-height: 0; }` so superscripts don't distort line spacing.
- **Small caps for loud acronyms**: Use `font-variant-caps: all-small-caps` (or subtle tracking + smaller size) when all-caps acronyms feel too loud.
- **Curly quotes**: Use typographic curly quotes (`“ ”`, `‘ ’`) in prose/copy instead of straight quotes.
- **Middle-truncate filenames**: Truncate long filenames in the middle so the file extension stays visible.
- **Hyphens in narrow columns**: Enable `hyphens: auto` in narrow text columns to avoid huge word gaps.
- **Cap card titles with `line-clamp`**: Use `line-clamp-2` / `line-clamp-3` so long titles don't break card grid heights.
- **Left-align long paragraphs**: Never center-align multi-line body paragraphs.

---

## 3. Visual Design, Color & Layout

- **Tinted neutrals**: Tint pure greys slightly cool/blue (or match surface hue) so they don't look flat/dull.
- **Consistent hue across shades**: Keep the same hue family across light/dark shades of a color.
- **Tone down brand colors in dark mode**: Desaturate/soften bright brand accents in dark mode to avoid eye strain and halation.
- **Tint text on colored backgrounds**: Instead of pure `#000` or `#fff`, tint text toward the background's hue.
- **Layered shadows**: Replace a single heavy drop shadow with 2–3 layered subtle shadows.
- **Continuous corners**: Use smooth corner radii (`border-radius` + `corner-shape: squircle` where supported, or consistent nested radii: `outer = inner + padding`).
- **Generous top & side padding**: Give containers breathing room, especially on top and sides.
- **Heading spacing**: Give headings more margin/space *above* than *below* so they bind to their own section.
- **Stacked text spacing**: Space stacked text lines/blocks by roughly the smaller text's height.
- **Button proportions**: Make button text roughly half the button's total height, with clear action-oriented labels (never generic "Submit").
- **Separate destructive actions**: Keep **Delete** / destructive buttons far away from **Save** / primary actions.
- **Sentence case for labels**: Write UI labels, nav items, and buttons in sentence case rather than Title Case.
- **Top labels on inputs**: Place labels above form fields (not inside as disappearing placeholders).
- **Empty states need a CTA**: Every empty state should explain what's missing and offer a clear primary action.
- **Landing page CTAs**: Make primary landing page hero CTAs noticeably larger and more prominent than standard UI buttons.

---

## 4. UX Patterns & Perceived Performance

- **Doherty Threshold (<400ms)**: Respond to every user action in under 400ms—use optimistic updates, instant pressed states, and skeleton loaders.
- **Skeleton loaders & BlurHash placeholders**: Show structured skeletons or BlurHash/blur placeholders while data or images load.
- **Stale-while-revalidate & pre-rendering**: Serve cached data immediately while revalidating in the background; prefetch/prerender likely next routes.
- **View transitions & predictive back**: Use smooth view transitions between routes/states and support swipe-to-dismiss sheets on mobile.
- **Command menu & shortcut hints**: Provide a keyboard-accessible command palette (`⌘K` / `Ctrl+K`) and visible shortcut hints where helpful.
- **Undo toasts**: Prefer non-blocking undo toasts over confirmation modals for reversible actions.
- **One-time code autofill**: Set `autocomplete="one-time-code"` and `inputMode="numeric"` on OTP/verification inputs.
- **Hit slop**: Expand clickable/tappable hit areas (`>= 44×44px` on touch, or invisible padding/pseudo-elements) for small icon buttons (Fitts's Law).
- **Safe area insets**: Respect `env(safe-area-inset-*)` for fixed headers, bottom bars, and full-bleed mobile views.
- **Hick's Law**: Cut unnecessary menu choices; keep navigation and action menus focused.
- **Amazon safe triangle**: Add hover intent / safe-triangle tolerance for nested hover menus/submenus.
- **Idempotency keys**: Guard mutating requests (registrations, submissions, payments) against duplicate clicks/retries with disabled pending states and idempotency keys.

---

## Audit & Application Workflow

When asked to audit or apply this skill to a project:
1. Inspect global styles (`index.css` / `globals.css`), layout/theme tokens, and shared shell components (`Navbar`, `Footer`, buttons, cards, modals/dropdowns).
2. Check typography rules (fluid `clamp()`, `text-wrap: balance`, `tabular-nums`, `text-underline-offset`, `sup { line-height: 0 }`, sentence case, left-aligned paragraphs).
3. Check motion & interaction rules (button `:active` `scale(0.97)`, `ease-out` entrances, `150–250ms` dropdowns, `0.95` popover start scale, `layoutId` shared transitions, `prefers-reduced-motion` support, pulse on success).
4. Check UX patterns (skeletons, hit slop `>= 44px`, safe-area insets, top-labeled inputs, separated destructive buttons, empty-state CTAs, idempotent submit states).
5. Apply changes cleanly without breaking existing visual identity, then verify the production build passes.

