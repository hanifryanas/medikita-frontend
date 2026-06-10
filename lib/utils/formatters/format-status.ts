import { Status } from '@/lib/types/common';

export const STATUS_LABEL: Record<Status, string> = {
  [Status.Incompleted]: 'Upcoming',
  [Status.Completed]: 'Completed',
  [Status.Cancelled]: 'Cancelled',
};

export const formatStatus = (status: Status): string => STATUS_LABEL[status];
