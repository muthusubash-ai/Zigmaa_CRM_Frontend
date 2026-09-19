import { useState } from 'react';
import { Clock, CheckCircle, XCircle, CalendarOff, Check, X, Eye } from 'lucide-react';
import { leaveRequests as initialLeaves } from '@/data/mockData';
import StatCard from '@/components/ui/StatCard';
import { statusBadge } from '@/components/ui/badge';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

type Leave = typeof initialLeaves[number];

export default function LeaveRequests() {
  const { toast } = useToast();
  const [leaves, setLeaves] = useState(initialLeaves);
  const [tab, setTab] = useState('All');
  const [detail, setDetail] = useState<Leave | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);

  const tabs = ['All', 'Pending', 'Approved', 'Rejected'];
  const pending = leaves.filter(l => l.status === 'Pending').length;
  const approved = leaves.filter(l => l.status === 'Approved').length;
  const rejected = leaves.filter(l => l.status === 'Rejected').length;
  const onLeaveToday = leaves.filter(l => l.status === 'Approved').length;

  const filtered = tab === 'All' ? leaves : leaves.filter(l => l.status === tab);

  const approve = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved' } : l));
    toast('Leave request approved.');
    setDetail(null);
  };

  const reject = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected' } : l));
    toast('Leave request rejected.', 'warning');
    setRejectTarget(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Pending" value={pending} icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Approved" value={approved} icon={CheckCircle} iconBg="bg-green-50" iconColor="text-green-600" />
        <StatCard label="Rejected" value={rejected} icon={XCircle} iconBg="bg-red-50" iconColor="text-red-600" />
        <StatCard label="On Leave Today" value={onLeaveToday} icon={CalendarOff} iconBg="bg-red-50" iconColor="text-[#ED0016]" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-100 px-4 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-[#ED0016] text-[#ED0016]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t} {t !== 'All' && <span className="ml-1 text-xs bg-slate-100 px-1.5 py-0.5 rounded-full">{leaves.filter(l => l.status === t).length}</span>}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Employee', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Reason', 'Applied On', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-xs font-bold">{l.employeeName[0]}</div>
                      <span className="text-sm font-medium text-slate-900 whitespace-nowrap">{l.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{l.type}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{l.start}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{l.end}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 text-center">{l.days}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 max-w-36 truncate">{l.reason}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{l.applied}</td>
                  <td className="px-4 py-3.5">{statusBadge(l.status)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setDetail(l)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-[#ED0016] transition-colors" title="View"><Eye size={14} /></button>
                      {l.status === 'Pending' && (
                        <>
                          <button onClick={() => approve(l.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-green-50 hover:text-green-600 transition-colors" title="Approve"><Check size={14} /></button>
                          <button onClick={() => setRejectTarget(l.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Reject"><X size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Leave Request Details" size="md">
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-[#ED0016] flex items-center justify-center text-white text-xl font-bold">{detail.employeeName[0]}</div>
              <div>
                <p className="font-semibold text-slate-900">{detail.employeeName}</p>
                <p className="text-sm text-slate-500">{detail.type}</p>
              </div>
              <div className="ml-auto">{statusBadge(detail.status)}</div>
            </div>
            {[
              { label: 'Start Date', value: detail.start },
              { label: 'End Date', value: detail.end },
              { label: 'Duration', value: `${detail.days} day${detail.days > 1 ? 's' : ''}` },
              { label: 'Applied On', value: detail.applied },
              { label: 'Reason', value: detail.reason },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <span className="text-sm text-slate-500 shrink-0">{label}</span>
                <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
              </div>
            ))}
            {detail.status === 'Pending' && (
              <div className="flex gap-3 pt-2">
                <button onClick={() => approve(detail.id)} className="flex-1 h-10 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Check size={14} /> Approve
                </button>
                <button onClick={() => { setRejectTarget(detail.id); setDetail(null); }} className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                  <X size={14} /> Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject modal */}
      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Leave Request" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Please provide a reason for rejecting this leave request.</p>
          <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="Rejection reason..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none" />
          <div className="flex gap-3">
            <button onClick={() => setRejectTarget(null)} className="flex-1 h-10 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
            <button onClick={() => rejectTarget && reject(rejectTarget)} className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">Reject</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
