import { useState } from 'react';
import { Building2, Users, Shield, Bell, Clock, Wallet, FolderKanban, Lock, Link2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const sections = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'users', label: 'Users & Roles', icon: Users },
  { id: 'permissions', label: 'Permissions', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'attendance', label: 'Attendance', icon: Clock },
  { id: 'leave', label: 'Leave', icon: Clock },
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
];

const roles = ['Super Admin', 'Admin', 'HR Manager', 'Project Manager', 'Employee'];
const modules = ['Employees', 'Projects', 'Tasks', 'Attendance', 'Leave', 'Finance', 'Documents', 'Reports', 'Settings'];
const permissions = ['View', 'Create', 'Edit', 'Delete', 'Approve'];

const rolePermissions: Record<string, Record<string, string[]>> = {
  'Super Admin': { Employees: ['View','Create','Edit','Delete','Approve'], Projects: ['View','Create','Edit','Delete','Approve'], Tasks: ['View','Create','Edit','Delete','Approve'], Attendance: ['View','Create','Edit','Delete','Approve'], Leave: ['View','Create','Edit','Delete','Approve'], Finance: ['View','Create','Edit','Delete','Approve'], Documents: ['View','Create','Edit','Delete','Approve'], Reports: ['View','Create','Edit','Delete','Approve'], Settings: ['View','Create','Edit','Delete','Approve'] },
  'Admin': { Employees: ['View','Create','Edit'], Projects: ['View','Create','Edit'], Tasks: ['View','Create','Edit'], Attendance: ['View'], Leave: ['View','Approve'], Finance: ['View'], Documents: ['View'], Reports: ['View'], Settings: [] },
  'HR Manager': { Employees: ['View','Create','Edit'], Projects: ['View'], Tasks: ['View'], Attendance: ['View','Create','Edit'], Leave: ['View','Approve'], Finance: [], Documents: ['View','Create'], Reports: ['View'], Settings: [] },
  'Project Manager': { Employees: ['View'], Projects: ['View','Create','Edit'], Tasks: ['View','Create','Edit','Delete'], Attendance: [], Leave: ['View'], Finance: ['View'], Documents: ['View'], Reports: ['View'], Settings: [] },
  'Employee': { Employees: [], Projects: ['View'], Tasks: ['View','Edit'], Attendance: ['View'], Leave: ['View','Create'], Finance: [], Documents: ['View'], Reports: [], Settings: [] },
};

export default function Settings() {
  const { toast } = useToast();
  const [active, setActive] = useState('general');
  const [selectedRole, setSelectedRole] = useState('Super Admin');
  const [orgForm, setOrgForm] = useState({ name: 'Zigmaa Tech', website: 'www.zigmaatech.com', email: 'hello@zigmaatech.com', phone: '+91 44 1234 5678', address: 'Chennai, Tamil Nadu, India', timezone: 'Asia/Kolkata', currency: 'INR (₹)' });

  const renderContent = () => {
    if (active === 'general') return (
      <div className="space-y-5">
        <h2 className="text-base font-semibold text-slate-900">General Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(orgForm).map(([key, val]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input value={val} onChange={e => setOrgForm(p => ({ ...p, [key]: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          ))}
        </div>
        <button onClick={() => toast('Settings saved successfully.')} className="px-6 h-11 bg-[#ED0016] hover:bg-[#B80012] text-white text-sm font-medium rounded-xl transition-colors">Save Changes</button>
      </div>
    );

    if (active === 'users') return (
      <div className="space-y-5">
        <h2 className="text-base font-semibold text-slate-900">Users & Roles</h2>
        <div className="space-y-3">
          {roles.map(role => (
            <div key={role} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">{role}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {role === 'Super Admin' ? 'Full system access' :
                   role === 'Admin' ? 'Organization management' :
                   role === 'HR Manager' ? 'Employees, Attendance & Leave' :
                   role === 'Project Manager' ? 'Projects & Tasks' : 'Personal tasks & leave'}
                </p>
              </div>
              <button className="text-xs text-[#ED0016] hover:underline">Configure</button>
            </div>
          ))}
        </div>
      </div>
    );

    if (active === 'permissions') return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-base font-semibold text-slate-900">Permission Matrix</h2>
          <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none">
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Module</th>
                {permissions.map(p => (
                  <th key={p} className="px-3 py-3 text-center text-xs font-semibold text-slate-600">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modules.map(mod => (
                <tr key={mod} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{mod}</td>
                  {permissions.map(perm => {
                    const has = (rolePermissions[selectedRole]?.[mod] || []).includes(perm);
                    return (
                      <td key={perm} className="px-3 py-3 text-center">
                        <div className={`w-5 h-5 rounded mx-auto flex items-center justify-center ${has ? 'bg-green-500' : 'bg-slate-200'}`}>
                          {has && <span className="text-white text-[10px]">✓</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    if (active === 'notifications') return (
      <div className="space-y-5">
        <h2 className="text-base font-semibold text-slate-900">Notification Settings</h2>
        {['Email notifications', 'Task notifications', 'Leave notifications', 'Project notifications', 'Finance notifications'].map(item => (
          <div key={item} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-sm font-medium text-slate-900">{item}</span>
            <button onClick={() => toast(`${item} toggled.`)} className="w-11 h-6 bg-[#ED0016] rounded-full relative transition-colors">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow" />
            </button>
          </div>
        ))}
      </div>
    );

    if (active === 'security') return (
      <div className="space-y-5">
        <h2 className="text-base font-semibold text-slate-900">Security</h2>
        {[
          { label: 'Change Password', desc: 'Update your account password', action: 'Change' },
          { label: 'Two Factor Authentication', desc: 'Add an extra layer of security', action: 'Enable' },
          { label: 'Session Management', desc: 'Manage active sessions', action: 'View' },
          { label: 'Login History', desc: 'View recent login activity', action: 'View' },
        ].map(item => (
          <div key={item.label} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{item.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            <button onClick={() => toast(`${item.label} clicked.`)} className="px-4 h-9 border border-slate-200 bg-white text-sm text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex-shrink-0">{item.action}</button>
          </div>
        ))}
      </div>
    );

    if (active === 'integrations') return (
      <div className="space-y-5">
        <h2 className="text-base font-semibold text-slate-900">Integrations</h2>
        {[
          { label: 'Google Workspace', desc: 'Connect Gmail, Calendar and Drive', connected: false },
          { label: 'Slack', desc: 'Send notifications to Slack channels', connected: true },
          { label: 'WhatsApp', desc: 'Send WhatsApp notifications', connected: false },
          { label: 'Razorpay', desc: 'Process payments and invoices', connected: false },
        ].map(item => (
          <div key={item.label} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{item.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={() => toast(`${item.connected ? 'Disconnected from' : 'Connected to'} ${item.label}.`)}
              className={`px-4 h-9 text-sm font-medium rounded-xl transition-colors flex-shrink-0 ${item.connected ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-[#ED0016] text-white hover:bg-[#B80012]'}`}
            >
              {item.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    );

    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-sm">Settings panel for <strong>{sections.find(s => s.id === active)?.label}</strong> coming soon.</p>
      </div>
    );
  };

  return (
    <div className="flex gap-5 min-h-[calc(100vh-180px)]">
      {/* Sidebar nav */}
      <div className="w-52 flex-shrink-0">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-l-2 ${active === id ? 'border-[#ED0016] text-[#ED0016] bg-red-50/50 font-medium' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6">
        {renderContent()}
      </div>
    </div>
  );
}
