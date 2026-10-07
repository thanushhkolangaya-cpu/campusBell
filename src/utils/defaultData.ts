import { Course, Deadline, LoginMemberRecord, NotificationRule, PeriodSlot, TimetableEntry, UserSettings } from '../types';

export const PERIOD_SLOTS: PeriodSlot[] = [
  { periodNum: 1, label: 'Period 1', startTime: '09:00', endTime: '09:55' },
  { periodNum: 2, label: 'Period 2', startTime: '09:55', endTime: '10:50' },
  { periodNum: 'break', label: 'Tea Break', startTime: '10:50', endTime: '11:10', isBreak: true },
  { periodNum: 3, label: 'Period 3', startTime: '11:10', endTime: '12:05' },
  { periodNum: 4, label: 'Period 4', startTime: '12:05', endTime: '13:00' },
  { periodNum: 'lunch', label: 'Lunch Break', startTime: '13:00', endTime: '13:55', isBreak: true },
  { periodNum: 5, label: 'Period 5', startTime: '13:55', endTime: '14:50' },
  { periodNum: 6, label: 'Period 6', startTime: '14:50', endTime: '15:45' },
  { periodNum: 7, label: 'Period 7', startTime: '15:45', endTime: '16:40' },
];

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'BTA001',
    code: 'BTA001',
    name: 'Introduction to Data Science',
    instructor: 'Prajwal (PR)',
    defaultRoom: 'M305',
    color: '#4f46e5', // indigo
    type: 'theory',
    credits: 3,
  },
  {
    id: 'BTF101',
    code: 'BTF101',
    name: 'Applied Physics in Engineering',
    instructor: 'Dr. Suryanarayana K (SNK)',
    defaultRoom: 'M305',
    color: '#0284c7', // sky/blue
    type: 'theory',
    credits: 4,
  },
  {
    id: 'BTC101',
    code: 'BTC101',
    name: 'Problem Solving Using C',
    instructor: 'Nithya B P (NBP) + Aparna (AP) + Archana (AN)',
    defaultRoom: 'M305',
    color: '#059669', // emerald
    type: 'theory',
    credits: 4,
  },
  {
    id: 'BTF002',
    code: 'BTF002',
    name: 'Computational Techniques - 1',
    instructor: 'Amruthalakshmi (AL) + Kavana (KN)',
    defaultRoom: 'M305',
    color: '#7c3aed', // violet
    type: 'theory',
    credits: 4,
  },
  {
    id: 'BTM015',
    code: 'BTM015',
    name: 'Elements of Mechanical Engineering',
    instructor: 'Dr. Lokesh V (LV)',
    defaultRoom: 'M305',
    color: '#d97706', // amber
    type: 'theory',
    credits: 3,
  },
  {
    id: 'BTP101',
    code: 'BTP101',
    name: 'Innovation and Design Thinking - 1',
    instructor: 'Faculty Incharge',
    defaultRoom: 'M305',
    color: '#0d9488', // teal
    type: 'theory',
    credits: 2,
  },
  {
    id: 'BTP103',
    code: 'BTP103',
    name: 'Environmental Studies',
    instructor: 'Soujanya N (SN)',
    defaultRoom: 'M305',
    color: '#16a34a', // green
    type: 'theory',
    credits: 2,
  },
  {
    id: 'BTP105',
    code: 'BTP105',
    name: 'English Language and Career Skills',
    instructor: 'Dr. Ambika Mallya (AM)',
    defaultRoom: 'M305',
    color: '#2563eb', // royal blue
    type: 'theory',
    credits: 2,
  },
  {
    id: 'BTN101',
    code: 'BTN101',
    name: 'Future-Ready Skills / Virtual Internship - 1',
    instructor: 'Dr. Dheeraj',
    defaultRoom: 'M305',
    color: '#9333ea', // purple
    type: 'theory',
    credits: 2,
  },
  {
    id: 'BTN102',
    code: 'BTN102',
    name: 'Kannada - 1 / Sanskrit - 1',
    instructor: 'Soujanya N (SN) + Sahana G K (SGK)',
    defaultRoom: 'M305',
    color: '#ea580c', // orange
    type: 'theory',
    credits: 1,
  },
  {
    id: 'BTN103',
    code: 'BTN103',
    name: 'NSS / NCC / Sports / Yoga / TF',
    instructor: 'Rakesh Mallya (RM)',
    defaultRoom: 'Ground / Hall',
    color: '#e11d48', // rose
    type: 'activity',
    credits: 1,
  },
  {
    id: 'MENTOR',
    code: 'MENTOR',
    name: 'Mentoring Session',
    instructor: 'Faculty Mentor',
    defaultRoom: 'M305',
    color: '#475569', // slate
    type: 'mentoring',
  },
  {
    id: 'LIB',
    code: 'LIB',
    name: 'Library & Self-Study',
    instructor: 'Library Incharge',
    defaultRoom: 'Central Library',
    color: '#64748b', // slate
    type: 'library',
  },
  {
    id: 'ACT',
    code: 'ACT',
    name: 'Student Activity & Events',
    instructor: 'Activity Coordinator',
    defaultRoom: 'M305 / Quad',
    color: '#c026d3', // fuchsia
    type: 'activity',
  },
  // Labs
  {
    id: 'LAB-PHY',
    code: 'PHY LAB',
    name: 'Applied Physics Practical Lab',
    instructor: 'SNK & Lab Faculty',
    defaultRoom: 'P-Block Lab 201',
    color: '#0284c7',
    type: 'lab',
    credits: 1.5,
  },
  {
    id: 'LAB-C',
    code: 'C LAB',
    name: 'Problem Solving Using C Lab',
    instructor: 'NBP / AP / AN Lab Team',
    defaultRoom: 'Computing Lab 2',
    color: '#059669',
    type: 'lab',
    credits: 1.5,
  },
  {
    id: 'LAB-DS',
    code: 'DS LAB',
    name: 'Data Science Practical Lab',
    instructor: 'PR & Data Team',
    defaultRoom: 'CS Lab 304',
    color: '#4f46e5',
    type: 'lab',
    credits: 1.5,
  },
  {
    id: 'LAB-MATHS',
    code: 'MATHS LAB',
    name: 'Computational Mathematics Lab',
    instructor: 'AL + KN Math Team',
    defaultRoom: 'Math Lab 102',
    color: '#7c3aed',
    type: 'lab',
    credits: 1.5,
  },
];

export const DEFAULT_TIMETABLE: TimetableEntry[] = [
  // --- MONDAY ---
  { id: 'mon-1', day: 'Monday', periodNum: 1, startTime: '09:00', endTime: '09:55', courseId: 'BTF101', room: 'M305', batch: 'All' },
  { id: 'mon-2', day: 'Monday', periodNum: 2, startTime: '09:55', endTime: '10:50', courseId: 'MENTOR', room: 'M305', batch: 'All' },
  { id: 'mon-3', day: 'Monday', periodNum: 3, startTime: '11:10', endTime: '12:05', courseId: 'LIB', room: 'Central Library', batch: 'All' },
  { id: 'mon-4', day: 'Monday', periodNum: 4, startTime: '12:05', endTime: '13:00', courseId: 'BTF002', room: 'M305', batch: 'All' },
  { id: 'mon-5', day: 'Monday', periodNum: 5, startTime: '13:55', endTime: '14:50', courseId: 'BTA001', room: 'M305', batch: 'All' },
  { id: 'mon-6', day: 'Monday', periodNum: 6, startTime: '14:50', endTime: '15:45', courseId: 'BTA001', room: 'M305', batch: 'All' },

  // --- TUESDAY ---
  { id: 'tue-1', day: 'Tuesday', periodNum: 1, startTime: '09:00', endTime: '09:55', courseId: 'BTF002', room: 'M305', batch: 'All' },
  { id: 'tue-2', day: 'Tuesday', periodNum: 2, startTime: '09:55', endTime: '10:50', courseId: 'BTF101', room: 'M305', batch: 'All' },
  // Lab period 3 & 4 (11:10 to 13:00)
  { id: 'tue-lab-b1', day: 'Tuesday', periodNum: 3, startTime: '11:10', endTime: '13:00', courseId: 'LAB-PHY', room: 'P-Block Lab 201', batch: 'B1', isLab: true, notes: 'B1 Physics Lab' },
  { id: 'tue-lab-b2', day: 'Tuesday', periodNum: 3, startTime: '11:10', endTime: '13:00', courseId: 'LAB-C', room: 'Computing Lab 2', batch: 'B2', isLab: true, notes: 'B2 C Programming Lab' },
  { id: 'tue-5', day: 'Tuesday', periodNum: 5, startTime: '13:55', endTime: '14:50', courseId: 'BTM015', room: 'M305', batch: 'All' },
  { id: 'tue-6', day: 'Tuesday', periodNum: 6, startTime: '14:50', endTime: '15:45', courseId: 'BTC101', room: 'M305', batch: 'All' },
  { id: 'tue-7', day: 'Tuesday', periodNum: 7, startTime: '15:45', endTime: '16:40', courseId: 'ACT', room: 'M305', batch: 'All' },

  // --- WEDNESDAY ---
  // Lab period 1 & 2 (09:00 to 10:50)
  { id: 'wed-lab-b1', day: 'Wednesday', periodNum: 1, startTime: '09:00', endTime: '10:50', courseId: 'LAB-DS', room: 'CS Lab 304', batch: 'B1', isLab: true, notes: 'B1 Data Science Lab' },
  { id: 'wed-lab-b2', day: 'Wednesday', periodNum: 1, startTime: '09:00', endTime: '10:50', courseId: 'LAB-PHY', room: 'P-Block Lab 201', batch: 'B2', isLab: true, notes: 'B2 Physics Lab' },
  { id: 'wed-3', day: 'Wednesday', periodNum: 3, startTime: '11:10', endTime: '12:05', courseId: 'BTP105', room: 'M305', batch: 'All' },
  { id: 'wed-4', day: 'Wednesday', periodNum: 4, startTime: '12:05', endTime: '13:00', courseId: 'BTM015', room: 'M305', batch: 'All' },
  { id: 'wed-5', day: 'Wednesday', periodNum: 5, startTime: '13:55', endTime: '14:50', courseId: 'BTF002', room: 'M305', batch: 'All' },
  { id: 'wed-6', day: 'Wednesday', periodNum: 6, startTime: '14:50', endTime: '15:45', courseId: 'BTF101', room: 'M305', batch: 'All' },
  { id: 'wed-7', day: 'Wednesday', periodNum: 7, startTime: '15:45', endTime: '16:40', courseId: 'BTN102', room: 'M305', batch: 'All' },

  // --- THURSDAY ---
  { id: 'thu-1', day: 'Thursday', periodNum: 1, startTime: '09:00', endTime: '09:55', courseId: 'BTA001', room: 'M305', batch: 'All' },
  // Lab period 3 & 4 (11:10 to 13:00)
  { id: 'thu-lab', day: 'Thursday', periodNum: 3, startTime: '11:10', endTime: '13:00', courseId: 'LAB-MATHS', room: 'Math Lab 102', batch: 'All', isLab: true, notes: 'Computational Techniques Lab' },
  { id: 'thu-5', day: 'Thursday', periodNum: 5, startTime: '13:55', endTime: '14:50', courseId: 'BTC101', room: 'M305', batch: 'All' },
  { id: 'thu-6', day: 'Thursday', periodNum: 6, startTime: '14:50', endTime: '15:45', courseId: 'BTF101', room: 'M305', batch: 'All' },

  // --- FRIDAY ---
  { id: 'fri-1', day: 'Friday', periodNum: 1, startTime: '09:00', endTime: '09:55', courseId: 'BTM015', room: 'M305', batch: 'All' },
  { id: 'fri-2', day: 'Friday', periodNum: 2, startTime: '09:55', endTime: '10:50', courseId: 'BTF002', room: 'M305', batch: 'All' },
  { id: 'fri-3', day: 'Friday', periodNum: 3, startTime: '11:10', endTime: '12:05', courseId: 'BTP103', room: 'M305', batch: 'All' },
  { id: 'fri-4', day: 'Friday', periodNum: 4, startTime: '12:05', endTime: '13:00', courseId: 'BTC101', room: 'M305', batch: 'All' },
  { id: 'fri-5', day: 'Friday', periodNum: 5, startTime: '13:55', endTime: '14:50', courseId: 'BTC101', room: 'M305', batch: 'All' },
  { id: 'fri-6', day: 'Friday', periodNum: 6, startTime: '14:50', endTime: '15:45', courseId: 'BTA001', room: 'M305', batch: 'All' },
  { id: 'fri-7', day: 'Friday', periodNum: 7, startTime: '15:45', endTime: '16:40', courseId: 'BTP101', room: 'M305', batch: 'All' },

  // --- SATURDAY ---
  // Lab period 1 & 2 (09:00 to 10:50)
  { id: 'sat-lab-b1', day: 'Saturday', periodNum: 1, startTime: '09:00', endTime: '10:50', courseId: 'LAB-C', room: 'Computing Lab 2', batch: 'B1', isLab: true, notes: 'B1 C Programming Lab' },
  { id: 'sat-lab-b2', day: 'Saturday', periodNum: 1, startTime: '09:00', endTime: '10:50', courseId: 'LAB-DS', room: 'CS Lab 304', batch: 'B2', isLab: true, notes: 'B2 Data Science Lab' },
  { id: 'sat-3', day: 'Saturday', periodNum: 3, startTime: '11:10', endTime: '12:05', courseId: 'BTN101', room: 'M305', batch: 'All', notes: 'Future-Ready Skills / NSS-Sports' },
  { id: 'sat-4', day: 'Saturday', periodNum: 4, startTime: '12:05', endTime: '13:00', courseId: 'ACT', room: 'M305', batch: 'All', notes: 'Activity / Co-curricular' },
];

export const DEFAULT_NOTIFICATION_RULES: NotificationRule[] = [
  { courseId: 'BTA001', enabled: true, leadTimeMinutes: 10, sound: 'chime' },
  { courseId: 'BTF101', enabled: true, leadTimeMinutes: 10, sound: 'bell' },
  { courseId: 'BTC101', enabled: true, leadTimeMinutes: 10, sound: 'chime' },
  { courseId: 'BTF002', enabled: true, leadTimeMinutes: 10, sound: 'ping' },
  { courseId: 'BTM015', enabled: true, leadTimeMinutes: 10, sound: 'marimba' },
  { courseId: 'BTP101', enabled: true, leadTimeMinutes: 5, sound: 'chime' },
  { courseId: 'BTP103', enabled: true, leadTimeMinutes: 5, sound: 'bell' },
  { courseId: 'BTP105', enabled: true, leadTimeMinutes: 10, sound: 'chime' },
  { courseId: 'BTN101', enabled: true, leadTimeMinutes: 5, sound: 'ping' },
  { courseId: 'BTN102', enabled: true, leadTimeMinutes: 5, sound: 'chime' },
  { courseId: 'BTN103', enabled: true, leadTimeMinutes: 15, sound: 'bell' },
  { courseId: 'MENTOR', enabled: true, leadTimeMinutes: 10, sound: 'marimba' },
  { courseId: 'LIB', enabled: false, leadTimeMinutes: 5, sound: 'none' },
  { courseId: 'ACT', enabled: true, leadTimeMinutes: 5, sound: 'ping' },
  { courseId: 'LAB-PHY', enabled: true, leadTimeMinutes: 15, sound: 'bell' },
  { courseId: 'LAB-C', enabled: true, leadTimeMinutes: 15, sound: 'chime' },
  { courseId: 'LAB-DS', enabled: true, leadTimeMinutes: 15, sound: 'ping' },
  { courseId: 'LAB-MATHS', enabled: true, leadTimeMinutes: 15, sound: 'marimba' },
];

// Helper to get formatted relative date
export function getRelativeDateStr(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const DEFAULT_DEADLINES: Deadline[] = [
  {
    id: 'dl-1',
    title: 'Computational Techniques - Matrix Inversion & Gauss-Jordan Sheet',
    courseId: 'BTF002',
    dueDate: getRelativeDateStr(1),
    dueTime: '23:59',
    priority: 'urgent',
    type: 'assignment',
    completed: false,
    notes: 'Solve problem set 3 questions 4 through 9 on A4 sheets.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dl-2',
    title: 'C Programming - Dynamic Memory Allocation & Struct Lab Exercise',
    courseId: 'BTC101',
    dueDate: getRelativeDateStr(2),
    dueTime: '17:00',
    priority: 'high',
    type: 'lab_report',
    completed: false,
    notes: 'Upload compiled source code with screenshot of test executions.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dl-3',
    title: 'Applied Physics - Newton Rings & Laser Diffraction Record Book',
    courseId: 'BTF101',
    dueDate: getRelativeDateStr(4),
    dueTime: '09:00',
    priority: 'medium',
    type: 'lab_report',
    completed: false,
    notes: 'Get calculations and graph signed before entering lab.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dl-4',
    title: 'Data Science - Exploratory Analysis on Titanic Dataset',
    courseId: 'BTA001',
    dueDate: getRelativeDateStr(6),
    dueTime: '23:59',
    priority: 'high',
    type: 'project',
    completed: false,
    notes: 'Submit Jupyter notebook with data visualization bar charts.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dl-5',
    title: 'Environmental Studies - Solid Waste Audit Report',
    courseId: 'BTP103',
    dueDate: getRelativeDateStr(9),
    dueTime: '14:00',
    priority: 'low',
    type: 'assignment',
    completed: false,
    notes: 'Group report with photos of local segregation process.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dl-6',
    title: 'Elements of Mech Engg - First Internal Assessment Test (IA-1)',
    courseId: 'BTM015',
    dueDate: getRelativeDateStr(12),
    dueTime: '09:30',
    priority: 'high',
    type: 'exam',
    completed: false,
    notes: 'Modules 1 and 2: Thermodynamics & IC Engines.',
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_SETTINGS: UserSettings = {
  isLoggedIn: true,
  studentName: 'Thanush H K',
  rollNumber: '1MS26CS042',
  phoneNumber: '+91 98801 23456',
  semesterSection: 'I & A4',
  branchCycle: 'Physics Cycle',
  defaultRoom: 'M305',
  selectedBatch: 'B1',
  masterNotificationsEnabled: true,
  masterSound: 'chime',
  volume: 0.8,
  browserNotificationsEnabled: false,
  semester: {
    startDate: '2026-09-16', // from timetable "Wef: 16-09-2026"
    totalWeeks: 16,
    semesterName: '1st Semester · Physics Cycle',
  },
  focusMode: {
    enabled: false,
    highContrast: true,
  },
  isCreator: false,
  simulatedTime: {
    enabled: false,
    day: 'Monday',
    time: '09:15',
  },
};

export const CLASS_ROSTER_STUDENTS = [
  { name: 'Thanush H Kolangaya', rollNumber: '1MS26CS042', phoneNumber: '+91 98801 23456', batch: 'B1' as const },
  { name: 'Sneha Rao', rollNumber: '1MS26CS038', phoneNumber: '+91 97412 87654', batch: 'B2' as const },
  { name: 'Aditya S Verma', rollNumber: '1MS26CS004', phoneNumber: '+91 98450 11223', batch: 'B1' as const },
  { name: 'Pooja Kulkarni', rollNumber: '1MS26CS029', phoneNumber: '+91 99160 33445', batch: 'B2' as const },
  { name: 'Rohan M Hegde', rollNumber: '1MS26CS033', phoneNumber: '+91 94481 55667', batch: 'B1' as const },
  { name: 'Ananya Sharma', rollNumber: '1MS26CS007', phoneNumber: '+91 98442 77889', batch: 'B2' as const },
];

export const DEFAULT_LOGIN_MEMBERS: LoginMemberRecord[] = [
  {
    id: 'mem-1',
    studentName: 'Thanush H Kolangaya',
    rollNumber: '1MS26CS042',
    phoneNumber: '+91 98801 23456',
    batch: 'B1',
    loginTime: '2026-10-07T07:15:00.000Z',
    loginFormatted: '07 Oct 2026, 07:15 AM',
    timestamp: 1791357300000,
    deviceInfo: 'Chrome 128 / Android (Mobile)',
  },
  {
    id: 'mem-2',
    studentName: 'Sneha Rao',
    rollNumber: '1MS26CS038',
    phoneNumber: '+91 97412 87654',
    batch: 'B2',
    loginTime: '2026-10-07T06:40:00.000Z',
    loginFormatted: '07 Oct 2026, 06:40 AM',
    timestamp: 1791355200000,
    deviceInfo: 'Chrome 128 / Windows',
  },
  {
    id: 'mem-3',
    studentName: 'Aditya S Verma',
    rollNumber: '1MS26CS004',
    phoneNumber: '+91 98450 11223',
    batch: 'B1',
    loginTime: '2026-10-06T18:22:00.000Z',
    loginFormatted: '06 Oct 2026, 06:22 PM',
    timestamp: 1791310920000,
    deviceInfo: 'Safari 18 / iOS',
  },
  {
    id: 'mem-4',
    studentName: 'Pooja Kulkarni',
    rollNumber: '1MS26CS029',
    phoneNumber: '+91 99160 33445',
    batch: 'B2',
    loginTime: '2026-10-06T15:10:00.000Z',
    loginFormatted: '06 Oct 2026, 03:10 PM',
    timestamp: 1791299400000,
    deviceInfo: 'Firefox 130 / macOS',
  },
];
