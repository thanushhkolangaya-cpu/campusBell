import React from 'react';
import { Bell, Volume2, VolumeX, Shield, Play, Sliders, CheckCircle, AlertCircle } from 'lucide-react';
import { Course, NotificationRule, NotificationSound, UserSettings } from '../types';
import { playNotificationSound } from '../utils/audio';
import {
  getNotificationPermissionStatus,
  requestBrowserNotificationPermission,
  triggerAlert,
} from '../utils/notifications';

interface NotificationRulesViewProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  courses: Course[];
  rules: NotificationRule[];
  setRules: React.Dispatch<React.SetStateAction<NotificationRule[]>>;
  onShowToast: (title: string, message: string) => void;
}

const SOUND_OPTIONS: { id: NotificationSound; label: string }[] = [
  { id: 'chime', label: 'Harmonic Chime' },
  { id: 'bell', label: 'Classic School Bell' },
  { id: 'marimba', label: 'Warm Marimba' },
  { id: 'ping', label: 'Digital Double Ping' },
  { id: 'none', label: 'Muted (Silent)' },
];

const LEAD_TIME_OPTIONS = [
  { value: 0, label: 'At start (0 min)' },
  { value: 5, label: '5 minutes before' },
  { value: 10, label: '10 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 20, label: '20 minutes before' },
  { value: 30, label: '30 minutes before' },
];

export const NotificationRulesView: React.FC<NotificationRulesViewProps> = ({
  settings,
  setSettings,
  courses,
  rules,
  setRules,
  onShowToast,
}) => {
  const permStatus = getNotificationPermissionStatus();

  const handleRequestPermission = async () => {
    const granted = await requestBrowserNotificationPermission();
    setSettings(prev => ({ ...prev, browserNotificationsEnabled: granted }));
    if (granted) {
      onShowToast('Browser Alerts Enabled', 'You will now receive desktop notifications before each class.');
      triggerAlert({
        title: 'CampusBell Notification Test',
        body: 'Timetable alerts are active for Room M305 classes!',
        sound: settings.masterSound,
        volume: settings.volume,
        browserNotificationsEnabled: true,
      });
    } else {
      onShowToast('Permission Denied', 'Please enable notification permissions in your browser address bar.');
    }
  };

  const updateCourseRule = (
    courseId: string,
    updates: Partial<Omit<NotificationRule, 'courseId'>>
  ) => {
    setRules(prev =>
      prev.map(r => (r.courseId === courseId ? { ...r, ...updates } : r))
    );
  };

  const handleTestClassAlert = (course: Course, rule: NotificationRule) => {
    triggerAlert({
      title: `Upcoming: ${course.code} - ${course.name}`,
      body: `Starts in ${rule.leadTimeMinutes} mins at Room ${course.defaultRoom}. Instructor: ${course.instructor}`,
      sound: rule.sound || settings.masterSound,
      volume: settings.volume,
      browserNotificationsEnabled: settings.browserNotificationsEnabled,
      tag: `test-${course.id}`,
    });

    onShowToast(
      `Bell Triggered: ${course.code}`,
      `Starts in ${rule.leadTimeMinutes} min at Room ${course.defaultRoom}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Master Settings Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Class Reminder Preferences
            </h2>
            <p className="text-xs text-slate-500">
              Set default alert sound, browser notifications, and per-course reminder timing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          {/* Master Notifications Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Master Class Reminders</span>
                <input
                  type="checkbox"
                  checked={settings.masterNotificationsEnabled}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      masterNotificationsEnabled: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Play sound chimes and display in-app alert cards when class is about to start.
              </p>
            </div>
            <div className="mt-3 text-xs font-medium text-indigo-600">
              {settings.masterNotificationsEnabled ? '● Active' : '○ Paused'}
            </div>
          </div>

          {/* Browser System Notifications */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Desktop / Browser Alerts</span>
                {permStatus === 'granted' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Receive native desktop notifications even if you switch browser tabs during study.
              </p>
            </div>

            <div className="mt-3">
              {permStatus === 'granted' ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Permission Granted</span>
                </div>
              ) : (
                <button
                  onClick={handleRequestPermission}
                  className="w-full py-1.5 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                >
                  Enable Browser Alerts
                </button>
              )}
            </div>
          </div>

          {/* Sound & Volume Selector */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Default Chime Tone</span>
                <button
                  onClick={() => playNotificationSound(settings.masterSound, settings.volume)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Preview</span>
                </button>
              </div>

              <select
                value={settings.masterSound}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    masterSound: e.target.value as NotificationSound,
                  }))
                }
                className="w-full mt-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800"
              >
                {SOUND_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Chime Volume</span>
                <span className="font-mono">{Math.round(settings.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={settings.volume}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    volume: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Per-Class Notification Rules Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Per-Class Custom Notifications
            </h3>
            <p className="text-xs text-slate-500">
              Customize warning times and chime tones individually for labs, lectures, and activities.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium self-start sm:self-auto">
            {rules.filter(r => r.enabled).length} of {courses.length} classes active
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {courses.map(course => {
            const rule = rules.find(r => r.courseId === course.id) || {
              courseId: course.id,
              enabled: true,
              leadTimeMinutes: 10,
              sound: 'chime' as NotificationSound,
            };

            return (
              <div
                key={course.id}
                className={`py-3.5 px-2 flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl transition-colors ${
                  rule.enabled ? 'hover:bg-slate-50/80' : 'opacity-60 bg-slate-50/40'
                }`}
              >
                {/* Course Details */}
                <div className="flex items-center gap-3 min-w-[280px]">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={e => updateCourseRule(course.id, { enabled: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer shrink-0"
                    title={rule.enabled ? 'Disable alert' : 'Enable alert'}
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-xs font-mono font-bold px-1.5 py-0.2 rounded text-white"
                        style={{ backgroundColor: course.color }}
                      >
                        {course.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Room {course.defaultRoom}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {course.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {course.instructor || 'Faculty Incharge'}
                    </span>
                  </div>
                </div>

                {/* Per-class lead time & sound selector */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Lead time */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Remind:</span>
                    <select
                      disabled={!rule.enabled}
                      value={rule.leadTimeMinutes}
                      onChange={e =>
                        updateCourseRule(course.id, {
                          leadTimeMinutes: parseInt(e.target.value, 10),
                        })
                      }
                      className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 disabled:opacity-50"
                    >
                      {LEAD_TIME_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sound selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Tone:</span>
                    <select
                      disabled={!rule.enabled}
                      value={rule.sound}
                      onChange={e =>
                        updateCourseRule(course.id, {
                          sound: e.target.value as NotificationSound,
                        })
                      }
                      className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 disabled:opacity-50"
                    >
                      {SOUND_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Test button */}
                  <button
                    disabled={!rule.enabled}
                    onClick={() => handleTestClassAlert(course, rule)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-40"
                    title="Simulate class reminder alert now"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test Bell</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
