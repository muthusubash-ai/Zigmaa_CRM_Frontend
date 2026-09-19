import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Users, Film, Code2, TrendingUp, Wallet,
  CheckCircle2, FolderKanban, Clock, ChevronRight,
} from 'lucide-react';
import { departments } from '@/data/mockData';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

const iconMap: Record<string, React.ElementType> = {
  Film, Code2, TrendingUp, Users, Wallet,
};

const initForm = { name: '', description: '', head: '', status: 'Active' };

export default function Departments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [depts] = useState(departments);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(initForm);

  const handleAdd = () => {
    if (!form.name.trim()) { toast('Department name is required.', 'error'); return; }
    toast(`Department "${form.name}" created successfully.`);
    setForm(initForm);
    setAddOpen(false);
  };

  const totals = {
    employees: depts.reduce((s, d) => s + d.employees, 0),
    present: depts.reduce((s, d) => s + d.present, 0),
    tasks: depts.reduce((s, d) => s + d.tasks, 0),
    projects: depts.reduce((s, d) => s + d.projects, 0),
  };

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Departments', value: depts.length, icon: FolderKanban, color: 'bg-red-50 text-[#ED0016]' },
          { label: 'Total Employees', value: totals.employees, icon: Users, color: 'bg-purple-50 text-purple-600' },
          { label: 'Present Today', value: totals.present, icon: Clock, color: 'bg-green-50 text-green-600' },
          { label: 'Active Tasks', value: totals.tasks, icon: CheckCircle2, color: 'bg-amber-50 text-amber-600' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Header + add */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{depts.length} departments · click a card to view details</p>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 h-10 bg-[#ED0016] hover:bg-[#B80012] text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus size={15} /> Add Department
        </button>
      </div>

      {/* Department cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {depts.map(dept => {
          const Icon = iconMap[dept.icon] || Users;
          const pct = dept.progress;
          return (
            <div key={dept.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all">
              {/* Icon + name */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                    <Icon size={20} className="text-[#ED0016]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{dept.name}</h3>
                    <p className="text-xs text-slate-400">{dept.employees} employees</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                  dept.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>{dept.status}</span>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">{dept.description}</p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'Present Today', value: `${dept.present}/${dept.employees}`, color: 'text-green-700', bg: 'bg-green-50' },
                  { label: 'Active Projects', value: dept.projects, color: 'text-red-700', bg: 'bg-red-50' },
                  { label: 'Assigned Tasks', value: dept.tasks, color: 'text-purple-700', bg: 'bg-purple-50' },
                  { label: 'Completed', value: dept.completedTasks, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                ].map(s => (
                  <div key={s.label} className={`rounded-lg p-2.5 ${s.bg}`}>
                    <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Department Lead */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-[10px] font-bold">{dept.head[0]}</div>
                <div>
                  <span className="text-xs text-slate-500">Lead: </span>
                  <span className="text-xs font-medium text-slate-900">{dept.head}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Work Progress</span>
                  <span className="font-semibold text-slate-900">{pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div
                    className={`h-2 rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-red-500' : 'bg-amber-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => navigate(`/departments/${dept.id}`)}
                className="w-full flex items-center justify-center gap-2 text-sm text-[#ED0016] border border-red-200 rounded-xl py-2.5 hover:bg-red-50 transition-colors font-medium"
              >
                View Dashboard <ChevronRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Department modal */}
      <Modal open={addOpen} onClose={() => { setAddOpen(false); setForm(initForm); }} title="Add Department">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Video Editing" className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="What does this department do?" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department Head</label>
            <input value={form.head} onChange={e => setForm(p => ({ ...p, head: e.target.value }))} placeholder="Name of department head" className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => { setAddOpen(false); setForm(initForm); }} className="flex-1 h-11 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
          <button onClick={handleAdd} className="flex-1 h-11 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">Save Department</button>
        </div>
      </Modal>
    </div>
  );
}
