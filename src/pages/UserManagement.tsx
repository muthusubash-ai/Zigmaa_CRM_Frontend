import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, UserCog, ChevronDown } from 'lucide-react';
import { crmUsers as initialUsers } from '@/data/mockData';
import { statusBadge } from '@/components/ui/badge';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';

const roleOptions = ['All', 'Super Admin', 'HR', 'Employee'];
const statusOptions = ['All', 'Active', 'Inactive', 'Pending'];
const deptOptions = ['All', 'Administration', 'Development', 'Design', 'HR', 'Marketing', 'Finance', 'Sales'];

const initForm = { firstName: '', lastName: '', email: '', phone: '', department: 'Development', jobTitle: '', role: 'Employee', status: 'Active' };

export default function UserManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All');
  const [status, setStatus] = useState('All');
  const [dept, setDept] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(initForm);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)) &&
      (role === 'All' || u.role === role) &&
      (status === 'All' || u.status === status) &&
      (dept === 'All' || u.department === dept)
    );
  });

  const handleAdd = () => {
    if (!form.firstName || !form.email) { toast('First name and email are required.', 'error'); return; }
    const newUser = {
      ...form,
      id: `USR${String(users.length + 1).padStart(3, '0')}`,
      name: `${form.firstName} ${form.lastName}`.trim(),
      manager: '—',
      lastLogin: 'Never',
      created: new Date().toISOString().split('T')[0],
      loginHistory: [],
    };
    setUsers(prev => [...prev, newUser]);
    setForm(initForm);
    setAddOpen(false);
    toast('User created successfully.');
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast('User removed.', 'warning');
  };

  const inputCls = "w-full h-11 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#1F2937] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#ED0016]/30 focus:border-[#ED0016]";

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, color: 'text-[#111111]' },
          { label: 'Active', value: users.filter(u => u.status === 'Active').length, color: 'text-green-600' },
          { label: 'Inactive', value: users.filter(u => u.status === 'Inactive').length, color: 'text-[#667085]' },
          { label: 'Pending', value: users.filter(u => u.status === 'Pending').length, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3.5 shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#667085] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 flex-1 min-w-52 shadow-sm">
          <Search size={15} className="text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="bg-transparent text-sm outline-none flex-1 text-[#1F2937] placeholder-[#9CA3AF]" />
        </div>
        {[
          { value: role, onChange: setRole, options: roleOptions },
          { value: status, onChange: setStatus, options: statusOptions },
          { value: dept, onChange: setDept, options: deptOptions },
        ].map((sel, i) => (
          <div key={i} className="relative">
            <select value={sel.value} onChange={e => sel.onChange(e.target.value)} className="h-10 pl-3 pr-8 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#374151] outline-none appearance-none cursor-pointer shadow-sm">
              {sel.options.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>
        ))}
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 h-10 bg-[#ED0016] hover:bg-[#B80012] text-white text-sm font-medium rounded-xl transition-colors ml-auto shadow-sm">
          <Plus size={15} /> Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState icon={UserCog} title="No users found" description="Create users to grant access to the CRM." action={{ label: '+ Add User', onClick: () => setAddOpen(true) }} />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  {['User', 'ID', 'Department', 'Job Title', 'Role', 'Last Login', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FFF1F2] flex items-center justify-center text-[#ED0016] text-xs font-bold flex-shrink-0">
                          {u.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1F2937] whitespace-nowrap">{u.name}</p>
                          <p className="text-xs text-[#667085] truncate max-w-40">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-[#667085]">{u.id}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded-full whitespace-nowrap">{u.department}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#667085] whitespace-nowrap">{u.jobTitle}</td>
                    <td className="px-4 py-3.5 text-sm text-[#374151] whitespace-nowrap">{u.role}</td>
                    <td className="px-4 py-3.5 text-sm text-[#667085] whitespace-nowrap">{u.lastLogin}</td>
                    <td className="px-4 py-3.5">{statusBadge(u.status)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => navigate(`/users/${u.id}`)} className="p-1.5 rounded-lg text-[#9CA3AF] hover:bg-[#FFF1F2] hover:text-[#ED0016] transition-colors" title="View">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg text-[#9CA3AF] hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        {u.role !== 'Super Admin' && (
                          <button onClick={() => setDeleteId(u.id)} className="p-1.5 rounded-lg text-[#9CA3AF] hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        )}
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
            Showing {filtered.length} of {users.length} users
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New User" size="md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">First Name *</label>
            <input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} placeholder="Arun" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Last Name</label>
            <input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} placeholder="Kumar" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="arun@zigmaatech.com" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Phone</label>
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Department</label>
            <div className="relative">
              <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className={`${inputCls} appearance-none pr-9`}>
                {deptOptions.filter(d => d !== 'All').map(d => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Job Title</label>
            <input value={form.jobTitle} onChange={e => setForm(p => ({ ...p, jobTitle: e.target.value }))} placeholder="Frontend Developer" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Role</label>
            <div className="relative">
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className={`${inputCls} appearance-none pr-9`}>
                {roleOptions.filter(r => r !== 'All').map(r => <option key={r}>{r}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Status</label>
            <div className="relative">
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={`${inputCls} appearance-none pr-9`}>
                {statusOptions.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setAddOpen(false)} className="flex-1 h-11 border border-[#E5E7EB] rounded-xl text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors">Cancel</button>
          <button onClick={handleAdd} className="flex-1 h-11 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">Create User</button>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Remove User"
        message="Are you sure you want to remove this user? They will lose access to the CRM."
      />
    </div>
  );
}
