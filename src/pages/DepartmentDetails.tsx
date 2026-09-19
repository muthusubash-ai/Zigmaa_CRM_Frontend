import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle2, FolderKanban, AlertTriangle, UserCheck } from 'lucide-react';
import { departments, employees, projects, tasks, attendanceRecords } from '@/data/mockData';
import { statusBadge } from '@/components/ui/badge';

const iconColorMap: Record<string, string> = {
  Film: 'bg-rose-50 text-rose-600',
  TrendingUp: 'bg-violet-50 text-violet-600',
  Code2: 'bg-red-50 text-[#ED0016]',
  Users: 'bg-amber-50 text-amber-600',
  Wallet: 'bg-emerald-50 text-emerald-600',
};

export default function DepartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dept = departments.find(d => d.id === id);

  if (!dept) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Department not found.</p>
      <button onClick={() => navigate('/departments')} className="mt-4 text-[#ED0016] hover:underline text-sm">Back to Departments</button>
    </div>
  );

  // Pull related data by matching dept name to employee.department
  const deptEmployees = employees.filter(e => e.department.toLowerCase().includes(dept.name.split(' ')[0].toLowerCase()));
  const deptProjects = projects.filter(p => p.team.some(tid => deptEmployees.find(e => e.id === tid)));
  const deptTasks = tasks.filter(t => deptEmployees.find(e => e.id === t.assignee));
  const deptAttendance = attendanceRecords.filter(a => deptEmployees.find(e => e.id === a.employee));

  const summaryCards = [
    { label: 'Total Employees', value: dept.employees, icon: Users, color: 'bg-red-50 text-[#ED0016]' },
    { label: "Today's Attendance", value: `${dept.present}/${dept.employees}`, icon: UserCheck, color: 'bg-green-50 text-green-600' },
    { label: 'Active Tasks', value: dept.tasks - dept.completedTasks, icon: CheckCircle2, color: 'bg-purple-50 text-purple-600' },
    { label: 'Active Projects', value: dept.projects, icon: FolderKanban, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Completed Tasks', value: dept.completedTasks, icon: CheckCircle2, color: 'bg-teal-50 text-teal-600' },
    { label: 'Overdue Tasks', value: dept.overdueTasks, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <button onClick={() => navigate('/departments')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} /> Back to Departments
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconColorMap[dept.icon] || 'bg-red-50 text-[#ED0016]'}`}>
            <FolderKanban size={26} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{dept.name} Department</h2>
            <p className="text-slate-500 text-sm mt-0.5">{dept.description}</p>
            <p className="text-xs text-slate-400 mt-1">Department Head: <span className="font-medium text-slate-700">{dept.head}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${dept.progress >= 75 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {dept.progress}% overall progress
            </span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2 ${c.color}`}>
                <Icon size={17} />
              </div>
              <p className="text-lg font-bold text-slate-900">{c.value}</p>
              <p className="text-xs text-slate-400 leading-tight">{c.label}</p>
            </div>
          );
        })}
      </div>

      {/* Employee Performance */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Employee Performance</h3>
          <button onClick={() => navigate('/employees')} className="text-xs text-[#ED0016] hover:underline">View all employees</button>
        </div>
        {deptEmployees.length === 0 ? (
          <p className="text-center py-10 text-sm text-slate-400">No employees found in this department.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Employee', 'Role', 'Attendance', 'Tasks', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {deptEmployees.map(emp => {
                  const att = deptAttendance.find(a => a.employee === emp.id);
                  const empTasks = deptTasks.filter(t => t.assignee === emp.id);
                  const done = empTasks.filter(t => t.status === 'Completed').length;
                  return (
                    <tr key={emp.id} onClick={() => navigate(`/employees/${emp.id}`)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{emp.name[0]}</div>
                          <div>
                            <p className="font-medium text-slate-900">{emp.name}</p>
                            <p className="text-xs text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{emp.designation}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${att?.status === 'Present' ? 'bg-green-50 text-green-700' : att?.status === 'Absent' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          {att?.status || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600">{done}/{empTasks.length}</span>
                          {empTasks.length > 0 && (
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full">
                              <div className="h-1.5 bg-red-500 rounded-full" style={{ width: `${Math.round((done / empTasks.length) * 100)}%` }} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">{statusBadge(emp.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Projects */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Projects</h3>
          <button onClick={() => navigate('/projects')} className="text-xs text-[#ED0016] hover:underline">View all</button>
        </div>
        {deptProjects.length === 0 ? (
          <p className="text-center py-10 text-sm text-slate-400">No projects found for this department.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {deptProjects.map(p => (
              <div key={p.id} onClick={() => navigate(`/projects/${p.id}`)} className="px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-slate-900 truncate">{p.name}</p>
                      {statusBadge(p.status)}
                    </div>
                    <p className="text-xs text-slate-400">PM: {p.manager} · Due: {p.deadline}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full">
                      <div className="h-1.5 bg-red-500 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-700 w-8 text-right">{p.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Tasks</h3>
          <button onClick={() => navigate('/tasks')} className="text-xs text-[#ED0016] hover:underline">View all</button>
        </div>
        {deptTasks.length === 0 ? (
          <p className="text-center py-10 text-sm text-slate-400">No tasks found for this department.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Task', 'Assigned To', 'Priority', 'Due Date', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {deptTasks.slice(0, 8).map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-[200px] truncate">{t.name}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{t.assigneeName}</td>
                    <td className="px-4 py-3">{statusBadge(t.priority)}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {t.due}
                    </td>
                    <td className="px-4 py-3">{statusBadge(t.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
