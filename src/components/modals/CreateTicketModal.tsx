import React, { useState } from 'react';
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
  const [title, setTitle] = useState('');
  const [facilityId, setFacilityId] = useState(facilities[0]?.id || 'loc-fct-01');
  const [scope, setScope] = useState('');
  const [severity, setSeverity] = useState<SupportTicket['severity']>('high');
  const [category, setCategory] = useState<SupportTicket['category']>('Hardware');
  const [requester, setRequester] = useState('');
  const [requesterRole, setRequesterRole] = useState('');
  const [assignee, setAssignee] = useState('Masud Rana');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedFacility = facilities.find((f) => f.id === facilityId) || facilities[0];
    const newId = `tck-${Date.now()}`;
    const ticketNum = `#TCK-2024-${Math.floor(1050 + Math.random() * 50)}`;

    const newTicket: SupportTicket = {
      id: newId,
      ticketNumber: ticketNum,
      title: title.trim(),
      scope: scope.trim() || `${selectedFacility?.name || 'Factory'} Operations`,
      facilityId: selectedFacility?.id || 'loc-fct-01',
      facilityCode: selectedFacility?.code || 'LOC-FCT-01',
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
      description: description.trim() || 'Incident dispatched via ITMS Live Operations Dashboard.'
    };

    onCreateTicket(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-surface-container-lowest border border-surface-container rounded-xl w-full max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 z-10 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[20px]">
              add_task
            </span>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Create Support Incident</h3>
              <p className="font-caption text-caption text-on-surface-variant">Log an infrastructure or equipment issue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block font-label-compact text-label-compact uppercase text-on-surface-variant mb-1">
              Incident Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zebra ZT420 barcode printer offline on Line 6"
              className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-on-surface font-body-dense text-body-dense focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-compact text-label-compact uppercase text-on-surface-variant mb-1">
                Facility *
              </label>
              <select
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-on-surface font-body-dense text-body-dense focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-label-compact text-label-compact uppercase text-on-surface-variant mb-1">
                Scope / Location Tag
              </label>
              <input
                type="text"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="e.g. Sewing Line 4 • Factory A"
                className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-on-surface font-body-dense text-body-dense focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-compact text-label-compact uppercase text-on-surface-variant mb-1">
                Priority
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-on-surface font-body-dense text-body-dense focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="critical">CRITICAL (Line stoppage)</option>
                <option value="high">HIGH (Urgent operational)</option>
                <option value="medium">MEDIUM (Standard)</option>
                <option value="low">LOW (Minor/Cosmetic)</option>
              </select>
            </div>

            <div>
              <label className="block font-label-compact text-label-compact uppercase text-on-surface-variant mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-on-surface font-body-dense text-body-dense focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Hardware">Hardware & Printers</option>
                <option value="Network">Floor LAN & Switches</option>
                <option value="Software">ERP & CAD Systems</option>
                <option value="Access">Email & Access</option>
                <option value="Environmental">CCTV & Environmental</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-compact text-label-compact uppercase text-on-surface-variant mb-1">
                Requester Name
              </label>
              <input
                type="text"
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
                placeholder="e.g. Kabir Hossain"
                className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-on-surface font-body-dense text-body-dense focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-label-compact text-label-compact uppercase text-on-surface-variant mb-1">
                Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-on-surface font-body-dense text-body-dense focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Tanvir Hasan">Tanvir Hasan (Hardware)</option>
                <option value="Masud Rana">Masud Rana (CAD/ERP)</option>
                <option value="Tariq Rahman">Tariq Rahman (Lead)</option>
                <option value="Kamal Pasha">Kamal Pasha (Network)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-label-compact text-label-compact uppercase text-on-surface-variant mb-1">
              Description & Failure Symptoms
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail IP address, switch port, error message or machine symptom..."
              className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-on-surface font-body-dense text-body-dense focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-space-md py-1.5 rounded-lg bg-surface-container text-on-surface font-body-dense-medium text-body-dense-medium hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-body-dense-medium text-body-dense-medium hover:bg-primary-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Create Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

