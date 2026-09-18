import { useState, useRef, useEffect } from "react";
import { Menu, Bell, Search } from "lucide-react";

export interface NotificationItem {
  id: number | string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  notifications?: NotificationItem[];
  onViewAllNotifications?: () => void;
}

const defaultNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "New Quotation Request",
    message: "Client Apex Systems requested a quote for Web CRM",
    time: "10m ago",
    read: false,
  },
  {
    id: 2,
    title: "Task Overdue Alert",
    message: "2 tasks in Software Development are overdue",
    time: "1h ago",
    read: false,
  },
  {
    id: 3,
    title: "Leave Approved",
    message: "HR approved leave request for Muthu Subash",
    time: "3h ago",
    read: true,
  },
];

export function Header({
  title,
  subtitle,
  onMenuClick,
  notifications = defaultNotifications,
  onViewAllNotifications,
}: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-slate-900 leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-56 focus-within:border-red-400 transition-colors">
        <Search size={14} className="text-slate-400 flex-shrink-0" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
        />
      </div>

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Toggle notifications"
        >
          <Bell size={20} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#ED0016] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 z-50">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-900 text-sm">Notifications</span>
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(false);
                  if (onViewAllNotifications) onViewAllNotifications();
                }}
                className="text-xs font-semibold text-[#ED0016] hover:underline"
              >
                View all
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
              {notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 hover:bg-slate-50 transition-colors ${
                    !n.read ? "bg-red-50/40" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-[#ED0016] mt-1.5 flex-shrink-0" />
                    )}
                    <div className={!n.read ? "" : "ml-5"}>
                      <p className="text-sm font-medium text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
