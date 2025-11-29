import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchManagerDashboard } from '../slices/dashboardSlice';
import Card from '../components/Card';
import { Link } from 'react-router-dom';
import { 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiBarChart2,
  FiUsers,
  FiArrowUp,
  FiFileText
} from 'react-icons/fi';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchManagerDashboard());
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

  const approvalRate = stats?.totalRequests > 0
    ? Math.round((stats?.approvedRequests / stats?.totalRequests) * 100)
    : 0;

  return (
    <div className="p-6 animate-fade-in max-w-screen-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Manager Dashboard</h1>
        <p className="text-slate-600">Team overview and leave management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Pending Requests"
          value={stats?.pendingRequests || 0}
          subtitle="Awaiting Review"
          color="yellow"
          icon={FiClock}
        />
        <Card
          title="Approved Requests"
          value={stats?.approvedRequests || 0}
          subtitle="This Month"
          color="green"
          icon={FiCheckCircle}
        />
        <Card
          title="Rejected Requests"
          value={stats?.rejectedRequests || 0}
          subtitle="This Month"
          color="red"
          icon={FiXCircle}
        />
        <Card
          title="Total Requests"
          value={stats?.totalRequests || 0}
          subtitle="All Time"
          color="blue"
          icon={FiBarChart2}
        />
      </div>

      {/* Quick Actions & Team Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/manager/pending"
              className="group flex items-center gap-4 p-5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <FiClock className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">
                  Review Pending Requests
                </h3>
                <p className="text-sm text-amber-100">
                  {stats?.pendingRequests || 0} request{stats?.pendingRequests !== 1 ? 's' : ''} awaiting review
                </p>
              </div>
            </Link>
            <Link
              to="/manager/all-requests"
              className="group flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <FiFileText className="text-2xl text-slate-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1 text-slate-900">View All Requests</h3>
                <p className="text-sm text-slate-600">Complete request history</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Team Statistics</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FiUsers className="text-blue-600 text-lg" />
                </div>
                <span className="text-slate-700 font-medium">Total Employees</span>
              </div>
              <span className="font-bold text-2xl text-slate-900">
                {stats?.totalEmployees || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <FiClock className="text-amber-600 text-lg" />
                </div>
                <span className="text-slate-700 font-medium">Active Requests</span>
              </div>
              <span className="font-bold text-2xl text-slate-900">
                {stats?.pendingRequests || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FiArrowUp className="text-emerald-600 text-lg" />
                </div>
                <span className="text-slate-700 font-medium">Approval Rate</span>
              </div>
              <span className="font-bold text-2xl text-emerald-600">
                {approvalRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert for Pending Requests */}
      {stats?.pendingRequests > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 shadow-md animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
              <FiClock className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <p className="text-amber-900 font-semibold text-lg mb-1">
                {stats.pendingRequests} request{stats.pendingRequests !== 1 ? 's' : ''} pending review
              </p>
              <p className="text-amber-700 text-sm">
                {stats.pendingRequests === 1 ? 'A leave request' : 'Leave requests'} {stats.pendingRequests === 1 ? 'is' : 'are'} waiting for your approval.
              </p>
            </div>
            <Link
              to="/manager/pending"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Review Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
