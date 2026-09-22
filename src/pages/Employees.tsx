import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, Users, ChevronDown } from 'lucide-react';
import { attendanceRecords, tasks, projects } from '@/data/mockData';
import { statusBadge } from '@/components/ui/badge';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { PasswordField } from '@/components/password-field';
import { createEmployee, deleteEmployee, listEmployees, updateEmployee, type EmployeeRecord } from '@/lib/employees';

const deptList = ['All', 'Development', 'Design', 'HR', 'Marketing', 'Finance', 'Video Editing', 'Digital Marketing'];
const statusList = ['All', 'Active', 'Inactive', 'On Leave'];
const roleList = [
  { value: 'employee', label: 'Employee' },
  { value: 'hr_manager', label: 'HR' },
];
const typeList = ['Full-time', 'Part-time', 'Contract', 'Intern'];

const initForm = {
  name: '', email: '', phone: '', department: 'Development',
  designation: '', joining: '', type: 'Full-time', salary: '',
  role: 'employee', password: '',
};

const inputCls = "w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-red-500";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  );
}

// Derive current project per employee from tasks
function getCurrentProject(empId: string): string {
  const activeTasks = tasks.filter(t => t.assignee === empId && (t.status === 'In Progress' || t.status === 'Review'));
  if (!activeTasks.length) return '—';
  const proj = projects.find(p => p.id === activeTasks[0].project);
  return proj ? proj.name : '—';
}

// Derive work progress from tasks
function getWorkProgress(empId: string): number {
  const empTasks = tasks.filter(t => t.assignee === empId);
  if (!empTasks.length) return 0;
  const completed = empTasks.filter(t => t.status === 'Completed').length;
  return Math.round((completed / empTasks.length) * 100);
}

// Get today's attendance status
function getAttendanceStatus(empId: string): string {
  const rec = attendanceRecords.find(r => r.employee === empId);
  return rec?.status || '—';
}

const attendanceBadge = (status: string) => {
  const map: Record<string, string> = {
    Present: 'bg-green-50 text-green-700',
    Late: 'bg-amber-50 text-amber-700',
    Absent: 'bg-red-50 text-red-600',
    Leave: 'bg-purple-50 text-purple-700',
    'Half Day': 'bg-orange-50 text-orange-700',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${map[status] || 'bg-slate-50 text-slate-500'}`}>
      {status}
    </span>
  );
};

export default function Employees() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [status, setStatus] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(initForm);
  const [modalTab, setModalTab] = useState<'personal' | 'work' | 'account'>('personal');

  useEffect(() => {
    let mounted = true;
    listEmployees()
      .then(response => { if (mounted) setEmployees(response.employees); })
      .catch(error => {
        if (mounted) toast(error instanceof Error ? error.message : 'Employees could not be loaded.', 'error');
      })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, [toast]);

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    return (
      (e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.designation.toLowerCase().includes(q)) &&
      (dept === 'All' || e.department === dept) &&
      (status === 'All' || e.status === status)
    );
  });

  const handleAdd = async () => {
    if (!form.name || !form.email) { toast('Name and email are required.', 'error'); return; }
    if (!editingId && !form.password) { toast('Temporary password is required.', 'error'); setModalTab('account'); return; }
    try {
      const input = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        department: form.department,
        designation: form.designation,
        joining: form.joining || undefined,
        salary: form.salary || undefined,
        role: form.role,
        password: form.password,
      };
      if (editingId) {
        const updatedEmployee = await updateEmployee(editingId, input);
        setEmployees(prev => prev.map(employee => employee.employee_id === editingId ? updatedEmployee : employee));
      } else {
        const newEmployee = await createEmployee(input);
        setEmployees(prev => [...prev, newEmployee]);
      }
      setForm(initForm);
      setModalTab('personal');
      setEditingId(null);
      setAddOpen(false);
      toast(editingId ? 'Employee updated and saved to database.' : 'Employee added and saved to database.');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Employee could not be created.', 'error');
    }
  };

  const handleEdit = (employee: EmployeeRecord) => {
    setEditingId(employee.employee_id);
    setForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
      joining: employee.joining,
      type: 'Full-time',
      salary: employee.salary == null ? '' : String(employee.salary),
      role: employee.role.toLowerCase() === 'hr' ? 'hr_manager' : 'employee',
      password: '',
    });
    setModalTab('personal');
    setAddOpen(true);
  };

  const handleDelete = async (employeeId: number) => {
    try {
      await deleteEmployee(employeeId);
      setEmployees(prev => prev.map(employee => employee.employee_id === employeeId ? { ...employee, status: 'Inactive' } : employee));
      setDeleteId(null);
      toast('Employee deactivated and saved to database.', 'warning');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Employee could not be removed.', 'error');
    }
  };

  // Summary counts
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const presentToday = attendanceRecords.filter(r => r.status === 'Present').length;

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: employees.length, color: 'text-slate-900' },
          { label: 'Active', value: activeCount, color: 'text-green-600' },
          { label: 'On Leave', value: onLeaveCount, color: 'text-amber-600' },
          { label: 'Present Today', value: presentToday, color: 'text-[#ED0016]' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3.5">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-52">
          <Search size={15} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, designation..." className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400" />
        </div>
        <div className="relative">
          <select value={dept} onChange={e => setDept(e.target.value)} className="h-10 pl-3 pr-8 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none appearance-none cursor-pointer">
            {deptList.map(d => <option key={d}>{d}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={status} onChange={e => setStatus(e.target.value)} className="h-10 pl-3 pr-8 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none appearance-none cursor-pointer">
            {statusList.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 h-10 bg-[#ED0016] hover:bg-[#B80012] text-white text-sm font-medium rounded-xl transition-colors ml-auto">
          <Plus size={15} /> Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">Loading employees...</div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No employees found"
              description="Add your first employee or adjust your filters."
              action={{ label: '+ Add Employee', onClick: () => setAddOpen(true) }}
            />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Employee', 'ID', 'Department', 'Designation', 'Attendance', 'Current Project', 'Progress', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(emp => {
                  const progress = getWorkProgress(emp.id);
                  const currentProject = getCurrentProject(emp.id);
                  const attendance = getAttendanceStatus(emp.id);
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {emp.name[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 whitespace-nowrap">{emp.name}</p>
                            <p className="text-xs text-slate-400 truncate max-w-32">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono text-slate-500">{emp.id}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">{emp.department}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{emp.designation}</td>
                      <td className="px-4 py-3.5">{attendanceBadge(attendance)}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap max-w-36 truncate" title={currentProject}>{currentProject}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2 min-w-20">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                            <div
                              className={`h-1.5 rounded-full ${progress === 100 ? 'bg-green-500' : progress >= 60 ? 'bg-[#ED0016]' : 'bg-amber-500'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 flex-shrink-0">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">{statusBadge(emp.status)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => navigate(`/employees/${emp.employee_id}`)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-[#ED0016] transition-colors" title="View">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => handleEdit(emp)} className="p-1.5 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteId(emp.employee_id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Deactivate">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
            Showing {filtered.length} of {employees.length} employees
          </div>
        )}
      </div>

      {/* Add Employee Modal — tabbed */}
      <Modal open={addOpen} onClose={() => { setAddOpen(false); setModalTab('personal'); setEditingId(null); setForm(initForm); }} title={editingId ? 'Edit Employee' : 'Add New Employee'} size="lg">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 mb-5 -mt-1">
          {(['personal', 'work', 'account'] as const).map(t => (
            <button
              key={t}
              onClick={() => setModalTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${modalTab === t ? 'border-[#ED0016] text-[#ED0016]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {t === 'personal' ? 'Personal Details' : t === 'work' ? 'Work Details' : 'Account'}
            </button>
          ))}
        </div>

        {modalTab === 'personal' && (
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
            <Field label="Full Name *">
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Arun Kumar" className={inputCls} />
            </Field>
            <Field label="Email Address *">
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="arun@zigmaatech.com" className={inputCls} />
            </Field>
            <Field label="Phone Number">
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" className={inputCls} />
            </Field>
          </div>
        )}

        {modalTab === 'work' && (
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
            <Field label="Department">
              <div className="relative">
                <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className={selectCls}>
                  {deptList.filter(d => d !== 'All').map(d => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Field>
            <Field label="Designation">
              <input value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} placeholder="Frontend Developer" className={inputCls} />
            </Field>
            <Field label="Employment Type">
              <div className="relative">
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className={selectCls}>
                  {typeList.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Field>
            <Field label="Joining Date">
              <input type="date" value={form.joining} onChange={e => setForm(p => ({ ...p, joining: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Salary (₹)">
              <input type="number" value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} placeholder="75000" className={inputCls} />
            </Field>
          </div>
        )}

        {modalTab === 'account' && (
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
            <Field label="System Role">
              <div className="relative">
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className={selectCls}>
                  {roleList.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Field>
            <Field label="Password">
              <PasswordField value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Temporary password" className={inputCls} />
            </Field>
            <div className="sm:col-span-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-700 font-medium">Temporary password database-la securely hash aagi save aagum. Employee-kku credentials separately share pannunga.</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {modalTab !== 'personal' && (
            <button onClick={() => setModalTab(modalTab === 'account' ? 'work' : 'personal')} className="px-5 h-11 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Back</button>
          )}
          <button onClick={() => { setAddOpen(false); setEditingId(null); setForm(initForm); }} className="flex-1 h-11 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
          {modalTab !== 'account' ? (
            <button onClick={() => setModalTab(modalTab === 'personal' ? 'work' : 'account')} className="flex-1 h-11 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">Continue</button>
          ) : (
            <button onClick={handleAdd} className="flex-1 h-11 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">{editingId ? 'Update Employee' : 'Add Employee'}</button>
          )}
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
      />
    </div>
  );
}
