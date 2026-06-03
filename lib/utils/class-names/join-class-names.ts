export type ClassValue = string | false | null | undefined;

export const joinClassNames = (...values: ClassValue[]): string => values.filter(Boolean).join(' ');
