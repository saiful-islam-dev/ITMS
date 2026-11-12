import React, { useState } from 'react';
import { Facility, SupportTicket } from '../../types';

interface DashboardScreenProps {
  facilities: Facility[];
  tickets: SupportTicket[];
  onNavigateToScreen: (screen: any) => void;
  onOpenThermals: (facility: Facility) => void;
  onOpenTerminal: (facility: Facility) => void;
  onOpenExportModal?: () => void;
  onOpenCreateTicket?: () => void;
  onViewTicketDetails?: (ticket: SupportTicket) => void;
  onOpenAuditTrail?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  facilities,
  tickets,
  onNavigateToScreen,
  onOpenThermals,
  onOpenTerminal,
  onOpenExportModal,
  onOpenCreateTicket,
  onViewTicketDetails,
  onOpenAuditTrail
}) => {
  // Time range selector state
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | 'Custom'>('30D');
  const [trendRange, setTrendRange] = useState<'7D' | '30D' | '90D'>('30D');
  const [ticketFilter, setTicketFilter] = useState<'all' | 'critical' | 'hardware' | 'factory'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshLabel, setRefreshLabel] = useState('Updated 2m ago');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; text: string } | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshLabel('Updated just now');
    }, 600);
  };

  // Find facilities for quick interactions
  const facBuildingA = facilities.find((f) => f.id === 'loc-fct-01') || facilities[0];
  const facBuildingB = facilities.find((f) => f.id === 'loc-fct-02') || facilities[1];
  const facWarehouse = facilities.find((f) => f.id === 'loc-wh-01') || facilities[2];
  const facHQ = facilities.find((f) => f.id === 'loc-corp-01') || facilities[3];

  // Filter tickets for the table
  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === 'critical') return t.severity === 'critical';
    if (ticketFilter === 'hardware') return t.category === 'Hardware';
    if (ticketFilter === 'factory') {
      return (
        t.facilityCode?.includes('FCT') ||
        t.facilityName?.toLowerCase().includes('factory') ||
        (t.scope && t.scope.toLowerCase().includes('factory'))
      );
    }
    return true;
  });

  // Pagination for the table (5 per page)
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const displayedTickets = filteredTickets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col w-full">
      {/* Top Viewport Control Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between pb-space-lg gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              IT Operations Dashboard
            </h1>
            <span className="font-label-compact text-label-compact px-space-xs py-0.5 rounded-lg bg-surface-container-high text-primary font-semibold">
              Live Plant Feed
            </span>
          </div>
          <p className="font-body-dense text-body-dense text-on-surface-variant mt-0.5">
            Monitor your IT infrastructure, support requests, and factory floor operations across Apex Garments facilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Time Range Selector */}
          <div className="inline-flex items-center bg-surface-container-low p-0.5 rounded-lg">
            {(['7D', '30D', '90D'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                type="button"
                className={`px-space-sm py-1 font-body-dense text-body-dense rounded-lg transition-colors ${
                  timeRange === range
                    ? 'font-body-dense-medium text-body-dense-medium text-on-primary bg-primary-container shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {range}
              </button>
            ))}
            <button
              onClick={() => setTimeRange('Custom')}
              type="button"
              className={`px-space-sm py-1 font-body-dense text-body-dense rounded-lg transition-colors flex items-center gap-1 ${
                timeRange === 'Custom'
                  ? 'font-body-dense-medium text-body-dense-medium text-on-primary bg-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Custom</span>
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            </button>
          </div>

          {/* Refresh Status */}
          <button
            onClick={handleRefresh}
            type="button"
            className="hidden sm:flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant shadow-sm text-caption font-caption hover:bg-surface-container transition-colors"
            title="Click to trigger telemetry resync"
          >
            <span className={`material-symbols-outlined text-[14px] text-tertiary-container ${isRefreshing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{refreshLabel}</span>
          </button>

          {/* Action Buttons */}
          <button
            onClick={onOpenExportModal}
            type="button"
            className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-dense-medium text-body-dense-medium shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Report</span>
          </button>

          <button
            onClick={onOpenCreateTicket}
            type="button"
            className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-body-dense-medium text-body-dense-medium shadow-sm hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Section 1: KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter mb-space-lg">
        {/* Total Employees */}
        <div
          onClick={() => onNavigateToScreen('employees')}
          className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-compact text-label-compact uppercase text-on-surface-variant tracking-wider">
                Total Employees
              </span>
              <span className="p-1 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[18px]">
                badge
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm">
              <span className="font-metric-display text-metric-display text-on-surface font-bold tracking-tight">
                1,428
              </span>
              <span className="inline-flex items-center gap-0.5 px-space-xs py-0.5 rounded-lg bg-surface-container text-tertiary font-label-compact text-label-compact">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                +34 onboarded
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs">
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden flex mb-2">
              <div className="bg-primary h-full w-[65%]" title="Factory Floors: 940"></div>
              <div className="bg-secondary h-full w-[22%]" title="Merchandising: 312"></div>
              <div className="bg-tertiary-container h-full w-[13%]" title="HQ & Ops: 176"></div>
            </div>
            <span className="font-caption text-caption text-on-surface-variant flex items-center justify-between">
              <span>940 Factory</span>
              <span>•</span>
              <span>312 Merchandising</span>
              <span>•</span>
              <span>176 HQ</span>
            </span>
          </div>
        </div>

        {/* Total IT Assets */}
        <div
          onClick={() => onNavigateToScreen('assets')}
          className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-compact text-label-compact uppercase text-on-surface-variant tracking-wider">
                Total IT Assets
              </span>
              <span className="p-1 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[18px]">
                inventory
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm">
              <span className="font-metric-display text-metric-display text-on-surface font-bold tracking-tight">
                864
              </span>
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-lg bg-surface-container-high text-on-surface font-label-compact text-label-compact font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                98.2% Operational
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs">
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden flex mb-2">
              <div className="bg-primary-container h-full w-[82%]" title="Active: 712"></div>
              <div className="bg-secondary-container h-full w-[11%]" title="In Stock: 94"></div>
              <div className="bg-error h-full w-[4%]" title="Repair: 38"></div>
              <div className="bg-outline-variant h-full w-[3%]" title="Ret: 20"></div>
            </div>
            <span className="font-caption text-caption text-on-surface-variant truncate">
              712 Active • 94 In Stock • 38 Repair • 20 Ret.
            </span>
          </div>
        </div>

        {/* Open Tickets */}
        <div
          onClick={() => onNavigateToScreen('tickets')}
          className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-compact text-label-compact uppercase text-on-surface-variant tracking-wider">
                Open Tickets
              </span>
              <span className="p-1 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[18px]">
                confirmation_number
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm">
              <span className="font-metric-display text-metric-display text-on-surface font-bold tracking-tight">
                {tickets.length > 0 ? tickets.length : 28}
              </span>
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-lg bg-error-container text-on-error-container font-label-compact text-label-compact">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-error"></span>
                </span>
                3 Critical
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs">
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden flex mb-2">
              <div className="bg-primary h-full w-[43%]" title="In Progress: 12"></div>
              <div className="bg-secondary h-full w-[32%]" title="Assigned: 9"></div>
              <div className="bg-tertiary-container h-full w-[25%]" title="Vendor Wait: 4"></div>
            </div>
            <span className="font-caption text-caption text-on-surface-variant flex items-center justify-between">
              <span>12 In Progress</span>
              <span>•</span>
              <span>9 Assigned</span>
              <span>•</span>
              <span>4 Vendor Wait</span>
            </span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div
          onClick={() => onNavigateToScreen('dashboard')}
          className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-compact text-label-compact uppercase text-on-surface-variant tracking-wider">
                Pending Tasks
              </span>
              <span className="p-1 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[18px]">
                fact_check
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm">
              <span className="font-metric-display text-metric-display text-on-surface font-bold tracking-tight">
                14
              </span>
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-lg bg-surface-variant text-on-surface font-label-compact text-label-compact">
                <span className="material-symbols-outlined text-[12px] text-tertiary">schedule</span>
                4 Due Today
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs">
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden flex mb-2">
              <div className="bg-primary h-full w-[42%]" title="Maintenance: 6"></div>
              <div className="bg-tertiary h-full w-[36%]" title="Network: 5"></div>
              <div className="bg-secondary h-full w-[22%]" title="Onboard: 3"></div>
            </div>
            <span className="font-caption text-caption text-on-surface-variant flex items-center justify-between">
              <span>6 Maintenance</span>
              <span>•</span>
              <span>5 Network</span>
              <span>•</span>
              <span>3 Onboard</span>
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Analytics & Trends (Two Columns: 7 & 5) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter mb-space-lg">
        {/* Ticket Volume & Resolution Trends (7 cols) */}
        <div className="xl:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm gap-space-xs">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Ticket Volume & Resolution Trends
                </h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  Daily volume comparing incoming demand against team throughput
                </p>
              </div>
              <div className="flex items-center gap-space-md self-start sm:self-auto">
                <div className="flex items-center gap-space-sm">
                  <span className="inline-flex items-center gap-1 font-caption text-caption text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                    Incoming (Avg 14.2)
                  </span>
                  <span className="inline-flex items-center gap-1 font-caption text-caption text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                    Resolved (Avg 15.6)
                  </span>
                </div>
                <div className="inline-flex rounded-lg bg-surface-container-low p-0.5 text-caption font-caption">
                  {(['7D', '30D', '90D'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setTrendRange(r)}
                      type="button"
                      className={`px-2 py-0.5 rounded-lg transition-colors ${
                        trendRange === r
                          ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SVG Visual Area Chart */}
            <div className="w-full h-56 pt-space-sm relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
                <defs>
                  <linearGradient id="primaryAreaGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25"></stop>
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"></stop>
                  </linearGradient>
                  <linearGradient id="tertiaryAreaGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00659a" stopOpacity="0.22"></stop>
                    <stop offset="100%" stopColor="#00659a" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                {/* Horizontal guideline rules */}
                <line stroke="#eaedff" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="700" y1="30" y2="30"></line>
                <line stroke="#eaedff" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="700" y1="80" y2="80"></line>
                <line stroke="#eaedff" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="700" y1="130" y2="130"></line>
                <line stroke="#eaedff" strokeWidth="1" x1="0" x2="700" y1="180" y2="180"></line>

                {/* Incoming Tickets Area (Primary) */}
                <path
                  d="M 0,140 Q 60,110 120,135 T 240,90 T 360,115 T 480,70 T 600,105 T 700,60 L 700,180 L 0,180 Z"
                  fill="url(#primaryAreaGrad)"
                ></path>
                <path
                  d="M 0,140 Q 60,110 120,135 T 240,90 T 360,115 T 480,70 T 600,105 T 700,60"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                ></path>

                {/* Resolved Tickets Area (Tertiary) */}
                <path
                  d="M 0,160 Q 60,130 120,110 T 240,85 T 360,75 T 480,95 T 600,65 T 700,50 L 700,180 L 0,180 Z"
                  fill="url(#tertiaryAreaGrad)"
                ></path>
                <path
                  d="M 0,160 Q 60,130 120,110 T 240,85 T 360,75 T 480,95 T 600,65 T 700,50"
                  fill="none"
                  stroke="#004c76"
                  strokeDasharray="5,2"
                  strokeWidth="2"
                ></path>

                {/* Interactive Marker Dots */}
                <circle
                  cx="480"
                  cy="70"
                  fill="#ffffff"
                  r="4"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  className="cursor-pointer hover:r-6 transition-all"
                  onMouseEnter={() => setHoveredPoint({ x: 480, y: 70, text: 'Oct 22: 18 Incoming Tickets' })}
                  onMouseLeave={() => setHoveredPoint(null)}
                ></circle>
                <circle
                  cx="480"
                  cy="95"
                  fill="#ffffff"
                  r="3.5"
                  stroke="#004c76"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:r-6 transition-all"
                  onMouseEnter={() => setHoveredPoint({ x: 480, y: 95, text: 'Oct 22: 16 Resolved Tickets' })}
                  onMouseLeave={() => setHoveredPoint(null)}
                ></circle>

                <circle
                  cx="700"
                  cy="60"
                  fill="#ffffff"
                  r="4.5"
                  stroke="#4f46e5"
                  strokeWidth="3"
                ></circle>
                <circle
                  cx="700"
                  cy="50"
                  fill="#ffffff"
                  r="4"
                  stroke="#004c76"
                  strokeWidth="2.5"
                ></circle>
              </svg>

              {hoveredPoint && (
                <div
                  className="absolute bg-on-surface text-surface-container-lowest text-[11px] px-2 py-1 rounded shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-full"
                  style={{ left: `${(hoveredPoint.x / 700) * 100}%`, top: `${(hoveredPoint.y / 200) * 100}%` }}
                >
                  {hoveredPoint.text}
                </div>
              )}

              <div className="flex justify-between font-caption text-caption text-on-surface-variant pt-2">
                <span>Oct 01</span>
                <span>Oct 08</span>
                <span>Oct 15</span>
                <span>Oct 22</span>
                <span>Oct 30 (Current)</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Summary Footer */}
          <div className="grid grid-cols-3 gap-space-sm pt-space-md mt-space-md bg-surface-container-low rounded-lg p-space-sm">
            <div className="flex flex-col">
              <span className="font-caption text-caption text-on-surface-variant">Avg First Response</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">14 mins</span>
              <span className="font-label-compact text-label-compact text-tertiary mt-0.5">↓ 3m faster vs target</span>
            </div>
            <div className="flex flex-col">
              <span className="font-caption text-caption text-on-surface-variant">Avg Resolution Time</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">2.8 hrs</span>
              <span className="font-label-compact text-label-compact text-tertiary mt-0.5">Nominal (Garment Shifts)</span>
            </div>
            <div className="flex flex-col">
              <span className="font-caption text-caption text-on-surface-variant">SLA Compliance</span>
              <span className="font-headline-sm text-headline-sm text-primary font-semibold">96.4%</span>
              <span className="font-label-compact text-label-compact text-on-surface-variant mt-0.5">Target: 95.0%</span>
            </div>
          </div>
        </div>

        {/* Tickets by Category & Status (5 cols) */}
        <div className="xl:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-xs">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Tickets by Category & Status
                </h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  Incidents logged across facility infrastructure
                </p>
              </div>
              <button
                onClick={() => onNavigateToScreen('reports')}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                type="button"
                title="View Detailed Analytics"
              >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
            </div>

            {/* Donut & Breakdown Layout */}
            <div className="flex flex-col sm:flex-row items-center gap-space-lg py-space-sm">
              {/* Donut SVG */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Ring */}
                  <path
                    className="text-surface-container"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4.2"
                  ></path>
                  {/* Hardware: 38% */}
                  <path
                    className="text-primary-container"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="38, 100"
                    strokeLinecap="round"
                    strokeWidth="4.2"
                  ></path>
                  {/* Network: 26% */}
                  <path
                    className="text-tertiary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="26, 100"
                    strokeDashoffset="-38"
                    strokeWidth="4.2"
                  ></path>
                  {/* Merchandiser ERP: 18% */}
                  <path
                    className="text-secondary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="18, 100"
                    strokeDashoffset="-64"
                    strokeWidth="4.2"
                  ></path>
                  {/* Email / Access: 12% */}
                  <path
                    className="text-secondary-container"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="12, 100"
                    strokeDashoffset="-82"
                    strokeWidth="4.2"
                  ></path>
                  {/* Security / CCTV: 6% */}
                  <path
                    className="text-outline"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="6, 100"
                    strokeDashoffset="-94"
                    strokeWidth="4.2"
                  ></path>
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-metric-display text-[20px] font-bold text-on-surface leading-none">202</span>
                  <span className="font-label-compact text-label-compact text-on-surface-variant">TOTAL</span>
                </div>
              </div>

              {/* Category Legend Details */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center justify-between font-caption text-caption">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-xs bg-primary-container"></span>
                    <span className="text-on-surface truncate">Hardware & Printers</span>
                  </div>
                  <span className="font-code-mono text-label-compact text-on-surface-variant">38% (77)</span>
                </div>
                <div className="flex items-center justify-between font-caption text-caption">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-xs bg-tertiary"></span>
                    <span className="text-on-surface truncate">Floor LAN & Switches</span>
                  </div>
                  <span className="font-code-mono text-label-compact text-on-surface-variant">26% (52)</span>
                </div>
                <div className="flex items-center justify-between font-caption text-caption">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-xs bg-secondary"></span>
                    <span className="text-on-surface truncate">ERP & CAD Systems</span>
                  </div>
                  <span className="font-code-mono text-label-compact text-on-surface-variant">18% (36)</span>
                </div>
                <div className="flex items-center justify-between font-caption text-caption">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-xs bg-secondary-container"></span>
                    <span className="text-on-surface truncate">Email & Access</span>
                  </div>
                  <span className="font-code-mono text-label-compact text-on-surface-variant">12% (24)</span>
                </div>
                <div className="flex items-center justify-between font-caption text-caption">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-xs bg-outline"></span>
                    <span className="text-on-surface truncate">CCTV & Security</span>
                  </div>
                  <span className="font-code-mono text-label-compact text-on-surface-variant">6% (13)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Lifecycle Status Pills */}
          <div className="pt-space-sm">
            <span className="font-label-compact text-label-compact text-on-surface-variant uppercase tracking-wider block mb-1.5">
              Lifecycle Status Breakdown
            </span>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div
                onClick={() => onNavigateToScreen('tickets')}
                className="bg-surface-container-low p-1.5 rounded-lg cursor-pointer hover:bg-surface-container transition-colors"
              >
                <span className="font-headline-sm text-headline-sm text-primary block leading-tight">11</span>
                <span className="font-label-compact text-[10px] text-on-surface-variant">Open</span>
              </div>
              <div
                onClick={() => onNavigateToScreen('tickets')}
                className="bg-surface-container-low p-1.5 rounded-lg cursor-pointer hover:bg-surface-container transition-colors"
              >
                <span className="font-headline-sm text-headline-sm text-tertiary block leading-tight">10</span>
                <span className="font-label-compact text-[10px] text-on-surface-variant">In Progress</span>
              </div>
              <div
                onClick={() => onNavigateToScreen('tickets')}
                className="bg-surface-container-low p-1.5 rounded-lg cursor-pointer hover:bg-surface-container transition-colors"
              >
                <span className="font-headline-sm text-headline-sm text-secondary block leading-tight">45</span>
                <span className="font-label-compact text-[10px] text-on-surface-variant">Resolved</span>
              </div>
              <div
                onClick={() => onNavigateToScreen('tickets')}
                className="bg-surface-container-low p-1.5 rounded-lg cursor-pointer hover:bg-surface-container transition-colors"
              >
                <span className="font-headline-sm text-headline-sm text-on-surface-variant block leading-tight">128</span>
                <span className="font-label-compact text-[10px] text-on-surface-variant">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Production Floor & Infrastructure Health Overview (4 Grid Cards) */}
      <div className="mb-space-lg">
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-space-xs">
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Factory Infrastructure & Edge Health
            </h2>
            <span className="font-caption text-caption text-on-surface-variant font-code-mono">
              4 Critical Hubs
            </span>
          </div>
          <button
            onClick={() => onNavigateToScreen('locations')}
            type="button"
            className="font-body-dense text-body-dense text-primary hover:underline flex items-center gap-0.5"
          >
            <span>Hardware Map Topology</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
          {/* Factory Building A */}
          <div
            onClick={() => onOpenTerminal(facBuildingA)}
            className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                  Factory Building A
                </span>
                <span className="font-caption text-caption text-on-surface-variant">Cutting & Sewing Unit</span>
              </div>
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-lg bg-surface-container text-primary font-label-compact text-label-compact">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Operational
              </span>
            </div>
            <div className="mt-space-md space-y-1.5">
              <div className="flex justify-between items-center text-caption font-caption">
                <span className="text-on-surface-variant">Uptime</span>
                <span className="font-code-mono font-medium text-on-surface">99.8%</span>
              </div>
              <div className="flex justify-between items-center text-caption font-caption">
                <span className="text-on-surface-variant">Zebra Printers</span>
                <span className="font-code-mono text-primary font-medium">42 / 42 Online</span>
              </div>
              <div className="flex justify-between items-center text-caption font-caption">
                <span className="text-on-surface-variant">Cisco Switch Stacks</span>
                <span className="font-code-mono text-on-surface">8 Switches Nominal</span>
              </div>
            </div>
          </div>

          {/* Factory Building B */}
          <div
            onClick={() => onOpenThermals(facBuildingB)}
            className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-error transition-colors">
                  Factory Building B
                </span>
                <span className="font-caption text-caption text-on-surface-variant">Washing & Finishing Unit</span>
              </div>
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-lg bg-error-container text-on-error-container font-label-compact text-label-compact">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                Degraded
              </span>
            </div>
            <div className="mt-space-md space-y-1.5">
              <div className="flex justify-between items-center text-caption font-caption">
                <span className="text-on-surface-variant">Uptime</span>
                <span className="font-code-mono font-medium text-error">96.4%</span>
              </div>
              <div className="flex justify-between items-center text-caption font-caption">
                <span className="text-on-surface-variant">Switch SW-B2</span>
                <span className="font-code-mono text-error font-medium">Pkt Drop Line 4</span>
              </div>
              <div className="flex justify-between items-center text-caption font-caption">
                <span className="text-on-surface-variant">PoE AP Coverage</span>
                <span className="font-code-mono text-on-surface">11 / 12 Nominal</span>
              </div>
            </div>
          </div>

          {/* Central Warehouse */}
          <div
            onClick={() => onOpenTerminal(facWarehouse)}
            className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                  Central Warehouse
                </span>
                <span className="font-caption text-caption text-on-surface-variant">Fabric & Trim Storage</span>
              </div>
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-lg bg-surface-container text-primary font-label-compact text-label-compact">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Operational
              </span>
            </div>
            <div className="mt-space-md space-y-1.5">
              <div className="flex justify-between items-center text-caption font-caption">
                <span className="text-on-surface-variant">Uptime</span>
                <span className="font-code-mono font-medium text-on-surface">100.0%</span>
              </div>
              <div className="flex justify-between items-center text-caption font-caption">
                <span className="text-on-surface-variant">RFID Handhelds</span>
                <span className="font-code-mono text-primary font-medium">18 Connected</span>
              </div>
              <div className="flex justify-between items-center text-caption font-caption">
                <span className="text-on-surface-variant">Thermal Gateways</span>
                <span className="font-code-mono text-on-surface">4 Units Online</span>
              </div>
            </div>
          </div>

          {/* Apex HQ & Design Studio */}
          <div
            onClick={() => onOpenTerminal(facHQ)}
            className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                  Apex HQ & Design
                </span>
                <span className="font-caption text-caption text-on-surface-variant">CAD & Merchandising Lab</span>
              </div>
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-lg bg-surface-container text-primary font-label-compact text-label-compact">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Operational
              </span>
            </div>
            <div className="mt-space-md space-y-1.5">
              <div className="flex justify-between items-center text-caption font-caption">
                <span className="text-on-surface-variant">Uptime</span>
                <span className="font-code-mono font-medium text-on-surface">99.9%</span>
              </div>
              <div className="flex justify-between items-center text-caption font-caption">
                <span className="text-on-surface-variant">Gerber CAD Cluster</span>
                <span className="font-code-mono text-primary font-medium">Normal (0 Queued)</span>
              </div>
              <div className="flex justify-between items-center text-caption font-caption">
                <span className="text-on-surface-variant">High-Speed NAS</span>
                <span className="font-code-mono text-on-surface">10 Gbps Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Data Tables & Live Feeds (Two Columns: 8 & 4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
        {/* Left Column: Recent Support Tickets High-Density Table (8 cols) */}
        <div className="xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest">
              <div className="flex items-center gap-space-md">
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Recent Support Tickets
                </h2>
                <div className="hidden md:flex items-center gap-1 bg-surface-container-low p-0.5 rounded-lg">
                  <button
                    onClick={() => {
                      setTicketFilter('all');
                      setCurrentPage(1);
                    }}
                    type="button"
                    className={`px-space-xs py-0.5 rounded-lg font-caption text-caption font-medium transition-colors ${
                      ticketFilter === 'all'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    All ({tickets.length})
                  </button>
                  <button
                    onClick={() => {
                      setTicketFilter('critical');
                      setCurrentPage(1);
                    }}
                    type="button"
                    className={`px-space-xs py-0.5 rounded-lg font-caption text-caption font-medium transition-colors ${
                      ticketFilter === 'critical'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Critical ({tickets.filter((t) => t.severity === 'critical').length})
                  </button>
                  <button
                    onClick={() => {
                      setTicketFilter('hardware');
                      setCurrentPage(1);
                    }}
                    type="button"
                    className={`px-space-xs py-0.5 rounded-lg font-caption text-caption font-medium transition-colors ${
                      ticketFilter === 'hardware'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Hardware ({tickets.filter((t) => t.category === 'Hardware').length})
                  </button>
                  <button
                    onClick={() => {
                      setTicketFilter('factory');
                      setCurrentPage(1);
                    }}
                    type="button"
                    className={`px-space-xs py-0.5 rounded-lg font-caption text-caption font-medium transition-colors ${
                      ticketFilter === 'factory'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Factory Floor (9)
                  </button>
                </div>
              </div>
              <button
                onClick={() => onNavigateToScreen('tickets')}
                type="button"
                className="font-body-dense-medium text-body-dense-medium text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View All Tickets</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* High Density Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-compact text-label-compact uppercase tracking-wider">
                    <th className="py-2.5 px-space-md">Ticket ID</th>
                    <th className="py-2.5 px-space-md">Subject & Scope</th>
                    <th className="py-2.5 px-space-md">Requester</th>
                    <th className="py-2.5 px-space-md">Priority</th>
                    <th className="py-2.5 px-space-md">Status</th>
                    <th className="py-2.5 px-space-md">Assigned To</th>
                    <th className="py-2.5 px-space-md">Age</th>
                    <th className="py-2.5 px-space-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-body-dense text-body-dense text-on-surface">
                  {displayedTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-surface-container-low/70 transition-colors">
                      <td className="py-space-sm px-space-md font-code-mono font-medium text-primary whitespace-nowrap">
                        {t.ticketNumber}
                      </td>
                      <td className="py-space-sm px-space-md min-w-[220px]">
                        <div className="flex flex-col">
                          <span className="font-body-dense-medium text-body-dense-medium text-on-surface truncate">
                            {t.title}
                          </span>
                          <span className="font-caption text-caption text-on-surface-variant">
                            {t.scope || t.facilityName} •{' '}
                            <span className="bg-surface-container px-1 py-0.2 rounded text-[10px]">
                              {t.facilityCode === 'LOC-FCT-01'
                                ? 'Factory A'
                                : t.facilityCode === 'LOC-FCT-02'
                                ? 'Factory B'
                                : t.facilityCode === 'LOC-WH-01'
                                ? 'Warehouse'
                                : 'HQ Design'}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="py-space-sm px-space-md whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-on-surface leading-tight font-medium">{t.requester}</span>
                          <span className="font-caption text-caption text-on-surface-variant">
                            {t.requesterRole || 'Line Lead'}
                          </span>
                        </div>
                      </td>
                      <td className="py-space-sm px-space-md whitespace-nowrap">
                        {t.severity === 'critical' ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-error-container text-on-error-container font-label-compact text-label-compact">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            CRITICAL
                          </span>
                        ) : t.severity === 'high' ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-surface-variant text-on-surface font-label-compact text-label-compact">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                            HIGH
                          </span>
                        ) : t.severity === 'medium' ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-surface-container-high text-on-surface font-label-compact text-label-compact">
                            MEDIUM
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-surface-container text-on-surface-variant font-label-compact text-label-compact">
                            LOW
                          </span>
                        )}
                      </td>
                      <td className="py-space-sm px-space-md whitespace-nowrap">
                        {t.status === 'in_progress' ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-surface-container text-primary font-label-compact text-label-compact font-medium">
                            IN PROGRESS
                          </span>
                        ) : t.status === 'assigned' ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-label-compact text-label-compact font-medium">
                            ASSIGNED
                          </span>
                        ) : t.status === 'resolved' ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-label-compact text-label-compact font-medium">
                            RESOLVED
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg bg-surface-container-high text-on-surface font-label-compact text-label-compact font-medium">
                            OPEN
                          </span>
                        )}
                      </td>
                      <td className="py-space-sm px-space-md whitespace-nowrap">
                        <span className="text-on-surface font-medium">{t.assignee}</span>
                      </td>
                      <td className="py-space-sm px-space-md font-code-mono text-caption text-on-surface-variant whitespace-nowrap">
                        {t.age || '18m ago'}
                      </td>
                      <td className="py-space-sm px-space-md text-right whitespace-nowrap">
                        <button
                          onClick={() => onViewTicketDetails?.(t)}
                          className="p-1 text-on-surface-variant hover:text-primary transition-colors mr-1 rounded"
                          title="View details"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                        <button
                          onClick={() => onViewTicketDetails?.(t)}
                          className="p-1 text-on-surface-variant hover:text-on-surface transition-colors rounded"
                          title="More options"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Bottom Density Controls & Pagination */}
          <div className="p-space-sm bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-xs">
            <span className="font-caption text-caption text-on-surface-variant">
              Showing {displayedTickets.length} of {filteredTickets.length} open support incidents
            </span>
            <div className="flex items-center gap-space-xs">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-space-sm py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant font-caption text-caption hover:bg-surface-container disabled:opacity-50 transition-colors"
                type="button"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  type="button"
                  className={`px-space-sm py-1 rounded-lg font-caption text-caption transition-colors ${
                    currentPage === idx + 1
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-space-sm py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant font-caption text-caption hover:bg-surface-container disabled:opacity-50 transition-colors"
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Operations Activity Timeline (4 cols) */}
        <div className="xl:col-span-4 bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-xs">
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Live Operations Feed
                </h2>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-surface-container text-primary font-label-compact text-label-compact font-semibold">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                  </span>
                  REAL-TIME
                </span>
              </div>
              <button
                onClick={onOpenAuditTrail}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                type="button"
                title="Filter feed"
              >
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
              </button>
            </div>

            {/* Chronological Timeline List */}
            <div className="space-y-space-md pt-space-xs">
              {/* Item 1 */}
              <div className="flex gap-space-sm items-start">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[14px]">laptop_mac</span>
                  </div>
                  <div className="w-0.5 h-full bg-surface-container my-1"></div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-code-mono text-label-compact text-on-surface-variant font-semibold">
                      10:42 AM
                    </span>
                    <span className="font-label-compact text-[10px] px-1 bg-surface-container text-on-surface-variant rounded">
                      Asset Assigned
                    </span>
                  </div>
                  <p className="font-body-dense text-body-dense text-on-surface mt-0.5 leading-snug">
                    Asset <span className="font-code-mono font-medium text-primary">AST-9042</span> (ThinkPad T14) assigned to Tania Sultana (Merchandising) by Tariq Rahman.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-space-sm items-start">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  </div>
                  <div className="w-0.5 h-full bg-surface-container my-1"></div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-code-mono text-label-compact text-on-surface-variant font-semibold">
                      10:15 AM
                    </span>
                    <span className="font-label-compact text-[10px] px-1 bg-tertiary-fixed text-on-tertiary-fixed rounded">
                      Ticket Resolved
                    </span>
                  </div>
                  <p className="font-body-dense text-body-dense text-on-surface mt-0.5 leading-snug">
                    Ticket <span className="font-code-mono font-medium text-primary">#TCK-2024-1035</span> marked resolved: Cisco 2960 patch cable replaced in Finishing Unit.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex gap-space-sm items-start">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                    <span className="material-symbols-outlined text-[14px]">cloud_sync</span>
                  </div>
                  <div className="w-0.5 h-full bg-surface-container my-1"></div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-code-mono text-label-compact text-on-surface-variant font-semibold">
                      09:50 AM
                    </span>
                    <span className="font-label-compact text-[10px] px-1 bg-surface-container text-on-surface-variant rounded">
                      Sys Backup
                    </span>
                  </div>
                  <p className="font-body-dense text-body-dense text-on-surface mt-0.5 leading-snug">
                    Automated Backup: ERP Database mirror completed successfully (<span className="font-code-mono font-medium">142 GB verified</span>).
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex gap-space-sm items-start">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[14px]">print</span>
                  </div>
                  <div className="w-0.5 h-full bg-surface-container my-1"></div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-code-mono text-label-compact text-on-surface-variant font-semibold">
                      09:12 AM
                    </span>
                    <span className="font-label-compact text-[10px] px-1 bg-surface-container text-on-surface-variant rounded">
                      Hardware Entry
                    </span>
                  </div>
                  <p className="font-body-dense text-body-dense text-on-surface mt-0.5 leading-snug">
                    New Asset registered: Zebra ZT421 Industrial Barcode Printer (S/N: 42J2019024) in Warehouse Inventory.
                  </p>
                </div>
              </div>

              {/* Item 5 */}
              <div className="flex gap-space-sm items-start">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[14px]">router</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-code-mono text-label-compact text-on-surface-variant font-semibold">
                      08:30 AM
                    </span>
                    <span className="font-label-compact text-[10px] px-1 bg-surface-container text-on-surface-variant rounded">
                      Network Health
                    </span>
                  </div>
                  <p className="font-body-dense text-body-dense text-on-surface mt-0.5 leading-snug">
                    Shift Network Diagnostic: 16 Core Switches and 42 PoE APs ping verified (99.9% health nominal).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Operations Footer Action */}
          <div className="pt-space-md mt-space-md">
            <button
              onClick={onOpenAuditTrail}
              className="w-full py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors text-center text-caption font-caption text-on-surface font-medium block"
              type="button"
            >
              Open Audit Log Audit Trail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
