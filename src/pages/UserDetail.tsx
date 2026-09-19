import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Briefcase, Building2, UserX, Pencil, ShieldCheck, CheckCircle, XCircle, Clock, Monitor, Globe } from 'lucide-react';
import { crmUsers, crmRoles } from '@/data/mockData';
import { useToast } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

const allModules = ['Dashboard', 'Customers', 'Contacts', 'Leads', 'Deals', 'Pipeline', 'Tasks', 'Calendar', 'Activities', 'Reports', 'Notifications', 'User Management', 'Roles & Permissions', 'Audit Log', 'Settings'];
const allPerms = ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'];

const statusStyles: Record<string, string> = {
  Active: 'bg-green-50 text-green-700 border-green-200',
  Inactive: 'bg-gray-50 text-gray-600 border-gray-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Suspended: 'bg-red-50 text-red-700 border-red-200',
  Successful: 'bg-green-50 text-green-700',
  Failed: 'bg-red-50 text-red-600',
  Blocked: 'bg-red-100 text-red-700',
};

const activity = [
  { time: '10:42 AM', action: 'Created new customer record' },
  { time: '10:35 AM', action: 'Updated deal — Q3 Software License' },
  { time: '10:20 AM', action: 'Completed task — Follow up with client' },
  { time: '09:50 AM', action: 'Exported leads report' },
  { time: '09:30 AM', action: 'Logged in' },
];

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState('Overview');
  const [permMode, setPermMode] = useState<'role' | 'custom'>('role');
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [forceLogoutOpen, setForceLogoutOpen] = useState(false);
  const [user] = useState(crmUsers.find(u => u.id === id));

  if (!user) return (
    <div className="text-center py-20">
      <p className="text-slate-500">User not found.</p>
      <button onClick={() => navigate('/users')} className="mt-4 text-[#ED0016] hover:underline text-sm">Back to Users</button>
    </div>
  );

  const userRole = crmRoles.find(r => r.name === user.role) || crmRoles[crmRoles.length - 1];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Personal Information</h3>
        <div className="space-y-3">
          {[
            { icon: Mail, label: 'Email', value: user.email },
            { icon: Phone, label: 'Phone', value: user.phone },
            { icon: Briefcase, label: 'Job Title', value: user.jobTitle },
            { icon: Building2, label: 'Department', value: user.department },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Account Information</h3>
        <div className="space-y-3">
          {[
            { label: 'Role', value: user.role },
            { label: 'Status', value: user.status },
            { label: 'Created Date', value: user.created },
            { label: 'Last Login', value: user.lastLogin },
            { label: 'Reporting Manager', value: user.manager },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-3 py-1 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{label}</span>
              {label === 'Status' ? (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[value] || ''}`}>{value}</span>
              ) : (
                <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPermissions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-medium text-slate-700">Base Role: <span className="font-semibold text-slate-900">{user.role}</span></p>
          <p className="text-xs text-slate-400 mt-0.5">Permission mode controls how this user's access is determined.</p>
        </div>
      </div>
      <div className="flex gap-4">
        {(['role', 'custom'] as const).map(mode => (
          <label key={mode} className="flex items-center gap-2.5 cursor-pointer">
            <div onClick={() => setPermMode(mode)} className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${permMode === mode ? 'border-[#ED0016] bg-[#ED0016]' : 'border-slate-300'}`}>
              {permMode === mode && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="text-sm text-slate-700">{mode === 'role' ? 'Use Role Permissions' : 'Custom Permissions'}</span>
          </label>
        ))}
      </div>
      {permMode === 'custom' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          Custom permissions override the permissions inherited from this user's role.
        </div>
      )}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-2.5 text-left font-semibold text-slate-600">Module</th>
              {allPerms.map(p => <th key={p} className="px-3 py-2.5 text-center font-semibold text-slate-600">{p}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allModules.map(mod => {
              const granted = userRole.permissions[mod as keyof typeof userRole.permissions] || [];
              return (
                <tr key={mod} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-medium text-slate-800">{mod}</td>
                  {allPerms.map(perm => {
                    const has = granted.includes(perm);
                    return (
                      <td key={perm} className="px-3 py-2.5 text-center">
                        {permMode === 'custom' ? (
                          <input type="checkbox" defaultChecked={has} className="w-3.5 h-3.5 rounded text-[#ED0016] border-slate-300 cursor-pointer" />
                        ) : (
                          has
                            ? <CheckCircle size={14} className="text-green-500 mx-auto" />
                            : <XCircle size={14} className="text-slate-200 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {permMode === 'custom' && (
        <div className="flex gap-3">
          <button className="px-5 h-10 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
          <button onClick={() => toast('Permissions updated successfully.')} className="px-5 h-10 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">Save Permissions</button>
        </div>
      )}
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-0.5">
      {activity.map((a, i) => (
        <div key={i} className="flex items-start gap-4 py-3 border-b border-slate-50 last:border-0">
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <Clock size={13} className="text-[#ED0016]" />
          </div>
          <div>
            <p className="text-sm text-slate-900">{a.action}</p>
            <p className="text-xs text-slate-400 mt-0.5">{a.time} — Today</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLoginHistory = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {['Date & Time', 'IP Address', 'Device', 'Browser', 'Location', 'Status'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {user.loginHistory.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-10 text-sm text-slate-400">No login history.</td></tr>
          ) : user.loginHistory.map((l, i) => (
            <tr key={i} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">{l.datetime}</td>
              <td className="px-4 py-3 text-sm font-mono text-slate-600">{l.ip}</td>
              <td className="px-4 py-3 text-sm text-slate-600 flex items-center gap-1.5"><Monitor size={13} className="text-slate-400" />{l.device}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{l.browser}</td>
              <td className="px-4 py-3 text-sm text-slate-600 flex items-center gap-1.5"><Globe size={13} className="text-slate-400" />{l.location}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[l.status] || ''}`}>{l.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-5 max-w-5xl">
      <button onClick={() => navigate('/users')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} /> Back to User Management
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-[#ED0016] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">{user.name[0]}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[user.status] || ''}`}>{user.status}</span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{user.email}</p>
            <p className="text-slate-400 text-xs mt-0.5">{user.jobTitle} · {user.department}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 h-9 border border-slate-200 text-slate-700 text-sm rounded-xl hover:bg-slate-50 transition-colors">
              <Pencil size={13} /> Edit User
            </button>
            <button className="flex items-center gap-1.5 px-3 h-9 border border-red-200 text-[#ED0016] text-sm rounded-xl hover:bg-red-50 transition-colors">
              <ShieldCheck size={13} /> Manage Permissions
            </button>
            <button onClick={() => setDeactivateOpen(true)} className="flex items-center gap-1.5 px-3 h-9 border border-red-200 text-red-600 text-sm rounded-xl hover:bg-red-50 transition-colors">
              <UserX size={13} /> Deactivate
            </button>
            <button onClick={() => setForceLogoutOpen(true)} className="flex items-center gap-1.5 px-3 h-9 border border-amber-200 text-amber-600 text-sm rounded-xl hover:bg-amber-50 transition-colors">
              Force Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 px-4 flex gap-1 overflow-x-auto">
          {['Overview', 'Permissions', 'Activity', 'Login History'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-[#ED0016] text-[#ED0016]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="p-5">
          {tab === 'Overview' && renderOverview()}
          {tab === 'Permissions' && renderPermissions()}
          {tab === 'Activity' && renderActivity()}
          {tab === 'Login History' && renderLoginHistory()}
        </div>
      </div>

      <ConfirmModal
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={() => toast(`${user.name} has been deactivated.`, 'warning')}
        title="Deactivate User?"
        message={`Are you sure you want to deactivate ${user.name}? The user will no longer be able to access the CRM.`}
        confirmLabel="Deactivate"
      />
      <ConfirmModal
        open={forceLogoutOpen}
        onClose={() => setForceLogoutOpen(false)}
        onConfirm={() => toast(`${user.name} has been logged out from all sessions.`)}
        title="Force Logout?"
        message={`Force logout will terminate all active sessions for ${user.name}. They will need to log in again.`}
        confirmLabel="Force Logout"
        danger={false}
      />
    </div>
  );
}
