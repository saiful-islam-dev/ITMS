import React, { useState } from 'react';
import { Settings, ShieldCheck, Bell, Server, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { SystemSettings } from '../../types';

export const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    sdwanAutoFailover: true,
    alertEmailRecipients: 'tariq.rahman@apexgarments.com, it-ops-leads@apexgarments.com',
    thermalWarningThresholdC: 30,
    latencyAlertThresholdMs: 25,
    snmpPollingIntervalSec: 15,
    auditLogRetentionDays: 90,
    autoTicketOnDegraded: true
  });

  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#131b2e] tracking-tight">
              System Parameters & Alert Thresholds
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#464555] mt-1">
            Configure global SD-WAN mesh failover policies, SNMP sampling intervals, and temperature trigger points.
          </p>
        </div>

        {savedNotification && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] rounded-lg text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Network & SD-WAN Policies */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-level-1 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
            <Server className="w-5 h-5 text-[#3525cd]" />
            <div>
              <h3 className="font-semibold text-sm text-[#131b2e]">
                SD-WAN & Network Telemetry
              </h3>
              <p className="text-xs text-[#777587]">
                Routing convergence and IPsec failover rules.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sdwanAutoFailover}
                onChange={(e) =>
                  setSettings({ ...settings, sdwanAutoFailover: e.target.checked })
                }
                className="mt-1 rounded text-[#3525cd] focus:ring-0"
              />
              <div>
                <span className="text-xs font-semibold text-[#131b2e]">
                  Automatic Cellular / Starlink Failover
                </span>
                <p className="text-[11px] text-[#777587]">
                  Automatically switch traffic to backup uplink if jitter exceeds 20ms or packet loss &gt; 2.5% for 30 consecutive seconds.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoTicketOnDegraded}
                onChange={(e) =>
                  setSettings({ ...settings, autoTicketOnDegraded: e.target.checked })
                }
                className="mt-1 rounded text-[#3525cd] focus:ring-0"
              />
              <div>
                <span className="text-xs font-semibold text-[#131b2e]">
                  Auto-Provision Incident Ticket on VLAN Saturation
                </span>
                <p className="text-[11px] text-[#777587]">
                  Instantly file a high-severity ticket to the site lead engineer when DHCP address lease pool crosses 80%.
                </p>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                  Latency Alert Threshold (ms)
                </label>
                <input
                  type="number"
                  value={settings.latencyAlertThresholdMs}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      latencyAlertThresholdMs: parseInt(e.target.value) || 25
                    })
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-[#f2f3ff] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                  SNMP Sampling Interval (Seconds)
                </label>
                <input
                  type="number"
                  value={settings.snmpPollingIntervalSec}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      snmpPollingIntervalSec: parseInt(e.target.value) || 15
                    })
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-[#f2f3ff] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Sensor Thresholds */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-level-1 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f5f9]">
            <Bell className="w-5 h-5 text-[#3525cd]" />
            <div>
              <h3 className="font-semibold text-sm text-[#131b2e]">
                Environmental & Thermal Thresholds
              </h3>
              <p className="text-xs text-[#777587]">
                NEMA enclosure alarms and sensor limits.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                IDF Cabinet Temperature Warning (°C)
              </label>
              <input
                type="number"
                value={settings.thermalWarningThresholdC}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    thermalWarningThresholdC: parseInt(e.target.value) || 30
                  })
                }
                className="w-full px-3 py-2 text-xs font-mono bg-[#f2f3ff] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Audit Log Retention (Days)
              </label>
              <input
                type="number"
                value={settings.auditLogRetentionDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    auditLogRetentionDays: parseInt(e.target.value) || 90
                  })
                }
                className="w-full px-3 py-2 text-xs font-mono bg-[#f2f3ff] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-1">
              Priority Alert Notification Recipients (Comma separated)
            </label>
            <input
              type="text"
              value={settings.alertEmailRecipients}
              onChange={(e) =>
                setSettings({ ...settings, alertEmailRecipients: e.target.value })
              }
              className="w-full px-3 py-2 text-xs bg-[#f2f3ff] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#4f46e5] hover:bg-[#3730a3] text-white rounded-lg shadow-level-1 hover:shadow-level-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
};

