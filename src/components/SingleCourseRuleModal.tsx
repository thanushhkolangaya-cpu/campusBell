import React from 'react';
import { X, Bell, Volume2, Play } from 'lucide-react';
import { Course, NotificationRule, NotificationSound } from '../types';
import { playNotificationSound } from '../utils/audio';

interface SingleCourseRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  rule: NotificationRule | null;
  onSaveRule: (courseId: string, rule: Partial<NotificationRule>) => void;
  volume: number;
}

const SOUND_OPTIONS: { id: NotificationSound; label: string }[] = [
  { id: 'chime', label: 'Harmonic Chime' },
  { id: 'bell', label: 'Classic School Bell' },
  { id: 'marimba', label: 'Warm Marimba' },
  { id: 'ping', label: 'Digital Double Ping' },
  { id: 'none', label: 'Muted (Silent)' },
];

export const SingleCourseRuleModal: React.FC<SingleCourseRuleModalProps> = ({
  isOpen,
  onClose,
  course,
  rule,
  onSaveRule,
  volume,
}) => {
  if (!isOpen || !course) return null;

  const currentEnabled = rule ? rule.enabled : true;
  const currentLeadTime = rule ? rule.leadTimeMinutes : 10;
  const currentSound = rule ? rule.sound : 'chime';

  const handleToggle = (enabled: boolean) => {
    onSaveRule(course.id, { enabled });
  };

  const handleLeadTimeChange = (leadTime: number) => {
    onSaveRule(course.id, { leadTimeMinutes: leadTime });
  };

  const handleSoundChange = (sound: NotificationSound) => {
    onSaveRule(course.id, { sound });
    playNotificationSound(sound, volume);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Class Notification Alert
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span
              className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded text-white"
              style={{ backgroundColor: course.color }}
            >
              {course.code}
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
              {course.name}
            </h4>
            <p className="text-[11px] text-slate-500">
              Default Room: {course.defaultRoom} · {course.instructor}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Remind for this class</span>
            <input
              type="checkbox"
              checked={currentEnabled}
              onChange={e => handleToggle(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reminder Lead Time
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 5, 10, 15, 20, 30].map(mins => (
                <button
                  type="button"
                  key={mins}
                  disabled={!currentEnabled}
                  onClick={() => handleLeadTimeChange(mins)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-colors ${
                    currentLeadTime === mins
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 disabled:opacity-40'
                  }`}
                >
                  {mins === 0 ? 'Exact' : `${mins} min`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Alert Sound</label>
              <button
                type="button"
                onClick={() => playNotificationSound(currentSound, volume)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Test</span>
              </button>
            </div>
            <select
              disabled={!currentEnabled}
              value={currentSound}
              onChange={e => handleSoundChange(e.target.value as NotificationSound)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white disabled:opacity-50"
            >
              {SOUND_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
