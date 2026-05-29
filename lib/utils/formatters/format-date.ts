import { format } from 'date-fns';

export const standarDateTimeFormat = 'yyyy-MM-dd';
export const isoDateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss";
export const monthKeyFormat = 'yyyy-MM';
export const monthYearFormat = 'MMMM yyyy';
export const weekdayShortFormat = 'EEE';
export const weekdayLongFormat = 'EEEE';
export const dayOfMonthFormat = 'd';

export const formatDate = (
  dateOrString?: Date | string,
  formatString: string = standarDateTimeFormat
) => {
  if (!dateOrString) return '';

  const date = typeof dateOrString === 'string' ? new Date(dateOrString) : dateOrString;

  return format(date, formatString);
};
