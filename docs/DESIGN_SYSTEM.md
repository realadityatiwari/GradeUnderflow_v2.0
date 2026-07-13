# GradeUnderflow Visual Design System Specification

> **Status:** Canonical Visual Design Reference  
> **Target Audience:** Frontend Developers, UI/UX Engineers, AI Agent Contributors  
> **Last Updated:** 2026-07-12  

---

## 1. Design Philosophy

### Purpose
GradeUnderflow is not a standard college ERP or administrative database dashboard. It is a premium, high-density **Academic Intelligence Platform**. The design philosophy is built around empowering students with clarity, speed, and confidence. It translates raw academic parameters (marks, weights, and credits) into clear forecasts, targets, and health metrics, allowing students to focus on active strategic planning rather than manual calculation.

### Rules
- **Calm, High-density Command Center**: Design interfaces as highly focused control panels.
- **Data-First, Not Decorative**: Every visual element must serve to display, explain, or forecast academic data. Eliminate unnecessary lines, graphics, or borders.
- **Aesthetic Inspiration**: Draw directly from:
  - **Linear** (sleek, high-density menus, keyboard-first, subtle focus rings, dark gradient highlights).
  - **Vercel** (monospace aesthetics, sharp contrast, clear dividers, bold metadata, geometric shapes).
  - **Stripe Dashboard** (multi-level metric charts, precise tooltips, clean inline forms, tabular alignments).
  - **GitHub & Raycast** (restrained container borders, semantic badges, accessible search triggers, high keyboard compatibility).
- **Default Visual Environment**: Near-black translucent surface layers over dark background with an elegant, responsive indigo-centered radial glow.

### Examples
- *Correct (Academic Command Center)*: A multi-column dashboard grid showing academic health rating, credit progress, and a What-If simulator in a single viewport.
- *Incorrect (Generic ERP)*: Large colorful blocks, decorative cards with illustration assets, excessive margins, and low-density text layouts.

### When to use
- Creating semester setups, tracking subject evaluations, running hypothetical grade simulations, or rendering performance trends.

### When NOT to use
- Public-facing marketing pages (which may use broader branding grids, illustrations, or custom marketing copy).

### Best practices
- Keep screen real estate optimized. Prioritize information density over massive empty blocks.
- Keep calculations and status indicators aligned with user actions (e.g., placing the What-If simulation next to the current recorded scores).

### Common mistakes
- Adding custom vector art, illustrative empty states, or playful emoji symbols inside the authenticated interface.

---

## 2. Product Identity

### Purpose
To establish a cohesive product character that feels academic yet cutting-edge, professional, and trustworthy. GradeUnderflow is a tool of intelligence, calculation, and strategy.

### Rules
- **Core Theme**: High-contrast, dark-mode-first academic cockpit. Light mode serves as a functional fallback for high-illumination environments.
- **Signal Color**: **Indigo** (`oklch(0.505 0.213 275.1)`) serves as the core brand element, representing intelligence, focus, and system active status.
- **Secondary Signage**: Reserved for meaningful semantic states:
  - Success/On Track: **Emerald** (`oklch(0.64 0.17 150)`)
  - Warning/Caution: **Amber** (`oklch(0.76 0.15 75)`)
  - Danger/Risk: **Rose** (`oklch(0.60 0.18 20)`)
- **Typography Tone**: Monospace elements for numeric calculations and tabular logs, paired with sharp sans-serif fonts for labeling and instruction.

### Examples
- Dashboard layout referencing `GradeUnderflow` with an uppercase mono badge indicator and a subtle indigo outline on the active navigation block.

### When to use
- Every user-facing UI surface, navigation header, email template, and system notification.

### When NOT to use
- Third-party OAuth portals or direct external browser windows (e.g., institutional login forms).

### Best practices
- Keep colors consistent. Use semantic variables (`--primary`, `--accent`, `--destructive`) instead of specific color hexes.

### Common mistakes
- Using non-standard primary colors (e.g., custom bright purples, blues, or oranges) that conflict with the established brand indigo.

---

## 3. Dashboard as the Design Reference

### Purpose
The Dashboard is the absolute visual anchor for the entire GradeUnderflow workspace. It establishes the surface hierarchy, component borders, and grid structure that all other authenticated views must replicate.

### Rules
- **Canonical Design Language**: Any new page, settings panel, or modal overlay must match the spacing, typography, and container cards used on the primary Dashboard.
- **Reusability**: Use existing layouts:
  - Page shell: [DashboardContainer](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ds/DashboardContainer.tsx)
  - Section wrapper: [DashboardSectionHeader](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ds/DashboardSection.tsx)
  - Metric blocks: [DashboardMetricCard](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ds/DashboardMetricCard.tsx)
  - Surfaces: [DashboardSurface](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ds/DashboardSurface.tsx)
- **Modifications**: Never redesign, shift, or replace primary dashboard layouts without explicit instructions from the product team.

### Examples
- Implementing a new "Attendance Detail" view by wrapping content inside `DashboardContainer` and organizing grids using `DashboardGrid`.

### When to use
- Every authenticated view inside the system.

### When NOT to use
- Unauthenticated pages like login, registration, or password reset screens, which use single-column center boxes.

### Best practices
- Inherit rather than invent. Check if the element already exists on the Dashboard before creating a new component.

### Common mistakes
- Designing a new page with a unique sidebar width, custom page container padding, or a different card outline weight.

---

## 4. Visual Language

### Purpose
To define the structural aesthetics, translucency rules, border contracts, and background gradients that make up the "Dark Command Center" visual identity.

### Rules
- **Background**: Absolute deep background using `bg-zinc-950` (`oklch(0.145 0 0)`).
- **Panels**: Translucent card containers using `bg-zinc-950/65` or `bg-zinc-950/70` with `backdrop-blur-xl`.
- **Dividers & Borders**: Subtle translucent white borders: `border border-white/[0.08]` or `border-white/[0.1]`.
- **Glow Highlights**: Linear indigo top accents (`bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent`) applied exclusively to primary summary cards and action panels.
- **No Heavy Outlines**: Avoid solid bright borders. Borders should blend into the dark background.

### Examples
```tsx
// Correct visual card language
<div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.95)]">
  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Subject Evaluation</p>
</div>
```

### When to use
- Defining borders, shadows, backgrounds, and active state indicators on interactive panels.

### When NOT to use
- Simple inline lists or inline copy that do not require layout division.

### Best practices
- Keep panel background opacities low (`65%-70%`) so the subtle dark workspace texture shows through, avoiding flat gray surfaces.

### Common mistakes
- Setting panel background to a solid middle gray (`bg-zinc-800`), which breaks the dark command center aesthetic.

---

## 5. Color System

### Purpose
To define the custom color scheme of the application using system-wide Tailwind CSS design tokens, eliminating hardcoded color hex codes.

### Rules
- All colors must utilize CSS custom properties defined in [globals.css](file:///c:/GradeUnderflow_v2.0/apps/web/src/styles/globals.css).
- **Core Color Variables**:
  - `--background`: Base surface (`oklch(0.145 0 0)` dark, `oklch(1 0 0)` light)
  - `--foreground`: Primary typography (`oklch(0.985 0 0)` dark, `oklch(0.145 0 0)` light)
  - `--card`: Panel containers (`oklch(0.145 0 0)`)
  - `--primary`: Accent color (`oklch(0.985 0 0)` dark, `oklch(0.205 0 0)` light)
  - `--muted`: Inactive / Secondary backgrounds (`oklch(0.269 0 0)`)
  - `--muted-foreground`: Description / Muted text (`oklch(0.708 0 0)`)
  - `--border`: Standard UI borders (`oklch(0.269 0 0)`)
  - `--destructive`: Danger states (`oklch(0.396 0.141 25.723)`)
- **Hex Code Charts Mapping**: Charts use the theme variables defined in [chart-theme.ts](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ui/chart-theme.ts).

### Examples
- *Correct*: `text-muted-foreground border-border bg-card`
- *Incorrect*: `text-gray-400 border-zinc-700 bg-black`

### When to use
- Defining background colors, text colors, border styles, and SVGs on all screens.

### When NOT to use
- Creating color definitions for dynamic calculations (e.g., rendering heatmaps where color steps are calculated dynamically in OKLCH).

### Best practices
- Use Tailwind utility classes mapping to these variable names rather than absolute tailwind values (e.g., prefer `text-muted-foreground` over `text-zinc-400`).

### Common mistakes
- Directly using raw CSS hex codes (e.g., `#1f2937`) or basic Tailwind numbers (e.g., `zinc-900`) instead of semantic tokens.

---

## 6. Typography Scale

### Purpose
To regulate text sizing, tracking, weights, and hierarchies across all text blocks, guaranteeing consistent readability.

### Rules
Typography is strictly limited to the following styles:

| Token | Tailwind Classes | Usage / Application |
| --- | --- | --- |
| **Display** | `text-[2.25rem] font-semibold leading-none tracking-[-0.07em]` | Metric numbers, massive headers |
| **H1** | `text-2xl font-bold tracking-[-0.04em]` | Primary page headings |
| **H2** | `text-xl font-semibold tracking-[-0.035em]` | Section headings |
| **H3** | `text-base font-semibold tracking-[-0.03em]` | Card headings, subsection titles |
| **Body** | `text-sm leading-6 font-normal` | Paragraphs, standard instructions |
| **Small** | `text-xs font-medium` | Auxiliary descriptions, list subtext |
| **Eyebrow / Label** | `text-[10px] font-bold uppercase tracking-[0.16em]` | Small labels, card context categories |
| **Badge** | `text-[10px] font-bold uppercase tracking-wider` | Inside custom badge pills |

### Examples
```tsx
// Section heading hierarchy
<div>
  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300">Semester 2</p>
  <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-zinc-50">Data Structures & Algorithms</h2>
</div>
```

### When to use
- Every text element, including page headings, metrics, tables, descriptions, and labels.

### When NOT to use
- Chart labels, which are sized and styled inside Recharts configurations using specialized SVG sizing rules.

### Best practices
- Always combine lowercase text with tight tracking (`tracking-tight` or custom values) and uppercase tracking with wide tracking (`tracking-widest` or `tracking-[0.16em]`).

### Common mistakes
- Inventing one-off font sizes (e.g., `text-lg` or `text-3xl`) outside the designated scale.

---

## 7. Layout System

### Purpose
To establish the structural container boundaries of the application window, keeping content legible, centered, and aligned.

### Rules
- **Maximum Width**: All authenticated view content must be wrapped in a container that constraints max-width to exactly `1440px` (`max-w-[1440px]`).
- **Standard Padding**:
  - Mobile viewports: `px-4 py-5`
  - Tablet viewports: `sm:px-6`
  - Desktop viewports: `lg:px-8`
- **Transitions**: Every primary view container must transition into view using a fade-in animation (`animate-in fade-in duration-500`).
- **Sidebar Constraint**: Left-hand sidebar is `260px` wide. Page content is offset accordingly or occupies the remaining flex window.

### Examples
Refer to the standard wrapper:
```tsx
import { DashboardContainer } from "@/components/ds/DashboardContainer";

export default function Page() {
  return (
    <DashboardContainer>
      {/* Content here */}
    </DashboardContainer>
  );
}
```

### When to use
- Establishing any page route, layout template, or application viewport.

### When NOT to use
- Side drawer components or layout blocks that fly out overlaying the viewport.

### Best practices
- Keep page layout structures clean. Minimize nesting depth of main body containers.

### Common mistakes
- Writing standard `max-w-7xl` or `max-w-screen-xl` layouts which cause inconsistent alignments with other dashboard views.

---

## 8. Spacing System

### Purpose
To enforce consistent vertical and horizontal rhythm through strict usage of a 4px-base spacing scale, eliminating arbitrary padding and margin offsets.

### Rules
- All margins, paddings, and gaps must conform to the spacing values:

| Value | Rem | Tailwind Utility | Application |
| --- | --- | --- | --- |
| **4px** | `0.125rem` | `m-1` / `p-1` / `gap-1` | Micro adjustments, badge padding |
| **8px** | `0.25rem` | `m-2` / `p-2` / `gap-2` | Border-label spacing, item dividers |
| **12px** | `0.5rem` | `m-3` / `p-3` / `gap-3` | Dropdown margins, small card contents |
| **16px** | `0.75rem` | `m-4` / `p-4` / `gap-4` | Inner card padding (compact layouts) |
| **20px** | `1rem` | `m-5` / `p-5` / `gap-5` | Main card paddings, section gap rhythm |
| **24px** | `1.25rem` | `m-6` / `p-6` / `gap-6` | Major layout separations |
| **32px** | `1.5rem` | `m-8` / `p-8` / `gap-8` | Section separations |
| **48px** | `2.25rem` | `m-12` / `p-12` | Empty state vertical centering |

- **No Arbitrary Spacing**: Classes like `mt-[17px]` or `p-[21px]` are strictly forbidden.

### Examples
- *Correct*: `<div className="space-y-5 p-5 gap-4">`
- *Incorrect*: `<div className="space-y-6 p-6 gap-3">`

### When to use
- Designing margins, absolute positioning, grid gaps, flex layouts, and padding attributes.

### When NOT to use
- Custom canvas-based graphics or charts where pixel positioning is dynamic.

### Best practices
- Rely on layout containers (e.g., `<div className="space-y-5">`) rather than appending margins onto every child.

### Common mistakes
- Introducing random pixel sizes because of visual estimation.

---

## 9. Grid System

### Purpose
To structure dashboard layouts dynamically across varying viewport widths, ensuring charts, metrics, and logs adapt cleanly.

### Rules
- Use [DashboardGrid](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ds/DashboardGrid.tsx) as the standard grid utility.
- Grid classes are mapped by columns:
  - **4 Columns**: Single column mobile (`grid-cols-1`), two column tablet (`sm:grid-cols-2`), four column desktop (`xl:grid-cols-4`).
  - **3 Columns**: Single column mobile (`grid-cols-1`), two column tablet (`md:grid-cols-2`), three column desktop (`lg:grid-cols-3`).
  - **2 Columns**: Single column mobile (`grid-cols-1`), two column desktop (`sm:grid-cols-2`).
- **Standard Grid Gap**: Gap is locked at `gap-4` (`16px`).

### Examples
```tsx
import { DashboardGrid } from "@/components/ds/DashboardGrid";

<DashboardGrid columns={3}>
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</DashboardGrid>
```

### When to use
- Creating card displays, dashboard layouts, subject lists, or metric panel layouts.

### When NOT to use
- Small forms or single input lists, which use single-column linear stacks.

### Best practices
- Always design grid contents to expand naturally to full width. Do not hardcode custom widths inside grid children.

### Common mistakes
- Bypassing the grid layout class in favor of custom flex structures that wrap unevenly.

---

## 10. Elevation & Shadows

### Purpose
To establish clean depth hierarchy using dark visual layering, allowing interactive cards to float gracefully above the dark background.

### Rules
- Because GradeUnderflow is dark-themed, standard soft gray shadows are invisible. Elevation is defined via backdrop translucency and stark dark shadows:
- **Card Shadow**: `shadow-[0_18px_45px_-30px_rgba(0,0,0,0.95)]`
- **Dialog Shadow**: `shadow-[0_24px_70px_-28px_rgba(0,0,0,1)]`
- **Popover/Tooltip Shadow**: `shadow-[0_18px_45px_-24px_rgba(0,0,0,0.95)]`
- **Gradients**: Use opacity layers (e.g., `bg-zinc-950/65` and `bg-zinc-950/95`) to signal elevation level. Higher overlays must be more opaque.

### Examples
```tsx
// Popover container elevation rules
<div className="z-50 rounded-xl border border-white/[0.1] bg-zinc-950 p-1 text-zinc-100 shadow-[0_18px_45px_-24px_rgba(0,0,0,0.95)]">
```

### When to use
- Modals, popovers, dropdown lists, and floating card surfaces.

### When NOT to use
- Flat inline dividers or non-interactive lists.

### Best practices
- Keep the background blur `backdrop-blur-xl` or `backdrop-blur-md` active on elevated layers to preserve depth context.

### Common mistakes
- Using light gray shadows or generic browser shadows (`shadow-md`), which disappear on dark panels.

---

## 11. Border System

### Purpose
To separate information structures visually without adding heavy lines that disrupt layout flow.

### Rules
- **Standard Border Color**: `border-white/[0.08]` or `border-white/[0.1]` (translating to a soft, translucent light-gray line that naturally adjusts to the dark container bg).
- **Secondary / Separator Color**: `border-white/[0.07]`.
- **Interactive Focus Border**: Indigo accent focus indicator `focus-visible:border-indigo-300/60`.
- **Primary Cards Accent Border**: Active panels can include a top gradient border: `bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent`.

### Examples
- *Correct*: `<div className="border border-white/[0.08]">`
- *Incorrect*: `<div className="border border-zinc-700">`

### When to use
- Card borders, table dividers, panel separations, and input borders.

### When NOT to use
- Elements that should appear completely integrated (e.g., secondary text inside cards).

### Best practices
- Use opacity-based borders instead of solid colors. This allows background gradients to show through borders naturally.

### Common mistakes
- Using thick borders (`border-2` or `border-4`) or solid gray borders (`border-zinc-800`), which look dated.

---

## 12. Border Radius Standards

### Purpose
To maintain a geometric consistency throughout all corners and UI assets in the application.

### Rules
- **Containers / Panels**: Main dashboard panels use `rounded-2xl` (`16px`).
- **Components / Controls**: Buttons, text inputs, selects, and internal card items use `rounded-lg` (`8px`).
- **Dropdowns / Modals / Tooltips**: Floating containers use `rounded-xl` (`12px`).
- **Pills / Progress Indicators**: Badges, status markers, and progress bars use `rounded-full` (`9999px`).

### Examples
- Card Layout: `rounded-2xl border border-white/[0.08]`
- Input Component: `rounded-lg border border-white/[0.1]`

### When to use
- Defining HTML layout containers, buttons, select triggers, dialog contents, or images.

### When NOT to use
- Tables or charts where borders must meet at clean angles.

### Best practices
- Ensure nested items have a radius offset to avoid corner distortion (e.g., a card with `rounded-2xl` containing an item with `rounded-lg`).

### Common mistakes
- Mixing different corner rounding rules on the same card (e.g., a `rounded-lg` input inside a `rounded-md` panel).

---

## 13. Card System

### Purpose
To organize the central data widgets, metric breakdowns, predictions, and action buttons into clear visual segments.

### Rules
Cards must inherit from [DashboardSurface](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ds/DashboardSurface.tsx):

| Card Type | component Name | Background | Borders | Rounded | Hover State |
| --- | --- | --- | --- | --- | --- |
| **Metric Card** | `DashboardMetricCard` | `bg-zinc-950/65` | `border-white/[0.08]` + top gradient | `rounded-2xl` | Y (-translate-y-1, glow active) |
| **Chart Card** | `DashboardCard` | `bg-zinc-950/70` | `border-white/[0.08]` | `rounded-2xl` | N / static |
| **Action Card** | `DashboardCard` | `bg-zinc-950/70` | `border-white/[0.08]` | `rounded-2xl` | Y (-translate-y-1, border brightening) |
| **Empty Card** | `DashboardEmptyState`| `bg-transparent` | `border-white/10` | `rounded-2xl` | N / static |

### Examples
```tsx
import { DashboardCard } from "@/components/ds/DashboardSurface";

<DashboardCard hover={true}>
  <h3 className="text-base font-semibold text-zinc-100">Subject Overview</h3>
  <p className="text-sm text-zinc-500">Review assessment grades below.</p>
</DashboardCard>
```

### When to use
- Wrapping dashboard items, performance modules, configuration blocks, or analytics charts.

### When NOT to use
- Grouping layout options that fit inside list tables or standard layout forms.

### Best practices
- Keep cards clean. Let their layout define sections; do not insert headers with separate background colors.

### Common mistakes
- Creating nested cards with duplicate borders and heavy spacing that crowd text.

---

## 14. Navigation

### Purpose
To provide intuitive routes between system workspaces (Dashboard, Analytics, Semesters, Settings) while remaining visually non-intrusive.

### Rules
- **Structure**: Permanent vertical sidebar on desktop screens (`260px` width) that collapses to a burger menu trigger on mobile layouts.
- **Active State Indicator**: Active routes use `text-zinc-100 bg-white/[0.07] font-semibold`.
- **Inactive State Indicator**: Inactive links use `text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03]`.
- **Icons**: Compact Lucide icons (`h-4 w-4`) paired with clean labels.
- **Future Features**: "Reports" and "Attendance" are marked as "Soon" with disabled styling (`opacity-40 pointer-events-none`).

### Examples
```tsx
// Navigation link item
<Link
  href="/dashboard"
  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-all hover:bg-white/[0.03] hover:text-zinc-100"
>
  <LayoutDashboard className="h-4 w-4" />
  <span>Dashboard</span>
</Link>
```

### When to use
- Primary application shell menus, sidebar routes, and navigation headers.

### When NOT to use
- Internal card page links or wizard progression triggers (use Buttons instead).

### Best practices
- Provide clear visual indicators for navigation state and keep animations fast (`duration-200`).

### Common mistakes
- Adding color icons or emojis inside navigation links.

---

## 15. Buttons

### Purpose
To trigger actions, launch modals, submit forms, or link destinations with high clarity and visual responsiveness.

### Rules
Buttons are restricted to the following variations:
- **Default/Primary**: Accent action. Solid indigo (`bg-indigo-500 hover:bg-indigo-400 text-white`) with a soft shadow shadow `[0_12px_25px_-14px_rgba(99,102,241,0.95)]`.
- **Destructive**: Destructive actions (e.g. deletion). Solid red (`bg-rose-500 hover:bg-rose-400 text-white`) with drop shadow.
- **Outline**: Secondary controls. Translucent dark border-line (`border border-white/[0.11] bg-white/[0.025] hover:bg-white/[0.07] text-zinc-200`).
- **Secondary**: Alternative actions. Solid dark background highlight (`bg-white/[0.08] hover:bg-white/[0.13] text-zinc-200`).
- **Ghost**: Inactive context controls. Text only with dark hover background (`text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-100`).
- **Link**: Minimal navigation. Underline behavior (`text-indigo-300 hover:text-indigo-200 underline-offset-4 hover:underline`).

### Examples
See the button variations defined in [button.tsx](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ui/button.tsx).

### When to use
- Submitting details, trigger updates, launching setup steps, or closing modals.

### When NOT to use
- Selecting academic configurations (use custom Option Tabs or Dropdowns instead).

### Best practices
- Pair secondary buttons with one primary button in form footers. Place primary actions on the right.

### Common mistakes
- Placing multiple primary default buttons side-by-side.

---

## 16. Inputs

### Purpose
To let users input numerical grades, weight values, assessment names, or user profile information.

### Rules
- **Styling**: Rectangular inputs with standard height (`h-10`) and rounding (`rounded-lg`).
- **Borders & Background**: `border-white/[0.1] bg-white/[0.025] text-zinc-100 shadow-sm`.
- **Placeholders**: Set color to a deep muted color (`placeholder:text-zinc-600`).
- **Focus Indicator**: Deep indigo ring transition (`focus-visible:border-indigo-300/60 focus-visible:ring-2 focus-visible:ring-indigo-300/15`).
- **Disabled State**: Non-editable inputs use `disabled:cursor-not-allowed disabled:opacity-50`.

### Examples
See standard component implementation: [input.tsx](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ui/input.tsx).

### When to use
- Creating forms, editing profile settings, modeling custom GPA values, or adding new subjects.

### When NOT to use
- Choosing options from a short list (e.g., selecting semester status or type of assessment).

### Best practices
- Always display validation errors directly under the text field using a red label (`text-rose-400 text-xs mt-1`).

### Common mistakes
- Removing the border outlines on inputs, making them merge with background cards.

---

## 17. Select

### Purpose
To let users pick a single option from a dropdown overlay menu.

### Rules
- **Trigger Button**: Styled exactly like an Input component to preserve form consistency.
- **Dropdown Panel**: Rendered inside a portal with `rounded-xl border border-white/[0.1] bg-zinc-950 p-1 text-zinc-100 shadow-[0_18px_45px_-24px_rgba(0,0,0,0.95)]`.
- **Hover/Highlight**: Active items use `focus:bg-white/[0.08] focus:text-white`.
- **Selection Marker**: Check icon on the right side of the active selection element.

### Examples
See code reference: [select.tsx](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ui/select.tsx).

### When to use
- Selecting Semester Status (`PLANNED`, `CURRENT`, `COMPLETED`), Subject Type (`THEORY`, `LABORATORY`, `PROJECT`), or Assessment Status.

### When NOT to use
- Choosing options when there are 3 or fewer elements (use Tabs or Toggle Buttons instead).

### Best practices
- Keep overlay menus constrained in height (`max-h-[--radix-select-content-available-height]`) and support viewport scrolling.

### Common mistakes
- Allowing dropdown lists to clip offscreen on narrow mobile layouts.

---

## 18. Dialog

### Purpose
To display primary dialog boxes, creation Wizards, deletion confirmation alerts, and settings editors.

### Rules
- **Overlay**: Backdrop mask uses `fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm` with fade transitions.
- **Content Panel**: Centered box using `fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-5 rounded-2xl border border-white/[0.1] bg-zinc-950 p-5 text-zinc-100 shadow-[0_24px_70px_-28px_rgba(0,0,0,1)] sm:p-6`.
- **Animation**: Zooms in (`data-[state=open]:zoom-in-95`) and fades out smoothly.
- **Header Structure**: Clean hierarchy with title (`text-xl font-semibold leading-none tracking-[-0.035em] text-zinc-100`) and subtext (`text-sm leading-6 text-zinc-500`).

### Examples
See code reference: [dialog.tsx](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ui/dialog.tsx).

### When to use
- Deleting academic terms, configuring fresh semester entries, or adding subject modules.

### When NOT to use
- Informative message confirmations (use toast popups or inline status alerts).

### Best practices
- Provide a clear, easy close trigger button in the top-right corner.

### Common mistakes
- Nesting dialog overlays, which causes user navigation issues.

---

## 19. Tabs

### Purpose
To divide content blocks inside a page, such as separating details, analytics trends, and configuration lists.

### Rules
- **TabsList Container**: Flat layout or border highlight container (`inline-flex h-9 items-center justify-center rounded-lg bg-white/[0.04] p-1 text-zinc-400`).
- **TabsTrigger Item**: Active items are styled with `bg-zinc-900 text-zinc-100 shadow-sm`. Inactive triggers use `hover:bg-white/[0.02] hover:text-zinc-200`.
- **Transitions**: Keep state transitions immediate to optimize loading speed.

### Examples
See tabs implementation: [tabs.tsx](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ui/tabs.tsx).

### When to use
- Toggling views inside the Subject detail page (e.g., Assessments list vs. Predictions summary vs. What-If).

### When NOT to use
- Secondary layouts where accordion collapse trees are more appropriate.

### Best practices
- Maintain labels at equivalent lengths to avoid width resizing when toggling tabs.

### Common mistakes
- Using tabs to execute core updates (e.g. using tabs as save buttons).

---

## 20. Accordion

### Purpose
To group secondary lists of data or FAQ details into clean, collapsable headers.

### Rules
- **Item Wrapper**: Clean separation using bottom borders: `border-b border-white/[0.08]`.
- **AccordionTrigger**: Clickable headers with a transition arrow. Rotates smoothly when expanded.
- **Content Transition**: Smooth vertical slide: `data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up`.

### Examples
See accordion structure: [accordion.tsx](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ui/accordion.tsx).

### When to use
- Grouping optional configurations, syllabus details, or auxiliary semester logs.

### When NOT to use
- Core metrics navigation or critical academic panels that need to remain visible at all times.

### Best practices
- Keep trigger headers clear and contextual.

### Common mistakes
- Placing text inputs directly inside accordions that close automatically on page submit.

---

## 21. Tables

### Purpose
To display dense, comparative grids of assessments, grades, credits, and evaluation breakdowns.

### Rules
- **Structure**: Wrap inside containers with horizontal scrolling enabled.
- **Header Row**: Table headers use small, tracking-heavy text labels (`text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500`).
- **Cell Elements**: Body entries use standard text size (`text-sm text-zinc-300`).
- **Numeric Alignment**: Align all numbers and scores to the right, and center-align labels.
- **Rows Divider**: Row borders use thin dividers (`border-b border-white/[0.06]`).

### Examples
See code reference: [table.tsx](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ui/table.tsx).

### When to use
- Render assessment lists, subject evaluation percentages, historical marks lists, or weight distributions.

### When NOT to use
- Displaying primary high-level indicators (e.g., displaying GPA records).

### Best practices
- Use monospace fonts (`font-mono`) on numbers to maintain vertical grid alignment.

### Common mistakes
- Allowing long table rows to overflow boundaries without horizontal container wraps.

---

## 22. Badges

### Purpose
To display statuses, types of subjects, target indicators, or milestone tags.

### Rules
- **Sizing**: High density (`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md`).
- **Variants**:
  - **Default**: Gray accent background (`bg-zinc-800 text-zinc-200`).
  - **Primary/Indigo**: Active indicators (`bg-indigo-500/10 text-indigo-300`).
  - **Success/Emerald**: Completed semesters or met targets (`bg-emerald-500/10 text-emerald-300`).
  - **Warning/Amber**: Incomplete structures or approaching weights (`bg-amber-500/10 text-amber-300`).
  - **Destructive/Rose**: Risk of failure or failing grades (`bg-rose-500/10 text-rose-300`).

### Examples
See code reference: [badge.tsx](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ui/badge.tsx).

### When to use
- Displaying subject types (`THEORY`, `LABORATORY`), assessment status (`NOT_STARTED`, `CHECKED`), or targets achieved.

### When NOT to use
- Displaying interactive select actions (use buttons instead).

### Best practices
- Keep labels short and concise.

### Common mistakes
- Using overly bright, opaque background colors that clash with background cards.

---

## 23. Progress Components

### Purpose
To display semester progress, assessment weights, and grade targets clearly.

### Rules
- **Track**: Subtle background indicator (`h-2 rounded-full bg-white/[0.07] overflow-hidden`).
- **Indicator**: Smooth animated progress bar using accent gradients (`bg-gradient-to-r from-indigo-400 to-violet-500`).
- **Numerical Context**: Always pair with a percentage label above or next to the progress bar.

### Examples
```tsx
import { Progress } from "@/components/ui/progress";

// Render progress track
<Progress value={75} className="h-1.5" />
```

### When to use
- Illustrating current semester credit completion, weight distribution totals, or target progress tracking.

### When NOT to use
- Representing asynchronous page loading sequences (use skeletons or spinners instead).

### Best practices
- Animate width transitions on load to create a smooth presentation.

### Common mistakes
- Using conflicting background colors (e.g. bright white outlines) that disrupt visual continuity.

---

## 24. Empty States

### Purpose
To guide students through configurations when a page contains no data.

### Rules
- **Component**: Inherit from [DashboardEmptyState](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ds/DashboardEmptyState.tsx).
- **Structure**: Center-aligned layout (`min-h-[300px] grid place-items-center py-10`).
- **Icon**: Subtle Lucide icon centered inside a gray box (`h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-400`).
- **Title & Description**: H3 heading (`text-base font-semibold text-zinc-100`) and detailed secondary text (`text-sm leading-6 text-zinc-500`).
- **Call to Action**: A clear primary button centered directly below the description text.

### Examples
```tsx
import { DashboardEmptyState } from "@/components/ds/DashboardEmptyState";
import { Plus, BookOpen } from "lucide-react";

<DashboardEmptyState
  icon={<BookOpen className="h-6 w-6" />}
  title="No subjects created"
  description="To get started, add subjects to this semester."
  action={<Button><Plus className="h-4 w-4 mr-2" />Add Subject</Button>}
/>
```

### When to use
- First-time page loads for newly registered users, empty semesters, or subjects without assessments.

### When NOT to use
- Layout grids when data loading fails (use Error States instead).

### Best practices
- Keep empty state text helpful. Explain the benefit of taking the primary action.

### Common mistakes
- Showing completely empty boxes without instructions.

---

## 25. Loading States

### Purpose
To keep interfaces feeling fast and responsive during backend calculations or data loads.

### Rules
- **Skeleton Panels**: Layout mirrors the size and placement of cards using subtle pulsating boxes (`animate-pulse rounded-2xl bg-white/[0.03]`).
- **Metric Skeletons**: Standard cards with a label loader and value block loading states.
- **Spinner**: Smooth indicator loop animations for smaller submit blocks (`animate-spin h-4 w-4`).

### Examples
```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 space-y-4">
      <Skeleton className="h-4 w-24 bg-white/[0.03]" />
      <Skeleton className="h-10 w-36 bg-white/[0.03]" />
      <Skeleton className="h-3 w-48 bg-white/[0.03]" />
    </div>
  );
}
```

### When to use
- Primary route loads, initial analytics data queries, and API submissions.

### When NOT to use
- Minor background data checks that don't block layout views.

### Best practices
- Match skeleton dimensions to actual UI structures to prevent layout shifting.

### Common mistakes
- Using generic full-screen loading spinners that hide layout context.

---

## 26. Error States

### Purpose
To display user-friendly error details and clear recovery steps when an API action fails.

### Rules
- **Aesthetic**: Red alert boxes (`border-rose-500/20 bg-rose-500/5 text-rose-200`) or standard error display layouts.
- **Copy**: Never display raw backend error messages or trace lines (e.g. `Internal Server Error: sqlalchemy.exc.DBAPIError`).
- **Action**: Always supply an action button to let users retry the request.

### Examples
```tsx
<div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-center">
  <AlertCircle className="mx-auto h-6 w-6 text-rose-400" />
  <h3 className="mt-2 text-sm font-semibold text-zinc-100">Failed to load evaluations</h3>
  <p className="mt-1 text-xs text-zinc-500">We could not reach the database. Please try again.</p>
  <Button className="mt-3" size="sm" variant="outline" onClick={handleRetry}>Retry</Button>
</div>
```

### When to use
- API query timeouts, validation errors, and page access issues.

### When NOT to use
- Simple empty search queries (use Empty States instead).

### Best practices
- Keep copy polite and actionable. Explain what went wrong in plain language.

### Common mistakes
- Hiding errors in console logs without updating the user.

---

## 27. Charts

### Purpose
To display trends, scores, projections, and academic performance distributions.

### Rules
Charts use the standard styling definitions in [chart-theme.ts](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ui/chart-theme.ts):
- **Colors**:
  - Primary Line: `#7c8cff` (indigo accent)
  - Secondary/Baseline: `#52d3a7` (emerald)
  - Warnings/Targets: `#fbbf24` (amber)
  - Risk/Failing: `#fb7185` (rose)
  - Gridlines: `#ffffff` (set opacity to `0.05` inside Recharts, dotted grid style)
- **Axis Styling**:
  - Regular ticks: `fontSize: 12, fontWeight: 600, fill: "#a1a1aa"` (zinc-400)
  - Muted ticks: `fontSize: 11, fontWeight: 600, fill: "#71717a"` (zinc-500)
- **Tooltips**:
  - Dark container overlays: `bg-zinc-950/96`, `border border-white/10`, `rounded-xl`, `p-3`, `shadow-2xl`.
- **Grid Configuration**: Set grid opacity to low values (`strokeDasharray="3 3"`). Keep vertical gridlines hidden (`vertical={false}`).

### Examples
```tsx
import { CHART_COLORS, chartAxisTick } from "@/components/ui/chart-theme";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

// Render compliant academic trend chart
<ResponsiveContainer width="100%" height={240}>
  <AreaChart data={data}>
    <CartesianGrid stroke={CHART_COLORS.border} strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey="name" tick={chartAxisTick} tickLine={false} />
    <YAxis tick={chartAxisTick} tickLine={false} />
    <Area type="monotone" dataKey="score" stroke={CHART_COLORS.primary} fill="url(#indigo-glow)" />
  </AreaChart>
</ResponsiveContainer>
```

### When to use
- Subject dashboards, overview trends, health rating cards, or predicted score displays.

### When NOT to use
- Explaining single metric stats (use Metric Cards instead).

### Best practices
- Ensure all chart elements match color themes in both dark and light modes.

### Common mistakes
- Using standard high-opacity Recharts gridlines, which disrupt chart visual clarity.

---

## 28. Forms

### Purpose
To let users structure their academic semesters, subject credits, and assessment goals.

### Rules
- **Spacing**: Group elements vertically with `space-y-4` or `space-y-5`.
- **Field Wrappers**: Form inputs are paired with labels (`text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5`).
- **Footer Actions**: Align actions to the bottom right. Place secondary Cancel buttons next to primary Submit buttons.
- **Validation Rules**: Validate data configurations before submitting to API (e.g. validating weights so they do not exceed 100%).

### Examples
See code reference: [form.tsx](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ui/form.tsx).

### When to use
- Term registrations, class listings, grades configuration, or score updates.

### When NOT to use
- Navigating pages or displaying read-only reports.

### Best practices
- Set focus to the first text field when form views open.

### Common mistakes
- Allowing forms to execute actions without validating parameters.

---

## 29. Motion & Animation

### Purpose
To improve UI interactions without distracting from data visibility.

### Rules
- **Interactive Hover**: Card components slide up slightly (`transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-zinc-900/80`).
- **Buttons Hover**: Accent buttons lift slightly on hover (`hover:-translate-y-px duration-200`).
- **Transitions**: Keep duration values short (`150ms`-`300ms`) and ease routes using simple fade parameters.
- **Reduced Motion**: Respect system preferences (`motion-reduce:transform-none`).

### Examples
```css
/* Globals.css transitions configuration */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
```

### When to use
- Navigating views, hovering card grids, expand accordion panels, or load page shells.

### When NOT to use
- Real-time updates where animations delay readability.

### Best practices
- Keep animations fast and subtle.

### Common mistakes
- Using long, bouncing transition animations.

---

## 30. Icons

### Purpose
To represent actions, academic categories, status states, and navigation routes.

### Rules
- **Library**: Use **Lucide** exclusively. No emojis or alternate icon packs.
- **Sizing**: Use compact sizing:
  - Standard action links: `h-4 w-4`
  - Large controls: `h-5 w-5`
  - Small labels: `h-3.5 w-3.5`
- **Colors**: Set default colors to muted grays (`text-zinc-500` or `text-zinc-400`) and highlight on hover.

### Examples
- *Correct*: `<Plus className="h-4 w-4" />`
- *Incorrect*: `<Plus className="h-8 w-8 text-blue-500" />`

### When to use
- Navigation links, list filters, action buttons, dialog close triggers, and alert boxes.

### When NOT to use
- As replacements for text labels in primary buttons.

### Best practices
- Ensure SVGs include semantic labels (`sr-only` descriptions) for assistive readers.

### Common mistakes
- Mixing different icon libraries (e.g. FontAwesome, Heroicons) in the same layout.

---

## 31. Responsive Design

### Purpose
To keep layouts usable and aligned across mobile viewports, tablets, and wide monitors.

### Rules
- **Breakpoints**: Use standard Tailwind CSS breakpoints:
  - **Mobile**: `<640px` (single-column views, collapsed sidebar).
  - **Tablet (`sm`)**: `640px` to `768px`.
  - **Medium Tablet / Laptop (`md`)**: `768px` to `1024px` (navigation sidebar collapses here).
  - **Desktop (`lg`)**: `1024px` to `1280px` (sidebar remains visible).
  - **Large Desktop (`xl`)**: `1280px` to `1440px`.
  - **Max Constraint**: Centered at `1440px`.
- **Text Sizing**: Enable auto-scaling for body text and decrease title sizes on mobile screens.

### Examples
```tsx
// Grid responsive configurations
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

### When to use
- Constructing main templates, tables, navigation headers, and analytics pages.

### When NOT to use
- Designing specific micro-dialog templates that keep fixed shapes on all screens.

### Best practices
- Always test layouts starting from mobile screens up to desktop sizes.

### Common mistakes
- Writing layouts that clip offscreen on small screens.

---

## 32. Accessibility

### Purpose
To ensure that GradeUnderflow is fully accessible to all students, including those relying on screen readers or keyboard navigation.

### Rules
- **Contrast Guidelines**: Maintain WCAG AA standard contrast ratios (at least `4.5:1` for regular text).
- **Interactive Focus**: Ensure focus outlines remain visible: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70 focus-visible:ring-offset-2`.
- **Keyboard Usability**: Keep tab orders structured. Support closing overlays using the Escape key.
- **ARIA Assertions**: Label custom controls correctly using ARIA labels.
- **Touch Screen Support**: Keep touch buttons at a minimum target size of `44px` x `44px` on mobile layouts.

### Examples
- Dialog Close triggers require descriptive tags: `<button aria-label="Close dialog">`

### When to use
- Every page, form, dialog modal, list sorting trigger, and analytics chart.

### When NOT to use
- Internal utility methods or database scripts.

### Best practices
- Use semantic HTML tags (`<header>`, `<main>`, `<article>`, `<button>`) instead of nested generic divisions (`<div>`).

### Common mistakes
- Suppressing default browser focus outlines without providing alternative styles.

---

## 33. Dark Theme

### Purpose
To act as the primary theme of the GradeUnderflow application, mimicking a dark, high-contrast dashboard.

### Rules
- Theme variables are configured in the `.dark` class block in [globals.css](file:///c:/GradeUnderflow_v2.0/apps/web/src/styles/globals.css):
  - `--background`: `oklch(0.145 0 0)` (zinc-950 equivalent)
  - `--foreground`: `oklch(0.985 0 0)` (zinc-50 equivalent)
  - `--card`: `oklch(0.145 0 0)`
  - `--border`: `oklch(0.269 0 0)` (zinc-800 equivalent)
- Dark panel surfaces use translucent overlays (`bg-zinc-950/65` or `bg-zinc-950/70`) over the background.

### Examples
```tsx
<body className="bg-zinc-950 text-zinc-50 antialiased">
```

### When to use
- Set as the default mode for all system routes.

### When NOT to use
- When light theme is explicitly active.

### Best practices
- Test dashboard views at low screen brightness levels to verify accessibility.

### Common mistakes
- Hardcoding dark values (`bg-black` or `text-white`) which breaks light theme toggling.

---

## 34. Light Theme

### Purpose
To act as a fallback theme for high-illumination environment usage.

### Rules
- Theme variables are configured in the `:root` class block in [globals.css](file:///c:/GradeUnderflow_v2.0/apps/web/src/styles/globals.css):
  - `--background`: `oklch(1 0 0)` (white equivalent)
  - `--foreground`: `oklch(0.145 0 0)` (zinc-950 equivalent)
  - `--card`: `oklch(1 0 0)`
  - `--border`: `oklch(0.922 0 0)` (zinc-200 equivalent)
- Light components use clean white shapes with light gray border lines (`border-zinc-200`).

### Examples
- Card layout matching both states: `<div className="bg-card text-card-foreground border">`

### When to use
- Active only when light theme option is selected in app configuration settings.

### When NOT to use
- Creating layouts when dark theme remains the primary active system setting.

### Best practices
- Ensure contrast metrics are verified in both light and dark themes.

### Common mistakes
- Creating text elements that remain white when switching themes, making them unreadable in light mode.

---

## 35. Component Reuse Rules

### Purpose
To enforce consistency across the application codebase, avoiding duplicate implementations.

### Rules
- **Rule of Reusability**: Do not write custom components if an equivalent already exists in the design library.
- **Extensions**: If an existing component is missing options, extend the component variants or properties instead of duplicating it.
- **Paths**:
  - Main wrappers: [components/ds](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ds)
  - UI assets: [components/ui](file:///c:/GradeUnderflow_v2.0/apps/web/src/components/ui)

### Examples
- Extending Button variants inside `button.tsx` rather than writing a custom inline CSS button.

### When to use
- Designing buttons, dropdown lists, table elements, dialog boxes, loading screens, and page shells.

### When NOT to use
- Writing unique page layouts with specific logic requirements.

### Best practices
- Check existing directories (`components/ui` or `components/ds`) before starting a new layout feature.

### Common mistakes
- Creating separate components for the same visual style, causing visual inconsistencies.

---

## 36. UI Anti-Patterns

```text
███╗   ██╗███████╗██╗   ██╗███████╗██████╗     ██████╗  ██████╗ 
████╗  ██║██╔════╝██║   ██║██╔════╝██╔══██╗    ██╔══██╗██╔═══██╗
██╔██╗ ██║█████╗  ██║   ██║█████╗  ██████╔╝    ██║  ██║██║   ██║
██║╚██╗██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██╔══██╗    ██║  ██║██║   ██║
██║ ╚████║███████╗ ╚████╔╝ ███████╗██║  ██║    ██████╔╝╚██████╔╝
╚═╝  ╚═══╝╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝    ╚═════╝  ╚═════╝ 
```

The items below represent forbidden practices that violate the visual system of GradeUnderflow:

1. **Never Redesign Dashboard**: Do not change the layout structure, sidebar dimensions, or typography rules of the dashboard.
2. **Never Introduce Another Design Language**: Do not import external UI systems (e.g. TailwindCSS v3 configurations, competing color utilities, bootstrap).
3. **Never Hardcode Colors**: Do not use raw hex codes (e.g., `#1f2937`) or inline tailwind gray scales inside components.
4. **Never Invent Another Spacing System**: Do not introduce non-scale spacing (e.g. `mt-[17px]`).
5. **Never Create Another Card Style**: Always extend `DashboardSurface` or `DashboardCard`.
6. **Never Create Another Typography Scale**: All headings and text blocks must map to the defined typographic system.
7. **Never Use Low-Contrast Charts**: Keep chart gridlines, labels, and colors aligned with the accessibility checklist.
8. **Never Create Inconsistent Hover States**: Interactive cards and buttons must use standard transition parameters.
9. **Never Ignore Responsive Behavior**: Test and optimize screens for mobile, tablet, and desktop viewports.
10. **Never Ignore Accessibility**: Keep outline systems active and support keyboard inputs on interactive elements.
11. **Never Bypass Shared UI Primitives**: Use existing directory elements instead of writing custom markup configurations.

---

## 37. Design Principles

### Purpose
To guide the overall aesthetic direction of GradeUnderflow, keeping pages uniform.

### Rules
- **Clarity Over Decoration**: Avoid cluttering views. Display only metrics that are relevant to current tasks.
- **Speed Over Complexity**: Design interfaces that feel snappy. Keep layouts optimized.
- **Consistency Over Novelty**: Maintain standard components and patterns across the application.
- **Confidence Over Guesswork**: Academic forecasts and predictive metrics must be labeled clearly to prevent confusion.

### Examples
- Displaying clear warnings when grades fall below course requirements, showing exactly how many points are needed to pass.

### When to use
- Conceptualizing new features, structuring page dashboards, and designing analytics graphs.

### When NOT to use
- Writing server scripts or configuring database tables.

### Best practices
- Keep interfaces simple and functional.

### Common mistakes
- Prioritizing visual flair over layout readability.

---

## 38. Definition of Visual Done

A view or page in GradeUnderflow is considered visually complete and production-ready only when it satisfies all criteria below:

- [ ] **Uses Dashboard Design System**: Layout aligns with the application shell and utilizes standard containers.
- [ ] **Responsive**: Verified to adapt cleanly to mobile, tablet, and desktop screens.
- [ ] **Accessible**: Keyboard navigation, focus states, and WCAG AA contrast ratios are confirmed.
- [ ] **Dark Theme Verified**: Visually tested and approved in dark mode.
- [ ] **Light Theme Verified**: Visually tested and approved in light mode.
- [ ] **Empty State**: An instructional empty page layout is present when data is missing.
- [ ] **Loading State**: Skeleton structures or spinners load during data processing states.
- [ ] **Error State**: Displays user-friendly instructions and a retry path when API calls fail.
- [ ] **Proper Spacing**: Layout strictly follows the 4px vertical and horizontal spacing scale.
- [ ] **Proper Typography**: Typographic configurations strictly follow system weights and font sizes.
- [ ] **Proper Hierarchy**: Primary data elements are highlighted, keeping secondary logs muted.
- [ ] **Proper Charts**: Visual charts use designated colors and readable legends/tooltips.
- [ ] **Proper Animations**: Hover and transition states use standard, responsive duration values.
- [ ] **Uses Shared Components**: Layout references standard elements from the ui and ds folders.
- [ ] **Browser QA Completed**: Verified on target browsers (Chrome, Safari, Firefox).
