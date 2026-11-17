'use client';

import React from 'react';

export type ScreenId =
  | 'locations'
  | 'dashboard'
  | 'assets'
  | 'tickets'
  | 'tasks'
  | 'employees'
  | 'departments'
  | 'settings'
  | 'reports'
  | 'user-management';

interface SidebarProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  openTicketsCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onPingAll: () => void;
  onOpenHelp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onSelectScreen,
  openTicketsCount,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onPingAll,
  onOpenHelp
}) => {
  const mainNav = [
    { id: 'dashboard' as ScreenId, label: 'Dashboard', icon: 'dashboard' },
    { id: 'employees' as ScreenId, label: 'Employees', icon: 'badge' },
    { id: 'assets' as ScreenId, label: 'IT Assets', icon: 'inventory_2' },
    {
      id: 'tickets' as ScreenId,
      label: 'Support Tickets',
      icon: 'confirmation_number',
      badge: '1'
    },
    { id: 'tasks' as ScreenId, label: 'Task', icon: 'check_circle', badge: '5' }
  ];

  const orgNav = [
    { id: 'departments' as ScreenId, label: 'Departments', icon: 'schema' },
    { id: 'locations' as ScreenId, label: 'Locations', icon: 'domain' }
  ];

  const adminNav = [
    { id: 'reports' as ScreenId, label: 'Reports & Analytics', icon: 'insights' },
    { id: 'user-management' as ScreenId, label: 'User Management', icon: 'manage_accounts' },
    { id: 'settings' as ScreenId, label: 'System Settings', icon: 'settings' }
  ];

  const handleNavClick = (screen: ScreenId) => {
    onSelectScreen(screen);
    onCloseMobile();
  };

  const renderNavGroup = (title: string, items: typeof mainNav) => (
    <div className="space-y-space-xs">
      {!isCollapsed && (
        <div className="px-space-sm py-space-xs font-label-compact text-label-compact text-on-surface-variant uppercase tracking-wider">
          {title}
        </div>
      )}
      <nav className="space-y-space-xs">
        {items.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center justify-between px-space-sm py-space-xs transition-colors rounded-lg text-left ${isActive
                ? 'bg-primary-container text-on-primary font-body-dense-medium'
                : 'text-on-surface-variant font-body-dense text-body-dense hover:bg-surface-container-high hover:text-on-surface'
                } ${isCollapsed ? 'justify-center px-1' : ''}`}
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </div>
              {!isCollapsed && item.badge && (
                <span
                  className={`px-space-xs py-0.5 rounded-lg font-code-mono text-label-compact font-medium ${isActive
                    ? 'bg-white/20 text-on-primary'
                    : 'bg-surface-container text-on-surface-variant'
                    }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-full bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container transition-all duration-200 ${
          isCollapsed ? 'w-18' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col min-h-0">
          {/* Logo & Brand Header */}
          <div className="px-space-md py-space-sm flex items-center justify-between bg-surface-container-lowest border-b border-surface-container">
            <div className="flex items-center gap-space-sm overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#4f46e5] flex items-center justify-center text-white shadow-xs ring-1 ring-indigo-700/20">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface leading-none">
                      ITMS
                    </span>
                    <span className="font-label-compact text-label-compact px-space-xs py-0.5 rounded-lg bg-surface-container text-on-surface-variant font-semibold leading-none">
                      v2.4 Enterprise
                    </span>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant truncate max-w-[128px] mt-0.5">
                    Apex Garments IT Ops
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onToggleCollapse}
              className="p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors hidden lg:flex"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isCollapsed ? 'last_page' : 'first_page'}
              </span>
            </button>
          </div>

          {/* Nav Links */}
          <div className="overflow-y-auto px-space-sm py-space-sm space-y-space-md">
            {renderNavGroup('Main', mainNav)}
            {renderNavGroup('Organization', orgNav)}
            {renderNavGroup('Administration', adminNav)}
          </div>
        </div>

        {/* Footer: Systems Operational & Help */}
        <div className="p-space-sm bg-surface-container-low flex flex-col gap-space-sm border-t border-surface-container">
          <div className="flex items-center justify-between px-space-xs">
            <div className="flex items-center gap-space-xs overflow-hidden">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {!isCollapsed && (
                <span className="font-label-compact text-label-compact text-on-surface truncate">
                  All Systems Operational
                </span>
              )}
            </div>
            <button
              onClick={onPingAll}
              className="p-0.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
              title="Quick Server Ping Sweep"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">network_ping</span>
            </button>
          </div>
          {!isCollapsed ? (
            <button
              onClick={onOpenHelp}
              className="flex items-center justify-center gap-space-xs py-space-xs text-on-surface-variant hover:text-on-surface font-caption text-caption rounded-lg transition-colors bg-surface-container-lowest shadow-2xs w-full"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">help_outline</span>
              <span>Help & Docs</span>
            </button>
          ) : (
            <button
              onClick={onOpenHelp}
              className="flex items-center justify-center py-1 text-on-surface-variant hover:text-on-surface rounded-lg bg-surface-container-lowest"
              title="Help & Docs"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">help_outline</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
