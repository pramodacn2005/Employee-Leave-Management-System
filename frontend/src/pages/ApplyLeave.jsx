import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyLeave, getLeaveBalance, getMyRequests } from '../slices/leaveSlice';
import Card from '../components/Card';
import { toast } from 'react-toastify';
import { FiHeart, FiCoffee, FiCalendar, FiSend, FiAlertCircle } from 'react-icons/fi';

const ApplyLeave = () => {
  const dispatch = useDispatch();
  const { leaveBalance, loading } = useSelector((state) => state.leave);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    leaveType: 'sickLeave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    dispatch(getLeaveBalance());
  }, [dispatch]);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('Please fill all fields');
      return;
    }

    const totalDays = calculateDays(formData.startDate, formData.endDate);

    if (totalDays <= 0) {
      toast.error('End date must be after start date');
      return;
    }

    const balanceKey = formData.leaveType;
    const availableBalance = leaveBalance?.[balanceKey] || 0;

    if (totalDays > availableBalance) {
      toast.error(`Insufficient balance. Available: ${availableBalance} days`);
      return;
    }

    try {
      await dispatch(
        applyLeave({
          ...formData,
          totalDays,
        })
      ).unwrap();
      toast.success('Leave request submitted successfully');
      
      dispatch(getLeaveBalance());
      dispatch(getMyRequests());
      
      setFormData({
        leaveType: 'sickLeave',
        startDate: '',
        endDate: '',
        reason: '',
      });
    } catch (error) {
      toast.error(error.message || 'Failed to submit leave request');
    }
  };

  const totalDays = calculateDays(formData.startDate, formData.endDate);
  const balanceKey = formData.leaveType;
  const availableBalance = leaveBalance?.[balanceKey] || 0;

  const leaveTypeIcons = {
    sickLeave: FiHeart,
    casualLeave: FiCoffee,
    vacationLeave: FiCalendar,
  };

  return (
    <div className="p-6 animate-fade-in max-w-screen-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Apply for Leave</h1>
        <p className="text-slate-600">Submit a new leave request</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card
          title="Sick Leave"
          value={leaveBalance?.sickLeave || 0}
          subtitle="Available"
          color="blue"
          icon={FiHeart}
        />
        <Card
          title="Casual Leave"
          value={leaveBalance?.casualLeave || 0}
          subtitle="Available"
          color="green"
          icon={FiCoffee}
        />
        <Card
          title="Vacation Leave"
          value={leaveBalance?.vacationLeave || 0}
          subtitle="Available"
          color="purple"
          icon={FiCalendar}
        />
      </div>

      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Leave Request Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Leave Type
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 font-medium"
            >
              <option value="sickLeave">Sick Leave</option>
              <option value="casualLeave">Casual Leave</option>
              <option value="vacationLeave">Vacation Leave</option>
            </select>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Available: <span className="text-blue-600 font-bold">{availableBalance} days</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 font-medium"
                required
              />
            </div>
          </div>

          {formData.startDate && formData.endDate && (
            <div className={`p-5 rounded-xl border-2 ${
              totalDays > availableBalance 
                ? 'bg-rose-50 border-rose-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  totalDays > availableBalance ? 'bg-rose-500' : 'bg-blue-500'
                }`}>
                  {totalDays > availableBalance ? (
                    <FiAlertCircle className="text-white text-lg" />
                  ) : (
                    <FiCalendar className="text-white text-lg" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Total Days: <span className="text-lg">{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                  </p>
                  {totalDays > availableBalance && (
                    <p className="text-sm text-rose-700 font-medium mt-1">
                      Insufficient balance
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Reason
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 font-medium resize-none"
              placeholder="Please provide a detailed reason for your leave request..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || totalDays > availableBalance}
            className="w-full btn-primary text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend className="text-lg" />
            <span>{loading ? 'Submitting...' : 'Submit Leave Request'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
