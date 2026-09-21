export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joining: string;
  salary: number;
  status: string;
  role: string;
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  description: string;
  head: string;
  employees: number;
  present: number;
  tasks: number;
  completedTasks: number;
  projects: number;
  overdueTasks: number;
  progress: number;
  status: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  department: string;
  type: string;
  status: string;
  projects: number;
  revenue: number;
  paymentStatus: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  client: string;
  description: string;
  manager: string;
  team: string[];
  start: string;
  deadline: string;
  budget: number;
  spent: number;
  progress: number;
  priority: string;
  status: string;
  category: string;
}

export interface TaskItem {
  id: string;
  name: string;
  project: string;
  projectName: string;
  assignee: string;
  assigneeName: string;
  priority: string;
  status: string;
  due: string;
  start?: string;
  hours?: number;
  progress: number;
  description?: string;
}

export interface AttendanceRecord {
  id: string;
  employee: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  status: string;
}

export interface LeaveRequest {
  id: string;
  employee: string;
  employeeName: string;
  type: string;
  start: string;
  end: string;
  days: number;
  reason: string;
  applied: string;
  status: string;
}

export interface Transaction {
  id: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface Invoice {
  id: string;
  client: string;
  project: string;
  department: string;
  amount: number;
  tax: number;
  total: number;
  paymentDate: string;
  method: string;
  status: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: string;
  type: string;
  size: string;
  access: string;
  date: string;
  uploadedBy: string;
}

export interface AuditLogItem {
  id: string;
  user: string;
  action: string;
  module: string;
  description: string;
  date: string;
  time: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
}

export interface CrmRole {
  id: string;
  name: string;
  users: number;
  description: string;
  status: string;
  permissions: Record<string, string[]>;
}

export interface CrmUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  role: string;
  status: string;
  manager: string;
  lastLogin: string;
  created: string;
  loginHistory: Array<{
    datetime: string;
    ip: string;
    device: string;
    browser: string;
    location: string;
    status: string;
  }>;
}

export const employees: Employee[] = [
  { id: 'EMP001', name: 'Arun Kumar', email: 'arun@zigmaatech.com', phone: '+91 98765 43210', department: 'Development', designation: 'Senior Web Developer', joining: '2023-01-15', salary: 85000, status: 'Active', role: 'employee' },
  { id: 'EMP002', name: 'Priya Sharma', email: 'priya@zigmaatech.com', phone: '+91 98765 43211', department: 'Design', designation: 'UI/UX Designer', joining: '2023-03-10', salary: 70000, status: 'Active', role: 'employee' },
  { id: 'EMP003', name: 'Karthik Raja', email: 'karthik@zigmaatech.com', phone: '+91 98765 43212', department: 'Digital Marketing', designation: 'Marketing Lead', joining: '2022-11-01', salary: 75000, status: 'Active', role: 'Employee' },
  { id: 'EMP004', name: 'Meena Ramesh', email: 'meena@zigmaatech.com', phone: '+91 98765 43213', department: 'HR', designation: 'HR Manager', joining: '2022-05-15', salary: 80000, status: 'Active', role: 'HR' },
  { id: 'EMP005', name: 'Sanjay Dutt', email: 'sanjay@zigmaatech.com', phone: '+91 98765 43214', department: 'Video Editing', designation: 'Senior Video Editor', joining: '2023-06-20', salary: 65000, status: 'Active', role: 'employee' },
  { id: 'EMP006', name: 'Deepa M', email: 'deepa@zigmaatech.com', phone: '+91 98765 43215', department: 'Development', designation: 'Backend Engineer', joining: '2023-08-01', salary: 72000, status: 'On Leave', role: 'employee' },
];

export const departments: Department[] = [
  { id: 'DEP001', name: 'Development', icon: 'Code2', description: 'Web, Mobile and Custom Software Solutions.', head: 'Arun Kumar', employees: 12, present: 10, tasks: 24, completedTasks: 18, projects: 6, overdueTasks: 1, progress: 85, status: 'Active' },
  { id: 'DEP002', name: 'Digital Marketing', icon: 'TrendingUp', description: 'SEO, Social Media & Paid Ad Campaigns.', head: 'Karthik Raja', employees: 8, present: 7, tasks: 16, completedTasks: 12, projects: 4, overdueTasks: 0, progress: 78, status: 'Active' },
  { id: 'DEP003', name: 'Video Editing', icon: 'Film', description: 'High Quality Motion Graphics & Video Editing.', head: 'Sanjay Dutt', employees: 6, present: 5, tasks: 12, completedTasks: 9, projects: 3, overdueTasks: 1, progress: 70, status: 'Active' },
  { id: 'DEP004', name: 'HR & Operations', icon: 'Users', description: 'Employee Lifecycle, Talent Acquisition & Payroll.', head: 'Meena Ramesh', employees: 4, present: 4, tasks: 8, completedTasks: 7, projects: 2, overdueTasks: 0, progress: 92, status: 'Active' },
  { id: 'DEP005', name: 'Finance', icon: 'Wallet', description: 'Invoicing, Billing, Expenses & Auditing.', head: 'Zigmaa Admin', employees: 3, present: 3, tasks: 6, completedTasks: 6, projects: 1, overdueTasks: 0, progress: 95, status: 'Active' },
];

export const clients: Client[] = [
  { id: 'CLT001', name: 'Rajesh Kumar', company: 'ABC Technologies', contact: '+91 98765 11001', email: 'rajesh@abctech.com', department: 'Development', type: 'Standard', status: 'Active', projects: 2, revenue: 450000, paymentStatus: 'Paid' },
  { id: 'CLT002', name: 'Sujata Nair', company: 'Global Solutions', contact: '+91 98765 11002', email: 'sujata@globalsol.com', department: 'Digital Marketing', type: 'On-Date', status: 'Active', projects: 1, revenue: 180000, paymentStatus: 'Pending' },
  { id: 'CLT003', name: 'Vikram Sethi', company: 'Creative Media', contact: '+91 98765 11003', email: 'vikram@creativemedia.io', department: 'Video Editing', type: 'Standard', status: 'Active', projects: 1, revenue: 250000, paymentStatus: 'Partially Paid' },
];

export const projects: Project[] = [
  { id: 'PRJ001', name: 'E-Commerce Platform', code: 'EC-2024', client: 'ABC Technologies', description: 'Full stack React & Django online store', manager: 'Arun Kumar', team: ['EMP001', 'EMP002', 'EMP006'], start: '2024-01-10', deadline: '2024-06-30', budget: 500000, spent: 320000, progress: 75, priority: 'High', status: 'In Progress', category: 'Web Development' },
  { id: 'PRJ002', name: 'Brand Marketing Campaign', code: 'MK-2024', client: 'Global Solutions', description: 'Q2 Performance Marketing & SEO strategy', manager: 'Karthik Raja', team: ['EMP003'], start: '2024-03-01', deadline: '2024-07-15', budget: 200000, spent: 120000, progress: 60, priority: 'Medium', status: 'In Progress', category: 'Digital Marketing' },
  { id: 'PRJ003', name: 'Corporate Video Series', code: 'VD-2024', client: 'Creative Media', description: '5 promotional video edits and 3D motion graphics', manager: 'Sanjay Dutt', team: ['EMP005'], start: '2024-04-01', deadline: '2024-05-30', budget: 250000, spent: 250000, progress: 100, priority: 'High', status: 'Completed', category: 'Video Editing' },
];

export const tasks: TaskItem[] = [
  { id: 'TSK001', name: 'Design Cart & Checkout Flow', project: 'PRJ001', projectName: 'E-Commerce Platform', assignee: 'EMP002', assigneeName: 'Priya Sharma', priority: 'High', status: 'Completed', due: '2024-05-10', progress: 100, description: 'Wireframe and Figma UI design' },
  { id: 'TSK002', name: 'Integrate Payment Gateway', project: 'PRJ001', projectName: 'E-Commerce Platform', assignee: 'EMP001', assigneeName: 'Arun Kumar', priority: 'High', status: 'In Progress', due: '2024-05-25', progress: 60, description: 'Razorpay API backend endpoints' },
  { id: 'TSK003', name: 'SEO Audit & Keyword Plan', project: 'PRJ002', projectName: 'Brand Marketing Campaign', assignee: 'EMP003', assigneeName: 'Karthik Raja', priority: 'Medium', status: 'In Progress', due: '2024-05-20', progress: 50, description: 'On-page and off-page keyword analysis' },
  { id: 'TSK004', name: 'Teaser Video Editing', project: 'PRJ003', projectName: 'Corporate Video Series', assignee: 'EMP005', assigneeName: 'Sanjay Dutt', priority: 'Low', status: 'Completed', due: '2024-05-15', progress: 100, description: 'Cut 30s promo teaser' },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: 'ATT001', employee: 'EMP001', employeeName: 'Arun Kumar', date: '2026-09-18', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: '9h 15m', status: 'Present' },
  { id: 'ATT002', employee: 'EMP002', employeeName: 'Priya Sharma', date: '2026-09-18', checkIn: '09:30 AM', checkOut: '06:00 PM', hours: '8h 30m', status: 'Present' },
  { id: 'ATT003', employee: 'EMP003', employeeName: 'Karthik Raja', date: '2026-09-18', checkIn: '09:45 AM', checkOut: '06:45 PM', hours: '9h 00m', status: 'Late' },
  { id: 'ATT004', employee: 'EMP004', employeeName: 'Meena Ramesh', date: '2026-09-18', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'Present' },
  { id: 'ATT005', employee: 'EMP005', employeeName: 'Sanjay Dutt', date: '2026-09-18', checkIn: '09:10 AM', checkOut: '06:15 PM', hours: '9h 05m', status: 'Present' },
  { id: 'ATT006', employee: 'EMP006', employeeName: 'Deepa M', date: '2026-09-18', checkIn: '—', checkOut: '—', hours: '0h', status: 'Absent' },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 'LVE001', employee: 'EMP006', employeeName: 'Deepa M', type: 'Sick Leave', start: '2026-09-18', end: '2026-09-19', days: 2, reason: 'Viral fever rest recommended by doctor', applied: '2026-09-17', status: 'Approved' },
  { id: 'LVE002', employee: 'EMP002', employeeName: 'Priya Sharma', type: 'Casual Leave', start: '2026-09-25', end: '2026-09-26', days: 2, reason: 'Family function attendance', applied: '2026-09-16', status: 'Pending' },
];

export const transactions: Transaction[] = [
  { id: 'TXN001', type: 'Income', category: 'Project Payment', amount: 250000, date: '2026-09-15', description: 'Milestone 2 payment from ABC Tech' },
  { id: 'TXN002', type: 'Expense', category: 'Salary', amount: 370000, date: '2026-09-01', description: 'August Monthly Payroll disbursement' },
  { id: 'TXN003', type: 'Expense', category: 'Software Tools', amount: 25000, date: '2026-09-05', description: 'Adobe Creative Cloud & Figma renewals' },
];

export const invoices: Invoice[] = [
  { id: 'INV001', client: 'ABC Technologies', project: 'E-Commerce Platform', department: 'Development', amount: 250000, tax: 45000, total: 295000, paymentDate: '2026-09-15', method: 'Bank Transfer', status: 'Paid' },
  { id: 'INV002', client: 'Global Solutions', project: 'Brand Marketing Campaign', department: 'Digital Marketing', amount: 100000, tax: 18000, total: 118000, paymentDate: '2026-09-28', method: 'Bank Transfer', status: 'Pending' },
  { id: 'INV003', client: 'Creative Media', project: 'Corporate Video Series', department: 'Video Editing', amount: 200000, tax: 36000, total: 236000, paymentDate: '2026-09-10', method: 'UPI', status: 'Partially Paid' },
];

export const documents: DocumentItem[] = [
  { id: 'DOC001', name: 'Zigmaa_Employee_Handbook_2026.pdf', category: 'Company Documents', type: 'PDF', size: '2.4 MB', access: 'All Employees', date: '2026-01-05', uploadedBy: 'Meena Ramesh' },
  { id: 'DOC002', name: 'ABC_Tech_Contract_Agreement.docx', category: 'Contracts', type: 'DOCX', size: '1.1 MB', access: 'Admins & PMs', date: '2026-01-10', uploadedBy: 'Zigmaa Admin' },
  { id: 'DOC003', name: 'Q2_Revenue_Analysis_Report.xlsx', category: 'Reports', type: 'XLSX', size: '850 KB', access: 'Finance Team', date: '2026-07-01', uploadedBy: 'Zigmaa Admin' },
];

export const auditLogs: AuditLogItem[] = [
  { id: 'LOG001', user: 'Zigmaa Super Admin', action: 'Created', module: 'User Management', description: 'Created user Vikram Nair (USR009)', date: '2026-09-15', time: '11:00 AM' },
  { id: 'LOG002', user: 'Zigmaa Super Admin', action: 'Updated', module: 'Roles & Permissions', description: 'Granted Export permission for Reports to Sales Manager role', date: '2026-09-14', time: '03:15 PM' },
  { id: 'LOG003', user: 'Meena Ramesh', action: 'Approved', module: 'Leave', description: 'Approved leave request LVE001 for Deepa M', date: '2026-09-17', time: '09:30 AM' },
];

export const notifications: NotificationItem[] = [
  { id: 'NTF001', title: 'New Leave Request', message: 'Priya Sharma applied for 2 days Casual Leave.', time: '10 min ago', type: 'leave', read: false },
  { id: 'NTF002', title: 'Task Milestone Achieved', message: 'Design Cart & Checkout Flow marked as Completed.', time: '1 hour ago', type: 'task', read: false },
  { id: 'NTF003', title: 'Invoice Payment Received', message: '₹2,95,000 received for INV001 (ABC Technologies).', time: '2 hours ago', type: 'finance', read: true },
];

export const crmRoles: CrmRole[] = [
  {
    id: 'ROL001',
    name: 'Super Admin',
    users: 1,
    description: 'Full system control with unrestricted access to all modules and configurations.',
    status: 'Active',
    permissions: {
      Dashboard: ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'],
      Employees: ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'],
      Projects: ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'],
      Tasks: ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'],
      Attendance: ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'],
      Leave: ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'],
      Finance: ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'],
      Documents: ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'],
      'User Management': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'],
      'Roles & Permissions': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'],
      'Audit Log': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'],
      Settings: ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'],
    },
  },
  {
    id: 'ROL002',
    name: 'Employee',
    users: 2,
    description: 'Administrative access to manage users, projects, and organization data.',
    status: 'Active',
    permissions: {
      Dashboard: ['View', 'Export'],
      Employees: ['View', 'Create', 'Edit'],
      Projects: ['View', 'Create', 'Edit'],
      Tasks: ['View', 'Create', 'Edit'],
      Attendance: ['View'],
      Leave: ['View', 'Manage'],
      Finance: ['View'],
      Documents: ['View', 'Create', 'Edit'],
      'User Management': ['View', 'Create', 'Edit'],
      'Roles & Permissions': ['View'],
      'Audit Log': ['View'],
      Settings: ['View'],
    },
  },
  {
    id: 'ROL003',
    name: 'HR Manager',
    users: 1,
    description: 'Manages employee records, attendance, leave approvals, and HR onboarding.',
    status: 'Active',
    permissions: {
      Dashboard: ['View'],
      Employees: ['View', 'Create', 'Edit'],
      Attendance: ['View', 'Create', 'Edit', 'Manage'],
      Leave: ['View', 'Create', 'Edit', 'Manage'],
      Documents: ['View', 'Create'],
      'User Management': ['View'],
    },
  },
];

export const crmUsers: CrmUser[] = [
  {
    id: 'USR001',
    name: 'Zigmaa Super Admin',
    email: 'admin@zigmaatech.com',
    phone: '+91 98765 00001',
    department: 'Administration',
    jobTitle: 'Super Admin',
    role: 'Super Admin',
    status: 'Active',
    manager: '—',
    lastLogin: 'Today, 10:45 AM',
    created: '2024-01-01',
    loginHistory: [
      { datetime: '2026-09-18 10:45 AM', ip: '192.168.1.10', device: 'MacBook Pro', browser: 'Chrome 122', location: 'Chennai, TN', status: 'Successful' },
    ],
  },
  {
    id: 'USR002',
    name: 'Arun Kumar',
    email: 'arun@zigmaatech.com',
    phone: '+91 98765 43210',
    department: 'Development',
    jobTitle: 'Senior Web Developer',
    role: 'Employee',
    status: 'Active',
    manager: 'Zigmaa Super Admin',
    lastLogin: 'Yesterday, 06:15 PM',
    created: '2023-01-15',
    loginHistory: [
      { datetime: '2026-09-17 06:15 PM', ip: '192.168.1.15', device: 'Windows PC', browser: 'Chrome 122', location: 'Chennai, TN', status: 'Successful' },
    ],
  },
];
