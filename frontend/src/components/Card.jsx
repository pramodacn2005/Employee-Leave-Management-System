import { 
  FiBarChart2, 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiAlertCircle,
  FiArrowUp
} from "react-icons/fi";

export default function Card({ title, value, subtitle, color = "default", icon }) {
  const colorConfig = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
      border: "border-blue-200/50",
      text: "text-blue-700",
      value: "text-blue-600",
      iconBg: "bg-blue-500",
      shadow: "shadow-blue-500/10",
    },
    green: {
      bg: "bg-gradient-to-br from-emerald-50 to-green-50",
      border: "border-emerald-200/50",
      text: "text-emerald-700",
      value: "text-emerald-600",
      iconBg: "bg-emerald-500",
      shadow: "shadow-emerald-500/10",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-violet-50",
      border: "border-purple-200/50",
      text: "text-purple-700",
      value: "text-purple-600",
      iconBg: "bg-purple-500",
      shadow: "shadow-purple-500/10",
    },
    yellow: {
      bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
      border: "border-amber-200/50",
      text: "text-amber-700",
      value: "text-amber-600",
      iconBg: "bg-amber-500",
      shadow: "shadow-amber-500/10",
    },
    red: {
      bg: "bg-gradient-to-br from-rose-50 to-red-50",
      border: "border-rose-200/50",
      text: "text-rose-700",
      value: "text-rose-600",
      iconBg: "bg-rose-500",
      shadow: "shadow-rose-500/10",
    },
    default: {
      bg: "bg-white",
      border: "border-slate-200",
      text: "text-slate-700",
      value: "text-slate-900",
      iconBg: "bg-slate-500",
      shadow: "shadow-slate-500/10",
    },
  };

  const config = colorConfig[color] || colorConfig.default;
  const Icon = icon || FiArrowUp;

  return (
    <div
      className={`${config.bg} ${config.border} rounded-2xl border p-6 shadow-lg ${config.shadow} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className={`text-sm font-medium ${config.text} mb-1`}>{title}</p>
          <p className={`text-4xl font-bold ${config.value} mb-2`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>
        <div className={`${config.iconBg} rounded-xl p-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </div>
  );
}
