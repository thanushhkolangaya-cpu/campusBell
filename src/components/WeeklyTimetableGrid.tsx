import React, { useState } from 'react';
import { Course, DayOfWeek, TimetableEntry } from '../types';
import { formatTime12, timeToMinutes } from '../utils/timeHelpers';
import { Printer, MapPin, User, Info, Plus } from 'lucide-react';

interface WeeklyTimetableGridProps {
  timetable: TimetableEntry[];
  courses: Course[];
  selectedBatch: 'B1' | 'B2';
  onSelectBatch: (b: 'B1' | 'B2') => void;
  onOpenEditSlot: (entry: TimetableEntry) => void;
  onOpenAddSlot: () => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface SlotHeader {
  periodNum: number | 'lunch';
  timeRange: string;
  isLunch?: boolean;
}

const TIME_HEADERS: SlotHeader[] = [
  { periodNum: 1, timeRange: '09:00 - 09:55' },
  { periodNum: 2, timeRange: '09:55 - 10:50' },
  { periodNum: 3, timeRange: '11:10 - 12:05' },
  { periodNum: 4, timeRange: '12:05 - 01:00' },
  { periodNum: 'lunch', timeRange: '01:00 - 01:55', isLunch: true },
  { periodNum: 5, timeRange: '01:55 - 02:50' },
  { periodNum: 6, timeRange: '02:50 - 03:45' },
  { periodNum: 7, timeRange: '03:45 - 04:40' },
];

export const WeeklyTimetableGrid: React.FC<WeeklyTimetableGridProps> = ({
  timetable,
  courses,
  selectedBatch,
  onSelectBatch,
  onOpenEditSlot,
  onOpenAddSlot,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const courseMap = new Map<string, Course>(courses.map(c => [c.id, c]));

  // Get code number for the classic display (1 to 14)
  const getCourseCodeNum = (courseId: string): string => {
    switch (courseId) {
      case 'BTA001': return '1';
      case 'BTF101': return '2';
      case 'BTC101': return '3';
      case 'BTF002': return '4';
      case 'BTM015': return '5';
      case 'BTP101': return '6';
      case 'BTP103': return '7';
      case 'BTP105': return '8';
      case 'BTN101': return '9';
      case 'BTN102': return '10';
      case 'BTN103': return '11';
      case 'MENTOR': return '12';
      case 'LIB': return '13';
      case 'ACT': return '14';
      case 'LAB-PHY': return 'PHY LAB';
      case 'LAB-C': return 'C LAB';
      case 'LAB-DS': return 'DS LAB';
      case 'LAB-MATHS': return 'MATHS LAB';
      default: return courseId;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner mirroring the official document */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Official College Timetable
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                Physics Cycle
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Semester & Section: <strong className="text-slate-800">I & A4</strong> · Room:{' '}
              <strong className="text-slate-800">M305</strong> · Effective: 16-09-2026
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Batch toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => onSelectBatch('B1')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedBatch === 'B1' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Batch B1
              </button>
              <button
                onClick={() => onSelectBatch('B2')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedBatch === 'B2' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Batch B2
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onOpenAddSlot}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slot</span>
            </button>
          </div>
        </div>

        {/* Timetable Table Grid */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse border border-slate-300 text-xs text-center font-sans">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                <th className="border border-slate-300 p-2.5 w-16">Day</th>
                {TIME_HEADERS.map(th => (
                  <th
                    key={th.timeRange}
                    className={`border border-slate-300 p-2 font-mono text-[11px] ${
                      th.isLunch ? 'bg-amber-50 text-amber-900 w-14' : ''
                    }`}
                  >
                    <div>{th.timeRange}</div>
                    {th.isLunch && <div className="text-[10px] font-sans font-bold text-amber-700">LUNCH</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map(day => {
                const dayShort = day.slice(0, 3);
                const dayEntries = timetable.filter(
                  e => e.day === day && (e.batch === 'All' || e.batch === selectedBatch)
                );

                const p1Entry = dayEntries.find(e => e.periodNum === 1);
                const p1SpansTwo = p1Entry && (timeToMinutes(p1Entry.endTime) - timeToMinutes(p1Entry.startTime) > 60 || p1Entry.isLab);

                const p3Entry = dayEntries.find(e => e.periodNum === 3);
                const p3SpansTwo = p3Entry && (timeToMinutes(p3Entry.endTime) - timeToMinutes(p3Entry.startTime) > 60 || p3Entry.isLab);

                return (
                  <tr key={day} className="hover:bg-slate-50/60 transition-colors">
                    {/* Day Column */}
                    <td className="border border-slate-300 p-2.5 font-bold text-slate-900 bg-slate-50">
                      {dayShort}
                    </td>

                    {/* Period 1 */}
                    <SlotCell
                      entry={p1Entry}
                      courseMap={courseMap}
                      getCourseCodeNum={getCourseCodeNum}
                      selectedCourseId={selectedCourseId}
                      setSelectedCourseId={setSelectedCourseId}
                      onOpenEditSlot={onOpenEditSlot}
                      colSpan={p1SpansTwo ? 2 : 1}
                    />

                    {/* Period 2 (Omitted if Period 1 spans two periods) */}
                    {!p1SpansTwo && (
                      <SlotCell
                        entry={dayEntries.find(e => e.periodNum === 2)}
                        courseMap={courseMap}
                        getCourseCodeNum={getCourseCodeNum}
                        selectedCourseId={selectedCourseId}
                        setSelectedCourseId={setSelectedCourseId}
                        onOpenEditSlot={onOpenEditSlot}
                      />
                    )}

                    {/* Period 3 */}
                    <SlotCell
                      entry={p3Entry}
                      courseMap={courseMap}
                      getCourseCodeNum={getCourseCodeNum}
                      selectedCourseId={selectedCourseId}
                      setSelectedCourseId={setSelectedCourseId}
                      onOpenEditSlot={onOpenEditSlot}
                      colSpan={p3SpansTwo ? 2 : 1}
                    />

                    {/* Period 4 (Omitted if Period 3 spans two periods) */}
                    {!p3SpansTwo && (
                      <SlotCell
                        entry={dayEntries.find(e => e.periodNum === 4)}
                        courseMap={courseMap}
                        getCourseCodeNum={getCourseCodeNum}
                        selectedCourseId={selectedCourseId}
                        setSelectedCourseId={setSelectedCourseId}
                        onOpenEditSlot={onOpenEditSlot}
                      />
                    )}

                    {/* Lunch Break Column */}
                    <td className="border border-slate-300 p-1 bg-amber-50/50 text-[10px] font-medium text-amber-900">
                      LUNCH
                    </td>

                    {/* Period 5 */}
                    <SlotCell
                      entry={dayEntries.find(e => e.periodNum === 5)}
                      courseMap={courseMap}
                      getCourseCodeNum={getCourseCodeNum}
                      selectedCourseId={selectedCourseId}
                      setSelectedCourseId={setSelectedCourseId}
                      onOpenEditSlot={onOpenEditSlot}
                    />

                    {/* Period 6 */}
                    <SlotCell
                      entry={dayEntries.find(e => e.periodNum === 6)}
                      courseMap={courseMap}
                      getCourseCodeNum={getCourseCodeNum}
                      selectedCourseId={selectedCourseId}
                      setSelectedCourseId={setSelectedCourseId}
                      onOpenEditSlot={onOpenEditSlot}
                    />

                    {/* Period 7 */}
                    <SlotCell
                      entry={dayEntries.find(e => e.periodNum === 7)}
                      courseMap={courseMap}
                      getCourseCodeNum={getCourseCodeNum}
                      selectedCourseId={selectedCourseId}
                      setSelectedCourseId={setSelectedCourseId}
                      onOpenEditSlot={onOpenEditSlot}
                    />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Click any class slot to highlight its course details below or edit its information.
        </p>
      </div>

      {/* Subject Mapping Table (Legend mirroring the document bottom) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-3 tracking-tight">
          Subject Code & Faculty Directory
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {courses.map(course => {
            const isSelected = selectedCourseId === course.id;
            const codeNum = getCourseCodeNum(course.id);

            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourseId(isSelected ? null : course.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-xs bg-slate-900 text-white shrink-0">
                      {codeNum}
                    </span>
                    <span
                      className="text-xs font-mono font-bold px-1.5 py-0.2 rounded text-white"
                      style={{ backgroundColor: course.color }}
                    >
                      {course.code}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">
                    {course.type}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                  {course.name}
                </h4>

                <div className="space-y-0.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1 truncate">
                    <User className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{course.instructor || 'Class Faculty'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Default: {course.defaultRoom}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface SlotCellProps {
  entry?: TimetableEntry;
  courseMap: Map<string, Course>;
  getCourseCodeNum: (courseId: string) => string;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  onOpenEditSlot: (entry: TimetableEntry) => void;
  colSpan?: number;
}

const SlotCell: React.FC<SlotCellProps> = ({
  entry,
  courseMap,
  getCourseCodeNum,
  selectedCourseId,
  setSelectedCourseId,
  onOpenEditSlot,
  colSpan = 1,
}) => {
  if (!entry) {
    return (
      <td colSpan={colSpan} className="border border-slate-300 p-2 text-slate-400 font-mono">
        -
      </td>
    );
  }

  const course = courseMap.get(entry.courseId);
  const codeNum = getCourseCodeNum(entry.courseId);
  const isSelected = selectedCourseId === entry.courseId;

  return (
    <td
      colSpan={colSpan}
      onClick={() => setSelectedCourseId(isSelected ? null : entry.courseId)}
      onDoubleClick={() => onOpenEditSlot(entry)}
      className={`border border-slate-300 p-2 cursor-pointer transition-colors relative group ${
        isSelected
          ? 'bg-indigo-100/70 font-bold'
          : entry.isLab
          ? 'bg-sky-50/70'
          : 'hover:bg-slate-100/80'
      }`}
      title={`${course ? course.name : entry.courseId} (${entry.room}) - Double-click to edit`}
    >
      <div className="font-semibold text-slate-800">
        {entry.isLab ? (
          <span className="text-[10px] font-bold text-sky-800 block leading-tight">
            {codeNum}
          </span>
        ) : (
          <span className="text-xs font-bold text-slate-900">{codeNum}</span>
        )}
      </div>

      {course && (
        <div className="text-[9px] text-slate-500 truncate max-w-[85px] mx-auto hidden sm:block">
          {course.code}
        </div>
      )}
    </td>
  );
};
