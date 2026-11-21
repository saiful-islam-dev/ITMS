import { Facility, ITAsset, SupportTicket, TaskItem, Employee } from '../types';

/**
 * Universal browser file download helper.
 * Eliminates repetitive Blob/URL.createObjectURL/<a> boilerplate.
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType = 'text/csv;charset=utf-8;'
): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Clean CSV string formatter with proper escaping for RFC 4180 compliance.
 */
export function formatCsv(
  headers: string[],
  rows: (string | number | undefined | null)[][]
): string {
  const escapeCell = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headerLine = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
  const rowLines = rows.map(row => row.map(escapeCell).join(','));
  return [headerLine, ...rowLines].join('\n');
}

export function exportTasksToCsv(tasks: TaskItem[]) {
  const headers = [
    'Task Number',
    'Title',
    'Domain',
    'Category',
    'Status',
    'Priority',
    'Facility Name',
    'Facility Code',
    'Assignee',
    'Due Date',
    'Progress %',
    'Asset Tag',
    'Linked Ticket',
    'Description'
  ];

  const rows = tasks.map(t => [
    t.taskNumber,
    t.title,
    t.domainTag,
    t.category,
    t.status,
    t.priority,
    t.facilityName,
    t.facilityCode,
    t.assignee.name,
    t.dueDate || t.completedTime || 'N/A',
    `${t.progressPercent || 0}%`,
    t.assetTag || '',
    t.linkedTicketNumber || '',
    t.description
  ]);

  const timestamp = new Date().toISOString().slice(0, 10);
  downloadFile(formatCsv(headers, rows), `ITMS-Task-Management-Export-${timestamp}.csv`);
}

export function exportFacilitiesToCsv(facilities: Facility[]) {
  const headers = [
    'Facility Code',
    'Facility Name',
    'Category',
    'Status',
    'SLA Target',
    'Uptime %',
    'Address',
    'District',
    'Subnet CIDR',
    'Supernet Mask',
    'Latency (ms)',
    'Jitter (ms)',
    'Packet Loss %',
    'Active Fleet Units',
    'Total Device Capacity',
    'IPs Leased',
    'Total IP Capacity',
    'Open Tickets',
    'Critical Tickets',
    'Lead Engineer',
    'Primary Uplink',
    'Secondary Uplink'
  ];

  const rows = facilities.map(f => [
    f.code,
    f.name,
    f.category,
    f.status,
    f.slaTarget,
    `${f.uptimePercent}%`,
    f.address,
    f.district,
    f.subnet,
    f.supernetMask,
    `${f.pingMs}ms`,
    `${f.jitterMs}ms`,
    `${f.packetLossPercent}%`,
    f.activeFleetCount,
    f.totalDeviceCapacity,
    f.leasedIps,
    f.totalIps,
    f.openTicketsCount,
    f.criticalTicketsCount,
    f.leadEngineer.name,
    f.uplinks,
    f.secondaryUplink
  ]);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  downloadFile(formatCsv(headers, rows), `apex_garments_facilities_audit_${timestamp}.csv`);
}

export function exportFullAuditReport(
  facilities: Facility[],
  assets: ITAsset[],
  tickets: SupportTicket[]
) {
  const dateStr = new Date().toLocaleString();
  let content = `APEX GARMENTS ITMS ENTERPRISE - COMPREHENSIVE FACILITY AUDIT REPORT\n`;
  content += `Generated: ${dateStr}\n`;
  content += `Classification: CONFIDENTIAL / INTERNAL IT OPERATIONS\n`;
  content += `Master Supernet: 10.14.0.0/16 | SLA Target: 99.85%\n\n`;

  content += `====================================================\n`;
  content += `SECTION 1: ACTIVE FACILITIES & CAMPUS SUMMARY\n`;
  content += `====================================================\n`;
  facilities.forEach(f => {
    content += `[${f.code}] ${f.name}\n`;
    content += `  Status: ${f.status.toUpperCase()} (${f.statusLabel})\n`;
    content += `  Location: ${f.address}\n`;
    content += `  Network Subnet: ${f.subnet} | Ping: ${f.pingMs}ms (Jitter: ${f.jitterMs}ms)\n`;
    content += `  Hardware Fleet: ${f.activeFleetCount} units active\n`;
    content += `  Lead Engineer: ${f.leadEngineer.name} (${f.leadEngineer.role})\n`;
    content += `  Open Support Tickets: ${f.openTicketsCount} (${f.criticalTicketsCount} critical)\n\n`;
  });

  content += `====================================================\n`;
  content += `SECTION 2: OPEN INCIDENTS & MAINTENANCE TICKETS\n`;
  content += `====================================================\n`;
  tickets.forEach(t => {
    content += `[${t.ticketNumber}] ${t.severity.toUpperCase()} - ${t.title}\n`;
    content += `  Facility: ${t.facilityName} (${t.facilityCode}) | Status: ${t.status}\n`;
    content += `  Assignee: ${t.assignee} | Created: ${t.createdAt}\n`;
    content += `  Description: ${t.description}\n\n`;
  });

  content += `====================================================\n`;
  content += `SECTION 3: HARDWARE INVENTORY SAMPLE (${assets.length} items logged)\n`;
  content += `====================================================\n`;
  assets.forEach(a => {
    content += `[${a.assetTag}] ${a.name} (SN: ${a.serialNumber})\n`;
    content += `  Campus: ${a.facilityCode} | IP: ${a.ipAddress} | Status: ${a.status}\n`;
    content += `  Assigned: ${a.assignedTo || 'Unassigned'} | Specs: ${a.specNotes || 'Standard'}\n\n`;
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  downloadFile(content, `apex_itms_full_audit_${timestamp}.txt`, 'text/plain;charset=utf-8;');
}

export function exportExecutiveReportTxt(facilities: Facility[], tickets: SupportTicket[]) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  let content = `================================================================================\n`;
  content += `APEX GARMENTS LTD. - EXECUTIVE IT GOVERNANCE & SLA COMPLIANCE PACK\n`;
  content += `Certified Audit Period: Q2 2025 | Generation Date: ${dateStr}\n`;
  content += `Classification: STRICTLY CONFIDENTIAL - EXECUTIVE BOARD DISTRIBUTION ONLY\n`;
  content += `================================================================================\n\n`;

  content += `1. EXECUTIVE SUMMARY & TELEMETRY KPIS\n`;
  content += `--------------------------------------------------------------------------------\n`;
  content += `Overall SLA Compliance: 97.4% (Quarterly Benchmark Target >= 95.0%)\n`;
  content += `Mean Time to Resolution (MTTR): 2 hours 14 minutes (-38m WoW reduction)\n`;
  content += `First Contact Resolution (FCR): 64.2%\n`;
  content += `Total YTD IT Capex & Opex: $342,850 USD (88.4% of allocated fiscal budget)\n`;
  content += `  - Hardware & Equipment Leases: $184,000 USD\n`;
  content += `  - Enterprise Cloud & SaaS Licenses: $92,000 USD\n`;
  content += `  - Plant Spares & Industrial Consumables: $66,850 USD\n`;
  content += `IoT & Plant Fleet Uptime: 99.88% (0 critical sewing line halts recorded)\n`;
  content += `Network Edge Throughput: 3,420 pkts/s aggregate across 18 High-Bay APs\n\n`;

  content += `2. FACILITY RESILIENCY & AUDIT STATUS\n`;
  content += `--------------------------------------------------------------------------------\n`;
  facilities.forEach(f => {
    content += `* [${f.code}] ${f.name}\n`;
    content += `    Classification: ${f.category.toUpperCase()} | Subnet: ${f.subnet}\n`;
    content += `    SLA Target: ${f.slaTarget} | Measured Uptime: ${f.uptimePercent}%\n`;
    content += `    Active Units: ${f.activeFleetCount} | Latency: ${f.pingMs}ms\n`;
    content += `    Open Tickets: ${f.openTicketsCount} (P1 Critical: ${f.criticalTicketsCount})\n`;
    content += `    Lead Engineer: ${f.leadEngineer.name} (${f.leadEngineer.role})\n\n`;
  });

  content += `3. TOP INCIDENT FAILURE MODES\n`;
  content += `--------------------------------------------------------------------------------\n`;
  content += `1. Industrial Barcode & RFID Printing: 38% (250 incidents - Primary root cause: Thermal Head Wear & Cotton Lint)\n`;
  content += `2. Floor VLAN & Switch Enclosures: 24% (158 incidents - Humidity & IP65 seals)\n`;
  content += `3. CAD & Design Workstations: 16% (105 incidents - Optitex render license sync)\n`;
  content += `4. End-User Laptops & M365: 14% (92 incidents - Identity & MFA recovery)\n`;
  content += `5. CCTV & Turnstiles: 8% (53 incidents - Shift-change gate telemetry)\n\n`;

  content += `4. SIGN-OFF & AUTHORIZATION\n`;
  content += `--------------------------------------------------------------------------------\n`;
  content += `Audited By: Tariq Rahman (IT Operations Lead & Super Admin)\n`;
  content += `Approved By: Chief Technology Officer / Apex Executive Committee\n`;
  content += `================================================================================\n`;

  const timestamp = new Date().toISOString().slice(0, 10);
  downloadFile(content, `apex_it_governance_sla_pack_${timestamp}.txt`, 'text/plain;charset=utf-8;');
}

export function exportAssetDepreciationCsv(assets: ITAsset[]) {
  const headers = [
    'Asset Tag',
    'Hardware Model',
    'Category',
    'Serial Number',
    'Facility Code',
    'Facility Name',
    'Department',
    'Assigned Specialist',
    'IP Address',
    'MAC Address',
    'Purchase Date',
    'Warranty Expiry',
    'Estimated Replacement Cost (USD)',
    'Current Book Value (USD)',
    'Depreciation Status',
    'Operational Health'
  ];

  const rows = assets.map(a => {
    const isServerOrSwitch = a.category === 'Switch' || a.category === 'Server';
    const isWorkstation = a.category === 'Workstation' || a.category === 'Laptop';
    const cost = isServerOrSwitch ? '$8,500.00' : isWorkstation ? '$2,400.00' : '$1,200.00';
    const bookValue = isServerOrSwitch ? '$5,100.00' : isWorkstation ? '$1,440.00' : '$720.00';
    const depStatus = 'Active - Year 2 of 4 (Straight Line 25%)';

    return [
      a.assetTag,
      a.name,
      a.category,
      a.serialNumber,
      a.facilityCode,
      a.facilityName,
      a.department || 'Garment Production IT',
      a.assignedTo || 'Unassigned',
      a.ipAddress,
      a.macAddress,
      a.purchaseDate || '2023-01-15',
      a.warrantyExpires || '2027-01-15',
      cost,
      bookValue,
      depStatus,
      a.status.toUpperCase()
    ];
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  downloadFile(formatCsv(headers, rows), `apex_garments_asset_depreciation_ledger_${timestamp}.csv`);
}

export function exportTelemetryLogsCsv(facilities: Facility[]) {
  const headers = [
    'Timestamp UTC',
    'Facility Code',
    'Facility Name',
    'Subnet CIDR',
    'Interface / Host',
    'Throughput (pkts/sec)',
    'Ping Latency (ms)',
    'Jitter (ms)',
    'Packet Loss %',
    'Primary Uplink',
    'Failover Link',
    'Operational Status'
  ];

  const now = new Date();
  const rows: (string | number)[][] = [];

  facilities.forEach(f => {
    for (let i = 0; i < 3; i++) {
      const logTime = new Date(now.getTime() - i * 180000).toISOString();
      const device = i === 0 ? 'Core Switch L3' : i === 1 ? 'High-Bay AP Cluster 01' : 'Industrial Edge IoT GW';
      const throughput = Math.floor(Math.random() * 800) + 2600;
      rows.push([
        logTime,
        f.code,
        f.name,
        f.subnet,
        device,
        throughput,
        f.pingMs,
        f.jitterMs,
        `${f.packetLossPercent}%`,
        f.uplinks,
        f.secondaryUplink,
        'OPERATIONAL'
      ]);
    }
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  downloadFile(formatCsv(headers, rows), `apex_line_network_telemetry_${timestamp}.csv`);
}

export function exportEmployeesToCsv(employees: Employee[]) {
  const headers = [
    'Employee ID',
    'Full Name',
    'Role / Title',
    'Department',
    'Facility Name',
    'Facility Code',
    'Shift Schedule',
    'Work Phone',
    'Official Email',
    'Account Status',
    'Is Admin',
    'Assigned Equipment',
    'Open IT Tickets',
    'Technical Certifications',
    'Operational Specialty'
  ];

  const rows = employees.map(emp => [
    emp.employeeId || emp.id,
    emp.name,
    emp.role || emp.title,
    emp.department || 'Operations',
    emp.facilityName,
    emp.facilityCode,
    emp.shift,
    emp.phone,
    emp.email,
    emp.status.toUpperCase(),
    emp.isAdmin ? 'YES' : 'NO',
    (emp.linkedAssets || []).join('; '),
    emp.openTickets ?? 0,
    emp.certifications.join('; '),
    emp.specialty
  ]);

  const timestamp = new Date().toISOString().slice(0, 10);
  downloadFile(formatCsv(headers, rows), `apex_garments_employee_directory_${timestamp}.csv`);
}
