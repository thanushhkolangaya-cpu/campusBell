export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type DeadlineType = 'assignment' | 'lab_report' | 'quiz' | 'project' | 'exam' | 'other';

export type NotificationSound = 'chime' | 'bell' | 'marimba' | 'ping' | 'none';

export type AttendanceStatus = 'present' | 'absent' | 'cancelled';

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  defaultRoom: string;
  color: string;
  type: 'theory' | 'lab' | 'mentoring' | 'library' | 'activity';
  credits?: number;
}

export interface PeriodSlot {
  periodNum: number | 'break' | 'lunch';
  label: string;
  startTime: string; // '09:00'
  endTime: string;   // '09:55'
  isBreak?: boolean;
}

export interface TimetableEntry {
  id: string;
  day: DayOfWeek;
  periodNum: number;
  startTime: string;
  endTime: string;
  courseId: string;
  room: string;
  batch: 'All' | 'B1' | 'B2';
  isLab?: boolean;
  notes?: string;
}

export interface NotificationRule {
  courseId: string;
  enabled: boolean;
  leadTimeMinutes: number; // e.g. 5, 10, 15 min before
  sound: NotificationSound;
  messagePrefix?: string;
}

export interface Deadline {
  id: string;
  title: string;
  courseId: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  priority: Priority;
  type: DeadlineType;
  completed: boolean;
  notes?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  entryId: string;
  courseId: string;
  status: AttendanceStatus;
  timestamp: number;
}

export interface SemesterConfig {
  startDate: string; // YYYY-MM-DD
  totalWeeks: number; // default 16
  semesterName: string;
}

export interface FocusModeConfig {
  enabled: boolean;
  highContrast: boolean; // true = High Contrast Dark, false = Clean Minimal Light
}

export interface LoginMemberRecord {
  id: string;
  studentName: string;
  rollNumber: string;
  phoneNumber?: string;
  batch: 'B1' | 'B2';
  loginTime: string;
  loginFormatted: string;
  timestamp: number;
  deviceInfo: string;
}

export interface UserSettings {
  isLoggedIn: boolean;
  studentName: string;
  rollNumber: string;
  phoneNumber?: string;
  semesterSection: string;
  branchCycle: string;
  defaultRoom: string;
  selectedBatch: 'B1' | 'B2';
  masterNotificationsEnabled: boolean;
  masterSound: NotificationSound;
  volume: number; // 0 to 1
  browserNotificationsEnabled: boolean;
  semester: SemesterConfig;
  focusMode: FocusModeConfig;
  isCreator: boolean;
  simulatedTime: {
    enabled: boolean;
    day: DayOfWeek;
    time: string; // HH:mm
  };
}

export interface InAppAlert {
  id: string;
  title: string;
  message: string;
  courseCode?: string;
  room?: string;
  timeString: string;
  timestamp: number;
  read: boolean;
}
