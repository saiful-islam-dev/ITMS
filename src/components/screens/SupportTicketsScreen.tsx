'use client';

import React, { useState, useMemo } from 'react';
import {
  Ticket,
  Search,
  Filter,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  UserCheck,
  Building,
  Plus,
  MessageSquare
} from 'lucide-react';
import { SupportTicket, Facility } from '../../types';

interface SupportTicketsScreenProps {
  tickets: SupportTicket[];
  facilities: Facility[];
  onUpdateTicketStatus: (ticketId: string, newStatus: SupportTicket['status']) => void;
  onOpenThermals?: (facility: Facility) => void;
  onOpenCreateTicket?: () => void;
}

export const SupportTicketsScreen: React.FC<SupportTicketsScreenProps> = ({
  tickets,
  facilities,
  onUpdateTicketStatus,
  onOpenThermals,
  onOpenCreateTicket
}) => {
  const [search, setSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'open' | 'in_progress' | 'resolved'>('all');
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Tab filter
      if (activeTab === 'critical' && t.severity !== 'critical') return false;
      if (activeTab === 'open' && t.status !== 'open') return false;
      if (activeTab === 'in_progress' && t.status !== 'in_progress') return false;
      if (activeTab === 'resolved' && t.status !== 'resolved') return false;

      // Severity dropdown
      if (selectedSeverity !== 'all' && t.severity !== selectedSeverity) return false;

      // Campus dropdown
      if (selectedCampus !== 'all' && t.facilityId !== selectedCampus) return false;

      // Search keyword
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesNum = t.ticketNumber.toLowerCase().includes(q);
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesAssignee = t.assignee.toLowerCase().includes(q);
        const matchesFacility = t.facilityName.toLowerCase().includes(q);
        if (!matchesNum && !matchesTitle && !matchesDesc && !matchesAssignee && !matchesFacility) {
          return false;
        }
      }

      return true;
    });
  }, [tickets, activeTab, selectedSeverity, selectedCampus, search]);

  const criticalCount = tickets.filter((t) => t.severity === 'critical').length;
  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-[#131b2e] tracking-tight">
              IT Operations Service Desk
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#fff1f2] text-[#9f1239] rounded-full border border-[#fecdd3]">
              {tickets.length} ACTIVE INCIDENTS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#464555] mt-1">
            Real-time incident dispatch, environmental alerts, and SLA resolution tracking for all campuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#777587] hidden sm:inline">
            Average MTTR: 1.4 Hours
          </span>
          {onOpenCreateTicket && (
            <button
              onClick={onOpenCreateTicket}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#312e81] rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Ticket</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-3 shadow-level-1 space-y-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#eaedff] rounded-lg border border-[#dae2fd] overflow-x-auto">
          {[
            { id: 'all', label: 'All Incidents', count: tickets.length },
            { id: 'critical', label: 'Critical Only', count: criticalCount, isRed: true },
            { id: 'open', label: 'Open', count: openCount },
            { id: 'in_progress', label: 'In Progress', count: inProgressCount },
            { id: 'resolved', label: 'Resolved', count: resolvedCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#3525cd] shadow-xs font-semibold'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums ${
                  tab.isRed && tab.count > 0
                    ? 'bg-[#fff1f2] text-[#9f1239] font-bold'
                    : 'bg-[#dae2fd]/70 text-[#464555]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#777587]" />
            <input
              type="text"
              placeholder="Search by ticket # (TICK-...), issue title, assignee, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="px-3 py-2 text-xs bg-[#f2f3ff] text-[#131b2e] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none font-medium"
            >
              <option value="all">All Facilities</option>
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.code})
                </option>
              ))}
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 text-xs bg-[#f2f3ff] text-[#131b2e] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none font-medium"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center text-xs text-[#777587]">
            No tickets match your active filter criteria.
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const isExpanded = expandedTicketId === ticket.id;
            const isCrit = ticket.severity === 'critical';
            return (
              <div
                key={ticket.id}
                className={`bg-white border rounded-xl overflow-hidden shadow-level-1 transition-all ${
                  isCrit
                    ? 'border-[#fecdd3] hover:border-[#f43f5e]'
                    : 'border-[#e2e8f0] hover:border-[#c7c4d8]'
                }`}
              >
                <div
                  onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-[#faf8ff] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                        ticket.severity === 'critical'
                          ? 'bg-[#fff1f2] text-[#e11d48]'
                          : ticket.severity === 'high'
                          ? 'bg-[#fffbeb] text-[#f59e0b]'
                          : 'bg-[#eaedff] text-[#3525cd]'
                      }`}
                    >
                      {ticket.severity === 'critical' ? (
                        <Flame className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Ticket className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#3525cd]">
                          {ticket.ticketNumber}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase ${
                            ticket.severity === 'critical'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : ticket.severity === 'high'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ticket.severity}
                        </span>
                        <span className="text-[10px] text-[#777587] font-medium">
                          {ticket.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#131b2e] mt-1">
                        {ticket.title}
                      </h4>
                      <p className="text-xs text-[#464555] line-clamp-1 mt-0.5">
                        {ticket.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto shrink-0 text-xs">
                    <div className="text-right">
                      <div className="font-medium text-[#131b2e]">{ticket.assignee}</div>
                      <div className="text-[10px] text-[#777587]">
                        {ticket.facilityCode} · {ticket.createdAt}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        ticket.status === 'resolved'
                          ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                          : ticket.status === 'in_progress'
                          ? 'bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]'
                          : 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]'
                      }`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Expanded Action Panel */}
                {isExpanded && (
                  <div className="px-5 py-4 bg-[#f8f9fe] border-t border-[#e2e8f0] space-y-3 text-xs animate-in fade-in duration-150">
                    <div className="text-[#131b2e] leading-relaxed">
                      <strong>Incident Description:</strong> {ticket.description}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[#464555]">
                      <div>
                        <span className="text-[#777587]">Campus: </span>
                        <strong>{ticket.facilityName}</strong>
                      </div>
                      <div>
                        <span className="text-[#777587]">Requester: </span>
                        <strong>{ticket.requester}</strong>
                      </div>
                      <div>
                        <span className="text-[#777587]">Assigned Tech: </span>
                        <strong>{ticket.assignee}</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#f1f5f9]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#777587] font-medium">Update Status:</span>
                        <button
                          onClick={() => onUpdateTicketStatus(ticket.id, 'open')}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium ${
                            ticket.status === 'open'
                              ? 'bg-amber-600 text-white font-bold'
                              : 'bg-white border text-slate-700'
                          }`}
                        >
                          Open
                        </button>
                        <button
                          onClick={() => onUpdateTicketStatus(ticket.id, 'in_progress')}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium ${
                            ticket.status === 'in_progress'
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-white border text-slate-700'
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => onUpdateTicketStatus(ticket.id, 'resolved')}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium ${
                            ticket.status === 'resolved'
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'bg-white border text-slate-700'
                          }`}
                        >
                          Mark Resolved
                        </button>
                      </div>

                      {ticket.facilityId === 'loc-fct-02' && onOpenThermals && (
                        <button
                          onClick={() => {
                            const fac = facilities.find((f) => f.id === 'loc-fct-02');
                            if (fac) onOpenThermals(fac);
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded text-[11px] font-semibold hover:bg-red-700"
                        >
                          Open Environmental Sensor Diagnostics →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

