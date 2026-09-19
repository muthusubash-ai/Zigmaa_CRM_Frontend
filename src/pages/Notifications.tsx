import { useState } from 'react';
import { Bell, CheckCheck, CheckSquare, FolderKanban, Users, CalendarOff, Wallet, Settings } from 'lucide-react';
import { notifications as initialNotifs } from '@/data/mockData';
import { useToast } from '@/components/ui/Toast';

const tabs = ['All', 'Tasks', 'Projects', 'Employees', 'Leave', 'Finance', 'System'];

const typeIcons: Record<string, React.ReactNode> = {
  task: <CheckSquare size={15} className="text-[#ED0016]" />,
  project: <FolderKanban size={15} className="text-purple-600" />,
  employee: <Users size={15} className="text-cyan-600" />,
  leave: <CalendarOff size={15} className="text-amber-600" />,
  finance: <Wallet size={15} className="text-green-600" />,
  system: <Settings size={15} className="text-slate-600" />,
};

const typeBgs: Record<string, string> = {
  task: 'bg-red-50', project: 'bg-purple-50', employee: 'bg-cyan-50',
  leave: 'bg-amber-50', finance: 'bg-green-50', system: 'bg-slate-100',
};

export default function Notifications() {
  const { toast } = useToast();
  const [notifs, setNotifs] = useState(initialNotifs);
  const [tab, setTab] = useState('All');

  const filtered = tab === 'All' ? notifs : notifs.filter(n => n.type === tab.toLowerCase());
  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    toast('All notifications marked as read.');
  };

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-slate-600" />
            <h2 className="font-semibold text-slate-900">All Notifications</h2>
            {unread > 0 && (
              <span className="text-xs bg-[#ED0016] text-white px-2 py-0.5 rounded-full font-medium">{unread} unread</span>
            )}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm text-[#ED0016] hover:underline font-medium">
              <CheckCheck size={14} /> Mark all as read
            </button>
          )}
        </div>

        <div className="border-b border-slate-100 px-4 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-[#ED0016] text-[#ED0016]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Bell size={32} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No notifications in this category.</p>
            </div>
          )}
          {filtered.map(n => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-red-50/30' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeBgs[n.type] || 'bg-slate-100'}`}>
                  {typeIcons[n.type] || <Bell size={15} className="text-slate-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-400 whitespace-nowrap">{n.time}</span>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-[#ED0016] flex-shrink-0" />}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
