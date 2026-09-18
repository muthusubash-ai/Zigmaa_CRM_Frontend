import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import { Header } from "./header";

const pageMeta: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": {
    title: "Super Admin Dashboard",
    subtitle: "Friday, 18 September 2026 · Organization overview",
  },
  "/employees": {
    title: "Employees",
    subtitle: "Manage your organization's employees and team members.",
  },
  "/departments": {
    title: "Departments",
    subtitle: "Manage teams, employees, workload and performance.",
  },
  "/projects": {
    title: "Projects",
    subtitle: "Manage all active and completed projects.",
  },
  "/tasks": {
    title: "Tasks",
    subtitle: "Track and manage work across your teams.",
  },
  "/attendance": {
    title: "Attendance",
    subtitle: "Monitor employee attendance and working hours.",
  },
  "/leave-requests": {
    title: "Leave Requests",
    subtitle: "Review and manage employee leave applications.",
  },
  "/clients": {
    title: "Clients",
    subtitle: "Manage clients, projects, invoices and payments.",
  },
  "/revenue": {
    title: "Revenue",
    subtitle: "Monitor invoices, payments and financial records.",
  },
  "/documents": {
    title: "Documents",
    subtitle: "Centralized document management.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Manage your organization's configuration.",
  },
  "/profile": {
    title: "My Profile",
    subtitle: "View and manage your account details.",
  },
  "/notifications": {
    title: "Notifications",
    subtitle: "Stay updated with the latest activity.",
  },
  "/roles": {
    title: "Roles & Permissions",
    subtitle: "Define what each user role can view, create, edit, delete, and manage.",
  },
  "/audit-log": {
    title: "Audit Log",
    subtitle: "Track all system actions and permission changes.",
  },
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const basePath = "/" + (location.pathname.split("/")[1] || "dashboard");
  const meta = pageMeta[basePath] || { title: "Zigmaa CRM", subtitle: "" };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8FA]">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
export { Layout };
