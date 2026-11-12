import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Facility } from '../../types';
import { mockAssets } from '../../data/mockAssets';
import { mockTickets } from '../../data/mockTickets';
import { exportFacilitiesToCsv, exportFullAuditReport } from '../../utils/exportCsv';

interface ExportReportModalProps {
  isOpen: boolean;
  facilities: Facility[];
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  facilities,
  onClose
}) => {
  const [includeAssets, setIncludeAssets] = useState(true);
  const [includeTickets, setIncludeTickets] = useState(true);
  const [includeTelemetry, setIncludeTelemetry] = useState(true);
  const [exportFormat, setExportFormat] = useState<'csv' | 'txt'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadCompleted, setDownloadCompleted] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      if (exportFormat === 'csv') {
        exportFacilitiesToCsv(facilities);
      } else {
        exportFullAuditReport(facilities, mockAssets, mockTickets);
      }
      setIsExporting(false);
      setDownloadCompleted(true);
      setTimeout(() => {
        setDownloadCompleted(false);
        onClose();
      }, 1500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white border border-[#cbd5e1] rounded-2xl w-full max-w-md shadow-level-3 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-[#f1f5f9] flex items-center justify-between bg-[#fbfbff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#eaedff] text-[#3525cd] rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#131b2e]">
                Export Facility Audit & Telemetry
              </h3>
              <p className="text-xs text-[#777587]">
                Generate certified IT infrastructure reports for executive review.
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

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-2">
              Select Output Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('csv')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  exportFormat === 'csv'
                    ? 'border-[#3525cd] bg-[#eaedff]/40 text-[#3525cd]'
                    : 'border-[#e2e8f0] bg-white text-[#464555] hover:bg-slate-50'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 mt-0.5" />
                <div>
                  <div className="font-semibold text-xs text-[#131b2e]">CSV Spreadsheet</div>
                  <div className="text-[10px] text-[#777587]">All subnets, hosts & SLAs</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('txt')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  exportFormat === 'txt'
                    ? 'border-[#3525cd] bg-[#eaedff]/40 text-[#3525cd]'
                    : 'border-[#e2e8f0] bg-white text-[#464555] hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4 mt-0.5" />
                <div>
                  <div className="font-semibold text-xs text-[#131b2e]">Full Audit Package</div>
                  <div className="text-[10px] text-[#777587]">Tickets, serials & logs</div>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#f1f5f9]">
            <label className="block text-xs font-semibold text-[#131b2e]">
              Data Fields Inclusion
            </label>
            <div className="space-y-1.5 text-xs text-[#464555]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTelemetry}
                  onChange={(e) => setIncludeTelemetry(e.target.checked)}
                  className="rounded text-[#3525cd] focus:ring-0"
                />
                <span>Include SD-WAN Tunnel Latency & Jitter metrics</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAssets}
                  onChange={(e) => setIncludeAssets(e.target.checked)}
                  className="rounded text-[#3525cd] focus:ring-0"
                />
                <span>Include 864 cataloged hardware units sample breakdown</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTickets}
                  onChange={(e) => setIncludeTickets(e.target.checked)}
                  className="rounded text-[#3525cd] focus:ring-0"
                />
                <span>Include Open Support Tickets & Critical Incidents</span>
              </label>
            </div>
          </div>

          <div className="p-3 bg-[#f8f9fe] border border-[#e2e8f0] rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#777587]">Scope:</span>
            <span className="font-semibold font-mono text-[#131b2e]">
              4 Facilities · 18 Tickets · 864 Units
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#464555] hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="px-4 py-2 text-xs font-semibold bg-[#4f46e5] hover:bg-[#3730a3] text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {downloadCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Report Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Generating...' : 'Download Report'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

