import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyRequests, cancelLeaveRequest } from '../slices/leaveSlice';
import Table from '../components/Table';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiXCircle, FiFileText } from 'react-icons/fi';

const MyRequests = () => {
  const dispatch = useDispatch();
  const { myRequests, loading } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(getMyRequests());
  }, [dispatch]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      try {
        await dispatch(cancelLeaveRequest(id)).unwrap();
        toast.success('Leave request cancelled successfully');
        dispatch(getMyRequests());
      } catch (error) {
        toast.error(error.message || 'Failed to cancel request');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLeaveType = (type) => {
    return type
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const columns = [
    { header: 'Leave Type', accessor: 'leaveType' },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    { header: 'Days', accessor: 'totalDays' },
    { header: 'Status', accessor: 'status' },
    { header: 'Reason', accessor: 'reason' },
    { header: 'Manager Comment', accessor: 'managerComment' },
    { header: 'Actions', accessor: 'actions' },
  ];

  const tableData = myRequests?.map((request) => ({
    _id: request._id,
    id: request._id,
    leaveType: formatLeaveType(request.leaveType),
    startDate: formatDate(request.startDate),
    endDate: formatDate(request.endDate),
    totalDays: request.totalDays,
    status: request.status,
    reason: (
      <div className="max-w-xs truncate" title={request.reason}>
        {request.reason}
      </div>
    ),
    managerComment: request.managerComment && request.managerComment.trim() ? (
      <div className="max-w-xs truncate" title={request.managerComment}>
        {request.managerComment}
      </div>
    ) : (
      <span className="text-slate-400">-</span>
    ),
    actions:
      request.status === 'pending' ? (
        <button
          onClick={() => handleCancel(request._id)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold text-sm rounded-lg transition-all duration-200"
        >
          <FiXCircle />
          Cancel
        </button>
      ) : (
        <span className="text-slate-400">-</span>
      ),
  }));

  return (
    <div className="p-6 animate-fade-in max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Leave Requests</h1>
          <p className="text-slate-600">View and manage your leave requests</p>
        </div>
        <button
          onClick={() => dispatch(getMyRequests())}
          className="btn-secondary"
        >
          <FiRefreshCw className="text-lg" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-slate-600 font-medium">Loading requests...</p>
          </div>
        </div>
      ) : myRequests?.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 p-16 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-slate-100 mb-6">
            <FiFileText className="text-4xl text-slate-400" />
          </div>
          <p className="text-slate-700 text-lg font-semibold mb-2">No leave requests found</p>
          <p className="text-slate-500">
            Click on "Apply Leave" to submit your first request
          </p>
        </div>
      ) : (
        <Table columns={columns} data={tableData} />
      )}
    </div>
  );
};

export default MyRequests;
