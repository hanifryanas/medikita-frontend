'use client';

import { nextApi } from '@/lib/api';
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

  const scheduleByDayIndex = useMemo(() => {
    const map = new Map<number, Schedule>();
    for (const s of careTeam?.schedules ?? []) {
      if (!s.isDisabled) map.set(DAY_INDEX[s.day], s);
    }
    return map;
  }, [careTeam]);

  const firstAvailableDate = useMemo(
    () => dates.find((d) => scheduleByDayIndex.has(d.getDay())) ?? null,
    [dates, scheduleByDayIndex]
  );

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(
    firstAvailableDate ? firstAvailableDate.toISOString() : null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Reset selected date when strip or care team changes
  const stripKey = `${stripStart.toISOString()}|${careTeam?.careTeamId ?? ''}`;
  const [lastStripKey, setLastStripKey] = useState(stripKey);
  if (lastStripKey !== stripKey) {
    setLastStripKey(stripKey);
    setSelectedDateKey(firstAvailableDate ? firstAvailableDate.toISOString() : null);
    setSelectedTime(null);
  }

  // Fetch real availability for doctors, month-by-month
  const isDoctor = role === EmployeeRole.Doctor;
  const doctorId = isDoctor ? careTeam?.careTeamId : undefined;
  const monthKey = formatDate(stripStart, monthKeyFormat);
  const { rangeStart, rangeEnd } = useMemo(() => {
    const firstOfMonth = parse(monthKey, monthKeyFormat, new Date());
    return {
      rangeStart: formatDate(startOfMonth(firstOfMonth)),
      rangeEnd: formatDate(endOfMonth(firstOfMonth)),
    };
  }, [monthKey]);

  const [doctorSchedulesByDate, setDoctorSchedulesByDate] = useState<
    Map<string, DoctorDaySchedule>
  >(new Map());

  const doctorKey = doctorId ?? '';
  const [lastDoctorKey, setLastDoctorKey] = useState(doctorKey);
  if (lastDoctorKey !== doctorKey) {
    setLastDoctorKey(doctorKey);
    setDoctorSchedulesByDate(new Map());
  }

  useEffect(() => {
    if (!doctorId) return;
    let cancelled = false;
    (async () => {
      try {
        const results = await nextApi.doctors.getDoctorSchedules({
          doctorId,
          startDate: rangeStart,
          endDate: rangeEnd,
        });
        if (cancelled) return;
        const merged = new Map<string, DoctorDaySchedule>();
        for (const entry of results) {
          if (!entry.date) continue;
          const existing = merged.get(entry.date);
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
            merged.set(entry.date, {
              timeSlots: [...entry.timeSlots],
              bookedTimeSlots: new Set(entry.bookedTimeSlots),
            });
          }
        }
        for (const value of merged.values()) value.timeSlots.sort();
        setDoctorSchedulesByDate(merged);
      } catch {
        if (cancelled) return;
        setDoctorSchedulesByDate(new Map());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [doctorId, rangeStart, rangeEnd]);

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

  // Reset selected time when slots change and current pick is no longer valid
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
