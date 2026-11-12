'use client';

import { useApp } from '../context/AppContext';
import { TasksScreen } from '../components/screens/TasksScreen';

export default function HomePage() {
  const {
    tasks,
    facilities,
    setCreateTaskDefaultStatus,
    setIsCreateTaskModalOpen,
    setSelectedTaskForDetails,
    handleUpdateTaskStatus,
    handleToggleSubtask
  } = useApp();

  return (
    <TasksScreen
      tasks={tasks}
      facilities={facilities}
      onOpenCreateTask={(defaultStatus) => {
        setCreateTaskDefaultStatus(defaultStatus || 'todo');
        setIsCreateTaskModalOpen(true);
      }}
      onSelectTask={(task) => setSelectedTaskForDetails(task)}
      onUpdateTaskStatus={handleUpdateTaskStatus}
      onToggleSubtask={handleToggleSubtask}
    />
  );
}

