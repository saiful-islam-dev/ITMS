export interface ManagedUser {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  rbacTier: 'Tier 1 - Super Admin' | 'Tier 2 - Senior Infrastructure' | 'Tier 3 - Domain Specialist' | 'Tier 4 - Facility Operator' | 'Tier 5 - Standard Access';
  facilityId: string;
  facilityCode: string;
  facilityName: string;
  department: string;
  source: 'Azure AD (Entra ID)' | 'Okta SAML 2.0' | 'Local ITMS';
  mfaStatus: 'Enforced (FIDO2 Key)' | 'Enforced (Microsoft Auth)' | 'Enforced (TOTP)' | 'Pending Setup';
  status: 'active' | 'suspended' | 'pending_invite';
  lastActive: string;
  avatar?: string;
  phone?: string;
  groups: string[];
}

export const initialMockUsers: ManagedUser[] = [
  {
    id: 'usr-001',
    employeeId: 'APX-ADM-001',
    name: 'Tariq Rahman',
    email: 'tariq.rahman@apexgarments.com',
    role: 'IT Operations Lead & Super Admin',
    rbacTier: 'Tier 1 - Super Admin',
    facilityId: 'loc-corp-01',
    facilityCode: 'LOC-CORP-01',
    facilityName: 'Apex HQ & Design Studio',
    department: 'IT Operations',
    source: 'Azure AD (Entra ID)',
    mfaStatus: 'Enforced (FIDO2 Key)',
    status: 'active',
    lastActive: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+880 1711-049821',
    groups: ['SG-IT-SuperAdmins', 'SG-Core-Infrastructure', 'SG-Executive-ITOM']
  },
  {
    id: 'usr-002',
    employeeId: 'APX-ENG-002',
    name: 'Tanvir Hasan',
    email: 'tanvir.hasan@apexgarments.com',
    role: 'Senior Network Engineer',
    rbacTier: 'Tier 2 - Senior Infrastructure',
    facilityId: 'loc-corp-01',
    facilityCode: 'LOC-CORP-01',
    facilityName: 'Apex HQ & Design Studio',
    department: 'Network Operations',
    source: 'Azure AD (Entra ID)',
    mfaStatus: 'Enforced (Microsoft Auth)',
    status: 'active',
    lastActive: '4m ago',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    phone: '+880 1712-445566',
    groups: ['SG-Network-Admins', 'SG-SDWAN-Controllers']
  },
  {
    id: 'usr-003',
    employeeId: 'APX-CAD-003',
    name: 'Samia Akter',
    email: 'samia.akter@apexgarments.com',
    role: 'CAD Systems Administrator',
    rbacTier: 'Tier 3 - Domain Specialist',
    facilityId: 'loc-corp-01',
    facilityCode: 'LOC-CORP-01',
    facilityName: 'Apex HQ & Design Studio',
    department: 'Design & CAD Engineering',
    source: 'Okta SAML 2.0',
    mfaStatus: 'Enforced (TOTP)',
    status: 'active',
    lastActive: '12m ago',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+880 1713-998877',
    groups: ['SG-CAD-Engineers', 'SG-Optitex-License-Admins']
  },
  {
    id: 'usr-004',
    employeeId: 'APX-SEC-004',
    name: 'Zubair Hossain',
    email: 'zubair.hossain@apexgarments.com',
    role: 'Cybersecurity Analyst',
    rbacTier: 'Tier 2 - Senior Infrastructure',
    facilityId: 'loc-corp-01',
    facilityCode: 'LOC-CORP-01',
    facilityName: 'Apex HQ & Design Studio',
    department: 'Information Security',
    source: 'Azure AD (Entra ID)',
    mfaStatus: 'Enforced (FIDO2 Key)',
    status: 'active',
    lastActive: '8m ago',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '+880 1714-332211',
    groups: ['SG-SecOps-SOC', 'SG-Audit-Compliance']
  },
  {
    id: 'usr-005',
    employeeId: 'APX-FCT-005',
    name: 'Kabir Hossain',
    email: 'kabir.hossain@apexgarments.com',
    role: 'Factory A Field Lead',
    rbacTier: 'Tier 2 - Senior Infrastructure',
    facilityId: 'loc-fct-01',
    facilityCode: 'LOC-FCT-01',
    facilityName: 'Factory Building A (Sewing & Cut)',
    department: 'Garment Manufacturing IT',
    source: 'Azure AD (Entra ID)',
    mfaStatus: 'Enforced (Microsoft Auth)',
    status: 'active',
    lastActive: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+880 1819-332910',
    groups: ['SG-Factory-A-Leads', 'SG-Industrial-IoT-Admins']
  },
  {
    id: 'usr-006',
    employeeId: 'APX-FCT-006',
    name: 'Sultan Mahmud',
    email: 'sultan.mahmud@apexgarments.com',
    role: 'Field Hardware Technician',
    rbacTier: 'Tier 4 - Facility Operator',
    facilityId: 'loc-fct-01',
    facilityCode: 'LOC-FCT-01',
    facilityName: 'Factory Building A (Sewing & Cut)',
    department: 'Floor Hardware Support',
    source: 'Azure AD (Entra ID)',
    mfaStatus: 'Enforced (TOTP)',
    status: 'active',
    lastActive: '25m ago',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    phone: '+880 1818-445511',
    groups: ['SG-Factory-A-Techs']
  },
  {
    id: 'usr-007',
    employeeId: 'APX-FCT-007',
    name: 'Rafiqul Islam',
    email: 'rafiqul.islam@apexgarments.com',
    role: 'Factory B Senior Tech',
    rbacTier: 'Tier 2 - Senior Infrastructure',
    facilityId: 'loc-fct-02',
    facilityCode: 'LOC-FCT-02',
    facilityName: 'Factory Building B (Washing & Dye)',
    department: 'Hazardous Environment Systems',
    source: 'Azure AD (Entra ID)',
    mfaStatus: 'Enforced (Microsoft Auth)',
    status: 'active',
    lastActive: '14m ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+880 1912-774023',
    groups: ['SG-Factory-B-Leads', 'SG-Industrial-IoT-Admins']
  },
  {
    id: 'usr-008',
    employeeId: 'APX-WH-008',
    name: 'Farhana Yeasmin',
    email: 'farhana.yeasmin@apexgarments.com',
    role: 'Logistics & Systems Tech',
    rbacTier: 'Tier 3 - Domain Specialist',
    facilityId: 'loc-wh-01',
    facilityCode: 'LOC-WH-01',
    facilityName: 'Central Fabric Warehouse',
    department: 'Supply Chain & RFID Logistics',
    source: 'Okta SAML 2.0',
    mfaStatus: 'Enforced (FIDO2 Key)',
    status: 'active',
    lastActive: '2m ago',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+880 1611-889900',
    groups: ['SG-Warehouse-Logistics', 'SG-Honeywell-Scanners']
  },
  {
    id: 'usr-009',
    employeeId: 'APX-DES-009',
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan@apexgarments.com',
    role: 'Senior Pattern Designer',
    rbacTier: 'Tier 5 - Standard Access',
    facilityId: 'loc-corp-01',
    facilityCode: 'LOC-CORP-01',
    facilityName: 'Apex HQ & Design Studio',
    department: 'Design & CAD Engineering',
    source: 'Okta SAML 2.0',
    mfaStatus: 'Enforced (TOTP)',
    status: 'active',
    lastActive: '1h ago',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    groups: ['SG-Design-Studio-Staff']
  },
  {
    id: 'usr-010',
    employeeId: 'APX-LIA-010',
    name: 'Anisur Rahman',
    email: 'anisur.rahman@apexgarments.com',
    role: 'Cutting Floor Dept Liaison',
    rbacTier: 'Tier 4 - Facility Operator',
    facilityId: 'loc-fct-01',
    facilityCode: 'LOC-FCT-01',
    facilityName: 'Factory Building A (Sewing & Cut)',
    department: 'Cutting Operations',
    source: 'Azure AD (Entra ID)',
    mfaStatus: 'Pending Setup',
    status: 'pending_invite',
    lastActive: 'Invited 2h ago',
    groups: ['SG-Floor-Liaisons']
  },
  {
    id: 'usr-011',
    employeeId: 'APX-SYS-011',
    name: 'ServiceAccount_Backup_Core',
    email: 'svc-backup@apexgarments.internal',
    role: 'Automated Backup Service',
    rbacTier: 'Tier 1 - Super Admin',
    facilityId: 'loc-corp-01',
    facilityCode: 'LOC-CORP-01',
    facilityName: 'Apex HQ & Design Studio',
    department: 'System Daemons',
    source: 'Local ITMS',
    mfaStatus: 'Enforced (FIDO2 Key)',
    status: 'active',
    lastActive: '5m ago',
    groups: ['SG-Service-Accounts', 'SG-Veeam-Disaster-Recovery']
  }
];
