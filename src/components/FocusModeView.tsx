import React from 'react';
import { Eye, EyeOff, Sun, Moon, Clock, MapPin, User, CheckCircle2, Circle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { ActiveClassStatus, formatDurationHuman, formatTime12, calculateDeadlineStatus } from '../utils/timeHelpers';
import { Course, Deadline, Priority } from '../types';

interface FocusModeViewProps {
  status: ActiveClassStatus;
  currentTimeStr: string;
  currentDay: string;
  deadlines: Deadline[];
  courses: Course[];
  highContrast: boolean;
  studentName?: string;
  rollNumber?: string;
  batch?: 'B1' | 'B2';
  onToggleTheme: () => void;
  onExitFocusMode: () => void;
  onToggleCompleteDeadline: (id: string) => void;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  status,
  currentTimeStr,
  currentDay,
  deadlines,
  courses,
  highContrast,
  studentName,
  rollNumber,
  batch,
  onToggleTheme,
  onExitFocusMode,
  onToggleCompleteDeadline,
}) => {
  const {
    currentEntry,
    currentCourse,
    currentProgressPercent,
    minutesRemainingInCurrent,
    nextEntry,
    nextCourse,
    minutesUntilNext,
  } = status;

  const courseMap = new Map<string, Course>(courses.map(c => [c.id, c]));

  // Show only nearest pending deadlines (up to 4)
  const pendingDeadlines = deadlines
    .filter(d => !d.completed)
    .sort((a, b) => {
      const aTime = new Date(`${a.dueDate}T${a.dueTime}`).getTime();
      const bTime = new Date(`${b.dueDate}T${b.dueTime}`).getTime();
      return aTime - bTime;
    })
    .slice(0, 4);

  // Styling based on high contrast dark vs clean light
  const themeContainer = highContrast
    ? 'bg-black text-white selection:bg-amber-500 selection:text-black'
    : 'bg-slate-900 text-slate-100';

  const cardBg = highContrast
    ? 'bg-neutral-950 border border-neutral-800'
    : 'bg-slate-800/90 border border-slate-700';

  return (
    <div className={`min-h-[82vh] rounded-3xl p-6 sm:p-8 transition-colors duration-200 ${themeContainer} flex flex-col justify-between`}>
      {/* Focus Mode Top Utility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Focus Mode Active
          </div>
          {studentName && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-300 font-medium bg-neutral-900/80 px-2.5 py-1 rounded-lg border border-neutral-800">
              <span className="text-white font-bold">{studentName}</span>
              {rollNumber && <span className="font-mono text-neutral-400">({rollNumber})</span>}
              {batch && <span className="text-amber-400 font-bold ml-1">· Batch {batch}</span>}
            </div>
          )}
          <span className="text-xs text-neutral-400 hidden lg:inline">
            Non-essentials hidden · Distraction-free
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono font-bold text-neutral-200 tabular-nums">
            <span>{currentDay}</span>
            <span className="text-neutral-600">·</span>
            <span>{formatTime12(currentTimeStr)}</span>
          </div>

          {/* Theme contrast toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
            title="Toggle contrast tone"
          >
            {highContrast ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            <span className="hidden md:inline">{highContrast ? 'OLED Dark' : 'Deep Slate'}</span>
          </button>

          {/* Exit Focus Mode CTA */}
          <button
            onClick={onExitFocusMode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Focus Mode</span>
          </button>
        </div>
      </div>

      {/* Main Focus Focal Area */}
      <div className="my-8 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Focal: Current Class in Session (7 cols) */}
        <div className={`lg:col-span-7 rounded-3xl p-6 sm:p-8 ${cardBg} shadow-2xl relative overflow-hidden`}>
          {currentCourse && (
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: currentCourse.color || '#6366f1' }}
            />
          )}

          {currentEntry && currentCourse ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                    In Session Now
                  </span>
                </div>
                <span className="text-xs font-mono font-medium text-neutral-400 bg-neutral-900/80 px-2.5 py-1 rounded-lg border border-neutral-800 tabular-nums">
                  {formatTime12(currentEntry.startTime)} – {formatTime12(currentEntry.endTime)}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: currentCourse.color }}
                  >
                    {currentCourse.code}
                  </span>
                  {currentEntry.isLab && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      LAB ({currentEntry.batch})
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {currentCourse.name}
                </h1>
              </div>

              {/* Venue & Instructor in large bold typography */}
              <div className="grid grid-cols-2 gap-4 py-3 px-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 text-sm">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Venue</span>
                    <strong className="text-white text-base tracking-wide font-mono">
                      {currentEntry.room}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Faculty</span>
                    <span className="text-neutral-200 text-xs font-semibold block truncate">
                      {currentCourse.instructor}
                    </span>
                  </div>
                </div>
              </div>

              {/* High Contrast Progress Countdown */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400 uppercase tracking-wider font-semibold">Remaining</span>
                  <span className="text-amber-400 font-bold tabular-nums text-sm">
                    {minutesRemainingInCurrent} min left ({Math.round(currentProgressPercent)}%)
                  </span>
                </div>

                <div className="w-full bg-neutral-900 h-3 rounded-full overflow-hidden border border-neutral-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${currentProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Kicker for Next Class */}
              {nextEntry && nextCourse && (
                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                  <span>Up Next: <strong className="text-white font-medium">{nextCourse.code}</strong> at {formatTime12(nextEntry.startTime)}</span>
                  <span className="font-mono text-indigo-300">Room {nextEntry.room}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-amber-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  No Active Class Right Now
                </h2>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                  {nextEntry && nextCourse
                    ? `Next session is ${nextCourse.name} at ${formatTime12(nextEntry.startTime)} in Room ${nextEntry.room}.`
                    : 'All lectures and lab periods for today are complete.'}
                </p>
              </div>

              {nextEntry && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-amber-300">
                  <span>Next class begins in:</span>
                  <strong className="text-white text-sm">{formatDurationHuman(minutesUntilNext)}</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Focal: Urgent Deadlines Only (5 cols) */}
        <div className={`lg:col-span-5 rounded-3xl p-6 ${cardBg} shadow-xl`}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Impending Deadlines
              </h3>
              <p className="text-[11px] text-neutral-400">
                Prioritized by closest submission date
              </p>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-900 text-amber-400 border border-neutral-800">
              {pendingDeadlines.length} Due Soon
            </span>
          </div>

          <div className="space-y-3">
            {pendingDeadlines.length > 0 ? (
              pendingDeadlines.map(deadline => {
                const course = courseMap.get(deadline.courseId);
                const status = calculateDeadlineStatus(deadline);

                return (
                  <div
                    key={deadline.id}
                    className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all flex items-start gap-3"
                  >
                    <button
                      onClick={() => onToggleCompleteDeadline(deadline.id)}
                      className="mt-0.5 text-neutral-500 hover:text-emerald-400 transition-colors shrink-0 cursor-pointer"
                      title="Mark as completed"
                    >
                      <Circle className="w-5 h-5 hover:stroke-emerald-400" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {course && (
                          <span
                            className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded text-white"
                            style={{ backgroundColor: course.color }}
                          >
                            {course.code}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded ${
                            status.isOverdue
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : status.isToday
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {status.displayText}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-white tracking-tight line-clamp-1">
                        {deadline.title}
                      </h4>

                      {deadline.notes && (
                        <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                          {deadline.notes}
                        </p>
                      )}

                      <div className="text-[11px] font-mono text-neutral-400 mt-1.5 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>Due {deadline.dueDate} at {deadline.dueTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-neutral-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-white">All upcoming deadlines cleared!</p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Enjoy your study session or review past lecture notes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Focus Mode Bottom Bar */}
      <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
        <span>Focus Mode: Active Session</span>
        <button
          onClick={onExitFocusMode}
          className="text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
        >
          Return to Standard Dashboard
        </button>
      </div>
    </div>
  );
};
