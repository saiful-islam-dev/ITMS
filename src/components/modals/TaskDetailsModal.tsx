import React from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Building,
  Tag,
  User,
  Link2,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Server
} from 'lucide-react';
import { TaskItem, TaskStatus, TaskPriority } from '../../types';

interface TaskDetailsModalProps {
  isOpen: boolean;
  task: TaskItem | null;
  onClose: () => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  task,
  onClose,
  onUpdateStatus,
  onToggleSubtask,
  onDeleteTask
}) => {
  if (!isOpen || !task) return null;

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : task.progressPercent || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative bg-white border border-[#c7c4d8] rounded-2xl w-full max-w-2xl shadow-level-3 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e7ff] bg-[#faf8ff]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#eaedff] text-[#3525cd]">
              {task.taskNumber}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {task.domainTag}
            </span>
            {task.priority === 'critical' && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#dc2626] text-white">
                ▲ Critical
              </span>
            )}
            {task.priority === 'high' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#991b1b]">
                High Priority
              </span>
            )}
            {task.priority === 'medium' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#f1f5f9] text-slate-700">
                Medium
              </span>
            )}
            {task.priority === 'low' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                Low
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Title & Scope */}
          <div>
            <h2 className="text-lg font-bold text-[#131b2e] leading-snug">
              {task.title}
            </h2>
            <p className="mt-2 text-xs text-[#464555] leading-relaxed bg-[#f8f9fe] p-3 rounded-xl border border-[#e2e7ff]">
              {task.description}
            </p>
          </div>

          {/* Quick Alert Badges if any */}
          {task.blockReason && (
            <div className="flex items-center gap-2 p-2.5 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-xs text-[#991b1b] font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0 text-[#dc2626]" />
              <span>{task.blockReason}</span>
            </div>
          )}

          {task.reviewNote && (
            <div className="flex items-center gap-2 p-2.5 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl text-xs text-[#1e40af] font-medium">
              <Clock className="w-4 h-4 shrink-0 text-[#2563eb]" />
              <span>{task.reviewNote}</span>
            </div>
          )}

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#faf8ff] p-3.5 rounded-xl border border-[#eaedff] text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Facility
              </span>
              <div className="flex items-center gap-1.5 font-medium text-[#131b2e] mt-0.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate" title={task.facilityName}>{task.facilityName}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Assignee
              </span>
              <div className="flex items-center gap-1.5 font-medium text-[#131b2e] mt-0.5">
                <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${task.assignee.avatarColor}`}>
                  {task.assignee.initials}
                </span>
                <span className="truncate">{task.assignee.name}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Target Due / Log
              </span>
              <div className="flex items-center gap-1.5 font-medium text-[#131b2e] mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{task.completedTime || task.dueDate || 'Flexible'}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Related Asset
              </span>
              <div className="flex items-center gap-1.5 font-medium text-[#131b2e] mt-0.5">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-xs">{task.assetTag || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Status Progression Bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#131b2e]">Execution Progress</span>
              <span className="text-xs font-mono font-bold text-[#3525cd]">
                {progress}% {totalSubtasks > 0 && `(${completedSubtasks}/${totalSubtasks})`}
              </span>
            </div>
            <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#3525cd] h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Subtasks Checklist */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div>
              <span className="text-xs font-bold text-[#131b2e] block mb-2">
                Operational Checklist
              </span>
              <div className="space-y-1.5">
                {task.subtasks.map((st) => (
                  <label
                    key={st.id}
                    onClick={() => onToggleSubtask(task.id, st.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      st.completed
                        ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46] line-through'
                        : 'bg-white border-[#e2e8f0] text-[#131b2e] hover:bg-[#f8f9fe]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => {}} // Handled by container onClick
                      className="mt-0.5 rounded text-[#4f46e5] focus:ring-[#4f46e5]"
                    />
                    <span className="flex-1">{st.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Change Status Pipeline */}
          <div className="pt-2 border-t border-[#e2e7ff]">
            <span className="text-xs font-bold text-[#131b2e] block mb-2">
              Move Pipeline Status
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onUpdateStatus(task.id, 'todo')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                  task.status === 'todo'
                    ? 'bg-[#eaedff] border-[#3525cd] text-[#3525cd] ring-1 ring-[#3525cd]'
                    : 'bg-white border-[#cbd5e1] text-[#464555] hover:bg-slate-50'
                }`}
              >
                ● TO DO
              </button>

              <button
                type="button"
                onClick={() => onUpdateStatus(task.id, 'in_progress')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                  task.status === 'in_progress'
                    ? 'bg-[#eaedff] border-[#3525cd] text-[#3525cd] ring-1 ring-[#3525cd]'
                    : 'bg-white border-[#cbd5e1] text-[#464555] hover:bg-slate-50'
                }`}
              >
                ● IN PROGRESS
              </button>

              <button
                type="button"
                onClick={() => onUpdateStatus(task.id, 'review_blocked')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                  task.status === 'review_blocked'
                    ? 'bg-[#fee2e2] border-[#dc2626] text-[#b91c1c] ring-1 ring-[#dc2626]'
                    : 'bg-white border-[#cbd5e1] text-[#464555] hover:bg-slate-50'
                }`}
              >
                ● REVIEW / BLOCKED
              </button>

              <button
                type="button"
                onClick={() => onUpdateStatus(task.id, 'done')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                  task.status === 'done'
                    ? 'bg-[#ecfdf5] border-[#10b981] text-[#047857] ring-1 ring-[#10b981]'
                    : 'bg-white border-[#cbd5e1] text-[#464555] hover:bg-slate-50'
                }`}
              >
                ✓ DONE
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#e2e7ff] bg-[#faf8ff]">
          {onDeleteTask ? (
            <button
              type="button"
              onClick={() => {
                onDeleteTask(task.id);
                onClose();
              }}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Task
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] rounded-xl transition-all shadow-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

