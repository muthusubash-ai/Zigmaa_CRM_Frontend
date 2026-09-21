import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Mail, Phone, Briefcase, Building2, Pencil, KeyRound, Clock, Activity } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import { auditLogs } from '@/data/mockData';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [form, setForm] = useState({ name: 'Zigmaa Super Admin', email: 'admin@zigmaatech.com', phone: '+91 98765 00001', department: 'Administration' });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });

  const handleSave = () => {
    toast('Profile updated successfully.');
    setEditOpen(false);
  };

  const handlePw = () => {
    if (!pwForm.current || !pwForm.newPw) { toast('Please fill all fields.', 'error'); return; }
    if (pwForm.newPw !== pwForm.confirm) { toast('Passwords do not match.', 'error'); return; }
    toast('Password changed successfully.');
    setPwOpen(false);
    setPwForm({ current: '', newPw: '', confirm: '' });
  };

  return (
    <div className="max-w-3xl space-y-5">
      {/* Profile card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-20 h-20 rounded-2xl bg-[#ED0016] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">Z</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{form.name}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{user?.role?.replace('_', ' ')}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-medium">Super Admin</span>
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">Active</span>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setEditOpen(true)} className="flex items-center gap-2 px-4 h-9 border border-slate-200 text-slate-700 text-sm rounded-xl hover:bg-slate-50 transition-colors">
              <Pencil size={13} /> Edit Profile
            </button>
            <button onClick={() => setPwOpen(true)} className="flex items-center gap-2 px-4 h-9 bg-[#ED0016] hover:bg-[#B80012] text-white text-sm font-medium rounded-xl transition-colors">
              <KeyRound size={13} /> Change Password
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
          {[
            { icon: Mail, label: 'Email', value: form.email },
            { icon: Phone, label: 'Phone', value: form.phone },
            { icon: Briefcase, label: 'Role', value: 'Super Admin' },
            { icon: Building2, label: 'Department', value: form.department },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Activity size={15} className="text-slate-400" />
          <h3 className="font-semibold text-slate-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { action: 'Signed in', time: 'Just now', icon: Clock },
            ...auditLogs.slice(0, 4).map(l => ({ action: `${l.action} ${l.module}: ${l.description}`, time: `${l.date} ${l.time}`, icon: Activity }))
          ].map((item, i) => (
            <div key={i} className="px-5 py-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <item.icon size={13} className="text-[#ED0016]" />
              </div>
              <div>
                <p className="text-sm text-slate-900">{item.action}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile" size="md">
        <div className="space-y-4">
          {[
            { label: 'Full Name', key: 'name' as const },
            { label: 'Email', key: 'email' as const },
            { label: 'Phone', key: 'phone' as const },
            { label: 'Department', key: 'department' as const },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
              <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          ))}
          <div className="flex gap-3 mt-2">
            <button onClick={() => setEditOpen(false)} className="flex-1 h-11 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} className="flex-1 h-11 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">Save Changes</button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Change Password" size="sm">
        <div className="space-y-4">
          {[
            { label: 'Current Password', key: 'current' as const },
            { label: 'New Password', key: 'newPw' as const },
            { label: 'Confirm New Password', key: 'confirm' as const },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
              <input type="password" value={pwForm[f.key]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder="••••••••" className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          ))}
          <div className="flex gap-3 mt-2">
            <button onClick={() => setPwOpen(false)} className="flex-1 h-11 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
            <button onClick={handlePw} className="flex-1 h-11 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">Update Password</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
