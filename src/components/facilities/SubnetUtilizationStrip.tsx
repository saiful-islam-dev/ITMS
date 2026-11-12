import React from 'react';
import {
  Server,
  PhoneCall,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';
import { initialSubnetMetrics } from '../../data/mockFacilities';

interface SubnetUtilizationStripProps {
  onHotlineClick?: () => void;
  onSubnetInspect?: (subnetName: string) => void;
}

export const SubnetUtilizationStrip: React.FC<SubnetUtilizationStripProps> = ({
  onHotlineClick,
  onSubnetInspect
}) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-level-1 mt-6">
      {/* Top Supernet Bar Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#f1f5f9] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-[#131b2e]">
              Master IP Subnet & Address Pool Utilization
            </h3>
            <span className="font-mono text-xs px-2 py-0.5 bg-[#f2f3ff] text-[#3525cd] rounded border border-[#dae2fd]">
              Supernet: 10.14.0.0/16
            </span>
          </div>
          <p className="text-xs text-[#777587] mt-0.5">
            Dynamic DHCP leases and static reservations across all 4 Apex enterprise locations.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Overall Bar */}
          <div className="flex items-center gap-3">
            <div className="w-36 sm:w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#3525cd] h-full rounded-full transition-all duration-500"
                style={{ width: '62%' }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-[#131b2e]">
              62% Allocated
            </span>
          </div>

          {/* Hotline Trigger */}
          <button
            onClick={onHotlineClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#9f1239] border border-[#fecdd3] rounded-lg transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#e11d48]" />
            <span>Shift Supervisor Hotline</span>
          </button>
        </div>
      </div>

      {/* 4 Subnet Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {initialSubnetMetrics.map((subnet) => {
          const isWarning = subnet.status === 'warning';
          return (
            <div
              key={subnet.cidr}
              onClick={() => onSubnetInspect && onSubnetInspect(subnet.name)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isWarning
                  ? 'bg-[#fffbeb]/50 border-[#fde68a] hover:border-[#f59e0b]'
                  : 'bg-[#faf8ff] border-[#e2e8f0] hover:border-[#c7c4d8]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 bg-white text-[#464555] border border-slate-200 rounded">
                    {subnet.facilityCode}
                  </span>
                  <h4 className="font-semibold text-xs text-[#131b2e] mt-1 truncate">
                    {subnet.name}
                  </h4>
                  <div className="font-mono text-xs text-[#3525cd] font-medium">
                    {subnet.cidr}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-bold font-mono ${
                      isWarning ? 'text-[#b45309]' : 'text-[#131b2e]'
                    }`}
                  >
                    {subnet.percent}%
                  </span>
                  <div className="text-[10px] text-[#777587]">Leased</div>
                </div>
              </div>

              {/* Progress gauge */}
              <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full ${
                    isWarning ? 'bg-[#f59e0b]' : 'bg-[#4f46e5]'
                  }`}
                  style={{ width: `${subnet.percent}%` }}
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#464555]">
                <span className="font-mono text-[10px]">
                  {subnet.leased} / {subnet.totalHosts}
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    isWarning ? 'text-[#b45309]' : 'text-[#065f46]'
                  }`}
                >
                  {isWarning ? 'VLAN Warning' : 'Healthy'}
                </span>
              </div>
              <p className="text-[10px] text-[#777587] mt-1.5 line-clamp-1">
                {subnet.notes}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

