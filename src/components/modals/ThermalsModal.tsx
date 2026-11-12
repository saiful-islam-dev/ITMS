import React, { useState } from 'react';
import {
  X,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  CheckCircle2,
  BellOff,
  Flame,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { Facility } from '../../types';

interface ThermalsModalProps {
  isOpen: boolean;
  facility: Facility | null;
  onClose: () => void;
  onDispatched?: () => void;
}

export const ThermalsModal: React.FC<ThermalsModalProps> = ({
  isOpen,
  facility,
  onClose,
  onDispatched
}) => {
  const [auxFanActive, setAuxFanActive] = useState(false);
  const [buzzerSilenced, setBuzzerSilenced] = useState(false);
  const [tempOverride, setTempOverride] = useState<number | null>(null);

  if (!isOpen || !facility) return null;

  const therm = facility.thermalData || {
    tempC: 22.5,
    humidity: 45,
    status: 'normal',
    idfCabinet: 'MAIN-RACK-01',
    moistureDetected: false,
    fanSpeedRpm: 3200,
    ambientMaxC: 28,
    lastReading: 'Live'
  };

  const currentTemp = tempOverride !== null ? tempOverride : therm.tempC;
  const isAlert = currentTemp > 30 || therm.moistureDetected;

  const triggerAuxFan = () => {
    setAuxFanActive(true);
    setTimeout(() => {
      setTempOverride(28.4);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white border border-[#cbd5e1] rounded-2xl w-full max-w-lg shadow-level-3 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#f1f5f9] flex items-start justify-between bg-[#fbfbff]">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                isAlert ? 'bg-red-100 text-red-600' : 'bg-[#eaedff] text-[#3525cd]'
              }`}
            >
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#131b2e]">
                  IDF Environmental Telemetry & Sensors
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-[#eaedff] text-[#3525cd] rounded border border-[#dae2fd]">
                  {facility.code}
                </span>
              </div>
              <p className="text-xs text-[#464555] mt-0.5">
                Monitoring cabinet: <strong className="font-mono text-[#131b2e]">{therm.idfCabinet}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777587] hover:text-[#131b2e] hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Banner if alert */}
        {isAlert && (
          <div className="bg-[#fff1f2] border-b border-[#fecdd3] p-3.5 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#e11d48] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-[#9f1239]">
                ENVIRONMENTAL ALERT: Moisture & Elevated Heat Detected
              </span>
              <p className="text-[#9f1239]/90 mt-0.5">
                Chemical hall humidity condensation is triggering optical leakage sensors in rack {therm.idfCabinet}.
              </p>
            </div>
          </div>
        )}

        {/* Sensors Grid */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {/* Temp Gauge */}
            <div className="p-3.5 bg-[#f8f9fe] border border-[#e2e8f0] rounded-xl text-center">
              <div className="flex justify-center text-[#e11d48] mb-1">
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#131b2e] tabular-nums">
                {currentTemp}°C
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#777587] mt-0.5">
                Rack Temp
              </div>
              <div className="text-[10px] text-[#777587] mt-1 font-mono">
                Threshold: {therm.ambientMaxC}°C
              </div>
            </div>

            {/* Humidity */}
            <div className="p-3.5 bg-[#f8f9fe] border border-[#e2e8f0] rounded-xl text-center">
              <div className="flex justify-center text-sky-600 mb-1">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#131b2e] tabular-nums">
                {therm.humidity}%
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#777587] mt-0.5">
                Rel. Humidity
              </div>
              <div className="text-[10px] text-[#777587] mt-1 font-mono">
                {therm.moistureDetected ? (
                  <span className="text-[#e11d48] font-bold">Condensation</span>
                ) : (
                  'Normal Dry'
                )}
              </div>
            </div>

            {/* Fan Speed */}
            <div className="p-3.5 bg-[#f8f9fe] border border-[#e2e8f0] rounded-xl text-center">
              <div className="flex justify-center text-indigo-600 mb-1">
                <Wind className={`w-5 h-5 ${auxFanActive ? 'animate-spin' : ''}`} />
              </div>
              <div className="text-2xl font-bold font-mono text-[#131b2e] tabular-nums">
                {auxFanActive ? 5200 : therm.fanSpeedRpm}
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#777587] mt-0.5">
                Fan RPM
              </div>
              <div className="text-[10px] text-[#777587] mt-1 font-mono">
                {auxFanActive ? 'Aux Boost 100%' : 'Auto PID Mode'}
              </div>
            </div>
          </div>

          {/* Diagnostics Detail Box */}
          <div className="p-3 bg-[#f1f5f9]/70 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-[#464555]">
              <span>Ingress Protection Standard:</span>
              <span className="font-mono font-semibold text-[#131b2e]">NEMA 4X / IP65 Sealed</span>
            </div>
            <div className="flex justify-between text-[#464555]">
              <span>Silica Gel Dehumidifier Cartridge:</span>
              <span className="font-mono text-[#b45309]">Saturated (Replace needed)</span>
            </div>
            <div className="flex justify-between text-[#464555]">
              <span>Primary Airflow Exhaust:</span>
              <span className="font-mono text-[#065f46]">Dual 120mm NMB Ball-Bearing</span>
            </div>
            <div className="flex justify-between text-[#464555]">
              <span>Last SNMP Trap Received:</span>
              <span className="font-mono text-[#777587]">{therm.lastReading}</span>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={triggerAuxFan}
              disabled={auxFanActive}
              className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                auxFanActive
                  ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                  : 'bg-[#3525cd] hover:bg-[#3730a3] text-white border-transparent shadow-xs'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{auxFanActive ? 'Aux Cooling Booster Active (RPM 5200)' : 'Activate Aux Cooling Fan'}</span>
            </button>

            <button
              onClick={() => setBuzzerSilenced(true)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                buzzerSilenced
                  ? 'bg-slate-100 text-slate-500 border-slate-200'
                  : 'bg-white hover:bg-slate-50 text-[#131b2e] border-[#cbd5e1]'
              }`}
            >
              <BellOff className="w-3.5 h-3.5" />
              <span>{buzzerSilenced ? 'Buzzer Silenced' : 'Silence Alarm'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f1f5f9] bg-[#fbfbff] flex items-center justify-between text-xs">
          <span className="text-[#777587]">Field Lead: {facility.leadEngineer.name}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#cbd5e1] hover:bg-slate-50 text-[#131b2e] font-semibold rounded-lg shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

