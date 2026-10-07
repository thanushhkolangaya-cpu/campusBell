import React, { useState } from 'react';
import { CheckCircle, Circle, Plus, Clock, AlertTriangle, FileText, Calendar, Filter, ChevronRight, Award } from 'lucide-react';
import { Course, Deadline, Priority } from '../types';
import { calculateDeadlineStatus } from '../utils/timeHelpers';

interface UpcomingDeadlinesWidgetProps {
  deadlines: Deadline[];
  courses: Course[];
  onToggleComplete: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (deadline: Deadline) => void;
  onViewAllDeadlines: () => void;
}

export const UpcomingDeadlinesWidget: React.FC<UpcomingDeadlinesWidgetProps> = ({
  deadlines,
  courses,
  onToggleComplete,
  onOpenAddModal,
  onOpenEditModal,
  onViewAllDeadlines,
}) => {
  const [filterType, setFilterType] = useState<string>('pending');

  const courseMap = new Map<string, Course>(courses.map(c => [c.id, c]));

  // Calculate stats
  const total = deadlines.length;
  const completedCount = deadlines.filter(d => d.completed).length;
  const pendingCount = total - completedCount;

  // Filter deadlines
  const filtered = deadlines.filter(d => {
    if (filterType === 'pending') return !d.completed;
    if (filterType === 'completed') return d.completed;
    if (filterType === 'urgent') return !d.completed && (d.priority === 'urgent' || d.priority === 'high');
    if (filterType === 'lab_report') return !d.completed && d.type === 'lab_report';
    return true; // 'all'
  });

  // Sort: Overdue & earliest due first, then completed at bottom
  const sorted = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const aTime = new Date(`${a.dueDate}T${a.dueTime}`).getTime();
    const bTime = new Date(`${b.dueDate}T${b.dueTime}`).getTime();
    return aTime - bTime;
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lab_report': return 'Lab Record';
      case 'assignment': return 'Assignment';
      case 'quiz': return 'Quiz';
      case 'project': return 'Project';
      case 'exam': return 'Exam / IA';
      default: return 'Task';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Upcoming Deadlines
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {pendingCount} pending
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Assignments, lab records, tests & submission dates for your courses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Deadline</span>
          </button>
          <button
            onClick={onViewAllDeadlines}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span>Full Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-xs border-b border-slate-100">
        <button
          onClick={() => setFilterType('pending')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
            filterType === 'pending'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilterType('urgent')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
            filterType === 'urgent'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Urgent & High
        </button>
        <button
          onClick={() => setFilterType('lab_report')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
            filterType === 'lab_report'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Lab Records
        </button>
        <button
          onClick={() => setFilterType('completed')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
            filterType === 'completed'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Completed ({completedCount})
        </button>
        <button
          onClick={() => setFilterType('all')}
          className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
            filterType === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All ({total})
        </button>
      </div>

      {/* Deadline Items List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {sorted.length > 0 ? (
          sorted.map(deadline => {
            const course = courseMap.get(deadline.courseId);
            const status = calculateDeadlineStatus(deadline);

            return (
              <div
                key={deadline.id}
                className={`group p-3 rounded-xl border transition-all ${
                  deadline.completed
                    ? 'bg-slate-50/70 border-slate-200 opacity-60'
                    : status.isOverdue
                    ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                    : status.isToday
                    ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Complete checkbox button */}
                  <button
                    onClick={() => onToggleComplete(deadline.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                    title={deadline.completed ? 'Mark pending' : 'Mark completed'}
                  >
                    {deadline.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 hover:stroke-indigo-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {course && (
                        <span
                          className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded text-white"
                          style={{ backgroundColor: course.color }}
                        >
                          {course.code}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 font-medium">
                        {getTypeLabel(deadline.type)}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border ${getPriorityBadgeClass(deadline.priority)}`}>
                        {deadline.priority}
                      </span>
                    </div>

                    <h4
                      onClick={() => onOpenEditModal(deadline)}
                      className={`text-sm font-semibold cursor-pointer hover:text-indigo-600 transition-colors line-clamp-1 ${
                        deadline.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {deadline.title}
                    </h4>

                    {deadline.notes && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {deadline.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-2">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{deadline.dueDate} at {deadline.dueTime}</span>
                      </div>

                      {/* Time remaining countdown indicator */}
                      {!deadline.completed && (
                        <div
                          className={`flex items-center gap-1 font-medium text-[11px] px-1.5 py-0.5 rounded ${
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
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl">
            <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No deadlines in this filter</p>
            <p className="text-xs text-slate-500 mt-1">
              Add your upcoming assignments, lab reports or tests to stay on schedule.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              + Create First Deadline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
