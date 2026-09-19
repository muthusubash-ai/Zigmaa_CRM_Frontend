import type { ElementType, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Clock, FolderKanban, IndianRupee, CheckCircle2, AlertTriangle,
  TrendingUp, Film, Code2, ArrowUpRight, Calendar, ArrowRight, FileText,
  UserPlus, Briefcase,
} from 'lucide-react';
import { employees, projects, tasks, attendanceRecords, transactions, departments, auditLogs } from '@/data/mockData';
import { statusBadge } from '@/components/ui/badge';
import type { AuthUser } from '@/lib/auth';

interface SuperAdminDashboardProps {
  user: AuthUser;
  isSigningOut?: boolean;
  onLogout?: () => Promise<void>;
}

const deptIconMap: Record<string, ElementType> = { Film, TrendingUp, Code2, Users };
const activityColors: Record<string, string> = {
  Employee: 'bg-blue-50 text-blue-600',
  Project: 'bg-purple-50 text-purple-600',
  Task: 'bg-amber-50 text-amber-600',
  Leave: 'bg-green-50 text-green-600',
  Settings: 'bg-slate-100 text-slate-600',
};
const panel = 'rounded-xl border border-[#E5E7EB] bg-white shadow-sm';

function Progress({ value, color = 'bg-[#ED0016]' }: { value: number; color?: string }) {
  return <div className="h-1.5 overflow-hidden rounded-full bg-[#F3F4F6]"><div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

function SummaryCard({ title, icon: Icon, tone, value, to, children }: {
  title: string; icon: ElementType; tone: string; value: ReactNode; to: string; children: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <section className={`${panel} relative p-5 transition-shadow hover:shadow-md`}>
      <div className="mb-4 flex items-start justify-between">
        <div className={`flex size-10 items-center justify-center rounded-xl ${tone}`}><Icon size={20} /></div>
        <button type="button" onClick={() => navigate(to)} aria-label={`View ${title}`} className="text-xs font-medium text-[#ED0016] after:absolute after:inset-0 after:rounded-xl hover:underline focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-red-500">
          <span className="flex items-center gap-1">View <ArrowUpRight size={12} /></span>
        </button>
      </div>
      <p className="mb-1 text-xs text-[#667085]">{title}</p>
      <p className="text-2xl font-bold text-[#111111]">{value}</p>
      {children}
    </section>
  );
}

export function SuperAdminDashboard({ user }: SuperAdminDashboardProps) {
  const navigate = useNavigate();
  const now = new Date();
  const displayDate = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now);
  // Frontend design preview uses the same sample data as the module pages.
  const presentToday = attendanceRecords.filter(a => a.status === 'Present' || a.status === 'Half Day').length;
  const onLeaveToday = attendanceRecords.filter(a => a.status === 'Leave').length;
  const totalEmp = employees.length;
  const attendancePct = totalEmp ? Math.round(presentToday / totalEmp * 100) : 0;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
  const completionPct = totalTasks ? Math.round(completedTasks / totalTasks * 100) : 0;
  const overdueTasks = 2;
  const activeProjects = projects.filter(p => p.status === 'In Progress');
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;
  const totalRevenue = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const todayRevenue = 150000;

  return (
    <div className="min-w-0 space-y-6">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-medium text-[#9CA3AF]">{displayDate}</p>
            <h2 className="text-xl font-bold text-[#111111]">Good to see you, {user.full_name || 'Super Admin'}.</h2>
            <p className="mt-1 text-sm text-[#667085]">Monitor your organization, teams, projects and revenue from one place.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
            <span className="size-2 rounded-full bg-green-500" /> All systems operational
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Attendance" icon={Clock} tone="bg-[#FFF1F2] text-[#ED0016]" value={`${presentToday}/${totalEmp}`} to="/attendance">
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            <span className="text-green-600">Present: {presentToday}</span><span className="text-amber-500">On Leave: {onLeaveToday}</span>
          </div>
          <div className="mt-3"><div className="mb-1 flex justify-between text-xs text-[#9CA3AF]"><span>Attendance rate</span><span className="font-medium text-[#374151]">{attendancePct}%</span></div><Progress value={attendancePct} /></div>
        </SummaryCard>
        <SummaryCard title="Tasks" icon={CheckCircle2} tone="bg-purple-50 text-purple-600" value={<>{totalTasks} <span className="text-sm font-normal text-[#9CA3AF]">total</span></>} to="/tasks">
          <div className="mt-3 grid grid-cols-3 gap-1 text-xs">
            {[{ label: 'Done', value: completedTasks, style: 'bg-green-50 text-green-700' }, { label: 'Pending', value: pendingTasks, style: 'bg-amber-50 text-amber-700' }, { label: 'Overdue', value: overdueTasks, style: 'bg-red-50 text-red-700' }].map(s => (
              <div key={s.label} className={`rounded-lg py-1.5 text-center ${s.style}`}><p className="font-bold">{s.value}</p><p>{s.label}</p></div>
            ))}
          </div>
          <div className="mt-3"><Progress value={completionPct} color="bg-purple-500" /><p className="mt-1 text-xs text-[#9CA3AF]">{completionPct}% complete</p></div>
        </SummaryCard>
        <SummaryCard title="Active Projects" icon={FolderKanban} tone="bg-emerald-50 text-emerald-600" value={activeProjects.length} to="/projects">
          <div className="mt-3 space-y-1.5 text-xs">
            {[{ label: 'Completed', value: completedProjectsCount, dot: 'bg-green-400' }, { label: 'In Progress', value: activeProjects.length, dot: 'bg-[#ED0016]' }, { label: 'Planning', value: projects.filter(p => p.status === 'Planning').length, dot: 'bg-amber-400' }].map(s => (
              <div key={s.label} className="flex justify-between"><span className="flex items-center gap-1 text-[#9CA3AF]"><span className={`size-2 rounded-full ${s.dot}`} />{s.label}</span><span className="font-medium text-[#374151]">{s.value}</span></div>
            ))}
          </div>
        </SummaryCard>
        <SummaryCard title="Total Revenue" icon={IndianRupee} tone="bg-amber-50 text-amber-600" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} to="/revenue">
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-[#9CA3AF]">Today's Revenue</span><span className="font-medium text-emerald-600">₹{(todayRevenue / 1000).toFixed(0)}k</span></div>
            <div className="flex justify-between"><span className="text-[#9CA3AF]">Pending</span><span className="font-medium text-amber-600">₹3.8L</span></div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600"><TrendingUp size={12} /><span>+12% from last month</span></div>
        </SummaryCard>
      </div>

      <section className={`${panel} p-5`}>
        <h3 className="mb-4 text-sm font-semibold text-[#111111]">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {[{ label: '+ Add Employee', icon: UserPlus, to: '/employees', primary: true }, { label: '+ Add Client', icon: Briefcase, to: '/clients' }, { label: '+ Add Project', icon: FolderKanban, to: '/projects' }, { label: '+ Add Task', icon: CheckCircle2, to: '/tasks' }, { label: '+ Record Revenue', icon: IndianRupee, to: '/revenue' }].map(a => (
            <button key={a.label} type="button" onClick={() => navigate(a.to)} className={`flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${a.primary ? 'bg-[#ED0016] text-white hover:bg-[#B80012]' : 'border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]'}`}><a.icon size={14} />{a.label}</button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="min-w-0 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-[#111111]">Department Overview</h2><p className="text-xs text-[#667085]">Performance summary across all departments</p></div>
            <button type="button" onClick={() => navigate('/departments')} className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#ED0016] hover:underline">View all <ArrowRight size={12} /></button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {departments.slice(0, 4).map(dept => {
              const Icon = deptIconMap[dept.icon] || Users;
              return (
                <div key={dept.id} className={`${panel} p-4 transition-shadow hover:shadow-md`}>
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5"><div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F2]"><Icon size={15} className="text-[#ED0016]" /></div><div><h3 className="text-sm font-semibold text-[#111111]">{dept.name}</h3><p className="text-[10px] text-[#9CA3AF]">Lead: {dept.head}</p></div></div>
                    <span className="rounded-full bg-[#FFF1F2] px-2 py-0.5 text-xs font-bold text-[#ED0016]">{dept.progress}%</span>
                  </div>
                  <div className="mb-3 grid grid-cols-3 gap-1.5 text-xs">
                    {[{ label: 'Staff', value: dept.employees }, { label: 'Tasks', value: dept.tasks }, { label: 'Projects', value: dept.projects }].map(s => <div key={s.label} className="rounded-lg bg-[#F9FAFB] py-2 text-center"><p className="font-bold text-[#1F2937]">{s.value}</p><p className="text-[#9CA3AF]">{s.label}</p></div>)}
                  </div>
                  <div className="mb-3"><Progress value={dept.progress} /><p className="mt-1 text-[10px] text-[#9CA3AF]">{dept.completedTasks}/{dept.tasks} tasks done</p></div>
                  <button type="button" onClick={() => navigate(`/departments/${dept.id}`)} className="w-full rounded-lg border border-red-100 py-1.5 text-xs font-medium text-[#ED0016] transition-colors hover:bg-[#FFF1F2]">View Department</button>
                </div>
              );
            })}
          </div>
        </section>
        <section className={`${panel} flex min-w-0 flex-col`}>
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4">
            <div><h3 className="text-sm font-semibold text-[#111111]">Recent Activity</h3><p className="mt-0.5 text-xs text-[#9CA3AF]">Latest audit trail</p></div>
            <button type="button" onClick={() => navigate('/audit-log')} className="text-xs font-medium text-[#ED0016] hover:underline">View Log</button>
          </div>
          <div className="max-h-96 flex-1 divide-y divide-[#F3F4F6] overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="px-4 py-3 transition-colors hover:bg-[#F9FAFB]">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 max-w-24 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${activityColors[log.module] || 'bg-slate-100 text-slate-600'}`}>{log.module}</span>
                  <div className="min-w-0 flex-1"><p className="text-xs font-medium leading-snug text-[#1F2937]">{log.description}</p><div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[#9CA3AF]"><span>{log.user}</span><span>·</span><span>{log.time}</span></div></div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E5E7EB] px-4 py-3"><button type="button" onClick={() => navigate('/audit-log')} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] py-2 text-xs font-medium text-[#374151] hover:bg-[#F9FAFB]"><FileText size={12} /> View Audit Log</button></div>
        </section>
      </div>

      <section className={`${panel} min-w-0 overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <div><h3 className="text-sm font-semibold text-[#111111]">Active Projects</h3><p className="mt-0.5 text-xs text-[#9CA3AF]">{activeProjects.length} projects in progress</p></div>
          <button type="button" onClick={() => navigate('/projects')} className="flex items-center gap-1 text-xs font-medium text-[#ED0016] hover:underline">View All <ArrowRight size={12} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">{['Project', 'Client', 'Department', 'Manager', 'Budget', 'Progress', 'Deadline', 'Status'].map(h => <th scope="col" key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#667085]">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {activeProjects.map(p => (
                <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)} className="cursor-pointer transition-colors hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3.5"><button type="button" onClick={event => { event.stopPropagation(); navigate(`/projects/${p.id}`); }} className="text-left text-sm font-medium text-[#1F2937] hover:underline">{p.name}</button><p className="text-xs text-[#9CA3AF]">{p.code}</p></td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#667085]">{p.client}</td>
                  <td className="px-4 py-3.5"><span className="whitespace-nowrap rounded-full bg-[#F3F4F6] px-2 py-0.5 text-xs text-[#374151]">{employees.find(e => e.name === p.manager)?.department ?? 'Unassigned'}</span></td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-[#667085]">{p.manager}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-[#1F2937]">₹{(p.budget / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3.5"><div className="flex min-w-24 items-center gap-2"><div className="flex-1"><Progress value={p.progress} /></div><span className="text-xs text-[#667085]">{p.progress}%</span></div></td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-1 whitespace-nowrap text-xs text-[#667085]"><Calendar size={11} />{p.deadline}</div></td>
                  <td className="px-4 py-3.5">{statusBadge(p.status)}</td>
                </tr>
              ))}
              {!activeProjects.length && <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-[#667085]">No active projects yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      {overdueTasks > 0 && (
        <div className="flex flex-wrap items-start gap-3 rounded-xl border border-red-100 bg-[#FFF1F2] p-4">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#ED0016]" />
          <div className="min-w-0 flex-1"><p className="text-sm font-medium text-[#1F2937]">{overdueTasks} overdue tasks require attention</p><p className="mt-0.5 text-xs text-[#667085]">Review and reassign or update deadlines.</p></div>
          <button type="button" onClick={() => navigate('/tasks')} className="ml-auto shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-[#ED0016] hover:bg-red-50">Review</button>
        </div>
      )}
    </div>
  );
}
