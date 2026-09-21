import { useEffect, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

import { useToast } from '@/components/ui/Toast';
import type { PermissionMatrix, PermissionScope } from '@/lib/auth';
import {
  getSystemRoles,
  permissionActions,
  permissionScopes,
  updateRolePermissions,
  type SystemRole,
} from '@/lib/roles';

const modules = [
  'dashboard', 'employees', 'departments', 'clients', 'projects', 'tasks',
  'attendance', 'leave', 'finance', 'documents', 'users', 'roles',
  'audit_log', 'notifications', 'settings',
];

const labels: Record<string, string> = {
  dashboard: 'Dashboard', employees: 'Employees', departments: 'Departments',
  clients: 'Clients', projects: 'Projects', tasks: 'Tasks',
  attendance: 'Attendance', leave: 'Leave Requests', finance: 'Finance',
  documents: 'Documents', users: 'User Management', roles: 'Roles & Permissions',
  audit_log: 'Audit Log', notifications: 'Notifications', settings: 'Settings',
};

const roleColor: Record<string, string> = {
  'Super Admin': 'border-purple-200 bg-purple-50 text-purple-700',
  HR: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  Employee: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

function cloneMatrix(matrix: PermissionMatrix): PermissionMatrix {
  return Object.fromEntries(
    modules.map(module => [
      module,
      {
        actions: [...(matrix[module]?.actions ?? [])],
        scope: matrix[module]?.scope ?? 'none',
      },
    ]),
  );
}

export default function RolesPermissions() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [selected, setSelected] = useState<SystemRole | null>(null);
  const [draft, setDraft] = useState<PermissionMatrix>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSystemRoles()
      .then(items => setRoles(items))
      .catch(requestError => setError(
        requestError instanceof Error ? requestError.message : 'Roles could not be loaded.',
      ))
      .finally(() => setLoading(false));
  }, []);

  function selectRole(role: SystemRole) {
    setSelected(role);
    setDraft(cloneMatrix(role.permissions));
  }

  function toggleAction(module: string, action: typeof permissionActions[number]) {
    if (!selected?.is_editable) return;
    setDraft(previous => {
      const rule = previous[module] ?? { actions: [], scope: 'none' as PermissionScope };
      const enabled = rule.actions.includes(action);
      const actions = enabled
        ? rule.actions.filter(item => item !== action)
        : [...rule.actions, action];
      return {
        ...previous,
        [module]: {
          actions,
          scope: actions.length && rule.scope === 'none' ? 'own' : rule.scope,
        },
      };
    });
  }

  function updateScope(module: string, scope: PermissionScope) {
    if (!selected?.is_editable) return;
    setDraft(previous => ({
      ...previous,
      [module]: {
        actions: scope === 'none' ? [] : (previous[module]?.actions ?? []),
        scope,
      },
    }));
  }

  async function save() {
    if (!selected?.is_editable) return;
    setSaving(true);
    try {
      const updated = await updateRolePermissions(selected.id, draft);
      setRoles(previous => previous.map(role => role.id === updated.id ? updated : role));
      selectRole(updated);
      toast('Permissions updated successfully.');
    } catch (requestError) {
      toast(requestError instanceof Error ? requestError.message : 'Permissions could not be saved.', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="grid min-h-64 place-items-center"><Loader2 className="size-6 animate-spin text-[#ED0016]" /></div>;
  }

  return (
    <div className="space-y-5">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-red-50 text-[#ED0016]"><ShieldCheck size={19} /></span>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Three-role access control</h2>
            <p className="text-xs text-slate-500">Super Admin, HR and Employee permissions are enforced by the API.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {roles.map(role => (
          <button
            key={role.id}
            type="button"
            onClick={() => selectRole(role)}
            className={`rounded-xl border bg-white p-5 text-left transition hover:shadow-md ${selected?.id === role.id ? 'border-[#ED0016] ring-2 ring-red-100' : 'border-slate-200'}`}
          >
            <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${roleColor[role.name]}`}>{role.name}</span>
            <p className="mt-3 text-sm font-semibold text-slate-900">{role.user_count} {role.user_count === 1 ? 'User' : 'Users'}</p>
            <p className="mt-1 text-xs text-slate-500">{role.description}</p>
          </button>
        ))}
      </div>

      {selected && (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="font-semibold text-slate-900">Permission Matrix - {selected.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {selected.is_editable ? 'Actions and record scope can be configured.' : 'Super Admin always has full access.'}
              </p>
            </div>
            {selected.is_editable && (
              <button type="button" onClick={save} disabled={saving} className="flex h-9 items-center gap-2 rounded-lg bg-[#ED0016] px-4 text-sm font-medium text-white hover:bg-[#B80012] disabled:opacity-60">
                {saving && <Loader2 size={14} className="animate-spin" />} Save Permissions
              </button>
            )}
          </header>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-xs">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Module</th>
                  {permissionActions.map(action => <th key={action} className="px-3 py-3 text-center font-semibold capitalize text-slate-600">{action}</th>)}
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Data Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modules.map(module => {
                  const rule = draft[module] ?? { actions: [], scope: 'none' as PermissionScope };
                  return (
                    <tr key={module} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{labels[module]}</td>
                      {permissionActions.map(action => (
                        <td key={action} className="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={rule.actions.includes(action)}
                            onChange={() => toggleAction(module, action)}
                            disabled={!selected.is_editable}
                            className="size-4 accent-[#ED0016] disabled:cursor-not-allowed"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-2">
                        <select
                          value={rule.scope}
                          onChange={event => updateScope(module, event.target.value as PermissionScope)}
                          disabled={!selected.is_editable}
                          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 capitalize disabled:bg-slate-50"
                        >
                          {permissionScopes.map(scope => <option key={scope} value={scope}>{scope}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
