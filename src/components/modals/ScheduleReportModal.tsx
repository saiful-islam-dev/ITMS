'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Modal } from '../common';

interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultReportTitle?: string;
}

export const ScheduleReportModal: React.FC<ScheduleReportModalProps> = ({
  isOpen,
  onClose,
  defaultReportTitle = 'Executive Monthly IT Governance & SLA Pack'
}) => {
  const [selectedReport, setSelectedReport] = useState(defaultReportTitle);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [deliveryTime, setDeliveryTime] = useState('08:00');
  const [deliveryDay, setDeliveryDay] = useState('1st of month');
  const [recipients, setRecipients] = useState('tariq.rahman@apexgarments.com, cto@apexgarments.com, it-ops@apexgarments.com');
  const [format, setFormat] = useState<'pdf' | 'xlsx' | 'csv'>('pdf');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    }, 500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Automated Analytics Dispatcher"
      subtitle="Configure scheduled delivery routines directly to leadership & plant auditors."
      icon={Calendar}
      maxWidth="lg"
    >
      <form onSubmit={handleSave} className="p-5 space-y-4">
        {/* Target Report Selection */}
        <div>
          <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1.5">
            Select Report Package
          </label>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-dense text-body-dense text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white cursor-pointer"
          >
            <option value="Executive Monthly IT Governance & SLA Pack">Executive Monthly IT Governance & SLA Pack</option>
            <option value="Garment Floor Asset Depreciation & Audit">Garment Floor Asset Depreciation & Audit (Ledger)</option>
            <option value="Line Network Uptime & Telemetry Log">Line Network Uptime & Telemetry Log (Raw Drops)</option>
            <option value="Full Comprehensive Cross-Campus Audit">Full Comprehensive Cross-Campus Audit</option>
          </select>
        </div>

        {/* Cadence Selector */}
        <div>
          <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1.5">
            Dispatch Cadence
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['daily', 'weekly', 'monthly'] as const).map((cadence) => (
              <button
                type="button"
                key={cadence}
                onClick={() => setFrequency(cadence)}
                className={`py-2 px-3 rounded-lg font-body-dense-medium text-body-dense text-center capitalize border transition-all cursor-pointer ${
                  frequency === cadence
                    ? 'bg-primary-container text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                }`}
              >
                {cadence}
              </button>
            ))}
          </div>
        </div>

        {/* Timing Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
              Dispatch Time (UTC)
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg">
              <Clock className="w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="bg-transparent border-0 outline-none w-full font-code-mono text-body-dense text-on-surface"
                placeholder="08:00 UTC"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
              Trigger Day
            </label>
            <input
              type="text"
              value={deliveryDay}
              onChange={(e) => setDeliveryDay(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-dense text-body-dense text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={frequency === 'weekly' ? 'Every Sunday' : '1st of every month'}
            />
          </div>
        </div>

        {/* Format selection */}
        <div>
          <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1.5">
            Export Format
          </label>
          <div className="flex gap-2">
            {(['pdf', 'xlsx', 'csv'] as const).map((fmt) => (
              <button
                type="button"
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-3 py-1.5 rounded-lg font-code-mono text-label-compact font-semibold uppercase border transition-all cursor-pointer ${
                  format === fmt
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Email Recipients */}
        <div>
          <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
            Email Recipients (Comma Separated)
          </label>
          <div className="flex items-start gap-2 p-2.5 bg-surface-container-low border border-outline-variant/60 rounded-lg">
            <Mail className="w-4 h-4 text-on-surface-variant mt-0.5" />
            <textarea
              rows={2}
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="bg-transparent border-0 outline-none w-full font-code-mono text-[12px] text-on-surface resize-none"
              placeholder="email1@apexgarments.com, email2@apexgarments.com"
            />
          </div>
        </div>

        {/* Confirmation Info Box */}
        <div className="p-3 bg-surface-container rounded-lg flex items-center gap-2.5 text-on-surface-variant text-caption">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>
            All scheduled PDF/XLSX dispatches include digital integrity checksums and encryption for auditor verification.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-body-dense-medium text-body-dense transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-container text-on-primary hover:bg-primary rounded-lg font-body-dense-medium text-body-dense shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                <span>Saving Dispatcher...</span>
              </>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Dispatcher Scheduled!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>Save Dispatch Schedule</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
