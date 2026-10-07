import React from 'react';
import { Clock, MapPin, User, Bell, CheckCircle2, AlertCircle, Coffee, Sparkles } from 'lucide-react';
import { ActiveClassStatus, formatDurationHuman, formatTime12 } from '../utils/timeHelpers';
import { AttendanceRecord, Course, NotificationRule } from '../types';

interface LiveNowWidgetProps {
  status: ActiveClassStatus;
  currentTimeStr: string;
  currentDay: string;
  isSimulated: boolean;
  onOpenSimulator: () => void;
  attendanceRecords: AttendanceRecord[];
  onMarkAttendance: (courseId: string, entryId: string, status: 'present' | 'absent') => void;
  notificationRules: NotificationRule[];
  onTriggerTestClassAlert: (course: Course, room: string) => void;
}

export const LiveNowWidget: React.FC<LiveNowWidgetProps> = ({
  status,
  currentTimeStr,
  currentDay,
  isSimulated,
  onOpenSimulator,
  attendanceRecords,
  onMarkAttendance,
  notificationRules,
  onTriggerTestClassAlert,
}) => {
  const {
    currentEntry,
    currentCourse,
    currentProgressPercent,
    minutesRemainingInCurrent,
    nextEntry,
    nextCourse,
    minutesUntilNext,
    nextDay,
    isNextTomorrow,
  } = status;

  // Check today's attendance for current entry
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const currentAttendance = currentEntry
    ? attendanceRecords.find(a => a.entryId === currentEntry.id && a.date === todayDateStr)
    : null;

  const nextClassRule = nextCourse
    ? notificationRules.find(r => r.courseId === nextCourse.id)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Current Class / Status Card */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
        {/* Subtle accent bar matching subject color */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: currentCourse ? currentCourse.color : '#cbd5e1' }}
        />

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    currentEntry ? 'bg-emerald-400' : 'bg-slate-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    currentEntry ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {currentEntry
                  ? 'Current Class in Session'
                  : 'Current Status'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{currentDay}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">
                {formatTime12(currentTimeStr)}
              </span>
              {isSimulated && (
                <button
                  onClick={onOpenSimulator}
                  className="text-amber-600 hover:text-amber-700 font-medium text-[11px] underline cursor-pointer ml-1"
                >
                  (Simulated)
                </button>
              )}
            </div>
          </div>

          {currentEntry && currentCourse ? (
            <div>
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded text-white"
                  style={{ backgroundColor: currentCourse.color }}
                >
                  {currentCourse.code}
                </span>
                {currentEntry.isLab && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                    LAB ({currentEntry.batch})
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  {formatTime12(currentEntry.startTime)} – {formatTime12(currentEntry.endTime)}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                {currentCourse.name}
              </h2>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900">{currentEntry.room}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{currentCourse.instructor}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Period Progress</span>
                  <span className="font-mono font-medium text-slate-700 tabular-nums">
                    {minutesRemainingInCurrent} min left ({Math.round(currentProgressPercent)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${currentProgressPercent}%`,
                      backgroundColor: currentCourse.color,
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="flex items-center gap-3 text-slate-600 mb-2">
                <Coffee className="w-6 h-6 text-amber-500" />
                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    No Class in Session Right Now
                  </h3>
                  <p className="text-xs text-slate-500">
                    You have free time or a scheduled campus break. Check upcoming classes or prep deadlines below.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions for active class */}
        {currentEntry && currentCourse && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Attendance:</span>
              <button
                onClick={() => onMarkAttendance(currentCourse.id, currentEntry.id, 'present')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  currentAttendance?.status === 'present'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Present
              </button>
              <button
                onClick={() => onMarkAttendance(currentCourse.id, currentEntry.id, 'absent')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  currentAttendance?.status === 'absent'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Absent
              </button>
            </div>

            <button
              onClick={() => onTriggerTestClassAlert(currentCourse, currentEntry.room)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline"
              title="Test chime and notification for this class"
            >
              <Bell className="w-3.5 h-3.5" />
              Preview Bell Alert
            </button>
          </div>
        )}
      </div>

      {/* Next Up Class Card */}
      <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                {isNextTomorrow ? 'First Class Tomorrow' : 'Coming Up Next'}
              </span>
            </div>

            {nextEntry && (
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-indigo-800/80 text-indigo-200 tabular-nums">
                {formatDurationHuman(minutesUntilNext)}
              </span>
            )}
          </div>

          {nextEntry && nextCourse ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                  {nextCourse.code}
                </span>
                <span className="text-xs text-indigo-200">
                  {nextDay !== currentDay ? `${nextDay} ` : ''}
                  {formatTime12(nextEntry.startTime)}
                </span>
                {nextEntry.isLab && (
                  <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded bg-indigo-500 text-white">
                    Lab {nextEntry.batch}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                {nextCourse.name}
              </h3>

              <div className="space-y-1 text-xs text-indigo-200 mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold text-white">Room {nextEntry.room}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="truncate">{nextCourse.instructor}</span>
                </div>
              </div>

              {/* Notification rule reminder status */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-slate-300">Alert reminder: </span>
                    <span className="font-medium text-white">
                      {nextClassRule?.enabled
                        ? `${nextClassRule.leadTimeMinutes} min before (${nextClassRule.sound})`
                        : 'Muted'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onTriggerTestClassAlert(nextCourse, nextEntry.room)}
                  className="px-2 py-1 text-[11px] font-semibold bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
                >
                  Test Alert
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-indigo-300">
              <p className="text-sm">No more scheduled classes for this week!</p>
              <p className="text-xs mt-1 text-indigo-400">Enjoy your weekend or study session.</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-indigo-800/60 mt-3 flex items-center justify-between text-xs text-indigo-300">
          <span>Target Room: <strong className="text-white">M305</strong></span>
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1 text-indigo-300 hover:text-white transition-colors text-[11px]"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            Simulate Hours
          </button>
        </div>
      </div>
    </div>
  );
};
