import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeDashboard } from "../slices/dashboardSlice.js";
import { getLeaveBalance } from "../slices/leaveSlice.js";
import Card from "../components/Card.jsx";
import { Link } from "react-router-dom";
import { 
  FiFileText, 
  FiList, 
  FiBarChart2,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiHeart,
  FiCoffee
} from "react-icons/fi";

export default function EmployeeDashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);
  const { leaveBalance } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchEmployeeDashboard());
    dispatch(getLeaveBalance());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in max-w-screen-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Employee Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your leave overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Total Requests"
          value={stats?.totalLeaves || 0}
          subtitle="All Time"
          color="blue"
          icon={FiBarChart2}
        />
        <Card
          title="Pending Requests"
          value={stats?.pending || 0}
          subtitle="Awaiting Review"
          color="yellow"
          icon={FiClock}
        />
        <Card
          title="Approved Requests"
          value={stats?.approved || 0}
          subtitle="Approved"
          color="green"
          icon={FiCheckCircle}
        />
        <Card
          title="Rejected Requests"
          value={stats?.rejected || 0}
          subtitle="Rejected"
          color="red"
          icon={FiXCircle}
        />
      </div>

      {/* Leave Balance Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Leave Balance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card
            title="Sick Leave"
            value={leaveBalance?.sickLeave || 0}
            subtitle="Days Remaining"
            color="blue"
            icon={FiHeart}
          />
          <Card
            title="Casual Leave"
            value={leaveBalance?.casualLeave || 0}
            subtitle="Days Remaining"
            color="green"
            icon={FiCoffee}
          />
          <Card
            title="Vacation Leave"
            value={leaveBalance?.vacationLeave || 0}
            subtitle="Days Remaining"
            color="purple"
            icon={FiCalendar}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/employee/apply"
            className="group flex items-center gap-4 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <FiFileText className="text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Apply for Leave</h3>
              <p className="text-sm text-blue-100">Submit a new leave request</p>
            </div>
          </Link>
          <Link
            to="/employee/requests"
            className="group flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <FiList className="text-2xl text-slate-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1 text-slate-900">View My Requests</h3>
              <p className="text-sm text-slate-600">Check your leave history</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
