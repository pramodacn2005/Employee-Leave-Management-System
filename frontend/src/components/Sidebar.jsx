import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  FiLayout, 
  FiFileText, 
  FiList, 
  FiUser,
  FiCheckCircle,
  FiClock,
  FiCalendar
} from "react-icons/fi";

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  if (!user) return null;

  const employeeLinks = [
    { to: "/employee/dashboard", label: "Dashboard", icon: FiLayout },
    { to: "/employee/apply", label: "Apply Leave", icon: FiFileText },
    { to: "/employee/requests", label: "My Requests", icon: FiList },
    { to: "/employee/calendar", label: "Leave Calendar", icon: FiCalendar },
    { to: "/employee/profile", label: "Profile", icon: FiUser },
  ];

  const managerLinks = [
    { to: "/manager/dashboard", label: "Dashboard", icon: FiLayout },
    { to: "/manager/pending", label: "Pending Requests", icon: FiClock },
    { to: "/manager/all-requests", label: "All Requests", icon: FiCheckCircle },
    { to: "/manager/calendar", label: "Leave Calendar", icon: FiCalendar },
  ];

  const links = user.role === "manager" ? managerLinks : employeeLinks;

  return (
    <aside className="w-64 flex-shrink-0 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 px-4 py-6 h-full sticky top-0">
      <div className="mb-8 px-3">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <span className="text-white font-bold text-lg">EL</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Leave Manager</h2>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon className="text-lg" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
