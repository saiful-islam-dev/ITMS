'use client';

import React, { useState } from 'react';
import { RefreshCw, Globe, CheckCircle2, Lock } from 'lucide-react';
import { Modal } from '../common';

interface ConfigureSsoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncTriggered?: () => void;
}

export const ConfigureSsoModal: React.FC<ConfigureSsoModalProps> = ({
  isOpen,
  onClose,
  onSyncTriggered
}) => {
  const [provider, setProvider] = useState<'azure' | 'okta' | 'google' | 'saml'>('azure');
  const [tenantId, setTenantId] = useState('7f89d310-84a2-4a01-9876-apexgarments-aad');
  const [clientId, setClientId] = useState('4a33c291-ee09-4781-b541-itms-enterprise-app');
  const [clientSecret, setClientSecret] = useState('••••••••••••••••••••••••••••••••');
  const [scimEndpoint, setScimEndpoint] = useState('https://itms.apexgarments.com/api/v2/scim/v2');
  const [syncInterval, setSyncInterval] = useState('15');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        success: true,
        msg: 'Connection verified: SAML 2.0 Identity Provider & SCIM 2.0 Bearer active (12ms latency).'
      });
    }, 700);
  };

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      if (onSyncTriggered) onSyncTriggered();
      onClose();
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SSO Identity Provider & SCIM Directory Sync"
      subtitle="Configure corporate SAML 2.0 SSO, Microsoft Entra ID, and Okta automated provisioning."
      icon={RefreshCw}
      maxWidth="xl"
    >
      <div className="p-5 space-y-4">
        {/* Identity Provider Tabs */}
        <div>
          <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1.5">
            Select Primary Identity Provider (IdP)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setProvider('azure')}
              className={`py-2 px-3 rounded-lg font-body-dense-medium text-body-dense text-center border transition-all cursor-pointer ${
                provider === 'azure'
                  ? 'bg-primary-container text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
              }`}
            >
              Microsoft Entra ID
            </button>
            <button
              type="button"
              onClick={() => setProvider('okta')}
              className={`py-2 px-3 rounded-lg font-body-dense-medium text-body-dense text-center border transition-all cursor-pointer ${
                provider === 'okta'
                  ? 'bg-primary-container text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
              }`}
            >
              Okta Workforce
            </button>
            <button
              type="button"
              onClick={() => setProvider('saml')}
              className={`py-2 px-3 rounded-lg font-body-dense-medium text-body-dense text-center border transition-all cursor-pointer ${
                provider === 'saml'
                  ? 'bg-primary-container text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
              }`}
            >
              Custom SAML 2.0
            </button>
          </div>
        </div>

        {/* Configuration Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
              Directory Tenant ID
            </label>
            <input
              type="text"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-code-mono text-caption text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
              Application (Client) ID
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-code-mono text-caption text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
            SCIM 2.0 Base URL Endpoint
          </label>
          <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg">
            <Globe className="w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              value={scimEndpoint}
              onChange={(e) => setScimEndpoint(e.target.value)}
              className="bg-transparent border-0 outline-none w-full font-code-mono text-caption text-on-surface"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
              Client Secret / Token
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg">
              <Lock className="w-4 h-4 text-on-surface-variant" />
              <input
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="bg-transparent border-0 outline-none w-full font-code-mono text-caption text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-compact text-label-compact text-on-surface uppercase mb-1">
              Auto-Sync Interval
            </label>
            <select
              value={syncInterval}
              onChange={(e) => setSyncInterval(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-dense text-body-dense text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white cursor-pointer"
            >
              <option value="5">Every 5 minutes</option>
              <option value="15">Every 15 minutes (Standard)</option>
              <option value="60">Every 1 hour</option>
              <option value="360">Every 6 hours</option>
            </select>
          </div>
        </div>

        {/* Test connection alert */}
        {testResult && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-caption flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{testResult.msg}</span>
          </div>
        )}

        {/* Test & Sync Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-container-high">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-lg font-body-dense-medium text-body-dense transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[16px] ${isTesting ? 'animate-spin' : ''}`}>
              network_ping
            </span>
            <span>{isTesting ? 'Testing SAML...' : 'Test Connection'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-body-dense-medium text-body-dense transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleForceSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-container text-on-primary hover:bg-primary rounded-lg font-body-dense-medium text-body-dense shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isSyncing ? 'Synchronizing SCIM...' : 'Force Sync Directory'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
