'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CreateTicketModal } from './CreateTicketModal';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetailsModal } from './TaskDetailsModal';
import { TicketDetailsModal } from './TicketDetailsModal';
import { AuditLogModal } from './AuditLogModal';
import { AddLocationModal } from './AddLocationModal';
import { FacilityAssetsDrawer } from './FacilityAssetsDrawer';
import { RemoteTerminalModal } from './RemoteTerminalModal';
import { ThermalsModal } from './ThermalsModal';
import { ExportReportModal } from './ExportReportModal';
import { HotlineModal } from './HotlineModal';
import { HelpModal } from './HelpModal';
import { NotificationsDrawer } from './NotificationsDrawer';

export const GlobalModals: React.FC = () => {
  const {
    facilities,
    isCreateTicketModalOpen,
    setIsCreateTicketModalOpen,
    handleCreateTicket,
    isCreateTaskModalOpen,
    setIsCreateTaskModalOpen,
    createTaskDefaultStatus,
    handleCreateTask,
    selectedTaskForDetails,
    setSelectedTaskForDetails,
    handleUpdateTaskStatus,
    handleToggleSubtask,
    handleDeleteTask,
    selectedTicketForDetails,
    setSelectedTicketForDetails,
    handleUpdateTicketStatus,
    isAuditTrailModalOpen,
    setIsAuditTrailModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    handleAddFacility,
    selectedFacilityForAssets,
    setSelectedFacilityForAssets,
    selectedFacilityForTerminal,
    setSelectedFacilityForTerminal,
    selectedFacilityForThermals,
    setSelectedFacilityForThermals,
    isExportModalOpen,
    setIsExportModalOpen,
    isHotlineModalOpen,
    setIsHotlineModalOpen,
    isHelpModalOpen,
    setIsHelpModalOpen,
    isNotificationsModalOpen,
    setIsNotificationsModalOpen
  } = useApp();

  return (
    <>
      <CreateTicketModal
        isOpen={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        facilities={facilities}
        onCreateTicket={handleCreateTicket}
      />

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        facilities={facilities}
        onCreateTask={handleCreateTask}
        defaultStatus={createTaskDefaultStatus}
      />

      <TaskDetailsModal
        isOpen={selectedTaskForDetails !== null}
        task={selectedTaskForDetails}
        onClose={() => setSelectedTaskForDetails(null)}
        onUpdateStatus={handleUpdateTaskStatus}
        onToggleSubtask={handleToggleSubtask}
        onDeleteTask={handleDeleteTask}
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

      <HotlineModal
        isOpen={isHotlineModalOpen}
        onClose={() => setIsHotlineModalOpen(false)}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        facilities={facilities}
        onOpenThermals={(fac) => setSelectedFacilityForThermals(fac)}
      />
    </>
  );
};

