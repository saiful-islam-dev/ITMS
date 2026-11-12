import React, { useState, useMemo } from 'react';
import {
  HardDrive,
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Server,
  Laptop,
  Printer,
  Wifi,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { ITAsset, Facility } from '../../types';
import { mockAssets } from '../../data/mockAssets';

interface ITAssetsScreenProps {
  facilities: Facility[];
  onOpenTerminal?: (facility: Facility) => void;
}

export const ITAssetsScreen: React.FC<ITAssetsScreenProps> = ({
  facilities,
  onOpenTerminal
}) => {
  const [search, setSearch] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pingingAssetId, setPingingAssetId] = useState<string | null>(null);

  const categories = [
    'all',
    'Workstation',
    'Laptop',
    'Server',
    'Switch',
    'Printer/Scanner',
    'IoT/Terminal',
    'Access Point'
  ];

  const filteredAssets = useMemo(() => {
    return mockAssets.filter((asset) => {
      if (selectedCampus !== 'all' && asset.facilityId !== selectedCampus) {
        return false;
      }
      if (selectedCategory !== 'all' && asset.category !== selectedCategory) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTag = asset.assetTag.toLowerCase().includes(q);
        const matchesSerial = asset.serialNumber.toLowerCase().includes(q);
        const matchesName = asset.name.toLowerCase().includes(q);
        const matchesIp = asset.ipAddress.includes(q);
        const matchesAssignee = asset.assignedTo?.toLowerCase().includes(q);
        if (!matchesTag && !matchesSerial && !matchesName && !matchesIp && !matchesAssignee) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCampus, selectedCategory, search]);

  const handlePing = (id: string) => {
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-[#131b2e] tracking-tight">
              Enterprise IT Asset Inventory
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#eaedff] text-[#3525cd] rounded-full border border-[#dae2fd]">
              864 FLEET UNITS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#464555] mt-1">
            Complete hardware ledger across Pattern Studios, Sewing Floors, Chemical Wash Plants, and High-Bay Logistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csvContent =
                'Asset Tag,Serial Number,Device Name,Category,Campus,IP Address,Status\n' +
                filteredAssets
                  .map(
                    (a) =>
                      `"${a.assetTag}","${a.serialNumber}","${a.name}","${a.category}","${a.facilityName}","${a.ipAddress}","${a.status}"`
                  )
                  .join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'it_assets_export.csv';
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-[#131b2e] border border-[#cbd5e1] rounded-lg shadow-level-1 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#5b598c]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-3 shadow-level-1 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#777587]" />
            <input
              type="text"
              placeholder="Search by tag, serial (SN-...), IP, or device model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none"
            />
          </div>

          {/* Campus Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#777587] font-medium hidden md:inline">
              Campus:
            </span>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="px-3 py-2 text-xs bg-[#f2f3ff] text-[#131b2e] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none font-medium"
            >
              <option value="all">All Campuses (Dhaka & Gazipur)</option>
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} ({fac.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-[#f1f5f9]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#3525cd] text-white font-semibold'
                  : 'bg-[#eaedff]/60 text-[#464555] hover:bg-[#eaedff]'
              }`}
            >
              {cat === 'all' ? 'All Hardware Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-level-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-[#e2e8f0] text-[11px] font-semibold text-[#777587] uppercase tracking-wider">
                <th className="py-3 px-4">Asset Tag & Device</th>
                <th className="py-3 px-4">Serial Number</th>
                <th className="py-3 px-4">Campus & Location</th>
                <th className="py-3 px-4">IP / MAC Address</th>
                <th className="py-3 px-4">Assigned User / Dept</th>
                <th className="py-3 px-4">Status & Health</th>
                <th className="py-3 px-4 text-right">Ping Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#777587]">
                    No hardware assets matched your criteria.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const Icon = getCategoryIcon(asset.category);
                  const isPinging = pingingAssetId === asset.id;
                  return (
                    <tr key={asset.id} className="hover:bg-[#f8f9fe] transition-colors">
                      {/* Asset Tag & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 bg-[#eaedff] text-[#3525cd] rounded-md shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#131b2e]">{asset.name}</div>
                            <span className="font-mono text-[10px] text-[#3525cd] px-1.5 py-0.2 bg-[#eaedff] rounded border border-[#dae2fd]">
                              {asset.assetTag}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Serial Number */}
                      <td className="py-3.5 px-4 font-mono text-[#464555]">
                        <div>{asset.serialNumber}</div>
                        <div className="text-[10px] text-[#777587]">
                          Warranty: {asset.warrantyExpires}
                        </div>
                      </td>

                      {/* Campus & Location */}
                      <td className="py-3.5 px-4 text-[#464555]">
                        <div className="font-medium text-[#131b2e]">{asset.facilityCode}</div>
                        <div className="text-[10px] text-[#777587] truncate max-w-[170px]">
                          {asset.locationDetail}
                        </div>
                      </td>

                      {/* IP / MAC */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-semibold text-[#131b2e]">{asset.ipAddress}</div>
                        <div className="text-[10px] text-[#777587]">{asset.macAddress}</div>
                      </td>

                      {/* Assigned User */}
                      <td className="py-3.5 px-4 text-[#464555]">
                        <div className="truncate max-w-[150px] font-medium text-[#131b2e]">
                          {asset.assignedTo || 'Unassigned / Shared'}
                        </div>
                        <div className="text-[10px] text-[#777587]">{asset.department}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            asset.status === 'active'
                              ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                              : 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              asset.status === 'active' ? 'bg-[#10b981]' : 'bg-[#f59e0b]'
                            }`}
                          />
                          <span>{asset.status === 'active' ? 'Active' : 'Maintenance'}</span>
                        </span>
                        <div className="text-[10px] font-mono text-[#777587] mt-0.5">
                          {asset.lastPing}
                        </div>
                      </td>

                      {/* Ping Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handlePing(asset.id)}
                          disabled={isPinging}
                          className="p-1.5 text-[#3525cd] hover:bg-[#eaedff] rounded-md transition-colors"
                          title="ICMP Ping Check"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

