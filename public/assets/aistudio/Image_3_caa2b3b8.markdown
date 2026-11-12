---
name: Garment Ops Precision
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#5b598c'
  on-secondary: '#ffffff'
  secondary-container: '#c7c3fe'
  on-secondary-container: '#514f81'
  tertiary: '#004c76'
  on-tertiary: '#ffffff'
  tertiary-container: '#00659a'
  on-tertiary-container: '#bedfff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c4c1fb'
  on-secondary-fixed: '#181445'
  on-secondary-fixed-variant: '#444173'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  metric-display:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.03em
  body-default:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-dense:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-dense-medium:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  code-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-compact:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style
The design system serves mission-critical IT Operations Management (ITOM/ITSM) across distributed apparel manufacturing plants, logistics hubs, and executive headquarters. The visual character reflects precision engineering, operational calm, and absolute utilitarian efficiency. 

To maximize operational throughput across continuous 24/7 shifts, the design language follows a high-density modern enterprise standard inspired by Datadog and Linear. It rejects marketing whitespace, oversized hero graphics, and decorative flourishes in favor of structured data density, rapid scan-paths, unambiguous severity telegraphing, and spatial discipline.

## Colors
The palette balances an authoritative deep indigo primary identity with functional semantic accents tuned for instant operational status triage:

- **Primary & Interactive:** Deep Indigo (`#4F46E5`) provides focused interactive affordances without visual vibration. Deep Navy (`#1E1B4B`) anchors primary headers, active sidebar states, and brand framing. Indigo Dark (`#3730A3`) serves hover and focused states.
- **Surfaces & Neutral Structural Elements:** 
  - Application Canvas: Off-white slate (`#F8FAFC`) to minimize glare during prolonged shifts.
  - Cards & Panes: Pure white (`#FFFFFF`) to establish elevation through crisp division.
  - Structural Dividers & Hairline Borders: Slate-200 (`#E2E8F0`).
  - Text Hierarchy: Slate-900 (`#0F172A`) for primary data/headings, Slate-500 (`#64748B`) for metadata and field labels, and Slate-400 (`#94A3B8`) for placeholder text and inactive icons.
- **Operational Status Accents:**
  - **Healthy / Operational / Resolved:** Emerald (`#10B981`), surface tint (`#ECFDF5`), border (`#A7F3D0`).
  - **Warning / Degraded / In-Progress:** Amber (`#F59E0B`), surface tint (`#FFFBEB`), border (`#FDE68A`).
  - **Critical / Outage / Breach:** Rose (`#E11D48`), surface tint (`#FFF1F2`), border (`#FECDD3`).
  - **Informational / Queued / Network:** Sky (`#0284C7`), surface tint (`#F0F9FF`), border (`#BAE6FD`).

## Typography
Typography is configured for tight scannability and high data density. Inter provides neutral, highly legible glyphs optimized for data-dense tables, numeric displays, and technical labeling.

- **Tabular Figures:** Always apply `font-variant-numeric: tabular-nums` to metric cards, uptime tickers, latency values, and data table columns to ensure strict vertical alignment during live data streaming.
- **Metric Displays:** Reserved for core operational counters (e.g., Active Incidents, Machine Downtime, Floor Network Latency). These pair tightly with a 11px uppercase label positioned directly above or below.
- **Data Table Cells:** Use `body-dense` (13px/18px) to allow over 20 visible records above the fold on standard enterprise displays without sacrificing vertical legibility.
- **Device IDs & Log Strings:** Use JetBrains Mono (`code-mono`) for factory IoT telemetry, MAC addresses, machine serials, and switch IDs.

## Layout & Spacing
The layout relies on a strict 8px spatial grid combined with 4px half-steps for compact UI controls.

- **Shell Architecture:** Fixed left collateral navigation bar (collapsible between 240px expanded and 64px icon-only), persistent global utility topbar (48px height), and a fluid primary viewport (`calc(100vw - sidebar)`).
- **Grid Structure:** Fluid grid utilizing 12 columns with a fixed 16px (`1rem`) gutter and 24px (`1.5rem`) canvas margins. No artificial max-width constraints exist on standard dashboard views; cards and tables stretch dynamically to utilize available display real estate.
- **Breakpoints:**
  - **Desktop (>=1280px):** Default view mode; multi-column KPI grids, side-by-side telemetry charts, and standard full-width data tables.
  - **Compact Desktop / Tablet Landscape (1024px - 1279px):** Left sidebar automatically collapses to icon-only mode; KPI cards reflow to a 2x2 grid.
  - **Field Tablet Portrait (<1024px):** Operational views shift to single-column card stacks; data tables activate horizontal scrolling with pinned identity columns.

## Elevation & Depth
The system achieves visual clarity through low-contrast outlines and razor-thin ambient shadows rather than heavy blurring or artificial physical metaphors.

- **Level 0 (Canvas):** The base `#F8FAFC` foundation.
- **Level 1 (Card & Section Surfaces):** Background `#FFFFFF` bordered by a crisp `1px solid #E2E8F0` and anchored by an ultra-subtle ambient drop shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Popovers, Filter Menus, & Dropdowns):** Background `#FFFFFF`, border `1px solid #CBD5E1`, with shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals & Slide-out Drawers):** Background `#FFFFFF`, shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)`.
- **Interaction Feedback:** Interactive list rows and cards do not lift off the Z-axis; they respond via subtle surface color shifts (`#F1F5F9`) and border tint transitions to prevent visual fatigue.

## Shapes
A unified "Soft" border-radius profile (4px base, 6px intermediate, 8px outer) guarantees structured, industrial geometry without appearing aggressive or archaic.

- **Inputs, Buttons, Badges, & Table Rows:** 4px to 6px corner radius.
- **Data Cards, Metric Panels, & Drawers:** 6px to 8px corner radius.
- **Status Indicators & Health Dots:** 9999px (circular pills).
- Avoid large circular capsules on structural buttons or input fields to preserve geometric discipline and alignment across tabular grids.

## Components

### Buttons
- **Primary:** Background `#4F46E5`, text `#FFFFFF`, border `1px solid transparent`, height `32px` (dense) or `36px` (regular), padding `0 12px`. Hover: `#4338CA`. Active: `#3730A3`.
- **Secondary:** Background `#FFFFFF`, text `#0F172A`, border `1px solid #CBD5E1`. Hover: `#F8FAFC`.
- **Destructive:** Background `#E11D48`, text `#FFFFFF`. Hover: `#BE123C`.
- **Ghost / Icon Only:** Minimal hit state (`32px x 32px`), transparent background, icon color `#64748B`. Hover: `#F1F5F9` with text `#0F172A`.

### Data Tables (High Density)
- **Header:** Height `32px`, background `#F8FAFC`, border bottom `1px solid #E2E8F0`, typography `label-compact` in `#64748B`, text uppercase with subtle sort arrows.
- **Row:** Height `36px` (ultra-compact) to `40px` (standard), border bottom `1px solid #F1F5F9`, hover background `#F8FAFC`.
- **Cells:** Typography `body-dense`, vertical-align middle, left/right padding `12px`.

### Status Badges & SLA Indicators
- **Structure:** Height `20px`, padding `0 6px`, border radius `4px`, typography `label-compact`.
- **Operational:** Background `#ECFDF5`, text `#065F46`, border `1px solid #A7F3D0`. Includes a 6px solid emerald dot.
- **Warning / Degraded:** Background `#FFFBEB`, text `#92400E`, border `1px solid #FDE68A`.
- **Critical Breach:** Background `#FFF1F2`, text `#9F1239`, border `1px solid #FECDD3`. Includes a pulsing dot if unresolved > 15m.
- **SLA Countdown Timer:** Monospace font with progress track: green (>4h), amber (1-4h), red (<1h or breached).

### KPI Metric Stat Cards
- Enclosed in `Level 1` card surface, padding `16px`.
- Structure: Top row features the 11px uppercase metric label and context icon. Middle row holds the 24px tabular bold metric value. Bottom row displays a micro trend pill (`+2.4% vs last shift`) and operational time stamp.

### Input Fields & Controls
- **Inputs:** Height `32px`, padding `0 8px`, border `1px solid #CBD5E1`, typography `body-dense`, border radius `6px`. Focus state: `1px solid #4F46E5` with `0 0 0 2px rgba(79, 70, 229, 0.15)`.
- **Checkboxes & Radios:** `16px x 16px`, border `1px solid #CBD5E1`, border-radius `3px` (checkbox) or `50%` (radio). Checked state: `#4F46E5`.

### Iconography
- Standardize on Lucide icons set strictly to `14px` (dense buttons, badges), `16px` (table actions, standard inputs), or `18px` (navigation bars), utilizing a uniform 1.5px stroke weight.