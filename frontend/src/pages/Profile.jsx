import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaveBalance } from '../slices/leaveSlice';
import Card from '../components/Card';
import { FiUser, FiMail, FiShield, FiHeart, FiCoffee, FiCalendar } from 'react-icons/fi';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { leaveBalance } = useSelector((state) => state.leave);

  useEffect(() => {
    if (user?.role === 'employee') {
      dispatch(getLeaveBalance());
    }
  }, [dispatch, user]);

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  return (
    <div className="p-6 animate-fade-in max-w-screen-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
        <p className="text-slate-600">View and manage your profile information</p>
      </div>

      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-blue-500/25">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{user?.name}</h2>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
              <FiShield className="text-sm" />
              {user?.role}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <FiUser className="text-slate-600" />
              </div>
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Name
              </label>
            </div>
            <p className="text-lg font-bold text-slate-900 ml-13">{user?.name}</p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <FiMail className="text-slate-600" />
              </div>
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Email
              </label>
            </div>
            <p className="text-lg font-bold text-slate-900 ml-13">{user?.email}</p>
          </div>
        </div>
      </div>

      {user?.role === 'employee' && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Leave Balance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      )}
    </div>
  );
};

export default Profile;
