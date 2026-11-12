import React from 'react';
import {
  MapPin,
  Activity,
  Server,
  Layers,
  ArrowRight,
  Terminal,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  Wifi,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { Facility } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface FacilityCardProps {
  facility: Facility;
  onManageAssets: (facility: Facility) => void;
  onOpenTerminal: (facility: Facility) => void;
  onOpenThermals: (facility: Facility) => void;
  onOpenTickets: (facility: Facility) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  onManageAssets,
  onOpenTerminal,
  onOpenThermals,
  onOpenTickets
}) => {
  const isAlert = facility.criticalTicketsCount > 0 || facility.status === 'warning';

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-level-1 hover:border-[#c7c4d8] transition-all flex flex-col justify-between group">
      <div>
        {/* Card Header */}
        <div className="p-4 pb-3 flex items-start justify-between gap-3 border-b border-[#f8f9fa]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base text-[#131b2e] tracking-tight">
                {facility.name}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-[#eaedff] text-[#3525cd] border border-[#dae2fd] rounded">
                {facility.code}
              </span>
            </div>
            <p className="text-xs text-[#464555] mt-0.5 truncate">{facility.subtitle}</p>
          </div>
          <div className="shrink-0">
            <StatusBadge
              status={facility.status}
              label={facility.statusLabel}
              pulse={facility.status === 'warning' || facility.status === 'critical'}
            />
          </div>
        </div>

        {/* Media Banner */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
          <img
            src={facility.image}
            alt={facility.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          {/* Dark gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

          {/* Location & Ping badge overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1.5 drop-shadow-sm font-medium truncate max-w-[70%]">
              <MapPin className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
              <span className="truncate">{facility.address}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 font-mono text-[11px] tabular-nums">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span>Ping: {facility.pingMs}ms</span>
            </div>
          </div>
        </div>

        {/* 3-Column Mini Telemetry Spec */}
        <div className="grid grid-cols-3 divide-x divide-[#e2e8f0] border-b border-[#e2e8f0] bg-[#fbfbff]">
          <div className="p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#777587]">
              Subnet Allocation
            </div>
            <div className="mt-1 font-mono text-xs font-semibold text-[#131b2e] truncate">
              {facility.subnet}
            </div>
            <div className="text-[10px] text-[#777587] truncate">
              {facility.leasedIps} / {facility.totalIps} hosts
            </div>
          </div>

          <div className="p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#777587]">
              Active Fleet
            </div>
            <div className="mt-1 font-mono text-xs font-semibold text-[#131b2e] truncate">
              {facility.activeFleetCount} Units
            </div>
            <div className="text-[10px] text-[#777587] truncate">
              {Math.round((facility.activeFleetCount / facility.totalDeviceCapacity) * 100)}% capacity
            </div>
          </div>

          <div className="p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#777587]">
              Infrastructure
            </div>
            <div className="mt-1 text-xs font-semibold text-[#131b2e] truncate">
              {facility.serverInfrastructure.split('(')[0]}
            </div>
            <div className="text-[10px] text-[#777587] truncate">
              {facility.serverInfrastructure.split('(')[1]?.replace(')', '') || 'SD-WAN Node'}
            </div>
          </div>
        </div>

        {/* Hardware Ecosystem Snapshot (Tags) */}
        <div className="p-4 border-b border-[#f1f5f9]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#777587] mb-2 flex items-center justify-between">
            <span>Hardware Ecosystem</span>
            <span className="font-mono text-[#4f46e5] text-[10px] font-normal">
              {facility.uplinks.split(' ')[0]} {facility.uplinks.split(' ')[1]}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {facility.hardwareTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] font-medium bg-[#eaedff] text-[#3525cd] rounded-md border border-[#dae2fd]/70 hover:bg-[#e2e7ff] transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Lead Engineer & Ticket Status Strip */}
        <div className="px-4 py-3 flex items-center justify-between bg-white text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={facility.leadEngineer.avatar}
              alt={facility.leadEngineer.name}
              className="w-7 h-7 rounded-full object-cover border border-[#c7c4d8] shrink-0"
            />
            <div className="truncate">
              <div className="font-semibold text-[#131b2e] truncate">
                {facility.leadEngineer.name}
              </div>
              <div className="text-[10px] text-[#777587] truncate">
                +{facility.leadEngineer.techCount} Field Techs Assigned
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenTickets(facility)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              facility.criticalTicketsCount > 0
                ? 'bg-[#fff1f2] text-[#9f1239] border-[#fecdd3] hover:bg-[#ffe4e6]'
                : facility.openTicketsCount > 0
                ? 'bg-[#fffbeb] text-[#92400e] border-[#fde68a] hover:bg-[#fef3c7]'
                : 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
            }`}
          >
            {facility.criticalTicketsCount > 0 ? (
              <ShieldAlert className="w-3.5 h-3.5 text-[#e11d48]" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
            )}
            <span>
              {facility.openTicketsCount} Tickets
              {facility.criticalTicketsCount > 0 ? ` (${facility.criticalTicketsCount} Crit)` : ''}
            </span>
          </button>
        </div>
      </div>

      {/* Card Footer: Manage Assets Link + Utility Actions */}
      <div className="px-4 py-3 bg-[#f8f9fc] border-t border-[#e2e8f0] flex items-center justify-between">
        <button
          onClick={() => onManageAssets(facility)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#3525cd] hover:text-[#3730a3] transition-colors"
        >
          <span>Manage Facility Assets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onOpenTerminal(facility)}
            className="p-1.5 text-[#464555] hover:text-[#131b2e] hover:bg-[#e2e7ff] rounded-md transition-colors"
            title="Open Interactive SSH / Switch Terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenThermals(facility)}
            className={`p-1.5 rounded-md transition-colors ${
              facility.thermalData?.status === 'alert'
                ? 'text-[#e11d48] bg-[#fff1f2] hover:bg-[#fecdd3]'
                : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#e2e7ff]'
            }`}
            title="Environmental Sensor & IDF Thermals"
          >
            <Thermometer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

