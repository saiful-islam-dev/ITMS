'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { DashboardScreen } from '../../components/screens/DashboardScreen';

export default function DashboardPage() {
  const router = useRouter();
  const {
    activeFacilities,
    tickets,
    setSelectedFacilityForThermals,
    setSelectedFacilityForTerminal,
    setIsExportModalOpen,
    setIsCreateTicketModalOpen,
    setSelectedTicketForDetails,
    setIsAuditTrailModalOpen
  } = useApp();

  return (
    <DashboardScreen
      facilities={activeFacilities}
      tickets={tickets}
      onNavigateToScreen={(screen) => router.push(`/${screen}`)}
      onOpenThermals={(fac) => setSelectedFacilityForThermals(fac)}
      onOpenTerminal={(fac) => setSelectedFacilityForTerminal(fac)}
      onOpenExportModal={() => setIsExportModalOpen(true)}
      onOpenCreateTicket={() => setIsCreateTicketModalOpen(true)}
      onViewTicketDetails={(ticket) => setSelectedTicketForDetails(ticket)}
      onOpenAuditTrail={() => setIsAuditTrailModalOpen(true)}
    />
  );
}

