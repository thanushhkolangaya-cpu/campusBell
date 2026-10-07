import React, { useState, useEffect, useRef } from 'react';
import {
  DEFAULT_COURSES,
  DEFAULT_DEADLINES,
  DEFAULT_LOGIN_MEMBERS,
  DEFAULT_NOTIFICATION_RULES,
  DEFAULT_SETTINGS,
  DEFAULT_TIMETABLE,
  PERIOD_SLOTS,
} from './utils/defaultData';
import {
  AttendanceRecord,
  Course,
  Deadline,
  InAppAlert,
  LoginMemberRecord,
  NotificationRule,
  SemesterConfig,
  TimetableEntry,
  UserSettings,
} from './types';
import {
  getActiveAndNextClass,
  getCurrentDayAndMinutes,
  formatTime12,
  timeToMinutes,
} from './utils/timeHelpers';
import { triggerAlert } from './utils/notifications';
import { Navbar } from './components/Navbar';
import { LiveNowWidget } from './components/LiveNowWidget';
import { UpcomingDeadlinesWidget } from './components/UpcomingDeadlinesWidget';
import { TodayScheduleView } from './components/TodayScheduleView';
import { WeeklyTimetableGrid } from './components/WeeklyTimetableGrid';
import { DeadlinesView } from './components/DeadlinesView';
import { NotificationRulesView } from './components/NotificationRulesView';
import { AddEditDeadlineModal } from './components/AddEditDeadlineModal';
import { AddEditSlotModal } from './components/AddEditSlotModal';
import { SingleCourseRuleModal } from './components/SingleCourseRuleModal';
import { TimeSimulatorDrawer } from './components/TimeSimulatorDrawer';
import { InAppToastContainer } from './components/InAppToastContainer';
import { SemesterProgressBar } from './components/SemesterProgressBar';
import { StudentLoginModal } from './components/StudentLoginModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { FocusModeView } from './components/FocusModeView';
import { CreatorPortalModal } from './components/CreatorPortalModal';
import { Calendar, Clock, CheckSquare, Sliders, RotateCcw, AlertCircle, Eye, ShieldCheck } from 'lucide-react';

export default function App() {
  // --- Persistent State ---
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem('cb_timetable');
    return saved ? JSON.parse(saved) : DEFAULT_TIMETABLE;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('cb_courses');
    return saved ? JSON.parse(saved) : DEFAULT_COURSES;
  });

  const [deadlines, setDeadlines] = useState<Deadline[]>(() => {
    const saved = localStorage.getItem('cb_deadlines');
    return saved ? JSON.parse(saved) : DEFAULT_DEADLINES;
  });

  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>(() => {
    const saved = localStorage.getItem('cb_notification_rules');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATION_RULES;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('cb_attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [loginMembers, setLoginMembers] = useState<LoginMemberRecord[]>(() => {
    const saved = localStorage.getItem('cb_login_members');
    return saved ? JSON.parse(saved) : DEFAULT_LOGIN_MEMBERS;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('cb_settings');
    if (!saved) return DEFAULT_SETTINGS;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        isLoggedIn: parsed.isLoggedIn !== undefined ? parsed.isLoggedIn : DEFAULT_SETTINGS.isLoggedIn,
        studentName: parsed.studentName || DEFAULT_SETTINGS.studentName,
        rollNumber: parsed.rollNumber || DEFAULT_SETTINGS.rollNumber,
        phoneNumber: parsed.phoneNumber !== undefined ? parsed.phoneNumber : DEFAULT_SETTINGS.phoneNumber,
        selectedBatch: parsed.selectedBatch || DEFAULT_SETTINGS.selectedBatch,
        focusMode: {
          ...DEFAULT_SETTINGS.focusMode,
          ...(parsed.focusMode || {}),
        },
        isCreator: parsed.isCreator !== undefined ? parsed.isCreator : false,
        semester: {
          ...DEFAULT_SETTINGS.semester,
          ...(parsed.semester || {}),
        },
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // --- UI State ---
  const [currentTab, setCurrentTab] = useState<'today' | 'weekly' | 'deadlines' | 'notifications'>('today');
  const [alerts, setAlerts] = useState<InAppAlert[]>([]);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);

  // Modals
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);

  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableEntry | null>(null);

  const [singleRuleCourseId, setSingleRuleCourseId] = useState<string | null>(null);

  // Set of alert keys sent today to prevent repeated triggers
  const sentAlertsRef = useRef<Set<string>>(new Set());

  // Clock tick state
  const [, setClockTick] = useState(0);

  // --- Save to localStorage ---
  useEffect(() => {
    localStorage.setItem('cb_timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('cb_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('cb_deadlines', JSON.stringify(deadlines));
  }, [deadlines]);

  useEffect(() => {
    localStorage.setItem('cb_notification_rules', JSON.stringify(notificationRules));
  }, [notificationRules]);

  useEffect(() => {
    localStorage.setItem('cb_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('cb_login_members', JSON.stringify(loginMembers));
  }, [loginMembers]);

  useEffect(() => {
    localStorage.setItem('cb_settings', JSON.stringify(settings));
  }, [settings]);

  // Live timer interval (every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      setClockTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute current day and time
  const { day: currentDay, currentTimeStr, currentMinutes, isSimulated } = getCurrentDayAndMinutes(
    settings.simulatedTime
  );

  // Compute Active and Next class
  const activeStatus = getActiveAndNextClass(
    timetable,
    courses,
    currentDay,
    currentMinutes,
    settings.selectedBatch
  );

  // Toast alert dispatcher
  const pushToast = (title: string, message: string, courseCode?: string, room?: string) => {
    const newAlert: InAppAlert = {
      id: `alert-${Date.now()}-${Math.random()}`,
      title,
      message,
      courseCode,
      room,
      timeString: formatTime12(currentTimeStr),
      timestamp: Date.now(),
      read: false,
    };
    setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
  };

  const handleDismissToast = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // --- Background Reminder Checker Engine ---
  useEffect(() => {
    if (!settings.masterNotificationsEnabled) return;

    // Check today's classes
    const todayEntries = timetable.filter(
      e => e.day === currentDay && (e.batch === 'All' || e.batch === settings.selectedBatch)
    );

    const courseMap = new Map<string, Course>(courses.map(c => [c.id, c]));

    todayEntries.forEach(entry => {
      const course = courseMap.get(entry.courseId);
      if (!course) return;

      const rule = notificationRules.find(r => r.courseId === course.id);
      if (!rule || !rule.enabled) return;

      const classStartMinutes = timeToMinutes(entry.startTime);
      const reminderTargetMinutes = classStartMinutes - rule.leadTimeMinutes;

      // Trigger if current minutes equals reminderTargetMinutes
      const alertKey = `${currentDay}-${entry.id}-${reminderTargetMinutes}`;

      if (currentMinutes === reminderTargetMinutes && !sentAlertsRef.current.has(alertKey)) {
        sentAlertsRef.current.add(alertKey);

        const title = `Class Reminder: ${course.code} (${entry.room})`;
        const body = rule.leadTimeMinutes === 0
          ? `${course.name} is starting right now in Room ${entry.room}!`
          : `${course.name} starts in ${rule.leadTimeMinutes} minutes in Room ${entry.room}.`;

        triggerAlert({
          title,
          body,
          sound: rule.sound || settings.masterSound,
          volume: settings.volume,
          browserNotificationsEnabled: settings.browserNotificationsEnabled,
          tag: alertKey,
        });

        pushToast(title, body, course.code, entry.room);
      }
    });
  }, [currentDay, currentMinutes, settings, timetable, courses, notificationRules]);

  // Test class alert from UI
  const handleTestClassAlert = (course: Course, room: string) => {
    const rule = notificationRules.find(r => r.courseId === course.id);
    const lead = rule ? rule.leadTimeMinutes : 10;
    const sound = rule ? rule.sound : settings.masterSound;

    triggerAlert({
      title: `Upcoming: ${course.code} - ${course.name}`,
      body: `Starts in ${lead} mins in Room ${room}. Faculty: ${course.instructor}`,
      sound,
      volume: settings.volume,
      browserNotificationsEnabled: settings.browserNotificationsEnabled,
      tag: `test-${course.id}`,
    });

    pushToast(
      `Bell Alert: ${course.code}`,
      `Starts in ${lead} mins in Room ${room}`,
      course.code,
      room
    );
  };

  // --- Handlers for Deadlines ---
  const handleToggleCompleteDeadline = (id: string) => {
    setDeadlines(prev =>
      prev.map(d => {
        if (d.id === id) {
          const next = !d.completed;
          if (next) {
            pushToast('Deadline Completed!', `"${d.title}" marked as submitted.`);
          }
          return { ...d, completed: next };
        }
        return d;
      })
    );
  };

  const handleSaveDeadline = (
    deadlineData: Omit<Deadline, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setDeadlines(prev =>
        prev.map(d => (d.id === existingId ? { ...d, ...deadlineData } : d))
      );
      pushToast('Deadline Updated', `"${deadlineData.title}" was saved.`);
    } else {
      const newD: Deadline = {
        ...deadlineData,
        id: `dl-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setDeadlines(prev => [newD, ...prev]);
      pushToast('New Deadline Created', `"${deadlineData.title}" due ${deadlineData.dueDate}.`);
    }
  };

  const handleDeleteDeadline = (id: string) => {
    setDeadlines(prev => prev.filter(d => d.id !== id));
    pushToast('Deadline Deleted', 'The task has been removed from your tracker.');
  };

  // --- Handlers for Timetable Slots ---
  const handleSaveSlot = (
    slotData: Omit<TimetableEntry, 'id'>,
    existingId?: string
  ) => {
    if (existingId) {
      setTimetable(prev =>
        prev.map(e => (e.id === existingId ? { ...e, ...slotData } : e))
      );
      pushToast('Class Slot Updated', `Updated schedule for ${slotData.day}.`);
    } else {
      const newEntry: TimetableEntry = {
        ...slotData,
        id: `slot-${Date.now()}`,
      };
      setTimetable(prev => [...prev, newEntry]);
      pushToast('Class Slot Added', `Added to ${slotData.day} schedule.`);
    }
  };

  // --- Handlers for Attendance ---
  const handleMarkAttendance = (courseId: string, entryId: string, status: 'present' | 'absent') => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setAttendanceRecords(prev => {
      const filtered = prev.filter(a => !(a.entryId === entryId && a.date === todayStr));
      return [
        ...filtered,
        {
          id: `att-${Date.now()}`,
          date: todayStr,
          entryId,
          courseId,
          status,
          timestamp: Date.now(),
        },
      ];
    });

    const course = courses.find(c => c.id === courseId);
    pushToast(
      status === 'present' ? 'Attendance Recorded: Present' : 'Attendance Recorded: Absent',
      `${course ? course.code : 'Class'} marked as ${status} for today.`
    );
  };

  // --- Reset to Default Timetable ---
  const handleResetTimetable = () => {
    if (window.confirm('Reset timetable to the official Physics Cycle Sem I & A4 timetable?')) {
      setTimetable(DEFAULT_TIMETABLE);
      setCourses(DEFAULT_COURSES);
      setNotificationRules(DEFAULT_NOTIFICATION_RULES);
      pushToast('Timetable Reset', 'Restored official timetable layout.');
    }
  };

  const handleUpdateSemesterConfig = (newConfig: SemesterConfig) => {
    setSettings(prev => ({ ...prev, semester: newConfig }));
    pushToast('Academic Term Updated', `Timeline saved for ${newConfig.semesterName}.`);
  };

  const handleStudentLogin = (
    name: string,
    rollNumber: string,
    batch: 'B1' | 'B2',
    phoneNumber?: string
  ) => {
    setSettings(prev => ({
      ...prev,
      isLoggedIn: true,
      studentName: name,
      rollNumber,
      phoneNumber,
      selectedBatch: batch,
    }));

    // Record login in creator member log
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}, ${formatTime12(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`)}`;
    const newRecord: LoginMemberRecord = {
      id: `mem-${Date.now()}`,
      studentName: name,
      rollNumber,
      phoneNumber,
      batch,
      loginTime: now.toISOString(),
      loginFormatted: formattedDate,
      timestamp: Date.now(),
      deviceInfo: `${navigator.platform || 'Client'} · ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}`,
    };
    setLoginMembers(prev => [newRecord, ...prev]);

    setIsLoginModalOpen(false);
    pushToast(
      `Welcome, ${name.split(' ')[0]}!`,
      `Signed in as Roll #${rollNumber}${phoneNumber ? ` (${phoneNumber})` : ''} · Batch ${batch} timetable active.`
    );
  };

  const handleStudentLogout = () => {
    setSettings(prev => ({ ...prev, isLoggedIn: false }));
    setIsProfileModalOpen(false);
    setIsLoginModalOpen(true);
    pushToast('Signed Out', 'Please sign in with your student credentials to view your classes.');
  };

  const handleUpdateStudentProfile = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    if (updates.selectedBatch) {
      pushToast('Lab Batch Updated', `Now showing laboratory schedule for Batch ${updates.selectedBatch}.`);
    } else {
      pushToast('Student Profile Saved', 'Updated your identity details.');
    }
  };

  const handleToggleFocusMode = () => {
    setSettings(prev => {
      const next = !prev.focusMode.enabled;
      if (next) {
        pushToast('Focus Mode Active', 'Non-essential academic widgets hidden. Only active class & deadlines shown.');
      } else {
        pushToast('Focus Mode Off', 'Standard timetable dashboard restored.');
      }
      return {
        ...prev,
        focusMode: { ...prev.focusMode, enabled: next },
      };
    });
  };

  const handleToggleFocusTheme = () => {
    setSettings(prev => ({
      ...prev,
      focusMode: {
        ...prev.focusMode,
        highContrast: !prev.focusMode.highContrast,
      },
    }));
  };

  const handleVerifyCreator = (passcode: string): boolean => {
    if (
      passcode === '2026' ||
      passcode === 'campus2026' ||
      passcode.toLowerCase() === 'thanushhkolangaya@gmail.com'
    ) {
      setSettings(prev => ({ ...prev, isCreator: true }));
      pushToast('Creator Verified', 'Access granted to student member audit logs.');
      return true;
    }
    return false;
  };

  const handleLockCreator = () => {
    setSettings(prev => ({ ...prev, isCreator: false }));
    setIsCreatorModalOpen(false);
    pushToast('Creator Portal Locked', 'Passcode will be required on next access.');
  };

  const handleClearMembers = () => {
    if (window.confirm('Clear all logged student member records?')) {
      setLoginMembers([]);
      pushToast('Logs Cleared', 'All member login records have been purged.');
    }
  };

  const pendingDeadlinesCount = deadlines.filter(d => !d.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        settings={settings}
        setSettings={setSettings}
        currentTimeDisplay={formatTime12(currentTimeStr)}
        currentDayDisplay={currentDay}
        isSimulated={isSimulated}
        onToggleSimulator={() => setIsSimulatorOpen(true)}
        pendingDeadlinesCount={pendingDeadlinesCount}
        onOpenStudentProfile={() => setIsProfileModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onToggleFocusMode={handleToggleFocusMode}
        onOpenCreatorPortal={() => setIsCreatorModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Simulation Banner notice if enabled */}
        {isSimulated && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-amber-900 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>
                <strong>Simulation Active:</strong> Simulating {currentDay} at{' '}
                {formatTime12(currentTimeStr)}. (Device clock is bypassed for testing).
              </span>
            </div>
            <button
              onClick={() => {
                setSettings(prev => ({
                  ...prev,
                  simulatedTime: { ...prev.simulatedTime, enabled: false },
                }));
                pushToast('Real Time Synced', 'Switched back to your device clock.');
              }}
              className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
            >
              Reset to Real Time
            </button>
          </div>
        )}

        {/* View Routing */}
        {currentTab === 'today' && (
          settings.focusMode.enabled ? (
            <FocusModeView
              status={activeStatus}
              currentTimeStr={currentTimeStr}
              currentDay={currentDay}
              deadlines={deadlines}
              courses={courses}
              highContrast={settings.focusMode.highContrast}
              studentName={settings.studentName}
              rollNumber={settings.rollNumber}
              batch={settings.selectedBatch}
              onToggleTheme={handleToggleFocusTheme}
              onExitFocusMode={handleToggleFocusMode}
              onToggleCompleteDeadline={handleToggleCompleteDeadline}
            />
          ) : (
            <div className="space-y-6">
              {/* Student Identity & Login Banner */}
              <div className="bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 border border-indigo-100/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-xs shadow-indigo-200">
                    {settings.studentName ? settings.studentName[0].toUpperCase() : 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                        {settings.studentName}
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                        Batch {settings.selectedBatch}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 font-medium">
                      <span>Roll No: <strong className="font-mono text-slate-700">{settings.rollNumber}</strong></span>
                      {settings.phoneNumber && (
                        <>
                          <span>·</span>
                          <span>Ph: <strong className="font-mono text-slate-700">{settings.phoneNumber}</strong></span>
                        </>
                      )}
                      <span>·</span>
                      <span>Physics Cycle · Sem I & A4 (M305)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    View Student ID
                  </button>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Switch Student
                  </button>
                </div>
              </div>

              {/* Live Now & Next Up Widget */}
              <LiveNowWidget
                status={activeStatus}
                currentTimeStr={currentTimeStr}
                currentDay={currentDay}
                isSimulated={isSimulated}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
                attendanceRecords={attendanceRecords}
                onMarkAttendance={handleMarkAttendance}
                notificationRules={notificationRules}
                onTriggerTestClassAlert={handleTestClassAlert}
              />

              {/* Academic Semester Progress Widget */}
              <SemesterProgressBar
                config={settings.semester}
                onUpdateConfig={handleUpdateSemesterConfig}
              />

              {/* Two Column Layout: Today's Timeline + Intuitive Upcoming Deadlines Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Today's Schedule Timeline (7 cols) */}
                <div className="lg:col-span-7">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Daily Schedule Timeline
                    </h3>
                    <span className="text-xs text-slate-500">
                      Room {settings.defaultRoom} · Physics Cycle
                    </span>
                  </div>

                  <TodayScheduleView
                    currentDay={currentDay}
                    currentTimeMinutes={currentMinutes}
                    selectedBatch={settings.selectedBatch}
                    timetable={timetable}
                    courses={courses}
                    periodSlots={PERIOD_SLOTS}
                    notificationRules={notificationRules}
                    attendanceRecords={attendanceRecords}
                    onToggleRule={courseId => {
                      setNotificationRules(prev =>
                        prev.map(r => (r.courseId === courseId ? { ...r, enabled: !r.enabled } : r))
                      );
                    }}
                    onOpenRuleModal={courseId => setSingleRuleCourseId(courseId)}
                    onMarkAttendance={handleMarkAttendance}
                    onOpenEditSlot={entry => setEditingSlot(entry)}
                    onOpenAddSlot={() => setIsAddSlotOpen(true)}
                  />
                </div>

                {/* Intuitive Deadlines Widget (5 cols) */}
                <div className="lg:col-span-5 sticky top-24">
                  <UpcomingDeadlinesWidget
                    deadlines={deadlines}
                    courses={courses}
                    onToggleComplete={handleToggleCompleteDeadline}
                    onOpenAddModal={() => {
                      setEditingDeadline(null);
                      setIsAddDeadlineOpen(true);
                    }}
                    onOpenEditModal={d => {
                      setEditingDeadline(d);
                      setIsAddDeadlineOpen(true);
                    }}
                    onViewAllDeadlines={() => setCurrentTab('deadlines')}
                  />
                </div>
              </div>
            </div>
          )
        )}

        {currentTab === 'weekly' && (
          <WeeklyTimetableGrid
            timetable={timetable}
            courses={courses}
            selectedBatch={settings.selectedBatch}
            onSelectBatch={b => setSettings(prev => ({ ...prev, selectedBatch: b }))}
            onOpenEditSlot={entry => setEditingSlot(entry)}
            onOpenAddSlot={() => setIsAddSlotOpen(true)}
          />
        )}

        {currentTab === 'deadlines' && (
          <DeadlinesView
            deadlines={deadlines}
            courses={courses}
            onToggleComplete={handleToggleCompleteDeadline}
            onOpenAddModal={() => {
              setEditingDeadline(null);
              setIsAddDeadlineOpen(true);
            }}
            onOpenEditModal={d => {
              setEditingDeadline(d);
              setIsAddDeadlineOpen(true);
            }}
            onDeleteDeadline={handleDeleteDeadline}
          />
        )}

        {currentTab === 'notifications' && (
          <NotificationRulesView
            settings={settings}
            setSettings={setSettings}
            courses={courses}
            rules={notificationRules}
            setRules={setNotificationRules}
            onShowToast={pushToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CampusBell</span>
            <span>·</span>
            <span>Physics Cycle · Semester I & A4</span>
            <span>·</span>
            <span>Room M305</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCreatorModalOpen(true)}
              className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors cursor-pointer"
              title="Creator Admin Access (Protected)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Creator Portal</span>
            </button>
            <span>·</span>
            <button
              onClick={handleResetTimetable}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset to default timetable schedule from the photo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default Timetable</span>
            </button>
            <span>·</span>
            <span>Web Audio Chimes Active</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AddEditDeadlineModal
        isOpen={isAddDeadlineOpen}
        onClose={() => setIsAddDeadlineOpen(false)}
        onSave={handleSaveDeadline}
        courses={courses}
        initialData={editingDeadline}
      />

      <AddEditSlotModal
        isOpen={isAddSlotOpen || Boolean(editingSlot)}
        onClose={() => {
          setIsAddSlotOpen(false);
          setEditingSlot(null);
        }}
        onSave={handleSaveSlot}
        courses={courses}
        initialData={editingSlot}
      />

      <SingleCourseRuleModal
        isOpen={Boolean(singleRuleCourseId)}
        onClose={() => setSingleRuleCourseId(null)}
        course={courses.find(c => c.id === singleRuleCourseId) || null}
        rule={notificationRules.find(r => r.courseId === singleRuleCourseId) || null}
        onSaveRule={(courseId, updates) => {
          setNotificationRules(prev =>
            prev.map(r => (r.courseId === courseId ? { ...r, ...updates } : r))
          );
        }}
        volume={settings.volume}
      />

      <TimeSimulatorDrawer
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        settings={settings}
        setSettings={setSettings}
        onShowToast={pushToast}
      />

      {/* Student Authentication & Profile Modals */}
      <StudentLoginModal
        isOpen={isLoginModalOpen || !settings.isLoggedIn}
        onLogin={handleStudentLogin}
        currentSettings={settings}
        canDismiss={settings.isLoggedIn}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateStudentProfile}
        onLogout={handleStudentLogout}
      />

      {/* Creator-Only Registered Members Portal */}
      <CreatorPortalModal
        isOpen={isCreatorModalOpen}
        onClose={() => setIsCreatorModalOpen(false)}
        isCreatorVerified={settings.isCreator}
        onVerifyCreator={handleVerifyCreator}
        onLockCreator={handleLockCreator}
        loginMembers={loginMembers}
        onClearMembers={handleClearMembers}
      />

      {/* Floating In-App Notifications Toast */}
      <InAppToastContainer alerts={alerts} onDismiss={handleDismissToast} />
    </div>
  );
}
