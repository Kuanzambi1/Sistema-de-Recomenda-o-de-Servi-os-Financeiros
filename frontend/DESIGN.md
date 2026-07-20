---
name: SRFS — Sistema de Recomendação Financeira
description: Angolan financial services recommendation platform — credit and insurance matched to user profiles via ML
colors:
  deep-navy: "#0F2B5B"
  white: "#FFFFFF"
  warm-gold: "#FEAE2C"
  dark-amber: "#835500"
  pure-white: "#FFFFFF"
  near-black-navy: "#00163C"
  blue-tinted-white: "#F9F9FF"
  muted-slate: "#6B7280"
  light-slate-blue: "#C4C6D0"
  alert-red: "#EF4444"
  approval-green: "#10B981"
  caution-amber: "#F59E0B"
  info-blue: "#3B82F6"
  sky-tint: "#D9E2FF"
  muted-ink: "#44474F"
typography:
  display:
    fontFamily: "Sora, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Sora, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Sora, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  xxl: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.deep-navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "0.625rem 1rem"
  button-outline:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.near-black-navy}"
    rounded: "{rounded.lg}"
    padding: "0.625rem 1rem"
  button-secondary:
    backgroundColor: "{colors.warm-gold}"
    textColor: "{colors.near-black-navy}"
    rounded: "{rounded.lg}"
    padding: "0.625rem 1rem"
  card-default:
    backgroundColor: "{colors.pure-white}"
    rounded: "{rounded.xl}"
    padding: "1rem"
  input-default:
    backgroundColor: "{colors.blue-tinted-white}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 0.625rem"
---

# Design System: SRFS

## 1. Overview

**Creative North Star: "The Clear Room"**

A well-lit financial consultation room. Calm, professional, human. The interface recedes so the guidance stands out — every screen answers one question and offers one next step.

This is fintech that trusts the user to understand their own finances, not a corporate dashboard that overwhelms with data. Deep navy grounds the system with authority; warm gold accents act as wayfinding beacons. Typography is where the personality lives: Sora's geometric confidence for headings, DM Sans's humanist warmth for body text.

**The system explicitly rejects:** generic SaaS dashboard templates, cold corporate banking UIs, cookie-cutter admin panels, and anything that feels generated rather than crafted. No glassmorphism, no gradient text, no side-stripe borders, no tiny uppercase eyebrow labels above every section.

**Key Characteristics:**
- Clean, uncluttered surfaces with ample breathing room
- Authority through navy, warmth through gold, clarity through typography
- Soft shadows that lift content without competing with it
- Refined, restrained interaction — the interface disappears into the task
- Portuguese-first UX copy that speaks plainly, not bureaucratically

## 2. Colors

A committed two-color palette: deep navy as the authoritative anchor, warm gold as the humanising accent. Neutrals lean cool (blue-tinted whites, slate grays) to keep the palette crisp rather than muddy.

### Primary
- **Deep Navy** (#0F2B5B): Primary brand color. Used for buttons, navigation, headings, active states, and the sidebar brand mark. Never used for body text at large sizes — its authority should feel deliberate, not overbearing.
- **White** (#FFFFFF): Text on dark backgrounds, icon fills, and high-contrast pairings with Deep Navy.

### Secondary
- **Warm Gold** (#FEAE2C): The accent. Primary CTA backgrounds in secondary contexts, "Melhor Opção" badges, active filter indicators, hover states on sidebar items, progress bar accent segments. Used sparingly (<15% of any screen) — its rarity is the point.
- **Dark Amber** (#835500): Gold-related text contrast, sidebar active borders, links in muted contexts. The darker companion that lets Warm Gold breathe.

### Neutral
- **Pure White** (#FFFFFF): Page backgrounds, card surfaces, popovers. The clean canvas.
- **Near-Black Navy** (#00163C): Body text, high-emphasis content. Darker than the primary navy to maximise readability.
- **Blue-Tinted White** (#F9F9FF): Muted surfaces, sidebar backgrounds, card alternate backgrounds, filter bars. A whisper of blue that echoes the primary without competing.
- **Muted Slate** (#6B7280): Secondary text, placeholder text, disabled labels, metadata. Must hit 4.5:1 against its background.
- **Light Slate Blue** (#C4C6D0): Borders, dividers, input strokes, focus rings. Visible but quiet.
- **Muted Ink** (#44474F): Sidebar text, non-active navigation, decorative text elements.

### Semantic
- **Alert Red** (#EF4444): Destructive actions, error messages, validation errors.
- **Approval Green** (#10B981): Success states, positive indicators, completion markers.
- **Caution Amber** (#F59E0B): Warnings, pending states, medium-priority alerts.
- **Info Blue** (#3B82F6): Informational badges, help tooltips, knowledge elements.
- **Sky Tint** (#D9E2FF): Footer backgrounds, secondary decorative fills.

### Named Rules

**The Rarity Rule.** Warm Gold covers ≤15% of any given screen. Its job is emphasis, not decoration. If a screen feels gold-heavy, pull back.

**The Authority Rule.** Deep Navy owns primary actions, the brand mark, and high-level navigation. It is never used for decorative flourishes.

## 3. Typography

**Display Font:** Sora (geometric sans-serif, 300–600 weights)
**Body Font:** DM Sans (humanist sans-serif, 400–500 weights)
**Label/Mono Font:** Geist Mono (for code, data, technical labels)

**Character:** A geometric-meets-humanist pairing that mirrors the brand voice — confident structure (Sora) with warm readability (DM Sans). Sora's crisp geometric forms give headings precision; DM Sans's open apertures and humanist curves keep body text approachable.

### Hierarchy

- **Display** (Sora 600, clamp(2.5rem, 5vw, 4rem), 1.1): Hero headlines on landing and primary pages. `text-wrap: balance` required.
- **Headline** (Sora 600, clamp(1.5rem, 3vw, 2rem), 1.2): Section headings, page titles. `text-wrap: balance`.
- **Title** (Sora 500, 1.125rem, 1.3): Card titles, panel headings, sidebar items.
- **Body** (DM Sans 400, 1rem, 1.6): Primary reading text. Max line length 65–75ch on prose surfaces. `text-wrap: pretty` to reduce orphans.
- **Label** (DM Sans 500, 0.875rem, 1.4, 0.02em letter-spacing): Buttons, form labels, metadata, small UI text. Uppercase only for brand-specific applications, never for general labels.

### Named Rules

**The Single Family Rule.** Sora handles all headings; DM Sans handles everything else. No third family enters the UI layer without a named reason.

## 4. Elevation

The system uses soft, ambient shadows to create a subtle layering effect — surfaces sit slightly above the page without competing for attention. This is not a flat system, nor one with aggressive drop shadows. Depth is communicated through shadow intensity, not blur or spread.

### Shadow Vocabulary

- **sm** (`0 1px 2px rgba(0,0,0,0.05)`): Cards at rest, subtle surface distinction.
- **md** (`0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`): Interactive cards on hover, filter bars.
- **lg** (`0 2px 4px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)`): Featured cards, highlighted recommendations, dropdown panels.

### Named Rules

**The Whisper Rule.** Shadows should be noticeable but not named. If a user could describe the shadow, it's too strong.

## 5. Components

### Buttons
- **Shape:** Gently rounded edges (0.625rem / rounded-lg)
- **Primary (Deep Navy):** White text, 0.625rem 1rem padding, 150ms ease-out transitions. Hover darkens slightly (opacity 90%); active presses down 1px.
- **Outline:** Transparent bg, Light Slate Blue border, Deep Navy text on hover.
- **Secondary (Warm Gold):** Deep Navy text, used sparingly for secondary CTAs or featured calls-to-action.
- **Destructive:** Alert Red at 10% opacity bg, Alert Red text, 20% opacity on hover.
- **Link:** Text-only, Deep Navy, underline on hover. Used for inline or tertiary actions.
- **Focus:** 3px ring at ring color at 50% opacity.
- **Disabled:** 50% opacity, no pointer events.

### Cards
- **Corner Style:** Soft rounded (0.875rem / rounded-xl)
- **Background:** Pure White (#FFFFFF) or Blue-Tinted White (#F9F9FF) for alternate
- **Shadow Strategy:** Resting state uses sm shadow; hover/featured uses lg shadow
- **Border:** 1px solid Light Slate Blue for regular cards; 2px solid Warm Gold for featured/best-pick cards
- **Internal Padding:** 1rem (default), 0.75rem (sm variant)
- **Card Title:** Sora 500, 1rem (sm: 0.875rem)

### Inputs / Fields
- **Style:** 1px Light Slate Blue border, Blue-Tinted White (#F9F9FF) bg in filled state
- **Shape:** Gently rounded (0.625rem / rounded-lg)
- **Focus:** Border shifts to Deep Navy, 3px ring at ring color 50% opacity
- **Placeholder:** Muted Slate (#6B7280) — must hit 4.5:1
- **Disabled:** 50% opacity, muted background
- **Error:** Alert Red border, Alert Red ring at 20% opacity matching `aria-invalid`

### Badges / Chips
- **Shape:** Fully rounded (rounded-full), 0.75rem 1rem padding
- **Style:** Solid color backgrounds with white text for semantic variants (success: Approval Green, warning: Caution Amber, destructive: Alert Red, info: Info Blue)
- **Outline variant:** Transparent, Light Slate Blue border, Deep Navy text

### Navigation (Sidebar)
- **Container:** Blue-Tinted White (#F9F9FF) bg, Light Slate Blue right border
- **Items:** Muted Ink (#44474F) text at rest, Deep Navy with Warm Gold accent on active
- **Active indicator:** 4px Warm Gold right border, Warm Gold at 10% opacity bg
- **Hover:** Blue-Tinted White bg tint

### Stepper (Onboarding)
- **Completed steps:** Deep Navy (#00163C) circle with white number, connecting line in Deep Navy
- **Current step:** Deep Navy circle, active label
- **Pending steps:** Light blue-gray (#E7EEFE) circle with Muted Ink number, connecting line in light blue-gray

### Recommendation Card
- **Best pick variant:** 2px Warm Gold border, tinted Warm Gold bg (6% opacity), lg shadow, "Melhor Opção" ribbon in Warm Gold
- **Standard variant:** 1px Light Slate Blue border, Blue-Tinted White bg, sm shadow
- **Match progress bar:** Gradient (Alert Red → Warm Gold → Approval Green), 8px height, rounded
- **Explanation callout:** Deep Navy at 10% opacity bg, 4px Deep Navy left border

## 6. Do's and Don'ts

### Do:
- **Do** use Deep Navy for all primary buttons, navigation, and headings. Consistency builds trust.
- **Do** reserve Warm Gold for emphasis only — featured cards, best-pick ribbons, active navigation markers. Let its rarity signal importance.
- **Do** keep body text at Near-Black Navy (#00163C) on white backgrounds for maximum readability. Avoid light gray body text "for elegance."
- **Do** use the Sora + DM Sans pairing consistently. Sora for hierarchy (headings, titles), DM Sans for reading (body, labels).
- **Do** use soft shadows to create subtle elevation — cards sit above the page, not float off it.
- **Do** include skeleton loading states for content areas, not inline spinners.
- **Do** maintain 4.5:1 color contrast for body text, 3:1 for large text. Verify before shipping.

### Don't:
- **Don't** use gradient text (`background-clip: text` with a gradient). Single solid colors only.
- **Don't** use glassmorphism (frosted glass effects) as a default decorative treatment.
- **Don't** use side-stripe borders (border-left >1px as a colored accent). Use full borders, bg tints, or icons.
- **Don't** add tiny uppercase tracked labels ("SOBRE NÓS", "PROCESSO") above every section heading. One deliberate kicker as a brand element is voice; repeating it as section grammar is AI scaffolding.
- **Don't** use numbered section markers (01 / 02 / 03) as default decorative scaffolding. Only use numbers when the section is a real sequence (a step-by-step process).
- **Don't** use display fonts in UI labels, buttons, or data. Sora is for headings; everything else is DM Sans.
- **Don't** default to modals. Exhaust inline and progressive disclosure alternatives first.
- **Don't** ship warm gold-tinted whites as body backgrounds. The canvas is Pure White; warmth comes from the gold accent and human typography.
- **Don't** let text overflow its container. Test heading copy at every breakpoint.
- **Don't** use identical card grids (same-sized cards with icon + heading + text) repeated endlessly. Vary card layouts for visual rhythm.
