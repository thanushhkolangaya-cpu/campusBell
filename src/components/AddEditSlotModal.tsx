import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, BookOpen } from 'lucide-react';
import { Course, DayOfWeek, TimetableEntry } from '../types';

interface AddEditSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entryData: Omit<TimetableEntry, 'id'>, existingId?: string) => void;
  courses: Course[];
  initialData?: TimetableEntry | null;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const AddEditSlotModal: React.FC<AddEditSlotModalProps> = ({
  isOpen,
  onClose,
  onSave,
  courses,
  initialData,
}) => {
  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [periodNum, setPeriodNum] = useState<number>(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('09:55');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [room, setRoom] = useState('M305');
  const [batch, setBatch] = useState<'All' | 'B1' | 'B2'>('All');
  const [isLab, setIsLab] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setDay(initialData.day);
      setPeriodNum(initialData.periodNum);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setCourseId(initialData.courseId);
      setRoom(initialData.room);
      setBatch(initialData.batch);
      setIsLab(Boolean(initialData.isLab));
      setNotes(initialData.notes || '');
    } else {
      setDay('Monday');
      setPeriodNum(1);
      setStartTime('09:00');
      setEndTime('09:55');
      setCourseId(courses[0]?.id || '');
      setRoom('M305');
      setBatch('All');
      setIsLab(false);
      setNotes('');
    }
  }, [initialData, isOpen, courses]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        day,
        periodNum,
        startTime,
        endTime,
        courseId,
        room: room.trim() || 'M305',
        batch,
        isLab,
        notes: notes.trim(),
      },
      initialData?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {initialData ? 'Edit Timetable Slot' : 'Add Class Slot'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Day of Week
              </label>
              <select
                value={day}
                onChange={e => setDay(e.target.value as DayOfWeek)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                {DAYS.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Period Number
              </label>
              <select
                value={periodNum}
                onChange={e => setPeriodNum(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                  <option key={n} value={n}>
                    Period {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Course / Subject
            </label>
            <select
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Room Number
              </label>
              <input
                type="text"
                value={room}
                onChange={e => setRoom(e.target.value)}
                placeholder="e.g. M305, P-Block 201"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Batch
              </label>
              <select
                value={batch}
                onChange={e => setBatch(e.target.value as 'All' | 'B1' | 'B2')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="All">All Batches</option>
                <option value="B1">Batch B1</option>
                <option value="B2">Batch B2</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isLabCheck"
              checked={isLab}
              onChange={e => setIsLab(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="isLabCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
              Mark as Practical / Laboratory session
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Bring scientific calculator or graph book"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              {initialData ? 'Save Changes' : 'Add to Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
