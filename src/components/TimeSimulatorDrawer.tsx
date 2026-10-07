import React from 'react';
import { X, Sparkles, RotateCcw, Clock, Calendar } from 'lucide-react';
import { DayOfWeek, UserSettings } from '../types';
import { formatTime12, minutesToTime, timeToMinutes } from '../utils/timeHelpers';

interface TimeSimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  onShowToast: (title: string, message: string) => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Preset {
  label: string;
  day: DayOfWeek;
  time: string;
}

const PRESETS: Preset[] = [
  { label: 'Mon 09:15 AM · Applied Physics in Engg', day: 'Monday', time: '09:15' },
  { label: 'Mon 01:10 PM · Lunch Break in Progress', day: 'Monday', time: '13:10' },
  { label: 'Tue 11:30 AM · Lab Session (B1 Phy / B2 C)', day: 'Tuesday', time: '11:30' },
  { label: 'Wed 10:55 AM · Morning Tea Break', day: 'Wednesday', time: '10:55' },
  { label: 'Thu 02:10 PM · Problem Solving Using C', day: 'Thursday', time: '14:10' },
  { label: 'Fri 03:00 PM · Intro to Data Science', day: 'Friday', time: '15:00' },
  { label: 'Sat 09:20 AM · Saturday Lab Practical', day: 'Saturday', time: '09:20' },
];

export const TimeSimulatorDrawer: React.FC<TimeSimulatorDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const isSimulating = settings.simulatedTime.enabled;
  const currentMinutes = timeToMinutes(settings.simulatedTime.time);

  const handleToggleSimulation = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      simulatedTime: { ...prev.simulatedTime, enabled },
    }));
    if (enabled) {
      onShowToast(
        'Time Simulator Active',
        `Simulating ${settings.simulatedTime.day} at ${formatTime12(settings.simulatedTime.time)}`
      );
    } else {
      onShowToast('Real-Time Restored', 'App is now synced with your device clock.');
    }
  };

  const handleApplyPreset = (preset: Preset) => {
    setSettings(prev => ({
      ...prev,
      simulatedTime: {
        enabled: true,
        day: preset.day,
        time: preset.time,
      },
    }));
    onShowToast('Simulating Slot', `${preset.day} at ${formatTime12(preset.time)}`);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mins = parseInt(e.target.value, 10);
    const timeStr = minutesToTime(mins);
    setSettings(prev => ({
      ...prev,
      simulatedTime: {
        ...prev.simulatedTime,
        enabled: true,
        time: timeStr,
      },
    }));
  };

  const handleResetToReal = () => {
    setSettings(prev => ({
      ...prev,
      simulatedTime: {
        ...prev.simulatedTime,
        enabled: false,
      },
    }));
    onShowToast('Real-Time Restored', 'Synced with current system clock.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-amber-50/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Time & Class Simulator
              </h3>
              <p className="text-[11px] text-slate-500">
                Test timetable reminders, active class widgets, and countdowns at any time!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Toggle Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800">Enable Simulation Mode</span>
              <p className="text-[11px] text-slate-500">
                {isSimulating ? 'Overriding system clock' : 'Using real system clock'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={isSimulating}
              onChange={e => handleToggleSimulation(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded cursor-pointer"
            />
          </div>

          {/* Day selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Simulated Day of Week
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {DAYS.slice(0, 6).map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() =>
                    setSettings(prev => ({
                      ...prev,
                      simulatedTime: { ...prev.simulatedTime, day, enabled: true },
                    }))
                  }
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    settings.simulatedTime.day === day && isSimulating
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Time slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Simulated Time of Day</span>
              <span className="font-mono text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded tabular-nums">
                {formatTime12(settings.simulatedTime.time)}
              </span>
            </div>

            {/* Slider from 08:30 (510 mins) to 17:30 (1050 mins) */}
            <input
              type="range"
              min="510"
              max="1050"
              step="5"
              value={currentMinutes}
              onChange={handleSliderChange}
              className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>08:30 AM</span>
              <span>12:00 PM</span>
              <span>05:30 PM</span>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Quick Timetable Presets
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="w-full text-left p-2 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-xs transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-slate-800 truncate">{p.label}</span>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0 ml-2">
                    {formatTime12(p.time)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={handleResetToReal}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium py-1 px-2.5 rounded-lg hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Use Real Time</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
