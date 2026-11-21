'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Users,
  Search,
  Download,
  UserPlus,
  RefreshCw,
  Building2,
  Factory,
  Warehouse,
  Scissors,
  Palette,
  Laptop,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RotateCw,
  X,
  Mail,
  Phone,
  ShieldCheck,
  Clock,
  Award
} from 'lucide-react';
import { Employee, Facility } from '../../types';
import { mockEmployees as initialEmployees } from '../../data/mockEmployees';
import { exportEmployeesToCsv } from '../../utils/exportCsv';
import { EmployeeDetailsDrawer } from '../modals/EmployeeDetailsDrawer';
import { AddEmployeeModal } from '../modals/AddEmployeeModal';

interface EmployeesScreenProps {
  facilities: Facility[];
}

type TabCategory = 'all' | 'supervisors' | 'corporate' | 'it_systems';

export const EmployeesScreen: React.FC<EmployeesScreenProps> = ({ facilities }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Row selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Columns visibility state
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    details: true,
    department: true,
    designation: true,
    location: true
  });
  const columnsDropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [selectedEmployeeForDrawer, setSelectedEmployeeForDrawer] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Close columns dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        columnsDropdownRef.current &&
        !columnsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsColumnsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper for 2-letter initials
  const getInitials = (name: string) => {
    const clean = name.replace(/^Dr\.\s+/i, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper for location icons
  const getLocationIcon = (facilityName: string) => {
    const lower = facilityName.toLowerCase();
    if (lower.includes('warehouse')) {
      return <Warehouse className="w-4 h-4 text-[#777587] shrink-0" />;
    }
    if (lower.includes('factory')) {
      return <Factory className="w-4 h-4 text-[#777587] shrink-0" />;
    }
    return <Building2 className="w-4 h-4 text-[#777587] shrink-0" />;
  };

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Tab filter
      if (activeTab === 'supervisors') {
        const matchesSupervisor =
          emp.role.toLowerCase().includes('supervisor') ||
          emp.role.toLowerCase().includes('manager') ||
          emp.title.toLowerCase().includes('supervisor');
        if (!matchesSupervisor) return false;
      } else if (activeTab === 'corporate') {
        const isCorp =
          emp.department === 'Merchandising' ||
          emp.department === 'Design & CAD' ||
          emp.department === 'HR & Compliance';
        if (!isCorp) return false;
      } else if (activeTab === 'it_systems') {
        if (emp.department !== 'IT & Systems') return false;
      }

      // Department filter
      if (selectedDepartment !== 'all' && emp.department !== selectedDepartment) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'all' && emp.facilityName !== selectedLocation) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && emp.status !== selectedStatus) {
        return false;
      }

      // Search input filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = emp.name.toLowerCase().includes(q);
        const matchesId = (emp.employeeId || emp.id).toLowerCase().includes(q);
        const matchesEmail = emp.email.toLowerCase().includes(q);
        const matchesRole = emp.role.toLowerCase().includes(q);
        const matchesDept = (emp.department || '').toLowerCase().includes(q);
        const matchesFac = emp.facilityName.toLowerCase().includes(q);
        if (
          !matchesName &&
          !matchesId &&
          !matchesEmail &&
          !matchesRole &&
          !matchesDept &&
          !matchesFac
        ) {
          return false;
        }
      }

      return true;
    });
  }, [employees, activeTab, selectedDepartment, selectedLocation, selectedStatus, search]);

  // Paginated employees for display
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredEmployees, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / rowsPerPage));

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedEmployees.map((emp) => emp.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    paginatedEmployees.length > 0 &&
    paginatedEmployees.every((emp) => selectedIds.includes(emp.id));

  // Export handlers
  const handleExportCsv = () => {
    const toExport =
      selectedIds.length > 0
        ? employees.filter((e) => selectedIds.includes(e.id))
        : filteredEmployees;
    exportEmployeesToCsv(toExport);
  };

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Add Employee Handler
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
  };

  // Status toggle handler
  const handleToggleStatus = (employeeId: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          const nextStatus = emp.status === 'active' ? 'leave' : 'active';
          return { ...emp, status: nextStatus };
        }
        return emp;
      })
    );
    if (selectedEmployeeForDrawer && selectedEmployeeForDrawer.id === employeeId) {
      setSelectedEmployeeForDrawer((prev) =>
        prev ? { ...prev, status: prev.status === 'active' ? 'leave' : 'active' } : null
      );
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          {/* Directory Master Live Sync Badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold font-mono tracking-wider text-[#3525cd] uppercase">
              DIRECTORY MASTER
            </span>
            <span className="text-[11px] text-[#777587]">Live Sync: 4m ago</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
            Employees
          </h1>
          <p className="text-xs sm:text-sm text-[#464555] mt-1 max-w-3xl leading-relaxed">
            Manage enterprise personnel, organizational department allocation, facility locations, and
            assigned IT equipment.
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#131b2e] bg-white border border-[#c7c4d8] hover:bg-[#f2f3ff] hover:border-[#3525cd] rounded-lg transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-[#464555]" />
            <span>Export Directory (CSV)</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#312e81] rounded-lg transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Employee</span>
          </button>
        </div>
      </div>

      {/* 2. Segment Tabs & Auto-sync Indicator */}
      <div className="border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {/* Tab 1: All Employees */}
          <button
            onClick={() => {
              setActiveTab('all');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 pb-3 text-xs font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'text-[#3525cd] border-[#3525cd]'
                : 'text-[#464555] border-transparent hover:text-[#131b2e]'
            }`}
          >
            <span>All Employees</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === 'all'
                  ? 'bg-[#eaedff] text-[#3525cd]'
                  : 'bg-[#f2f3ff] text-[#777587]'
              }`}
            >
              1,428
            </span>
          </button>

          {/* Tab 2: Floor Supervisors */}
          <button
            onClick={() => {
              setActiveTab('supervisors');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 pb-3 text-xs font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'supervisors'
                ? 'text-[#3525cd] border-[#3525cd]'
                : 'text-[#464555] border-transparent hover:text-[#131b2e]'
            }`}
          >
            <span>Floor Supervisors</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === 'supervisors'
                  ? 'bg-[#eaedff] text-[#3525cd]'
                  : 'bg-[#f2f3ff] text-[#777587]'
              }`}
            >
              84
            </span>
          </button>

          {/* Tab 3: Corporate & Merchandising */}
          <button
            onClick={() => {
              setActiveTab('corporate');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 pb-3 text-xs font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'corporate'
                ? 'text-[#3525cd] border-[#3525cd]'
                : 'text-[#464555] border-transparent hover:text-[#131b2e]'
            }`}
          >
            <span>Corporate & Merchandising</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === 'corporate'
                  ? 'bg-[#eaedff] text-[#3525cd]'
                  : 'bg-[#f2f3ff] text-[#777587]'
              }`}
            >
              312
            </span>
          </button>

          {/* Tab 4: IT & Systems Staff */}
          <button
            onClick={() => {
              setActiveTab('it_systems');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 pb-3 text-xs font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'it_systems'
                ? 'text-[#3525cd] border-[#3525cd]'
                : 'text-[#464555] border-transparent hover:text-[#131b2e]'
            }`}
          >
            <span>IT & Systems Staff</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === 'it_systems'
                  ? 'bg-[#eaedff] text-[#3525cd]'
                  : 'bg-[#f2f3ff] text-[#777587]'
              }`}
            >
              24
            </span>
          </button>
        </div>

        {/* Live sync HRMIS indicator */}
        <div className="flex items-center gap-2 text-xs text-[#464555] pb-3 shrink-0">
          <RefreshCw className="w-3.5 h-3.5 text-[#5b598c]" />
          <span className="font-medium">Auto-sync with Apex HRMIS active</span>
        </div>
      </div>

      {/* 3. Executive KPI Strip (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL HEADCOUNT */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#777587] uppercase">
              TOTAL HEADCOUNT
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#3525cd] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#131b2e]">1,428</span>
              <span className="text-xs text-[#777587] font-normal">personnel</span>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-[#f2f3ff] flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#131b2e]">Active: 1,392</span>
            <span className="text-[#c7c4d8]">·</span>
            <span className="text-[#777587]">On Leave: 36</span>
          </div>
        </div>

        {/* Card 2: PRODUCTION FLOOR STAFF */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#777587] uppercase">
              PRODUCTION FLOOR STAFF
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#3525cd] flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#131b2e]">940</span>
              <span className="text-xs font-semibold text-[#3525cd] bg-[#eaedff] px-1.5 py-0.5 rounded">
                65.8%
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-[#f2f3ff] flex items-center gap-1.5 text-xs text-[#777587] truncate">
            <span className="text-blue-500 font-bold">•</span>
            <span className="truncate">Cutting, Sewing, Washing & Finishi...</span>
          </div>
        </div>

        {/* Card 3: MERCHANDISING & DESIGN */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#777587] uppercase">
              MERCHANDISING & DESIGN
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#3525cd] flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#131b2e]">312</span>
              <span className="text-xs text-[#777587] font-normal">personnel</span>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-[#f2f3ff] flex items-center gap-1.5 text-xs text-[#777587] truncate">
            <span className="text-indigo-500 font-bold">•</span>
            <span className="truncate">CAD Workstations, Samplers, Mer...</span>
          </div>
        </div>

        {/* Card 4: ASSIGNED HARDWARE ASSETS */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#777587] uppercase">
              ASSIGNED HARDWARE ASSETS
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#3525cd] flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#131b2e]">1,185</span>
              <span className="text-xs text-[#777587] font-normal">linked devices</span>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-[#f2f3ff] flex items-center justify-between text-xs">
            <span className="text-[#777587] truncate">Laptops, Desktops, Zebra</span>
            <span className="text-xs font-semibold text-[#3525cd] shrink-0">83% coverage</span>
          </div>
        </div>
      </div>

      {/* 4. Search and Filter Bar */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-3 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input with keyboard shortcut */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#777587]" />
          <input
            type="text"
            placeholder="Search by name, ID (EMP-XXXX), email.. /"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-9 py-2 text-xs bg-[#f2f3ff] text-[#131b2e] placeholder-[#777587] rounded-lg border border-transparent focus:border-[#3525cd] focus:bg-white outline-none transition-all"
          />
        </div>

        {/* Dropdown Filters & Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-[#f2f3ff] text-[#131b2e] rounded-lg border border-transparent focus:border-[#3525cd] outline-none font-medium cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="IT & Systems">IT & Systems</option>
            <option value="Merchandising">Merchandising</option>
            <option value="Cutting & Sewing">Cutting & Sewing</option>
            <option value="Design & CAD">Design & CAD</option>
            <option value="Warehouse & Logistics">Warehouse & Logistics</option>
            <option value="HR & Compliance">HR & Compliance</option>
            <option value="Washing & Finishing">Washing & Finishing</option>
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-[#f2f3ff] text-[#131b2e] rounded-lg border border-transparent focus:border-[#3525cd] outline-none font-medium cursor-pointer"
          >
            <option value="all">All Locations</option>
            <option value="Apex HQ & Design Studio">Apex HQ & Design Studio</option>
            <option value="Factory Building A">Factory Building A</option>
            <option value="Factory Building B">Factory Building B</option>
            <option value="Central Warehouse">Central Warehouse</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-[#f2f3ff] text-[#131b2e] rounded-lg border border-transparent focus:border-[#3525cd] outline-none font-medium cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="leave">On Leave</option>
            <option value="offboarding">Offboarding</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Columns Visibility Dropdown */}
          <div className="relative" ref={columnsDropdownRef}>
            <button
              onClick={() => setIsColumnsOpen(!isColumnsOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#464555] bg-white border border-[#c7c4d8] hover:bg-[#f2f3ff] rounded-lg transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Columns</span>
            </button>

            {isColumnsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e2e8f0] rounded-xl shadow-lg z-30 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#777587]">
                  Toggle Columns
                </div>
                {Object.entries({
                  id: 'Employee ID',
                  details: 'Employee Details',
                  department: 'Department',
                  designation: 'Designation',
                  location: 'Primary Location'
                }).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#131b2e] hover:bg-[#f2f3ff] rounded-md cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns[key as keyof typeof visibleColumns]}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          [key]: e.target.checked
                        }))
                      }
                      className="rounded border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd]"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            title="Refresh employees directory"
            className="p-2 text-[#464555] bg-white border border-[#c7c4d8] hover:bg-[#f2f3ff] rounded-lg transition-colors cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#3525cd]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Floating Bulk Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#3525cd] text-white px-4 py-2.5 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
              {selectedIds.length} Selected
            </span>
            <span className="text-xs font-medium">Bulk operations on selected personnel</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-white text-[#3525cd] hover:bg-white/90 rounded-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Selected CSV</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="p-1 hover:bg-white/20 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Employees Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#faf8ff] text-[11px] font-bold text-[#777587] uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd] cursor-pointer"
                  />
                </th>
                {visibleColumns.id && <th className="py-3.5 px-4">EMPLOYEE ID</th>}
                {visibleColumns.details && <th className="py-3.5 px-4">EMPLOYEE DETAILS</th>}
                {visibleColumns.department && <th className="py-3.5 px-4">DEPARTMENT</th>}
                {visibleColumns.designation && <th className="py-3.5 px-4">DESIGNATION</th>}
                {visibleColumns.location && <th className="py-3.5 px-4">PRIMARY LOCATION</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f1f5f9] text-xs">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#777587]">
                    No employees matching the current search criteria or filters.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => {
                  const isChecked = selectedIds.includes(emp.id);

                  return (
                    <tr
                      key={emp.id}
                      onClick={() => setSelectedEmployeeForDrawer(emp)}
                      className={`hover:bg-[#f8f9fe] transition-colors cursor-pointer group ${
                        isChecked ? 'bg-[#f2f3ff]/60' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-3.5 px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(emp.id)}
                          className="rounded border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd] cursor-pointer"
                        />
                      </td>

                      {/* Employee ID */}
                      {visibleColumns.id && (
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono text-xs font-semibold text-[#3525cd] bg-[#eaedff] px-2 py-0.5 rounded border border-[#dae2fd]">
                            {emp.employeeId || emp.id.toUpperCase()}
                          </span>
                        </td>
                      )}

                      {/* Employee Details (Avatar, Name, Admin Badge, Email) */}
                      {visibleColumns.details && (
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {/* Avatar image or 2-letter Initials circle */}
                            {emp.avatar ? (
                              <img
                                src={emp.avatar}
                                alt={emp.name}
                                className="w-9 h-9 rounded-full object-cover border border-[#c7c4d8] shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-[#eaedff] text-[#3525cd] font-semibold text-xs flex items-center justify-center shrink-0 border border-[#dae2fd]">
                                {getInitials(emp.name)}
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-[#131b2e] group-hover:text-[#3525cd] transition-colors">
                                  {emp.name}
                                </span>
                                {emp.isAdmin && (
                                  <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#eaedff] text-[#3525cd] rounded uppercase">
                                    ADMN
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-[#777587] block font-normal">
                                {emp.email}
                              </span>
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Department */}
                      {visibleColumns.department && (
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 text-xs font-medium bg-[#eaedff] text-[#3525cd] rounded-md inline-block">
                            {emp.department || 'Operations'}
                          </span>
                        </td>
                      )}

                      {/* Designation */}
                      {visibleColumns.designation && (
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-xs text-[#131b2e] font-medium block">
                            {emp.role || emp.title}
                          </span>
                        </td>
                      )}

                      {/* Primary Location */}
                      {visibleColumns.location && (
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-xs text-[#464555] font-medium">
                            {getLocationIcon(emp.facilityName)}
                            <span>{emp.facilityName}</span>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Table Footer / Pagination */}
        <div className="px-4 py-3.5 bg-white border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#777587]">
          {/* Showing X to Y of Z */}
          <div>
            Showing{' '}
            <span className="font-semibold text-[#131b2e]">
              {filteredEmployees.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-[#131b2e]">
              {Math.min(currentPage * rowsPerPage, filteredEmployees.length)}
            </span>{' '}
            of <span className="font-semibold text-[#131b2e]">1,428</span> employees
          </div>

          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-[#f2f3ff] text-[#131b2e] font-medium rounded-md border border-[#dae2fd] outline-none cursor-pointer"
            >
              <option value={8}>8</option>
              <option value={14}>14</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1">
            {/* Prev button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-transparent hover:bg-[#f2f3ff] text-[#464555] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page 1 (Active) */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                currentPage === 1
                  ? 'bg-[#3525cd] text-white shadow-xs'
                  : 'text-[#464555] hover:bg-[#f2f3ff]'
              }`}
            >
              1
            </button>

            {/* Page 2 */}
            {totalPages >= 2 && (
              <button
                onClick={() => setCurrentPage(2)}
                className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  currentPage === 2
                    ? 'bg-[#3525cd] text-white shadow-xs'
                    : 'text-[#464555] hover:bg-[#f2f3ff]'
                }`}
              >
                2
              </button>
            )}

            {/* Page 3 */}
            {totalPages >= 3 && (
              <button
                onClick={() => setCurrentPage(3)}
                className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  currentPage === 3
                    ? 'bg-[#3525cd] text-white shadow-xs'
                    : 'text-[#464555] hover:bg-[#f2f3ff]'
                }`}
              >
                3
              </button>
            )}

            {/* Ellipsis */}
            {totalPages > 4 && <span className="px-1 text-[#777587]">...</span>}

            {/* Final page (e.g. 179) */}
            <button
              onClick={() => setCurrentPage(179)}
              className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                currentPage === 179
                  ? 'bg-[#3525cd] text-white shadow-xs'
                  : 'text-[#464555] hover:bg-[#f2f3ff]'
              }`}
            >
              179
            </button>

            {/* Next button */}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-transparent hover:bg-[#f2f3ff] text-[#464555] cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7. Employee Details Slide-out Drawer */}
      <EmployeeDetailsDrawer
        employee={selectedEmployeeForDrawer}
        onClose={() => setSelectedEmployeeForDrawer(null)}
        onToggleStatus={handleToggleStatus}
      />

      {/* 8. Add Employee Provisioning Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        facilities={facilities}
        onAddEmployee={handleAddEmployee}
      />
    </div>
  );
};
