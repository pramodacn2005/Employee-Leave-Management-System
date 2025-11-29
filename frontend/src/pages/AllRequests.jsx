import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRequests } from '../slices/leaveSlice';
import Table from '../components/Table';
import { FiRefreshCw, FiFileText } from 'react-icons/fi';

const AllRequests = () => {
  const dispatch = useDispatch();
  const { allRequests, loading } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(getAllRequests());
  }, [dispatch]);

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
    { header: 'Employee', accessor: 'employee' },
    { header: 'Leave Type', accessor: 'leaveType' },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    { header: 'Days', accessor: 'totalDays' },
    { header: 'Status', accessor: 'status' },
    { header: 'Reason', accessor: 'reason' },
    { header: 'Manager Comment', accessor: 'managerComment' },
    { header: 'Applied On', accessor: 'createdAt' },
  ];

  const tableData = allRequests?.map((request) => ({
    _id: request._id,
    id: request._id,
    employee: request.user?.name || 'N/A',
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
    managerComment: request.managerComment ? (
      <div className="max-w-xs truncate" title={request.managerComment}>
        {request.managerComment}
      </div>
    ) : (
      <span className="text-slate-400">-</span>
    ),
    createdAt: formatDate(request.createdAt),
  }));

  return (
    <div className="p-6 animate-fade-in max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">All Leave Requests</h1>
          <p className="text-slate-600">Complete history of all leave requests</p>
        </div>
        <button
          onClick={() => dispatch(getAllRequests())}
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
      ) : allRequests?.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 p-16 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-slate-100 mb-6">
            <FiFileText className="text-4xl text-slate-400" />
          </div>
          <p className="text-slate-700 text-lg font-semibold mb-2">No leave requests found</p>
          <p className="text-slate-500">No leave requests have been submitted yet</p>
        </div>
      ) : (
        <Table columns={columns} data={tableData} />
      )}
    </div>
  );
};

export default AllRequests;
