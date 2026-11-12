import React, { useState } from 'react';
import { X, Building2, Server, MapPin, Network, UserCheck, Check } from 'lucide-react';
import { Facility, FacilityType } from '../../types';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFacility: (newFacility: Facility) => void;
}

export const AddLocationModal: React.FC<AddLocationModalProps> = ({
  isOpen,
  onClose,
  onAddFacility
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<FacilityType>('manufacturing');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Gazipur');
  const [subnet, setSubnet] = useState('10.14.80.0/20');
  const [leadName, setLeadName] = useState('');
  const [leadRole, setLeadRole] = useState('Field Infrastructure Specialist');
  const [techCount, setTechCount] = useState(3);
  const [uplinks, setUplinks] = useState('300Mbps Dedicated P2P Fiber');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const newFacility: Facility = {
      id: `loc-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      code: code.toUpperCase(),
      name,
      subtitle: subtitle || 'Garment Production & Operations Campus',
      category,
      status: 'healthy',
      statusLabel: 'Operational • 99.95% SLA',
      slaTarget: '99.95%',
      uptimePercent: 99.95,
      address: address || 'Industrial Zone, Gazipur, Bangladesh',
      district,
      pingMs: 14,
      jitterMs: 2.1,
      packetLossPercent: 0.0,
      subnet,
      supernetMask: '255.255.240.0',
      activeFleetCount: 45,
      totalDeviceCapacity: 150,
      serverInfrastructure: '4 IDF Cabinets (Dual Fiber)',
      wirelessAps: 12,
      hardwareTags: [
        'Zebra Barcode Fleet',
        'Aruba Switches',
        'Rugged Tablets',
        'CCTV Surveillance'
      ],
      leadEngineer: {
        name: leadName || 'Tanvir Hossain',
        role: leadRole,
        avatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        techCount: Number(techCount) || 3,
        email: `${(leadName || 'engineer').toLowerCase().replace(/\s+/g, '.')}@apexgarments.com`
      },
      openTicketsCount: 0,
      criticalTicketsCount: 0,
      image:
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=1200&auto=format&fit=crop&q=80',
      uplinks,
      secondaryUplink: 'LTE Cellular Failover',
      leasedIps: 112,
      totalIps: 4094,
      thermalData: {
        tempC: 23.5,
        humidity: 45,
        status: 'normal',
        idfCabinet: 'MAIN-IDF-01',
        moistureDetected: false,
        fanSpeedRpm: 3100,
        ambientMaxC: 28,
        lastReading: 'Provisioning initial telemetry'
      }
    };

    onAddFacility(newFacility);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white border border-[#cbd5e1] rounded-2xl w-full max-w-xl shadow-level-3 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-[#f1f5f9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#eaedff] text-[#3525cd] rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#131b2e]">
                Provision New Facility / Campus
              </h2>
              <p className="text-xs text-[#777587]">
                Connect a new plant, warehouse or office into the Apex ITMS SD-WAN mesh.
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Facility Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Factory Building C"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] focus:bg-white border border-transparent focus:border-[#4f46e5] rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Campus Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. LOC-FCT-03"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs font-mono bg-[#f2f3ff] focus:bg-white border border-transparent focus:border-[#4f46e5] rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-1">
              Operational Subtitle / Role
            </label>
            <input
              type="text"
              placeholder="e.g. High-Speed Embroidery & Finishing Unit"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#f2f3ff] focus:bg-white border border-transparent focus:border-[#4f46e5] rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Facility Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FacilityType)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] focus:bg-white border border-transparent focus:border-[#4f46e5] rounded-lg outline-none"
              >
                <option value="manufacturing">Manufacturing Plant</option>
                <option value="warehouse">Warehouse & Logistics Hub</option>
                <option value="corporate">Corporate / Design Studio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                District / Region
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] focus:bg-white border border-transparent focus:border-[#4f46e5] rounded-lg outline-none"
              >
                <option value="Gazipur">Gazipur Industrial Zone</option>
                <option value="Dhaka">Dhaka Metropolitan</option>
                <option value="Savar">Savar EPZ Corridor</option>
                <option value="Narayanganj">Narayanganj Port Area</option>
                <option value="Chattogram">Chattogram Port Logistics</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-1">
              Physical Street Address
            </label>
            <input
              type="text"
              placeholder="e.g. Plot 88, Kashimpur Industrial Belt, Gazipur"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#f2f3ff] focus:bg-white border border-transparent focus:border-[#4f46e5] rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Assigned Subnet (CIDR)
              </label>
              <input
                type="text"
                placeholder="10.14.80.0/20"
                value={subnet}
                onChange={(e) => setSubnet(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#f2f3ff] focus:bg-white border border-transparent focus:border-[#4f46e5] rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Primary Uplink Provider
              </label>
              <input
                type="text"
                placeholder="300Mbps Dedicated P2P Fiber"
                value={uplinks}
                onChange={(e) => setUplinks(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] focus:bg-white border border-transparent focus:border-[#4f46e5] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Lead Site Engineer
              </label>
              <input
                type="text"
                placeholder="e.g. Tanvir Hossain"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f2f3ff] focus:bg-white border border-transparent focus:border-[#4f46e5] rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Support Technicians Count
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={techCount}
                onChange={(e) => setTechCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#f2f3ff] focus:bg-white border border-transparent focus:border-[#4f46e5] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#464555] hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#4f46e5] hover:bg-[#3730a3] text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Register & Provision Facility</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

