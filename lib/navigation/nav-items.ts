import type { AccountUser } from '@/lib/types/users';

export interface NavItem {
  label: string;
  href: string;
}

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Our Specialties', href: '/specialties' },
  { label: 'Care Teams', href: '/care-teams' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

const USER_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Patients', href: '/patients' },
  { label: 'Appointments', href: '/appointments' },
];

const DOCTOR_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'My Patients', href: '/patients' },
  { label: 'Appointments', href: '/appointments' },
  { label: 'Schedule', href: '/schedule' },
];

const NURSE_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Patients', href: '/patients' },
  { label: 'Appointments', href: '/appointments' },
];

const STAFF_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Patients', href: '/patients' },
  { label: 'Appointments', href: '/appointments' },
  { label: 'Employees', href: '/employees' },
];

export const getAccountNavItems = (user: AccountUser): NavItem[] => {
  if (!user.isEmployee || !user.employee) return USER_NAV_ITEMS;
  if (user.employee.doctor) return DOCTOR_NAV_ITEMS;
  if (user.employee.nurse) return NURSE_NAV_ITEMS;
  return STAFF_NAV_ITEMS;
};

export const getAccountRoleLabel = (user: AccountUser): string | null => {
  if (!user.isEmployee || !user.employee) return null;
  if (user.employee.doctor) return 'Doctor';
  if (user.employee.nurse) return 'Nurse';
  return 'Staff';
};
