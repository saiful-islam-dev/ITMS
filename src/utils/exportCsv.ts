import { Facility, ITAsset, SupportTicket } from '../types';

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
    `"${f.code}"`,
    `"${f.name}"`,
    `"${f.category}"`,
    `"${f.status}"`,
    `"${f.slaTarget}"`,
    `"${f.uptimePercent}%"`,
    `"${f.address}"`,
    `"${f.district}"`,
    `"${f.subnet}"`,
    `"${f.supernetMask}"`,
    `"${f.pingMs}ms"`,
    `"${f.jitterMs}ms"`,
    `"${f.packetLossPercent}%"`,
    `"${f.activeFleetCount}"`,
    `"${f.totalDeviceCapacity}"`,
    `"${f.leasedIps}"`,
    `"${f.totalIps}"`,
    `"${f.openTicketsCount}"`,
    `"${f.criticalTicketsCount}"`,
    `"${f.leadEngineer.name}"`,
    `"${f.uplinks}"`,
    `"${f.secondaryUplink}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  link.setAttribute('href', url);
  link.setAttribute('download', `apex_garments_facilities_audit_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  link.setAttribute('href', url);
  link.setAttribute('download', `apex_itms_full_audit_${timestamp}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

