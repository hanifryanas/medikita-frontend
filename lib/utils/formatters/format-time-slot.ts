/**
 * Drops seconds from a 'HH:mm:ss' time string, returning 'HH:mm'.
 * No-op if the input is shorter than 5 chars.
 */
export const formatTimeSlot = (timeSlot: string): string => timeSlot.slice(0, 5);
