import React, { useState } from 'react';
import { X, CheckSquare, Plus, Trash2, Calendar, User, Building, Tag, AlertCircle } from 'lucide-react';
import { Facility, TaskItem, TaskPriority } from '../../types';
import { mockTechAssignees } from '../../data/mockTasks';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: Facility[];
  onCreateTask: (newTask: TaskItem) => void;
  defaultStatus?: TaskItem['status'];
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  facilities,
  onCreateTask,
  defaultStatus = 'todo'
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'preventative' | 'network' | 'hardware'>('preventative');
  const [domainTag, setDomainTag] = useState('Printers');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [facilityId, setFacilityId] = useState(facilities[0]?.id || 'loc-mfg-01');
  const [assigneeKey, setAssigneeKey] = useState<string>('tr');
  const [dueDate, setDueDate] = useState('Tomorrow 5PM');
  const [assetTag, setAssetTag] = useState('');
  const [linkedTicket, setLinkedTicket] = useState('');
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([
    { id: 'st-new-1', title: 'Initial inspection & physical verification', completed: false }
  ]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: `st-new-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((st) => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedFacility = facilities.find((f) => f.id === facilityId) || facilities[0];
    const selectedAssignee = mockTechAssignees[assigneeKey] || mockTechAssignees.tr;

    const newTask: TaskItem = {
      id: `tsk-${Date.now()}`,
      taskNumber: `TSK-2024-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      description: description.trim() || 'No additional technical notes provided.',
      category,
      domainTag: domainTag || 'General',
      status: defaultStatus,
      priority,
      facilityId: selectedFacility.id,
      facilityCode: selectedFacility.code,
      facilityName: selectedFacility.name,
      facilityShort: selectedFacility.name.length > 18 ? selectedFacility.name.slice(0, 15) + '...' : selectedFacility.name,
      assignee: selectedAssignee,
      dueDate: dueDate.trim() || 'Pending schedule',
      assetTag: assetTag.trim() || undefined,
      linkedTicketNumber: linkedTicket.trim() || undefined,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
      progressPercent: defaultStatus === 'done' ? 100 : defaultStatus === 'in_progress' ? 10 : 0,
      createdAt: new Date().toISOString()
    };

    onCreateTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative bg-white border border-[#c7c4d8] rounded-2xl w-full max-w-2xl shadow-level-3 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e7ff] bg-[#faf8ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4f46e5]/10 text-[#4f46e5] flex items-center justify-center font-bold text-sm">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#131b2e]">Create Operational Task</h2>
              <p className="text-xs text-[#464555]">
                Schedule floor maintenance, network changes, or hardware rollouts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quarterly Firmware Upgrade for Zebra ZT410 Printers"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-all bg-white text-[#131b2e]"
            />
          </div>

          {/* Category & Domain Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#4f46e5] bg-white text-[#131b2e]"
              >
                <option value="preventative">Preventative Maintenance</option>
                <option value="network">Network & Infrastructure</option>
                <option value="hardware">Hardware Rollout</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Domain Tag / Subsystem
              </label>
              <input
                type="text"
                value={domainTag}
                onChange={(e) => setDomainTag(e.target.value)}
                placeholder="e.g. Printers, Power, CAD Ops, VLAN"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#4f46e5] bg-white text-[#131b2e]"
              />
            </div>
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#4f46e5] bg-white text-[#131b2e]"
              >
                <option value="critical">▲ Critical (Immediate Production Impact)</option>
                <option value="high">High Priority (Within 24h)</option>
                <option value="medium">Medium (Scheduled Standard)</option>
                <option value="low">Low (Backlog & Hygiene)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Target Completion / Due
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Tomorrow 5PM, May 22, Today 4PM"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#4f46e5] bg-white text-[#131b2e]"
              />
            </div>
          </div>

          {/* Facility & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Plant / Facility Location
              </label>
              <select
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#4f46e5] bg-white text-[#131b2e]"
              >
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} ({fac.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Assigned Lead Technician
              </label>
              <select
                value={assigneeKey}
                onChange={(e) => setAssigneeKey(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#4f46e5] bg-white text-[#131b2e]"
              >
                {Object.entries(mockTechAssignees).map(([key, tech]) => (
                  <option key={key} value={key}>
                    {tech.name} ({tech.initials}) — {tech.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Asset Tag & Linked Ticket */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Target Asset Tag (Optional)
              </label>
              <input
                type="text"
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                placeholder="e.g. AST-9842, APC-SRT10K"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#4f46e5] bg-white text-[#131b2e]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Linked Support Ticket (Optional)
              </label>
              <input
                type="text"
                value={linkedTicket}
                onChange={(e) => setLinkedTicket(e.target.value)}
                placeholder="e.g. TCK-2024-1842"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#4f46e5] bg-white text-[#131b2e]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-1">
              Scope of Work & Technical Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide execution details, safety measures, roll-back plan, or tool requirements..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#4f46e5] bg-white text-[#131b2e]"
            />
          </div>

          {/* Subtasks Checklist */}
          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-1.5">
              Task Checklist / Subtasks ({subtasks.length})
            </label>
            <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto">
              {subtasks.map((st, idx) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between px-3 py-1.5 bg-[#f8f9fe] border border-[#e2e7ff] rounded-lg text-xs"
                >
                  <span className="text-[#131b2e] truncate">{idx + 1}. {st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask step (e.g. Backup configuration)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#cbd5e1] focus:outline-none focus:border-[#4f46e5] bg-white text-[#131b2e]"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-[#eaedff] text-[#3525cd] hover:bg-[#dce2ff] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#e2e7ff]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#464555] hover:text-[#131b2e] hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#4f46e5] hover:bg-[#4338ca] rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

