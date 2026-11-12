# Implementation Plan: Apex Garments ITMS Enterprise (React SPA)

This implementation plan outlines the React application architecture, component hierarchy, state management, and the sequential implementation roadmap based on the provided Stitch designs and technical specifications.

---

## 1. React Application Architecture & Structure

The application is structured as a modular, component-driven React + TypeScript application with Tailwind CSS and Lucide / Material icons:

```text
/src
├── assets/                          # Local image assets and logos
│   └── images/                      # Facility photos & avatars
├── components/
│   ├── shell/                       # Global application shell
│   │   ├── Sidebar.tsx              # 256px collapsible sidebar with navigation & badges
│   │   ├── Topbar.tsx               # Global utility header (breadcrumbs, search, latency, user profile)
│   │   └── SystemStatusIndicator.tsx# Live operational status indicator with ping trigger
│   ├── common/                      # Reusable UI primitives
│   │   ├── StatusBadge.tsx          # Health / warning / critical status pill
│   │   ├── MetricCard.tsx           # Executive KPI statistic card with icon & micro-metrics
│   │   ├── SearchBar.tsx            # Search input with ⌘K badge and debounce
│   │   └── TabFilter.tsx            # Segmented filter buttons with count badges
│   ├── facilities/                  # Facility & Location domain components
│   │   ├── FacilityCard.tsx         # Primary rich card (photo banner, telemetry, tags, lead, tickets)
│   │   ├── FacilityGrid.tsx         # Responsive 2-column grid container
│   │   ├── FacilityTableView.tsx    # High-density comparative table roster
│   │   ├── NetworkTopologyDrawer.tsx# Collapsible interactive SD-WAN mesh map with live ping
│   │   └── SubnetUtilizationStrip.tsx# Master IP pool capacity gauge & 4 subnet progress cards
│   ├── modals/                      # Interactive modals and drawers
│   │   ├── AddLocationModal.tsx     # Provisioning modal for creating a new facility
│   │   ├── FacilityAssetsDrawer.tsx # Slide-out hardware inventory for a facility
│   │   ├── RemoteTerminalModal.tsx  # Interactive SSH console simulator for network switches
│   │   ├── ThermalsModal.tsx        # Environmental sensor diagnostics (Factory B IDF moisture/heat)
│   │   └── ExportReportModal.tsx    # CSV/audit report generation modal
│   └── screens/                     # Full-page screen views
│       ├── LocationsScreen.tsx      # PRIMARY STITCH SCREEN: Location & Facility Management
│       ├── DashboardScreen.tsx      # Executive IT operations overview
│       ├── ITAssetsScreen.tsx       # Comprehensive hardware asset index (864 units)
│       ├── SupportTicketsScreen.tsx # Service desk tickets queue (18 tickets)
│       ├── EmployeesScreen.tsx      # Field engineers roster & shift rotations (14 techs)
│       ├── DepartmentsScreen.tsx    # Departmental equipment allocations
│       └── SettingsScreen.tsx       # System parameters & alert thresholds
├── data/
│   ├── mockFacilities.ts            # Complete initial dataset of 4 campuses + telemetry
│   ├── mockAssets.ts                # Cataloged hardware fleet per facility
│   └── mockTickets.ts               # Open support tickets per facility
├── types/
│   └── index.ts                     # TypeScript interfaces and enum definitions
├── utils/
│   └── exportCsv.ts                 # Utility to generate and download facility audit CSV
├── App.tsx                          # Root layout, routing/screen switcher, global state
├── main.tsx                         # React 19 entry point
└── index.css                        # Global CSS variables, fonts, and Tailwind styles
```

---

## 2. Key Component Specifications

### 2.1 Application Shell (`Sidebar` & `Topbar`)
- **`Sidebar.tsx`**:
  - Brand header: ITMS logo, `v2.4 Enterprise` badge, `Apex Garments IT Ops` subtitle, collapse toggle.
  - Navigation Sections:
    - **MAIN**: Dashboard, Employees, IT Assets, Support Tickets (`18` badge), Tasks (`5` badge).
    - **ORGANIZATION**: Departments, Locations (active state with indigo background).
    - **ADMINISTRATION**: Reports & Analytics, User Management, System Settings.
  - Bottom Status card: "All Systems Operational" with live pulsing dot, quick server ping action, and "Help & Docs" button.
  - Mobile responsiveness: Collapsible drawer for $< 1024px$ screens with backdrop overlay.

- **`Topbar.tsx`**:
  - Left zone: Hierarchical breadcrumbs (`IT Operations > Organization > Locations`) + facility selector dropdown (`All Facilities (Apex Garments)`).
  - Right zone: Global search input (`Search tickets, serials, employees... ⌘K`), latency monitor (`14ms`), notification bell with unread indicator, help button, and user profile (`Tariq Rahman`, IT Ops Lead / Super Admin).

### 2.2 Executive KPI Strip (`MetricCard.tsx`)
Four high-density stat cards in a responsive grid (`1` col on mobile $\rightarrow$ `2` cols on tablet $\rightarrow$ `4` cols on desktop):
1. **Total Facilities**: `4 Active Campuses`, `100% Operational Status`, location tags `Dhaka • Gazipur`.
2. **Connectivity & Uptime**: `99.85% SLA Target met`, `Edge SD-WAN • Dual Uplink`, warning badge `1 Alert`.
3. **Deployed Hardware**: `864 Cataloged Units`, `318 PC • 342 Terminals`, tag status `98.4% Tagged`.
4. **On-Site IT Personnel**: `14 Field Engineers Active`, `2 Shift Rotations Active`, `0 Open Absences`.

### 2.3 Filter & Controls Toolbar
- **Segment Filter Tabs**: `All Facilities (4)`, `Manufacturing Plants (2)`, `Warehouses & Logistics (1)`, `Corporate & Design HQ (1)`.
- **Search Input**: Instant client-side search filtering by facility name, campus code, subnet, or lead engineer.
- **Status Dropdown**: Filter by `All Status`, `Critical Only`, or `Under Maintenance`.
- **Topology Toggle Button**: Expandable toggle for the live SD-WAN Mesh Map.
- **View Switcher**: Grid View (cards) vs. Table View (high-density roster).

### 2.4 Interactive Network Topology Drawer (`NetworkTopologyDrawer.tsx`)
- Collapsible interactive mesh diagram connecting:
  - **Apex HQ (Core DC)**: `10.14.0.0/18` (4ms latency, Dual 1Gbps)
  - **FortiGate SD-WAN Central Cloud**: 4 tunnels synchronized
  - **Factory Building A**: `10.14.20.0/20` (12ms)
  - **Factory Building B**: `10.14.40.0/20` (18ms Jitter warning)
  - **Central Fabric Warehouse**: `10.14.60.0/21` (8ms)
- Interactive features: Ping test button to re-simulate live latency and tunnel health.

### 2.5 Facility Cards Grid (`FacilityCard.tsx`)
Four rich cards covering all Apex Garments facilities:
1. **Apex HQ & Design Studio (`LOC-CORP-01`)**
   - Subtitle: Corporate Headquarters & CAD Pattern Studios
   - Status: Healthy (99.98% SLA)
   - Media: Studio image with overlay: Plot 14, Sector 7, Uttara, Dhaka | Ping: 4ms
   - Telemetry: Subnet `10.14.0.0/18`, Active Fleet: 285 Assets, Server: 3 Server Racks (Primary On-Prem DC)
   - Hardware: High-Spec CAD Rigs, Executive MacBooks, Cisco Nexus Core, Fortinet HA Firewalls
   - Lead: Tariq Rahman (+4 Techs) | 2 Tickets Open
2. **Factory Building A (`LOC-FCT-01`)**
   - Subtitle: High-Volume Garment Manufacturing Floor
   - Status: Operational (99.82% SLA)
   - Media: Manufacturing plant image: Apex Industrial Park, Block B, Gazipur | Ping: 12ms
   - Telemetry: Subnet `10.14.20.0/20`, Active Fleet: 326 Assets, Server: 12 IDF Cabinets (Fiber Ring)
   - Hardware: Zebra ZT410 Barcode, Rugged QC Tablets, Aruba PoE+ Switches, RFID Conveyor Gates
   - Lead: Kabir Hossain (+5 Field Techs) | 9 Tickets (1 Critical)
3. **Factory Building B (`LOC-FCT-02`)**
   - Subtitle: Heavy Industrial & Chemical Washing Facility
   - Status: Maintenance • VLAN 40 (Amber warning)
   - Media: Washing/dyeing facility image: Apex Industrial Park, Block C, Gazipur | Ping: 18ms (Jitter)
   - Telemetry: Subnet `10.14.40.0/20`, Active Fleet: 189 Assets, Environmental: 6 Sealed IDFs (IP65)
   - Hardware: Waterproof Touch Terminals, Chemical Dosing IoT, Brother RFID Hubs, Cisco 2960-X
   - Lead: Rafiqul Islam (+3 Field Techs) | 12 Tickets (2 Critical)
4. **Central Fabric Warehouse Hub (`LOC-WHSE-01`)**
   - Subtitle: Raw Materials, Yarn & Finished Goods Logistics
   - Status: Operational (99.91% SLA)
   - Media: Warehouse interior image: Savar Transport Corridor, Dhaka | Ping: 8ms
   - Telemetry: Subnet `10.14.60.0/21`, Active Fleet: 64 Assets, Wireless: 18 APs High-Bay (Full Roaming)
   - Hardware: Impinj Speedway RFID, Zebra TC26 Handhelds, Hikvision 4K PTZ, Barcode Scales
   - Lead: Farhana Yeasmin (+2 Field Techs) | 5 Tickets Open

### 2.6 Master IP Subnet Utilization Strip (`SubnetUtilizationStrip.tsx`)
- Master Supernet: `10.14.0.0/16` with overall 62% utilization progress bar.
- Shift Supervisor Hotline quick dial trigger.
- Four subnet cards with capacity meters:
  - HQ Core Subnet (`10.14.0.0/18` - 74% Leased, 1,210 Hosts, Healthy)
  - Factory A Subnet (`10.14.20.0/20` - 58% Leased, 610 Hosts, Healthy)
  - Factory B Subnet (`10.14.40.0/20` - 82% Leased, 840 Hosts, VLAN Re-index warning)
  - Warehouse Subnet (`10.14.60.0/21` - 38% Leased, 194 Hosts, Ample Headroom)

---

## 3. Sequence of Implementing Screens

Implementation proceeds in five strict phases to guarantee zero broken states:

### Phase 1: Foundation & Shared Shell (Step 1)
- **Goal**: Establish styling tokens, typography, and persistent navigation shell.
- **Tasks**:
  1. Set up Tailwind theme colors in `src/index.css` matching `DESIGN.md`.
  2. Implement `Sidebar.tsx` with complete navigation links, active states, and mobile collapse.
  3. Implement `Topbar.tsx` with breadcrumbs, campus filter dropdown, search input, latency counter, and user profile.
  4. Create mock data repositories (`src/data/mockFacilities.ts`, `src/data/mockAssets.ts`).
- **Deliverable**: Functional responsive layout frame with working navigation switching.

### Phase 2: Primary Screen — Location & Facility Management (Step 2)
- **Goal**: Recreate the exact Stitch design view.
- **Tasks**:
  1. Build the Page Header Sub-bar: Title ("Location & Facility Management"), "4 SITES LIVE" badge, description, "Export Facility Report" button, and "Add Location" button.
  2. Build the 4-card Executive KPI Metrics strip.
  3. Build the Filter & Controls Toolbar (category tabs, search bar, status select, topology toggle, view toggle).
  4. Build the 4 rich `FacilityCard` components in a 2-column grid matching the provided layout, typography, tags, and imagery.
  5. Build the `FacilityTableView` alternative high-density comparison table.
  6. Build the bottom Master IP Subnet & Address Pool Utilization strip.
- **Deliverable**: Complete pixel-accurate Location & Facility Management screen with responsive grid/table views.

### Phase 3: Interactive Drawers & Network Topology (Step 3)
- **Goal**: Bring the operational tools to life with interactive features.
- **Tasks**:
  1. Implement `NetworkTopologyDrawer.tsx` with animated SVG links, node telemetry, and ping simulation.
  2. Implement `AddLocationModal.tsx` allowing users to register new facilities, subnets, and assign leads.
  3. Implement `FacilityAssetsDrawer.tsx` allowing users to view and filter cataloged devices for any selected campus.
  4. Implement `RemoteTerminalModal.tsx` (SSH simulator) accessible via the terminal button on facility cards.
  5. Implement `ExportReportModal.tsx` / `exportCsv.ts` to download an actual CSV facility audit.
- **Deliverable**: High-utility interactive management capabilities without any dead clicks.

### Phase 4: Companion Navigation Screens (Step 4)
- **Goal**: Ensure every link in the sidebar navigates to a complete, contextual screen.
- **Tasks**:
  1. **Dashboard (`DashboardScreen.tsx`)**: High-level cross-campus uptime chart, active incident count, and alert notifications.
  2. **IT Assets (`ITAssetsScreen.tsx`)**: Global catalog of 864 hardware units with search, filter by campus, and serial lookup.
  3. **Support Tickets (`SupportTicketsScreen.tsx`)**: List of 18 active tickets sorted by severity (including the 2 critical tickets from Factory B).
  4. **Employees (`EmployeesScreen.tsx`)**: Roster of 14 on-site field engineers across Dhaka and Gazipur.
  5. **Departments & Settings Screens**: Lightweight configuration views for company departments and SD-WAN alert policies.
- **Deliverable**: Cohesive, end-to-end enterprise IT management experience.

### Phase 5: Verification & Polish (Step 5)
- **Goal**: Quality assurance across all viewports and interactions.
- **Tasks**:
  1. Verify zero horizontal overflow on small screens ($320\text{px} - 1024\text{px}$).
  2. Verify all keyboard shortcuts (`⌘K` opens search).
  3. Run `compile_applet` and `lint_applet` to confirm clean builds and zero type errors.
- **Deliverable**: Production-grade, pixel-perfect application.

---

## 4. State Management & Data Flow

```text
               +----------------------------------+
               |             App.tsx              |
               | - activeScreen ("locations",...) |
               | - facilities list (with state)   |
               | - globalSearchQuery              |
               +----------------+-----------------+
                                |
        +-----------------------+-----------------------+
        |                                               |
+-------v--------+                             +--------v--------+
|   Sidebar.tsx  |                             |  LocationsView  |
| - active route |                             | - categoryFilter|
| - open/close   |                             | - statusFilter  |
+----------------+                             | - viewMode      |
                                               | - topologyOpen  |
                                               +--------+--------+
                                                        |
                    +-----------------------------------+--------------------+
                    |                                   |                    |
            +-------v--------+                  +-------v--------+   +-------v--------+
            |  FacilityGrid  |                  | FacilityTable  |   | TopologyDrawer |
            | - FacilityCard |                  | - high density |   | - SVG mesh     |
            +-------+--------+                  +----------------+   +----------------+
                    |
            +-------v-------------------------------+
            | Modals & Action Handlers              |
            | - AddLocationModal (creates facility) |
            | - FacilityAssetsDrawer (inspect fleet)|
            | - RemoteTerminalModal (SSH console)   |
            | - exportCsv (downloads live data)     |
            +---------------------------------------+
```

---

## 5. Ready for Execution
The plan provides an exact roadmap for building the React application step-by-step.
