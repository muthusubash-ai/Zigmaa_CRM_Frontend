import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { crmRoles as initialRoles, CrmRole } from '@/data/mockData';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';

const allModules = ['Dashboard', 'Customers', 'Contacts', 'Leads', 'Deals', 'Pipeline', 'Tasks', 'Calendar', 'Activities', 'Reports', 'Notifications', 'User Management', 'Roles & Permissions', 'Audit Log', 'Settings'];
const allPerms = ['View', 'Create', 'Edit', 'Delete', 'Export', 'Manage'];

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-purple-50 text-purple-700 border-purple-200',
  Admin: 'bg-red-50 text-red-700 border-red-200',
  Manager: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Sales Executive': 'bg-green-50 text-green-700 border-green-200',
  'Support Executive': 'bg-amber-50 text-amber-700 border-amber-200',
  Viewer: 'bg-slate-50 text-slate-700 border-slate-200',
};

const initForm = { name: '', description: '', status: 'Active' };

export default function RolesPermissions() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<CrmRole[]>(initialRoles);
  const [selected, setSelected] = useState<CrmRole | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CrmRole | null>(null);
  const [form, setForm] = useState(initForm);

  const handleCreate = () => {
    if (!form.name) { toast('Role name is required.', 'error'); return; }
    const newRole: CrmRole = {
      id: `ROL${String(roles.length + 1).padStart(3, '0')}`,
      name: form.name,
      users: 0,
      description: form.description,
      status: form.status,
      permissions: Object.fromEntries(allModules.map(m => [m, []])),
    };
    setRoles(prev => [...prev, newRole]);
    setForm(initForm);
    setCreateOpen(false);
    toast('Role created successfully.');
  };

  const handleDelete = (role: CrmRole) => {
    setRoles(prev => prev.filter(r => r.id !== role.id));
    if (selected?.id === role.id) setSelected(null);
    toast('Role deleted.', 'warning');
  };

  const getPermCount = (role: CrmRole) => {
    return Object.values(role.permissions).reduce((s: number, arr: string[]) => s + (arr?.length || 0), 0);
  };

  const renderHierarchy = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">
        Access Control Hierarchy
      </h3>

      <div className="flex items-center justify-center w-full overflow-x-auto">
        {[
          {
            label: 'Super Admin',
            sub: 'Full system access',
            color: 'bg-purple-600',
          },
          {
            label: 'Roles',
            sub: `${roles.length} defined roles`,
            color: 'bg-[#ED0016]',
          },
          {
            label: 'Users',
            sub: '9 total users',
            color: 'bg-cyan-600',
          },
          {
            label: 'Permissions',
            sub: 'Module-level access control',
            color: 'bg-slate-600',
          },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center">
            <div
              className={`${item.color} text-white rounded-xl px-6 py-2.5 text-sm font-semibold text-center min-w-48`}
            >
              <p>{item.label}</p>
              <p className="text-xs font-normal opacity-80 mt-0.5">
                {item.sub}
              </p>
            </div>
            {i < 3 && (
              <div className="w-10 h-px bg-slate-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {renderHierarchy()}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-slate-500">{roles.length} roles defined</p>
        <button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 px-4 h-10 bg-[#ED0016] hover:bg-[#B80012] text-white text-sm font-medium rounded-xl transition-colors">
          <Plus size={15} /> Create Role
        </button>
      </div>

      {/* Roles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(role => (
          <div
            key={role.id}
            onClick={() => setSelected(role)}
            className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${selected?.id === role.id ? 'border-red-500 ring-2 ring-blue-100' : 'border-slate-200'}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roleColors[role.name] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                {role.name}
              </span>
              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <button className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-[#ED0016] transition-colors"><Pencil size={12} /></button>
                {role.name !== 'Super Admin' && (
                  <button onClick={() => setDeleteTarget(role)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={12} /></button>
                )}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-900 mb-1">{role.users} {role.users === 1 ? 'User' : 'Users'}</p>
            <p className="text-xs text-slate-500 mb-3 line-clamp-2">{role.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{getPermCount(role)} permissions</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${role.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>{role.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix for selected role */}
      {selected && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">Permission Matrix — {selected.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{selected.description}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 h-8 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Select All</button>
              <button className="px-3 h-8 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Clear All</button>
              <button onClick={() => toast('Permissions updated successfully.')} className="px-3 h-8 text-xs bg-[#ED0016] hover:bg-[#B80012] text-white rounded-lg transition-colors">Save Permissions</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Module</th>
                  {allPerms.map(p => <th key={p} className="px-3 py-3 text-center font-semibold text-slate-600">{p}</th>)}
                  <th className="px-3 py-3 text-center font-semibold text-slate-600">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allModules.map(mod => {
                  const granted = (selected.permissions as Record<string, string[]>)[mod] || [];
                  const allGranted = allPerms.every(p => granted.includes(p));
                  return (
                    <tr key={mod} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-medium text-slate-800">{mod}</td>
                      {allPerms.map(perm => {
                        const has = granted.includes(perm);
                        return (
                          <td key={perm} className="px-3 py-2.5 text-center">
                            <input type="checkbox" defaultChecked={has} className="w-3.5 h-3.5 rounded text-[#ED0016] border-slate-300 cursor-pointer" />
                          </td>
                        );
                      })}
                      <td className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => {}}
                          className={`w-9 h-5 rounded-full relative transition-colors ${allGranted ? 'bg-[#ED0016]' : 'bg-slate-200'}`}
                        >
                          <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 shadow transition-all ${allGranted ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 border-t border-slate-100 flex gap-3 justify-end">
            <button onClick={() => setSelected(null)} className="px-4 h-9 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
            <button onClick={() => toast('Permissions updated successfully.')} className="px-4 h-9 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">Save Permissions</button>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Role" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sales Manager" className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe this role's responsibilities..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500">
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setCreateOpen(false)} className="flex-1 h-11 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
            <button onClick={handleCreate} className="flex-1 h-11 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">Create Role</button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="Delete Role?"
        message={`Delete the "${deleteTarget?.name}" role? Users assigned to this role will need to be reassigned.`}
        confirmLabel="Delete Role"
      />
    </div>
  );
}
