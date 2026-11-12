import React, { useState } from 'react';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  ip: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

const mockAuditLogs: AuditEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-11-12 10:42:18',
    user: 'Tariq Rahman (Super Admin)',
    action: 'Asset Assigned',
    target: 'AST-9042 ThinkPad T14 -> Tania Sultana (Merchandising)',
    ip: '10.14.0.22',
    status: 'SUCCESS'
  },
  {
    id: 'aud-002',
    timestamp: '2026-11-12 10:15:04',
    user: 'Masud Rana (Field Eng)',
    action: 'Ticket Resolved',
    target: '#TCK-2024-1035 Cisco 2960 patch cable replaced',
    ip: '10.14.20.15',
    status: 'SUCCESS'
  },
  {
    id: 'aud-003',
    timestamp: '2026-11-12 09:50:33',
    user: 'System Cron Daemon',
    action: 'Automated Mirror Backup',
    target: 'ERP Database Snapshot (142 GB verified MD5 sum)',
    ip: '10.14.0.10',
    status: 'SUCCESS'
  },
  {
    id: 'aud-004',
    timestamp: '2026-11-12 09:12:45',
    user: 'Tanvir Hasan (Hardware Tech)',
    action: 'Hardware Registry Entry',
    target: 'Zebra ZT421 Industrial Barcode (S/N: 42J2019024)',
    ip: '10.14.30.4',
    status: 'SUCCESS'
  },
  {
    id: 'aud-005',
    timestamp: '2026-11-12 08:30:11',
    user: 'SD-WAN Controller',
    action: 'Health Sweep Diagnostic',
    target: '16 Core Switches and 42 PoE APs ping verified (99.9%)',
    ip: '10.14.0.1',
    status: 'SUCCESS'
  },
  {
    id: 'aud-006',
    timestamp: '2026-11-12 07:45:00',
    user: 'Rafiqul Islam (Floor Mgr)',
    action: 'IDF Fan Speed Override',
    target: 'WASH-IDF-SEC3 Auxiliary Blower activated',
    ip: '10.14.20.88',
    status: 'WARNING'
  }
];

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filteredLogs = mockAuditLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(filter.toLowerCase()) ||
      log.action.toLowerCase().includes(filter.toLowerCase()) ||
      log.target.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-surface-container-lowest border border-surface-container rounded-xl w-full max-w-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 z-10 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[20px]">
              receipt_long
            </span>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Operations Audit Trail Log</h3>
              <p className="font-caption text-caption text-on-surface-variant">
                Immutable compliance & infrastructure access log
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg w-72 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">search</span>
              <input
                type="text"
                placeholder="Filter logs by user or event..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent border-0 outline-none w-full font-body-dense text-body-dense text-on-surface"
              />
            </div>
            <div className="text-caption font-code-mono text-on-surface-variant">
              Showing {filteredLogs.length} audit entries
            </div>
          </div>

          <div className="border border-surface-container rounded-lg overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse text-body-dense font-body-dense">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-compact text-label-compact uppercase tracking-wider">
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3">Operator</th>
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Target / Detail</th>
                  <th className="py-2 px-3">Source IP</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-low/70">
                    <td className="py-2 px-3 font-code-mono text-caption text-on-surface-variant whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap font-medium text-on-surface">
                      {log.user}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap text-primary font-medium">
                      {log.action}
                    </td>
                    <td className="py-2 px-3 max-w-xs truncate text-on-surface-variant">
                      {log.target}
                    </td>
                    <td className="py-2 px-3 font-code-mono text-caption text-on-surface-variant whitespace-nowrap">
                      {log.ip}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-surface-container text-primary font-code-mono">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-surface-container">
          <span className="font-caption text-caption text-on-surface-variant">
            Encrypted SHA-256 Ledger • Retention 365 Days
          </span>
          <button
            onClick={onClose}
            className="px-space-md py-1.5 rounded-lg bg-surface-container text-on-surface font-body-dense-medium text-body-dense-medium hover:bg-surface-container-high transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

