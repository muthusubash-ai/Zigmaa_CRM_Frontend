import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import {
  LayoutDashboard, Users, FolderKanban, CheckSquare,
  Clock, CalendarOff, Wallet, FileText, Settings,
  LogOut, X, ChevronLeft, ChevronRight,
  ShieldCheck, ScrollText, Bell, Building2, Briefcase,
} from 'lucide-react';

const logo = '/zigmaa-logo.webp';

const navMain = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', module: 'dashboard' },
  { to: '/employees', icon: Users, label: 'Employees', module: 'employees' },
  { to: '/departments', icon: Building2, label: 'Departments', module: 'departments' },
  { to: '/clients', icon: Briefcase, label: 'Clients', module: 'clients' },
  { to: '/projects', icon: FolderKanban, label: 'Projects', module: 'projects' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks', module: 'tasks' },
  { to: '/attendance', icon: Clock, label: 'Attendance', module: 'attendance' },
  { to: '/leave-requests', icon: CalendarOff, label: 'Leave Requests', module: 'leave' },
  { to: '/revenue', icon: Wallet, label: 'Revenue', module: 'finance' },
  { to: '/documents', icon: FileText, label: 'Documents', module: 'documents' },
];

const navSystem = [
  { to: '/notifications', icon: Bell, label: 'Notifications', module: 'notifications' },
  { to: '/roles', icon: ShieldCheck, label: 'Roles & Permissions', module: 'roles' },
  { to: '/audit-log', icon: ScrollText, label: 'Audit Log', module: 'audit_log' },
  { to: '/settings', icon: Settings, label: 'Settings', module: 'settings' },
];

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  onClose: () => void;
}

function NavItem({ to, icon: Icon, label, collapsed, onClose }: NavItemProps) {
  const [tip, setTip] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => collapsed && setTip(true)}
      onMouseLeave={() => setTip(false)}
    >
      <NavLink
        to={to}
        onClick={onClose}
        className={({ isActive }) =>
          `relative flex items-center text-sm font-medium transition-all duration-150 group
           ${collapsed ? 'justify-center py-2.5 mx-1 rounded-lg' : 'gap-3 px-3 py-2.5 mx-2 rounded-lg'}
           ${isActive
             ? 'bg-[#FFF1F2] text-[#ED0016]'
             : 'text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111111]'}`
        }
      >
        {({ isActive }) => (
          <>
            {/* 3px left indicator */}
            {!collapsed && isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#ED0016] rounded-r-full" />
            )}
            <Icon
              size={18}
              className={`flex-shrink-0 ${isActive ? 'text-[#ED0016]' : 'text-[#9CA3AF] group-hover:text-[#374151]'}`}
            />
            {!collapsed && <span className="truncate">{label}</span>}
          </>
        )}
      </NavLink>
      {collapsed && tip && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[100] pointer-events-none">
          <div className="bg-[#111111] text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

interface SidebarContentProps {
  collapsed: boolean;
  onToggle: () => void;
  onClose: () => void;
  isMobile?: boolean;
}

function SidebarContent({ collapsed, onToggle, onClose, isMobile = false }: SidebarContentProps) {
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();
  const visibleMain = navMain.filter(item => can(item.module));
  const visibleSystem = navSystem.filter(item => can(item.module));

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#E5E7EB]">
      {/* Header */}
      <div className={`border-b border-[#E5E7EB] flex items-center flex-shrink-0 h-[64px] ${collapsed ? 'px-2 justify-center' : 'px-4 gap-3'}`}>
        <img src={logo} alt="Zigmaa Tech" className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
        {!collapsed && (
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="text-[#111111] font-bold text-sm leading-tight truncate">Zigmaa Tech</div>
            <div className="text-[#9CA3AF] text-xs truncate">{user?.role ?? 'Workspace'}</div>
          </div>
        )}
        {!collapsed && !isMobile && (
          <button
            onClick={onToggle}
            title="Collapse Sidebar"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#374151] transition-colors flex-shrink-0"
          >
            <ChevronLeft size={15} />
          </button>
        )}
        {collapsed && !isMobile && (
          <button
            onClick={onToggle}
            title="Expand Sidebar"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#374151] transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        )}
        {isMobile && (
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F3F4F6] flex-shrink-0">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-visible">
        <div className="space-y-0.5">
          {visibleMain.map(item => (
            <NavItem key={item.to} {...item} collapsed={collapsed} onClose={onClose} />
          ))}
        </div>

        {!collapsed ? (
          <p className="px-5 pt-5 pb-1.5 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">System</p>
        ) : (
          <div className="my-3 mx-4 border-t border-[#E5E7EB]" />
        )}
        <div className="space-y-0.5">
          {visibleSystem.map(item => (
            <NavItem key={item.to} {...item} collapsed={collapsed} onClose={onClose} />
          ))}
        </div>
      </nav>

      {/* Profile footer */}
      <div className={`border-t border-[#E5E7EB] flex-shrink-0 ${collapsed ? 'p-2' : 'p-3'}`}>
        {collapsed ? (
          <div className="relative flex justify-center group/profile">
            <NavLink
              to="/profile"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-sm font-bold hover:bg-[#B80012] transition-colors"
            >
              Z
            </NavLink>
            <div className="absolute left-full bottom-0 ml-3 z-[100] hidden group-hover/profile:block pointer-events-auto">
              <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xl w-52 overflow-hidden">
                <NavLink to="/profile" onClick={onClose} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">Z</div>
                  <div className="min-w-0">
                    <p className="text-[#111111] text-xs font-semibold truncate">{user?.name}</p>
                    <p className="text-[#667085] text-[11px] truncate">{user?.role}</p>
                  </div>
                </NavLink>
                <div className="border-t border-[#E5E7EB]">
                  <button
                    onClick={async () => { await logout(); navigate('/login'); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[#374151] hover:bg-[#FFF1F2] hover:text-[#ED0016] transition-colors text-sm"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative group/profile">
            <NavLink
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">Z</div>
              <div className="min-w-0 flex-1">
                <div className="text-[#111111] text-xs font-semibold truncate">{user?.name}</div>
                <div className="text-[#667085] text-xs truncate">{user?.role}</div>
              </div>
              <LogOut size={14} className="text-[#9CA3AF] flex-shrink-0 opacity-0 group-hover/profile:opacity-100 transition-opacity" />
            </NavLink>
            <div className="absolute left-0 right-0 bottom-full mb-1 z-[100] hidden group-hover/profile:block pointer-events-auto">
              <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden">
                <NavLink to="/profile" onClick={onClose} className="flex items-center gap-2.5 px-4 py-2.5 text-[#374151] hover:bg-[#F9FAFB] transition-colors text-sm">
                  <Users size={14} className="text-[#9CA3AF]" />
                  <span>My Profile</span>
                </NavLink>
                {can('settings') && (
                  <NavLink to="/settings" onClick={onClose} className="flex items-center gap-2.5 px-4 py-2.5 text-[#374151] hover:bg-[#F9FAFB] transition-colors text-sm">
                    <Settings size={14} className="text-[#9CA3AF]" />
                    <span>Settings</span>
                  </NavLink>
                )}
                <div className="border-t border-[#E5E7EB]">
                  <button
                    onClick={async () => { await logout(); navigate('/login'); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[#374151] hover:bg-[#FFF1F2] hover:text-[#ED0016] transition-colors text-sm"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:block flex-shrink-0 h-screen sticky top-0"
        style={{
          width: collapsed ? 72 : 270,
          transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          minWidth: collapsed ? 72 : 270,
        }}
      >
        <SidebarContent collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} onClose={() => {}} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <aside className="relative w-[270px] flex flex-col z-50">
            <SidebarContent collapsed={false} onToggle={() => {}} onClose={onClose} isMobile />
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
