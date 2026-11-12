import React, { useState } from 'react';
import { Facility } from '../../types';

interface TopbarProps {
  sidebarCollapsed: boolean;
  onOpenMobileMenu: () => void;
  facilities: Facility[];
  selectedFacilityId: string;
  onSelectFacility: (facilityId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeScreenTitle: string;
  onOpenHelp: () => void;
  onOpenNotifications: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  sidebarCollapsed,
  onOpenMobileMenu,
  facilities,
  selectedFacilityId,
  onSelectFacility,
  searchQuery,
  onSearchChange,
  activeScreenTitle,
  onOpenHelp,
  onOpenNotifications
}) => {
  const [isFacilityDropdownOpen, setIsFacilityDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [latency, setLatency] = useState(14);

  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);

  const handlePingQuick = () => {
    setLatency((prev) => Math.max(9, Math.floor(prev + (Math.random() * 4 - 2))));
  };

  return (
    <header
      className={`fixed top-0 right-0 h-14 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg transition-all duration-200 border-b border-surface-container ${
        sidebarCollapsed ? 'left-0 lg:left-18' : 'left-0 lg:left-64'
      }`}
    >
      {/* Left side: Hamburger (mobile), Breadcrumbs, Facility Dropdown */}
      <div className="flex items-center gap-space-md">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
          type="button"
          aria-label="Open mobile navigation"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>

        <nav className="hidden md:flex items-center gap-space-xs font-body-dense text-body-dense text-on-surface-variant">
          <span className="text-on-surface-variant font-body-dense text-body-dense">IT Operations</span>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span className="text-on-surface-variant font-body-dense text-body-dense">Overview</span>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span className="text-on-surface font-body-dense-medium text-body-dense-medium">{activeScreenTitle}</span>
        </nav>

        {/* Facility selector dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFacilityDropdownOpen(!isFacilityDropdownOpen)}
            type="button"
            className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-lg text-on-surface font-body-dense text-body-dense cursor-pointer hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">corporate_fare</span>
            <span className="font-body-dense-medium text-body-dense-medium max-w-[130px] sm:max-w-[210px] truncate">
              {selectedFacility ? selectedFacility.name : 'All Facilities (Apex Garments)'}
            </span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
          </button>

          {isFacilityDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsFacilityDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1 w-64 bg-surface-container-lowest border border-surface-container rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                <div className="px-3 py-1.5 text-[10px] font-bold text-on-surface-variant uppercase border-b border-surface-container tracking-wider">
                  Filter by Facility
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectFacility('all');
                    setIsFacilityDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-surface-container transition-colors flex items-center justify-between ${
                    selectedFacilityId === 'all' ? 'text-primary font-bold bg-surface-container-low' : 'text-on-surface'
                  }`}
                >
                  <span>All Facilities (Apex Garments)</span>
                  {selectedFacilityId === 'all' && (
                    <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                  )}
                </button>
                {facilities.map((fac) => (
                  <button
                    key={fac.id}
                    type="button"
                    onClick={() => {
                      onSelectFacility(fac.id);
                      setIsFacilityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-surface-container transition-colors flex items-center justify-between ${
                      selectedFacilityId === fac.id ? 'text-primary font-bold bg-surface-container-low' : 'text-on-surface'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-medium truncate">{fac.name}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono">{fac.code} • {fac.subnet}</div>
                    </div>
                    {selectedFacilityId === fac.id && (
                      <span className="material-symbols-outlined text-[16px] text-primary shrink-0">check</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side: Search, Latency, Notifications, Help, Profile */}
      <div className="flex items-center gap-space-md">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-space-sm bg-surface-container-low px-space-sm py-1.5 rounded-lg w-60 lg:w-72 text-on-surface-variant focus-within:ring-1 focus-within:ring-primary focus-within:bg-surface-container-lowest transition-all">
          <span className="material-symbols-outlined text-[16px]">search</span>
          <input
            className="bg-transparent border-0 outline-none w-full font-body-dense text-body-dense placeholder:text-outline text-on-surface"
            placeholder="Search tickets, serials, employees..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <kbd className="font-code-mono text-[10px] bg-surface-container-lowest px-1 rounded text-on-surface-variant uppercase shadow-2xs">
            ⌘K
          </kbd>
        </div>

        {/* Quick action buttons & latency */}
        <div className="flex items-center gap-space-xs">
          <div
            onClick={handlePingQuick}
            className="flex items-center gap-1 px-space-xs py-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-on-surface-variant hover:text-on-surface"
            title={`SD-WAN Edge Latency: ${latency}ms (Click to ping)`}
          >
            <span className="material-symbols-outlined text-[16px] text-primary">wifi</span>
            <span className="font-code-mono text-label-compact text-on-surface-variant">{latency}ms</span>
          </div>

          <button
            onClick={onOpenNotifications}
            className="relative p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
            title="Notifications"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
          </button>

          <button
            onClick={onOpenHelp}
            className="p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
            title="Help & Documentation"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
          </button>
        </div>

        {/* User profile */}
        <div className="relative">
          <div
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-space-sm pl-space-xs cursor-pointer group"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container-high"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe-kUzMmRiZlfB0dWXt0He3QcWmvYobfJGI_yhUhXnSv56DEnkwjZlrnk1axTkesHbOcsSIRHrGdkY8oezx0l2FA5ARAHeV_jB7gnIBCGIsTtn3j69ZglqQnhY4yNOQDLhmRnN-CjYWNQOcPQ-1VVYF1ia_gj7aiEI5ARG6DYa1aC8G-087bsK6LgjoVyqp9GfbMkhpb0WKhxRAVmj-Qlfrne5lUvPngaOUMSiJVkWdx2IVk3N8OPp"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="font-body-dense-medium text-body-dense-medium text-on-surface leading-tight">
                Tariq Rahman
              </span>
              <span className="font-label-compact text-label-compact text-on-surface-variant leading-none">
                IT Ops Lead / Super Admin
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-on-surface transition-colors">
              expand_more
            </span>
          </div>

          {isUserMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-surface-container rounded-xl shadow-lg z-50 py-2 text-xs">
                <div className="px-3 py-2 border-b border-surface-container">
                  <div className="font-semibold text-on-surface">Tariq Rahman</div>
                  <div className="text-[11px] text-on-surface-variant font-mono">tariq.rahman@apexgarments.com</div>
                  <div className="mt-1 text-[10px] text-primary font-bold uppercase bg-surface-container px-1.5 py-0.5 rounded inline-block">
                    Full Admin Privileges
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenHelp();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container text-on-surface flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>Security Credentials</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenHelp();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container text-on-surface flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">settings</span>
                    <span>Account Settings</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
