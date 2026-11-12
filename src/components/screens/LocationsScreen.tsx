import React, { useState, useMemo } from 'react';
import {
  Plus,
  Download,
  Building,
  Activity,
  HardDrive,
  Users,
  LayoutGrid,
  List,
  Network,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Facility, FacilityType } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { TabFilter, TabOption } from '../common/TabFilter';
import { SearchBar } from '../common/SearchBar';
import { FacilityGrid } from '../facilities/FacilityGrid';
import { FacilityTableView } from '../facilities/FacilityTableView';
import { NetworkTopologyDrawer } from '../facilities/NetworkTopologyDrawer';
import { SubnetUtilizationStrip } from '../facilities/SubnetUtilizationStrip';

interface LocationsScreenProps {
  facilities: Facility[];
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  onManageAssets: (facility: Facility) => void;
  onOpenTerminal: (facility: Facility) => void;
  onOpenThermals: (facility: Facility) => void;
  onOpenTickets: (facility: Facility) => void;
  onHotlineClick: () => void;
  onNavigateToScreen: (screen: any) => void;
}

export const LocationsScreen: React.FC<LocationsScreenProps> = ({
  facilities,
  onOpenAddModal,
  onOpenExportModal,
  onManageAssets,
  onOpenTerminal,
  onOpenThermals,
  onOpenTickets,
  onHotlineClick,
  onNavigateToScreen
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FacilityType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'maintenance' | 'operational'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isTopologyOpen, setIsTopologyOpen] = useState(false);

  // Tab counts
  const categoryTabs: TabOption[] = useMemo(() => {
    const manufacturingCount = facilities.filter((f) => f.category === 'manufacturing').length;
    const warehouseCount = facilities.filter((f) => f.category === 'warehouse').length;
    const corporateCount = facilities.filter((f) => f.category === 'corporate').length;

    return [
      { id: 'all', label: 'All Facilities', count: facilities.length },
      { id: 'manufacturing', label: 'Manufacturing Plants', count: manufacturingCount },
      { id: 'warehouse', label: 'Warehouses & Logistics', count: warehouseCount },
      { id: 'corporate', label: 'Corporate & Design HQ', count: corporateCount }
    ];
  }, [facilities]);

  // Filtered facilities list
  const filteredFacilities = useMemo(() => {
    return facilities.filter((f) => {
      // Category filter
      if (selectedCategory !== 'all' && f.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter === 'critical') {
        if (f.criticalTicketsCount === 0 && f.status !== 'critical') return false;
      } else if (statusFilter === 'maintenance') {
        if (f.status !== 'maintenance' && f.status !== 'warning') return false;
      } else if (statusFilter === 'operational') {
        if (f.status !== 'healthy' && f.status !== 'operational') return false;
      }

      // Search query filter (name, code, subnet, lead engineer, address)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(query);
        const matchesCode = f.code.toLowerCase().includes(query);
        const matchesSubnet = f.subnet.toLowerCase().includes(query);
        const matchesLead = f.leadEngineer.name.toLowerCase().includes(query);
        const matchesAddress = f.address.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesSubnet && !matchesLead && !matchesAddress) {
          return false;
        }
      }

      return true;
    });
  }, [facilities, selectedCategory, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header Sub-bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-[#131b2e] tracking-tight">
              Location & Facility Management
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-bold font-mono bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>{facilities.length} SITES LIVE</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#464555] mt-1 max-w-3xl">
            Manage physical plants, logistics warehouses, edge subnets, and local IT field engineers across Dhaka and Gazipur operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-[#131b2e] border border-[#cbd5e1] rounded-lg shadow-level-1 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#5b598c]" />
            <span>Export Facility Report</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#4f46e5] hover:bg-[#3730a3] text-white rounded-lg shadow-level-1 hover:shadow-level-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Location</span>
          </button>
        </div>
      </div>

      {/* Executive 4-Card KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Facilities"
          value={`${facilities.length} Active Campuses`}
          secondaryValue="100% Operational Status"
          subtext="Dhaka • Gazipur"
          tag="All Monitored"
          tagVariant="success"
          icon={Building}
          iconBg="bg-[#eaedff]"
          iconColor="text-[#3525cd]"
        />

        <MetricCard
          title="Connectivity & Uptime"
          value="99.85%"
          secondaryValue="SLA Target met"
          subtext="Edge SD-WAN · Dual Uplink"
          tag="1 Alert"
          tagVariant="warning"
          icon={Activity}
          iconBg="bg-[#ecfdf5]"
          iconColor="text-[#065f46]"
          actionText="View Topology Mesh"
          onAction={() => setIsTopologyOpen(true)}
        />

        <MetricCard
          title="Deployed Hardware"
          value="864"
          secondaryValue="Cataloged Units"
          subtext="318 PC · 342 Terminals"
          tag="98.4% Tagged"
          tagVariant="default"
          icon={HardDrive}
          iconBg="bg-[#f2f3ff]"
          iconColor="text-[#3525cd]"
          actionText="Inspect Fleet Database"
          onAction={() => onNavigateToScreen('assets')}
        />

        <MetricCard
          title="On-Site IT Personnel"
          value="14"
          secondaryValue="Field Engineers Active"
          subtext="2 Shift Rotations Active"
          tag="0 Absences"
          tagVariant="success"
          icon={Users}
          iconBg="bg-[#eaedff]"
          iconColor="text-[#5b598c]"
          actionText="View Technician Roster"
          onAction={() => onNavigateToScreen('employees')}
        />
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-3 shadow-level-1 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Category Tabs */}
        <TabFilter
          options={categoryTabs}
          activeId={selectedCategory}
          onChange={setSelectedCategory}
        />

        {/* Right: Search, Status Dropdown, Topology Toggle, View Toggle */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Search Input */}
          <div className="w-full sm:w-48 md:w-60">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Filter campus, subnet, lead..."
              autoFocusKey={false}
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-2 text-xs bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] border border-transparent focus:border-[#4f46e5] rounded-lg outline-none font-medium transition-colors"
            >
              <option value="all">All Status</option>
              <option value="critical">Critical Incidents Only</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="operational">Operational Only</option>
            </select>
          </div>

          {/* Topology Toggle Button */}
          <button
            onClick={() => setIsTopologyOpen(!isTopologyOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all shrink-0 ${
              isTopologyOpen
                ? 'bg-[#3525cd] text-white border-[#3525cd] shadow-xs'
                : 'bg-white text-[#464555] border-[#cbd5e1] hover:bg-slate-50'
            }`}
            title="Toggle Live SD-WAN Mesh Topology Map"
          >
            <Network className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Topology</span>
          </button>

          {/* View Switcher (Grid vs Table) */}
          <div className="flex items-center bg-[#eaedff] p-1 rounded-lg border border-[#dae2fd] shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-[#3525cd] shadow-xs'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#3525cd] shadow-xs'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
              title="Table Roster View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Network Topology Collapsible Drawer */}
      <NetworkTopologyDrawer
        isOpen={isTopologyOpen}
        onClose={() => setIsTopologyOpen(false)}
        facilities={facilities}
      />

      {/* Main Facilities View (Grid or Table) */}
      {viewMode === 'grid' ? (
        <FacilityGrid
          facilities={filteredFacilities}
          onManageAssets={onManageAssets}
          onOpenTerminal={onOpenTerminal}
          onOpenThermals={onOpenThermals}
          onOpenTickets={onOpenTickets}
        />
      ) : (
        <FacilityTableView
          facilities={filteredFacilities}
          onManageAssets={onManageAssets}
          onOpenTerminal={onOpenTerminal}
          onOpenThermals={onOpenThermals}
          onOpenTickets={onOpenTickets}
        />
      )}

      {/* Master IP Subnet Utilization Strip */}
      <SubnetUtilizationStrip
        onHotlineClick={onHotlineClick}
        onSubnetInspect={(name) => {
          setSearchQuery(name.includes('HQ') ? 'HQ' : name.includes('Factory A') ? 'Factory Building A' : name.includes('Factory B') ? 'Factory Building B' : 'Warehouse');
        }}
      />
    </div>
  );
};

