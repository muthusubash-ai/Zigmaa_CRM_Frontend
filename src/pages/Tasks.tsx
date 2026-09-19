import { useState } from 'react';
import { Plus, Search, List, Columns, CheckSquare } from 'lucide-react';
import { tasks as initialTasks, projects, employees } from '@/data/mockData';
import { statusBadge } from '@/components/ui/badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';

const priorities = ['All', 'High', 'Medium', 'Low'];
const statuses = ['All', 'To Do', 'In Progress', 'Review', 'Completed'];
const kanbanCols = ['To Do', 'In Progress', 'Review', 'Completed'];
const colColors: Record<string, string> = { 'To Do': 'bg-slate-100', 'In Progress': 'bg-red-50', Review: 'bg-purple-50', Completed: 'bg-green-50' };
const colBorders: Record<string, string> = { 'To Do': 'border-slate-200', 'In Progress': 'border-red-200', Review: 'border-purple-200', Completed: 'border-green-200' };
const colDots: Record<string, string> = { 'To Do': 'bg-slate-400', 'In Progress': 'bg-red-500', Review: 'bg-purple-500', Completed: 'bg-green-500' };

const initForm = { name: '', description: '', project: 'PRJ001', assignee: 'EMP001', priority: 'Medium', status: 'To Do', start: '', due: '', hours: '', days: '' };

export default function Tasks() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('All');
  const [status, setStatus] = useState('All');
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(initForm);

  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    return (
      (t.name.toLowerCase().includes(q) || t.projectName.toLowerCase().includes(q) || t.assigneeName.toLowerCase().includes(q)) &&
      (priority === 'All' || t.priority === priority) &&
      (status === 'All' || t.status === status)
    );
  });

  const handleAdd = () => {
    if (!form.name) { toast('Task name is required.', 'error'); return; }
    const proj = projects.find(p => p.id === form.project);
    const emp = employees.find(e => e.id === form.assignee);
    const newTask = {
      ...form,
      id: `TSK${String(tasks.length + 1).padStart(3, '0')}`,
      projectName: proj?.name || '',
      assigneeName: emp?.name || '',
      hours: Number(form.hours) || 0,
      progress: 0,
    };
    setTasks(prev => [...prev, newTask]);
    setForm(initForm);
    setAddOpen(false);
    toast('Task created successfully.');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-52">
          <Search size={15} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400" />
        </div>
        <select value={priority} onChange={e => setPriority(e.target.value)} className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none">
          {priorities.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
          <button onClick={() => setView('list')} className={`p-2.5 ${view === 'list' ? 'bg-[#ED0016] text-white' : 'text-slate-400 hover:bg-slate-50'} transition-colors`}><List size={16} /></button>
          <button onClick={() => setView('kanban')} className={`p-2.5 ${view === 'kanban' ? 'bg-[#ED0016] text-white' : 'text-slate-400 hover:bg-slate-50'} transition-colors`}><Columns size={16} /></button>
        </div>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 h-10 bg-[#ED0016] hover:bg-[#B80012] text-white text-sm font-medium rounded-xl transition-colors">
          <Plus size={15} /> Create Task
        </button>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState icon={CheckSquare} title="No tasks found" description="Create your first task to start tracking work." action={{ label: '+ Create Task', onClick: () => setAddOpen(true) }} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['Task', 'Project', 'Assignee', 'Priority', 'Status', 'Due Date', 'Progress'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{t.id}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{t.projectName}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-xs font-bold">{t.assigneeName[0]}</div>
                          <span className="text-sm text-slate-600 whitespace-nowrap">{t.assigneeName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">{statusBadge(t.priority)}</td>
                      <td className="px-4 py-3.5">{statusBadge(t.status)}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{t.due}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2 min-w-20">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                            <div className={`h-1.5 rounded-full ${t.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${t.progress}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{t.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanCols.map(col => {
            const colTasks = filtered.filter(t => t.status === col);
            return (
              <div key={col} className={`${colColors[col]} border ${colBorders[col]} rounded-xl p-3`}>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className={`w-2 h-2 rounded-full ${colDots[col]}`} />
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{col}</span>
                  <span className="ml-auto text-xs text-slate-400 bg-white/80 px-1.5 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {colTasks.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">No tasks</div>
                  )}
                  {colTasks.map(t => (
                    <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs hover:shadow-sm transition-shadow cursor-pointer">
                      <p className="text-sm font-medium text-slate-900 mb-1">{t.name}</p>
                      <p className="text-xs text-slate-500 mb-2">{t.projectName}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-[9px] font-bold">{t.assigneeName[0]}</div>
                          <span className="text-xs text-slate-500">{t.assigneeName.split(' ')[0]}</span>
                        </div>
                        {statusBadge(t.priority)}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Due: {t.due}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create Task" size="lg">
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Task Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Design Homepage Mockup" className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Project</label>
            <select value={form.project} onChange={e => setForm(p => ({ ...p, project: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500">
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Assign To</label>
            <select value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500">
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority</label>
            <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500">
              {['High', 'Medium', 'Low'].map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500">
              {statuses.filter(s => s !== 'All').map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date</label>
            <input type="date" value={form.start} onChange={e => setForm(p => ({ ...p, start: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Due Date</label>
            <input type="date" value={form.due} onChange={e => setForm(p => ({ ...p, due: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Estimated Days</label>
            <input
              type="number"
              value={form.days}
              onChange={e => setForm(p => ({ ...p, days: e.target.value }))}
              placeholder="3"
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Task description..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setAddOpen(false)} className="flex-1 h-11 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
          <button onClick={handleAdd} className="flex-1 h-11 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">Create Task</button>
        </div>
      </Modal>
    </div>
  );
}
