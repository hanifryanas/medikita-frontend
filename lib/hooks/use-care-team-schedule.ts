'use client';

import { nextApi } from '@/lib/api';
import { DoctorScheduleResult } from '@/lib/api/next/doctors/types/doctor-schedule-result';
import { CareTeamRole, DetailedCareTeam } from '@/lib/types/care-teams';
import { Day, Schedule } from '@/lib/types/common';
import { EmployeeRole } from '@/lib/types/employees';
import { formatDate, monthKeyFormat, monthYearFormat } from '@/lib/utils/formatters';
import { addDays, addMinutes, endOfMonth, parse, startOfDay, startOfMonth } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

const DAY_INDEX: Record<Day, number> = {
  [Day.Sunday]: 0,
  [Day.Monday]: 1,
  [Day.Tuesday]: 2,
  [Day.Wednesday]: 3,
  [Day.Thursday]: 4,
  [Day.Friday]: 5,
  [Day.Saturday]: 6,
};

const FALLBACK_SLOT_MINUTES = 20;
const TIME_FORMAT = 'HH:mm';
const STRIP_LENGTH = 7;

const trimSeconds = (time: string) => time.slice(0, 5);

const buildFallbackSlots = (start: string, end: string): string[] => {
  if (!start || !end) return [];
  const base = new Date();
  const startAt = parse(trimSeconds(start), TIME_FORMAT, base);
  const endAt = parse(trimSeconds(end), TIME_FORMAT, base);
  const slots: string[] = [];
  for (
    let cur = startAt;
    addMinutes(cur, FALLBACK_SLOT_MINUTES) <= endAt;
    cur = addMinutes(cur, FALLBACK_SLOT_MINUTES)
  ) {
    slots.push(formatDate(cur, TIME_FORMAT));
  }
  return slots;
};

const buildDateStrip = (from: Date, length = STRIP_LENGTH): Date[] =>
  Array.from({ length }, (_, i) => startOfDay(addDays(from, i)));

const fetchDoctorMonth = async (
  doctorId: string,
  monthKey: string
): Promise<readonly [string, DoctorScheduleResult[]]> => {
  const firstOfMonth = parse(monthKey, monthKeyFormat, new Date());
  const results = await nextApi.doctors.getDoctorSchedules({
    doctorId,
    startDate: formatDate(startOfMonth(firstOfMonth)),
    endDate: formatDate(endOfMonth(firstOfMonth)),
  });
  return [monthKey, results] as const;
};

const loadDoctorMonths = async (
  doctorId: string,
  monthKeys: string[],
  signal: { cancelled: boolean },
  setMap: (
    updater: (prev: Map<string, DoctorScheduleResult[]>) => Map<string, DoctorScheduleResult[]>
  ) => void
) => {
  try {
    const entries = await Promise.all(monthKeys.map((k) => fetchDoctorMonth(doctorId, k)));
    if (signal.cancelled) return;
    setMap((prev) => {
      const next = new Map(prev);
      for (const [key, results] of entries) next.set(key, results);
      return next;
    });
  } catch {
    // Leave existing entries intact on error.
  }
};

export interface DoctorDaySchedule {
  timeSlots: string[];
  bookedTimeSlots: Set<string>;
}

export interface UseCareTeamScheduleResult {
  today: Date;
  stripStart: Date;
  dates: Date[];
  shiftStrip: (deltaDays: number) => void;

  scheduleByDayIndex: Map<number, Schedule>;
  hasSchedule: boolean;

  selectedDateKey: string | null;
  setSelectedDateKey: (key: string | null) => void;
  selectedDate: Date | null;
  selectedSchedule: Schedule | undefined;

  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;

  slots: string[];
  bookedSlots: Set<string>;

  monthLabel: string;
  canBook: boolean;
}

export function useCareTeamSchedule(
  careTeam: DetailedCareTeam | undefined,
  role: CareTeamRole | undefined
): UseCareTeamScheduleResult {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [stripStart, setStripStart] = useState<Date>(today);
  const dates = useMemo(() => buildDateStrip(stripStart), [stripStart]);

  const careTeamWeekdays = useMemo(() => {
    const map = new Map<number, Schedule>();
    for (const s of careTeam?.schedules ?? []) {
      if (!s.isDisabled) map.set(DAY_INDEX[s.day], s);
    }
    return map;
  }, [careTeam]);

  const isDoctor = role === EmployeeRole.Doctor;
  const doctorId = isDoctor ? careTeam?.careTeamId : undefined;

  const [doctorMonthMap, setDoctorMonthMap] = useState<Map<string, DoctorScheduleResult[]>>(
    new Map()
  );

  const doctorKey = doctorId ?? '';
  const [lastDoctorKey, setLastDoctorKey] = useState(doctorKey);
  if (lastDoctorKey !== doctorKey) {
    setLastDoctorKey(doctorKey);
    setDoctorMonthMap(new Map());
  }

  const { doctorSchedulesByDate, doctorWeekdays } = useMemo(() => {
    const byDate = new Map<string, DoctorDaySchedule>();
    const weekdays = new Map<number, Schedule>();
    for (const results of doctorMonthMap.values()) {
      for (const entry of results) {
        const dayIdx = DAY_INDEX[entry.day];
        if (dayIdx !== undefined && !weekdays.has(dayIdx)) {
          weekdays.set(dayIdx, {
            day: entry.day,
            startTime: entry.timeSlots[0] ?? '',
            endTime: entry.timeSlots[entry.timeSlots.length - 1] ?? '',
            isDisabled: false,
          } as Schedule);
        }
        if (!entry.date) continue;
        const existing = byDate.get(entry.date);
        if (existing) {
          const seen = new Set(existing.timeSlots);
          for (const slot of entry.timeSlots) {
            if (!seen.has(slot)) {
              existing.timeSlots.push(slot);
              seen.add(slot);
            }
          }
          for (const slot of entry.bookedTimeSlots) existing.bookedTimeSlots.add(slot);
        } else {
          byDate.set(entry.date, {
            timeSlots: [...entry.timeSlots],
            bookedTimeSlots: new Set(entry.bookedTimeSlots),
          });
        }
      }
    }
    for (const value of byDate.values()) value.timeSlots.sort();
    return { doctorSchedulesByDate: byDate, doctorWeekdays: weekdays };
  }, [doctorMonthMap]);

  const scheduleByDayIndex = role === EmployeeRole.Doctor ? doctorWeekdays : careTeamWeekdays;
  const hasSchedule = scheduleByDayIndex.size > 0;

  const firstAvailableDate = useMemo(
    () => dates.find((d) => scheduleByDayIndex.has(d.getDay())) ?? null,
    [dates, scheduleByDayIndex]
  );

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(
    firstAvailableDate ? firstAvailableDate.toISOString() : null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const stripKey = `${stripStart.toISOString()}|${careTeam?.careTeamId ?? ''}`;
  const [lastStripKey, setLastStripKey] = useState(stripKey);
  if (lastStripKey !== stripKey) {
    setLastStripKey(stripKey);
    setSelectedDateKey(firstAvailableDate ? firstAvailableDate.toISOString() : null);
    setSelectedTime(null);
  }

  const stripEnd = dates[dates.length - 1] ?? stripStart;
  const startMonthKey = formatDate(startOfMonth(stripStart), monthKeyFormat);
  const endMonthKey = formatDate(startOfMonth(stripEnd), monthKeyFormat);

  useEffect(() => {
    if (!doctorId) return;
    const monthKeys =
      startMonthKey === endMonthKey ? [startMonthKey] : [startMonthKey, endMonthKey];
    const missing = monthKeys.filter((k) => !doctorMonthMap.has(k));
    if (missing.length === 0) return;

    const signal = { cancelled: false };
    loadDoctorMonths(doctorId, missing, signal, setDoctorMonthMap);
    return () => {
      signal.cancelled = true;
    };
  }, [doctorId, startMonthKey, endMonthKey, doctorMonthMap]);

  const selectedDate = useMemo(
    () => (selectedDateKey ? new Date(selectedDateKey) : null),
    [selectedDateKey]
  );
  const selectedSchedule = selectedDate ? scheduleByDayIndex.get(selectedDate.getDay()) : undefined;
  const selectedDateString = selectedDate ? formatDate(selectedDate) : null;
  const selectedDoctorSchedule = selectedDateString
    ? doctorSchedulesByDate.get(selectedDateString)
    : undefined;

  const slots = useMemo(() => {
    if (selectedDoctorSchedule) return selectedDoctorSchedule.timeSlots;
    if (!selectedSchedule) return [];
    return buildFallbackSlots(selectedSchedule.startTime, selectedSchedule.endTime);
  }, [selectedDoctorSchedule, selectedSchedule]);

  const bookedSlots = useMemo(
    () => selectedDoctorSchedule?.bookedTimeSlots ?? new Set<string>(),
    [selectedDoctorSchedule]
  );

  const slotsKey = `${slots.join(',')}|${Array.from(bookedSlots).join(',')}`;
  const [lastSlotsKey, setLastSlotsKey] = useState(slotsKey);
  if (lastSlotsKey !== slotsKey) {
    setLastSlotsKey(slotsKey);
    setSelectedTime(slots.find((t) => !bookedSlots.has(t)) ?? null);
  }

  const monthLabel = useMemo(
    () => formatDate(selectedDate ?? dates[0], monthYearFormat),
    [selectedDate, dates]
  );

  const canBook = Boolean(
    selectedDate && selectedSchedule && selectedTime && !bookedSlots.has(selectedTime)
  );

  const shiftStrip = (deltaDays: number) => {
    const next = addDays(stripStart, deltaDays);
    if (next < today) return;
    setStripStart(next);
  };

  return {
    today,
    stripStart,
    dates,
    shiftStrip,
    scheduleByDayIndex,
    hasSchedule,
    selectedDateKey,
    setSelectedDateKey,
    selectedDate,
    selectedSchedule,
    selectedTime,
    setSelectedTime,
    slots,
    bookedSlots,
    monthLabel,
    canBook,
  };
}
