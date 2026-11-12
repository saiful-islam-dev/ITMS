import { TaskItem, TaskAssignee } from '../types';

export const mockTechAssignees: Record<string, TaskAssignee> = {
  tr: {
    id: 'emp-001',
    name: 'Tariq Rahman',
    initials: 'TR',
    avatarColor: 'bg-[#4f46e5] text-white',
    specialty: 'SD-WAN Core, Hybrid Cloud & ERP'
  },
  fy: {
    id: 'emp-004',
    name: 'Farhana Yasmin',
    initials: 'FY',
    avatarColor: 'bg-[#00659a] text-white',
    specialty: 'OT Network & Field Terminal Specialist'
  },
  rk: {
    id: 'emp-006',
    name: 'Rezaul Karim',
    initials: 'RK',
    avatarColor: 'bg-[#5b598c] text-white',
    specialty: 'Line Automation & Barcode Systems'
  },
  kh: {
    id: 'emp-007',
    name: 'Kabir Hossain',
    initials: 'KH',
    avatarColor: 'bg-[#1e40af] text-white',
    specialty: 'RFID Telemetry & Warehouse Systems'
  },
  as: {
    id: 'emp-003',
    name: 'Samia Akter',
    initials: 'AS',
    avatarColor: 'bg-[#7c3aed] text-white',
    specialty: 'CAD Systems & Design Infrastructure'
  },
  rm: {
    id: 'emp-008',
    name: 'Rashedul Mahmud',
    initials: 'RM',
    avatarColor: 'bg-[#0f172a] text-white',
    specialty: 'SOC-2 Compliance & Security Audit'
  }
};

export const initialMockTasks: TaskItem[] = [
  // ==================== TO DO (4 tasks) ====================
  {
    id: 'tsk-889',
    taskNumber: 'TSK-2024-889',
    title: 'Quarterly Firmware Upgrade for Zebra ZT410 Printers',
    description: 'Flash latest ZebraLink OS across 12 line-end barcode dispatch printers in finishing section to resolve label cut stutter.',
    category: 'preventative',
    domainTag: 'Printers',
    status: 'todo',
    priority: 'medium',
    facilityId: 'loc-mfg-01',
    facilityCode: 'LOC-MFG-01',
    facilityName: 'Factory Building A (Finishing)',
    facilityShort: 'Fact A (Fini...',
    assignee: mockTechAssignees.rk,
    dueDate: 'Tomorrow 5PM',
    isDueToday: false,
    assetTag: 'AST-9842',
    subtasks: [
      { id: 'st-1', title: 'Backup current Zebra ZPL configuration scripts', completed: false },
      { id: 'st-2', title: 'Download firmware v79.20.15Z from Zebra portal', completed: false },
      { id: 'st-3', title: 'Deploy firmware to Line 1-4 via ZebraNet Bridge', completed: false },
      { id: 'st-4', title: 'Deploy firmware to Line 5-8', completed: false },
      { id: 'st-5', title: 'Deploy firmware to Line 9-12', completed: false },
      { id: 'st-6', title: 'Perform test barcode scan & cutter verification', completed: false }
    ],
    createdAt: '2026-05-18T08:30:00Z'
  },
  {
    id: 'tsk-892',
    taskNumber: 'TSK-2024-892',
    title: 'Replace Backup Battery in Central Server Room UPS #2',
    description: 'Install replacement lead-acid cell cartridge kit after impedance alarm triggered during scheduled monthly self-test.',
    category: 'preventative',
    domainTag: 'Power',
    status: 'todo',
    priority: 'high',
    facilityId: 'loc-corp-01',
    facilityCode: 'LOC-CORP-01',
    facilityName: 'Apex HQ Data Center',
    facilityShort: 'Apex HQ Data C...',
    assignee: mockTechAssignees.tr,
    dueDate: 'May 20',
    isDueToday: false,
    assetTag: 'APC-SRT10K',
    subtasks: [
      { id: 'st-10', title: 'Inspect incoming battery replacement crate (RBC44)', completed: true },
      { id: 'st-11', title: 'Put UPS #2 into maintenance bypass mode', completed: false },
      { id: 'st-12', title: 'Hot-swap battery cartridges and initiate self-test', completed: false }
    ],
    createdAt: '2026-05-18T09:15:00Z'
  },
  {
    id: 'tsk-894',
    taskNumber: 'TSK-2024-894',
    title: 'Deploy Barcode Scanners for New Garment Batch QC Line',
    description: 'Pair 8 Honeywell cordless 2D imagers to production line workstations and configure suffix carriage return character.',
    category: 'hardware',
    domainTag: 'Hardware',
    status: 'todo',
    priority: 'medium',
    facilityId: 'loc-mfg-01',
    facilityCode: 'LOC-MFG-01',
    facilityName: 'Factory Building A',
    facilityShort: 'Factory Buildin...',
    assignee: mockTechAssignees.fy,
    dueDate: 'May 22',
    isDueToday: false,
    assetTag: 'AST-4412',
    subtasks: [
      { id: 'st-20', title: 'Unbox 8x Honeywell Granit 1981i imagers', completed: false },
      { id: 'st-21', title: 'Flash Bluetooth base station pairing barcodes', completed: false },
      { id: 'st-22', title: 'Set DataLogic prefix/suffix in EZConfig utility', completed: false },
      { id: 'st-23', title: 'Perform test run on batch tag QC tables', completed: false }
    ],
    createdAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'tsk-897',
    taskNumber: 'TSK-2024-897',
    title: 'Run Structured Cabling for Finishing Iron Station 4',
    description: 'Pull plenum Cat6A drop from IDF-2 to QC Inspection Table 4 and terminate into Keystone jack.',
    category: 'network',
    domainTag: 'Network',
    status: 'todo',
    priority: 'low',
    facilityId: 'loc-mfg-01',
    facilityCode: 'LOC-MFG-01',
    facilityName: 'Factory Building A (Finishing)',
    facilityShort: 'Fact A (Fini...',
    assignee: mockTechAssignees.kh,
    dueDate: 'May 25',
    isDueToday: false,
    subtasks: [
      { id: 'st-30', title: 'Pull 45m plenum blue Cat6A via cable tray', completed: false },
      { id: 'st-31', title: 'Punch down IDF-2 port 28 and label faceplate', completed: false }
    ],
    createdAt: '2026-05-18T11:20:00Z'
  },

  // ==================== IN PROGRESS (5 tasks) ====================
  {
    id: 'tsk-882',
    taskNumber: 'TSK-2024-882',
    title: 'Sewing Floor VLAN 40 Migration & QoS Reconfiguration',
    description: 'Isolating automated stitcher telemetry and cutting table PLCs into dedicated industrial IoT subnet with 802.1p priority tag.',
    category: 'network',
    domainTag: 'Network',
    status: 'in_progress',
    priority: 'critical',
    facilityId: 'loc-mfg-02',
    facilityCode: 'LOC-MFG-02',
    facilityName: 'Factory Building B (Washing Plant)',
    facilityShort: 'Fact B (Washing ...',
    assignee: mockTechAssignees.tr,
    progressPercent: 65,
    linkedTicketNumber: 'TCK-2024-1842',
    timeRemaining: '2h remaining',
    subtasks: [
      { id: 'st-40', title: 'Create VLAN 40 on Core Nexus switch', completed: true },
      { id: 'st-41', title: 'Configure DHCP helper-address to 10.40.0.1', completed: true },
      { id: 'st-42', title: 'Re-assign access ports on Edge Switch 01-04', completed: true },
      { id: 'st-43', title: 'Set strict priority queue for Juki stitcher telemetry', completed: true },
      { id: 'st-44', title: 'Verify packet loss < 0.05% during peak motor cycle', completed: false }
    ],
    createdAt: '2026-05-18T06:00:00Z'
  },
  {
    id: 'tsk-885',
    taskNumber: 'TSK-2024-885',
    title: 'Workstation Setup for 6 Merchandising Trainees',
    description: 'Imaging Dell Precision 3660 desktops with Apex ERP Suite, Optitex 3D, and FastReact production planning licenses.',
    category: 'hardware',
    domainTag: 'Provisioning',
    status: 'in_progress',
    priority: 'high',
    facilityId: 'loc-corp-01',
    facilityCode: 'LOC-CORP-01',
    facilityName: 'Apex HQ Studio',
    facilityShort: 'Apex HQ St...',
    assignee: mockTechAssignees.fy,
    dueDate: 'Today 4PM',
    isDueToday: true,
    progressPercent: 83,
    subtasks: [
      { id: 'st-50', title: 'PXE boot image Windows 11 Enterprise (WIM v2.4)', completed: true },
      { id: 'st-51', title: 'Join active directory domain and push Group Policy', completed: true },
      { id: 'st-52', title: 'Deploy Apex ERP client & SQL ODBC connector', completed: true },
      { id: 'st-53', title: 'Install Optitex 3D CAD suite & HASP network key', completed: true },
      { id: 'st-54', title: 'Setup dual 27-inch Dell displays and Logitech peripherals', completed: true },
      { id: 'st-55', title: 'Deliver trainee credentials and run first-login verification', completed: false }
    ],
    createdAt: '2026-05-18T07:15:00Z'
  },
  {
    id: 'tsk-887',
    taskNumber: 'TSK-2024-887',
    title: 'Recalibrate RFID Gates at Fabric Warehouse Loading Dock',
    description: 'Adjust antenna gain and sensitivity thresholds on Impinj Speedway R420 readers to prevent false reads from adjacent staging line.',
    category: 'preventative',
    domainTag: 'Logistics',
    status: 'in_progress',
    priority: 'medium',
    facilityId: 'loc-whse-01',
    facilityCode: 'LOC-WHSE-01',
    facilityName: 'Central Fabric Warehouse',
    facilityShort: 'Central Wareho...',
    assignee: mockTechAssignees.kh,
    dueDate: 'May 19',
    isDueToday: false,
    assetTag: 'AST-5021',
    progressPercent: 35,
    subtasks: [
      { id: 'st-60', title: 'Connect console to Impinj Speedway reader #1-4', completed: true },
      { id: 'st-61', title: 'Adjust RF power down to 24 dBm on antenna 3 & 4', completed: false },
      { id: 'st-62', title: 'Perform 100-roll textile bolt gate transit test', completed: false }
    ],
    createdAt: '2026-05-18T08:00:00Z'
  },
  {
    id: 'tsk-888',
    taskNumber: 'TSK-2024-888',
    title: 'Core Switch Stack Firmware Patch on Building B',
    description: 'Upgrading Cisco Catalyst 9300 stack to IOS-XE 17.9.4a with NSF failover testing before evening production cutover.',
    category: 'network',
    domainTag: 'Network',
    status: 'in_progress',
    priority: 'high',
    facilityId: 'loc-mfg-02',
    facilityCode: 'LOC-MFG-02',
    facilityName: 'Factory Building B (Washing Plant)',
    facilityShort: 'Fact B (Washing ...',
    assignee: mockTechAssignees.tr,
    dueDate: 'Today 6PM',
    isDueToday: true,
    progressPercent: 50,
    subtasks: [
      { id: 'st-70', title: 'Copy .bin image to flash of active and standby switch', completed: true },
      { id: 'st-71', title: 'Verify MD5 checksum against Cisco release notes', completed: true },
      { id: 'st-72', title: 'Schedule auto-rollback boot variable in config', completed: false },
      { id: 'st-73', title: 'Execute reload at planned 22:00 maintenance window', completed: false }
    ],
    createdAt: '2026-05-18T09:30:00Z'
  },
  {
    id: 'tsk-890',
    taskNumber: 'TSK-2024-890',
    title: 'Zebra ZT410 Thermal Printhead Alignment on Sewing Line 2',
    description: 'Adjust printhead pressure toggle and clean platen roller for high-density barcodes on satin care labels.',
    category: 'preventative',
    domainTag: 'Printers',
    status: 'in_progress',
    priority: 'medium',
    facilityId: 'loc-mfg-01',
    facilityCode: 'LOC-MFG-01',
    facilityName: 'Factory Building A (Finishing)',
    facilityShort: 'Fact A (Fini...',
    assignee: mockTechAssignees.rk,
    dueDate: 'Tomorrow 12PM',
    isDueToday: false,
    assetTag: 'AST-9833',
    progressPercent: 40,
    subtasks: [
      { id: 'st-80', title: 'Clean printhead with 99% isopropyl alcohol', completed: true },
      { id: 'st-81', title: 'Calibrate black-mark transmissive sensor', completed: false },
      { id: 'st-82', title: 'Print test roll of 500 care labels', completed: false }
    ],
    createdAt: '2026-05-18T10:10:00Z'
  },

  // ==================== REVIEW / BLOCKED (2 tasks) ====================
  {
    id: 'tsk-879',
    taskNumber: 'TSK-2024-879',
    title: 'Gerber CAD Plotter Driver Compatibility Patch (v14.2)',
    description: 'Blocked awaiting Gerber Technology escalated driver patch after Windows 11 23H2 security update disabled legacy virtual COM port emulation.',
    category: 'hardware',
    domainTag: 'CAD Ops',
    status: 'review_blocked',
    priority: 'critical',
    facilityId: 'loc-corp-01',
    facilityCode: 'LOC-CORP-01',
    facilityName: 'Apex HQ CAD Lab',
    facilityShort: 'Apex HQ CAD L...',
    assignee: mockTechAssignees.as,
    blockReason: 'Vendor Escalation #GBR-992',
    linkedTicketNumber: 'TCK-2024-1845',
    subtasks: [
      { id: 'st-90', title: 'Log incident with Gerber Global Engineering', completed: true },
      { id: 'st-91', title: 'Receive pre-release WHQL signed driver fix', completed: false },
      { id: 'st-92', title: 'Validate cutter pen response on plotter station 3', completed: false }
    ],
    createdAt: '2026-05-17T14:00:00Z'
  },
  {
    id: 'tsk-881',
    taskNumber: 'TSK-2024-881',
    title: 'Quarterly SOC-2 Access Rights Review for Floor Supervisors',
    description: 'Verify privilege revocation for departed shift managers and enforce least-privilege matrix on ERP MES production execution modules.',
    category: 'preventative',
    domainTag: 'Compliance',
    status: 'review_blocked',
    priority: 'medium',
    facilityId: 'loc-all',
    facilityCode: 'ALL-FAC',
    facilityName: 'All Facilities (Apex Garments)',
    facilityShort: 'All Facilities',
    assignee: mockTechAssignees.rm,
    dueDate: 'May 24',
    isDueToday: false,
    reviewNote: 'Awaiting CISO sign-off',
    subtasks: [
      { id: 'st-100', title: 'Generate user access report from Azure AD & SAP', completed: true },
      { id: 'st-101', title: 'Audit dormant supervisor accounts (>30 days)', completed: true },
      { id: 'st-102', title: 'Submit signed audit form for CISO countersignature', completed: false }
    ],
    createdAt: '2026-05-17T16:20:00Z'
  },

  // ==================== DONE TODAY (6 tasks) ====================
  {
    id: 'tsk-874',
    taskNumber: 'TSK-2024-874',
    title: 'Replace Cisco 2960 Patch Cable in IDF Rack 2B',
    description: 'Swapped bent Cat6 S/FTP feeder to restore full 1000BASE-T link negotiation on floor switch stack port G1/0/24.',
    category: 'network',
    domainTag: 'Switching',
    status: 'done',
    priority: 'high',
    facilityId: 'loc-mfg-02',
    facilityCode: 'LOC-MFG-02',
    facilityName: 'Factory Building B (Washing Plant)',
    facilityShort: 'Fact B (Washing ...',
    assignee: mockTechAssignees.tr,
    linkedTicketNumber: 'TCK-2024-1835',
    completedTime: '10:15 AM (Tariq)',
    subtasks: [
      { id: 'st-110', title: 'Verify CRC error counters on interface G1/0/24', completed: true },
      { id: 'st-111', title: 'Replace with certified CommScope Cat6 patch cable', completed: true },
      { id: 'st-112', title: 'Confirm 0 dropped packets and Fluke channel pass', completed: true }
    ],
    createdAt: '2026-05-18T05:30:00Z'
  },
  {
    id: 'tsk-871',
    taskNumber: 'TSK-2024-871',
    title: 'Patch Exchange Mailbox Quotas for Merchandising Team',
    description: 'Expanded archive mailboxes to 50GB for 14 merchandisers handling high-resolution fabric sample attachments.',
    category: 'preventative',
    domainTag: 'Exchange',
    status: 'done',
    priority: 'medium',
    facilityId: 'loc-corp-01',
    facilityCode: 'LOC-CORP-01',
    facilityName: 'Apex HQ Studio',
    facilityShort: 'Apex HQ St...',
    assignee: mockTechAssignees.fy,
    completedTime: '09:30 AM (Farhana)',
    subtasks: [
      { id: 'st-120', title: 'Review Exchange storage database free space', completed: true },
      { id: 'st-121', title: 'Execute Set-Mailbox PowerShell batch command', completed: true },
      { id: 'st-122', title: 'Notify merchandising department lead', completed: true }
    ],
    createdAt: '2026-05-18T06:15:00Z'
  },
  {
    id: 'tsk-869',
    taskNumber: 'TSK-2024-869',
    title: 'Clean Dust & Lint Filters on Server Room IDF 1 A/C',
    description: 'Preventative thermal maintenance on CRAC unit #1 condenser intake to maintain 21°C operating target.',
    category: 'preventative',
    domainTag: 'Power',
    status: 'done',
    priority: 'low',
    facilityId: 'loc-mfg-01',
    facilityCode: 'LOC-MFG-01',
    facilityName: 'Factory Building A',
    facilityShort: 'Fact A',
    assignee: mockTechAssignees.rk,
    completedTime: '08:45 AM (Rezaul)',
    subtasks: [
      { id: 'st-130', title: 'Vacuum lint mesh intake filter', completed: true },
      { id: 'st-131', title: 'Check condensate drain pump float switch', completed: true }
    ],
    createdAt: '2026-05-18T07:00:00Z'
  },
  {
    id: 'tsk-867',
    taskNumber: 'TSK-2024-867',
    title: 'Test Emergency Diesel Generator Automatic Transfer Switch (ATS)',
    description: 'Conducted zero-downtime synchronized power drop drill with facility engineering team.',
    category: 'preventative',
    domainTag: 'Power',
    status: 'done',
    priority: 'high',
    facilityId: 'loc-corp-01',
    facilityCode: 'LOC-CORP-01',
    facilityName: 'Apex HQ Data Center',
    facilityShort: 'Apex HQ Data C...',
    assignee: mockTechAssignees.tr,
    completedTime: '07:30 AM (Tariq)',
    subtasks: [
      { id: 'st-140', title: 'Verify ATS phase matching and UPS flywheel stability', completed: true },
      { id: 'st-141', title: 'Log fuel pressure and 12V starter battery state', completed: true }
    ],
    createdAt: '2026-05-18T04:30:00Z'
  },
  {
    id: 'tsk-865',
    taskNumber: 'TSK-2024-865',
    title: 'Renew Internal CA Wildcard Certificate for *.apexgarments.internal',
    description: 'Updated OpenSSL cert chain on nginx reverse proxies across edge compute nodes.',
    category: 'network',
    domainTag: 'Network',
    status: 'done',
    priority: 'medium',
    facilityId: 'loc-all',
    facilityCode: 'ALL-FAC',
    facilityName: 'All Facilities',
    facilityShort: 'All Facilities',
    assignee: mockTechAssignees.tr,
    completedTime: '07:00 AM (Tariq)',
    subtasks: [
      { id: 'st-150', title: 'Generate CSR and sign via internal Microsoft CA', completed: true },
      { id: 'st-151', title: 'Reload nginx systemd services without connection drop', completed: true }
    ],
    createdAt: '2026-05-18T05:00:00Z'
  },
  {
    id: 'tsk-862',
    taskNumber: 'TSK-2024-862',
    title: 'Swap High-Capacity Battery on Warehouse Zebra MC3300 Gun #14',
    description: 'Replaced degraded lithium-ion pack (health < 68%) with fresh 7000mAh PowerPrecision+ unit.',
    category: 'hardware',
    domainTag: 'Hardware',
    status: 'done',
    priority: 'low',
    facilityId: 'loc-whse-01',
    facilityCode: 'LOC-WHSE-01',
    facilityName: 'Central Fabric Warehouse',
    facilityShort: 'Central Wareho...',
    assignee: mockTechAssignees.kh,
    completedTime: '06:15 AM (Kabir)',
    subtasks: [
      { id: 'st-160', title: 'Inspect terminal contacts and cycle counter', completed: true },
      { id: 'st-161', title: 'Recalibrate fuel gauge in Zebra StageNow', completed: true }
    ],
    createdAt: '2026-05-18T05:45:00Z'
  }
];

