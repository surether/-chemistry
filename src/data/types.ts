export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface ScheduleItem {
  period: number;
  className: string;
  subject: string;
  unit: string;
  room: string;
}

export type ScheduleData = Record<Weekday, ScheduleItem[]>;

export interface MealData {
  date: string;
  menu: string[];
  calorie?: string;
  source: string;
}

export interface CalendarItem {
  date: string;
  title: string;
  type: 'meeting' | 'assessment' | 'event' | 'etc';
}

export interface DdayItem {
  title: string;
  date: string;
}

export interface ProgressItem {
  className: string;
  unit: string;
  lesson: string;
  status: string;
  progressRate: number;
}

export interface TaskItem {
  id: string;
  title: string;
  done: boolean;
}

export interface LinkItem {
  title: string;
  kind: 'url' | 'path';
  target: string;
  category: string;
}

export interface MemoData {
  content: string;
}

export type WindowMode = 'widget' | 'normal';

export interface SettingsData {
  teacherName: string;
  schoolName: string;
  grade: string;
  theme: 'dark';
  layout: 'dual-monitor-wide';
  windowMode: WindowMode;
  privacyMode: boolean;
}

export interface WindowStateData {
  x?: number;
  y?: number;
  width: number;
  height: number;
  alwaysOnTop: boolean;
  opacity: number;
}

export interface DashboardData {
  schedule: ScheduleData;
  meal: MealData;
  calendar: CalendarItem[];
  dday: DdayItem[];
  progress: ProgressItem[];
  tasks: TaskItem[];
  links: LinkItem[];
  memo: MemoData;
  settings: SettingsData;
  windowState: WindowStateData;
}
