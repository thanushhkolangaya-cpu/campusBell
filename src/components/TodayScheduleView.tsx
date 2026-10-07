import React, { useState } from 'react';
import { Clock, MapPin, User, Bell, BellOff, CheckCircle2, XCircle, Coffee, ChevronRight, Edit3 } from 'lucide-react';
import { Course, DayOfWeek, NotificationRule, PeriodSlot, TimetableEntry, AttendanceRecord } from '../types';
import { formatTime12, timeToMinutes } from '../utils/timeHelpers';

interface TodayScheduleViewProps {
  currentDay: DayOfWeek;
  currentTimeMinutes: number;
  selectedBatch: 'B1' | 'B2';
  timetable: TimetableEntry[];
  courses: Course[];
  periodSlots: PeriodSlot[];
  notificationRules: NotificationRule[];
  attendanceRecords: AttendanceRecord[];
  onToggleRule: (courseId: string) => void;
  onOpenRuleModal: (courseId: string) => void;
  onMarkAttendance: (courseId: string, entryId: string, status: 'present' | 'absent') => void;
  onOpenEditSlot: (entry: TimetableEntry) => void;
  onOpenAddSlot: () => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const TodayScheduleView: React.FC<TodayScheduleViewProps> = ({
  currentDay,
  currentTimeMinutes,
  selectedBatch,
  timetable,
  courses,
  periodSlots,
  notificationRules,
  attendanceRecords,
  onToggleRule,
  onOpenRuleModal,
  onMarkAttendance,
  onOpenEditSlot,
  onOpenAddSlot,
}) => {
  const [activeDayView, setActiveDayView] = useState<DayOfWeek>(currentDay);

  const courseMap = new Map<string, Course>(courses.map(c => [c.id, c]));
  const todayDateStr = new Date().toISOString().slice(0, 10);

  // Filter timetable entries for activeDayView and batch
  const dayEntries = timetable
    .filter(e => e.day === activeDayView && (e.batch === 'All' || e.batch === selectedBatch))
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  return (
    <div className="space-y-4">
      {/* Day Selector Pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1">
          {DAYS.map(day => {
            const isToday = day === currentDay;
            const isSelected = day === activeDayView;
            return (
              <button
                key={day}
                onClick={() => setActiveDayView(day)}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{day.slice(0, 3)}</span>
                {isToday && (
                  <span
                    className={`ml-1.5 w-1.5 h-1.5 rounded-full inline-block ${
                      isSelected ? 'bg-white' : 'bg-indigo-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Batch: <strong>{selectedBatch}</strong>
          </span>
          <button
            onClick={onOpenAddSlot}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
          >
            + Add Class
          </button>
        </div>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-3">
        {periodSlots.map((slot, idx) => {
          const slotStart = timeToMinutes(slot.startTime);
          const slotEnd = timeToMinutes(slot.endTime);
          const isSlotActiveNow =
            activeDayView === currentDay &&
            currentTimeMinutes >= slotStart &&
            currentTimeMinutes < slotEnd;

          // If this is a break
          if (slot.isBreak) {
            return (
              <div
                key={`break-${idx}`}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs transition-colors ${
                  isSlotActiveNow
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                    : 'bg-slate-50 border-dashed border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold">{slot.label}</span>
                  {isSlotActiveNow && (
                    <span className="bg-amber-200 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      In Progress Now
                    </span>
                  )}
                </div>
                <span className="font-mono tabular-nums text-slate-500">
                  {formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}
                </span>
              </div>
            );
          }

          // Check if there is a class starting or running in this period slot
          const entry = dayEntries.find(e => {
            const entryStart = timeToMinutes(e.startTime);
            const entryEnd = timeToMinutes(e.endTime);
            return (
              (entryStart >= slotStart && entryStart < slotEnd) ||
              (slotStart >= entryStart && slotStart < entryEnd)
            );
          });

          // If this entry started in an earlier period slot, skip rendering a duplicate card
          if (entry && timeToMinutes(entry.startTime) < slotStart) {
            return null;
          }

          if (!entry) {
            return (
              <div
                key={`empty-slot-${slot.periodNum}-${slot.startTime}`}
                className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-200 bg-white/40 text-xs text-slate-400"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-500 w-16">
                    {formatTime12(slot.startTime)}
                  </span>
                  <span>{slot.label}: Free Period / Library / Self-Study</span>
                </div>
                <span className="font-mono text-slate-400">
                  {formatTime12(slot.endTime)}
                </span>
              </div>
            );
          }

          const course = courseMap.get(entry.courseId);
          const rule = course ? notificationRules.find(r => r.courseId === course.id) : null;
          const attendance = attendanceRecords.find(
            a => a.entryId === entry.id && a.date === todayDateStr
          );

          const entryStartM = timeToMinutes(entry.startTime);
          const entryEndM = timeToMinutes(entry.endTime);
          const isMultiPeriod = entryEndM - entryStartM > 60;
          const displayPeriodLabel = isMultiPeriod && typeof slot.periodNum === 'number'
            ? `${slot.label} & Period ${slot.periodNum + 1}`
            : slot.label;

          return (
            <div
              key={`slot-${slot.periodNum}-${slot.startTime}-${entry.id}`}
              className={`p-4 rounded-2xl border transition-all ${
                isSlotActiveNow
                  ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    {displayPeriodLabel}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded tabular-nums">
                    {formatTime12(entry.startTime)} – {formatTime12(entry.endTime)}
                  </span>
                  {entry.isLab && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                      Lab Block ({entry.batch})
                    </span>
                  )}
                  {isSlotActiveNow && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 animate-pulse">
                      ● Active Now
                    </span>
                  )}
                </div>

                {/* Per-class Notification bell action */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  {rule && (
                    <button
                      onClick={() => onOpenRuleModal(course?.id || '')}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        rule.enabled
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Configure custom notification for this class"
                    >
                      {rule.enabled ? (
                        <>
                          <Bell className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{rule.leadTimeMinutes}m before</span>
                        </>
                      ) : (
                        <>
                          <BellOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Muted</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => onOpenEditSlot(entry)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit class"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Class details */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {course && (
                      <span
                        className="text-xs font-mono font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: course.color }}
                      >
                        {course.code}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      {course ? course.name : entry.courseId}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-900">{entry.room}</span>
                    </div>
                    {course && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.instructor}</span>
                      </div>
                    )}
                    {entry.notes && (
                      <span className="text-slate-500 italic">
                        Note: {entry.notes}
                      </span>
                    )}
                  </div>
                </div>

                {/* Attendance Quick Action for today */}
                {activeDayView === currentDay && course && (
                  <div className="flex items-center gap-1 shrink-0 pt-1">
                    <button
                      onClick={() => onMarkAttendance(course.id, entry.id, 'present')}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                        attendance?.status === 'present'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                      title="Mark Present"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onMarkAttendance(course.id, entry.id, 'absent')}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                        attendance?.status === 'absent'
                          ? 'bg-rose-600 text-white'
                          : 'text-slate-400 hover:text-rose-700 hover:bg-rose-50'
                      }`}
                      title="Mark Absent"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
