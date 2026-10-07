import { DayOfWeek, TimetableEntry, Course, Deadline } from '../types';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatTime12(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // '0' should be 12
  return `${h}:${mStr} ${ampm}`;
}

export function getCurrentDayAndMinutes(simulated?: { enabled: boolean; day: DayOfWeek; time: string }): {
  day: DayOfWeek;
  currentTimeStr: string;
  currentMinutes: number;
  isSimulated: boolean;
} {
  if (simulated && simulated.enabled) {
    return {
      day: simulated.day,
      currentTimeStr: simulated.time,
      currentMinutes: timeToMinutes(simulated.time),
      isSimulated: true,
    };
  }

  const now = new Date();
  const day = DAYS_OF_WEEK[now.getDay()];
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${h}:${m}`;
  return {
    day,
    currentTimeStr,
    currentMinutes: timeToMinutes(currentTimeStr),
    isSimulated: false,
  };
}

export interface ActiveClassStatus {
  currentEntry: TimetableEntry | null;
  currentCourse: Course | null;
  currentProgressPercent: number;
  minutesRemainingInCurrent: number;
  nextEntry: TimetableEntry | null;
  nextCourse: Course | null;
  minutesUntilNext: number;
  nextDay: DayOfWeek;
  isNextTomorrow: boolean;
}

export function getActiveAndNextClass(
  timetable: TimetableEntry[],
  courses: Course[],
  day: DayOfWeek,
  currentMinutes: number,
  batch: 'B1' | 'B2'
): ActiveClassStatus {
  const courseMap = new Map<string, Course>(courses.map(c => [c.id, c]));

  // Filter today's timetable relevant to batch
  const todayEntries = timetable
    .filter(e => e.day === day && (e.batch === 'All' || e.batch === batch))
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  let currentEntry: TimetableEntry | null = null;
  let nextEntry: TimetableEntry | null = null;
  let minutesRemainingInCurrent = 0;
  let currentProgressPercent = 0;
  let minutesUntilNext = 0;
  let nextDay = day;
  let isNextTomorrow = false;

  for (const entry of todayEntries) {
    const startM = timeToMinutes(entry.startTime);
    const endM = timeToMinutes(entry.endTime);

    if (currentMinutes >= startM && currentMinutes < endM) {
      currentEntry = entry;
      minutesRemainingInCurrent = endM - currentMinutes;
      const totalDur = endM - startM;
      currentProgressPercent = Math.min(100, Math.max(0, ((currentMinutes - startM) / totalDur) * 100));
    } else if (currentMinutes < startM && !nextEntry) {
      nextEntry = entry;
      minutesUntilNext = startM - currentMinutes;
    }
  }

  // If no next entry today, look ahead to subsequent days
  if (!nextEntry) {
    const dayIndex = DAYS_OF_WEEK.indexOf(day);
    for (let offset = 1; offset <= 6; offset++) {
      const checkDay = DAYS_OF_WEEK[(dayIndex + offset) % 7];
      const futureEntries = timetable
        .filter(e => e.day === checkDay && (e.batch === 'All' || e.batch === batch))
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

      if (futureEntries.length > 0) {
        nextEntry = futureEntries[0];
        nextDay = checkDay;
        isNextTomorrow = offset === 1;
        const startM = timeToMinutes(nextEntry.startTime);
        // Approx minutes until
        minutesUntilNext = (24 * 60 - currentMinutes) + (offset - 1) * 24 * 60 + startM;
        break;
      }
    }
  }

  return {
    currentEntry,
    currentCourse: currentEntry ? courseMap.get(currentEntry.courseId) || null : null,
    currentProgressPercent,
    minutesRemainingInCurrent,
    nextEntry,
    nextCourse: nextEntry ? courseMap.get(nextEntry.courseId) || null : null,
    minutesUntilNext,
    nextDay,
    isNextTomorrow,
  };
}

export function formatDurationHuman(minutes: number): string {
  if (minutes < 0) return 'Passed';
  if (minutes === 0) return 'Right now';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function calculateDeadlineStatus(deadline: Deadline): {
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  displayText: string;
  urgencyLevel: 'critical' | 'high' | 'normal' | 'done';
} {
  if (deadline.completed) {
    return {
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      displayText: 'Completed',
      urgencyLevel: 'done',
    };
  }

  const [year, month, day] = deadline.dueDate.split('-').map(Number);
  const [hour, minute] = deadline.dueTime.split(':').map(Number);
  const dueDateTime = new Date(year, month - 1, day, hour, minute);

  const now = new Date();
  const diffMs = dueDateTime.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const overdueHours = Math.abs(diffHours);
    return {
      isOverdue: true,
      isToday: false,
      isTomorrow: false,
      daysRemaining: diffDays,
      hoursRemaining: diffHours,
      displayText: overdueHours < 24 ? `Overdue by ${overdueHours}h` : `Overdue by ${Math.abs(diffDays)}d`,
      urgencyLevel: 'critical',
    };
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().slice(0, 10);

  const isToday = deadline.dueDate === todayStr;
  const isTomorrow = deadline.dueDate === tomorrowStr;

  let displayText = '';
  if (diffHours < 1) {
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    displayText = `In ${diffMins}m`;
  } else if (diffHours < 24) {
    displayText = `In ${diffHours}h (${formatTime12(deadline.dueTime)})`;
  } else if (isTomorrow) {
    displayText = `Tomorrow at ${formatTime12(deadline.dueTime)}`;
  } else {
    displayText = `In ${diffDays} days`;
  }

  let urgencyLevel: 'critical' | 'high' | 'normal' | 'done' = 'normal';
  if (diffHours <= 12 || deadline.priority === 'urgent') {
    urgencyLevel = 'critical';
  } else if (diffHours <= 48 || deadline.priority === 'high') {
    urgencyLevel = 'high';
  }

  return {
    isOverdue: false,
    isToday,
    isTomorrow,
    daysRemaining: diffDays,
    hoursRemaining: diffHours,
    displayText,
    urgencyLevel,
  };
}

export interface SemesterProgressInfo {
  startDate: string;
  endDate: string;
  totalWeeks: number;
  totalDays: number;
  daysElapsed: number;
  daysRemaining: number;
  weeksCompleted: number;
  currentWeekNumber: number;
  weeksRemaining: number;
  percentCompleted: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export function calculateSemesterProgress(
  startDateStr: string,
  totalWeeks: number,
  currentDateOverride?: Date
): SemesterProgressInfo {
  const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
  const startDate = new Date(startYear, startMonth - 1, startDay, 0, 0, 0);

  const totalDays = totalWeeks * 7;
  const endDate = new Date(startDate.getTime() + totalDays * 24 * 60 * 60 * 1000);
  const endYear = endDate.getFullYear();
  const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
  const endD = String(endDate.getDate()).padStart(2, '0');
  const endDateStr = `${endYear}-${endMonth}-${endD}`;

  const now = currentDateOverride || new Date();
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  const diffMs = todayZero.getTime() - startDate.getTime();
  const rawDaysElapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let status: 'not_started' | 'in_progress' | 'completed' = 'in_progress';
  if (rawDaysElapsed < 0) {
    status = 'not_started';
  } else if (rawDaysElapsed >= totalDays) {
    status = 'completed';
  }

  const clampedElapsed = Math.max(0, Math.min(rawDaysElapsed, totalDays));
  const daysRemaining = Math.max(0, totalDays - clampedElapsed);
  const weeksCompleted = Math.floor(clampedElapsed / 7);
  const currentWeekNumber = Math.min(totalWeeks, Math.floor(clampedElapsed / 7) + 1);
  const weeksRemaining = Math.max(0, totalWeeks - currentWeekNumber);
  const percentCompleted = totalDays > 0 ? Math.min(100, Math.max(0, Math.round((clampedElapsed / totalDays) * 100))) : 0;

  return {
    startDate: startDateStr,
    endDate: endDateStr,
    totalWeeks,
    totalDays,
    daysElapsed: clampedElapsed,
    daysRemaining,
    weeksCompleted,
    currentWeekNumber,
    weeksRemaining,
    percentCompleted,
    status,
  };
}
