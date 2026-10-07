import React, { useState } from 'react';
import { Course, Deadline, Priority, DeadlineType } from '../types';
import { calculateDeadlineStatus } from '../utils/timeHelpers';
import {
  Plus,
  Search,
  Filter,
  CheckCircle,
  Circle,
  Clock,
  AlertTriangle,
  Calendar,
  Edit3,
  Trash2,
  FileCheck,
  BookOpen,
  ArrowUpDown,
} from 'lucide-react';

interface DeadlinesViewProps {
  deadlines: Deadline[];
  courses: Course[];
  onToggleComplete: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (deadline: Deadline) => void;
  onDeleteDeadline: (id: string) => void;
}

export const DeadlinesView: React.FC<DeadlinesViewProps> = ({
  deadlines,
  courses,
  onToggleComplete,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteDeadline,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'due_asc' | 'due_desc' | 'priority' | 'title'>('due_asc');

  const courseMap = new Map<string, Course>(courses.map(c => [c.id, c]));

  // Stats calculation
  const totalCount = deadlines.length;
  const completedCount = deadlines.filter(d => d.completed).length;
  const pendingCount = totalCount - completedCount;
  const urgentCount = deadlines.filter(
    d => !d.completed && (d.priority === 'urgent' || calculateDeadlineStatus(d).isOverdue)
  ).length;

  // Filter list
  const filtered = deadlines.filter(d => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const course = courseMap.get(d.courseId);
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchNotes = d.notes?.toLowerCase().includes(q) || false;
      const matchCourse = course?.name.toLowerCase().includes(q) || course?.code.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes && !matchCourse) return false;
    }

    // Status
    if (statusFilter === 'pending' && d.completed) return false;
    if (statusFilter === 'completed' && !d.completed) return false;

    // Course
    if (courseFilter !== 'all' && d.courseId !== courseFilter) return false;

    // Type
    if (typeFilter !== 'all' && d.type !== typeFilter) return false;

    // Priority
    if (priorityFilter !== 'all' && d.priority !== priorityFilter) return false;

    return true;
  });

  // Sort list
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'due_asc') {
      const aTime = new Date(`${a.dueDate}T${a.dueTime}`).getTime();
      const bTime = new Date(`${b.dueDate}T${b.dueTime}`).getTime();
      return aTime - bTime;
    }
    if (sortBy === 'due_desc') {
      const aTime = new Date(`${a.dueDate}T${a.dueTime}`).getTime();
      const bTime = new Date(`${b.dueDate}T${b.dueTime}`).getTime();
      return bTime - aTime;
    }
    if (sortBy === 'priority') {
      const rank: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
      return rank[b.priority] - rank[a.priority];
    }
    return a.title.localeCompare(b.title);
  });

  const getPriorityBadgeClass = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'low':
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Pending Deadlines</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {pendingCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-rose-600 font-medium">Urgent / Overdue</span>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1 tabular-nums">
            {urgentCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-emerald-600 font-medium">Completed</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
            {completedCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-indigo-600 font-medium">Total Tracked</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {totalCount}
          </div>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search assignments, lab tasks, course names..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Deadline</span>
          </button>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Status selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All
            </button>
          </div>

          {/* Subject Filter */}
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name.slice(0, 24)}...
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Types</option>
            <option value="assignment">Assignment</option>
            <option value="lab_report">Lab Record</option>
            <option value="quiz">Quiz</option>
            <option value="project">Project</option>
            <option value="exam">Exam / IA</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Sort selector */}
          <div className="ml-auto flex items-center gap-1 text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'due_asc' | 'due_desc' | 'priority' | 'title')}
              className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:outline-hidden"
            >
              <option value="due_asc">Due Date (Earliest First)</option>
              <option value="due_desc">Due Date (Latest First)</option>
              <option value="priority">Priority</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deadlines Detailed List */}
      <div className="space-y-3">
        {sorted.length > 0 ? (
          sorted.map(deadline => {
            const course = courseMap.get(deadline.courseId);
            const status = calculateDeadlineStatus(deadline);

            return (
              <div
                key={deadline.id}
                className={`p-4 rounded-2xl border transition-all ${
                  deadline.completed
                    ? 'bg-slate-50/70 border-slate-200 opacity-60'
                    : status.isOverdue
                    ? 'bg-rose-50/30 border-rose-200 shadow-xs'
                    : status.isToday
                    ? 'bg-amber-50/30 border-amber-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => onToggleComplete(deadline.id)}
                    className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                    title={deadline.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {deadline.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 hover:stroke-indigo-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {course && (
                        <span
                          className="text-xs font-mono font-bold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: course.color }}
                        >
                          {course.code}
                        </span>
                      )}
                      <span className="text-xs text-slate-600 font-medium capitalize">
                        {deadline.type.replace('_', ' ')}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityBadgeClass(
                          deadline.priority
                        )}`}
                      >
                        {deadline.priority}
                      </span>

                      {!deadline.completed && (
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                            status.isOverdue
                              ? 'bg-rose-100 text-rose-800'
                              : status.isToday
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {status.isOverdue ? (
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-slate-500" />
                          )}
                          <span>{status.displayText}</span>
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-base font-bold tracking-tight mb-1 ${
                        deadline.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {deadline.title}
                    </h3>

                    {deadline.notes && (
                      <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {deadline.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                      <div className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Due: {deadline.dueDate} at {deadline.dueTime}</span>
                      </div>

                      {course && (
                        <div className="flex items-center gap-1 text-slate-600">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onOpenEditModal(deadline)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit deadline"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteDeadline(deadline.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete deadline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">No deadlines found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || courseFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search queries or filter selections.'
                : 'All caught up! Add upcoming lab reports, assignments, or midterm reviews.'}
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              + Create Deadline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
