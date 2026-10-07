import React, { useState } from 'react';
import { Calendar, GraduationCap, Settings2, CheckCircle2, Flag, BookOpen, Clock, X } from 'lucide-react';
import { SemesterConfig } from '../types';
import { calculateSemesterProgress } from '../utils/timeHelpers';

interface SemesterProgressBarProps {
  config: SemesterConfig;
  onUpdateConfig: (newConfig: SemesterConfig) => void;
  currentDateOverride?: Date;
}

export const SemesterProgressBar: React.FC<SemesterProgressBarProps> = ({
  config,
  onUpdateConfig,
  currentDateOverride,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [startDateInput, setStartDateInput] = useState(config.startDate);
  const [totalWeeksInput, setTotalWeeksInput] = useState(config.totalWeeks);
  const [semesterNameInput, setSemesterNameInput] = useState(config.semesterName);

  const progress = calculateSemesterProgress(
    config.startDate,
    config.totalWeeks,
    currentDateOverride
  );

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      startDate: startDateInput,
      totalWeeks: Number(totalWeeksInput),
      semesterName: semesterNameInput.trim() || '1st Semester · Physics Cycle',
    });
    setIsEditing(false);
  };

  // Milestone points across the semester
  const milestones = [
    { label: 'Term Starts', week: 1, percent: 0, tag: 'Sep 16' },
    { label: 'IA-1 Internal', week: Math.round(config.totalWeeks * 0.28), percent: 28, tag: 'Week 5' },
    { label: 'Midterm IA-2', week: Math.round(config.totalWeeks * 0.55), percent: 55, tag: 'Week 9' },
    { label: 'Lab Practicals', week: Math.round(config.totalWeeks * 0.8), percent: 80, tag: 'Week 13' },
    { label: 'Final Exams', week: config.totalWeeks, percent: 100, tag: `Week ${config.totalWeeks}` },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Academic Semester Progress
              </h3>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                Week {progress.currentWeekNumber} of {progress.totalWeeks}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{config.semesterName}</span>
              <span aria-hidden="true">·</span>
              <span>Started {progress.startDate}</span>
              <span aria-hidden="true">·</span>
              <span>Target End: {progress.endDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-right hidden md:block">
            <div className="text-xs font-semibold text-slate-900">
              {progress.percentCompleted}% Completed
            </div>
            <div className="text-[11px] text-slate-500">
              {progress.weeksRemaining} weeks remaining
            </div>
          </div>

          <button
            onClick={() => {
              setStartDateInput(config.startDate);
              setTotalWeeksInput(config.totalWeeks);
              setSemesterNameInput(config.semesterName);
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Configure semester start date & duration"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Configure Term</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 pt-1">
        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500">Weeks Completed</div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
            {progress.weeksCompleted} <span className="text-xs font-sans font-normal text-slate-500">weeks</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Active in Week {progress.currentWeekNumber}
          </div>
        </div>

        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500">Days Elapsed</div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
            {progress.daysElapsed} <span className="text-xs font-sans font-normal text-slate-500">of {progress.totalDays}d</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Academic calendar days
          </div>
        </div>

        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500">Weeks Remaining</div>
          <div className="text-lg font-bold font-mono text-indigo-700 mt-0.5 tabular-nums">
            {progress.weeksRemaining} <span className="text-xs font-sans font-normal text-slate-500">weeks</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            ~{progress.daysRemaining} days left in term
          </div>
        </div>

        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500">Term Completion</div>
          <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5 tabular-nums">
            {progress.percentCompleted}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {progress.percentCompleted < 30 ? 'Early Semester Phase' : progress.percentCompleted < 70 ? 'Mid-Term Phase' : 'Exam Phase'}
          </div>
        </div>
      </div>

      {/* Visual Progress Bar Track with Milestones */}
      <div className="space-y-3 pt-1">
        <div className="relative pt-2 pb-1">
          {/* Main Progress Bar Container */}
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 rounded-full transition-all duration-700 relative"
              style={{ width: `${progress.percentCompleted}%` }}
            >
              {/* Subtle shining tip */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-r-full" />
            </div>
          </div>

          {/* Current Marker Pin */}
          <div
            className="absolute top-0 -translate-x-1/2 transition-all duration-700 flex flex-col items-center pointer-events-none"
            style={{ left: `${Math.min(97, Math.max(3, progress.percentCompleted))}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-100 animate-pulse" />
          </div>
        </div>

        {/* Milestone Labels Row */}
        <div className="grid grid-cols-5 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          {milestones.map((m, idx) => {
            const isPassed = progress.percentCompleted >= m.percent;
            const isCurrent = progress.currentWeekNumber >= m.week && (idx === milestones.length - 1 || progress.currentWeekNumber < milestones[idx + 1].week);

            return (
              <div
                key={m.label}
                className={`flex flex-col ${
                  idx === 0
                    ? 'items-start text-left'
                    : idx === milestones.length - 1
                    ? 'items-end text-right'
                    : 'items-center text-center'
                }`}
              >
                <div className="flex items-center gap-1 font-semibold text-slate-700">
                  {isPassed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  ) : (
                    <Clock className="w-3 h-3 text-slate-300 shrink-0" />
                  )}
                  <span className={isCurrent ? 'text-indigo-600 font-bold' : ''}>{m.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {m.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Semester Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Configure Semester Timeline
                </h4>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semester / Term Label
                </label>
                <input
                  type="text"
                  value={semesterNameInput}
                  onChange={e => setSemesterNameInput(e.target.value)}
                  placeholder="e.g. 1st Semester · Physics Cycle"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semester Start Date (W.E.F)
                </label>
                <input
                  type="date"
                  required
                  value={startDateInput}
                  onChange={e => setStartDateInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Official commencement date from timetable (Default: 2026-09-16)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Typical Semester Duration (Academic Weeks)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[14, 15, 16, 18].map(weeks => (
                    <button
                      type="button"
                      key={weeks}
                      onClick={() => setTotalWeeksInput(weeks)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        totalWeeksInput === weeks
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {weeks} wks
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Save Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
