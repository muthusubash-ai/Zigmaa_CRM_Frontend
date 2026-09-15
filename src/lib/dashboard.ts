import { apiRequest } from "@/lib/api";

export interface DashboardMetrics {
  today_tasks: number;
  completed_tasks: number;
  today_revenue: string;
  active_projects: number;
  total_employees: number;
  pending_leaves: number;
  overdue_tasks: number;
}

export interface DashboardTask {
  id: number;
  title: string;
  status: string;
  priority: string;
  due_date: string;
  assignee: string;
  project: string | null;
}

export interface SuperAdminDashboardData {
  date: string;
  metrics: DashboardMetrics;
  recent_tasks: DashboardTask[];
}

export function getSuperAdminDashboard() {
  return apiRequest<SuperAdminDashboardData>("/dashboard/super-admin/");
}
