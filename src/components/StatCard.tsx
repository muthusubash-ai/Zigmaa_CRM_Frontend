import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  trend?: { value: string; up: boolean };
  suffix?: string;
}

export default function StatCard({ label, value, icon: Icon, iconBg = 'bg-red-50', iconColor = 'text-[#ED0016]', trend, suffix }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1.5">
            {value}{suffix && <span className="text-base font-medium text-slate-500 ml-0.5">{suffix}</span>}
          </p>
          {trend && (
            <p className={`text-xs mt-1.5 font-medium ${trend.up ? 'text-green-600' : 'text-red-500'}`}>
              {trend.up ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
    </div>
  );
}
