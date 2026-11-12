import React, { useState } from 'react';
import { SupportTicket } from '../../types';

interface TicketDetailsModalProps {
  isOpen: boolean;
  ticket: SupportTicket | null;
  onClose: () => void;
  onUpdateStatus?: (ticketId: string, status: SupportTicket['status']) => void;
}

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  isOpen,
  ticket,
  onClose,
  onUpdateStatus
}) => {
  if (!isOpen || !ticket) return null;

  const [currentStatus, setCurrentStatus] = useState<SupportTicket['status']>(ticket.status);

  const handleStatusChange = (newStatus: SupportTicket['status']) => {
    setCurrentStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(ticket.id, newStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-surface-container-lowest border border-surface-container rounded-xl w-full max-w-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 z-10 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-surface-container text-primary font-code-mono text-label-compact font-bold">
              {ticket.ticketNumber}
            </span>
            <div>
              <span className="font-label-compact text-label-compact px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface uppercase">
                {ticket.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              {ticket.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-caption font-caption text-on-surface-variant">
              <span>{ticket.scope || ticket.facilityName}</span>
              <span>•</span>
              <span className="bg-surface-container px-1 py-0.2 rounded text-[10px]">{ticket.facilityCode}</span>
              <span>•</span>
              <span>Created {ticket.age || ticket.createdAt}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 px-3.5 bg-surface-container-low rounded-lg">
            <div>
              <span className="font-label-compact text-[10px] text-on-surface-variant uppercase block">Priority</span>
              <span className={`inline-flex items-center gap-1 font-label-compact font-bold text-label-compact mt-0.5 ${
                ticket.severity === 'critical' ? 'text-error' : ticket.severity === 'high' ? 'text-amber-700' : 'text-primary'
              }`}>
                {ticket.severity.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-label-compact text-[10px] text-on-surface-variant uppercase block">Status</span>
              <span className="font-body-dense font-medium text-on-surface capitalize mt-0.5 block">
                {currentStatus.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="font-label-compact text-[10px] text-on-surface-variant uppercase block">Requester</span>
              <span className="font-body-dense text-on-surface truncate mt-0.5 block">
                {ticket.requester}
              </span>
            </div>
            <div>
              <span className="font-label-compact text-[10px] text-on-surface-variant uppercase block">Assignee</span>
              <span className="font-body-dense text-on-surface font-medium truncate mt-0.5 block">
                {ticket.assignee}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-label-compact text-label-compact text-on-surface-variant uppercase tracking-wider mb-1">
              Incident Diagnostics & Description
            </h4>
            <div className="p-3 bg-surface-container-low rounded-lg text-body-dense font-body-dense text-on-surface leading-relaxed">
              {ticket.description}
            </div>
          </div>

          <div>
            <h4 className="font-label-compact text-label-compact text-on-surface-variant uppercase tracking-wider mb-2">
              Update Incident Lifecycle State
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {(['open', 'in_progress', 'assigned', 'resolved'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`py-1.5 px-2 rounded-lg font-label-compact text-label-compact font-medium transition-colors border ${
                    currentStatus === status
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container-lowest text-on-surface-variant border-surface-container hover:bg-surface-container'
                  }`}
                >
                  {status.toUpperCase().replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-surface-container">
          <span className="font-caption text-caption text-on-surface-variant">
            Telemetry Synced via SD-WAN Edge Agent
          </span>
          <button
            onClick={onClose}
            className="px-space-md py-1.5 rounded-lg bg-surface-container text-on-surface font-body-dense-medium text-body-dense-medium hover:bg-surface-container-high transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

