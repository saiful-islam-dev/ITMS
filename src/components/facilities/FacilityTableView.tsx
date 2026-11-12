import React from 'react';
import {
  MapPin,
  Terminal,
  Thermometer,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Server,
  Layers
} from 'lucide-react';
import { Facility } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface FacilityTableViewProps {
  facilities: Facility[];
  onManageAssets: (facility: Facility) => void;
  onOpenTerminal: (facility: Facility) => void;
  onOpenThermals: (facility: Facility) => void;
  onOpenTickets: (facility: Facility) => void;
}

export const FacilityTableView: React.FC<FacilityTableViewProps> = ({
  facilities,
  onManageAssets,
  onOpenTerminal,
  onOpenThermals,
  onOpenTickets
}) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-level-1">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f8f9fc] border-b border-[#e2e8f0] text-[11px] font-semibold text-[#777587] uppercase tracking-wider">
              <th className="py-3 px-4">Campus & Code</th>
              <th className="py-3 px-4">Physical Location</th>
              <th className="py-3 px-4">Subnet & Uplink</th>
              <th className="py-3 px-4">Fleet / Capacity</th>
              <th className="py-3 px-4">Lead Engineer</th>
              <th className="py-3 px-4">Status & SLA</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {facilities.map((fac) => (
              <tr
                key={fac.id}
                className="hover:bg-[#f8f9fe] transition-colors group"
              >
                {/* Campus & Code */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#131b2e] group-hover:text-[#3525cd] transition-colors">
                      {fac.name}
                    </span>
                    <span className="px-1.5 py-0.2 text-[10px] font-mono bg-[#eaedff] text-[#3525cd] rounded border border-[#dae2fd]">
                      {fac.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#777587] mt-0.5">{fac.subtitle}</div>
                </td>

                {/* Location */}
                <td className="py-3.5 px-4 text-[#464555]">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#777587] shrink-0" />
                    <span className="truncate max-w-[180px]">{fac.address}</span>
                  </div>
                  <div className="text-[10px] text-[#777587] pl-4">{fac.district} District</div>
                </td>

                {/* Subnet & Uplink */}
                <td className="py-3.5 px-4">
                  <div className="font-mono text-[#131b2e] font-medium">{fac.subnet}</div>
                  <div className="text-[10px] text-[#777587] truncate max-w-[160px] flex items-center gap-1">
                    <span>{fac.uplinks.split(' ')[0]}</span>
                    <span>·</span>
                    <span className="text-[#10b981] font-mono">{fac.pingMs}ms</span>
                  </div>
                </td>

                {/* Fleet / Capacity */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-[#131b2e] font-mono">
                    {fac.activeFleetCount} Units
                  </div>
                  <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-[#4f46e5] h-full rounded-full"
                      style={{
                        width: `${Math.round(
                          (fac.activeFleetCount / fac.totalDeviceCapacity) * 100
                        )}%`
                      }}
                    />
                  </div>
                </td>

                {/* Lead Engineer */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={fac.leadEngineer.avatar}
                      alt={fac.leadEngineer.name}
                      className="w-6 h-6 rounded-full object-cover border border-[#cbd5e1]"
                    />
                    <div>
                      <div className="font-medium text-[#131b2e]">{fac.leadEngineer.name}</div>
                      <div className="text-[10px] text-[#777587]">
                        +{fac.leadEngineer.techCount} Techs
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status & SLA */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <StatusBadge
                      status={fac.status}
                      label={fac.statusLabel}
                      size="sm"
                    />
                    <div className="text-[10px] text-[#777587] font-mono">
                      Uptime: {fac.uptimePercent}%
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onOpenTerminal(fac)}
                      className="p-1.5 text-[#464555] hover:text-[#131b2e] hover:bg-[#eaedff] rounded transition-colors"
                      title="SSH Console"
                    >
                      <Terminal className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenThermals(fac)}
                      className={`p-1.5 rounded transition-colors ${
                        fac.thermalData?.status === 'alert'
                          ? 'text-[#e11d48] bg-[#fff1f2]'
                          : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#eaedff]'
                      }`}
                      title="Thermals & IDF Sensors"
                    >
                      <Thermometer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onManageAssets(fac)}
                      className="px-2.5 py-1 text-xs font-semibold bg-[#eaedff] text-[#3525cd] hover:bg-[#dae2fd] rounded-md transition-colors flex items-center gap-1"
                    >
                      <span>Fleet</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

