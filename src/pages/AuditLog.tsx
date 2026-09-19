import { useState } from 'react';
import { Search, Download, ScrollText } from 'lucide-react';
import { auditLogs as initial } from '@/data/mockData';

const extraLogs = [
  { id: 'LOG006', user: 'Zigmaa Super Admin', action: 'Created', module: 'User Management', description: 'Created user Vikram Nair (USR009)', date: '2026-09-15', time: '11:00 AM' },
  { id: 'LOG007', user: 'Zigmaa Super Admin', action: 'Updated', module: 'Roles & Permissions', description: 'Granted Export permission for Reports to Sales Manager role', date: '2026-09-14', time: '03:15 PM' },
  { id: 'LOG008', user: 'Zigmaa Super Admin', action: 'Deactivated', module: 'User Management', description: 'Deactivated user Deepa M (USR007)', date: '2026-09-12', time: '10:45 AM' },
  { id: 'LOG009', user: 'Meena R', action: 'Approved', module: 'Leave', description: 'Approved leave request LVE002 for Deepa M', date: '2026-09-12', time: '09:30 AM' },
  { id: 'LOG010', user: 'Zigmaa Super Admin', action: 'Created', module: 'Roles & Permissions', description: 'Created new role: Support Executive', date: '2026-09-10', time: '02:00 PM' },
  { id: 'LOG011', user: 'Zigmaa Super Admin', action: 'Reset Password', module: 'User Management', description: 'Reset password for Karthik V (USR006)', date: '2026-09-08', time: '11:30 AM' },
  { id: 'LOG012', user: 'System', action: 'Failed Login', module: 'Security', description: 'Failed login attempt for ravi@zigmaatech.com from 192.168.1.99', date: '2026-09-07', time: '07:15 AM' },
];

const allLogs = [...extraLogs, ...initial.map(l => ({ ...l, id: l.id }))];

const modules = ['All', 'User Management', 'Roles & Permissions', 'Security', 'Leave', 'Project', 'Employee', 'Task', 'Settings'];
const actions = ['All', 'Created', 'Updated', 'Deleted', 'Approved', 'Rejected', 'Deactivated', 'Reset Password', 'Failed Login', 'Completed'];

const actionColors: Record<string, string> = {
  Created: 'bg-green-50 text-green-700',
  Updated: 'bg-red-50 text-red-700',
  Deleted: 'bg-red-50 text-red-700',
  Approved: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-red-50 text-red-600',
  Deactivated: 'bg-amber-50 text-amber-700',
  'Reset Password': 'bg-purple-50 text-purple-700',
  'Failed Login': 'bg-red-50 text-red-600',
  Completed: 'bg-cyan-50 text-cyan-700',
};

export default function AuditLog() {
  const [search, setSearch] = useState('');
  const [module, setModule] = useState('All');
  const [action, setAction] = useState('All');

  const filtered = allLogs.filter(l => {
    const q = search.toLowerCase();
    return (
      (l.user.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)) &&
      (module === 'All' || l.module === module) &&
      (action === 'All' || l.action === action)
    );
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-52">
          <Search size={15} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audit log..." className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400" />
        </div>
        <select value={module} onChange={e => setModule(e.target.value)} className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none">
          {modules.map(m => <option key={m}>{m}</option>)}
        </select>
        <select value={action} onChange={e => setAction(e.target.value)} className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none">
          {actions.map(a => <option key={a}>{a}</option>)}
        </select>
        <button className="flex items-center gap-2 px-4 h-10 border border-slate-200 bg-white text-slate-700 text-sm rounded-xl hover:bg-slate-50 transition-colors">
          <Download size={14} /> Export
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <ScrollText size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No audit log entries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['User', 'Action', 'Module', 'Description', 'Date', 'Time'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{l.user[0]}</div>
                        <span className="text-sm font-medium text-slate-900 whitespace-nowrap">{l.user}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${actionColors[l.action] || 'bg-slate-50 text-slate-600'}`}>{l.action}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{l.module}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-700 max-w-72">{l.description}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{l.date}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{l.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
            Showing {filtered.length} of {allLogs.length} entries
          </div>
        )}
      </div>
    </div>
  );
}
