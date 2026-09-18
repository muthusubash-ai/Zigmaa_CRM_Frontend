import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Clock3,
  Code2,
  FileText,
  Film,
  FolderKanban,
  IndianRupee,
  LayoutDashboard,
  Loader2,
  LogOut,
  Settings,
  TrendingUp,
  Users,


  WalletCards,
  X,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { getSuperAdminDashboard, type SuperAdminDashboardData } from "@/lib/dashboard";

import type { AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface SuperAdminDashboardProps {
  user: AuthUser;
  isSigningOut: boolean;
  onLogout: () => Promise<void>;
}

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Employees", icon: Users },
  { label: "Projects", icon: FolderKanban },
  { label: "Tasks", icon: ClipboardCheck },
  { label: "Attendance", icon: CalendarCheck2 },
  { label: "Leave requests", icon: Clock3 },
  { label: "Finance", icon: WalletCards },
  { label: "Documents", icon: FileText },
  { label: "Settings", icon: Settings },
];

const mockDepartments = [
  {
    id: "film-production",
    name: "Film & Media Production",
    head: "Subash K",
    progress: 85,
    employees: 12,
    tasks: 24,
    completedTasks: 20,
    pendingTasks: 4,
    overdueTasks: 0,
    projects: 3,
    icon: Film,
  },
  {
    id: "software-dev",
    name: "Software & IT Development",
    head: "Muthu Subash",
    progress: 72,
    employees: 18,
    tasks: 36,
    completedTasks: 26,
    pendingTasks: 8,
    overdueTasks: 2,
    projects: 5,
    icon: Code2,
  },
  {
    id: "sales-marketing",
    name: "Sales & Marketing",
    head: "Pavishna M",
    progress: 90,
    employees: 8,
    tasks: 15,
    completedTasks: 13,
    pendingTasks: 2,
    overdueTasks: 0,
    projects: 2,
    icon: TrendingUp,
  },
];

const mockActiveProjects = [
  { id: 1, name: "Zigmaa CRM v2.0 Platform", progress: 75, deadline: "25 Sep 2026" },
  { id: 2, name: "Client Portal & Quotation Builder", progress: 40, deadline: "10 Oct 2026" },
  { id: 3, name: "Mobile App API Integration", progress: 90, deadline: "30 Sep 2026" },
];

export function SuperAdminDashboard({ user, isSigningOut, onLogout }: SuperAdminDashboardProps) {
  const [data, setData] = useState<SuperAdminDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getSuperAdminDashboard()
      .then((dashboard) => {
        if (active) setData(dashboard);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Dashboard data could not be loaded.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const displayDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(data ? new Date(`${data.date}T00:00:00`) : new Date()),
    [data],
  );

  // Computed metric metrics from live API or fallbacks
  const totalEmp = data?.metrics.total_employees ?? 38;
  const presentToday = Math.round(totalEmp * 0.92);
  const absentToday = totalEmp - presentToday;
  const attendancePct = Math.round((presentToday / totalEmp) * 100);

  const totalTasks = (data?.metrics.completed_tasks ?? 59) + (data?.metrics.today_tasks ?? 16);
  const completedTasks = data?.metrics.completed_tasks ?? 59;
  const pendingTasks = data?.metrics.today_tasks ?? 14;
  const overdueTasks = data?.metrics.overdue_tasks ?? 2;

  const activeProjectsCount = data?.metrics.active_projects ?? 8;
  const completedProjectsCount = 14;

  const revenueLakhs = data?.metrics.today_revenue
    ? (Number(data.metrics.today_revenue) / 100000).toFixed(1)
    : "1.5";

  const sidebar = (
    <>
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-5">
        <img src="/zigmaa-logo.webp" alt="Zigmaa Tech" className="size-10 rounded-xl object-cover border border-white/10" />
        <div>
          <p className="font-semibold text-white">Zigmaa Tech</p>
          <p className="text-xs text-slate-400">Admin workspace</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition",
                item.active
                  ? "bg-[#ED0016] text-white shadow-lg shadow-red-950/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon className="size-4" />
              {item.label}
              {item.active && <ChevronRight className="ml-auto size-4" />}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-3">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-800/70 p-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-red-600 font-semibold text-white">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user.full_name}</p>
            <p className="truncate text-xs text-slate-400">{user.role}</p>
          </div>
        </div>
        <Button
          className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
          variant="outline"
          onClick={onLogout}
          disabled={isSigningOut}
        >
          {isSigningOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
          Sign out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-slate-950 lg:flex">{sidebar}</aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative flex h-full w-72 flex-col bg-slate-950 shadow-2xl">
            <Button
              className="absolute right-3 top-5 z-10 text-slate-300"
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="size-5" />
            </Button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top Header */}
        <Header
          title="Super Admin Dashboard"
          subtitle={displayDate}
          onMenuClick={() => setMobileMenuOpen(true)}
        />


        {/* Main Dashboard Content */}
        <main className="space-y-6 p-5 sm:p-8">
          {error && (
            <Alert className="border-red-200 bg-red-50 text-red-800">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="grid min-h-64 place-items-center rounded-2xl border bg-white">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2 className="size-5 animate-spin text-red-600" /> Loading dashboard...
              </div>
            </div>
          ) : (
            <>
              {/* Welcome banner */}
              <div className="bg-gradient-to-r from-[#08090B] to-[#1a0003] rounded-2xl p-6 text-white shadow-xl shadow-slate-950/20">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-red-300 text-sm font-medium mb-1">{displayDate}</p>
                    <h2 className="text-2xl font-bold">Good to see you, {user.full_name.split(" ")[0]}.</h2>
                    <p className="text-slate-300 text-sm mt-1">Here is what is happening across Zigmaa Tech today.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Systems operational
                  </div>
                </div>
              </div>

              {/* ── 4 Primary Summary Cards ─── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {/* Attendance */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                      <Clock size={20} className="text-[#ED0016]" />
                    </div>
                    <span className="flex items-center gap-1 text-xs text-[#ED0016] font-medium group-hover:underline">
                      View <ArrowUpRight size={12} />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">Today's Attendance</p>
                  <p className="text-2xl font-bold text-slate-900">{presentToday}/{totalEmp}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />Present: {presentToday}
                    </span>
                    <span className="flex items-center gap-1 text-red-500 font-medium">
                      <div className="w-2 h-2 rounded-full bg-red-400" />Absent: {absentToday}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Attendance rate</span>
                      <span className="font-semibold text-slate-700">{attendancePct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-1.5 bg-red-500 rounded-full transition-all duration-500" style={{ width: `${attendancePct}%` }} />
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-purple-600" />
                    </div>
                    <span className="flex items-center gap-1 text-xs text-purple-600 font-medium group-hover:underline">
                      View <ArrowUpRight size={12} />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">Tasks Overview</p>
                  <p className="text-2xl font-bold text-slate-900">{totalTasks} Total</p>
                  <div className="mt-3 grid grid-cols-3 gap-1 text-xs">
                    <div className="text-center bg-emerald-50 rounded-lg py-1.5">
                      <p className="font-bold text-emerald-700">{completedTasks}</p>
                      <p className="text-emerald-600 text-[11px]">Done</p>
                    </div>
                    <div className="text-center bg-amber-50 rounded-lg py-1.5">
                      <p className="font-bold text-amber-700">{pendingTasks}</p>
                      <p className="text-amber-600 text-[11px]">Pending</p>
                    </div>
                    <div className="text-center bg-red-50 rounded-lg py-1.5">
                      <p className="font-bold text-red-700">{overdueTasks}</p>
                      <p className="text-red-600 text-[11px]">Overdue</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-1.5 bg-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((completedTasks / totalTasks) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{Math.round((completedTasks / totalTasks) * 100)}% complete</p>
                  </div>
                </div>

                {/* Active Projects */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <FolderKanban size={20} className="text-emerald-600" />
                    </div>
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium group-hover:underline">
                      View <ArrowUpRight size={12} />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">Active Projects</p>
                  <p className="text-2xl font-bold text-slate-900">{activeProjectsCount}</p>
                  <div className="mt-3 flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />Completed
                      </span>
                      <span className="font-semibold text-slate-700">{completedProjectsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />In Progress
                      </span>
                      <span className="font-semibold text-slate-700">{activeProjectsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400" />Delayed
                      </span>
                      <span className="font-semibold text-slate-700">1</span>
                    </div>
                  </div>
                </div>

                {/* Revenue */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <IndianRupee size={20} className="text-amber-600" />
                    </div>
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-medium group-hover:underline">
                      View <ArrowUpRight size={12} />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">₹{revenueLakhs}L</p>
                  <div className="mt-3 flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">This month</span>
                      <span className="font-semibold text-emerald-600">₹1,50,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pending</span>
                      <span className="font-semibold text-amber-600">₹85,000</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <TrendingUp size={12} /><span>+12% from last month</span>
                  </div>
                </div>
              </div>

              {/* ── Department Overview ─── */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Department Overview</h2>
                    <p className="text-xs text-slate-500">Performance summary across all departments</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-sm text-[#ED0016] hover:underline font-semibold">
                    View all <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockDepartments.map((dept) => {
                    const Icon = dept.icon;
                    return (
                      <div key={dept.id} className="bg-white rounded-xl border border-slate-200/80 p-5 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                              <Icon size={17} className="text-[#ED0016]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 text-sm">{dept.name}</h3>
                              <p className="text-xs text-slate-400">Lead: {dept.head}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                            {dept.progress}%
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                          <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                            <p className="font-bold text-slate-900">{dept.employees}</p>
                            <p className="text-slate-400 text-[11px]">Staff</p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                            <p className="font-bold text-slate-900">{dept.tasks}</p>
                            <p className="text-slate-400 text-[11px]">Tasks</p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                            <p className="font-bold text-slate-900">{dept.projects}</p>
                            <p className="text-slate-400 text-[11px]">Projects</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                            <span>Work Progress</span>
                            <span className="text-emerald-600 font-semibold">{dept.completedTasks}/{dept.tasks} done</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-2 bg-red-500 rounded-full transition-all duration-500" style={{ width: `${dept.progress}%` }} />
                          </div>
                        </div>
                        <button className="w-full text-xs text-[#ED0016] border border-red-200 rounded-lg py-2 hover:bg-red-50 transition-colors font-semibold">
                          View Department →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Team Task Performance + Active Projects ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Team Task Performance Table */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Team Task Performance</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Department-wise breakdown</p>
                    </div>
                    <button className="text-xs text-[#ED0016] hover:underline font-semibold flex items-center gap-1">
                      View All <ArrowRight size={12} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wide">
                          {["Department", "Total", "Completed", "Pending", "Overdue"].map((h) => (
                            <th key={h} className="px-4 py-2.5 text-left font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {mockDepartments.map((dept) => (
                          <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-900">{dept.name}</td>
                            <td className="px-4 py-3 text-slate-700">{dept.tasks}</td>
                            <td className="px-4 py-3 text-emerald-600 font-bold">{dept.completedTasks}</td>
                            <td className="px-4 py-3 text-amber-600 font-bold">{dept.pendingTasks}</td>
                            <td className="px-4 py-3">
                              <span className={cn("font-bold", dept.overdueTasks > 0 ? "text-red-600" : "text-slate-400")}>
                                {dept.overdueTasks}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Active Projects List */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Active Projects</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{activeProjectsCount} in progress</p>
                    </div>
                    <button className="text-xs text-[#ED0016] hover:underline font-semibold">View all</button>
                  </div>
                  <div className="p-4 space-y-3">
                    {mockActiveProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-slate-50/80 border border-slate-100 rounded-xl hover:bg-slate-100/80 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p className="text-xs font-semibold text-slate-900 truncate flex-1">{p.name}</p>
                          <span className="text-xs text-[#ED0016] font-bold flex-shrink-0">{p.progress}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
                          <Calendar size={11} /><span>Due: {p.deadline}</span>
                        </div>
                        <div className="h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                          <div className="h-1.5 bg-red-500 rounded-full transition-all duration-500" style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Overdue Warning Banner */}
              {overdueTasks > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                  <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-900">{overdueTasks} overdue tasks require immediate attention</p>
                    <p className="text-xs text-red-700 mt-0.5">Review, reassign, or update task deadlines across project teams.</p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs">
                    Review Tasks
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
