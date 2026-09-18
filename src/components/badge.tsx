import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'gray' | 'slate';
}

const variants: Record<'green' | 'red' | 'amber' | 'blue' | 'purple' | 'gray' | 'slate', string> = {
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  gray: 'bg-gray-50 text-gray-600 border-gray-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function Badge({ children, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function statusBadge(status: string) {
  const map: Record<string, 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'gray' | 'slate'> = {
    Active: 'green', Inactive: 'gray', 'On Leave': 'amber',
    'In Progress': 'blue', Planning: 'purple', Completed: 'green',
    'On Hold': 'amber', Cancelled: 'red',
    Present: 'green', Absent: 'red', Late: 'amber', 'Half Day': 'purple', Leave: 'slate',
    Pending: 'amber', Approved: 'green', Rejected: 'red',
    Income: 'green', Expense: 'red',
    High: 'red', Medium: 'amber', Low: 'blue',
    'To Do': 'slate', Review: 'purple',
  };
  return <Badge variant={map[status] || 'gray'}>{status}</Badge>;
}
