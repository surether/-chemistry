import type { Weekday } from '../data/types';

const weekdayMap: Record<number, Weekday | null> = {
  0: null,
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: null
};

const weekdayLabel: Record<Weekday, string> = {
  monday: '월요일',
  tuesday: '화요일',
  wednesday: '수요일',
  thursday: '목요일',
  friday: '금요일'
};

export function getTodayWeekday(date = new Date()): Weekday | null {
  return weekdayMap[date.getDay()];
}

export function formatKoreanDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(date);
}

export function formatClock(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

export function getWeekdayLabel(weekday: Weekday | null): string {
  return weekday ? weekdayLabel[weekday] : '주말';
}

export function daysBetweenToday(targetDate: string, baseDate = new Date()): number {
  const target = new Date(`${targetDate}T00:00:00`);
  const base = new Date(baseDate);
  base.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - base.getTime()) / 86_400_000);
}

export function formatDday(targetDate: string): string {
  const diff = daysBetweenToday(targetDate);
  if (diff === 0) {
    return 'D-day';
  }

  return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
}
