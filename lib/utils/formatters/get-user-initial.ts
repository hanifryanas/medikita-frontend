export const getUserInitial = (firstName?: string, lastName?: string, fallback = ''): string => {
  const firstInitial = firstName?.charAt(0).toUpperCase() ?? '';
  const lastInitial = lastName?.charAt(0).toUpperCase() ?? '';
  return `${firstInitial}${lastInitial}` || fallback;
};
