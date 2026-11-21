'use client';

import React, { useState } from 'react';
import { X, UserPlus, Building, Briefcase, Mail, Phone, Clock, ShieldCheck, Award } from 'lucide-react';
import { Employee, Facility } from '../../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: Facility[];
  onAddEmployee: (newEmployee: Employee) => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  facilities,
  onAddEmployee
}) => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('IT & Systems');
  const [facilityId, setFacilityId] = useState(facilities[0]?.id || 'loc-corp-01');
  const [shift, setShift] = useState<Employee['shift']>('General (09:00 - 18:00)');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+880 1711-');
  const [isAdmin, setIsAdmin] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [certificationsText, setCertificationsText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedFacility = facilities.find((f) => f.id === facilityId) || {
      id: 'loc-corp-01',
      name: 'Apex HQ & Design Studio',
      code: 'LOC-CORP-01'
    };

    const certs = certificationsText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeId,
      name,
      role: role || 'Field Operations Specialist',
      title: role || 'Field Operations Specialist',
      department,
      facilityId: selectedFacility.id,
      facilityCode: (selectedFacility as any).code || 'LOC-CORP-01',
      facilityName: selectedFacility.name,
      shift,
      phone: phone || '+880 1700-000000',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@apexgarments.com`,
      status: 'active',
      isAdmin,
      avatar: '',
      certifications: certs.length > 0 ? certs : ['Standard Floor Safety'],
      specialty: specialty || 'Production Floor Equipment & IT Maintenance',
      linkedAssets: [],
      openTickets: 0
    };

    onAddEmployee(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white border border-[#c7c4d8]/60 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#eaedff] bg-[#faf8ff] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3525cd] text-white flex items-center justify-center shadow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#131b2e]">Provision New Employee</h3>
              <p className="text-xs text-[#777587]">
                Register workforce member into the enterprise HRMIS directory
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#777587] hover:text-[#131b2e] hover:bg-[#eaedff] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#131b2e] block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mahfuzur Rahman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#131b2e] block mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                required
                placeholder="EMP-XXXX"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-[#dae2fd] font-mono focus:border-[#3525cd] focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#131b2e] block mb-1">
                Designation / Role *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Production Floor Lead"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#131b2e] block mb-1">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] focus:bg-white outline-none font-medium"
              >
                <option value="IT & Systems">IT & Systems</option>
                <option value="Merchandising">Merchandising</option>
                <option value="Cutting & Sewing">Cutting & Sewing</option>
                <option value="Design & CAD">Design & CAD</option>
                <option value="Warehouse & Logistics">Warehouse & Logistics</option>
                <option value="HR & Compliance">HR & Compliance</option>
                <option value="Washing & Finishing">Washing & Finishing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#131b2e] block mb-1">
                Primary Facility *
              </label>
              <select
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] focus:bg-white outline-none font-medium"
              >
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} ({(fac as any).code || 'LOC'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#131b2e] block mb-1">
                Assigned Shift *
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] focus:bg-white outline-none font-medium"
              >
                <option value="General (09:00 - 18:00)">General (09:00 - 18:00)</option>
                <option value="Shift A (06:00 - 14:00)">Shift A (06:00 - 14:00)</option>
                <option value="Shift B (14:00 - 22:00)">Shift B (14:00 - 22:00)</option>
                <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#131b2e] block mb-1">
                Work Email
              </label>
              <input
                type="email"
                placeholder="name@apexgarments.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#131b2e] block mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                placeholder="+880 1711-XXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-[#dae2fd] font-mono focus:border-[#3525cd] focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#131b2e] block mb-1">
              Technical Specialty / Focus
            </label>
            <input
              type="text"
              placeholder="e.g. Sewing Machine Modbus Telemetry & Juki Calibration"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#131b2e] block mb-1">
              Certifications (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. CCNA, Zebra Pro, Lean Six Sigma"
              value={certificationsText}
              onChange={(e) => setCertificationsText(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] focus:bg-white outline-none"
            />
          </div>

          {/* Admin Role Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#faf8ff] border border-[#eaedff] rounded-xl">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#3525cd]" />
              <div>
                <span className="text-xs font-bold text-[#131b2e] block">
                  Assign Super Admin Privileges
                </span>
                <span className="text-[11px] text-[#777587]">
                  Grant elevated access to core IT infrastructure and security audits
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3525cd]" />
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#eaedff] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#464555] hover:text-[#131b2e] bg-white border border-[#c7c4d8] rounded-lg hover:bg-[#f2f3ff] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#312e81] rounded-lg transition-all shadow-sm"
            >
              Provision Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
