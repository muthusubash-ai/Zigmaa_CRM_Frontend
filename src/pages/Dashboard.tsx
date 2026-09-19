import { SuperAdminDashboard } from './SuperAdminDashboard';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const authUser = {
    id: 1,
    email: user?.email || 'admin@zigmaatech.com',
    full_name: user?.name || 'Zigmaa Super Admin',
    phone: '',
    profile_image: null,
    role: 'Super Admin',
  };

  return (
    <SuperAdminDashboard
      user={authUser}
      isSigningOut={false}
      onLogout={async () => { logout(); }}
    />
  );
}
