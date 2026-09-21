import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/auth-context';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/layout/Layout';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "517247763825-mkda7rnslk7ftedst48cc7sdkuj1dial.apps.googleusercontent.com";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import Attendance from './pages/Attendance';
import LeaveRequests from './pages/LeaveRequests';
import Finance from './pages/Finance';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import UserManagement from './pages/UserManagement';
import UserDetail from './pages/UserDetail';
import RolesPermissions from './pages/RolesPermissions';
import AuditLog from './pages/AuditLog';
import Departments from './pages/Departments';
import DepartmentDetail from './pages/DepartmentDetail';
import Clients from './pages/Clients';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PermissionRoute({ module, children }: { module: string; children: React.ReactNode }) {
  const { can } = useAuth();
  return can(module) ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/login" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="employees" element={<PermissionRoute module="employees"><Employees /></PermissionRoute>} />
                <Route path="departments" element={<PermissionRoute module="departments"><Departments /></PermissionRoute>} />
                <Route path="departments/:id" element={<PermissionRoute module="departments"><DepartmentDetail /></PermissionRoute>} />
                <Route path="clients" element={<PermissionRoute module="clients"><Clients /></PermissionRoute>} />
                <Route path="employees/:id" element={<PermissionRoute module="employees"><EmployeeDetail /></PermissionRoute>} />
                <Route path="projects" element={<PermissionRoute module="projects"><Projects /></PermissionRoute>} />
                <Route path="projects/:id" element={<PermissionRoute module="projects"><ProjectDetail /></PermissionRoute>} />
                <Route path="tasks" element={<PermissionRoute module="tasks"><Tasks /></PermissionRoute>} />
                <Route path="attendance" element={<PermissionRoute module="attendance"><Attendance /></PermissionRoute>} />
                <Route path="leave-requests" element={<PermissionRoute module="leave"><LeaveRequests /></PermissionRoute>} />
                <Route path="finance" element={<PermissionRoute module="finance"><Finance /></PermissionRoute>} />
                <Route path="revenue" element={<PermissionRoute module="finance"><Finance /></PermissionRoute>} />
                <Route path="documents" element={<PermissionRoute module="documents"><Documents /></PermissionRoute>} />
                <Route path="settings" element={<PermissionRoute module="settings"><Settings /></PermissionRoute>} />
                <Route path="profile" element={<Profile />} />
                <Route path="notifications" element={<PermissionRoute module="notifications"><Notifications /></PermissionRoute>} />
                <Route path="users" element={<PermissionRoute module="users"><UserManagement /></PermissionRoute>} />
                <Route path="users/:id" element={<PermissionRoute module="users"><UserDetail /></PermissionRoute>} />
                <Route path="roles" element={<PermissionRoute module="roles"><RolesPermissions /></PermissionRoute>} />
                <Route path="audit-log" element={<PermissionRoute module="audit_log"><AuditLog /></PermissionRoute>} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
