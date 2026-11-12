import React, { useState } from 'react';
import {
  Network,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Server,
  Cloud,
  Layers,
  ArrowUpDown,
  Zap
} from 'lucide-react';
import { Facility } from '../../types';

interface NetworkTopologyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: Facility[];
}

export const NetworkTopologyDrawer: React.FC<NetworkTopologyDrawerProps> = ({
  isOpen,
  onClose,
  facilities
}) => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingOffsets, setPingOffsets] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  const handlePingSweep = () => {
    setIsPinging(true);
    setTimeout(() => {
      setPingOffsets({
        'loc-corp-01': Math.floor(Math.random() * 3) + 3,
        'loc-fct-01': Math.floor(Math.random() * 4) + 11,
        'loc-fct-02': Math.floor(Math.random() * 6) + 16,
        'loc-whse-01': Math.floor(Math.random() * 3) + 7
      });
      setIsPinging(false);
    }, 700);
  };

  const hq = facilities.find((f) => f.id === 'loc-corp-01');
  const factoryA = facilities.find((f) => f.id === 'loc-fct-01');
  const factoryB = facilities.find((f) => f.id === 'loc-fct-02');
  const warehouse = facilities.find((f) => f.id === 'loc-whse-01');

  return (
    <div className="bg-white border border-[#cbd5e1] rounded-xl p-5 mb-6 shadow-level-2 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f1f5f9] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#eaedff] text-[#3525cd] rounded-lg">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-[#131b2e]">
                Enterprise SD-WAN Mesh Topology Map
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                4 IPsec Tunnels Active
              </span>
            </div>
            <p className="text-xs text-[#464555]">
              Real-time multi-tenant overlay linking Dhaka Corporate Core with Gazipur production plants and Savar logistics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePingSweep}
            disabled={isPinging}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3525cd] border border-[#dae2fd] rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>Ping All Tunnels</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-[#464555] hover:bg-slate-100 rounded-lg transition-colors"
          >
            Hide Diagram
          </button>
        </div>
      </div>

      {/* Interactive Topology Graph Visual */}
      <div className="mt-5 p-4 sm:p-6 bg-[#0f172a] rounded-xl relative overflow-hidden text-slate-100">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Central Hub & Satellite nodes */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Top Node: FortiGate SD-WAN Central Hub */}
          <div className="flex flex-col items-center mb-6">
            <div className="px-4 py-2 bg-indigo-950/90 border border-indigo-500/50 rounded-xl shadow-lg flex items-center gap-3">
              <Cloud className="w-6 h-6 text-indigo-400" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-white">
                    FortiGate SD-WAN Central Orchestrator
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono bg-indigo-500/30 text-indigo-200 rounded">
                    HA Cluster
                  </span>
                </div>
                <div className="text-[10px] font-mono text-indigo-300">
                  Primary Routing Matrix · BGP AS 64512 · 0% Loss
                </div>
              </div>
            </div>
            {/* Animated Connector Line */}
            <div className="h-6 w-0.5 bg-indigo-500/60 relative">
              <span className="absolute -left-1 top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
            </div>
          </div>

          {/* Core DC Node */}
          <div className="mb-6 w-full max-w-md">
            <div className="p-3.5 bg-slate-900/90 border-2 border-emerald-500/60 rounded-xl shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white">Apex HQ (Core DC)</span>
                    <span className="px-1.5 text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded">
                      LOC-CORP-01
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    CIDR: 10.14.0.0/18 · Dual 1Gbps Fiber
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                  {pingOffsets['loc-corp-01'] || hq?.pingMs || 4}ms
                </div>
                <div className="text-[10px] text-slate-400">0.0% loss</div>
              </div>
            </div>
          </div>

          {/* Three Branch Nodes in a responsive row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-2 border-t border-slate-800">
            {/* Factory Building A */}
            <div className="p-3 bg-slate-900/80 border border-slate-700 hover:border-indigo-400 rounded-xl transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">
                    LOC-FCT-01
                  </span>
                  <h4 className="font-semibold text-xs text-white mt-1">Factory Building A</h4>
                  <div className="text-[10px] font-mono text-slate-400">10.14.20.0/20</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {pingOffsets['loc-fct-01'] || factoryA?.pingMs || 12}ms
                  </span>
                  <div className="text-[9px] text-slate-400">500M Metro-E</div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">12 IDF Cabinets</span>
                <span className="text-emerald-400 font-medium">Tunnel Synced</span>
              </div>
            </div>

            {/* Factory Building B (With Jitter alert) */}
            <div className="p-3 bg-slate-900/80 border-2 border-amber-500/70 rounded-xl shadow-amber-950/30 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-500/40 rounded">
                      LOC-FCT-02
                    </span>
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                  </div>
                  <h4 className="font-semibold text-xs text-white mt-1">Factory Building B</h4>
                  <div className="text-[10px] font-mono text-amber-300/80">10.14.40.0/20</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {pingOffsets['loc-fct-02'] || factoryB?.pingMs || 18}ms
                  </span>
                  <div className="text-[9px] text-amber-400">Jitter: 7.4ms</div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-amber-300/90">VLAN 40 Degraded</span>
                <span className="text-amber-400 font-medium">Re-indexing</span>
              </div>
            </div>

            {/* Central Warehouse */}
            <div className="p-3 bg-slate-900/80 border border-slate-700 hover:border-indigo-400 rounded-xl transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">
                    LOC-WHSE-01
                  </span>
                  <h4 className="font-semibold text-xs text-white mt-1">Central Warehouse</h4>
                  <div className="text-[10px] font-mono text-slate-400">10.14.60.0/21</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {pingOffsets['loc-whse-01'] || warehouse?.pingMs || 8}ms
                  </span>
                  <div className="text-[9px] text-slate-400">200M Fiber</div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">18 APs High-Bay</span>
                <span className="text-emerald-400 font-medium">Tunnel Synced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

