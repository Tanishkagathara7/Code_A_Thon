import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | Date): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return String(dateString);
  }
}

export function getStatusBadgeStyle(status?: string): { bg: string; text: string; label: string } {
  switch (status?.toLowerCase()) {
    case 'completed':
      return { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Completed' };
    case 'in_progress':
      return { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', label: 'In Progress' };
    case 'pending':
    default:
      return { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Pending' };
  }
}
