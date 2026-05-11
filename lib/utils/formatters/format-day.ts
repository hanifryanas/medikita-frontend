import { Day } from '@/lib/types/common';
import { format, setDay, type Day as DateFnsDay } from 'date-fns';

const DAY_INDEX: Record<Day, DateFnsDay> = {
  [Day.Sunday]: 0,
  [Day.Monday]: 1,
  [Day.Tuesday]: 2,
  [Day.Wednesday]: 3,
  [Day.Thursday]: 4,
  [Day.Friday]: 5,
  [Day.Saturday]: 6,
};

export const shortDayFormat = 'EEE';
export const longDayFormat = 'EEEE';

export const formatDay = (day: Day, pattern: string = shortDayFormat): string => {
  const reference = setDay(new Date(), DAY_INDEX[day]);
  return format(reference, pattern);
};
