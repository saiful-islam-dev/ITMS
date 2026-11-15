'use client';

import React, { useState } from 'react';
import { UserPlus, Mail, CheckCircle2 } from 'lucide-react';
import { Facility } from '../../types';
import { ManagedUser } from '../../data/mockUsers';
import { Modal } from '../common';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: Facility[];
  onInviteUser: (newUser: ManagedUser) => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  facilities,
  onInviteUser
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState(`APX-USR-${Math.floor(100 + Math.random() * 900)}`);
  const [role, setRole] = useState('Field Hardware Technician');
  const [facilityId, setFacilityId] = useState(facilities[0]?.id || 'loc-fct-01');
  const [department, setDepartment] = useState('Garment Manufacturing IT');
  const [rbacTier, setRbacTier] = useState<ManagedUser['rbacTier']>('Tier 4 - Facility Operator');
  const [enforceMfa, setEnforceMfa] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    const chosenFac = facilities.find((f) => f.id === facilityId) || facilities[0];

    setTimeout(() => {
      const newUser: ManagedUser = {
        id: `usr-${Date.now()}`,
        employeeId,
        name: fullName,
        email: email.includes('@') ? email : `${email}@apexgarments.com`,
        role,
        rbacTier,
        facilityId: chosenFac.id,
        facilityCode: chosenFac.code,
        facilityName: chosenFac.name,
        department,
        source: 'Azure AD (Entra ID)',
        mfaStatus: enforceMfa ? 'Pending Setup' : 'Enforced (TOTP)',
        status: 'pending_invite',
        lastActive: 'Invited just now',
        groups: ['SG-New-Personnel']
      };

      onInviteUser(newUser);
      setIsSubmitting(false);
      setInviteSent(true);

      setTimeout(() => {
        setInviteSent(false);
        onClose();
      }, 1200);
    }, 450);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite User & Provision Identity"
      subtitle="Provision a corporate identity, role permissions (RBAC), and facility assignment."
      icon={UserPlus}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Mahbubul Alam"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-dense text-body-dense text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
              Employee ID
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-code-mono text-body-dense text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
            Corporate Email *
          </label>
          <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg">
            <Mail className="w-4 h-4 text-on-surface-variant" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@apexgarments.com"
              className="bg-transparent border-0 outline-none w-full font-body-dense text-body-dense text-on-surface"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
              Facility Assignment
            </label>
            <select
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-dense text-body-dense text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white cursor-pointer"
            >
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-dense text-body-dense text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
              Assigned Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-dense text-body-dense text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white cursor-pointer"
            >
              <option value="IT Operations Specialist">IT Operations Specialist</option>
              <option value="Senior Network Engineer">Senior Network Engineer</option>
              <option value="CAD Systems Administrator">CAD Systems Administrator</option>
              <option value="Factory Field Lead">Factory Field Lead</option>
              <option value="Field Hardware Technician">Field Hardware Technician</option>
              <option value="Logistics Systems Tech">Logistics Systems Tech</option>
              <option value="Department Liaison">Department Liaison</option>
              <option value="Floor Operator">Floor Operator</option>
            </select>
          </div>

          <div>
            <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
              RBAC Access Tier
            </label>
            <select
              value={rbacTier}
              onChange={(e) => setRbacTier(e.target.value as ManagedUser['rbacTier'])}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-dense text-body-dense text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white cursor-pointer"
            >
              <option value="Tier 1 - Super Admin">Tier 1 - Super Admin (Root)</option>
              <option value="Tier 2 - Senior Infrastructure">Tier 2 - Senior Infrastructure</option>
              <option value="Tier 3 - Domain Specialist">Tier 3 - Domain Specialist</option>
              <option value="Tier 4 - Facility Operator">Tier 4 - Facility Operator</option>
              <option value="Tier 5 - Standard Access">Tier 5 - Standard Access</option>
            </select>
          </div>
        </div>

        {/* MFA Checkbox */}
        <div className="flex items-center gap-2 p-3 bg-surface-container rounded-lg border border-surface-container-high">
          <input
            type="checkbox"
            id="enforceMfaCheckbox"
            checked={enforceMfa}
            onChange={(e) => setEnforceMfa(e.target.checked)}
            className="w-4 h-4 text-primary rounded accent-primary cursor-pointer"
          />
          <label htmlFor="enforceMfaCheckbox" className="font-body-dense text-body-dense text-on-surface cursor-pointer select-none">
            Enforce mandatory FIDO2 / Authenticator MFA setup upon first login
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-body-dense-medium text-body-dense transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-container text-on-primary hover:bg-primary rounded-lg font-body-dense-medium text-body-dense shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                <span>Provisioning Account...</span>
              </>
            ) : inviteSent ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Invitation Dispatched!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span>Send Invitation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
