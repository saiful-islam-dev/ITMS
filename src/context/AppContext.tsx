'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Facility, SupportTicket, TaskItem, TaskStatus } from '../types';
import { initialFacilities } from '../data/mockFacilities';
import { mockTickets as initialMockTickets } from '../data/mockTickets';
import { initialMockTasks } from '../data/mockTasks';

interface AppContextType {
  facilities: Facility[];
  activeFacilities: Facility[];
  tickets: SupportTicket[];
  tasks: TaskItem[];
  selectedFacilityId: string;
  setSelectedFacilityId: (id: string) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  handleAddFacility: (newFac: Facility) => void;
  handleCreateTicket: (newTicket: SupportTicket) => void;
  handleUpdateTicketStatus: (ticketId: string, newStatus: SupportTicket['status']) => void;
  handleCreateTask: (newTask: TaskItem) => void;
  handleUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  handleToggleSubtask: (taskId: string, subtaskId: string) => void;
  handleDeleteTask: (taskId: string) => void;
  handlePingAll: () => void;

  // Modals
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isCreateTicketModalOpen: boolean;
  setIsCreateTicketModalOpen: (open: boolean) => void;
  selectedTicketForDetails: SupportTicket | null;
  setSelectedTicketForDetails: (ticket: SupportTicket | null) => void;
  isCreateTaskModalOpen: boolean;
  setIsCreateTaskModalOpen: (open: boolean) => void;
  createTaskDefaultStatus: TaskStatus;
  setCreateTaskDefaultStatus: (status: TaskStatus) => void;
  selectedTaskForDetails: TaskItem | null;
  setSelectedTaskForDetails: (task: TaskItem | null) => void;
  isAuditTrailModalOpen: boolean;
  setIsAuditTrailModalOpen: (open: boolean) => void;
  selectedFacilityForAssets: Facility | null;
  setSelectedFacilityForAssets: (fac: Facility | null) => void;
  selectedFacilityForTerminal: Facility | null;
  setSelectedFacilityForTerminal: (fac: Facility | null) => void;
  selectedFacilityForThermals: Facility | null;
  setSelectedFacilityForThermals: (fac: Facility | null) => void;
  isHotlineModalOpen: boolean;
  setIsHotlineModalOpen: (open: boolean) => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
  isNotificationsModalOpen: boolean;
  setIsNotificationsModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialMockTickets);
  const [tasks, setTasks] = useState<TaskItem[]>(initialMockTasks);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('all');
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [selectedTicketForDetails, setSelectedTicketForDetails] = useState<SupportTicket | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [createTaskDefaultStatus, setCreateTaskDefaultStatus] = useState<TaskStatus>('todo');
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<TaskItem | null>(null);
  const [isAuditTrailModalOpen, setIsAuditTrailModalOpen] = useState(false);
  const [selectedFacilityForAssets, setSelectedFacilityForAssets] = useState<Facility | null>(null);
  const [selectedFacilityForTerminal, setSelectedFacilityForTerminal] = useState<Facility | null>(null);
  const [selectedFacilityForThermals, setSelectedFacilityForThermals] = useState<Facility | null>(null);
  const [isHotlineModalOpen, setIsHotlineModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  const handleAddFacility = (newFac: Facility) => {
    setFacilities((prev) => [newFac, ...prev]);
  };

  const handleCreateTicket = (newTicket: SupportTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  const handleCreateTask = (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const progress = newStatus === 'done' ? 100 : newStatus === 'todo' ? 0 : t.progressPercent;
          return { ...t, status: newStatus, progressPercent: progress };
        }
        return t;
      })
    );
    if (selectedTaskForDetails && selectedTaskForDetails.id === taskId) {
      setSelectedTaskForDetails((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtasks) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          const total = updatedSubtasks.length;
          const completed = updatedSubtasks.filter((s) => s.completed).length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : t.progressPercent;
          return { ...t, subtasks: updatedSubtasks, progressPercent: progress };
        }
        return t;
      })
    );
    if (selectedTaskForDetails && selectedTaskForDetails.id === taskId && selectedTaskForDetails.subtasks) {
      const updatedSubtasks = selectedTaskForDetails.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      const total = updatedSubtasks.length;
      const completed = updatedSubtasks.filter((s) => s.completed).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : selectedTaskForDetails.progressPercent;
      setSelectedTaskForDetails({ ...selectedTaskForDetails, subtasks: updatedSubtasks, progressPercent: progress });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handlePingAll = () => {
    setFacilities((prev) =>
      prev.map((f) => ({
        ...f,
        pingMs: Math.max(2, Math.floor(f.pingMs + (Math.random() * 4 - 2)))
      }))
    );
  };

  const activeFacilities =
    selectedFacilityId === 'all'
      ? facilities
      : facilities.filter((f) => f.id === selectedFacilityId);

  return (
    <AppContext.Provider
      value={{
        facilities,
        activeFacilities,
        tickets,
        tasks,
        selectedFacilityId,
        setSelectedFacilityId,
        globalSearch,
        setGlobalSearch,
        handleAddFacility,
        handleCreateTicket,
        handleUpdateTicketStatus,
        handleCreateTask,
        handleUpdateTaskStatus,
        handleToggleSubtask,
        handleDeleteTask,
        handlePingAll,
        isAddModalOpen,
        setIsAddModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isCreateTicketModalOpen,
        setIsCreateTicketModalOpen,
        selectedTicketForDetails,
        setSelectedTicketForDetails,
        isCreateTaskModalOpen,
        setIsCreateTaskModalOpen,
        createTaskDefaultStatus,
        setCreateTaskDefaultStatus,
        selectedTaskForDetails,
        setSelectedTaskForDetails,
        isAuditTrailModalOpen,
        setIsAuditTrailModalOpen,
        selectedFacilityForAssets,
        setSelectedFacilityForAssets,
        selectedFacilityForTerminal,
        setSelectedFacilityForTerminal,
        selectedFacilityForThermals,
        setSelectedFacilityForThermals,
        isHotlineModalOpen,
        setIsHotlineModalOpen,
        isHelpModalOpen,
        setIsHelpModalOpen,
        isNotificationsModalOpen,
        setIsNotificationsModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

