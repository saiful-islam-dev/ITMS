'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar, ScreenId } from './Sidebar';
import { Topbar } from './Topbar';
import { useApp } from '../../context/AppContext';
import { GlobalModals } from '../modals/GlobalModals';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const {
    facilities,
    tickets,
    selectedFacilityId,
    setSelectedFacilityId,
    globalSearch,
    setGlobalSearch,
    handlePingAll,
    setIsHelpModalOpen,
    setIsNotificationsModalOpen
  } = useApp();

  // Active screen determined by route (default is dashboard)
  const getActiveScreen = (): ScreenId => {
    if (!pathname || pathname === '/' || pathname === '/dashboard') return 'dashboard';
    const segment = pathname.replace('/', '') as ScreenId;
    return segment;
  };

  const activeScreen = getActiveScreen();

  const handleSelectScreen = (screen: ScreenId) => {
    router.push(`/${screen}`);
  };

  const getScreenTitle = (screen: ScreenId) => {
    switch (screen) {
      case 'dashboard':
        return 'Operations Dashboard';
      case 'locations':
        return 'Locations';
      case 'assets':
        return 'IT Assets';
      case 'tickets':
        return 'Support Tickets';
      case 'tasks':
        return 'Task Management';
      case 'employees':
        return 'Employees';
      case 'departments':
        return 'Departments';
      case 'settings':
        return 'System Settings';
      case 'reports':
        return 'Reports & Analytics';
      default:
        return 'Operations Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background font-body-default text-on-surface antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeScreen={activeScreen}
        onSelectScreen={handleSelectScreen}
        openTicketsCount={tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onPingAll={handlePingAll}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      {/* Global Topbar Header */}
      <Topbar
        sidebarCollapsed={sidebarCollapsed}
        onOpenMobileMenu={() => setIsMobileOpen(true)}
        facilities={facilities}
        selectedFacilityId={selectedFacilityId}
        onSelectFacility={setSelectedFacilityId}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        activeScreenTitle={getScreenTitle(activeScreen)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'lg:pl-18' : 'lg:pl-64'}`}>
        <main className="relative pt-14 w-full px-space-lg pb-space-xl bg-background min-h-screen">
          {children}
        </main>
      </div>

      {/* Unified Global Modals Container */}
      <GlobalModals />
    </div>
  );
};
