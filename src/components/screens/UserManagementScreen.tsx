'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  UserPlus,
  RefreshCw,
  ShieldCheck,
  Building,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
  Check,
  X,
  ExternalLink,
  Shield,
  Lock,
  Globe,
  Sliders,
  Sparkles
} from 'lucide-react';
import { Facility } from '../../types';
import { initialMockUsers, ManagedUser } from '../../data/mockUsers';
import { InviteUserModal } from '../modals/InviteUserModal';
import { ConfigureSsoModal } from '../modals/ConfigureSsoModal';
import { UserDetailsDrawer } from '../modals/UserDetailsDrawer';
import { PageHeader, Toast, EmptyState } from '../common';
import { useToast } from '../../hooks';
import { downloadFile, formatCsv } from '../../utils/exportCsv';

interface UserManagementScreenProps {
  facilities: Facility[];
}

export const UserManagementScreen: React.FC<UserManagementScreenProps> = ({ facilities }) => {
  // State
  const [users, setUsers] = useState<ManagedUser[]>(initialMockUsers);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState<'users' | 'rbac' | 'sso' | 'audit'>('users');

  // Selected checkboxes
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Modals & Drawers
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSsoModalOpen, setIsSsoModalOpen] = useState(false);
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<ManagedUser | null>(null);

  // Reusable Toast hook
  const { toast, showToast, clearToast } = useToast();

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (selectedRole !== 'all' && !u.role.toLowerCase().includes(selectedRole.toLowerCase())) return false;
      if (selectedFacility !== 'all' && u.facilityId !== selectedFacility) return false;
      if (selectedSource !== 'all' && !u.source.toLowerCase().includes(selectedSource.toLowerCase())) return false;
      if (selectedStatus !== 'all' && u.status !== selectedStatus) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesEmpId = u.employeeId.toLowerCase().includes(q);
        const matchesRole = u.role.toLowerCase().includes(q);
        const matchesFac = u.facilityName.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesEmpId && !matchesRole && !matchesFac) return false;
      }

      return true;
    });
  }, [users, search, selectedRole, selectedFacility, selectedSource, selectedStatus]);

  // Bulk selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleToggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Status toggle
  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          showToast(`User ${u.name} status updated to ${nextStatus.toUpperCase()}.`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Export Users to CSV
  const handleExportUsers = () => {
    const headers = [
      'Employee ID',
      'Full Name',
      'Corporate Email',
      'Role',
      'RBAC Tier',
      'Assigned Facility',
      'Department',
      'Directory Source',
      'MFA Status',
      'Status',
      'Last Active'
    ];

    const targetUsers = selectedUserIds.length > 0
      ? users.filter((u) => selectedUserIds.includes(u.id))
      : filteredUsers;

    const rows = targetUsers.map((u) => [
      u.employeeId,
      u.name,
      u.email,
      u.role,
      u.rbacTier,
      u.facilityName,
      u.department,
      u.source,
      u.mfaStatus,
      u.status.toUpperCase(),
      u.lastActive
    ]);

    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(formatCsv(headers, rows), `apex_garments_user_directory_${timestamp}.csv`);
    showToast(`Exported ${targetUsers.length} user records to CSV.`);
  };

  return (
    <div className="flex flex-col w-full space-y-space-md">
      {/* Toast Alert */}
      <Toast toast={toast} onClose={clearToast} />

      {/* Top Header Card matching user screenshot exactly */}
      <PageHeader
        title="User Management & Access Control"
        subtitle="Manage IT administrators, technicians, department liaisons, role-based access permissions (RBAC), and Active Directory / Okta SSO directory synchronizations across Apex Garments units."
        icon={<span className="material-symbols-outlined text-primary text-[22px]">manage_accounts</span>}
        badge={
          <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-surface-container text-primary font-label-compact text-label-compact font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Directory Sync Active: 1,428 Users Indexed
            <span className="text-outline">•</span>
            <span className="text-on-surface-variant font-code-mono text-[11px] font-normal">8 mins ago</span>
          </span>
        }
        actions={[
          {
            label: 'Export',
            icon: <span className="material-symbols-outlined text-[16px] text-on-surface-variant">download</span>,
            onClick: handleExportUsers,
            variant: 'secondary'
          },
          {
            label: 'Invite User',
            icon: <span className="material-symbols-outlined text-[16px] text-on-surface-variant">person_add</span>,
            onClick: () => setIsInviteModalOpen(true),
            variant: 'secondary'
          },
          {
            label: 'Configure SSO / Directory',
            icon: <span className="material-symbols-outlined text-[16px]">sync_alt</span>,
            onClick: () => setIsSsoModalOpen(true),
            variant: 'primary'
          }
        ]}
      />

      {/* Directory & Security KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-compact text-label-compact text-on-surface-variant uppercase tracking-wider">
              Total Managed Identities
            </span>
            <span className="material-symbols-outlined text-[18px] text-primary">group</span>
          </div>
          <div className="my-space-xs flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface tracking-tight">1,428</span>
            <span className="inline-flex items-center font-code-mono text-label-compact font-semibold text-primary">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +42 MoM
            </span>
          </div>
          <div className="flex justify-between items-center font-caption text-caption text-on-surface-variant">
            <span>18 IT Admins &amp; Specialists</span>
            <span className="font-code-mono font-medium text-on-surface">1,410 Personnel</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-compact text-label-compact text-on-surface-variant uppercase tracking-wider">
              Active SSO Sessions (Live)
            </span>
            <span className="material-symbols-outlined text-[18px] text-tertiary">passkey</span>
          </div>
          <div className="my-space-xs flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface tracking-tight">892</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              HEALTHY
            </span>
          </div>
          <div className="flex justify-between items-center font-caption text-caption text-on-surface-variant">
            <span>Azure AD &amp; Okta SAML 2.0</span>
            <span className="font-code-mono font-medium text-primary">12ms Sync Latency</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-compact text-label-compact text-on-surface-variant uppercase tracking-wider">
              MFA Security Compliance
            </span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">verified_user</span>
          </div>
          <div className="my-space-xs flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface tracking-tight">99.4%</span>
            <span className="font-label-compact text-label-compact text-emerald-700 font-semibold">
              FIDO2 / MS Auth
            </span>
          </div>
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden flex">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '99.4%' }}></div>
            </div>
            <div className="flex justify-between items-center font-code-mono text-[10px] text-on-surface-variant">
              <span>1,420 Enforced</span>
              <span>8 Exempted Break-Glass</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-compact text-label-compact text-on-surface-variant uppercase tracking-wider">
              Pending Role &amp; Access Requests
            </span>
            <span className="material-symbols-outlined text-[18px] text-amber-600">key</span>
          </div>
          <div className="my-space-xs flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface tracking-tight">3</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
              Needs Review
            </span>
          </div>
          <div className="flex justify-between items-center font-caption text-caption text-on-surface-variant">
            <span>2 Terminal Access Escalations</span>
            <span className="font-code-mono font-medium text-on-surface">1 Shift Reassign</span>
          </div>
        </div>
      </div>

      {/* Main Content Card Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        {/* Navigation Tabs Header */}
        <div className="border-b border-surface-container-high px-space-md pt-3 flex items-center justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'users', label: 'Users & Specialists Directory', count: filteredUsers.length },
              { id: 'rbac', label: 'Role-Based Access Control (RBAC)', count: '5 Tiers' },
              { id: 'sso', label: 'SSO & SCIM Directory Sync', count: 'Active' },
              { id: 'audit', label: 'Access & Security Audit Trail', count: '24h Log' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2.5 font-body-dense text-body-dense border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-body-dense-medium bg-surface-container-lowest rounded-t-lg shadow-xs'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full font-code-mono text-[10px] font-medium ${
                  activeTab === tab.id ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-code-mono text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Zero Trust Enforced
          </span>
        </div>

        {/* Tab 1: Users & Specialists Directory */}
        {activeTab === 'users' && (
          <div className="p-space-md space-y-space-md">
            {/* Filter & Search Strip */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xs items-center bg-surface-container-low p-2.5 rounded-xl border border-surface-container">
              {/* Search Bar */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Search users by name, email, employee ID, role, or facility..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-9 py-1.5 text-body-dense bg-surface-container-lowest rounded-lg border border-outline-variant/40 focus:border-primary focus:outline-none"
                />
                {search ? (
                  <button onClick={() => setSearch('')} className="absolute right-2.5 top-2 text-on-surface-variant hover:text-on-surface">
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="absolute right-2.5 top-2 font-code-mono text-[10px] bg-surface-container px-1 rounded text-on-surface-variant uppercase shadow-xs">
                    ⌘K
                  </kbd>
                )}
              </div>

              {/* Filters */}
              <div className="md:col-span-7 flex flex-wrap items-center justify-start md:justify-end gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-2.5 py-1.5 text-body-dense bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/40 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Super Admins</option>
                  <option value="Network">Network Engineers</option>
                  <option value="CAD">CAD Specialists</option>
                  <option value="Field">Field Technicians</option>
                  <option value="Logistics">Logistics Techs</option>
                  <option value="Designer">Designers</option>
                  <option value="Liaison">Department Liaisons</option>
                </select>

                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="px-2.5 py-1.5 text-body-dense bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/40 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Campuses</option>
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.code})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="px-2.5 py-1.5 text-body-dense bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/40 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Identity Sources</option>
                  <option value="Azure">Azure AD (Entra ID)</option>
                  <option value="Okta">Okta SAML 2.0</option>
                  <option value="Local">Local ITMS</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1.5 text-body-dense bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/40 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="pending_invite">Pending Invite</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Bulk Action Strip when items selected */}
            {selectedUserIds.length > 0 && (
              <div className="flex items-center justify-between p-2.5 px-4 bg-primary-container text-on-primary rounded-xl shadow-xs">
                <span className="font-body-dense-medium text-body-dense">
                  {selectedUserIds.length} user{selectedUserIds.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      showToast(`Dispatched mandatory MFA reset prompt to ${selectedUserIds.length} users.`);
                      setSelectedUserIds([]);
                    }}
                    className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-caption font-semibold cursor-pointer"
                  >
                    Force MFA Re-enrollment
                  </button>
                  <button
                    onClick={() => {
                      showToast(`Suspended ${selectedUserIds.length} selected accounts.`);
                      setSelectedUserIds([]);
                    }}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-caption font-semibold cursor-pointer"
                  >
                    Suspend Selected
                  </button>
                  <button
                    onClick={() => setSelectedUserIds([])}
                    className="px-2 py-1 text-white/80 hover:text-white text-caption cursor-pointer"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

            {/* High-Density Users Table */}
            <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
              <table className="w-full text-left text-body-dense">
                <thead>
                  <tr className="bg-surface-container-low font-label-compact text-label-compact text-on-surface-variant uppercase border-b border-surface-container-high">
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedUserIds.length > 0 && selectedUserIds.length === filteredUsers.length}
                        className="rounded text-primary accent-primary cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-3">User &amp; Identity</th>
                    <th className="py-2.5 px-3">Role &amp; RBAC Tier</th>
                    <th className="py-2.5 px-3">Facility / Campus</th>
                    <th className="py-2.5 px-3">Directory Source</th>
                    <th className="py-2.5 px-3">Security &amp; MFA</th>
                    <th className="py-2.5 px-3">Last Active</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/60 bg-surface-container-lowest">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => {
                      const isSelected = selectedUserIds.includes(u.id);
                      return (
                        <tr
                          key={u.id}
                          className={`hover:bg-surface-container-low transition-colors ${
                            isSelected ? 'bg-primary-container/5' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectUser(u.id)}
                              className="rounded text-primary accent-primary cursor-pointer"
                            />
                          </td>

                          {/* User & Identity */}
                          <td className="py-2.5 px-3">
                            <div
                              onClick={() => setSelectedUserForDrawer(u)}
                              className="flex items-center gap-2.5 cursor-pointer group"
                            >
                              <div className="relative shrink-0">
                                {u.avatar ? (
                                  <img
                                    src={u.avatar}
                                    alt={u.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
                                    {u.name.split(' ').map((n) => n[0]).join('')}
                                  </div>
                                )}
                                <span
                                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                                    u.status === 'active'
                                      ? 'bg-emerald-500'
                                      : u.status === 'suspended'
                                      ? 'bg-rose-500'
                                      : 'bg-amber-500'
                                  }`}
                                ></span>
                              </div>
                              <div>
                                <div className="font-body-dense-medium text-body-dense text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">
                                  <span>{u.name}</span>
                                </div>
                                <div className="font-code-mono text-[11px] text-on-surface-variant">
                                  {u.employeeId} · {u.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role & RBAC Tier */}
                          <td className="py-2.5 px-3">
                            <div className="font-body-dense-medium text-on-surface">{u.role}</div>
                            <span
                              className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-code-mono font-semibold ${
                                u.rbacTier.includes('Tier 1')
                                  ? 'bg-primary text-on-primary'
                                  : u.rbacTier.includes('Tier 2')
                                  ? 'bg-primary-container text-on-primary'
                                  : u.rbacTier.includes('Tier 3')
                                  ? 'bg-surface-container text-primary'
                                  : 'bg-surface-container text-on-surface-variant'
                              }`}
                            >
                              {u.rbacTier}
                            </span>
                          </td>

                          {/* Facility */}
                          <td className="py-2.5 px-3">
                            <div className="font-body-dense-medium text-on-surface">{u.facilityName}</div>
                            <div className="font-caption text-caption text-on-surface-variant">{u.department}</div>
                          </td>

                          {/* Directory Source */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1 font-body-dense text-on-surface">
                              <span className="material-symbols-outlined text-[14px] text-primary">
                                {u.source.includes('Azure') ? 'cloud_sync' : u.source.includes('Okta') ? 'passkey' : 'dns'}
                              </span>
                              <span>{u.source}</span>
                            </div>
                          </td>

                          {/* Security & MFA */}
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-code-mono font-medium ${
                                u.mfaStatus.includes('FIDO2')
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : u.mfaStatus.includes('Pending')
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {u.mfaStatus}
                            </span>
                          </td>

                          {/* Last Active */}
                          <td className="py-2.5 px-3 font-code-mono text-caption text-on-surface-variant">
                            {u.lastActive}
                          </td>

                          {/* Actions */}
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setSelectedUserForDrawer(u)}
                                className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface text-caption font-medium transition-colors cursor-pointer"
                                title="Inspect User Privileges"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(u.id)}
                                className={`px-2 py-1 rounded text-caption font-semibold transition-colors cursor-pointer ${
                                  u.status === 'active'
                                    ? 'hover:bg-rose-100 text-rose-700'
                                    : 'hover:bg-emerald-100 text-emerald-700'
                                }`}
                                title={u.status === 'active' ? 'Suspend User Access' : 'Reactivate User'}
                              >
                                {u.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-6">
                        <EmptyState
                          title="No users match your search criteria"
                          description="Try modifying your search term, role filter, or facility selection to view cataloged identities."
                          actionLabel="Reset Filters"
                          onAction={() => {
                            setSearch('');
                            setSelectedRole('all');
                            setSelectedFacility('all');
                            setSelectedSource('all');
                            setSelectedStatus('all');
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footnote */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-caption text-on-surface-variant pt-2 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                <span>Active Directory synchronization schedule: <strong>15-minute intervals</strong></span>
              </div>
              <span className="font-code-mono text-label-compact text-on-surface">
                Showing {filteredUsers.length} of {users.length} cataloged accounts
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Role-Based Access Control (RBAC Matrix) */}
        {activeTab === 'rbac' && (
          <div className="p-space-md space-y-space-md">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Role-Based Access Control (RBAC) Matrix</h3>
              <p className="font-caption text-caption text-on-surface-variant">
                Enforced operational privileges across root infrastructure, switch CLI terminals, thermal telemetry, and service desk dispatch.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
              <table className="w-full text-left text-body-dense">
                <thead>
                  <tr className="bg-surface-container-low font-label-compact text-label-compact text-on-surface-variant uppercase border-b border-surface-container-high">
                    <th className="py-3 px-4">System Capability / Domain</th>
                    <th className="py-3 px-3 text-center">Tier 1: Super Admin</th>
                    <th className="py-3 px-3 text-center">Tier 2: Infrastructure</th>
                    <th className="py-3 px-3 text-center">Tier 3: Domain Lead</th>
                    <th className="py-3 px-3 text-center">Tier 4: Field Tech</th>
                    <th className="py-3 px-3 text-center">Tier 5: Standard Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/60 bg-surface-container-lowest">
                  {[
                    { cap: 'Core Switch CLI & SSH Remote Terminal', t1: true, t2: true, t3: false, t4: false, t5: false },
                    { cap: 'Subnet Reconfiguration & CIDR Re-allocation', t1: true, t2: true, t3: false, t4: false, t5: false },
                    { cap: 'IoT Sensor Calibration & Thermal Overrides', t1: true, t2: true, t3: true, t4: false, t5: false },
                    { cap: 'Hardware Asset Registration & Depreciation Ledger', t1: true, t2: true, t3: true, t4: true, t5: false },
                    { cap: 'Support Ticket SLA Resolution & Sign-off', t1: true, t2: true, t3: true, t4: true, t5: false },
                    { cap: 'Identity Provider & SCIM SSO Configuration', t1: true, t2: false, t3: false, t4: false, t5: false },
                    { cap: 'Certified Governance & Compliance Audit Export', t1: true, t2: true, t3: true, t4: false, t5: false },
                    { cap: 'Personal Ticket Submission & Asset Inquiries', t1: true, t2: true, t3: true, t4: true, t5: true }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 font-body-dense-medium text-on-surface">{row.cap}</td>
                      <td className="py-3 px-3 text-center">
                        {row.t1 ? <span className="inline-block p-1 rounded-full bg-emerald-100 text-emerald-700">✓</span> : <span className="text-outline-variant">—</span>}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {row.t2 ? <span className="inline-block p-1 rounded-full bg-emerald-100 text-emerald-700">✓</span> : <span className="text-outline-variant">—</span>}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {row.t3 ? <span className="inline-block p-1 rounded-full bg-emerald-100 text-emerald-700">✓</span> : <span className="text-outline-variant">—</span>}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {row.t4 ? <span className="inline-block p-1 rounded-full bg-emerald-100 text-emerald-700">✓</span> : <span className="text-outline-variant">—</span>}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {row.t5 ? <span className="inline-block p-1 rounded-full bg-emerald-100 text-emerald-700">✓</span> : <span className="text-outline-variant">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: SSO & SCIM Directory Sync */}
        {activeTab === 'sso' && (
          <div className="p-space-md space-y-space-md">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Directory Connectors &amp; Automated Sync</h3>
              <p className="font-caption text-caption text-on-surface-variant">
                Live federation status across Microsoft Entra ID, Okta Workforce Identity, and on-premises SCIM agents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Connector 1 */}
              <div className="p-4 rounded-xl border border-surface-container bg-surface-container-low flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-compact text-label-compact text-on-surface font-bold">Microsoft Entra ID</span>
                    <span className="px-2 py-0.5 rounded font-code-mono text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      CONNECTED
                    </span>
                  </div>
                  <div className="font-code-mono text-[11px] text-on-surface-variant mb-2">Tenant: apex-garments.onmicrosoft.com</div>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Primary directory for 1,240 corporate engineers, branch offices, and factory supervisors.
                  </p>
                </div>
                <div className="pt-3 border-t border-surface-container-high/60 mt-3 flex items-center justify-between font-caption">
                  <span className="text-on-surface-variant font-code-mono text-[11px]">Synced: 8m ago</span>
                  <button
                    onClick={() => {
                      showToast('Incremental Entra ID sync triggered.');
                    }}
                    className="text-primary hover:text-primary-container font-semibold cursor-pointer"
                  >
                    Sync Now
                  </button>
                </div>
              </div>

              {/* Connector 2 */}
              <div className="p-4 rounded-xl border border-surface-container bg-surface-container-low flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-compact text-label-compact text-on-surface font-bold">Okta Workforce SAML 2.0</span>
                    <span className="px-2 py-0.5 rounded font-code-mono text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      CONNECTED
                    </span>
                  </div>
                  <div className="font-code-mono text-[11px] text-on-surface-variant mb-2">Domain: apexgarments.okta.com</div>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Design studio CAD workstations, external auditor access, and logistics scanner authentication.
                  </p>
                </div>
                <div className="pt-3 border-t border-surface-container-high/60 mt-3 flex items-center justify-between font-caption">
                  <span className="text-on-surface-variant font-code-mono text-[11px]">Synced: 22m ago</span>
                  <button
                    onClick={() => {
                      showToast('Okta SAML assertion ping passed.');
                    }}
                    className="text-primary hover:text-primary-container font-semibold cursor-pointer"
                  >
                    Test Ping
                  </button>
                </div>
              </div>

              {/* Connector 3 */}
              <div className="p-4 rounded-xl border border-surface-container bg-surface-container-low flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-compact text-label-compact text-on-surface font-bold">Local ITMS Break-Glass DB</span>
                    <span className="px-2 py-0.5 rounded font-code-mono text-[10px] font-bold bg-surface-container text-on-surface">
                      STANDBY
                    </span>
                  </div>
                  <div className="font-code-mono text-[11px] text-on-surface-variant mb-2">Internal Vault: encrypted AES-256</div>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Emergency root credentials and service account daemon keys for WAN blackout offline scenarios.
                  </p>
                </div>
                <div className="pt-3 border-t border-surface-container-high/60 mt-3 flex items-center justify-between font-caption">
                  <span className="text-on-surface-variant font-code-mono text-[11px]">14 Daemons</span>
                  <span className="text-emerald-700 font-semibold">Ready</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Access & Security Audit Trail */}
        {activeTab === 'audit' && (
          <div className="p-space-md space-y-space-md">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Security &amp; Authentication Audit Trail</h3>
              <p className="font-caption text-caption text-on-surface-variant">
                Live immutable audit logs of identity logins, SAML token grants, and privilege alterations.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { time: '15:18:02', user: 'Tariq Rahman', event: 'SAML 2.0 Authenticated via Azure AD (FIDO2 Hardware Key)', ip: '10.14.2.19', status: 'SUCCESS' },
                { time: '15:10:44', user: 'Kabir Hossain', event: 'Factory A IoT Terminal Access Session Initiated', ip: '10.14.8.42', status: 'SUCCESS' },
                { time: '14:52:19', user: 'ServiceAccount_Backup_Core', event: 'Automated Token Refresh (SCIM 2.0 Daemon)', ip: '10.14.0.12', status: 'SUCCESS' },
                { time: '14:35:08', user: 'Anisur Rahman', event: 'User Invitation Dispatched to Cutting Floor Liaison', ip: '10.14.2.1', status: 'PENDING' },
                { time: '13:40:12', user: 'Farhana Yeasmin', event: 'Handheld Scanner Device Profile Assigned', ip: '10.14.16.24', status: 'SUCCESS' },
                { time: '12:15:33', user: 'Zubair Hossain', event: 'MFA Policy Re-verification Run for 14 IT Administrators', ip: '10.14.2.22', status: 'SUCCESS' }
              ].map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-surface-container-low border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-body-dense hover:bg-surface-container transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-code-mono text-[11px] text-on-surface-variant shrink-0">{log.time}</span>
                    <div>
                      <span className="font-body-dense-medium text-on-surface mr-2">{log.user}:</span>
                      <span className="text-on-surface-variant">{log.event}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto font-code-mono text-[11px]">
                    <span className="text-on-surface-variant">{log.ip}</span>
                    <span className="px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        facilities={facilities}
        onInviteUser={(newUser) => {
          setUsers((prev) => [newUser, ...prev]);
          showToast(`Invitation dispatched to ${newUser.name} (${newUser.email}).`);
        }}
      />

      {/* Configure SSO Modal */}
      <ConfigureSsoModal
        isOpen={isSsoModalOpen}
        onClose={() => setIsSsoModalOpen(false)}
        onSyncTriggered={() => {
          showToast('Azure AD & Okta SCIM directory synchronized successfully.');
        }}
      />

      {/* User Details Drawer */}
      <UserDetailsDrawer
        user={selectedUserForDrawer}
        onClose={() => setSelectedUserForDrawer(null)}
        onToggleStatus={(uid) => {
          handleToggleUserStatus(uid);
          setSelectedUserForDrawer((prev) =>
            prev && prev.id === uid ? { ...prev, status: prev.status === 'active' ? 'suspended' : 'active' } : prev
          );
        }}
      />
    </div>
  );
};
