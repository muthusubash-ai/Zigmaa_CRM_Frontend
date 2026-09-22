import { apiRequest } from '@/lib/api';

export interface EmployeeRecord {
  employee_id: number;
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joining: string;
  salary: string | number | null;
  role: string;
  status: string;
}

export interface EmployeeInput {
  name: string;
  email: string;
  phone?: string;
  department: string;
  designation?: string;
  joining?: string;
  salary?: string;
  role?: string;
  password?: string;
}

export function listEmployees() {
  return apiRequest<{ employees: EmployeeRecord[] }>('/employees/');
}

export function createEmployee(input: EmployeeInput) {
  return apiRequest<EmployeeRecord>('/employees/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getEmployee(employeeId: number) {
  return apiRequest<EmployeeRecord>(`/employees/${employeeId}/`);
}

export function updateEmployee(employeeId: number, input: Partial<EmployeeInput>) {
  return apiRequest<EmployeeRecord>(`/employees/${employeeId}/`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteEmployee(employeeId: number) {
  return apiRequest<null>(`/employees/${employeeId}/`, { method: 'DELETE' });
}
