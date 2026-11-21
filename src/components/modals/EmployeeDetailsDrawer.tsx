'use client';

import React from 'react';
import {
  X,
  Building2,
  Factory,
  Warehouse,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Laptop,
  Ticket,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeDetailsDrawerProps {
  employee: Employee | null;
  onClose: () => void;
  onToggleStatus?: (employeeId: string) => void;
}

export const EmployeeDetailsDrawer: React.FC<EmployeeDetailsDrawerProps> = ({
  employee,
  onClose,
  onToggleStatus
}) => {
  if (!employee) return null;

  const getInitials = (name: string) => {
    const clean = name.replace(/^Dr\.\s+/i, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getLocationIcon = (facilityName: string) => {
    if (facilityName.toLowerCase().includes('warehouse')) {
      return <Warehouse className="w-4 h-4 text-[#5b598c]" />;
    }
    if (facilityName.toLowerCase().includes('factory')) {
      return <Factory className="w-4 h-4 text-[#5b598c]" />;
    }
    return <Building2 className="w-4 h-4 text-[#5b598c]" />;
  };

  const getStatusBadge = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Personnel
          </span>
        );
      case 'leave':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            On Approved Leave
          </span>
        );
      case 'offboarding':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Offboarding in Progress
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-50 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="relative bg-white border-l border-[#c7c4d8]/60 w-full max-w-lg h-full shadow-2xl overflow-y-auto z-10 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-[#eaedff] bg-[#faf8ff] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                {employee.avatar ? (
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#eaedff] text-[#3525cd] flex items-center justify-center font-bold text-base shadow-sm border border-[#dae2fd]">
                    {getInitials(employee.name)}
                  </div>
                )}
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    employee.status === 'active'
                      ? 'bg-emerald-500'
                      : employee.status === 'leave'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#131b2e]">{employee.name}</h3>
                  {employee.isAdmin && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#eaedff] text-[#3525cd] rounded uppercase">
                      ADMN
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs font-bold text-[#3525cd] bg-[#eaedff] px-2 py-0.5 rounded">
                    {employee.employeeId || employee.id}
                  </span>
                  <span className="text-xs text-[#777587]">·</span>
                  <span className="text-xs text-[#464555] font-medium">{employee.role}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#777587] hover:text-[#131b2e] hover:bg-[#eaedff] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6">
            {/* Status & Department Strip */}
            <div className="flex items-center justify-between p-3.5 bg-[#f8f9fe] border border-[#eaedff] rounded-xl">
              <div>
                <span className="text-[11px] font-semibold text-[#777587] block uppercase tracking-wider">
                  Operational Status
                </span>
                <div className="mt-1">{getStatusBadge(employee.status)}</div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-[#777587] block uppercase tracking-wider">
                  Department
                </span>
                <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold bg-[#eaedff] text-[#3525cd] rounded-md">
                  {employee.department || 'Operations'}
                </span>
              </div>
            </div>

            {/* Direct Contact Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#777587] uppercase tracking-wider">
                Direct Contact & Directory
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`mailto:${employee.email}`}
                  className="flex items-center gap-3 p-3 bg-white border border-[#e2e8f0] hover:border-[#3525cd] rounded-xl group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#3525cd] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#777587] block uppercase font-medium">Official Email</span>
                    <span className="text-xs font-medium text-[#131b2e] group-hover:text-[#3525cd] truncate block">
                      {employee.email}
                    </span>
                  </div>
                </a>

                <a
                  href={`tel:${employee.phone}`}
                  className="flex items-center gap-3 p-3 bg-white border border-[#e2e8f0] hover:border-[#3525cd] rounded-xl group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#3525cd] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#777587] block uppercase font-medium">Work Phone</span>
                    <span className="text-xs font-mono font-medium text-[#131b2e] group-hover:text-[#3525cd] truncate block">
                      {employee.phone}
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Location & Shift Allocation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#777587] uppercase tracking-wider">
                Facility & Schedule Roster
              </h4>
              <div className="p-4 bg-white border border-[#e2e8f0] rounded-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-2.5">
                    {getLocationIcon(employee.facilityName)}
                    <div>
                      <span className="text-xs font-bold text-[#131b2e] block">
                        {employee.facilityName}
                      </span>
                      <span className="text-[11px] font-mono text-[#777587]">
                        Campus Code: {employee.facilityCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#5b598c]" />
                    <span className="text-xs font-medium text-[#131b2e]">
                      {employee.shift}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Floor Checked-In
                  </span>
                </div>
              </div>
            </div>

            {/* Assigned Hardware Assets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#777587] uppercase tracking-wider flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-[#3525cd]" />
                  <span>Assigned Hardware Assets</span>
                </h4>
                <span className="text-xs font-semibold text-[#3525cd] bg-[#eaedff] px-2 py-0.5 rounded-full">
                  {(employee.linkedAssets || []).length} devices
                </span>
              </div>

              {(employee.linkedAssets || []).length > 0 ? (
                <div className="space-y-2">
                  {employee.linkedAssets?.map((assetName, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-[#e2e8f0] rounded-xl flex items-center justify-between hover:border-[#c7c4d8] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f2f3ff] text-[#3525cd] flex items-center justify-center font-bold text-xs">
                          #0{idx + 1}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#131b2e] block">
                            {assetName}
                          </span>
                          <span className="text-[11px] text-[#777587] font-mono">
                            SN: APX-HW-{10800 + idx * 42} · Tagged
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Assigned
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-[#f8f9fe] border border-dashed border-[#c7c4d8] rounded-xl text-center text-xs text-[#777587]">
                  No assigned IT devices on record for this personnel.
                </div>
              )}
            </div>

            {/* Certifications & Specialties */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#777587] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#3525cd]" />
                <span>Specialty & Certifications</span>
              </h4>
              <div className="p-4 bg-white border border-[#e2e8f0] rounded-xl space-y-3">
                <div>
                  <span className="text-[11px] font-semibold text-[#777587] uppercase tracking-wider block">
                    Domain Specialty
                  </span>
                  <p className="text-xs font-medium text-[#131b2e] mt-1">
                    {employee.specialty || 'General Manufacturing IT & Systems Maintenance'}
                  </p>
                </div>

                {employee.certifications && employee.certifications.length > 0 && (
                  <div className="pt-2 border-t border-[#f1f5f9]">
                    <span className="text-[11px] font-semibold text-[#777587] uppercase tracking-wider block mb-1.5">
                      Accreditations & Certifications
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {employee.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-2 py-0.5 text-xs font-medium bg-[#eaedff] text-[#3525cd] rounded border border-[#dae2fd]"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#eaedff] bg-[#faf8ff] flex items-center justify-between gap-3">
          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(employee.id)}
              className="px-3.5 py-2 text-xs font-semibold text-[#464555] hover:text-[#131b2e] bg-white border border-[#c7c4d8] rounded-lg hover:bg-[#f2f3ff] transition-all"
            >
              Toggle Status ({employee.status === 'active' ? 'Set On Leave' : 'Set Active'})
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#312e81] rounded-lg transition-all ml-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
