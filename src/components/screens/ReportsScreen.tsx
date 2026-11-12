'use client';

import React from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Activity,
  CheckCircle2,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import { Facility, SupportTicket } from '../../types';
import { exportFacilitiesToCsv, exportFullAuditReport } from '../../utils/exportCsv';
import { mockAssets } from '../../data/mockAssets';

interface ReportsScreenProps {
  facilities: Facility[];
  tickets: SupportTicket[];
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ facilities, tickets }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-[#131b2e] tracking-tight">
              Reports & Operational Analytics
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#ecfdf5] text-[#065f46] rounded-full border border-[#a7f3d0]">
              Q4 AUDIT CERTIFIED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#464555] mt-1">
            Historical SLA benchmarks, network bandwidth throughput, and hardware depreciation analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportFacilitiesToCsv(facilities)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-[#131b2e] border border-[#cbd5e1] rounded-lg shadow-level-1 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#5b598c]" />
            <span>Export Facility Matrix (CSV)</span>
          </button>
          <button
            onClick={() => exportFullAuditReport(facilities, mockAssets, tickets)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#4f46e5] hover:bg-[#3730a3] text-white rounded-lg shadow-level-1 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Download Full Audit Package</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-level-1">
          <span className="text-[11px] font-semibold text-[#777587] uppercase">
            Aggregated SLA Compliance
          </span>
          <div className="text-2xl font-bold font-mono text-[#131b2e] mt-1">99.85%</div>
          <p className="text-xs text-[#065f46] mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            +0.12% above quarterly SLA target
          </p>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-level-1">
          <span className="text-[11px] font-semibold text-[#777587] uppercase">
            Mean Time To Resolution (MTTR)
          </span>
          <div className="text-2xl font-bold font-mono text-[#131b2e] mt-1">1.4 Hours</div>
          <p className="text-xs text-[#464555] mt-1">
            18 active tickets · 2 critical resolved this week
          </p>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-level-1">
          <span className="text-[11px] font-semibold text-[#777587] uppercase">
            Total Hardware Asset Valuation
          </span>
          <div className="text-2xl font-bold font-mono text-[#131b2e] mt-1">$1.84M USD</div>
          <p className="text-xs text-[#464555] mt-1">
            864 cataloged units across 4 campuses
          </p>
        </div>
      </div>

      {/* Campus Breakdown Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-level-1 space-y-3">
        <h3 className="font-bold text-sm text-[#131b2e]">Campus SLA & Fleet Audit Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f8f9fc] text-[11px] font-semibold text-[#777587] uppercase border-b border-[#e2e8f0]">
                <th className="p-3">Facility</th>
                <th className="p-3">Category</th>
                <th className="p-3">Subnet</th>
                <th className="p-3">Active Units</th>
                <th className="p-3">SLA Status</th>
                <th className="p-3">Tickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {facilities.map((f) => (
                <tr key={f.id} className="hover:bg-[#faf8ff]">
                  <td className="p-3 font-semibold text-[#131b2e]">
                    {f.name} ({f.code})
                  </td>
                  <td className="p-3 text-[#464555] capitalize">{f.category}</td>
                  <td className="p-3 font-mono">{f.subnet}</td>
                  <td className="p-3 font-mono font-medium">{f.activeFleetCount}</td>
                  <td className="p-3 font-mono text-[#065f46] font-semibold">
                    {f.uptimePercent}% (Target: {f.slaTarget})
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        f.criticalTicketsCount > 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {f.openTicketsCount} Open
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

