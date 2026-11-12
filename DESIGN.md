# Design System & Technical Specifications: ITMS Enterprise ("Garment Ops Precision")

This document details the complete design tokens, architectural rules, layout patterns, and component guidelines for the **Apex Garments ITMS Enterprise (IT Operations Management & Facility System)**.

---

## 1. Design Philosophy & Character

- **Domain**: Mission-critical IT Operations Management (ITOM/ITSM) across 24/7 distributed garment manufacturing plants, high-bay textile logistics warehouses, and corporate headquarters.
- **Aesthetic Benchmark**: Inspired by Datadog, Linear, and AWS CloudWatch. High data-density, zero ornamental fluff, strict visual hierarchy, instant status triage, and clear typography.
- **Surface Elevation**: Low-contrast outlines and razor-thin ambient shadows rather than heavy blurs or artificial 3D skeumorphism.
- **Zero-Pill Discipline**: Operational metadata is rendered as crisp, unboxed text separated by subtle bullets (`·`) or slashes (`/`), reserving rounded pills strictly for status indicators and active filter buttons.

---

## 2. Color Palette & Tokens

### 2.1 CSS Variables & Hex References

```css
:root {
  /* Canvas & Base Surfaces */
  --background: #faf8ff;              /* Level 0 canvas background */
  --surface: #faf8ff;                 /* Surface base */
  --surface-bright: #faf8ff;          /* High-light surface */
  --surface-dim: #d2d9f4;             /* Inactive or dimmed surface */
  --surface-container-lowest: #ffffff; /* Level 1 card surface */
  --surface-container-low: #f2f3ff;    /* Subdued container / input field surface */
  --surface-container: #eaedff;        /* Neutral badge / secondary button bg */
  --surface-container-high: #e2e7ff;   /* Hover states on navigation / table striping */
  --surface-container-highest: #dae2fd;/* Accent container / selected highlight */

  /* Primary Interactive & Identity */
  --primary: #3525cd;                 /* Primary brand indigo */
  --primary-container: #4f46e5;       /* Elevated interactive button bg */
  --primary-hover: #3730a3;           /* Darker indigo on hover */
  --primary-active: #312e81;          /* Active state */
  --on-primary: #ffffff;              /* Text on primary button */
  --on-primary-container: #dad7ff;    /* Contrast text on container */

  /* Secondary & Tertiary Neutrals */
  --secondary: #5b598c;
  --secondary-container: #c7c3fe;
  --tertiary: #004c76;
  --tertiary-container: #00659a;
  --on-secondary: #ffffff;
  --on-tertiary: #ffffff;

  /* Typography / Ink Colors */
  --on-surface: #131b2e;              /* Primary text & high-contrast headers (Slate-950) */
  --on-surface-variant: #464555;      /* Subtitles, secondary metadata, inactive nav (Slate-600) */
  --outline: #777587;                 /* Borders on active inputs, placeholder text */
  --outline-variant: #c7c4d8;         /* Hairline dividers, breadcrumb chevrons (#E2E8F0 equivalent) */

  /* Semantic Operational Status Colors */
  /* Healthy / Operational (Emerald) */
  --status-healthy-text: #065f46;
  --status-healthy-bg: #ecfdf5;
  --status-healthy-border: #a7f3d0;
  --status-healthy-dot: #10b981;

  /* Warning / Degraded / Maintenance (Amber) */
  --status-warning-text: #92400e;
  --status-warning-bg: #fffbeb;
  --status-warning-border: #fde68a;
  --status-warning-dot: #f59e0b;

  /* Critical / Outage / Incident (Rose / Red) */
  --status-error-text: #9f1239;
  --status-error-bg: #fff1f2;
  --status-error-border: #fecdd3;
  --status-error-dot: #e11d48;

  /* Network / Informational (Sky / Blue) */
  --status-info-text: #0369a1;
  --status-info-bg: #f0f9ff;
  --status-info-border: #bae6fd;
  --status-info-dot: #0284c7;
}
```

### 2.2 60-30-10 Color Balance
- **60% Canvas**: `#FAF8FF` canvas with clean `#FFFFFF` card panels.
- **30% Structure**: Hairline slate borders (`#E2E8F0` / `#C7C4D8`) and subdued neutral containers (`#F2F3FF`, `#EAEDFF`).
- **10% High-Intent Accents**: `#4F46E5` primary actions, `#10B981` operational health pills, `#F59E0B` telemetry warnings.

---

## 3. Typography System

The interface pairs **Inter** for clean, dense UI reading with **JetBrains Mono** for hardware serials, subnets, latencies, and tabular figures.

| Token | Family | Size | Weight | Line Height | Tracking | Purpose |
|---|---|---|---|---|---|---|
| `metric-display` | Inter | 24px (1.5rem) | 700 (Bold) | 28px | -0.03em | Primary KPI card numbers |
| `headline-xl` | Inter | 24px (1.5rem) | 600 (SemiBold) | 32px | -0.02em | Page title ("Location & Facility Management") |
| `headline-lg` | Inter | 18px (1.125rem) | 600 (SemiBold) | 24px | -0.01em | Modal headers, drawer titles |
| `headline-md` | Inter | 16px (1rem) | 600 (SemiBold) | 22px | -0.01em | Facility card titles, sub-section headers |
| `headline-sm` | Inter | 14px (0.875rem) | 600 (SemiBold) | 20px | 0 | Subnet names, table section titles |
| `body-default` | Inter | 14px (0.875rem) | 400 (Regular) | 20px | 0 | Dialog copy, general descriptive paragraphs |
| `body-dense-medium` | Inter | 13px (0.8125rem) | 500 (Medium) | 18px | 0 | Active navigation items, table primary text |
| `body-dense` | Inter | 13px (0.8125rem) | 400 (Regular) | 18px | 0 | Standard table cell data, subtitles |
| `label-compact` | Inter | 11px (0.6875rem) | 600 (SemiBold) | 14px | +0.03em | Uppercase card headers, badges, tags |
| `caption` | Inter | 12px (0.75rem) | 400 (Regular) | 16px | 0 | Image card overlays, secondary timestamp |
| `code-mono` | JetBrains Mono | 12px (0.75rem) | 400/500 | 16px | 0 | Subnets (10.14.0.0/18), ping latency, tags |

### Tabular Numbers Rule
All numeric KPIs, ping metrics, asset counts, and table numerical values use `font-variant-numeric: tabular-nums` or `font-mono` to prevent horizontal jitter during live telemetry updates.

---

## 4. Spacing & Spatial Math

Based on an 8px base grid with 4px half-steps:

| Token | Value | Tailwind Class | Usage |
|---|---|---|---|
| `space-xs` | 4px (0.25rem) | `p-1`, `gap-1`, `space-y-1` | Tight badge internal padding, micro icon spacing |
| `space-sm` | 8px (0.5rem) | `p-2`, `gap-2`, `space-y-2` | Toolbar control gaps, input padding vertical |
| `space-md` | 12px (0.75rem) | `p-3`, `gap-3`, `space-y-3` | Card headers, table cell horizontal padding |
| `space-lg` | 16px (1rem) | `p-4`, `gap-4`, `space-y-4` | Card inner body padding, metric card margins |
| `space-xl` | 24px (1.5rem) | `p-6`, `gap-6`, `space-y-6` | Page margins, primary section gaps |
| `gutter` | 16px (1rem) | `gap-4` | Grid column spacing |

### Spatial Math Rule:
Outer container padding $\ge$ inner gap between children. Minimum outer card padding is `16px` (`p-4` or `p-space-lg`).

---

## 5. Border Radius & Shapes

Industrial soft-edge geometry without rounded capsules on primary buttons:

- `rounded-sm`: 2px (`0.125rem`) - Micro indicators, code pills
- `rounded-DEFAULT`: 4px (`0.25rem`) - Standard input fields, table cell hover states
- `rounded-md`: 6px (`0.375rem`) - Action buttons, select dropdowns
- `rounded-lg`: 8px (`0.5rem`) - Toolbar filters, inner media banners, nav links
- `rounded-xl`: 12px (`0.75rem`) - Main facility cards, KPI cards, modal containers
- `rounded-full`: 9999px - Status indicators, live ping dots, user avatar

---

## 6. Elevation & Shadow Hierarchy

- **Level 0 (Canvas)**: Background `#FAF8FF`, no shadow.
- **Level 1 (Cards & Structural Panes)**: Background `#FFFFFF`, border `1px solid #E2E8F0`, shadow `0 1px 3px 0 rgba(15, 23, 42, 0.04)`.
- **Level 2 (Popovers, Toolbars & Menus)**: Background `#FFFFFF`, border `1px solid #CBD5E1`, shadow `0 4px 6px -1px rgba(15, 23, 42, 0.08)`.
- **Level 3 (Modals & Slide-out Drawers)**: Background `#FFFFFF`, border `1px solid #E2E8F0`, shadow `0 10px 25px -5px rgba(15, 23, 42, 0.12)`.

---

## 7. Component Guidelines (shadcn/ui Adaptation)

### 7.1 Sidebar Navigation (`aside`)
- **Dimensions**: Fixed width `256px` (`w-64`), left-aligned, height `100vh`.
- **Header**: Logo + "ITMS v2.4 Enterprise" badge + "Apex Garments IT Ops" subtitle + collapse toggle icon (`first_page`).
- **Grouping**:
  - `MAIN`: Dashboard, Employees, IT Assets, Support Tickets (Badge `18`), Tasks (Badge `5`).
  - `ORGANIZATION`: Departments, Locations (Active: `bg-primary-container text-on-primary`).
  - `ADMINISTRATION`: Reports & Analytics, User Management, System Settings.
- **Footer**: "All Systems Operational" with pulsing ping indicator + server ping action + "Help & Docs" button.

### 7.2 Header Topbar (`header`)
- **Dimensions**: Fixed top `h-14` (56px), left `64` (pl-64 offset), full width.
- **Left Zone**:
  - Breadcrumbs: `IT Operations > Organization > Locations` with `chevron_right`.
  - Campus Quick Selector: `All Facilities (Apex Garments)` dropdown.
- **Right Zone**:
  - Global Search Input: `w-72` with search icon and `⌘K` keyboard badge.
  - Network Health Ticker: Wi-Fi latency badge `14ms`.
  - Notifications bell with red unread dot.
  - Help icon button.
  - User profile lockup: Tariq Rahman (IT Ops Lead / Super Admin) with avatar & dropdown caret.

### 7.3 Metric KPI Cards (4-Column Strip)
1. **Total Facilities**: `4 Active Campuses`, `100% Operational Status`, location tags `Dhaka • Gazipur`.
2. **Connectivity & Uptime**: `99.85% SLA Target met`, `Edge SD-WAN • Dual Uplink`, warning badge `1 Alert`.
3. **Deployed Hardware**: `864 Cataloged Units`, `318 PC • 342 Terminals`, tag status `98.4% Tagged`.
4. **On-Site IT Personnel**: `14 Field Engineers Active`, `2 Shift Rotations Active`, `0 Open Absences`.

### 7.4 Facility Cards (2-Column Grid)
- **Header**: Facility Name, Code Badge (`LOC-CORP-01`, `LOC-FCT-01`, etc.), Subtitle, SLA Health Pill.
- **Media Banner**: Aspect ratio banner image with photo of facility interior + dark scrim overlay + location pin + live ping (`Ping: 4ms`).
- **Telemetry Grid (3-column mini spec)**: Subnet Allocation, Active Fleet, Server/Network IDFs.
- **Hardware Ecosystem Snapshot**: Tag pills for deployed hardware (CAD Rigs, Barcode Printers, Cisco Switches, etc.).
- **Lead & Ticket Status**: Lead engineer avatar/name + technician count + open ticket status pill.
- **Card Footer**: Primary action link "Manage Facility Assets →" + utility buttons (Terminal/SSH, Thermals/Telemetry, Settings).

### 7.5 Network Topology Drawer (Interactive Mesh Map)
- Visual SVG connecting lines with animated packet flow.
- Nodes:
  - Apex HQ (Core Data Center) - `10.14.0.0/18` (4ms)
  - FortiGate SD-WAN Central Hub (4 Tunnels Synchronized)
  - Factory Building A - `10.14.20.0/20` (12ms)
  - Factory Building B - `10.14.40.0/20` (18ms Jitter)
  - Central Fabric Warehouse - `10.14.60.0/21` (8ms)

### 7.6 Facility Comparison Table (Alternative View)
- High-density table with columns: Facility Name & Code, Physical Location, Subnet & Uplink, Staff / Assets, On-Site IT Lead, SLA Status, Quick Actions.

### 7.7 Master IP Subnet & Address Pool Utilization Strip
- Master pool status (`Supernet: 10.14.0.0/16`, 62% utilized bar, Emergency Hotline button).
- 4 Subnet gauges: HQ Core Subnet (74%), Factory A (58%), Factory B (82% - VLAN Re-index warning), Warehouse Subnet (38%).

---

## 8. Responsive Breakpoints & Reflow Behavior

- **Desktop ($\ge 1280px$)**: Full sidebar (256px), 4-column KPI strip, 2-column facility grid.
- **Tablet Landscape ($1024px - 1279px$)**: Sidebar collapses to icon rail (64px) or slides in overlay; KPI cards reflow to 2x2 grid.
- **Tablet Portrait & Mobile ($< 1024px$)**: Mobile header with hamburger menu, single-column facility cards, horizontally scrolling comparison table with sticky columns.
