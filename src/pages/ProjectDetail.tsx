import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CheckSquare, Wallet } from 'lucide-react';
import { projects, tasks, employees } from '@/data/mockData';
import { statusBadge } from '@/components/ui/badge';

const tabs = ['Overview', 'Tasks', 'Team', 'Files', 'Activity', 'Finance'];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  if (!project) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Project not found.</p>
      <button onClick={() => navigate('/projects')} className="mt-4 text-[#ED0016] hover:underline text-sm">Back to Projects</button>
    </div>
  );

  const projectTasks = tasks.filter(t => t.project === id);
  const teamMembers = employees.filter(e => project.team.includes(e.id));

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} /> Back to Projects
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
              {statusBadge(project.status)}
              {statusBadge(project.priority)}
            </div>
            <p className="text-slate-500 text-sm mt-1">Client: {project.client} · PM: {project.manager}</p>
            <p className="text-slate-400 text-xs mt-0.5">{project.description}</p>
          </div>
          <button className="px-4 py-2 border border-slate-200 text-slate-700 text-sm rounded-xl hover:bg-slate-50 transition-colors">Edit Project</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-100">
          {[
            { icon: CheckSquare, label: 'Progress', value: `${project.progress}%` },
            { icon: Wallet, label: 'Budget', value: `₹${project.budget.toLocaleString()}` },
            { icon: Wallet, label: 'Spent', value: `₹${project.spent.toLocaleString()}` },
            { icon: CheckSquare, label: 'Tasks', value: projectTasks.length },
            { icon: Users, label: 'Team', value: teamMembers.length },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5"><Icon size={12} />{label}</p>
              <p className="text-sm font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Overall Progress</span><span>{project.progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full">
            <div className="h-2 bg-red-500 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
      </div>

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
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Tasks ({projectTasks.length})</h3>
              <div className="space-y-2">
                {projectTasks.length === 0 ? <p className="text-sm text-slate-400">No tasks yet.</p> : projectTasks.map(t => (
                  <div key={t.id} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{t.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{t.assigneeName} · Due {t.due}</p>
                    </div>
                    {statusBadge(t.status)}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Team ({teamMembers.length})</h3>
              <div className="space-y-2">
                {teamMembers.length === 0 ? <p className="text-sm text-slate-400">No team members assigned.</p> : teamMembers.map(e => (
                  <div key={e.id} className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{e.name[0]}</div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{e.name}</p>
                      <p className="text-xs text-slate-400">{e.designation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
