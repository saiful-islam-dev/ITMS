'use client';

import { useApp } from '../../context/AppContext';
import { SupportTicketsScreen } from '../../components/screens/SupportTicketsScreen';

export default function SupportTicketsPage() {
  const {
    tickets,
    facilities,
    handleUpdateTicketStatus,
    setSelectedFacilityForThermals,
    setIsCreateTicketModalOpen
  } = useApp();

  return (
    <SupportTicketsScreen
      tickets={tickets}
      facilities={facilities}
      onUpdateTicketStatus={handleUpdateTicketStatus}
      onOpenThermals={(fac) => setSelectedFacilityForThermals(fac)}
      onOpenCreateTicket={() => setIsCreateTicketModalOpen(true)}
    />
  );
}

