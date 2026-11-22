'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Barcode,
  QrCode,
  Calendar,
  Building2,
  FileText,
  MapPin,
  Network,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ShieldCheck,
  Link as LinkIcon,
  Check,
  Cpu
} from 'lucide-react';
import { ITAsset, Facility } from '../../types';

interface RegisterAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: Facility[];
  onRegisterAsset: (newAsset: ITAsset) => void;
}

export const RegisterAssetModal: React.FC<RegisterAssetModalProps> = ({
  isOpen,
  onClose,
  facilities,
  onRegisterAsset
}) => {
  // Section 1: Core Identity
  const [assetTrackingId, setAssetTrackingId] = useState('AST-8925');
  const [serialNumber, setSerialNumber] = useState('SN-4820199025-GB');
  const [assetFormalName, setAssetFormalName] = useState(
    'Zebra ZT410 Industrial Thermal Barcode Printer'
  );
  const [equipmentCategory, setEquipmentCategory] = useState('Industrial Label Printer');
  const [brand, setBrand] = useState('Zebra Technologies');
  const [modelRevision, setModelRevision] = useState('ZT410 (300 dpi Ethernet)');
  const [isScanning, setIsScanning] = useState(false);

  // Section 2: Procurement & Warranty
  const [purchaseDate, setPurchaseDate] = useState('2025-05-18');
  const [acquisitionCost, setAcquisitionCost] = useState('185,000');
  const [vendor, setVendor] = useState('Flora Systems Ltd.');
  const [warrantyExpiry, setWarrantyExpiry] = useState('2028-05-18');
  const [attachedInvoice, setAttachedInvoice] = useState<string | null>('delivery_challan_8925.pdf');
  const [tags, setTags] = useState<string[]>(['Factory Critical', 'Line Automation']);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Section 3: Custody & Location
  const [lifecycleStatus, setLifecycleStatus] = useState<ITAsset['status']>('active');
  const [custodian, setCustodian] = useState('Kabir Hossain (EMP-3114) — Line 08 Supervisor');
  const [manufacturingComplex, setManufacturingComplex] = useState(
    'Gazipur Plant Complex (Plant A)'
  );
  const [floorStation, setFloorStation] = useState('Floor 2 — Sewing Line 08 (Station D)');
  const [linkedDepartment, setLinkedDepartment] = useState('Cutting & Sewing Ops (DPT-002)');
  const [isVlanEnabled, setIsVlanEnabled] = useState(true);
  const [macAddress, setMacAddress] = useState('00:1B:44:11:3A:B7');
  const [staticIp, setStaticIp] = useState('10.14.88.42');
  const [vlanSubnet, setVlanSubnet] = useState('Industrial-VLAN-10');

  if (!isOpen) return null;

  // Validation: 6 mandatory fields
  const isSerialValid = Boolean(serialNumber.trim());
  const isNameValid = Boolean(assetFormalName.trim());
  const isCategoryValid = Boolean(equipmentCategory.trim());
  const isPurchaseDateValid = Boolean(purchaseDate.trim());
  const isStatusValid = Boolean(lifecycleStatus);
  const isCustodianValid = Boolean(custodian.trim());

  const mandatoryEntries = [
    isSerialValid,
    isNameValid,
    isCategoryValid,
    isPurchaseDateValid,
    isStatusValid,
    isCustodianValid
  ];
  const verifiedCount = mandatoryEntries.filter(Boolean).length;
  const isAllMandatoryVerified = verifiedCount === 6;

  // Simulate Barcode Scanner
  const handleScanBarcode = () => {
    setIsScanning(true);
    setTimeout(() => {
      const generatedSerial = `SN-${Math.floor(1000000000 + Math.random() * 9000000000)}-GB`;
      setSerialNumber(generatedSerial);
      setIsScanning(false);
    }, 800);
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Submit / Build Asset Object
  const buildAssetObject = (): ITAsset => {
    const selectedFacility = facilities.find((f) =>
      manufacturingComplex.toLowerCase().includes(f.name.toLowerCase().split(' ')[0])
    ) || {
      id: 'loc-fct-01',
      name: manufacturingComplex,
      code: 'LOC-FCT-01'
    };

    return {
      id: `ast-${Date.now()}`,
      assetTag: assetTrackingId,
      serialNumber,
      name: assetFormalName,
      category: equipmentCategory as any,
      facilityId: selectedFacility.id,
      facilityCode: (selectedFacility as any).code || 'LOC-FCT-01',
      facilityName: manufacturingComplex,
      locationDetail: floorStation,
      assignedTo: custodian,
      department: linkedDepartment,
      ipAddress: isVlanEnabled ? staticIp : '10.14.88.199',
      macAddress,
      status: lifecycleStatus,
      lastPing: 'Just now (1.4ms)',
      purchaseDate,
      warrantyExpires: warrantyExpiry,
      specNotes: `${brand} ${modelRevision} • Tagged: ${tags.join(', ')}`,
      brand,
      modelRevision,
      costBdt: Number(acquisitionCost.replace(/,/g, '')) || 185000,
      vendor,
      attachedInvoice: attachedInvoice || undefined,
      tags,
      vlanSubnet: isVlanEnabled ? vlanSubnet : undefined
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAllMandatoryVerified) return;

    const newAsset = buildAssetObject();
    onRegisterAsset(newAsset);
    onClose();
  };

  const handleSaveAndAddAnother = () => {
    if (!isAllMandatoryVerified) return;

    const newAsset = buildAssetObject();
    onRegisterAsset(newAsset);

    // Reset with new ID
    const nextIdNum = parseInt(assetTrackingId.replace(/\D/g, '')) + 1;
    setAssetTrackingId(`AST-${nextIdNum}`);
    setSerialNumber(`SN-${Math.floor(1000000000 + Math.random() * 9000000000)}-GB`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white border border-[#c7c4d8]/70 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-150">
        {/* Sticky Header Bar */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] bg-[#faf8ff] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3525cd] text-white flex items-center justify-center shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#131b2e]">
                  Register Hardware Asset
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#eaedff] text-[#3525cd] rounded">
                  {assetTrackingId}
                </span>
              </div>
              <p className="text-xs text-[#777587]">
                Onboard industrial telemetry device or terminal into Apex Garments ITMS fleet ledger
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#777587] hover:text-[#131b2e] hover:bg-[#eaedff] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* SECTION 1: ASSET CORE IDENTITY */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Asset Tracking ID */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#131b2e]">
                    Asset Tracking ID
                  </label>
                  <span className="text-[11px] font-medium text-[#777587]">
                    System Auto
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={assetTrackingId}
                    onChange={(e) => setAssetTrackingId(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs font-mono font-bold bg-[#f2f3ff] text-[#131b2e] rounded-lg border border-[#dae2fd] outline-none"
                  />
                  <Lock className="w-4 h-4 absolute right-3 top-3 text-[#777587]" />
                </div>
              </div>

              {/* Hardware Serial No. (S/N) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#131b2e]">
                    Hardware Serial No. (S/N) *
                  </label>
                  <span className="text-[11px] font-medium text-[#777587]">
                    OEM chassis label
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Barcode className="w-4 h-4 absolute left-3 top-3 text-[#777587]" />
                    <input
                      type="text"
                      required
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder="SN-XXXXX-GB"
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-mono bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none"
                    />
                  </div>

                  {/* Scan Barcode Button */}
                  <button
                    type="button"
                    onClick={handleScanBarcode}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#3525cd] bg-[#eaedff] hover:bg-[#dae2fd] border border-[#dae2fd] rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    <QrCode className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    <span>{isScanning ? 'Scanning...' : 'Scan Barcode'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Asset Formal Name */}
            <div>
              <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
                Asset Formal Name *
              </label>
              <input
                type="text"
                required
                value={assetFormalName}
                onChange={(e) => setAssetFormalName(e.target.value)}
                placeholder="e.g. Zebra ZT410 Industrial Thermal Barcode Printer"
                className="w-full px-3.5 py-2.5 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none"
              />
            </div>

            {/* Row 3: Category, Brand, Model */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
                  Equipment Category *
                </label>
                <select
                  value={equipmentCategory}
                  onChange={(e) => setEquipmentCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none font-medium cursor-pointer"
                >
                  <option value="Industrial Label Printer">Industrial Label Printer</option>
                  <option value="Workstation">Enterprise Workstation</option>
                  <option value="Laptop">Laptop / Rugged Tablet</option>
                  <option value="Server">Rackmount Server</option>
                  <option value="Switch">Industrial Ethernet Switch</option>
                  <option value="Access Point">High-Bay AP Cluster</option>
                  <option value="IoT/Terminal">Edge IoT Gateway / PLC</option>
                  <option value="Printer/Scanner">Handheld Scanner / Reader</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
                  Brand / OEM Manufacturer
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Zebra Technologies"
                  className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#131b2e] block mb-1.5">
                  Model & Revision
                </label>
                <input
                  type="text"
                  value={modelRevision}
                  onChange={(e) => setModelRevision(e.target.value)}
                  placeholder="e.g. ZT410 (300 dpi Ethernet)"
                  className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PROCUREMENT & WARRANTY TERMS */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3525cd]" />
                <h4 className="text-xs font-bold text-[#131b2e]">
                  2. Procurement & Warranty Terms
                </h4>
              </div>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-[#eaedff] text-[#3525cd] rounded-full">
                CAPEX FY2025
              </span>
            </div>

            {/* 4-Column Grid: Purchase Date, Cost, Vendor, Warranty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#131b2e] block mb-1.5">
                  Purchase Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full pl-3 pr-2 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#131b2e] block mb-1.5">
                  Acquisition Cost (BDT)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-[#777587]">
                    ৳
                  </span>
                  <input
                    type="text"
                    value={acquisitionCost}
                    onChange={(e) => setAcquisitionCost(e.target.value)}
                    placeholder="185,000"
                    className="w-full pl-7 pr-3 py-2 text-xs bg-white text-[#131b2e] font-mono rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#131b2e] block mb-1.5">
                  Vendor / Supplier
                </label>
                <select
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none font-medium cursor-pointer"
                >
                  <option value="Flora Systems Ltd.">Flora Systems Ltd.</option>
                  <option value="Global Brand Pvt. Ltd.">Global Brand Pvt. Ltd.</option>
                  <option value="Smart Technologies BD">Smart Technologies BD</option>
                  <option value="Daffodil Computers">Daffodil Computers</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#131b2e]">
                    Warranty Expiry
                  </label>
                  <span className="text-[10px] font-bold text-[#3525cd]">
                    36 Mo Coverage
                  </span>
                </div>
                <input
                  type="date"
                  value={warrantyExpiry}
                  onChange={(e) => setWarrantyExpiry(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none"
                />
              </div>
            </div>

            {/* Bottom Row: Attached Invoice + Tags */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#f1f5f9]">
              {/* Attached Challan */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-[#777587]">
                  Attached Invoice / Challan:
                </span>
                {attachedInvoice ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[#f2f3ff] text-[#3525cd] rounded-md border border-[#dae2fd]">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{attachedInvoice}</span>
                    <button
                      type="button"
                      onClick={() => setAttachedInvoice(null)}
                      className="hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAttachedInvoice('delivery_challan_8925.pdf')}
                    className="text-xs text-[#3525cd] hover:underline font-medium"
                  >
                    + Upload Challan
                  </button>
                )}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium bg-[#eaedff] text-[#3525cd] rounded-md border border-[#dae2fd]"
                  >
                    <span>Tag: {tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {isAddingTag ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      autoFocus
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Tag name"
                      className="w-24 px-2 py-0.5 text-[11px] border border-[#3525cd] rounded outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-1.5 py-0.5 text-[11px] bg-[#3525cd] text-white rounded cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingTag(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-[#777587] hover:text-[#131b2e] hover:bg-[#f2f3ff] rounded border border-dashed border-[#c7c4d8] cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Tag</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: CUSTODY & FACTORY FLOOR LOCATION */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#3525cd]" />
                <h4 className="text-xs font-bold text-[#131b2e]">
                  3. Custody & Factory Floor Location
                </h4>
              </div>
              <span className="text-[11px] text-[#777587]">Assign deployment target</span>
            </div>

            {/* Row 1: Lifecycle Status & Custodian */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#131b2e] block mb-1.5">
                  Initial Lifecycle Status *
                </label>
                <select
                  value={lifecycleStatus}
                  onChange={(e) => setLifecycleStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none font-medium cursor-pointer"
                >
                  <option value="active">Assigned to Production Floor</option>
                  <option value="storage">In Storage / Spare</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#131b2e]">
                    Designated Custodian (Employee) *
                  </label>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-[#3525cd]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Badge Holder</span>
                  </div>
                </div>
                <div className="relative">
                  <select
                    value={custodian}
                    onChange={(e) => setCustodian(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none font-medium cursor-pointer"
                  >
                    <option value="Kabir Hossain (EMP-3114) — Line 08 Supervisor">
                      Kabir Hossain (EMP-3114) — Line 08 Supervisor
                    </option>
                    <option value="Tariq Rahman (EMP-1042) — IT Ops Lead">
                      Tariq Rahman (EMP-1042) — IT Ops Lead
                    </option>
                    <option value="Rafiqul Islam (EMP-0921) — Floor Operations Manager">
                      Rafiqul Islam (EMP-0921) — Floor Operations Manager
                    </option>
                    <option value="Farhana Yeasmin (EMP-4402) — Raw Fabric Store Lead">
                      Farhana Yeasmin (EMP-4402) — Raw Fabric Store Lead
                    </option>
                    <option value="Sultan Mahmud (EMP-2490) — Field Hardware Tech">
                      Sultan Mahmud (EMP-2490) — Field Hardware Tech
                    </option>
                  </select>
                  <Check className="w-4 h-4 absolute right-2.5 top-2.5 text-[#3525cd] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Manufacturing Complex, Floor Station, Linked Department */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#131b2e] block mb-1.5">
                  Manufacturing Complex
                </label>
                <select
                  value={manufacturingComplex}
                  onChange={(e) => setManufacturingComplex(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none font-medium cursor-pointer"
                >
                  <option value="Gazipur Plant Complex (Plant A)">
                    Gazipur Plant Complex (Plant A)
                  </option>
                  <option value="Apex HQ & Design Studio">Apex HQ & Design Studio</option>
                  <option value="Factory Building B">Factory Building B</option>
                  <option value="Central Warehouse">Central Warehouse</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#131b2e] block mb-1.5">
                  Floor & Production Station
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#777587]" />
                  <input
                    type="text"
                    value={floorStation}
                    onChange={(e) => setFloorStation(e.target.value)}
                    placeholder="Floor 2 — Sewing Line 08 (Station D)"
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white text-[#131b2e] rounded-lg border border-[#dae2fd] focus:border-[#3525cd] outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#131b2e]">
                    Linked Department
                  </label>
                  <div className="flex items-center gap-1 text-[11px] text-[#777587]">
                    <LinkIcon className="w-3 h-3 text-[#3525cd]" />
                    <span>Auto Resolved</span>
                  </div>
                </div>
                <input
                  type="text"
                  value={linkedDepartment}
                  onChange={(e) => setLinkedDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f2f3ff] text-[#131b2e] font-medium rounded-lg border border-[#dae2fd] outline-none"
                />
              </div>
            </div>

            {/* Bottom Row: Static Industrial VLAN IP Strip */}
            <div className="p-3 bg-[#f2f3ff] border border-[#dae2fd] rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#3525cd] flex items-center justify-center shrink-0">
                  <Network className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#131b2e] block">
                    Assign Static Industrial VLAN IP?
                  </span>
                  <span className="text-[11px] font-mono text-[#777587]">
                    MAC: {macAddress} • Reserved IP {staticIp} (Subnet: {vlanSubnet})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-[#131b2e]">
                  {isVlanEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVlanEnabled}
                    onChange={(e) => setIsVlanEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3525cd]" />
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Sticky Footer Bar */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#faf8ff] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-xs">
            {isAllMandatoryVerified ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-[#464555] font-medium">
                  All mandatory entries (6/6) verified • Ready for submission
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800 font-medium">
                  Mandatory entries ({verifiedCount}/6) verified • Please fill required fields
                </span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#464555] hover:text-[#131b2e] bg-white border border-[#c7c4d8] hover:bg-[#f2f3ff] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isAllMandatoryVerified}
              onClick={handleSaveAndAddAnother}
              className="px-4 py-2 text-xs font-semibold text-[#3525cd] bg-[#eaedff] hover:bg-[#dae2fd] border border-[#dae2fd] rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Save & Add Another
            </button>

            <button
              type="button"
              disabled={!isAllMandatoryVerified}
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#312e81] rounded-lg transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Register Asset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
