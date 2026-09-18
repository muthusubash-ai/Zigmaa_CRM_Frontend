import { useState } from 'react';
import { Users, Clock, AlertCircle, CalendarOff, Download } from 'lucide-react';
import { attendanceRecords as initial } from '@/data/mockData';
import StatCard from '@/components/ui/StatCard';
import { statusBadge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/Toast';

export default function Attendance() {
  const { toast } = useToast();
  const [records] = useState(initial);
  const [date, setDate] = useState('2024-05-17');

  const present = records.filter(r => r.status === 'Present').length;
  const absent = records.filter(r => r.status === 'Absent').length;
  const late = records.filter(r => r.status === 'Late').length;
  const onLeave = records.filter(r => r.status === 'Leave').length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Present Today" value={present} icon={Users} iconBg="bg-green-50" iconColor="text-green-600" />
        <StatCard label="Absent" value={absent} icon={AlertCircle} iconBg="bg-red-50" iconColor="text-red-600" />
        <StatCard label="Late" value={late} icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="On Leave" value={onLeave} icon={CalendarOff} iconBg="bg-purple-50" iconColor="text-purple-600" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-900">Attendance Record</h3>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 h-9 border border-slate-200 text-slate-700 text-sm rounded-xl hover:bg-slate-50 transition-colors">
              <Download size={14} /> Export
            </button>
            <button onClick={() => toast('Attendance marked successfully.')} className="px-4 h-9 bg-[#ED0016] hover:bg-[#B80012] text-white text-sm font-medium rounded-xl transition-colors">
              Mark Attendance
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Employee', 'Date', 'Check In', 'Check Out', 'Working Hours', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#ED0016] flex items-center justify-center text-white text-xs font-bold">{r.employeeName[0]}</div>
                      <span className="text-sm font-medium text-slate-900 whitespace-nowrap">{r.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{r.checkIn}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{r.checkOut}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{r.hours}</td>
                  <td className="px-4 py-3.5">{statusBadge(r.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Total Working Days', value: 22, color: 'text-slate-900' },
            { label: 'Present', value: 18, color: 'text-green-600' },
            { label: 'Absent', value: 2, color: 'text-red-600' },
            { label: 'Late', value: 1, color: 'text-amber-600' },
            { label: 'Attendance %', value: '81.8%', color: 'text-[#ED0016]' },
          ].map(item => (
            <div key={item.label} className="text-center p-3 bg-slate-50 rounded-xl">
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-slate-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
