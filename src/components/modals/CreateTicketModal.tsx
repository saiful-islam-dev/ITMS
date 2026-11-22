'use client';

import React, { useState } from 'react';
import {
  X,
  Ticket,
  AlertCircle,
  Building2,
  Clock,
  User,
  CheckCircle2,
  Flame,
  ShieldAlert,
  MapPin,
  Cpu
} from 'lucide-react';
import { Facility, SupportTicket } from '../../types';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: Facility[];
  onCreateTicket: (ticket: SupportTicket) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  facilities,
  onCreateTicket
}) => {
  const [ticketNumber, setTicketNumber] = useState(
    `#TCK-2024-${Math.floor(1050 + Math.random() * 900)}`
  );
  const [title, setTitle] = useState('');
  const [facilityId, setFacilityId] = useState(facilities[0]?.id || 'loc-fct-01');
  const [scope, setScope] = useState('Floor 2 — Sewing Line 08 (Station D)');
  const [severity, setSeverity] = useState<SupportTicket['severity']>('high');
  const [category, setCategory] = useState<SupportTicket['category']>('Hardware');
  const [requester, setRequester] = useState('Kabir Hossain');
  const [requesterRole, setRequesterRole] = useState('Line 08 Supervisor');
  const [assignee, setAssignee] = useState('Tanvir Hasan');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const isTitleValid = Boolean(title.trim());
  const isFacilityValid = Boolean(facilityId);
  const isRequesterValid = Boolean(requester.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedFacility =
      facilities.find((f) => f.id === facilityId) || facilities[0];
    const newId = `tck-${Date.now()}`;

    const newTicket: SupportTicket = {
      id: newId,
      ticketNumber,
      title: title.trim(),
      scope: scope.trim() || `${selectedFacility?.name || 'Factory'} Operations`,
      facilityId: selectedFacility?.id || 'loc-fct-01',
      facilityCode: (selectedFacility as any)?.code || 'LOC-FCT-01',
      facilityName: selectedFacility?.name || 'Factory Facility',
      severity,
      status: 'open',
      category,
      requester: requester.trim() || 'Factory Supervisor',
      requesterRole: requesterRole.trim() || 'Operations Lead',
      assignee: assignee || 'Tanvir Hasan',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      age: 'Just now',
      description:
        description.trim() ||
        'Incident dispatched via ITMS Live Operations Dashboard.'
    };

    onCreateTicket(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white border border-[#c7c4d8]/70 w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] bg-[#faf8ff] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3525cd] text-white flex items-center justify-center shadow-sm">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#131b2e]">
                  Create Support Incident Ticket
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#eaedff] text-[#3525cd] rounded">
                  {ticketNumber}
                </span>
              </div>
              <p className="text-xs text-[#777587]">
                Dispatch on-floor emergency technician or hardware repair order
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#777587] hover:text-[#131b2e] hover:bg-[#eaedff] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Incident Title */}
          <div>
            <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
              Incident / Issue Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zebra ZT410 Thermal Barcode Printer offline on Sewing Line 08"
              className="w-full px-3.5 py-2.5 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none"
            />
          </div>

          {/* Facility & Location Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
                Target Facility / Campus *
              </label>
              <select
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none font-medium cursor-pointer"
              >
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({(f as any).code || 'LOC'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
                Floor & Production Scope
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#777587]" />
                <input
                  type="text"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="e.g. Sewing Line 08 (Station D)"
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Severity & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
                Urgency / Severity Level *
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none font-medium cursor-pointer"
              >
                <option value="critical">CRITICAL (Assembly Line Stopped)</option>
                <option value="high">HIGH (Urgent Operational Impact)</option>
                <option value="medium">MEDIUM (Standard Support SLA)</option>
                <option value="low">LOW (Minor / Cosmetic Inquiry)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
                Equipment Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none font-medium cursor-pointer"
              >
                <option value="Hardware">Hardware & Label Printers</option>
                <option value="Network">Factory Floor LAN & Wi-Fi</option>
                <option value="Software">Optitex CAD & ERP Servers</option>
                <option value="Environmental">CCTV & IDF Humidity Alerts</option>
                <option value="Access">Biometrics & Turnstile Access</option>
              </select>
            </div>
          </div>

          {/* Requester & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
                Requester Name & Role
              </label>
              <input
                type="text"
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
                placeholder="e.g. Kabir Hossain (Line 08 Supervisor)"
                className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
                Designated Field Technician
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none font-medium cursor-pointer"
              >
                <option value="Tanvir Hasan">Tanvir Hasan (Lead Network Eng)</option>
                <option value="Sultan Mahmud">Sultan Mahmud (Floor Hardware Tech)</option>
                <option value="Nusrat Jahan">Nusrat Jahan (Industrial IoT Specialist)</option>
                <option value="Tariq Rahman">Tariq Rahman (Super Admin)</option>
              </select>
            </div>
          </div>

          {/* Description & Diagnostic Symptoms */}
          <div>
            <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
              Diagnostic Symptoms & Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail IP address, switch port, error code or mechanical symptoms..."
              className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#faf8ff] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#777587]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ready for instant queue dispatch</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#464555] hover:text-[#131b2e] bg-white border border-[#c7c4d8] hover:bg-[#f2f3ff] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isTitleValid}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#312e81] rounded-lg transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
