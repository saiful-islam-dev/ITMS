import React, { useState } from 'react';
import { Activity, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';

interface SystemStatusIndicatorProps {
  onPingAll?: () => void;
  onOpenHelp?: () => void;
}

export const SystemStatusIndicator: React.FC<SystemStatusIndicatorProps> = ({
  onPingAll,
  onOpenHelp
}) => {
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingTime, setLastPingTime] = useState('Just now');
  const [avgLatency, setAvgLatency] = useState(14);

  const triggerPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      const simulated = Math.floor(Math.random() * 6) + 11; // 11-16ms
      setAvgLatency(simulated);
      setIsPinging(false);
      setLastPingTime('Just now');
      if (onPingAll) onPingAll();
    }, 600);
  };

  return (
    <div className="p-3 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]" />
          </span>
          <div>
            <h4 className="text-xs font-semibold text-[#131b2e] leading-tight">
              All Systems Live
            </h4>
            <p className="text-[10px] text-[#464555] font-mono">
              SD-WAN Mesh: 4/4 Tunnels
            </p>
          </div>
        </div>
        <button
          onClick={triggerPing}
          title="Run quick ping sweep across all campuses"
          disabled={isPinging}
          className="p-1.5 text-[#3525cd] hover:bg-[#eaedff] rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#dae2fd]/70 text-[#464555]">
        <span className="flex items-center gap-1 font-mono">
          <Activity className="w-3 h-3 text-[#10b981]" />
          <span className="tabular-nums font-semibold text-[#131b2e]">{avgLatency}ms</span> avg
        </span>
        <button
          onClick={onOpenHelp}
          className="flex items-center gap-1 text-[#4f46e5] hover:text-[#3730a3] transition-colors"
        >
          <HelpCircle className="w-3 h-3" />
          <span>Help & Docs</span>
        </button>
      </div>
    </div>
  );
};

