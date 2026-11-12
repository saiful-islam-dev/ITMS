import React, { useState } from 'react';
import {
  X,
  HardDrive,
  Search,
  Server,
  Laptop,
  Printer,
  Wifi,
  Cpu,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Facility, ITAsset } from '../../types';
import { mockAssets } from '../../data/mockAssets';

interface FacilityAssetsDrawerProps {
  isOpen: boolean;
  facility: Facility | null;
  onClose: () => void;
}

export const FacilityAssetsDrawer: React.FC<FacilityAssetsDrawerProps> = ({
  isOpen,
  facility,
  onClose
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pingingAssetId, setPingingAssetId] = useState<string | null>(null);

  if (!isOpen || !facility) return null;

  const facilityAssets = mockAssets.filter((a) => a.facilityId === facility.id);

  const filteredAssets = facilityAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(search.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      asset.ipAddress.includes(search);
    const matchesCat =
      selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handlePingDevice = (id: string) => {
    setPingingAssetId(id);
    setTimeout(() => {
      setPingingAssetId(null);
    }, 600);
  };

  const getCategoryIcon = (category: ITAsset['category']) => {
    switch (category) {
      case 'Workstation':
      case 'Laptop':
        return Laptop;
      case 'Server':
      case 'Switch':
        return Server;
      case 'Printer/Scanner':
        return Printer;
      case 'Access Point':
        return Wifi;
      default:
        return Cpu;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-level-3 z-10 flex flex-col border-l border-[#cbd5e1] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#f1f5f9] flex items-start justify-between bg-[#fbfbff]">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#eaedff] text-[#3525cd] rounded-xl mt-0.5">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#131b2e]">
                  {facility.name} — Hardware Inventory
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-[#eaedff] text-[#3525cd] rounded border border-[#dae2fd]">
                  {facility.code}
                </span>
              </div>
              <p className="text-xs text-[#777587] mt-0.5">
                {facility.activeFleetCount} Cataloged Hardware Units · Subnet {facility.subnet}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777587] hover:text-[#131b2e] hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-[#f1f5f9] space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#777587]" />
            <input
              type="text"
              placeholder="Search by tag (APX-...), serial, device name, or IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'Workstation', 'Laptop', 'Server', 'Switch', 'Printer/Scanner', 'IoT/Terminal', 'Access Point'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#3525cd] text-white font-semibold'
                    : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
                }`}
              >
                {cat === 'all' ? 'All Devices' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Assets List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12 text-[#777587] text-xs">
              No devices match your search filter in this facility.
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const Icon = getCategoryIcon(asset.category);
              const isPinging = pingingAssetId === asset.id;
              return (
                <div
                  key={asset.id}
                  className="p-4 bg-white border border-[#e2e8f0] hover:border-[#c7c4d8] rounded-xl shadow-xs transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 bg-[#f2f3ff] text-[#3525cd] rounded-lg mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-[#131b2e]">
                            {asset.name}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#eaedff] text-[#3525cd] rounded border border-[#dae2fd]">
                            {asset.assetTag}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#464555] mt-0.5">
                          {asset.locationDetail} · {asset.department}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        asset.status === 'active'
                          ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                          : 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]'
                      }`}
                    >
                      {asset.status === 'active' ? 'Active' : 'Maintenance'}
                    </span>
                  </div>

                  {/* Spec notes if any */}
                  {asset.specNotes && (
                    <div className="p-2 bg-[#fbfbff] rounded text-[11px] font-mono text-[#5b598c] border border-slate-100">
                      {asset.specNotes}
                    </div>
                  )}

                  {/* Telemetry bottom row */}
                  <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 font-mono text-[11px] text-[#464555]">
                      <span>IP: <strong className="text-[#131b2e]">{asset.ipAddress}</strong></span>
                      <span className="hidden sm:inline">MAC: {asset.macAddress}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#777587]">
                        {asset.lastPing}
                      </span>
                      <button
                        onClick={() => handlePingDevice(asset.id)}
                        disabled={isPinging}
                        className="p-1 text-[#3525cd] hover:bg-[#eaedff] rounded transition-colors"
                        title="Send ICMP Ping packet"
                      >
                        <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#f1f5f9] bg-[#fbfbff] flex items-center justify-between text-xs">
          <span className="text-[#777587]">
            Showing {filteredAssets.length} of {facilityAssets.length} devices
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#cbd5e1] hover:bg-slate-50 text-[#131b2e] font-semibold rounded-lg shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

