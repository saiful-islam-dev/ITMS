# Apex Garments ITMS Enterprise - Comprehensive Project Documentation

> **System Name**: IT Operations & Facility Management System (ITMS) Enterprise v2.4  
> **Client / Organization**: Apex Garments Ltd. (Factory Units, Central Fabric Warehouses, CAD Design Studios, & Corporate HQ)  
> **Architecture**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Modular Enterprise Design System  
> **Last Updated**: November 2026  

---

## 1. Project Overview & Business Domain

**Apex Garments ITMS Enterprise** is a 24/7 mission-critical IT Operations Management (ITOM) and IT Service Management (ITSM) system engineered for large-scale garment manufacturing and multi-campus enterprise operations.

The platform manages:
1. **Distributed Campuses & Production Plants**: Real-time network telemetry, subnet leases, and uptime monitoring across cutting/sewing assembly floors, washing/dyeing plants, high-bay textile warehouses, and corporate headquarters.
2. **IT Asset Fleet & Hardware Lifecycle**: Complete hardware registry (industrial Zebra barcode printers, Optitex/Gerber CAD workstations, Cisco Nexus switches, edge SD-WAN gateways, and enterprise laptops) with warranty tracking and depreciation ledgers.
3. **Service Desk & Work Order Triage**: SLA compliance monitoring, P1/P2/P3 incident prioritization, technician velocity, and automated escalation workflows.
4. **Shift Rotations & Roster**: 24/7 rotational shift tracking for field technicians, network engineers, and systems leads across production lines.
5. **Reports & Operational Analytics**: High-density SVG telemetry curves, equipment incident distributions, downtime loss calculations, and board-certified audit export packs.
6. **User Management & Access Control**: Directory synchronization (Azure AD / Microsoft Entra ID, Okta SAML 2.0, SCIM 2.0), Role-Based Access Control (RBAC 5-tier matrix), FIDO2/TOTP MFA enforcement, and identity auditing.

---

## 2. Technology Stack & Key Dependencies

| Layer | Technology | Details / Purpose |
|---|---|---|
| **Framework** | Next.js 16.4.6 | App Router (`src/app/`), React Server/Client Components, Client Layout Shell |
| **Runtime & Language** | React 19.0.1 & TypeScript 7.0.2 | Strict type safety, clean interfaces, tabular figures, and React 19 hooks |
| **Styling & Design Tokens** | Tailwind CSS v4.3.3 (`@theme`) | CSS variables, custom token palette (`--color-primary: #3525cd`, `--color-surface-container-*`), zero-pill typography |
| **Icons & Typography** | Lucide React + Material Symbols | Combined Lucide React (`0.546.0`) with Google Material Symbols Outlined |
| **Animations** | Motion (`motion 12.23.24`) | Micro-interactions, slide drawers, and modal transitions |
| **Utilities & Data** | Pure ES Modules & Browser APIs | RFC 4180 CSV generation, Blob streaming, and zero heavy client-side chart bloat |

---

## 3. Folder Structure & Directory Map

```text
ITMS/
├── src/
│   ├── app/                                 # Next.js App Router route segments
│   │   ├── layout.tsx                       # Root layout with fonts, AppShell, AppProvider
│   │   ├── globals.css                      # Tailwind v4 @theme tokens, utility classes
│   │   ├── page.tsx                         # Root redirect to /dashboard
│   │   ├── dashboard/page.tsx               # Operations Dashboard
│   │   ├── locations/page.tsx               # Facilities & Campus Management
│   │   ├── assets/page.tsx                  # IT Asset Inventory & Equipment
│   │   ├── tickets/page.tsx                 # Support Tickets & Incident Service Desk
│   │   ├── tasks/page.tsx                   # Maintenance Tasks & Task Kanban
│   │   ├── employees/page.tsx               # Field IT Engineering & Shift Rotations
│   │   ├── departments/page.tsx             # Departmental Infrastructure Matrix
│   │   ├── reports/page.tsx                 # Reports & Operational Analytics
│   │   ├── user-management/page.tsx         # User Management & Access Control (RBAC/SSO)
│   │   ├── users/page.tsx                   # Route redirect alias to /user-management
│   │   ├── settings/page.tsx                # System Settings & Gateway Configurations
│   │   ├── login/page.tsx                   # Enterprise Login with 1-click Demo Role Switcher
│   │   ├── signup/page.tsx                  # Account Registration with Policy Verification
│   │   ├── reset-password/page.tsx          # 2-Step Password Reset & Credential Provisioning
│   │   └── forgot-password/page.tsx         # Redirect alias to /reset-password
│   │
│   ├── components/                          # Modular React Components
│   │   ├── common/                          # Reusable core design system components
│   │   │   ├── index.ts                     # Barrel export for all common components
│   │   │   ├── Modal.tsx                    # Accessible dialog wrapper (Escape key, backdrop, header)
│   │   │   ├── PageHeader.tsx               # Standardized page header (Title, Badge, Actions)
│   │   │   ├── Toast.tsx                    # Floating operational status notification banner
│   │   │   ├── TimeFilterPills.tsx          # 7D, 30D, Q1/Q2, YTD granularity selector
│   │   │   ├── EmptyState.tsx               # Search & empty state indicator with action hook
│   │   │   ├── MetricCard.tsx               # Dense KPI summary card with trend pills
│   │   │   ├── SearchBar.tsx                # Global search input with ⌘K keyboard focus
│   │   │   ├── StatusBadge.tsx              # Universal status & priority semantic badge
│   │   │   └── TabFilter.tsx                # Segmented pill-style navigation tabs
│   │   │
│   │   ├── shell/                           # Application layout & navigation frame
│   │   │   ├── AppShell.tsx                 # Responsive shell coordinating sidebar, topbar, modals
│   │   │   ├── Sidebar.tsx                  # Collapsible multi-group sidebar with badge counts
│   │   │   ├── Topbar.tsx                   # Sticky topbar with facility picker & latency meter
│   │   │   └── SystemStatusIndicator.tsx    # Live network ping & operational health tag
│   │   │
│   │   ├── screens/                         # Page view screen implementations
│   │   │   ├── DashboardScreen.tsx          # Operations Dashboard view
│   │   │   ├── LocationsScreen.tsx          # Locations & Plant Grid/Table view
│   │   │   ├── ITAssetsScreen.tsx           # IT Assets catalog view
│   │   │   ├── SupportTicketsScreen.tsx     # Incident management ticket queue
│   │   │   ├── TasksScreen.tsx              # Preventive maintenance & task board
│   │   │   ├── EmployeesScreen.tsx          # Shift roster & engineer specialization
│   │   │   ├── DepartmentsScreen.tsx        # Departmental hardware & seat allocation
│   │   │   ├── ReportsScreen.tsx            # SLA compliance, telemetry curves, risk index
│   │   │   ├── UserManagementScreen.tsx     # RBAC matrix, SCIM sync, user directory
│   │   │   └── SettingsScreen.tsx           # System & security configuration
│   │   │
│   │   ├── modals/                          # Specialized dialogs & slide-over drawers
│   │   │   ├── GlobalModals.tsx             # Centralized modal mount container
│   │   │   ├── AddLocationModal.tsx         # Campus registration dialog
│   │   │   ├── AuditLogModal.tsx            # Immutable audit trail viewer
│   │   │   ├── ConfigureSsoModal.tsx        # SAML 2.0 & SCIM directory sync settings
│   │   │   ├── CreateTaskModal.tsx          # Task creation dialog
│   │   │   ├── CreateTicketModal.tsx        # Incident ticket generation dialog
│   │   │   ├── ExportReportModal.tsx        # Multi-format data export dialog
│   │   │   ├── FacilityAssetsDrawer.tsx     # Facility asset side-drawer
│   │   │   ├── HelpModal.tsx                # Operational handbook & emergency hotline
│   │   │   ├── HotlineModal.tsx             # 24/7 IT operations telephone dispatch
│   │   │   ├── InviteUserModal.tsx          # User provisioning & RBAC assignment dialog
│   │   │   ├── NotificationsDrawer.tsx      # System alert & ticket escalation drawer
│   │   │   ├── RemoteTerminalModal.tsx      # Interactive Linux/Cisco SSH terminal simulator
│   │   │   ├── ScheduleReportModal.tsx      # Automated recurring analytics dispatcher dialog
│   │   │   ├── TaskDetailsModal.tsx         # Task checklist & progress inspection dialog
│   │   │   ├── TechnicianAuditModal.tsx     # Engineer turnaround & velocity audit dialog
│   │   │   ├── ThermalsModal.tsx            # Server room environmental sensor telemetry
│   │   │   ├── TicketDetailsModal.tsx       # Incident ticket status & audit inspect dialog
│   │   │   └── UserDetailsDrawer.tsx        # User identity, hardware & group inspector drawer
│   │   │
│   │   ├── facilities/                      # Facility-specific sub-components
│   │   │   ├── FacilityCard.tsx             # High-density facility summary card
│   │   │   ├── FacilityGrid.tsx             # Responsive grid layout for campuses
│   │   │   ├── FacilityTableView.tsx        # Dense tabular facility audit matrix
│   │   │   ├── NetworkTopologyDrawer.tsx    # L2/L3 topology and uplink inspection drawer
│   │   │   └── SubnetUtilizationStrip.tsx   # Visual CIDR block and IP lease meter
│   │   │
│   │   └── auth/                            # Reusable authentication components
│   │       ├── AuthBrandHeader.tsx          # Apex Garments ITMS logo & title header
│   │       ├── AuthFooter.tsx               # Security compliance footer with legal terms
│   │       ├── AuthHeader.tsx               # System status banner with latency gauge
│   │       ├── PasswordInput.tsx            # Toggleable password visibility input field
│   │       └── PasswordStrengthMeter.tsx    # NIST/OWASP password entropy calculation meter
│   │
│   ├── context/                             # Global Application State
│   │   └── AppContext.tsx                   # React Context managing facilities, tickets, tasks, search
│   │
│   ├── hooks/                               # Custom Reusable React Hooks
│   │   ├── index.ts                         # Barrel export for hooks
│   │   ├── useToast.ts                      # Centralized toast notification management
│   │   ├── useDebounce.ts                   # Search query and input debouncing
│   │   └── useModal.ts                      # Modal state management with escape handler
│   │
│   ├── utils/                               # Helper Utilities & Functions
│   │   ├── index.ts                         # Barrel export for utilities
│   │   ├── exportCsv.ts                     # RFC 4180 CSV export & universal downloadFile()
│   │   └── formatters.ts                    # Currency, latency, percent, date & initials formatters
│   │
│   ├── data/                                # Structured Mock Enterprise Datasets
│   │   ├── mockFacilities.ts                # 4 multi-subnet campuses (HQ, Factory A, Factory B, WH)
│   │   ├── mockAssets.ts                    # 370+ cataloged production hardware assets
│   │   ├── mockTickets.ts                   # Realistic manufacturing & network support tickets
│   │   ├── mockTasks.ts                     # Preventive maintenance work orders & checklist items
│   │   ├── mockEmployees.ts                 # Certified field technicians & systems specialists
│   │   ├── mockUsers.ts                     # Enterprise identity directory with RBAC tiers & MFA
│   │   └── mockDepartments.ts               # Departmental allocations & cost center data
│   │
│   └── types/                               # TypeScript Definitions
│       └── index.ts                         # Core domain interfaces (Facility, Ticket, Asset, Task)
│
├── DESIGN.md                                # Comprehensive visual design system & token definitions
├── IMPLEMENTATION_PLAN.md                   # Initial architectural implementation specifications
├── PROJECT_DOCUMENTATION.md                 # Complete system documentation (This file)
└── package.json                             # Dependencies, scripts, and build setup
```

---

## 4. Reusable Components, Hooks & Utilities (Refactored Library)

### 4.1 Common Components (`src/components/common/`)

- **`Modal.tsx`**: Universal accessible dialog wrapper. Provides:
  - Automatic `Escape` key handling.
  - Backdrop blur with click-outside dismissal.
  - Standardized title, subtitle, icon, and close button (`X`).
  - Responsive sizing (`sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`).
  - Accessibility attributes (`role="dialog"`, `aria-modal="true"`).

- **`PageHeader.tsx`**: Consistent header strip for every major screen.
  - Title with Material Symbol or custom SVG icon.
  - Dynamic status badge or pulse beacon.
  - Multi-line descriptive subtitle.
  - Standardized action buttons with `primary`, `secondary`, and `danger` variants.

- **`Toast.tsx`**: Floating operational notification banner.
  - Visual status types: `success`, `error`, `warning`, `info`.
  - Non-intrusive top-right placement with slide-down animation.

- **`TimeFilterPills.tsx`**: Time range granularity strip (`7D`, `30D`, `90D`, `Q1/Q2`, `YTD`, `Custom`).
  - Standardized active/inactive button styles.
  - Formatted calendar range label display.

- **`EmptyState.tsx`**: Standardized fallback for empty search results or zero-state tables.
  - Configurable icon, headline, helpful description, and action button.

- **`StatusBadge.tsx`**: Universal semantic status indicator.
  - Extended status support: `healthy`, `operational`, `warning`, `critical`, `high`, `medium`, `low`, `todo`, `in_progress`, `review`, `done`, `blocked`, `suspended`, `pending_invite`.
  - Optional animated pulse beacon for active telemetry.

- **`MetricCard.tsx`**: High-density KPI card.
  - Metric value with tabular figures.
  - Secondary value, contextual subtitle, and status pill.

- **`SearchBar.tsx`**: Global input with embedded `⌘K` keyboard shortcut and one-click clear.

### 4.2 Custom Hooks (`src/hooks/`)

- **`useToast(defaultDuration?: number)`**:
  - Exposes `toast`, `toastMessage`, `showToast(msg, type?, duration?)`, and `clearToast()`.
  - Handles auto-dismiss timeouts cleanly without race conditions.

- **`useDebounce<T>(value: T, delay?: number)`**:
  - Delays reactive state updates for search fields to avoid heavy re-filtering on rapid keystrokes.

- **`useModal(initialOpen?: boolean)`**:
  - Exposes `isOpen`, `open()`, `close()`, and `toggle()`.

### 4.3 Utilities & Formatters (`src/utils/`)

- **`downloadFile(content: string, filename: string, mimeType?: string)`**:
  - Reusable browser download helper. Eliminates repeated `Blob` creation, object URLs, and DOM link clicks.
- **`formatCsv(headers: string[], rows: (string | number)[][])`**:
  - RFC 4180-compliant CSV compiler with automatic quote escaping.
- **`formatters.ts`**:
  - `getInitials(name)`: Extracts 2-letter uppercase initials (e.g., "Tariq Rahman" $\to$ "TR").
  - `formatCurrency(amount)`: Formats numbers as USD currency (`$342,850`).
  - `formatPercent(val)`: Formats percentages (`97.4%`).
  - `formatLatency(ms)`: Formats milliseconds (`14ms`).
  - `formatDate(date)`: Formats human-readable dates ("May 18, 2025").

---

## 5. Main Features & Completed Modules

### 5.1 Reports & Operational Analytics (`/reports`)
- **Real-Time Telemetry & SLA Audit Control Bar**: Top control strip with automated scheduling dispatcher and full audit package export.
- **Granularity Strip**: 7D, 30D, Q1/Q2, YTD presets with dynamic facility, department, and dimension dropdown filters.
- **KPI Stat Cards (4 Columns)**:
  1. *Overall SLA Compliance* (97.4%, progress meter, P1: 99.2%, P2: 96.8%).
  2. *MTTR* (2h 14m, -38m WoW reduction, FCR 64.2%).
  3. *IT Capex & Opex* ($342,850, 88.4% of budget, lease/SaaS/spares breakdown).
  4. *Plant Fleet Uptime* (99.88%, 0 line halts, edge SD-WAN throughput 3,420 pkts/s).
- **Interactive SVG Chart**: 6-week bar graph comparing created vs. resolved work orders with an SLA compliance bezier curve and **interactive hover tooltips**.
- **Equipment Distribution**: Segmented progress bar and breakdown across Industrial Barcodes, Switches, CAD Workstations, Laptops, and CCTV.
- **Technician Velocity Table**: Specialist performance metrics (TR, FY, RK, KH, RI) with closed work orders, average MTTR, SLA rate, and CSAT scores, with a detailed `Full Audit ->` modal.
- **Facility Downtime Risk Index**: Micro-stoppage risk cards for Factory A ($4,200 loss), Factory B ($2,150 loss), Warehouse ($320 loss), and HQ ($580 loss).
- **Governance Catalog**: One-click downloads for Executive Governance Packs (PDF/TXT), Asset Depreciation Ledgers (CSV), and Raw Telemetry Logs (CSV).

### 5.2 User Management & Access Control (`/user-management`)
- **Header Synchronization**: Matches the enterprise specification with `Directory Sync Active: 1,428 Users Indexed`, Export, Invite User, and Configure SSO actions.
- **Breadcrumb Alignment**: Contextual navigation: `IT Operations > Administration > User Management`.
- **Directory KPI Cards**: Total Managed Identities (1,428), Live SSO Sessions (892), MFA Compliance (99.4%), and Role Escalation Requests (3).
- **Multi-Tabbed Administration**:
  1. *User Directory*: Search with ⌘K, multi-filter dropdowns (Role, Campus, Source, Status), selection checkboxes with bulk MFA reset / suspend actions, and detailed user rows.
  2. *Role-Based Access Control (RBAC Matrix)*: 5-tier matrix mapping operational privileges against SSH terminals, CIDR subnets, thermal calibration, and ticket approvals.
  3. *SSO & SCIM Sync Status*: Real-time federation telemetry for Microsoft Entra ID (Azure AD), Okta Workforce, and Local ITMS Break-Glass DB with manual sync triggers.
  4. *Access & Security Audit Trail*: Real-time immutable audit log of SAML token grants, FIDO2 authentication events, and role changes.
- **Integrated Modals**:
  - `InviteUserModal`: Corporate email, employee ID, role assignment, facility binding, and mandatory first-login MFA setup.
  - `ConfigureSsoModal`: SAML 2.0 / SCIM 2.0 tenant configuration, client credentials, and live connection testing.
  - `UserDetailsDrawer`: Side inspection drawer showing checked-out hardware assets, directory security groups, and session controls.

### 5.3 Operations Dashboard (`/dashboard`)
- Global system health overview with 6 core telemetry cards.
- Live plant feed with 1-click resync.
- Critical ticket queue with quick status progression.
- Interactive facility status cards with thermals and terminal actions.

### 5.4 Locations & Facilities Management (`/locations`)
- Grid and table views of 4 campuses (Apex HQ, Factory A, Factory B, Central Fabric Warehouse).
- Detailed network topology side-drawer with L2/L3 switch maps.
- Interactive Subnet Utilization strip (CIDR /24 and /23 blocks, leased vs. reserved IPs).
- Environmental sensor telemetry (Rack temperatures, humidity, fan RPMs, power draw).

### 5.5 IT Asset Lifecycle (`/assets`)
- Comprehensive asset inventory covering workstations, switches, servers, industrial barcode printers, laptops, and APs.
- Spec notes, IP/MAC addresses, warranty expiration dates, and assigned personnel.
- CSV ledger export.

### 5.6 Support Tickets Service Desk (`/tickets`)
- High-velocity queue with SLA timers and severity color coding.
- Ticket creation dialog with facility linking.
- Ticket details inspector with resolution action notes.

### 5.7 Maintenance Tasks & Task Kanban (`/tasks`)
- 4 Kanban columns (`To Do`, `In Progress`, `In Review`, `Done`).
- Subtask checklists with progress percentage meters.
- CSV task management export.

### 5.8 Field IT Employees & Roster (`/employees`)
- Roster of 14 on-floor engineers across 3 shifts (General, Shift A, Shift B).
- Certifications, contact numbers, and technical specialties.

### 5.9 Departments Matrix (`/departments`)
- Departmental hardware allocation, active user headcounts, and assigned IT leads.

### 5.10 System Settings (`/settings`)
- Edge gateway configurations, alert thresholds, and backup schedules.

### 5.11 Authentication Suite (`/login`, `/signup`, `/reset-password`)
- Clean auth layout with `AuthHeader`, `AuthBrandHeader`, and `AuthFooter`.
- 1-click **Demo Role Switcher** on login (`Super Admin`, `IT Manager`, `Floor Tech`).
- NIST-compliant `PasswordStrengthMeter` and entropy evaluator.
- Multi-step credential provisioning on password reset.

---

## 6. Current Development Status & Verification

- **TypeScript Compilation**: `npm run lint` (`tsc --noEmit`) passes with **0 errors**.
- **Design Tokens**: Standardized on Tailwind CSS v4 `@theme` with CSS custom variables defined in `globals.css` and `DESIGN.md`.
- **Modular Code**: Code duplication has been refactored into `src/components/common/`, `src/hooks/`, and `src/utils/`.
- **Runtime Port**: Development server runs on `http://localhost:3000`.

---

## 7. Known Issues & Operational Considerations

1. **Turbopack Build Cache in Sandboxed Environments**:
   - In isolated Windows sandbox environments without elevated admin permissions, `next build` with Turbopack can occasionally trigger an `EPERM: operation not permitted` on `.next/server/app/` directory creation. Running with `--webpack` or outside the sandbox resolves this.
2. **Mock Data Persistence**:
   - The application currently uses in-memory React state initialized from `src/data/mock*.ts`. Reloading the browser tab resets newly created tickets or tasks to initial mock states.
3. **SSH Remote Terminal Simulator**:
   - The remote terminal modal simulates realistic Cisco IOS and Linux CLI commands (`show ip int brief`, `ping`, `uptime`, `reload`). It is a high-fidelity frontend simulation and does not open real raw sockets to hardware switches.

---

## 8. Recommended Next Steps for Future Development

1. **Backend & Database Integration**:
   - Connect Next.js API route handlers (`/api/tickets`, `/api/facilities`, `/api/users`) to a PostgreSQL / Prisma ORM database.
2. **Real SCIM & Okta Webhooks**:
   - Implement real incoming SCIM 2.0 endpoints (`/api/scim/v2/Users` and `/api/scim/v2/Groups`) to accept provisioning payloads from Microsoft Entra ID or Okta.
3. **Live WebSockets for Telemetry**:
   - Replace the simulated ping/latency generator with a WebSocket connection connected to plant Prometheus / SNMP collectors.
4. **Role Permission Guards**:
   - Implement Next.js middleware (`middleware.ts`) to restrict access to `/user-management` and `/settings` based on session RBAC tier.
5. **Print-Optimized Styles for Audits**:
   - Add `@media print` CSS rules so that clicking "Download PDF" on the Executive Governance report opens the browser's native print-to-PDF dialog formatted as a multi-page audit document.
