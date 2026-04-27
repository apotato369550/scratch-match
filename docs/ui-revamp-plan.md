# UI/UX Revamp Plan

Date drafted: 2026-04-27
Scope: stylistic + structural frontend changes only. No API, schema, or
RAG-pipeline changes. Implementation target: tomorrow.

This plan responds to seven items of feedback. Each section lists:
**What changes**, **Files touched**, **Notes/risks**.

---

## 1. Remove the seal/logo

**What changes**
- Drop the `<Seal />` from the header, the homepage hero card, and any other
  surface it appears on.
- Replace the header's logo+title cluster with a clean wordmark only: a serif
  "Scratch Match" with a smaller subtitle line beside or beneath it.
- Delete `src/components/Seal.tsx` (after confirming no remaining imports).

**Files touched**
- `src/components/Header.tsx` — remove `<Seal />`, restructure brand block.
- `src/app/page.tsx` — remove the seal watermark from the hero role card
  (lines 34–35).
- `src/components/Seal.tsx` — delete.
- Grep for `Seal` import sites before deleting.

**Notes**
- Keep the navy/gold palette; only the seal SVG goes. The wordmark can stay
  navy serif for brand continuity.

---

## 2. Bigger fonts, more padding, more breathing room

**What changes**
- Bump base type scale on marketing pages (homepage, login, signup, sitemap):
  - Hero `<h1>` from `text-4xl md:text-5xl` → `text-5xl md:text-6xl`.
  - Body copy from `text-base` → `text-lg` with `leading-relaxed`.
  - Section titles from `text-2xl` → `text-3xl`.
- Increase vertical rhythm: section paddings `py-14` → `py-20 md:py-24`;
  cards `p-6` → `p-8`, hero card `p-8` → `p-10 md:p-12`.
- Widen container slightly for marketing: `max-w-6xl` → `max-w-7xl` on the
  homepage only (workspace pages stay at `max-w-6xl`).
- Update `globals.css` button styles: `px-4 py-2 text-sm` →
  `px-5 py-2.5 text-base` so primary CTAs feel tappable.
- Add a `prose-readable` helper class (or just inline) capping line length
  to `max-w-prose` on long paragraphs — easier on the eyes.

**Files touched**
- `src/app/globals.css` — `.btn`, possibly add `.lead` and `.section-title`
  size bump.
- `src/app/page.tsx` — re-tune sizes/spacing.
- `src/components/PageHeader.tsx` — increase title size + margin.
- Optionally tailwind config — confirm font stack (no change needed if
  serif/sans are already wired).

**Notes**
- Accessibility framing: the goal is legibility for a public service, not
  luxury. Aim for 16–18px body, 1.55–1.7 line-height, generous padding.

---

## 3. Convert the link-list role rows into proper buttons / cards

**What changes**
- Replace the homepage `RoleRow` component (`/seeker`, `/employer`, `/admin`)
  with a 3-up grid of **role cards**, each with:
  - An inline SVG illustration (see item 4).
  - A title.
  - 1-line description.
  - A clearly-styled CTA button ("Open Job-Seeker portal →") instead of a
    ghost link.
- In the footer, collapse the four columns of text links into two columns
  with **link-pill buttons** rather than bare anchors. Or replace the
  Seeker/Employer columns entirely with two big "Job Seeker portal" /
  "Employer portal" CTA buttons + a small "Service" mini-list.
- Sitemap page: convert the line-by-line list into a categorized
  card+button grid.

**Files touched**
- `src/app/page.tsx` — rewrite `RoleRow` → `RoleCard`.
- `src/components/Footer.tsx` — restructure columns.
- `src/app/sitemap/page.tsx` — re-layout (read this file before editing).

**Notes**
- Keep destinations identical; this is purely a layout/affordance change.

---

## 4. Remove tacky elements; add card vector graphics

**Remove**
- `Header.tsx`: the entire navy strip ("An Official Prototype · Province of
  Cebu" / "SDG 8 · Decent Work & Economic Growth"). Also remove the
  `gov-stripe` ribbon above it.
- `page.tsx` hero: remove "— Public Service Notice" eyebrow (lines 11–13).
- `page.tsx` hero: remove the badge row (`SDG 8`, `Prototype POC`,
  `Cebu-only`, `On-premise AI`, lines 27–32). Optionally keep a single
  understated `Cebu-only` badge if needed for context.
- `page.tsx`: remove the "Notice strip" section entirely (Issued by /
  Effective / Coverage, lines 78–84).
- Any "Prototype POC" / "SDG 8" references on other marketing surfaces
  (grep for them).

**Add (vector graphics for role cards)**
- Inline SVGs (no external assets). Each ~64–80px, two-tone navy/gold,
  sitting at the top of each role card:
  - **Job Seekers** — document/CV with a magnifier or person silhouette.
  - **Employers** — briefcase or building with a checkmark.
  - **Administrators** — shield with a gear, or clipboard with checks.
- Implement as a small `RoleIcon` component file
  (`src/components/RoleIcon.tsx`) exporting `SeekerIcon`, `EmployerIcon`,
  `AdminIcon`. Pure SVG, `currentColor`-driven, no deps.

**Files touched**
- `src/components/Header.tsx`
- `src/app/page.tsx`
- `src/components/RoleIcon.tsx` (new)
- `src/app/globals.css` — can drop `.gov-stripe` rule.

**Notes**
- Icons should match the `currentColor` pattern so they pick up the navy
  text color and don't fight the palette.

---

## 5. Third pillar: Local LLM, not SQLite

**What changes**
- Replace the third pillar block on the homepage:
  - Title `Local & Private` → `Local LLM`.
  - Body: highlight that **Mistral runs entirely on the host** via Ollama,
    no cloud inference, no per-token billing, full data sovereignty. Keep
    it 1–2 sentences.
- Adjust the existing second-pillar copy if it now overlaps too much with
  the new third pillar (the second pillar is RAG; the third is the model
  itself — keep that separation).

**Files touched**
- `src/app/page.tsx` — Pillar 03.

**Notes**
- The "stored locally / on-premise" message survives in the footer
  microcopy and the hero paragraph; we're not losing it, just rebalancing.

---

## 6. Workspace nav: side → top, with sliding transition

**What changes**
- Convert `SideNav` from a left rail into a horizontal top nav for the
  seeker, employer, and admin layouts.
- Move the nav out of `Workspace`'s grid: change
  `grid md:grid-cols-[16rem_1fr]` → a stacked layout where the nav is a
  full-width horizontal bar above the content area, sticky at the top.
- Sliding indicator animation: under each nav item, an underline (or pill
  background) slides from the previously-active item to the new one when
  the route changes. Implementation:
  - In `SideNav` (rename to `TopNav` or fork as
    `src/components/TopNav.tsx`), measure the active link's bounding rect
    on `pathname` change with a `useLayoutEffect`, and set the indicator's
    `transform: translateX()` + `width` via state.
  - Use a single absolutely-positioned `<span>` indicator with a CSS
    `transition: transform 250ms ease, width 250ms ease`.
  - Tailwind-friendly; no Framer Motion dependency required (keep deps
    lean per KISS).
- Make it scroll-horizontal on narrow viewports
  (`overflow-x-auto whitespace-nowrap`).

**Files touched**
- `src/components/TopNav.tsx` (new, or refactor `SideNav.tsx`).
- `src/components/Workspace.tsx` — restructure layout.
- Verify all three workspace surfaces still render: `/seeker/*`,
  `/employer/*`, `/admin/*`.

**Notes/risks**
- Sticky top nav can collide with the global `Header`. Decide either:
  (a) the workspace top-nav sits directly under the Header and only the
  Header is sticky, or (b) the workspace nav sticks below the Header
  (`top-[Npx]` matching Header height). Go with (a) for simplicity.
- The `hint` subtitle on each nav item won't fit horizontally — drop it
  in the top-nav variant, or surface it as a tooltip on hover.

---

## 7. ChatGPT-style chat UI for the AI advisor/assistant

**What changes** (rewrite of `src/components/ChatPanel.tsx`)
- **Layout**: full-height column. Centered content rail (`max-w-3xl
  mx-auto`). Empty state shows a large title + a few suggestion cards in a
  grid, like ChatGPT's launcher.
- **Message rendering**:
  - No bubbles. Each message is a wide row spanning the rail, with a small
    avatar/role label on the left ("You" / "Advisor") and the message body
    as plain prose with generous line-height.
  - User and assistant rows alternate background tints (`bg-white` /
    `bg-parchment` or transparent / very-light-navy) to delineate.
  - Render assistant text with simple Markdown support (paragraphs, lists,
    inline code). Use `react-markdown` if not already present; otherwise
    fall back to `whitespace-pre-wrap`. Confirm dep policy before adding.
  - Sources block stays but moves to a subtle collapsible "Sources"
    disclosure under the message, not inside a bubble.
- **Composer**:
  - Sticky at the bottom of the rail.
  - Auto-growing `<textarea>` (1 → ~6 lines), Enter to send, Shift+Enter
    for newline.
  - Send button is an icon button (paper-plane SVG) inside the textarea's
    right edge, ChatGPT-style.
  - Disabled state while a response is "streaming" (we can fake-stream the
    demo response by chunking it with `setTimeout`, since the real model
    isn't wired yet).
- **Suggestions**: only show on the empty state, as 4 cards in a 2×2 grid;
  hide once the conversation starts.
- **Header strip**: keep the model badge ("Mistral · local") but small,
  top-right, no "Live Session" eyebrow.

**Files touched**
- `src/components/ChatPanel.tsx` — full rewrite.
- `src/app/seeker/chat/page.tsx` and `src/app/employer/chat/page.tsx` —
  pass updated props (verify shape).
- Possibly `package.json` if we add `react-markdown` — flag for review
  before adding.

**Notes/risks**
- Auto-grow textarea + enter-to-send is the main interaction; test on
  desktop and small viewports.
- Markdown rendering opens an XSS surface if untrusted HTML is allowed —
  use a library that escapes HTML by default and don't enable
  `rehype-raw`. (The model output is "trusted" in the sense of coming
  from our own LLM, but treat it as untrusted anyway.)

---

## Implementation order (suggested for tomorrow)

1. **Token & spacing pass** (item 2) — globals.css + Tailwind tweaks.
   Establishes the new visual baseline before component work.
2. **Header cleanup + remove seal** (items 1, 4-header).
3. **Homepage rework** — remove tacky strips, badges, notice strip; add
   role cards w/ vector icons; rewrite pillar 3 (items 3, 4-home, 5).
4. **Footer + sitemap** — link-pill buttons (item 3).
5. **TopNav + Workspace refactor with sliding indicator** (item 6).
6. **ChatPanel rewrite** (item 7).
7. Sweep: grep for `SDG 8`, `Prototype POC`, `Public Service Notice`,
   `Official Prototype` to catch any stragglers.
8. Run dev server, click through every route in the sitemap, screenshot
   the homepage + a workspace page + the chat for the user.

## Things I won't touch unless asked

- The navy/gold palette itself — feedback was about tackiness of specific
  copy/badges, not color.
- Routing, page structure, or backend — purely presentational.
- Adding new heavy dependencies (Framer Motion, MUI, etc.). Sliding
  indicator is hand-rolled CSS; markdown is the only candidate dep and
  I'll flag it before installing.

## Open questions for the user

1. Keep the wordmark "Scratch Match" in the header in serif, or do you
   want a cleaner sans treatment?
2. For the role-card vector icons, OK with simple two-tone navy/gold
   line icons, or do you want something more illustrative
   (mini-scenes)?
3. ChatGPT-style typically means dark-mode by default — keep our
   light/parchment theme on the chat surface, or go dark on chat only?
4. The footer currently lists every internal route. Trim to two big
   portal buttons + a 4-link service column, or preserve full
   navigation?
