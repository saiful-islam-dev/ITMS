import React, { useState } from 'react';
import {
  Sidebar,
  ScreenId
} from './components/shell/Sidebar';
import { Topbar } from './components/shell/Topbar';
import { initialFacilities } from './data/mockFacilities';
import { mockTickets as initialMockTickets } from './data/mockTickets';
import { Facility, SupportTicket } from './types';

// Screens
import { DashboardScreen } from './components/screens/DashboardScreen';
import { LocationsScreen } from './components/screens/LocationsScreen';
import { ITAssetsScreen } from './components/screens/ITAssetsScreen';
import { SupportTicketsScreen } from './components/screens/SupportTicketsScreen';
import { EmployeesScreen } from './components/screens/EmployeesScreen';
import { DepartmentsScreen } from './components/screens/DepartmentsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';

// Modals
import { AddLocationModal } from './components/modals/AddLocationModal';
import { FacilityAssetsDrawer } from './components/modals/FacilityAssetsDrawer';
import { RemoteTerminalModal } from './components/modals/RemoteTerminalModal';
import { ThermalsModal } from './components/modals/ThermalsModal';
import { ExportReportModal } from './components/modals/ExportReportModal';
import { CreateTicketModal } from './components/modals/CreateTicketModal';
import { TicketDetailsModal } from './components/modals/TicketDetailsModal';
import { AuditLogModal } from './components/modals/AuditLogModal';

// Icons for emergency dialogs
import { PhoneCall, X, ShieldCheck, Bell } from 'lucide-react';

export default function App() {
  // Navigation & Shell State - Dashboard is default as requested!
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Global Facilities & Tickets State
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialMockTickets);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('all');
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals & Drawers State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [selectedTicketForDetails, setSelectedTicketForDetails] = useState<SupportTicket | null>(null);
  const [isAuditTrailModalOpen, setIsAuditTrailModalOpen] = useState(false);
  const [selectedFacilityForAssets, setSelectedFacilityForAssets] = useState<Facility | null>(null);
  const [selectedFacilityForTerminal, setSelectedFacilityForTerminal] = useState<Facility | null>(null);
  const [selectedFacilityForThermals, setSelectedFacilityForThermals] = useState<Facility | null>(null);
  const [isHotlineModalOpen, setIsHotlineModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Handler for adding a new facility
  const handleAddFacility = (newFac: Facility) => {
    setFacilities((prev) => [newFac, ...prev]);
  };

  // Handler for creating a new support ticket
  const handleCreateTicket = (newTicket: SupportTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  // Handler for updating a ticket status
  const handleUpdateTicketStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  // Ping all sweep handler
  const handlePingAll = () => {
    setFacilities((prev) =>
      prev.map((f) => ({
        ...f,
        pingMs: Math.max(2, Math.floor(f.pingMs + (Math.random() * 4 - 2)))
      }))
    );
  };

  // Screen titles mapping for Topbar
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
      case 'employees':
        return 'Employees';
      case 'departments':
        return 'Departments';
      case 'settings':
        return 'System Settings';
      case 'reports':
        return 'Reports & Analytics';
    }
  };

  // Filter facilities based on Topbar quick facility selector
  const activeFacilities =
    selectedFacilityId === 'all'
      ? facilities
      : facilities.filter((f) => f.id === selectedFacilityId);

  return (
    <div className="min-h-screen bg-background font-body-default text-on-surface antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
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
          {activeScreen === 'dashboard' && (
            <DashboardScreen
              facilities={activeFacilities}
              tickets={tickets}
              onNavigateToScreen={(screen) => setActiveScreen(screen)}
              onOpenThermals={(fac) => setSelectedFacilityForThermals(fac)}
              onOpenTerminal={(fac) => setSelectedFacilityForTerminal(fac)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onOpenCreateTicket={() => setIsCreateTicketModalOpen(true)}
              onViewTicketDetails={(ticket) => setSelectedTicketForDetails(ticket)}
              onOpenAuditTrail={() => setIsAuditTrailModalOpen(true)}
            />
          )}

          {activeScreen === 'locations' && (
            <LocationsScreen
              facilities={activeFacilities}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onManageAssets={(fac) => setSelectedFacilityForAssets(fac)}
              onOpenTerminal={(fac) => setSelectedFacilityForTerminal(fac)}
              onOpenThermals={(fac) => setSelectedFacilityForThermals(fac)}
              onOpenTickets={() => {
                setActiveScreen('tickets');
              }}
              onHotlineClick={() => setIsHotlineModalOpen(true)}
              onNavigateToScreen={(screen) => setActiveScreen(screen)}
            />
          )}

          {activeScreen === 'assets' && (
            <ITAssetsScreen
              facilities={facilities}
              onOpenTerminal={(fac) => setSelectedFacilityForTerminal(fac)}
            />
          )}

          {activeScreen === 'tickets' && (
            <SupportTicketsScreen
              tickets={tickets}
              facilities={facilities}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onOpenThermals={(fac) => setSelectedFacilityForThermals(fac)}
            />
          )}

          {activeScreen === 'employees' && (
            <EmployeesScreen facilities={facilities} />
          )}

          {activeScreen === 'departments' && (
            <DepartmentsScreen
              onNavigateToScreen={(screen) => setActiveScreen(screen)}
            />
          )}

          {activeScreen === 'settings' && <SettingsScreen />}

          {activeScreen === 'reports' && (
            <ReportsScreen facilities={facilities} tickets={tickets} />
          )}
        </main>
      </div>

      {/* Interactive Modals & Drawers */}
      <CreateTicketModal
        isOpen={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        facilities={facilities}
        onCreateTicket={handleCreateTicket}
      />

      <TicketDetailsModal
        isOpen={selectedTicketForDetails !== null}
        ticket={selectedTicketForDetails}
        onClose={() => setSelectedTicketForDetails(null)}
        onUpdateStatus={handleUpdateTicketStatus}
      />

      <AuditLogModal
        isOpen={isAuditTrailModalOpen}
        onClose={() => setIsAuditTrailModalOpen(false)}
      />

      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFacility={handleAddFacility}
      />

      <FacilityAssetsDrawer
        isOpen={selectedFacilityForAssets !== null}
        facility={selectedFacilityForAssets}
        onClose={() => setSelectedFacilityForAssets(null)}
      />

      <RemoteTerminalModal
        isOpen={selectedFacilityForTerminal !== null}
        facility={selectedFacilityForTerminal}
        onClose={() => setSelectedFacilityForTerminal(null)}
      />

      <ThermalsModal
        isOpen={selectedFacilityForThermals !== null}
        facility={selectedFacilityForThermals}
        onClose={() => setSelectedFacilityForThermals(null)}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        facilities={facilities}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Emergency Shift Supervisor Hotline Modal */}
      {isHotlineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsHotlineModalOpen(false)}
          />
          <div className="relative bg-white border border-[#cbd5e1] rounded-2xl w-full max-w-md shadow-level-3 p-5 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2 text-[#9f1239]">
                <PhoneCall className="w-5 h-5 text-[#e11d48]" />
                <h3 className="font-bold text-sm text-[#131b2e]">
                  Shift Supervisor Emergency Hotline
                </h3>
              </div>
              <button
                onClick={() => setIsHotlineModalOpen(false)}
                className="p-1 text-[#777587] hover:text-[#131b2e] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <p className="text-[#464555]">
                Direct patched line to on-duty plant managers and central IT operations command:
              </p>

              <div className="p-3 bg-[#fff1f2] border border-[#fecdd3] rounded-xl space-y-1">
                <div className="font-semibold text-[#9f1239]">
                  Factory Building B (Chemical Wash Plant Lead)
                </div>
                <div className="font-mono text-sm font-bold text-[#131b2e]">
                  +880 1912-774023 (Rafiqul Islam)
                </div>
                <div className="text-[10px] text-[#777587]">
                  VLAN 40 & IP65 Enclosures Specialist
                </div>
              </div>

              <div className="p-3 bg-[#f8f9fe] border border-[#e2e8f0] rounded-xl space-y-1">
                <div className="font-semibold text-[#131b2e]">
                  Central IT Operations Lead / Super Admin
                </div>
                <div className="font-mono text-sm font-bold text-[#3525cd]">
                  +880 1711-049821 (Tariq Rahman)
                </div>
                <div className="text-[10px] text-[#777587]">
                  SD-WAN Core & Escalation Commander
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsHotlineModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Close Hotline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help & System Architecture Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsHelpModalOpen(false)}
          />
          <div className="relative bg-white border border-[#cbd5e1] rounded-2xl w-full max-w-lg shadow-level-3 p-5 z-10 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#3525cd]" />
                <h3 className="font-bold text-sm text-[#131b2e]">
                  ITMS Enterprise v2.4 — Architecture Guide
                </h3>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="p-1 text-[#777587] hover:text-[#131b2e] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#464555] leading-relaxed max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="font-bold text-[#131b2e]">Apex Garments Operations Network</h4>
                <p className="mt-1">
                  Apex Garments ITMS monitors 4 mission-critical campuses across Dhaka, Gazipur, and Savar connected through an enterprise FortiGate SD-WAN mesh running BGP autonomous routing with automatic LTE/Starlink satellite failover.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#131b2e]">Keyboard Shortcuts</h4>
                <ul className="mt-1 space-y-1 font-mono text-[11px]">
                  <li><kbd className="px-1.5 py-0.5 bg-slate-100 rounded border">⌘K</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border">Ctrl+K</kbd> : Global Search tickets, serials, employees</li>
                  <li><kbd className="px-1.5 py-0.5 bg-slate-100 rounded border">Esc</kbd> : Dismiss active modal / drawer</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#131b2e]">Design System Compliance</h4>
                <p className="mt-1">
                  Built to the strict specifications of <code className="text-[#3525cd]">DESIGN.md</code> and <code className="text-[#3525cd]">IMPLEMENTATION_PLAN.md</code>: zero-pill discipline, 8px spatial grid, high-density tabular typography, and low-contrast elevation.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#f1f5f9]">
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="px-4 py-2 bg-[#4f46e5] text-white rounded-lg text-xs font-semibold hover:bg-[#3730a3]"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer Modal */}
      {isNotificationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsNotificationsModalOpen(false)}
          />
          <div className="relative bg-white border border-[#cbd5e1] rounded-2xl w-full max-w-md shadow-level-3 p-5 z-10 animate-in fade-in zoom-in-95 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#e11d48]" />
                <h3 className="font-bold text-sm text-[#131b2e]">
                  Active Operational Notifications
                </h3>
              </div>
              <button
                onClick={() => setIsNotificationsModalOpen(false)}
                className="p-1 text-[#777587] hover:text-[#131b2e] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto">
              <div className="p-3 bg-[#fff1f2] border border-[#fecdd3] rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-[#9f1239]">
                  <span>Environmental Alert: Moisture & Heat</span>
                  <span className="text-[10px] font-mono">11:20 AM</span>
                </div>
                <p className="text-[#9f1239]/90">
                  Condensation detected in rack WASH-IDF-SEC3 at Factory Building B. Jitter on VLAN 40 reached 7.4ms.
                </p>
                <button
                  onClick={() => {
                    setIsNotificationsModalOpen(false);
                    const fac = facilities.find((f) => f.id === 'loc-fct-02');
                    if (fac) setSelectedFacilityForThermals(fac);
                  }}
                  className="mt-1 text-[11px] font-semibold text-[#e11d48] underline hover:no-underline"
                >
                  View Thermals & Sensor Status →
                </button>
              </div>

              <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-[#92400e]">
                  <span>Hardware Incident: Zebra Printhead Failure</span>
                  <span className="text-[10px] font-mono">12:05 PM</span>
                </div>
                <p className="text-[#92400e]/90">
                  Zebra ZT410 printhead burnt out on Sewing Line 8 at Factory Building A.
                </p>
                <button
                  onClick={() => {
                    setIsNotificationsModalOpen(false);
                    setActiveScreen('tickets');
                  }}
                  className="mt-1 text-[11px] font-semibold text-[#b45309] underline hover:no-underline"
                >
                  View Ticket TICK-8844 →
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#f1f5f9]">
              <button
                onClick={() => setIsNotificationsModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Dismiss All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
