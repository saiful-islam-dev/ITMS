export type FacilityType = 'all' | 'corporate' | 'manufacturing' | 'warehouse';

export type FacilityStatus = 'healthy' | 'operational' | 'warning' | 'critical' | 'maintenance';

export interface LeadEngineer {
  name: string;
  role: string;
  avatar: string;
  techCount: number;
  phone?: string;
  email?: string;
}

export interface ThermalData {
  tempC: number;
  humidity: number;
  status: 'normal' | 'warning' | 'alert';
  idfCabinet: string;
  moistureDetected: boolean;
  fanSpeedRpm: number;
  ambientMaxC: number;
  lastReading: string;
}

export interface Facility {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  category: FacilityType;
  status: FacilityStatus;
  statusLabel: string;
  slaTarget: string;
  uptimePercent: number;
  address: string;
  district: string;
  pingMs: number;
  jitterMs: number;
  packetLossPercent: number;
  subnet: string;
  supernetMask: string;
  activeFleetCount: number;
  totalDeviceCapacity: number;
  serverInfrastructure: string;
  wirelessAps: number;
  hardwareTags: string[];
  leadEngineer: LeadEngineer;
  openTicketsCount: number;
  criticalTicketsCount: number;
  image: string;
  uplinks: string;
  secondaryUplink: string;
  leasedIps: number;
  totalIps: number;
  thermalData?: ThermalData;
}

export interface ITAsset {
  id: string;
  assetTag: string;
  serialNumber: string;
  name: string;
  category: 'Workstation' | 'Laptop' | 'Server' | 'Switch' | 'Access Point' | 'Printer/Scanner' | 'IoT/Terminal';
  facilityId: string;
  facilityCode: string;
  facilityName: string;
  locationDetail: string;
  assignedTo?: string;
  department: string;
  ipAddress: string;
  macAddress: string;
  status: 'active' | 'maintenance' | 'offline' | 'storage';
  lastPing: string;
  purchaseDate: string;
  warrantyExpires: string;
  specNotes?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  title: string;
  facilityId: string;
  facilityCode: string;
  facilityName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'pending_vendor' | 'resolved' | 'assigned' | 'closed';
  category: 'Network' | 'Hardware' | 'Software' | 'Environmental' | 'Access';
  requester: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  resolutionTimeHours?: number;
  scope?: string;
  requesterRole?: string;
  age?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  title: string;
  facilityId: string;
  facilityCode: string;
  facilityName: string;
  shift: 'Shift A (06:00 - 14:00)' | 'Shift B (14:00 - 22:00)' | 'Night (22:00 - 06:00)' | 'General (09:00 - 18:00)';
  phone: string;
  email: string;
  status: 'active' | 'on_call' | 'leave';
  avatar: string;
  certifications: string[];
  specialty: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  facilityId: string;
  facilityName: string;
  assetCount: number;
  employeeCount: number;
  budgetCode: string;
  costCenter: string;
}

export interface SubnetMetric {
  name: string;
  cidr: string;
  leased: number;
  totalHosts: number;
  percent: number;
  status: 'healthy' | 'warning' | 'critical';
  facilityCode: string;
  notes: string;
}

export interface SystemSettings {
  sdwanAutoFailover: boolean;
  alertEmailRecipients: string;
  thermalWarningThresholdC: number;
  latencyAlertThresholdMs: number;
  snmpPollingIntervalSec: number;
  auditLogRetentionDays: number;
  autoTicketOnDegraded: boolean;
}

