import React from 'react';
import { Bell, Calendar, CheckSquare, Clock, Sliders, Volume2, Sparkles, Eye, ShieldCheck, GraduationCap } from 'lucide-react';
import { UserSettings } from '../types';
import { playNotificationSound } from '../utils/audio';

interface NavbarProps {
  currentTab: 'today' | 'weekly' | 'deadlines' | 'notifications';
  setCurrentTab: (tab: 'today' | 'weekly' | 'deadlines' | 'notifications') => void;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  currentTimeDisplay: string;
  currentDayDisplay: string;
  isSimulated: boolean;
  onToggleSimulator: () => void;
  pendingDeadlinesCount: number;
  onOpenStudentProfile: () => void;
  onOpenLogin: () => void;
  onToggleFocusMode: () => void;
  onOpenCreatorPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  settings,
  setSettings,
  currentTimeDisplay,
  currentDayDisplay,
  isSimulated,
  onToggleSimulator,
  pendingDeadlinesCount,
  onOpenStudentProfile,
  onOpenLogin,
  onToggleFocusMode,
  onOpenCreatorPortal,
}) => {
  const handleTestSound = () => {
    playNotificationSound(settings.masterSound, settings.volume);
  };

  const handleBatchToggle = (batch: 'B1' | 'B2') => {
    setSettings(prev => ({ ...prev, selectedBatch: batch }));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title & Room mark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">CampusBell</span>
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Room {settings.defaultRoom}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {settings.branchCycle} · Sem {settings.semesterSection}
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setCurrentTab('today')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentTab === 'today'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Today's Schedule</span>
          </button>

          <button
            onClick={() => setCurrentTab('weekly')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentTab === 'weekly'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Timetable</span>
          </button>

          <button
            onClick={() => setCurrentTab('deadlines')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentTab === 'deadlines'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Deadlines</span>
            {pendingDeadlinesCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingDeadlinesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('notifications')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentTab === 'notifications'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Class Alerts</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Batch Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => handleBatchToggle('B1')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                settings.selectedBatch === 'B1'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Batch 1 Lab Schedule"
            >
              Batch B1
            </button>
            <button
              onClick={() => handleBatchToggle('B2')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                settings.selectedBatch === 'B2'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Batch 2 Lab Schedule"
            >
              Batch B2
            </button>
          </div>

          {/* Clock & Test Bell */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-xs font-medium text-slate-500">{currentDayDisplay}</span>
            <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">
              {currentTimeDisplay}
            </span>
          </div>

          {/* Quick Sound Test button */}
          <button
            onClick={handleTestSound}
            title="Test notification chime tone"
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Focus Mode Toggle */}
          <button
            onClick={onToggleFocusMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
              settings.focusMode.enabled
                ? 'bg-neutral-900 text-amber-400 border-neutral-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle Distraction-Free High-Contrast Focus Mode"
          >
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">
              {settings.focusMode.enabled ? 'Focus Active' : 'Focus Mode'}
            </span>
          </button>

          {/* Time Simulator Toggle */}
          <button
            onClick={onToggleSimulator}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
              isSimulated
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Simulate different days or class hours"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isSimulated ? 'Simulating' : 'Simulate Time'}</span>
          </button>

          {/* Student Profile Identity Chip */}
          {settings.isLoggedIn ? (
            <button
              onClick={onOpenStudentProfile}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left cursor-pointer shadow-xs"
              title={`Student: ${settings.studentName} (Roll #${settings.rollNumber}) · Click to view ID card or switch account`}
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {settings.studentName ? settings.studentName[0].toUpperCase() : 'S'}
              </div>
              <div className="hidden lg:block leading-tight pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 block truncate max-w-[100px]">
                    {settings.studentName.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded font-mono">
                    {settings.selectedBatch}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[110px]">
                  {settings.rollNumber}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Sign In</span>
            </button>
          )}

          {/* Creator Portal Button */}
          <button
            onClick={onOpenCreatorPortal}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Creator Admin Access (Protected)"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="flex md:hidden border-t border-slate-200 px-4 py-2 bg-slate-50 overflow-x-auto gap-2">
        <button
          onClick={() => setCurrentTab('today')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentTab === 'today' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setCurrentTab('weekly')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentTab === 'weekly' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          Timetable
        </button>
        <button
          onClick={() => setCurrentTab('deadlines')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentTab === 'deadlines' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          Deadlines ({pendingDeadlinesCount})
        </button>
        <button
          onClick={() => setCurrentTab('notifications')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            currentTab === 'notifications' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          Class Alerts
        </button>
      </div>
    </header>
  );
};
