import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function formatCurrency(value: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: string) {
  const normalized = status.toLowerCase();
  if (["completed", "done"].includes(normalized)) return "bg-emerald-100 text-emerald-700";
  if (["in progress", "in_progress", "active"].includes(normalized)) return "bg-blue-100 text-blue-700";
  if (["blocked", "overdue"].includes(normalized)) return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

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

  const metrics = data
    ? [
        { label: "Today Tasks", value: data.metrics.today_tasks, icon: ClipboardCheck, tone: "blue" },
        { label: "Completed Tasks", value: data.metrics.completed_tasks, icon: CheckCircle2, tone: "emerald" },
        { label: "Today Revenue", value: formatCurrency(data.metrics.today_revenue), icon: CircleDollarSign, tone: "violet" },
        { label: "Active Projects", value: data.metrics.active_projects, icon: BriefcaseBusiness, tone: "cyan" },
        { label: "Employees", value: data.metrics.total_employees, icon: Users, tone: "indigo" },
        { label: "Pending Leaves", value: data.metrics.pending_leaves, icon: Clock3, tone: "amber" },
        { label: "Overdue Tasks", value: data.metrics.overdue_tasks, icon: CalendarCheck2, tone: "red" },
      ]
    : [];

  const toneClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    violet: "bg-violet-50 text-violet-700",
    cyan: "bg-cyan-50 text-cyan-700",
    indigo: "bg-indigo-50 text-indigo-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };

  const sidebar = (
    <>
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-5">
        <img src="/zigmaa-logo.webp" alt="Zigmaa Tech" className="size-10 rounded-xl object-cover" />
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
                item.active ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30" : "text-slate-300 hover:bg-slate-800 hover:text-white",
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
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-500 font-semibold text-white">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user.full_name}</p>
            <p className="truncate text-xs text-slate-400">{user.role}</p>
          </div>
        </div>
        <Button className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white" variant="outline" onClick={onLogout} disabled={isSigningOut}>
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
          <button className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-slate-950 shadow-2xl">
            <Button className="absolute right-3 top-5 z-10 text-slate-300" variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="size-5" />
            </Button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b bg-white/90 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <Button className="lg:hidden" variant="outline" size="icon" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="size-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Super Admin Dashboard</h1>
              <p className="hidden text-sm text-muted-foreground sm:block">{displayDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <div className="hidden items-center gap-2 rounded-full border bg-white py-1.5 pl-2 pr-3 sm:flex">
              <span className="grid size-8 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">{user.full_name.charAt(0).toUpperCase()}</span>
              <span className="max-w-32 truncate text-sm font-medium">{user.full_name}</span>
            </div>
          </div>
        </header>

        <main className="space-y-8 p-5 sm:p-8">
          <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-blue-700">Organization overview</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">Good to see you, {user.full_name.split(" ")[0]}.</h2>
              <p className="mt-1 text-sm text-muted-foreground">Here is what is happening across Zigmaa Tech today.</p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm">
              <span className="size-2 rounded-full bg-emerald-500" />
              Systems operational
            </div>
          </section>

          {error && (
            <Alert className="border-red-200 bg-red-50 text-red-800">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="grid min-h-64 place-items-center rounded-xl border bg-white">
              <div className="flex items-center gap-3 text-sm text-muted-foreground"><Loader2 className="size-5 animate-spin" /> Loading dashboard...</div>
            </div>
          ) : data ? (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={metric.label} className="border-slate-200/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <CardContent className="flex items-start justify-between p-5">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                          <p className="mt-3 text-3xl font-semibold tracking-tight">{metric.value}</p>
                        </div>
                        <span className={cn("grid size-11 place-items-center rounded-xl", toneClasses[metric.tone])}><Icon className="size-5" /></span>
                      </CardContent>
                    </Card>
                  );
                })}
              </section>

              <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
                <Card className="overflow-hidden border-slate-200/80 shadow-sm">
                  <CardHeader className="flex-row items-center justify-between border-b">
                    <div><CardTitle className="text-lg">Recent tasks</CardTitle><p className="mt-1 text-sm text-muted-foreground">Latest work across all teams</p></div>
                    <Button variant="outline" size="sm">View all</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {data.recent_tasks.length ? (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] text-left text-sm">
                          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-3 font-medium">Task</th><th className="px-4 py-3 font-medium">Assignee</th><th className="px-4 py-3 font-medium">Priority</th><th className="px-4 py-3 font-medium">Due date</th><th className="px-6 py-3 font-medium">Status</th></tr></thead>
                          <tbody className="divide-y">
                            {data.recent_tasks.map((task) => (
                              <tr key={task.id} className="hover:bg-slate-50/80"><td className="px-6 py-4"><p className="font-medium">{task.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{task.project ?? "General task"}</p></td><td className="px-4 py-4">{task.assignee}</td><td className="px-4 py-4 capitalize">{task.priority}</td><td className="px-4 py-4">{new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(`${task.due_date}T00:00:00`))}</td><td className="px-6 py-4"><span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusClass(task.status))}>{titleCase(task.status)}</span></td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="grid min-h-52 place-items-center px-6 text-center"><div><ClipboardCheck className="mx-auto size-9 text-slate-300" /><p className="mt-3 font-medium">No tasks yet</p><p className="mt-1 text-sm text-muted-foreground">Recent tasks will appear here.</p></div></div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-slate-200/80 shadow-sm">
                  <CardHeader><CardTitle className="text-lg">Admin access</CardTitle><p className="text-sm text-muted-foreground">Your organization controls</p></CardHeader>
                  <CardContent className="space-y-3">
                    {[{ label: "People management", icon: Users }, { label: "Project control", icon: FolderKanban }, { label: "Financial records", icon: CircleDollarSign }, { label: "System settings", icon: ShieldCheck }].map((item) => {
                      const Icon = item.icon;
                      return <button key={item.label} type="button" className="flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm font-medium transition hover:border-blue-200 hover:bg-blue-50"><span className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-700"><Icon className="size-4" /></span>{item.label}<ChevronRight className="ml-auto size-4 text-slate-400" /></button>;
                    })}
                  </CardContent>
                </Card>
              </section>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}
