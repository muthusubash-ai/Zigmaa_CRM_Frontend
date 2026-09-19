import { useState } from 'react';
import { Plus, Search, Eye, Pencil, Trash2, Briefcase, ChevronDown } from 'lucide-react';
import { clients as initialClients } from '@/data/mockData';
import { statusBadge } from '@/components/ui/badge';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';

const deptOptions = ['All', 'Development', 'Digital Marketing', 'Video Editing', 'HR', 'Finance'];
const statusOptions = ['All', 'Active', 'Inactive'];
const paymentStatusOptions = ['All', 'Paid', 'Pending', 'Partially Paid', 'Overdue'];
const clientTypes = ['Standard', 'On-Date'];

const initForm = {
  name: '', company: '', contact: '', email: '',
  department: 'Development', type: 'Standard', status: 'Active',
};

const paymentBadge = (s: string) => {
  const map: Record<string, string> = {
    Paid: 'bg-green-50 text-green-700',
    Pending: 'bg-amber-50 text-amber-700',
    'Partially Paid': 'bg-purple-50 text-purple-700',
    Overdue: 'bg-red-50 text-red-700',
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${map[s] || 'bg-slate-50 text-slate-600'}`}>{s}</span>;
};

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function Clients() {
  const { toast } = useToast();
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [status, setStatus] = useState('All');
  const [payStatus, setPayStatus] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(initForm);

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return (
      (c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) &&
      (dept === 'All' || c.department === dept) &&
      (status === 'All' || c.status === status) &&
      (payStatus === 'All' || c.paymentStatus === payStatus)
    );
  });

  const handleAdd = () => {
    if (!form.name || !form.company) { toast('Client name and company are required.', 'error'); return; }
    const newClient = {
      ...form,
      id: `CLT${String(clients.length + 1).padStart(3, '0')}`,
      projects: 0,
      revenue: 0,
      paymentStatus: 'Pending',
    };
    setClients(prev => [...prev, newClient]);
    setForm(initForm);
    setAddOpen(false);
    toast('Client added successfully.');
  };

  const handleDelete = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    toast('Client removed.', 'warning');
  };

  const totalRevenue = clients.reduce((s, c) => s + c.revenue, 0);
  const activeCount = clients.filter(c => c.status === 'Active').length;

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: clients.length, color: 'text-[#111111]' },
          { label: 'Active Clients', value: activeCount, color: 'text-green-600' },
          { label: 'Total Revenue', value: fmt(totalRevenue), color: 'text-[#ED0016]' },
          { label: 'Pending Payments', value: clients.filter(c => c.paymentStatus === 'Pending' || c.paymentStatus === 'Overdue').length, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3.5 shadow-sm">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#667085] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 flex-1 min-w-52 shadow-sm">
          <Search size={15} className="text-[#9CA3AF]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="bg-transparent text-sm outline-none flex-1 text-[#1F2937] placeholder-[#9CA3AF]"
          />
        </div>
        {[
          { value: dept, onChange: setDept, options: deptOptions },
          { value: status, onChange: setStatus, options: statusOptions },
          { value: payStatus, onChange: setPayStatus, options: paymentStatusOptions },
        ].map((sel, i) => (
          <div key={i} className="relative">
            <select
              value={sel.value}
              onChange={e => sel.onChange(e.target.value)}
              className="h-10 pl-3 pr-8 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#374151] outline-none appearance-none cursor-pointer shadow-sm"
            >
              {sel.options.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>
        ))}
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 h-10 bg-[#ED0016] hover:bg-[#B80012] text-white text-sm font-medium rounded-xl transition-colors ml-auto shadow-sm"
        >
          <Plus size={15} /> Add Client
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No clients found"
              description="Add your first client to start tracking projects and payments."
              action={{ label: '+ Add Client', onClick: () => setAddOpen(true) }}
            />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  {['Client', 'Company', 'Contact', 'Email', 'Department', 'Type', 'Projects', 'Revenue', 'Payment', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FFF1F2] flex items-center justify-center text-[#ED0016] text-xs font-bold flex-shrink-0">
                          {c.name[0]}
                        </div>
                        <span className="text-sm font-medium text-[#1F2937] whitespace-nowrap">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-medium text-[#1F2937] whitespace-nowrap">{c.company}</td>
                    <td className="px-4 py-3.5 text-sm text-[#667085] whitespace-nowrap">{c.contact}</td>
                    <td className="px-4 py-3.5 text-sm text-[#667085]">{c.email}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded-full whitespace-nowrap">{c.department}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${c.type === 'On-Date' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#1F2937] font-medium text-center">{c.projects}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#1F2937] whitespace-nowrap">{fmt(c.revenue)}</td>
                    <td className="px-4 py-3.5">{paymentBadge(c.paymentStatus)}</td>
                    <td className="px-4 py-3.5">{statusBadge(c.status)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded-lg text-[#9CA3AF] hover:bg-[#FFF1F2] hover:text-[#ED0016] transition-colors" title="View">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg text-[#9CA3AF] hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg text-[#9CA3AF] hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-[#E5E7EB] text-xs text-[#667085]">
            Showing {filtered.length} of {clients.length} clients
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Client" size="md">
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
          {[
            { label: 'Client Name *', key: 'name' as const, placeholder: 'Rajesh Kumar' },
            { label: 'Company *', key: 'company' as const, placeholder: 'ABC Technologies' },
            { label: 'Phone / Contact', key: 'contact' as const, placeholder: '+91 98765 11001' },
            { label: 'Email', key: 'email' as const, placeholder: 'rajesh@abctech.com', type: 'email' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">{f.label}</label>
              <input
                type={f.type || 'text'}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full h-11 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#ED0016]/30 focus:border-[#ED0016]"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Department</label>
            <div className="relative">
              <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className="w-full h-11 px-3 pr-9 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] outline-none appearance-none focus:ring-2 focus:ring-[#ED0016]/30 focus:border-[#ED0016]">
                {deptOptions.filter(d => d !== 'All').map(d => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Client Type</label>
            <div className="relative">
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full h-11 px-3 pr-9 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] outline-none appearance-none focus:ring-2 focus:ring-[#ED0016]/30 focus:border-[#ED0016]">
                {clientTypes.map(t => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Status</label>
            <div className="relative">
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full h-11 px-3 pr-9 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] outline-none appearance-none focus:ring-2 focus:ring-[#ED0016]/30 focus:border-[#ED0016]">
                {statusOptions.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setAddOpen(false)} className="flex-1 h-11 border border-[#E5E7EB] rounded-xl text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors">Cancel</button>
          <button onClick={handleAdd} className="flex-1 h-11 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">Add Client</button>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Client"
        message="Are you sure you want to delete this client? All associated data will be affected."
      />
    </div>
  );
}
