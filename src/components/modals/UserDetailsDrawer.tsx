'use client';

import React from 'react';
import { X, ShieldCheck, Mail, Phone, Building, KeyRound, Monitor, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';
import { ManagedUser } from '../../data/mockUsers';
import { mockAssets } from '../../data/mockAssets';

interface UserDetailsDrawerProps {
  user: ManagedUser | null;
  onClose: () => void;
  onToggleStatus: (userId: string) => void;
}

export const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
  user,
  onClose,
  onToggleStatus
}) => {
  if (!user) return null;

  // Find assets assigned to this user
  const assignedAssets = mockAssets.filter(
    (a) => a.assignedTo && a.assignedTo.toLowerCase().includes(user.name.toLowerCase().split(' ')[0])
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-surface-container-lowest border-l border-outline-variant/50 w-full max-w-md h-full shadow-level-3 overflow-y-auto z-10 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="relative">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-base shadow-xs">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  user.status === 'active' ? 'bg-emerald-500' : user.status === 'suspended' ? 'bg-rose-500' : 'bg-amber-500'
                }`}></span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1.5">
                  <span>{user.name}</span>
                </h3>
                <p className="font-code-mono text-label-compact text-on-surface-variant">
                  {user.employeeId} • {user.role}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details Body */}
          <div className="p-5 space-y-5">
            {/* Quick Status Pill */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container">
              <div>
                <div className="font-label-compact text-label-compact text-on-surface-variant uppercase">Identity Status</div>
                <div className="font-body-dense-medium text-body-dense text-on-surface capitalize mt-0.5 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    user.status === 'active' ? 'bg-emerald-500' : user.status === 'suspended' ? 'bg-rose-500' : 'bg-amber-500'
                  }`}></span>
                  <span>{user.status === 'active' ? 'Active & Authenticated' : user.status}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-label-compact text-label-compact text-on-surface-variant uppercase">Last Active</div>
                <div className="font-code-mono text-caption text-on-surface font-semibold mt-0.5">{user.lastActive}</div>
              </div>
            </div>

            {/* Core Specs */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-body-dense">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <Mail className="w-4 h-4" /> Email:
                </span>
                <span className="font-code-mono text-caption text-on-surface select-all">{user.email}</span>
              </div>

              {user.phone && (
                <div className="flex items-center justify-between text-body-dense">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <Phone className="w-4 h-4" /> Phone:
                  </span>
                  <span className="font-code-mono text-caption text-on-surface">{user.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-body-dense">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <Building className="w-4 h-4" /> Primary Campus:
                </span>
                <span className="font-body-dense-medium text-on-surface text-right">{user.facilityName}</span>
              </div>

              <div className="flex items-center justify-between text-body-dense">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> RBAC Tier:
                </span>
                <span className="px-2 py-0.5 rounded font-label-compact text-[11px] font-bold bg-surface-container text-primary">
                  {user.rbacTier}
                </span>
              </div>

              <div className="flex items-center justify-between text-body-dense">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" /> MFA Security:
                </span>
                <span className="font-code-mono text-caption text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {user.mfaStatus}
                </span>
              </div>

              <div className="flex items-center justify-between text-body-dense">
                <span className="text-on-surface-variant">Directory Authority:</span>
                <span className="font-body-dense-medium text-on-surface">{user.source}</span>
              </div>
            </div>

            {/* Directory Security Groups */}
            <div>
              <div className="font-label-compact text-label-compact text-on-surface uppercase mb-2">
                Active Directory Security Groups
              </div>
              <div className="flex flex-wrap gap-1.5">
                {user.groups.map((grp) => (
                  <span
                    key={grp}
                    className="px-2 py-1 bg-surface-container font-code-mono text-[11px] text-on-surface rounded-md border border-surface-container-high"
                  >
                    {grp}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Hardware Assets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-compact text-label-compact text-on-surface uppercase">
                  Assigned IT Equipment ({assignedAssets.length})
                </span>
                <Monitor className="w-4 h-4 text-on-surface-variant" />
              </div>

              {assignedAssets.length > 0 ? (
                <div className="space-y-2">
                  {assignedAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-between text-body-dense"
                    >
                      <div>
                        <div className="font-body-dense-medium text-on-surface">{asset.name}</div>
                        <div className="font-code-mono text-[11px] text-on-surface-variant">
                          {asset.assetTag} • {asset.ipAddress}
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-surface-container-low rounded-lg text-caption text-on-surface-variant">
                  No direct personal IT hardware checked out. User operates shared floor terminals.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-surface-container-high bg-surface-container-low flex items-center justify-between gap-2">
          <button
            onClick={() => onToggleStatus(user.id)}
            className={`px-3 py-1.5 rounded-lg font-body-dense-medium text-body-dense transition-colors cursor-pointer ${
              user.status === 'active'
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {user.status === 'active' ? 'Suspend User Access' : 'Reactivate User'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-primary-container text-on-primary hover:bg-primary rounded-lg font-body-dense-medium text-body-dense shadow-sm transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
