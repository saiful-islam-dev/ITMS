'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Download,
  Search,
  Filter,
  Kanban,
  List as ListIcon,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Building,
  User,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  Printer,
  Battery,
  HardHat,
  ArrowRight,
  CheckSquare,
  Calendar,
  X,
  Sparkles,
  Server,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { TaskItem, TaskCategory, TaskPriority, TaskStatus, Facility } from '../../types';
import { exportTasksToCsv } from '../../utils/exportCsv';

interface TasksScreenProps {
  tasks: TaskItem[];
  facilities: Facility[];
  onOpenCreateTask: (defaultStatus?: TaskStatus) => void;
  onSelectTask: (task: TaskItem) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  facilities,
  onOpenCreateTask,
  onSelectTask,
  onUpdateTaskStatus,
  onToggleSubtask
}) => {
  // Navigation & Category Tab state
  const [activeCategory, setActiveCategory] = useState<TaskCategory>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Search & Secondary Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedDueFilter, setSelectedDueFilter] = useState<string>('this_week');

  // Interactive Drag & Drop or Status quick shift
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Compute counts for category tabs
  const categoryCounts = useMemo(() => {
    return {
      all: tasks.filter((t) => t.status !== 'done').length,
      preventative: tasks.filter((t) => t.category === 'preventative' && t.status !== 'done').length,
      network: tasks.filter((t) => t.category === 'network' && t.status !== 'done').length,
      hardware: tasks.filter((t) => t.category === 'hardware' && t.status !== 'done').length
    };
  }, [tasks]);

  // Filter tasks based on all active controls
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Category filter
      if (activeCategory !== 'all' && t.category !== activeCategory) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) {
        return false;
      }

      // Facility filter
      if (selectedFacility !== 'all' && t.facilityId !== selectedFacility) {
        return false;
      }

      // Assignee filter
      if (selectedAssignee !== 'all' && t.assignee.name.toLowerCase() !== selectedAssignee.toLowerCase()) {
        return false;
      }

      // Due date filter
      if (selectedDueFilter === 'today' && !t.isDueToday) {
        return false;
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = t.taskNumber.toLowerCase().includes(q);
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesDomain = t.domainTag.toLowerCase().includes(q);
        const matchesAsset = t.assetTag?.toLowerCase().includes(q);
        const matchesTicket = t.linkedTicketNumber?.toLowerCase().includes(q);
        const matchesAssignee = t.assignee.name.toLowerCase().includes(q);
        const matchesFacility = t.facilityName.toLowerCase().includes(q);

        if (!matchesNum && !matchesTitle && !matchesDesc && !matchesDomain && !matchesAsset && !matchesTicket && !matchesAssignee && !matchesFacility) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, activeCategory, selectedPriority, selectedFacility, selectedAssignee, selectedDueFilter, searchQuery]);

  // Tasks grouped by status column
  const todoTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'todo'), [filteredTasks]);
  const inProgressTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'in_progress'), [filteredTasks]);
  const reviewBlockedTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'review_blocked'), [filteredTasks]);
  const doneTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'done'), [filteredTasks]);

  // Metric counts (mirroring the design image)
  const totalPending = todoTasks.length + inProgressTasks.length + reviewBlockedTasks.length;
  const inProgressCount = inProgressTasks.length + 3; // live dispatched
  const completedCount = 32;
  const criticalCount = tasks.filter((t) => t.priority === 'critical' && t.status !== 'done').length;

  // Handle Drag & Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      onUpdateTaskStatus(taskId, targetStatus);
    }
    setDraggedTaskId(null);
  };

  // Render a single task card in Kanban
  const renderTaskCard = (task: TaskItem) => {
    const totalSub = task.subtasks?.length || 0;
    const completedSub = task.subtasks?.filter((s) => s.completed).length || 0;
    const hasProgress = task.progressPercent !== undefined || totalSub > 0;
    const progressVal = task.progressPercent ?? (totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0);

    return (
      <div
        key={task.id}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onClick={() => onSelectTask(task)}
        className="group relative bg-white border border-[#e2e8f0] hover:border-[#a5b4fc] rounded-xl p-3.5 shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-2.5"
      >
        {/* Card Header: TSK ID • Domain Tag | Priority or Status Badge */}
        <div className="flex items-center justify-between gap-1 text-[11px]">
          <div className="flex items-center gap-1.5 font-mono font-medium text-slate-500 truncate">
            <span className="text-[#3525cd] font-semibold">{task.taskNumber}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#464555] font-sans truncate">{task.domainTag}</span>
          </div>

          <div className="shrink-0">
            {task.status === 'review_blocked' && task.blockReason && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dc2626] text-white">
                ⛔ Blocked
              </span>
            )}
            {task.status === 'review_blocked' && !task.blockReason && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#e0e7ff] text-[#3730a3]">
                Under Review
              </span>
            )}
            {task.status === 'done' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e0f2fe] text-[#0369a1]">
                ✓ Resolved
              </span>
            )}
            {task.status !== 'review_blocked' && task.status !== 'done' && (
              <>
                {task.priority === 'critical' && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dc2626] text-white shadow-xs">
                    ▲ Critical
                  </span>
                )}
                {task.priority === 'high' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fee2e2] text-[#991b1b]">
                    High Priority
                  </span>
                )}
                {task.priority === 'medium' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#f1f5f9] text-slate-700">
                    Medium
                  </span>
                )}
                {task.priority === 'low' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                    Low
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Card Title & Description */}
        <div>
          <h4 className="text-xs font-bold text-[#131b2e] leading-snug line-clamp-2 group-hover:text-[#3525cd] transition-colors">
            {task.title}
          </h4>
          <p className="text-[11px] text-[#464555] line-clamp-2 mt-1 leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Specific Urgent Warning / Escalation pill if present */}
        {task.blockReason && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#fff1f2] border border-[#fecdd3] text-[10px] font-bold text-[#b91c1c]">
            <AlertTriangle className="w-3 h-3 shrink-0 text-[#e11d48]" />
            <span className="truncate">{task.blockReason}</span>
          </div>
        )}

        {/* CISO Review Note */}
        {task.reviewNote && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#f0f9ff] border border-[#bae6fd] text-[10px] font-semibold text-[#0369a1]">
            <CheckCircle2 className="w-3 h-3 shrink-0 text-[#0284c7]" />
            <span className="truncate">{task.reviewNote}</span>
          </div>
        )}

        {/* Progress Bar (In-Progress style) */}
        {task.status === 'in_progress' && hasProgress && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-medium">Progress</span>
              <span className="font-mono font-bold text-[#3525cd]">
                {progressVal}% {totalSub > 0 && `(${completedSub}/${totalSub})`}
              </span>
            </div>
            <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#3525cd] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressVal}%` }}
              />
            </div>
          </div>
        )}

        {/* Linked Ticket & Time Remaining chip */}
        {(task.linkedTicketNumber || task.timeRemaining) && (
          <div className="flex items-center gap-1.5 text-[10px] flex-wrap">
            {task.linkedTicketNumber && (
              <span className="font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {task.linkedTicketNumber}
              </span>
            )}
            {task.timeRemaining && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#991b1b] font-semibold">
                <Clock className="w-3 h-3 text-[#dc2626]" />
                {task.timeRemaining}
              </span>
            )}
          </div>
        )}

        {/* Tags Row: Asset Tag & Subtasks summary */}
        {(task.assetTag || (totalSub > 0 && task.status !== 'in_progress')) && (
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            {task.assetTag && (
              <span className="inline-flex items-center gap-1 font-mono px-1.5 py-0.5 rounded bg-[#f1f5f9] text-slate-700">
                {task.assetTag.startsWith('AST') ? (
                  <Printer className="w-3 h-3 text-slate-400" />
                ) : (
                  <Battery className="w-3 h-3 text-slate-400" />
                )}
                {task.assetTag}
              </span>
            )}
            {totalSub > 0 && task.status !== 'in_progress' && (
              <span className="inline-flex items-center gap-1 text-slate-500">
                <CheckSquare className="w-3 h-3 text-slate-400" />
                {completedSub}/{totalSub} subtasks
              </span>
            )}
          </div>
        )}

        {/* Card Footer: Location • Due Date | Assignee Avatar */}
        <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-slate-500 truncate max-w-[75%]">
            <span className="inline-flex items-center gap-1 truncate" title={task.facilityName}>
              <Building className="w-3 h-3 shrink-0 text-slate-400" />
              <span className="truncate">{task.facilityShort}</span>
            </span>

            {task.completedTime ? (
              <span className="shrink-0 text-slate-600 font-medium">
                {task.completedTime}
              </span>
            ) : task.dueDate ? (
              <span
                className={`shrink-0 inline-flex items-center gap-1 font-medium ${
                  task.isDueToday ? 'text-amber-700 font-bold' : 'text-slate-600'
                }`}
              >
                {task.isDueToday && <Clock className="w-3 h-3 text-amber-600" />}
                {task.dueDate}
              </span>
            ) : null}
          </div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs ring-1 ring-white ${task.assignee.avatarColor}`}
            title={`Assigned to ${task.assignee.name}`}
          >
            {task.assignee.initials}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Header with Breadcrumb, Title, Subtitle, and Top Action Buttons */}
      <div className="space-y-1">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-1.5 text-xs text-[#464555]">
          <span className="hover:text-[#131b2e] cursor-pointer">IT Operations</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="hover:text-[#131b2e] cursor-pointer">Workflow & Maintenance</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-[#131b2e]">Tasks</span>
        </nav>

        {/* Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#131b2e] tracking-tight">
              Task Management
            </h1>
            <p className="text-xs text-[#464555] max-w-2xl mt-0.5">
              Scheduled preventative maintenance, floor network rollouts, hardware provisioning, and SLA remediation tasks.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Export Tasks (CSV) button */}
            <button
              type="button"
              onClick={() => exportTasksToCsv(filteredTasks)}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#131b2e] bg-white border border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#464555]" />
              <span>Export Tasks (CSV)</span>
            </button>

            {/* + Create Task button */}
            <button
              type="button"
              onClick={() => onOpenCreateTask('todo')}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#4f46e5] hover:bg-[#4338ca] rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metrics / KPI Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: TOTAL PENDING TASKS */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-3.5 shadow-level-1 flex flex-col justify-between hover:border-[#c7c4d8] transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#464555]">
              TOTAL PENDING TASKS
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#eaedff] text-[#3525cd] flex items-center justify-center">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-bold text-[#131b2e] tracking-tight tabular-nums">
              {totalPending || 14}
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-[11px] text-slate-500">
                active ops • 3 Rollout
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fffbeb] text-[#b45309] border border-[#fde68a]">
                <Clock className="w-2.5 h-2.5" /> 4 Due Today
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: IN PROGRESS / DISPATCHED */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-3.5 shadow-level-1 flex flex-col justify-between hover:border-[#c7c4d8] transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#464555]">
              IN PROGRESS / DISPATCHED
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
              <HardHat className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-bold text-[#131b2e] tracking-tight tabular-nums">
              {inProgressCount || 8}
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-[11px] text-slate-500">
                live • 5 Floor Techs Active
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f3e8ff] text-[#7e22ce] border border-[#e9d5ff]">
                Sewing & Whse
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: COMPLETED THIS WEEK */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-3.5 shadow-level-1 flex flex-col justify-between hover:border-[#c7c4d8] transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#464555]">
              COMPLETED THIS WEEK
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-bold text-[#131b2e] tracking-tight tabular-nums">
              {completedCount}
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-emerald-600" /> 98.1% On-time SLA
              </span>
              <span className="text-[11px] text-slate-400">
                Avg. 1.8h resolve
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: CRITICAL ATTENTION */}
        <div className="bg-white border border-[#fee2e2] rounded-xl p-3.5 shadow-level-1 flex flex-col justify-between hover:border-[#fca5a5] transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#991b1b]">
              CRITICAL ATTENTION
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#fee2e2] text-[#dc2626] flex items-center justify-center font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-bold text-[#991b1b] tracking-tight tabular-nums">
              {criticalCount || 2}
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-[11px] text-[#991b1b]/80 truncate max-w-[130px]">
                urgent actions • Bld-B Switch Stack...
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#fee2e2] text-[#dc2626] border border-[#fca5a5] uppercase">
                SLA BREACHED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Operations Banner Strip & Tech Load Avatars */}
      <div className="bg-[#f2f4ff]/80 border border-[#e2e7ff] rounded-2xl p-3 flex flex-col xl:flex-row xl:items-center justify-between gap-3 shadow-xs">
        {/* Left Side: 3 Live Status Tickers */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Ticker 1 */}
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-[#e2e8f0] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-[#131b2e]">Factory A:</span>
            <span className="text-emerald-700 font-medium">Sewing 1F-3F (All 18 APs Online)</span>
          </div>

          {/* Ticker 2 */}
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-[#e2e8f0] shadow-xs">
            <Building className="w-3.5 h-3.5 text-[#3525cd]" />
            <span className="font-semibold text-[#131b2e]">Central Whse:</span>
            <span className="text-[#3525cd] font-medium">RFID Portals Recalibration Active</span>
          </div>

          {/* Ticker 3 */}
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-[#e2e8f0] shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-[#131b2e]">Factory B:</span>
            <span className="text-amber-800 font-medium">VLAN 40 Cutover In Progress</span>
          </div>
        </div>

        {/* Right Side: TECH LOAD with Avatars & Busy Indicators */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0 self-end xl:self-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            TECH LOAD:
          </span>

          <div className="flex items-center gap-2">
            {/* TR Tariq */}
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-[#e2e8f0] shadow-xs" title="Tariq Rahman (4 tasks assigned)">
              <div className="w-5 h-5 rounded-full bg-[#4f46e5] text-white flex items-center justify-center text-[10px] font-bold">
                TR
              </div>
              <span className="text-xs font-medium text-[#131b2e]">Tariq</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            </div>

            {/* FY Farhana */}
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-[#e2e8f0] shadow-xs" title="Farhana Yasmin (2 tasks assigned)">
              <div className="w-5 h-5 rounded-full bg-[#00659a] text-white flex items-center justify-center text-[10px] font-bold">
                FY
              </div>
              <span className="text-xs font-medium text-[#131b2e]">Farhana</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </div>

            {/* RZ Rezaul */}
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-[#e2e8f0] shadow-xs" title="Rezaul Karim (2 tasks assigned)">
              <div className="w-5 h-5 rounded-full bg-[#5b598c] text-white flex items-center justify-center text-[10px] font-bold">
                RZ
              </div>
              <span className="text-xs font-medium text-[#131b2e]">Rezaul</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>

            {/* KH Kabir */}
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-[#e2e8f0] shadow-xs" title="Kabir Hossain (1 task assigned)">
              <div className="w-5 h-5 rounded-full bg-[#1e40af] text-white flex items-center justify-center text-[10px] font-bold">
                KH
              </div>
              <span className="text-xs font-medium text-[#131b2e]">Kabir</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Category Tabs & View Switcher Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Left: Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* All Tasks */}
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#eaedff]/60 hover:bg-[#eaedff] text-[#464555]'
            }`}
          >
            <span>All Tasks</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
              }`}
            >
              {categoryCounts.all}
            </span>
          </button>

          {/* Preventative Maint */}
          <button
            type="button"
            onClick={() => setActiveCategory('preventative')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'preventative'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#eaedff]/60 hover:bg-[#eaedff] text-[#464555]'
            }`}
          >
            <span>Preventative Maint</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                activeCategory === 'preventative' ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
              }`}
            >
              {categoryCounts.preventative || 6}
            </span>
          </button>

          {/* Network & Infra */}
          <button
            type="button"
            onClick={() => setActiveCategory('network')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'network'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#eaedff]/60 hover:bg-[#eaedff] text-[#464555]'
            }`}
          >
            <span>Network & Infra</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                activeCategory === 'network' ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
              }`}
            >
              {categoryCounts.network || 4}
            </span>
          </button>

          {/* Hardware Rollout */}
          <button
            type="button"
            onClick={() => setActiveCategory('hardware')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'hardware'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#eaedff]/60 hover:bg-[#eaedff] text-[#464555]'
            }`}
          >
            <span>Hardware Rollout</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                activeCategory === 'hardware' ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
              }`}
            >
              {categoryCounts.hardware || 3}
            </span>
          </button>
        </div>

        {/* Right: View Mode Toggle (Kanban Board vs List View) */}
        <div className="flex items-center gap-1.5 self-end md:self-auto">
          <div className="flex items-center p-0.5 bg-[#eaedff]/70 border border-[#e2e7ff] rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-[#3525cd] shadow-xs'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban Board</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#3525cd] shadow-xs'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>

          <button
            type="button"
            title="Advanced filter options"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-[#cbd5e1] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Search & Secondary Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 text-xs">
        {/* Search input */}
        <div className="lg:col-span-4 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search TSK-XXXX, title, serial, tag..."
            className="w-full pl-8 pr-10 py-1.5 rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#3525cd] text-xs bg-white text-[#131b2e] placeholder-slate-400 shadow-2xs"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1 py-0.2 rounded bg-slate-100 text-[10px] text-slate-400 font-mono">
            ⌘/
          </span>
        </div>

        {/* Priority Filter */}
        <div className="lg:col-span-2">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#3525cd] text-xs bg-white text-[#131b2e] shadow-2xs"
          >
            <option value="all">Priority: All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Facility Filter */}
        <div className="lg:col-span-2">
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#3525cd] text-xs bg-white text-[#131b2e] shadow-2xs"
          >
            <option value="all">Facility: All Locations</option>
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee Filter */}
        <div className="lg:col-span-2">
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#3525cd] text-xs bg-white text-[#131b2e] shadow-2xs"
          >
            <option value="all">Assignee: All Techs</option>
            <option value="Tariq Rahman">Tariq Rahman (Lead)</option>
            <option value="Farhana Yasmin">Farhana Yasmin</option>
            <option value="Rezaul Karim">Rezaul Karim</option>
            <option value="Kabir Hossain">Kabir Hossain</option>
            <option value="Samia Akter">Samia Akter</option>
            <option value="Rashedul Mahmud">Rashedul Mahmud</option>
          </select>
        </div>

        {/* Due Date Filter */}
        <div className="lg:col-span-2">
          <select
            value={selectedDueFilter}
            onChange={(e) => setSelectedDueFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#3525cd] text-xs bg-white text-[#131b2e] shadow-2xs"
          >
            <option value="this_week">Due: This Week</option>
            <option value="today">Due Today</option>
            <option value="all">All Due Dates</option>
          </select>
        </div>
      </div>

      {/* 6. Main Tasks View (Kanban Board OR List View) */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 items-start">
          {/* ================= COLUMN 1: TO DO ================= */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'todo')}
            className="bg-[#f4f6fd]/80 border border-[#e2e7ff] rounded-2xl p-3 flex flex-col min-h-[580px] shadow-2xs"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#e2e7ff]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <h3 className="font-bold text-xs text-[#131b2e] tracking-wider uppercase">
                  TO DO
                </h3>
                <span className="px-1.5 py-0.2 rounded-md bg-white border border-[#e2e8f0] text-slate-700 font-mono text-[11px] font-bold">
                  {todoTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onOpenCreateTask('todo')}
                title="Add task to To Do"
                className="w-6 h-6 rounded-lg text-slate-500 hover:text-[#3525cd] hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1">
              {todoTasks.map(renderTaskCard)}
              {todoTasks.length === 0 && (
                <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs">
                  <span>No tasks in TO DO</span>
                </div>
              )}
            </div>
          </div>

          {/* ================= COLUMN 2: IN PROGRESS ================= */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'in_progress')}
            className="bg-[#f4f6fd]/80 border border-[#e2e7ff] rounded-2xl p-3 flex flex-col min-h-[580px] shadow-2xs"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#e2e7ff]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3525cd]" />
                <h3 className="font-bold text-xs text-[#131b2e] tracking-wider uppercase">
                  IN PROGRESS
                </h3>
                <span className="px-1.5 py-0.2 rounded-md bg-white border border-[#e2e8f0] text-slate-700 font-mono text-[11px] font-bold">
                  {inProgressTasks.length}
                </span>
              </div>

              <button
                type="button"
                title="Sort column"
                className="w-6 h-6 rounded-lg text-slate-500 hover:text-[#3525cd] hover:bg-white flex items-center justify-center transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1">
              {inProgressTasks.map(renderTaskCard)}
              {inProgressTasks.length === 0 && (
                <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs">
                  <span>No tasks in progress</span>
                </div>
              )}
            </div>
          </div>

          {/* ================= COLUMN 3: REVIEW / BLOCKED ================= */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'review_blocked')}
            className="bg-[#f4f6fd]/80 border border-[#e2e7ff] rounded-2xl p-3 flex flex-col min-h-[580px] shadow-2xs"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#e2e7ff]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
                <h3 className="font-bold text-xs text-[#131b2e] tracking-wider uppercase">
                  REVIEW / BLOCKED
                </h3>
                <span className="px-1.5 py-0.2 rounded-md bg-white border border-[#e2e8f0] text-slate-700 font-mono text-[11px] font-bold">
                  {reviewBlockedTasks.length}
                </span>
              </div>

              <button
                type="button"
                title="Column guidelines"
                className="w-6 h-6 rounded-lg text-slate-500 hover:text-[#dc2626] hover:bg-white flex items-center justify-center transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1">
              {reviewBlockedTasks.map(renderTaskCard)}
              {reviewBlockedTasks.length === 0 && (
                <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs">
                  <span>No blocked tasks</span>
                </div>
              )}
            </div>
          </div>

          {/* ================= COLUMN 4: DONE (TODAY) ================= */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'done')}
            className="bg-[#f4f6fd]/80 border border-[#e2e7ff] rounded-2xl p-3 flex flex-col min-h-[580px] shadow-2xs"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#e2e7ff]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]" />
                <h3 className="font-bold text-xs text-[#131b2e] tracking-wider uppercase">
                  DONE (TODAY)
                </h3>
                <span className="px-1.5 py-0.2 rounded-md bg-white border border-[#e2e8f0] text-slate-700 font-mono text-[11px] font-bold">
                  {doneTasks.length}
                </span>
              </div>

              <div className="w-6 h-6 rounded-lg text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1">
              {doneTasks.map(renderTaskCard)}
              {doneTasks.length === 0 && (
                <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs">
                  <span>No completed tasks today</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ================= LIST VIEW TABLE ================= */
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8f9fe] border-b border-[#e2e8f0] text-[#464555] font-semibold">
                  <th className="py-3 px-4 font-mono">Task ID</th>
                  <th className="py-3 px-4">Title & Description</th>
                  <th className="py-3 px-3">Subsystem</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Facility</th>
                  <th className="py-3 px-3">Assignee</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Due / Log</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="hover:bg-[#f8f9fe] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#3525cd]">
                      {task.taskNumber}
                    </td>

                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-bold text-[#131b2e] group-hover:text-[#3525cd] transition-colors truncate">
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {task.description}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#eaedff] text-[#3525cd] font-semibold text-[11px]">
                        {task.domainTag}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      {task.priority === 'critical' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dc2626] text-white">
                          ▲ Critical
                        </span>
                      )}
                      {task.priority === 'high' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fee2e2] text-[#991b1b]">
                          High Priority
                        </span>
                      )}
                      {task.priority === 'medium' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#f1f5f9] text-slate-700">
                          Medium
                        </span>
                      )}
                      {task.priority === 'low' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                          Low
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-slate-600 truncate max-w-[130px]">
                      {task.facilityShort}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-bold ${task.assignee.avatarColor}`}>
                          {task.assignee.initials}
                        </span>
                        <span className="truncate">{task.assignee.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      {task.status === 'todo' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          TO DO
                        </span>
                      )}
                      {task.status === 'in_progress' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eaedff] text-[#3525cd]">
                          IN PROGRESS ({task.progressPercent || 0}%)
                        </span>
                      )}
                      {task.status === 'review_blocked' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fee2e2] text-[#b91c1c]">
                          BLOCKED / REVIEW
                        </span>
                      )}
                      {task.status === 'done' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e0f2fe] text-[#0369a1]">
                          ✓ RESOLVED
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {task.completedTime || task.dueDate || '—'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTask(task);
                        }}
                        className="text-xs font-semibold text-[#4f46e5] hover:text-[#3730a3]"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Bottom Maintenance & Handover Summary Footer Row (3 Panels) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
        {/* Panel 1: Next Scheduled Maintenance Window */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-level-1 flex flex-col justify-between hover:border-[#c7c4d8] transition-all">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#3525cd] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#131b2e]">
                Next Scheduled Maintenance Window
              </h4>
              <p className="text-[11px] text-[#464555] mt-1 leading-relaxed">
                Saturday 11:00 PM - Sunday 03:00 AM (4h). Fabric Warehouse Core Switch firmware patch.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#f1f5f9] text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-[#eaedff] text-[#3525cd] font-semibold text-[10px]">
              Notice Sent to Production
            </span>
            <button
              type="button"
              className="text-[#3525cd] hover:underline font-bold flex items-center gap-0.5"
            >
              <span>View Window Plan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Panel 2: May 2025 PM Cycle (Floor IT) */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-level-1 flex flex-col justify-between hover:border-[#c7c4d8] transition-all">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#131b2e]">
                  May 2025 PM Cycle (Floor IT)
                </h4>
                <span className="font-mono text-xs font-bold text-[#3525cd]">
                  78% Done
                </span>
              </div>
              <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden my-2">
                <div className="bg-[#3525cd] h-full rounded-full w-[78%]" />
              </div>
              <p className="text-[11px] text-[#464555] leading-relaxed">
                142 of 182 floor assets serviced (printers, rugged tablets, and sewing terminal gateways).
              </p>
            </div>
          </div>
        </div>

        {/* Panel 3: Shift 1 to Shift 2 IT Handoff */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-level-1 flex flex-col justify-between hover:border-[#c7c4d8] transition-all">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f3e8ff] text-[#7e22ce] flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#131b2e]">
                Shift 1 to Shift 2 IT Handoff
              </h4>
              <p className="text-[11px] text-[#464555] mt-1 leading-relaxed">
                Lead Tariq Rahman will handover Factory B VLAN migration monitoring to Farhana Yeasmin at 16:00.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#f1f5f9] text-[11px]">
            <span className="text-slate-500 font-medium">Handoff Checklist: 4/4 Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

