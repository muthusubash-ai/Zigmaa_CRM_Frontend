import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Grid, List, FolderKanban, X, ChevronDown, Check } from 'lucide-react';
import { projects as initialProjects, employees, Employee } from '@/data/mockData';
import { statusBadge } from '@/components/ui/badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';

const statuses = ['All', 'Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
const priorities = ['All', 'High', 'Medium', 'Low', 'Urgent'];
const initForm = {
  name: '', code: '', client: '', description: '',
  manager: '', team: [] as string[],
  start: '', deadline: '', budget: '',
  priority: 'High', status: 'Planning', category: '',
};

// ── Team Member Multi-Select ─────────────────────────────────────────────────

interface TeamPickerProps {
  selected: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  excludeIds?: string[];
}

function TeamPicker({ selected, onChange, placeholder = 'Select team members', excludeIds = [] }: TeamPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const pool = employees.filter(e => !excludeIds.includes(e.id));
  const filtered = pool.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.designation.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  const selectedEmps = employees.filter(e => selected.includes(e.id));

  return (
    <div ref={ref} className="relative">
      {/* Chips */}
      {selectedEmps.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedEmps.map(emp => (
            <span key={emp.id} className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs px-2 py-1 rounded-full">
              <span className="w-4 h-4 rounded-full bg-[#ED0016] text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                {emp.name[0]}
              </span>
              {emp.name}
              <button onClick={() => toggle(emp.id)} className="text-blue-400 hover:text-red-700">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-left flex items-center justify-between outline-none focus:ring-2 focus:ring-red-500"
      >
        <span className={selectedEmps.length > 0 ? 'text-slate-700' : 'text-slate-400'}>
          {selectedEmps.length > 0 ? `${selectedEmps.length} member${selectedEmps.length > 1 ? 's' : ''} selected` : placeholder}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-lg">
              <Search size={13} className="text-slate-400 flex-shrink-0" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search team members..."
                className="bg-transparent text-xs outline-none flex-1 text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center py-4 text-xs text-slate-400">No members found</p>
            ) : (
              <>
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-50">
                  <button onClick={() => onChange(pool.map(e => e.id))} className="text-xs text-[#ED0016] hover:underline">Select all</button>
                  <button onClick={() => onChange([])} className="text-xs text-slate-400 hover:underline">Clear all</button>
                </div>
                {filtered.map(emp => {
                  const isSelected = selected.includes(emp.id);
                  return (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => toggle(emp.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-[#ED0016] border-[#ED0016]' : 'border-slate-300'}`}>
                        {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {emp.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{emp.name}</p>
                        <p className="text-xs text-slate-400 truncate">{emp.designation}</p>
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Manager Select ───────────────────────────────────────────────────────────

interface ManagerPickerProps {
  value: string;
  onChange: (id: string) => void;
}

function ManagerPicker({ value, onChange }: ManagerPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.designation.toLowerCase().includes(search.toLowerCase())
  );
  const selected = employees.find(e => e.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-left flex items-center gap-3 outline-none focus:ring-2 focus:ring-red-500"
      >
        {selected ? (
          <>
            <div className="w-6 h-6 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{selected.name[0]}</div>
            <span className="text-slate-700 truncate flex-1">{selected.name} — {selected.designation}</span>
          </>
        ) : (
          <span className="text-slate-400 flex-1">Select project manager</span>
        )}
        <ChevronDown size={14} className={`text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-lg">
              <Search size={13} className="text-slate-400 flex-shrink-0" />
              <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-transparent text-xs outline-none flex-1 text-slate-700 placeholder-slate-400" />
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filtered.map(emp => (
              <button key={emp.id} type="button" onClick={() => { onChange(emp.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left ${value === emp.id ? 'bg-red-50' : ''}`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{emp.name[0]}</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{emp.name}</p>
                  <p className="text-xs text-slate-400 truncate">{emp.designation}</p>
                </div>
                {value === emp.id && <Check size={14} className="text-[#ED0016] ml-auto flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Projects Page ────────────────────────────────────────────────────────────

export default function Projects() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(initForm);

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    return (
      (p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || p.status === statusFilter) &&
      (priorityFilter === 'All' || p.priority === priorityFilter)
    );
  });

  const handleAdd = () => {
    if (!form.name.trim()) { toast('Project name is required.', 'error'); return; }
    const managerEmp = employees.find(e => e.id === form.manager);
    const newP = {
      ...form,
      id: `PRJ${String(projects.length + 1).padStart(3, '0')}`,
      manager: managerEmp?.name || 'Zigmaa Super Admin',
      budget: Number(form.budget) || 0,
      spent: 0,
      progress: 0,
    };
    setProjects(prev => [...prev, newP]);
    setForm(initForm);
    setAddOpen(false);
    toast('Project created successfully.');
  };

  const statusColor: Record<string, string> = {
    'In Progress': 'bg-red-500', Planning: 'bg-purple-500', Completed: 'bg-green-500',
    'On Hold': 'bg-amber-500', Cancelled: 'bg-red-500',
  };

  const getTeamAvatars = (teamIds: string[]): Employee[] =>
    teamIds.slice(0, 4).map(id => employees.find(e => e.id === id)).filter((e): e is Employee => Boolean(e));

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-52">
          <Search size={15} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none">
          {priorities.map(p => <option key={p}>{p}</option>)}
        </select>
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
          <button onClick={() => setView('grid')} className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-[#ED0016] text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Grid size={16} /></button>
          <button onClick={() => setView('list')} className={`p-2.5 transition-colors ${view === 'list' ? 'bg-[#ED0016] text-white' : 'text-slate-400 hover:bg-slate-50'}`}><List size={16} /></button>
        </div>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 h-10 bg-[#ED0016] hover:bg-[#B80012] text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap">
          <Plus size={15} /> Add Project
        </button>
      </div>

      {/* Project grid / list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <EmptyState icon={FolderKanban} title="No projects found" description="Create your first project to get started." action={{ label: '+ Add Project', onClick: () => setAddOpen(true) }} />
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => {
            const team = getTeamAvatars(p.team);
            return (
              <div key={p.id} onClick={() => navigate(`/projects/${p.id}`)} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor[p.status] || 'bg-slate-400'}`} />
                    <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-[#ED0016] transition-colors">{p.name}</h3>
                  </div>
                  {statusBadge(p.priority)}
                </div>
                <p className="text-xs text-slate-500 mb-0.5">Client: {p.client}</p>
                <p className="text-xs text-slate-500 mb-3">PM: {p.manager}</p>

                {/* Team avatars */}
                {team.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex -space-x-1.5">
                      {team.map((emp, i) => (
                        <div key={i} title={emp.name} className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
                          {emp.name[0]}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">{p.team.length} member{p.team.length !== 1 ? 's' : ''}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>Progress</span>
                  <span className="font-semibold text-slate-900">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full mb-3">
                  <div className={`h-1.5 rounded-full transition-all ${statusColor[p.status] || 'bg-red-500'}`} style={{ width: `${p.progress}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  {statusBadge(p.status)}
                  <span className="text-xs text-slate-400">Due: {p.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Project', 'Client', 'Manager', 'Team', 'Progress', 'Priority', 'Status', 'Deadline'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => {
                  const team = getTeamAvatars(p.team);
                  return (
                    <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-900">{p.name}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{p.client}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{p.manager}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex -space-x-1.5">
                          {team.map((emp, i) => (
                            <div key={i} title={emp.name} className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
                              {emp.name[0]}
                            </div>
                          ))}
                          {p.team.length === 0 && <span className="text-xs text-slate-400">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full">
                            <div className="h-1.5 bg-red-500 rounded-full" style={{ width: `${p.progress}%` }} />
                          </div>
                          <span className="text-xs text-slate-600">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">{statusBadge(p.priority)}</td>
                      <td className="px-4 py-3.5">{statusBadge(p.status)}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{p.deadline}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      <Modal open={addOpen} onClose={() => { setAddOpen(false); setForm(initForm); }} title="Add Project" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Project Name *', key: 'name' as const, placeholder: 'Website Redesign' },
              { label: 'Project Code', key: 'code' as const, placeholder: 'WR-2024' },
              { label: 'Client', key: 'client' as const, placeholder: 'ABC Technologies' },
              { label: 'Category', key: 'category' as const, placeholder: 'Web Development' },
              { label: 'Start Date', key: 'start' as const, type: 'date' },
              { label: 'Due Date', key: 'deadline' as const, type: 'date' },
              { label: 'Estimated Budget (₹)', key: 'budget' as const, placeholder: '500000', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder || ''}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500">
                {['High', 'Medium', 'Low', 'Urgent'].map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500">
                {statuses.filter(s => s !== 'All').map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          </div>

          {/* Project Manager */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Project Manager</label>
            <ManagerPicker value={form.manager} onChange={id => setForm(p => ({ ...p, manager: id }))} />
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Team Members</label>
            <TeamPicker
              selected={form.team}
              onChange={ids => setForm(p => ({ ...p, team: ids }))}
              excludeIds={form.manager ? [form.manager] : []}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Project description..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none" />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => { setAddOpen(false); setForm(initForm); }} className="flex-1 h-11 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
          <button onClick={handleAdd} className="flex-1 h-11 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">Create Project</button>
        </div>
      </Modal>
    </div>
  );
}
