'use client';

import React from 'react';
import { Award, Star } from 'lucide-react';
import { Modal } from '../common';

interface TechnicianAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SpecialistStats {
  id: string;
  name: string;
  initials: string;
  role: string;
  facility: string;
  shift: string;
  closed: number;
  avgMttr: string;
  slaRate: string;
  csat: number;
  certifications: string[];
  resolvedCategories: string;
}

const technicians: SpecialistStats[] = [
  {
    id: 'emp-001',
    name: 'Tariq Rahman',
    initials: 'TR',
    role: 'IT Operations Lead & Super Admin',
    facility: 'Apex HQ & Design Studio',
    shift: 'General (09:00 - 18:00)',
    closed: 84,
    avgMttr: '1.4h',
    slaRate: '98.8%',
    csat: 4.9,
    certifications: ['CCNP Enterprise', 'Fortinet NSE 7', 'AWS Solutions Architect'],
    resolvedCategories: 'Core Routing, Firewall, SAN Storage, Executive Support'
  },
  {
    id: 'emp-004',
    name: 'Kabir Hossain',
    initials: 'KH',
    role: 'Factory A Field Lead',
    facility: 'Factory Building A (Sewing & Cut)',
    shift: 'Shift A (06:00 - 14:00)',
    closed: 96,
    avgMttr: '1.9h',
    slaRate: '95.8%',
    csat: 4.7,
    certifications: ['CompTIA Network+', 'Zebra Certified Tech'],
    resolvedCategories: 'Industrial RFID, Thermal Barcode Printers, Floor Edge Switches'
  },
  {
    id: 'emp-005',
    name: 'Rafiqul Islam',
    initials: 'RI',
    role: 'Factory B Senior Tech',
    facility: 'Factory Building B (Washing & Dye)',
    shift: 'Shift B (14:00 - 22:00)',
    closed: 78,
    avgMttr: '2.4h',
    slaRate: '94.6%',
    csat: 4.6,
    certifications: ['Schneider EcoStruxure', 'Cisco CCNA'],
    resolvedCategories: 'IP65 Rugged Enclosures, Humid Environment Switches, IoT Sensors'
  },
  {
    id: 'emp-006',
    name: 'Farhana Yeasmin',
    initials: 'FY',
    role: 'Logistics & Systems Tech',
    facility: 'Central Fabric Warehouse',
    shift: 'Shift A (06:00 - 14:00)',
    closed: 68,
    avgMttr: '2.1h',
    slaRate: '97.5%',
    csat: 4.8,
    certifications: ['Honeywell Scanning Pro', 'Aruba ACMA'],
    resolvedCategories: 'Handheld Scanners, Long-Range High-Bay APs, Barcode Hubs'
  },
  {
    id: 'emp-003',
    name: 'Rezaul Karim',
    initials: 'RK',
    role: 'CAD Systems Specialist',
    facility: 'Apex HQ & Design Studio',
    shift: 'General (09:00 - 18:00)',
    closed: 52,
    avgMttr: '2.6h',
    slaRate: '96.2%',
    csat: 4.9,
    certifications: ['Optitex Certified', 'Nvidia Studio Pro'],
    resolvedCategories: '3D CAD Workstations, Plotter Calibration, GPU Render Nodes'
  }
];

export const TechnicianAuditModal: React.FC<TechnicianAuditModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            IT Engineering &amp; Specialist Productivity Audit
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-compact text-label-compact font-bold">
            Q2 BENCHMARK
          </span>
        </div>
      }
      subtitle="Verified work order turnaround, SLA compliance metrics, and technical specialization."
      icon={Award}
      maxWidth="3xl"
    >
      <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
        {/* Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-container-low p-3.5 rounded-xl border border-surface-container">
          <div>
            <div className="font-label-compact text-label-compact text-on-surface-variant uppercase">Total Resolved</div>
            <div className="font-metric-display text-metric-display text-on-surface">378</div>
            <div className="font-caption text-[11px] text-[#065f46] font-medium">+12% vs Q1</div>
          </div>
          <div>
            <div className="font-label-compact text-label-compact text-on-surface-variant uppercase">Mean MTTR</div>
            <div className="font-metric-display text-metric-display text-on-surface">2.08h</div>
            <div className="font-caption text-[11px] text-tertiary font-medium">Within 4h SLA</div>
          </div>
          <div>
            <div className="font-label-compact text-label-compact text-on-surface-variant uppercase">Fleet SLA Rate</div>
            <div className="font-metric-display text-metric-display text-primary">96.6%</div>
            <div className="font-caption text-[11px] text-on-surface-variant">Target ≥95%</div>
          </div>
          <div>
            <div className="font-label-compact text-label-compact text-on-surface-variant uppercase">Avg CSAT</div>
            <div className="font-metric-display text-metric-display text-amber-600 flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              4.78
            </div>
            <div className="font-caption text-[11px] text-on-surface-variant">99.1% Positive</div>
          </div>
        </div>

        {/* Cards for each tech */}
        <div className="space-y-3">
          {technicians.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40 transition-all flex flex-col gap-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-code-mono text-xs font-bold shadow-xs">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-body-dense-medium text-body-dense-medium text-on-surface flex items-center gap-2">
                      <span>{t.name}</span>
                      <span className="font-label-compact text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-normal">
                        {t.shift}
                      </span>
                    </div>
                    <div className="font-caption text-caption text-on-surface-variant">
                      {t.role} • <span className="font-medium text-on-surface">{t.facility}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto font-code-mono text-label-compact">
                  <div className="text-right">
                    <div className="text-[10px] text-on-surface-variant uppercase">Resolved</div>
                    <div className="font-bold text-on-surface">{t.closed} tickets</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-on-surface-variant uppercase">MTTR</div>
                    <div className="font-bold text-on-surface">{t.avgMttr}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-on-surface-variant uppercase">SLA</div>
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-surface-container text-primary">
                      {t.slaRate}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-on-surface-variant uppercase">CSAT</div>
                    <div className="font-bold text-amber-600 flex items-center justify-end gap-0.5">
                      <span>★</span>
                      <span>{t.csat}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-container-high/60 flex flex-wrap items-center justify-between gap-2 font-caption text-caption text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-on-surface">Key Focus:</span>
                  <span>{t.resolvedCategories}</span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {t.certifications.map((c) => (
                    <span key={c} className="font-code-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-low border border-surface-container text-on-surface font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-surface-container-high flex items-center justify-between bg-surface-container-low">
        <span className="font-caption text-caption text-on-surface-variant">
          Team Shift Coverage: 24/7 Rotational • Next Audit Cycle: Q3 2025
        </span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-primary-container text-on-primary hover:bg-primary font-body-dense-medium text-body-dense rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Close Audit View
        </button>
      </div>
    </Modal>
  );
};
