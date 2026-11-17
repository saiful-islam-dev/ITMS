'use client';

import React, { useState } from 'react';
import {
  Download,
  Calendar,
  Clock,
  TrendingUp,
  ArrowDown,
  ShieldCheck,
  Timer,
  Wallet,
  Wifi,
  PieChart,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  Sliders,
  Check,
  FileText
} from 'lucide-react';
import { Facility, SupportTicket } from '../../types';
import {
  exportFacilitiesToCsv,
  exportFullAuditReport,
  exportExecutiveReportTxt,
  exportAssetDepreciationCsv,
  exportTelemetryLogsCsv
} from '../../utils/exportCsv';
import { mockAssets } from '../../data/mockAssets';
import { useApp } from '../../context/AppContext';
import { ScheduleReportModal } from '../modals/ScheduleReportModal';
import { TechnicianAuditModal } from '../modals/TechnicianAuditModal';
import { PageHeader, TimeFilterPills, Toast } from '../common';
import { useToast } from '../../hooks';

interface ReportsScreenProps {
  facilities: Facility[];
  tickets: SupportTicket[];
}

interface WeekData {
  week: string;
  created: number;
  resolved: number;
  slaRate: number;
  createdHeight: number;
  resolvedHeight: number;
  xCreated: number;
  xResolved: number;
  cx: number;
  cy: number;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ facilities, tickets }) => {
  const { setIsExportModalOpen } = useApp();

  // State
  const [timePreset, setTimePreset] = useState<'7D' | '30D' | 'Q1/Q2' | 'YTD'>('30D');
  const [selectedFacility, setSelectedFacility] = useState<string>('All Facilities');
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [selectedDimension, setSelectedDimension] = useState<string>('SLA & Incidents');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast, showToast, clearToast } = useToast();

  // Dropdown open states
  const [facilityDropdownOpen, setFacilityDropdownOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [dimDropdownOpen, setDimDropdownOpen] = useState(false);

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDefaultTitle, setScheduleDefaultTitle] = useState<string>('Executive Monthly IT Governance & SLA Pack');
  const [isTechAuditModalOpen, setIsTechAuditModalOpen] = useState(false);

  // SVG Chart Hover Tooltip State
  const [hoveredWeek, setHoveredWeek] = useState<WeekData | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Telemetry resynced across all 4 plant networks & edge APs.');
    }, 600);
  };

  const openScheduleWithTitle = (title: string) => {
    setScheduleDefaultTitle(title);
    setIsScheduleModalOpen(true);
  };

  // Date label based on preset
  const getDateRangeLabel = () => {
    switch (timePreset) {
      case '7D':
        return 'May 11 - May 18, 2025';
      case '30D':
        return 'Apr 18 - May 18, 2025';
      case 'Q1/Q2':
        return 'Jan 01 - Jun 30, 2025';
      case 'YTD':
        return 'Jan 01 - May 18, 2025';
    }
  };

  // Chart data definition
  const weekData: WeekData[] = [
    { week: 'Week 16', created: 95, resolved: 88, slaRate: 94.8, createdHeight: 95, resolvedHeight: 88, xCreated: 40, xResolved: 66, cx: 64, cy: 54 },
    { week: 'Week 17', created: 110, resolved: 105, slaRate: 95.5, createdHeight: 110, resolvedHeight: 105, xCreated: 145, xResolved: 171, cx: 169, cy: 50 },
    { week: 'Week 18', created: 130, resolved: 122, slaRate: 96.2, createdHeight: 130, resolvedHeight: 122, xCreated: 250, xResolved: 276, cx: 269, cy: 46 },
    { week: 'Week 19', created: 85, resolved: 84, slaRate: 97.0, createdHeight: 85, resolvedHeight: 84, xCreated: 355, xResolved: 381, cx: 374, cy: 42 },
    { week: 'Week 20', created: 140, resolved: 138, slaRate: 98.1, createdHeight: 140, resolvedHeight: 138, xCreated: 460, xResolved: 486, cx: 484, cy: 38 },
    { week: 'Week 21 (Current)', created: 98, resolved: 96, slaRate: 98.6, createdHeight: 98, resolvedHeight: 96, xCreated: 565, xResolved: 591, cx: 604, cy: 36 }
  ];

  return (
    <div className="flex flex-col w-full space-y-space-md">
      {/* Toast Alert */}
      <Toast toast={toast} onClose={clearToast} />

      {/* Top Control Bar & Breadcrumb Sync */}
      <PageHeader
        title="Reports & Operational Analytics"
        subtitle="Comprehensive SLA reporting, asset lifecycle depreciation, incident breakdown, technician productivity, and factory IoT uptime telemetry across Apex Garments units."
        badge={
          <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container text-primary font-label-compact text-label-compact font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Real-time Telemetry &amp; SLA Audit
          </span>
        }
        actions={[
          {
            label: 'Schedule Automated Report',
            icon: <span className="material-symbols-outlined text-[16px] text-on-surface-variant">schedule</span>,
            onClick: () => openScheduleWithTitle('Executive Monthly IT Governance & SLA Pack'),
            variant: 'secondary'
          },
          {
            label: 'Export All Analytics (PDF/XLSX)',
            icon: <span className="material-symbols-outlined text-[16px]">download</span>,
            onClick: () => {
              if (setIsExportModalOpen) {
                setIsExportModalOpen(true);
              } else {
                exportFullAuditReport(facilities, mockAssets, tickets);
                showToast('Exporting complete certified audit package...');
              }
            },
            variant: 'primary'
          }
        ]}
      />

      {/* Filter & Granularity Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xs items-center bg-surface-container-lowest px-space-md py-2.5 rounded-xl shadow-sm border border-outline-variant/30 relative z-20">
        {/* Preset Pills */}
        <div className="md:col-span-4">
          <TimeFilterPills
            activePreset={timePreset}
            onSelectPreset={(p) => setTimePreset(p as any)}
            dateRangeLabel={getDateRangeLabel()}
          />
        </div>

        {/* Dropdown Filters & Live Toggle */}
        <div className="md:col-span-8 flex flex-wrap items-center justify-start md:justify-end gap-space-xs">
          {/* Facility Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setFacilityDropdownOpen(!facilityDropdownOpen);
                setDeptDropdownOpen(false);
                setDimDropdownOpen(false);
              }}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 bg-surface-container-low hover:bg-surface-container rounded-lg text-on-surface font-body-dense text-body-dense cursor-pointer transition-colors"
            >
              <span className="text-on-surface-variant font-label-compact text-label-compact">Facility:</span>
              <span className="font-body-dense-medium text-body-dense-medium">{selectedFacility}</span>
              <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
            </button>

            {facilityDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-level-2 py-1.5 z-30">
                <button
                  onClick={() => {
                    setSelectedFacility('All Facilities');
                    setFacilityDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-body-dense flex items-center justify-between hover:bg-surface-container-low cursor-pointer ${
                    selectedFacility === 'All Facilities' ? 'font-semibold text-primary' : 'text-on-surface'
                  }`}
                >
                  <span>All Facilities (Apex Garments)</span>
                  {selectedFacility === 'All Facilities' && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
                {facilities.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFacility(`${f.name} (${f.code})`);
                      setFacilityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-body-dense flex items-center justify-between hover:bg-surface-container-low cursor-pointer ${
                      selectedFacility.includes(f.code) ? 'font-semibold text-primary' : 'text-on-surface'
                    }`}
                  >
                    <span className="truncate">{f.name}</span>
                    {selectedFacility.includes(f.code) && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dept Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setDeptDropdownOpen(!deptDropdownOpen);
                setFacilityDropdownOpen(false);
                setDimDropdownOpen(false);
              }}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 bg-surface-container-low hover:bg-surface-container rounded-lg text-on-surface font-body-dense text-body-dense cursor-pointer transition-colors"
            >
              <span className="text-on-surface-variant font-label-compact text-label-compact">Dept:</span>
              <span className="font-body-dense-medium text-body-dense-medium">{selectedDept}</span>
              <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
            </button>

            {deptDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-level-2 py-1.5 z-30">
                {['All Departments', 'Cutting & Sewing', 'Washing & Dyeing', 'CAD & Design Studio', 'Warehouse & Logistics', 'IT Operations'].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDept(d);
                      setDeptDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-body-dense flex items-center justify-between hover:bg-surface-container-low cursor-pointer ${
                      selectedDept === d ? 'font-semibold text-primary' : 'text-on-surface'
                    }`}
                  >
                    <span>{d}</span>
                    {selectedDept === d && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dimension Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setDimDropdownOpen(!dimDropdownOpen);
                setFacilityDropdownOpen(false);
                setDeptDropdownOpen(false);
              }}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 bg-surface-container-low hover:bg-surface-container rounded-lg text-on-surface font-body-dense text-body-dense cursor-pointer transition-colors"
            >
              <span className="text-on-surface-variant font-label-compact text-label-compact">Dimension:</span>
              <span className="font-body-dense-medium text-body-dense-medium text-primary">{selectedDimension}</span>
              <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
            </button>

            {dimDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-level-2 py-1.5 z-30">
                {['SLA & Incidents', 'Capex & Depreciation', 'IoT Plant Fleet Telemetry', 'Technician Velocity'].map((dim) => (
                  <button
                    key={dim}
                    onClick={() => {
                      setSelectedDimension(dim);
                      setDimDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-body-dense flex items-center justify-between hover:bg-surface-container-low cursor-pointer ${
                      selectedDimension === dim ? 'font-semibold text-primary' : 'text-on-surface'
                    }`}
                  >
                    <span>{dim}</span>
                    {selectedDimension === dim && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live Toggle */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-container rounded-lg text-on-surface font-label-compact text-label-compact ml-auto md:ml-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-code-mono text-on-surface">LIVE (5m)</span>
            <button
              onClick={handleRefresh}
              className="p-0.5 text-on-surface-variant hover:text-on-surface rounded transition-colors cursor-pointer"
              title="Force Telemetry Refresh"
            >
              <span className={`material-symbols-outlined text-[14px] ${isRefreshing ? 'animate-spin' : ''}`}>
                refresh
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Stat 1: SLA */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-compact text-label-compact text-on-surface-variant uppercase tracking-wider">
              Overall SLA Compliance
            </span>
            <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
          </div>
          <div className="my-space-xs flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface tracking-tight">97.4%</span>
            <span className="inline-flex items-center font-code-mono text-label-compact font-semibold text-primary">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +1.8%
            </span>
          </div>
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden flex">
              <div className="bg-primary h-full rounded-full" style={{ width: '97.4%' }}></div>
            </div>
            <div className="flex justify-between items-center font-code-mono text-[10px] text-on-surface-variant">
              <span>Target ≥95%</span>
              <span>P1: 99.2% | P2: 96.8%</span>
            </div>
          </div>
        </div>

        {/* Stat 2: MTTR */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-compact text-label-compact text-on-surface-variant uppercase tracking-wider">
              Mean Time to Resolution (MTTR)
            </span>
            <span className="material-symbols-outlined text-[18px] text-tertiary">timer</span>
          </div>
          <div className="my-space-xs flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface tracking-tight">2h 14m</span>
            <span className="inline-flex items-center font-code-mono text-label-compact font-semibold text-tertiary">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span> -38m WoW
            </span>
          </div>
          <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
            <span>First Contact Resolution (FCR)</span>
            <span className="font-code-mono font-medium text-on-surface">64.2%</span>
          </div>
        </div>

        {/* Stat 3: IT Capex & Opex */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-compact text-label-compact text-on-surface-variant uppercase tracking-wider">
              Total Capex &amp; Opex (YTD)
            </span>
            <span className="material-symbols-outlined text-[18px] text-secondary">account_balance_wallet</span>
          </div>
          <div className="my-space-xs flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface tracking-tight">$342,850</span>
            <span className="font-label-compact text-label-compact text-on-surface-variant">88.4% of budget</span>
          </div>
          <div className="flex items-center justify-between font-code-mono text-[10px] text-on-surface-variant truncate">
            <span>Lease $184k</span>
            <span className="text-outline">•</span>
            <span>SaaS $92k</span>
            <span className="text-outline">•</span>
            <span>Spares $66k</span>
          </div>
        </div>

        {/* Stat 4: IoT Fleet Uptime */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-compact text-label-compact text-on-surface-variant uppercase tracking-wider">
              IoT &amp; Plant Fleet Uptime
            </span>
            <span className="material-symbols-outlined text-[18px] text-primary">router</span>
          </div>
          <div className="my-space-xs flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface tracking-tight">99.88%</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-primary">
              0 Line Halts
            </span>
          </div>
          <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
            <span>Edge SD-WAN &amp; 18 High-Bay APs</span>
            <span className="font-code-mono font-medium text-on-surface">3,420 pkts/s</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Section (2/3 + 1/3 Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Primary Chart: Incident Volume vs Resolution SLA Over Time */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-space-md">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Incident Volume vs. Resolution SLA</h2>
              <p className="font-caption text-caption text-on-surface-variant">Weekly ticket creation vs. cleared work orders with strict SLA threshold</p>
            </div>
            <div className="flex items-center gap-space-sm font-label-compact text-label-compact">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary-container"></span>
                <span className="text-on-surface-variant">Created</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-surface-container-highest"></span>
                <span className="text-on-surface-variant">Resolved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-primary"></span>
                <span className="text-on-surface">SLA Rate (%)</span>
              </div>
            </div>
          </div>

          {/* Inline SVG Chart Component */}
          <div className="relative w-full h-56 pt-2">
            {/* Tooltip Popup on Hover */}
            {hoveredWeek && (
              <div
                className="absolute z-30 pointer-events-none bg-surface-container-lowest border border-outline-variant/60 shadow-level-2 p-2 rounded-lg text-xs"
                style={{
                  left: `${Math.min(520, Math.max(30, (hoveredWeek.cx / 680) * 100))}%`,
                  top: '10px'
                }}
              >
                <div className="font-bold text-on-surface">{hoveredWeek.week}</div>
                <div className="flex items-center gap-2 mt-0.5 text-on-surface-variant font-code-mono text-[11px]">
                  <span>Created: <strong className="text-primary-container">{hoveredWeek.created}</strong></span>
                  <span>·</span>
                  <span>Resolved: <strong className="text-[#3525cd]">{hoveredWeek.resolved}</strong></span>
                </div>
                <div className="text-primary font-semibold text-[11px] mt-0.5">
                  SLA: {hoveredWeek.slaRate}% ({Math.round((hoveredWeek.resolved / hoveredWeek.created) * 100)}% Clearance)
                </div>
              </div>
            )}

            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 680 200">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"></stop>
                </linearGradient>
              </defs>
              {/* Horizontal Grid Lines */}
              <line stroke="#eaedff" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="680" y1="20" y2="20"></line>
              <line stroke="#eaedff" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="680" y1="70" y2="70"></line>
              <line stroke="#eaedff" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="680" y1="120" y2="120"></line>
              <line stroke="#eaedff" strokeWidth="1" x1="0" x2="680" y1="170" y2="170"></line>

              {/* Target SLA Line (95%) at y = 50 */}
              <line stroke="#3525cd" strokeDasharray="4 2" strokeWidth="1" x1="0" x2="680" y1="50" y2="50"></line>
              <text fill="#3525cd" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="640" y="44">SLA 95% THRESHOLD</text>

              {/* Grouped Bars: 6 weeks (W16 - W21) */}
              {weekData.map((w, index) => (
                <g
                  key={w.week}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredWeek(w)}
                  onMouseLeave={() => setHoveredWeek(null)}
                >
                  {/* Created Bar */}
                  <rect
                    fill="#4f46e5"
                    height={w.createdHeight}
                    rx="3"
                    width="22"
                    x={w.xCreated}
                    y={170 - w.createdHeight}
                    className="transition-opacity group-hover:opacity-85"
                  ></rect>
                  {/* Resolved Bar */}
                  <rect
                    fill="#dae2fd"
                    height={w.resolvedHeight}
                    rx="3"
                    width="22"
                    x={w.xResolved}
                    y={170 - w.resolvedHeight}
                    className="transition-opacity group-hover:opacity-85"
                  ></rect>
                </g>
              ))}

              {/* Smooth Trend Line for SLA Compliance % */}
              <path
                d="M 64 54 C 150 48, 200 58, 269 46 C 340 38, 400 48, 484 38 C 550 32, 600 36, 604 36"
                fill="none"
                stroke="#3525cd"
                strokeWidth="2.5"
              ></path>

              {/* SLA Points */}
              {weekData.map((w) => (
                <circle
                  key={`dot-${w.week}`}
                  cx={w.cx}
                  cy={w.cy}
                  fill="#ffffff"
                  r={hoveredWeek?.week === w.week ? 5 : 3.5}
                  stroke="#3525cd"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredWeek(w)}
                  onMouseLeave={() => setHoveredWeek(null)}
                ></circle>
              ))}
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between px-6 pt-2 font-code-mono text-[11px] text-on-surface-variant">
              <span>Week 16</span>
              <span>Week 17</span>
              <span>Week 18</span>
              <span>Week 19</span>
              <span>Week 20</span>
              <span className="font-semibold text-primary">Week 21 (Current)</span>
            </div>
          </div>

          {/* Quick Summary Footnote */}
          <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-caption text-caption border-t border-surface-container-high/60">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              <span>Average clearance time: <strong>1.8 days</strong> from triage to sign-off</span>
            </div>
            <span className="font-code-mono text-label-compact text-on-surface">Total Tickets Resolved: 633 / 658</span>
          </div>
        </div>

        {/* Category Breakdown Chart: Distribution by Equipment */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Equipment Distribution</h2>
              <span className="material-symbols-outlined text-[16px] text-outline">pie_chart</span>
            </div>
            <p className="font-caption text-caption text-on-surface-variant mb-space-md">Incident categories across manufacturing &amp; office assets</p>

            {/* Visual Segmented Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-surface-container mb-space-md shadow-xs">
              <div className="bg-primary h-full transition-all" style={{ width: '38%' }} title="Industrial Barcode & RFID: 38%"></div>
              <div className="bg-primary-container h-full transition-all" style={{ width: '24%' }} title="Factory Floor VLAN & Switches: 24%"></div>
              <div className="bg-tertiary h-full transition-all" style={{ width: '16%' }} title="CAD & Design Workstations: 16%"></div>
              <div className="bg-secondary h-full transition-all" style={{ width: '14%' }} title="End-User Laptops & Email: 14%"></div>
              <div className="bg-outline h-full transition-all" style={{ width: '8%' }} title="CCTV & Access Control: 8%"></div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2">
              {/* Item 1 */}
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
                  <span className="font-body-dense text-body-dense text-on-surface">Industrial Barcode &amp; RFID</span>
                </div>
                <div className="flex items-center gap-space-sm font-code-mono text-label-compact">
                  <span className="font-semibold text-on-surface">38%</span>
                  <span className="text-on-surface-variant">250 tkts</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container shrink-0"></span>
                  <span className="font-body-dense text-body-dense text-on-surface">Floor VLAN &amp; Switches</span>
                </div>
                <div className="flex items-center gap-space-sm font-code-mono text-label-compact">
                  <span className="font-semibold text-on-surface">24%</span>
                  <span className="text-on-surface-variant">158 tkts</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary shrink-0"></span>
                  <span className="font-body-dense text-body-dense text-on-surface">CAD &amp; Design Workstations</span>
                </div>
                <div className="flex items-center gap-space-sm font-code-mono text-label-compact">
                  <span className="font-semibold text-on-surface">16%</span>
                  <span className="text-on-surface-variant">105 tkts</span>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
                  <span className="font-body-dense text-body-dense text-on-surface">End-User Laptops &amp; M365</span>
                </div>
                <div className="flex items-center gap-space-sm font-code-mono text-label-compact">
                  <span className="font-semibold text-on-surface">14%</span>
                  <span className="text-on-surface-variant">92 tkts</span>
                </div>
              </div>

              {/* Item 5 */}
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-outline shrink-0"></span>
                  <span className="font-body-dense text-body-dense text-on-surface">CCTV &amp; Access Turnstiles</span>
                </div>
                <div className="flex items-center gap-space-sm font-code-mono text-label-compact">
                  <span className="font-semibold text-on-surface">8%</span>
                  <span className="text-on-surface-variant">53 tkts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Peripheral Context */}
          <div className="mt-space-sm p-space-xs bg-surface-container-low rounded-lg flex items-center justify-between border border-surface-container">
            <span className="font-label-compact text-label-compact text-on-surface-variant">Primary Failure Mode:</span>
            <span className="font-code-mono text-label-compact font-medium text-error">Thermal Head Wear</span>
          </div>
        </div>
      </div>

      {/* Deep Dive Modules (Split 7 / 5 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Module A: Technician Performance & Workload Velocity */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Technician Performance &amp; Velocity</h2>
                <p className="font-caption text-caption text-on-surface-variant">Operational output, turnaround velocity, and verified employee feedback</p>
              </div>
              <button
                onClick={() => setIsTechAuditModalOpen(true)}
                className="text-primary hover:text-primary-container font-label-compact text-label-compact flex items-center gap-0.5 cursor-pointer"
              >
                Full Audit <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            {/* High-Density Performance Table */}
            <div className="overflow-x-auto mt-space-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low font-label-compact text-label-compact text-on-surface-variant uppercase">
                    <th className="py-2 px-space-sm rounded-l-lg">Technician / Specialist</th>
                    <th className="py-2 px-space-xs text-center">Closed</th>
                    <th className="py-2 px-space-xs text-center">Avg MTTR</th>
                    <th className="py-2 px-space-xs text-center">SLA Rate</th>
                    <th className="py-2 px-space-sm text-right rounded-r-lg">CSAT</th>
                  </tr>
                </thead>
                <tbody className="font-body-dense text-body-dense divide-y divide-surface-container-low">
                  {/* Tech 1 */}
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-code-mono text-[10px] font-bold">
                          TR
                        </div>
                        <div>
                          <div className="font-body-dense-medium text-body-dense-medium text-on-surface">Tariq Rahman</div>
                          <div className="font-label-compact text-[10px] text-on-surface-variant">IT Ops Lead / Super Admin</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-space-xs text-center font-code-mono font-medium">84</td>
                    <td className="py-2 px-space-xs text-center font-code-mono text-on-surface-variant">1.4h</td>
                    <td className="py-2 px-space-xs text-center">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[11px] font-code-mono font-semibold bg-surface-container text-primary">
                        98.8%
                      </span>
                    </td>
                    <td className="py-2 px-space-sm text-right font-code-mono font-medium text-on-surface">
                      <span className="text-amber-500 mr-0.5">★</span>4.9
                    </td>
                  </tr>

                  {/* Tech 2 */}
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-code-mono text-[10px] font-bold">
                          FY
                        </div>
                        <div>
                          <div className="font-body-dense-medium text-body-dense-medium text-on-surface">Farhana Yeasmin</div>
                          <div className="font-label-compact text-[10px] text-on-surface-variant">Logistics &amp; Systems Tech</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-space-xs text-center font-code-mono font-medium">68</td>
                    <td className="py-2 px-space-xs text-center font-code-mono text-on-surface-variant">2.1h</td>
                    <td className="py-2 px-space-xs text-center">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[11px] font-code-mono font-semibold bg-surface-container text-primary">
                        97.5%
                      </span>
                    </td>
                    <td className="py-2 px-space-sm text-right font-code-mono font-medium text-on-surface">
                      <span className="text-amber-500 mr-0.5">★</span>4.8
                    </td>
                  </tr>

                  {/* Tech 3 */}
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <div className="w-6 h-6 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center font-code-mono text-[10px] font-bold">
                          RK
                        </div>
                        <div>
                          <div className="font-body-dense-medium text-body-dense-medium text-on-surface">Rezaul Karim</div>
                          <div className="font-label-compact text-[10px] text-on-surface-variant">CAD Systems Specialist</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-space-xs text-center font-code-mono font-medium">52</td>
                    <td className="py-2 px-space-xs text-center font-code-mono text-on-surface-variant">2.6h</td>
                    <td className="py-2 px-space-xs text-center">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[11px] font-code-mono font-semibold bg-surface-container text-primary">
                        96.2%
                      </span>
                    </td>
                    <td className="py-2 px-space-sm text-right font-code-mono font-medium text-on-surface">
                      <span className="text-amber-500 mr-0.5">★</span>4.9
                    </td>
                  </tr>

                  {/* Tech 4 */}
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <div className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-code-mono text-[10px] font-bold">
                          KH
                        </div>
                        <div>
                          <div className="font-body-dense-medium text-body-dense-medium text-on-surface">Kabir Hossain</div>
                          <div className="font-label-compact text-[10px] text-on-surface-variant">Factory A Field Lead</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-space-xs text-center font-code-mono font-medium">96</td>
                    <td className="py-2 px-space-xs text-center font-code-mono text-on-surface-variant">1.9h</td>
                    <td className="py-2 px-space-xs text-center">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[11px] font-code-mono font-semibold bg-surface-container text-primary">
                        95.8%
                      </span>
                    </td>
                    <td className="py-2 px-space-sm text-right font-code-mono font-medium text-on-surface">
                      <span className="text-amber-500 mr-0.5">★</span>4.7
                    </td>
                  </tr>

                  {/* Tech 5 */}
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-code-mono text-[10px] font-bold">
                          RI
                        </div>
                        <div>
                          <div className="font-body-dense-medium text-body-dense-medium text-on-surface">Rafiqul Islam</div>
                          <div className="font-label-compact text-[10px] text-on-surface-variant">Factory B Senior Tech</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-space-xs text-center font-code-mono font-medium">78</td>
                    <td className="py-2 px-space-xs text-center font-code-mono text-on-surface-variant">2.4h</td>
                    <td className="py-2 px-space-xs text-center">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[11px] font-code-mono font-semibold bg-surface-container-high text-on-surface-variant">
                        94.6%
                      </span>
                    </td>
                    <td className="py-2 px-space-sm text-right font-code-mono font-medium text-on-surface">
                      <span className="text-amber-500 mr-0.5">★</span>4.6
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-caption text-caption border-t border-surface-container-high/60">
            <span>Team Capacity Load: <strong>78.4%</strong> (Optimal Range)</span>
            <span className="font-code-mono text-label-compact">Shift Coverage: 24/7 Rotational</span>
          </div>
        </div>

        {/* Module B: Facility Incident Heatmap & Downtime Cost Risk */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Facility Downtime Risk Index</h2>
                <p className="font-caption text-caption text-on-surface-variant">Micro-stoppages &amp; network fault exposure by plant location</p>
              </div>
              <span className="material-symbols-outlined text-[18px] text-error">warning</span>
            </div>

            {/* Campus List with Risk Cards */}
            <div className="space-y-space-xs mt-space-sm">
              {/* Factory Building A */}
              <div
                onClick={() => {
                  setSelectedFacility('Factory Building A (LOC-FCT-01)');
                  showToast('Focused on Factory Building A telemetry & SLA');
                }}
                className={`p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border ${
                  selectedFacility.includes('LOC-FCT-01') ? 'border-primary' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body-dense-medium text-body-dense-medium text-on-surface">Factory Building A (Sewing &amp; Cut)</span>
                  <span className="inline-flex px-1.5 py-0.5 rounded font-label-compact text-label-compact font-semibold bg-error-container text-on-error-container">
                    High Volume
                  </span>
                </div>
                <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
                  <span>312 incidents/mo • Lint &amp; thermal head wear</span>
                  <span className="font-code-mono font-semibold text-error">$4,200 loss</span>
                </div>
              </div>

              {/* Factory Building B */}
              <div
                onClick={() => {
                  setSelectedFacility('Factory Building B (LOC-FCT-02)');
                  showToast('Focused on Factory Building B telemetry & SLA');
                }}
                className={`p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border ${
                  selectedFacility.includes('LOC-FCT-02') ? 'border-primary' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body-dense-medium text-body-dense-medium text-on-surface">Factory Building B (Washing &amp; Dye)</span>
                  <span className="inline-flex px-1.5 py-0.5 rounded font-label-compact text-label-compact font-semibold bg-surface-container-highest text-primary">
                    High Severity
                  </span>
                </div>
                <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
                  <span>148 incidents/mo • Humidity &amp; IP65 switch enclosure</span>
                  <span className="font-code-mono font-semibold text-on-surface">$2,150 loss</span>
                </div>
              </div>

              {/* Central Fabric Warehouse */}
              <div
                onClick={() => {
                  setSelectedFacility('Central Fabric Warehouse (LOC-WH-01)');
                  showToast('Focused on Central Fabric Warehouse telemetry & SLA');
                }}
                className={`p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border ${
                  selectedFacility.includes('LOC-WH-01') ? 'border-primary' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body-dense-medium text-body-dense-medium text-on-surface">Central Fabric Warehouse</span>
                  <span className="inline-flex px-1.5 py-0.5 rounded font-label-compact text-label-compact font-semibold bg-surface-container text-on-surface-variant">
                    Low Risk
                  </span>
                </div>
                <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
                  <span>64 incidents/mo • 99.9% RFID scanner throughput</span>
                  <span className="font-code-mono font-semibold text-primary">$320 loss</span>
                </div>
              </div>

              {/* Apex HQ Corporate & CAD */}
              <div
                onClick={() => {
                  setSelectedFacility('Apex HQ & Design Studio (LOC-CORP-01)');
                  showToast('Focused on Apex HQ telemetry & SLA');
                }}
                className={`p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border ${
                  selectedFacility.includes('LOC-CORP-01') ? 'border-primary' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body-dense-medium text-body-dense-medium text-on-surface">Apex HQ Corporate &amp; CAD</span>
                  <span className="inline-flex px-1.5 py-0.5 rounded font-label-compact text-label-compact font-semibold bg-surface-container text-on-surface-variant">
                    Standard
                  </span>
                </div>
                <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
                  <span>112 incidents/mo • Software patch &amp; design licenses</span>
                  <span className="font-code-mono font-semibold text-on-surface">$580 loss</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-caption text-caption border-t border-surface-container-high/60">
            <span>Aggregate Monthly Downtime Impact:</span>
            <span className="font-code-mono font-bold text-on-surface">$7,250 USD</span>
          </div>
        </div>
      </div>

      {/* Export & Scheduled Automated Reports Catalog */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Automated Governance &amp; Exportable Reports</h2>
            <p className="font-caption text-caption text-on-surface-variant">Direct downloads, auditor verification extracts, and management dispatch routines</p>
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => openScheduleWithTitle('Automated Analytics Dispatcher')}
              className="inline-flex items-center gap-1 px-space-sm py-1 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-body-dense-medium text-body-dense-medium transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>Configure Dispatchers</span>
            </button>
          </div>
        </div>

        {/* Reports Grid (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {/* Report 1 */}
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between hover:bg-surface-container transition-colors border border-surface-container">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="px-2 py-0.5 rounded font-code-mono text-[10px] font-bold bg-error-container text-on-error-container">
                  PDF
                </span>
                <span className="font-label-compact text-label-compact text-on-surface-variant">Every 1st of month</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                Executive Monthly IT Governance &amp; SLA Pack
              </h3>
              <p className="font-caption text-caption text-on-surface-variant mb-space-md">
                Full compliance audit, security incidents, MTTR curves, and infrastructure health signed off for Board Review.
              </p>
            </div>

            <div className="flex items-center justify-between pt-space-xs border-t border-surface-container-high/60">
              <div className="flex items-center gap-1 font-code-mono text-label-compact text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">history</span>
                <span>May 01, 2025</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openScheduleWithTitle('Executive Monthly IT Governance & SLA Pack')}
                  className="p-1 rounded hover:bg-surface-container-lowest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  title="Edit Schedule"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                </button>
                <button
                  onClick={() => {
                    exportExecutiveReportTxt(facilities, tickets);
                    showToast('Downloaded Executive Monthly IT Governance Pack (PDF/TXT).');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container-lowest hover:bg-white text-primary font-body-dense-medium text-body-dense-medium rounded shadow-xs transition-colors cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>

          {/* Report 2 */}
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between hover:bg-surface-container transition-colors border border-surface-container">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="px-2 py-0.5 rounded font-code-mono text-[10px] font-bold bg-surface-container text-primary">
                  XLSX
                </span>
                <span className="font-label-compact text-label-compact text-on-surface-variant">Weekly (Sundays)</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                Garment Floor Asset Depreciation &amp; Audit
              </h3>
              <p className="font-caption text-caption text-on-surface-variant mb-space-md">
                Comprehensive ledger with serial numbers, warranty expiry dates, line assignments, and replacement cost forecast.
              </p>
            </div>

            <div className="flex items-center justify-between pt-space-xs border-t border-surface-container-high/60">
              <div className="flex items-center gap-1 font-code-mono text-label-compact text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">history</span>
                <span>May 14, 2025</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openScheduleWithTitle('Garment Floor Asset Depreciation & Audit')}
                  className="p-1 rounded hover:bg-surface-container-lowest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  title="Edit Schedule"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                </button>
                <button
                  onClick={() => {
                    exportAssetDepreciationCsv(mockAssets);
                    showToast('Downloaded Asset Depreciation Ledger (CSV/XLSX).');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container-lowest hover:bg-white text-primary font-body-dense-medium text-body-dense-medium rounded shadow-xs transition-colors cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>

          {/* Report 3 */}
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between hover:bg-surface-container transition-colors border border-surface-container">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="px-2 py-0.5 rounded font-code-mono text-[10px] font-bold bg-surface-container text-tertiary">
                  CSV / RAW
                </span>
                <span className="font-label-compact text-label-compact text-on-surface-variant">Daily at 00:00 UTC</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                Line Network Uptime &amp; Telemetry Log
              </h3>
              <p className="font-caption text-caption text-on-surface-variant mb-space-md">
                Raw switch port metrics, edge gateway drop-rates, high-bay AP association counts, and wireless signal heat logs.
              </p>
            </div>

            <div className="flex items-center justify-between pt-space-xs border-t border-surface-container-high/60">
              <div className="flex items-center gap-1 font-code-mono text-label-compact text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">history</span>
                <span>Today, 06:00</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openScheduleWithTitle('Line Network Uptime & Telemetry Log')}
                  className="p-1 rounded hover:bg-surface-container-lowest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  title="Edit Schedule"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                </button>
                <button
                  onClick={() => {
                    exportTelemetryLogsCsv(facilities);
                    showToast('Generated & downloaded real-time line telemetry log.');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container-lowest hover:bg-white text-primary font-body-dense-medium text-body-dense-medium rounded shadow-xs transition-colors cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                  <span>Run On-Demand</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Report Modal */}
      <ScheduleReportModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        defaultReportTitle={scheduleDefaultTitle}
      />

      {/* Technician Audit Modal */}
      <TechnicianAuditModal
        isOpen={isTechAuditModalOpen}
        onClose={() => setIsTechAuditModalOpen(false)}
      />
    </div>
  );
};
