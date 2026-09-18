import { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Clock, Plus, Download, DollarSign, BarChart3, Search, ChevronDown } from 'lucide-react';
import { invoices as initialInvoices, transactions } from '@/data/mockData';
import { statusBadge } from '@/components/ui/badge';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const chartData = [
  { period: 'Jan', revenue: 280000, expenses: 200000 },
  { period: 'Feb', revenue: 350000, expenses: 220000 },
  { period: 'Mar', revenue: 420000, expenses: 180000 },
  { period: 'Apr', revenue: 800000, expenses: 230000 },
  { period: 'May', revenue: 585000, expenses: 680500 },
  { period: 'Jun', revenue: 325000, expenses: 195000 },
];

const chartPeriods = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
const paymentMethods = ['Bank Transfer', 'Cash', 'Credit Card', 'UPI', 'Cheque'];
const deptOptions = ['Development', 'Digital Marketing', 'Video Editing', 'HR', 'Finance'];
const statusOptions = ['Paid', 'Pending', 'Partially Paid', 'Overdue'];

const initForm = {
  client: '', project: '', department: 'Development', invoiceNo: '',
  amount: '', tax: '', paymentDate: '', method: 'Bank Transfer',
  status: 'Pending', notes: '',
};

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function Finance() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(initForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [chartPeriod, setChartPeriod] = useState('Monthly');

  // Summary stats
  const totalRevenue = invoices.reduce((s, i) => s + i.total, 0);
  const todayRevenue = invoices.filter(i => i.status === 'Paid').slice(0, 2).reduce((s, i) => s + i.total, 0);
  const thisMonthRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const pendingAmount = invoices.filter(i => i.status === 'Pending' || i.status === 'Partially Paid').reduce((s, i) => s + i.total, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
  const netRevenue = thisMonthRevenue - totalExpenses;

  const filtered = invoices.filter(inv => {
    const q = search.toLowerCase();
    return (
      (inv.id.toLowerCase().includes(q) || inv.client.toLowerCase().includes(q) || inv.project.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || inv.status === statusFilter) &&
      (deptFilter === 'All' || inv.department === deptFilter)
    );
  });

  const handleAdd = () => {
    if (!form.client || !form.amount) { toast('Client and amount are required.', 'error'); return; }
    const amt = Number(form.amount);
    const tax = Number(form.tax) || 0;
    const newInv = {
      ...form,
      id: `INV${String(invoices.length + 1).padStart(3, '0')}`,
      amount: amt,
      tax,
      total: amt + tax,
    };
    setInvoices(prev => [newInv, ...prev]);
    setForm(initForm);
    setAddOpen(false);
    toast('Revenue record added successfully.');
  };

  const summaryCards = [
    { label: 'Total Revenue', value: fmt(totalRevenue), icon: TrendingUp, iconBg: 'bg-green-50', iconColor: 'text-green-600', trend: '+12.5%', trendUp: true },
    { label: "Today's Revenue", value: fmt(todayRevenue), icon: DollarSign, iconBg: 'bg-[#ED0016]/10', iconColor: 'text-[#ED0016]', trend: '+8.2%', trendUp: true },
    { label: 'This Month', value: fmt(thisMonthRevenue), icon: BarChart3, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', trend: '+18.4%', trendUp: true },
    { label: 'Pending Payments', value: fmt(pendingAmount), icon: Clock, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', trend: '-3.1%', trendUp: false },
    { label: 'Expenses', value: fmt(totalExpenses), icon: TrendingDown, iconBg: 'bg-red-50', iconColor: 'text-red-500', trend: '+5.3%', trendUp: false },
    { label: 'Net Revenue', value: fmt(netRevenue), icon: Wallet, iconBg: netRevenue >= 0 ? 'bg-emerald-50' : 'bg-orange-50', iconColor: netRevenue >= 0 ? 'text-emerald-600' : 'text-orange-600', trend: netRevenue >= 0 ? '+9.1%' : '-9.1%', trendUp: netRevenue >= 0 },
  ];

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon size={18} className={card.iconColor} />
              </div>
              <span className={`text-xs font-medium ${card.trendUp ? 'text-green-600' : 'text-red-500'}`}>{card.trend}</span>
            </div>
            <p className="text-lg font-bold text-slate-900 leading-tight">{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h3 className="font-semibold text-slate-900">Revenue Overview</h3>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
            {chartPeriods.map(p => (
              <button
                key={p}
                onClick={() => setChartPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${chartPeriod === p ? 'bg-[#ED0016] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v: unknown) => `₹${(Number(v) / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: unknown) => `₹${Number(v).toLocaleString('en-IN')}`} contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="revenue" name="Revenue" fill="#ED0016" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#94A3B8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-48">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1">
              <Search size={13} className="text-slate-400 flex-shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search invoices..."
                className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Departments</option>
                {deptOptions.map(d => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                {statusOptions.map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <button className="flex items-center gap-2 px-3 h-9 border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition-colors">
              <Download size={13} /> Export
            </button>
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-3 h-9 bg-[#ED0016] hover:bg-[#B80012] text-white text-sm font-medium rounded-lg transition-colors">
              <Plus size={13} /> Add Revenue
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Invoice ID', 'Client', 'Project', 'Department', 'Amount', 'Tax', 'Total', 'Payment Date', 'Method', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-slate-400">No invoices found</td>
                </tr>
              ) : filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 text-xs font-mono text-slate-500 whitespace-nowrap">{inv.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-slate-900 whitespace-nowrap">{inv.client}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap max-w-36 truncate">{inv.project}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">{inv.department}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-slate-900 whitespace-nowrap">{fmt(inv.amount)}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-500 whitespace-nowrap">{fmt(inv.tax)}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-slate-900 whitespace-nowrap">{fmt(inv.total)}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{inv.paymentDate}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{inv.method}</td>
                  <td className="px-4 py-3.5">{statusBadge(inv.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
            Showing {filtered.length} of {invoices.length} invoices
          </div>
        )}
      </div>

      {/* Add Revenue Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Revenue Record" size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Client Name *</label>
            <input value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))} placeholder="ABC Technologies" className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Project Name</label>
            <input value={form.project} onChange={e => setForm(p => ({ ...p, project: e.target.value }))} placeholder="Website Redesign" className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department</label>
            <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500">
              {deptOptions.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Invoice No.</label>
            <input value={form.invoiceNo} onChange={e => setForm(p => ({ ...p, invoiceNo: e.target.value }))} placeholder="INV-2024-009" className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Amount (₹) *</label>
            <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="100000" className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tax (₹)</label>
            <input type="number" value={form.tax} onChange={e => setForm(p => ({ ...p, tax: e.target.value }))} placeholder="18000" className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Payment Date</label>
            <input type="date" value={form.paymentDate} onChange={e => setForm(p => ({ ...p, paymentDate: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Payment Method</label>
            <select value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500">
              {paymentMethods.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500">
              {statusOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Notes</label>
            <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Additional notes..." className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setAddOpen(false)} className="flex-1 h-11 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
          <button onClick={handleAdd} className="flex-1 h-11 bg-[#ED0016] hover:bg-[#B80012] text-white rounded-xl text-sm font-medium transition-colors">Add Revenue</button>
        </div>
      </Modal>
    </div>
  );
}
