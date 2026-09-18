import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, DollarSign } from 'lucide-react';
import { employees, tasks, projects } from '@/data/mockData';
import { statusBadge } from '@/components/ui/badge';

const tabs = ['Overview', 'Projects', 'Tasks', 'Attendance', 'Leave', 'Documents', 'Finance'];

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const emp = employees.find(e => e.id === id);

  if (!emp) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Employee not found.</p>
      <button onClick={() => navigate('/employees')} className="mt-4 text-[#ED0016] hover:underline text-sm">Back to Employees</button>
    </div>
  );

  const empTasks = tasks.filter(t => t.assignee === id);
  const empProjects = projects.filter(p => p.team.includes(id || ''));

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/employees')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} /> Back to Employees
      </button>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-[#ED0016] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {emp.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{emp.name}</h2>
              {statusBadge(emp.status)}
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{emp.designation} · {emp.department}</p>
            <p className="text-slate-400 text-xs mt-0.5 font-mono">{emp.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          {[
            { icon: Mail, label: 'Email', value: emp.email },
            { icon: Phone, label: 'Phone', value: emp.phone },
            { icon: Calendar, label: 'Joining Date', value: emp.joining },
            { icon: DollarSign, label: 'Salary', value: `₹${emp.salary.toLocaleString()}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5"><Icon size={12} />{label}</p>
              <p className="text-sm font-medium text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 px-4 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t} className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${t === 'Overview' ? 'border-[#ED0016] text-[#ED0016]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Projects */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Projects ({empProjects.length})</h3>
              {empProjects.length === 0 ? (
                <p className="text-sm text-slate-400">No projects assigned.</p>
              ) : (
                <div className="space-y-2">
                  {empProjects.map(p => (
                    <div key={p.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-medium text-slate-900">{p.name}</p>
                        {statusBadge(p.status)}
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full">
                        <div className="h-1.5 bg-red-500 rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Tasks */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Tasks ({empTasks.length})</h3>
              {empTasks.length === 0 ? (
                <p className="text-sm text-slate-400">No tasks assigned.</p>
              ) : (
                <div className="space-y-2">
                  {empTasks.map(t => (
                    <div key={t.id} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Due: {t.due}</p>
                      </div>
                      {statusBadge(t.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
