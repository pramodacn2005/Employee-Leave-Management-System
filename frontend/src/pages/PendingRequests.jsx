import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPendingRequests, approveLeave, rejectLeave } from '../slices/leaveSlice';
import Table from '../components/Table';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiCheckCircle, FiXCircle, FiClock, FiFileText, FiUser } from 'react-icons/fi';

const PendingRequests = () => {
  const dispatch = useDispatch();
  const { pendingRequests, loading } = useSelector((state) => state.leave);
  const [actionLoading, setActionLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(getPendingRequests());
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

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setActionType('approve');
    setShowModal(true);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setActionType('reject');
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!comment.trim() && actionType === 'reject') {
      toast.error('Please provide a comment for rejection');
      return;
    }

    setActionLoading(selectedRequest._id);
    try {
      if (actionType === 'approve') {
        await dispatch(
          approveLeave({ id: selectedRequest._id, comment: comment.trim() })
        ).unwrap();
        toast.success('Leave request approved successfully');
      } else {
        await dispatch(
          rejectLeave({ id: selectedRequest._id, comment: comment.trim() })
        ).unwrap();
        toast.success('Leave request rejected');
      }
      setShowModal(false);
      setComment('');
      setSelectedRequest(null);
      dispatch(getPendingRequests());
    } catch (error) {
      toast.error(error.message || 'Failed to process request');
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Leave Type', accessor: 'leaveType' },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    { header: 'Days', accessor: 'totalDays' },
    { header: 'Reason', accessor: 'reason' },
    { header: 'Applied On', accessor: 'createdAt' },
    { header: 'Actions', accessor: 'actions' },
  ];

  const tableData = pendingRequests?.map((request) => ({
    _id: request._id,
    id: request._id,
    employee: request.user?.name || 'N/A',
    leaveType: formatLeaveType(request.leaveType),
    startDate: formatDate(request.startDate),
    endDate: formatDate(request.endDate),
    totalDays: request.totalDays,
    reason: (
      <div className="max-w-xs truncate" title={request.reason}>
        {request.reason}
      </div>
    ),
    createdAt: formatDate(request.createdAt),
    actions: (
      <div className="flex gap-2">
        <button
          onClick={() => handleApprove(request)}
          disabled={actionLoading === request._id}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-gray-400 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <FiCheckCircle />
          Approve
        </button>
        <button
          onClick={() => handleReject(request)}
          disabled={actionLoading === request._id}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:bg-gray-400 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <FiXCircle />
          Reject
        </button>
      </div>
    ),
  }));

  return (
    <div className="p-6 animate-fade-in max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Pending Leave Requests</h1>
          <p className="text-slate-600">Review and approve or reject leave requests</p>
        </div>
        <button
          onClick={() => dispatch(getPendingRequests())}
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
      ) : pendingRequests?.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 p-16 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6">
            <FiCheckCircle className="text-4xl text-emerald-600" />
          </div>
          <p className="text-slate-700 text-lg font-semibold mb-2">No pending requests</p>
          <p className="text-slate-500">All requests have been processed</p>
        </div>
      ) : (
        <Table columns={columns} data={tableData} />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up border border-slate-200">
            <div className="flex items-center gap-4 mb-6">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                actionType === 'approve' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}>
                {actionType === 'approve' ? (
                  <FiCheckCircle className="text-white text-xl" />
                ) : (
                  <FiXCircle className="text-white text-xl" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request
              </h2>
            </div>
            
            <div className="space-y-4 mb-6 p-5 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FiUser className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Employee</p>
                  <p className="text-sm font-bold text-slate-900">{selectedRequest?.user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiFileText className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Leave Type</p>
                  <p className="text-sm font-bold text-slate-900">{formatLeaveType(selectedRequest?.leaveType)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiClock className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Duration</p>
                  <p className="text-sm font-bold text-slate-900">{selectedRequest?.totalDays} days</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Comment {actionType === 'reject' && <span className="text-rose-600">*</span>}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 font-medium resize-none"
                placeholder={actionType === 'approve' ? 'Optional comment...' : 'Please provide a reason for rejection...'}
                required={actionType === 'reject'}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setComment('');
                  setSelectedRequest(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={actionLoading === selectedRequest?._id || (actionType === 'reject' && !comment.trim())}
                className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                  actionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                } disabled:bg-gray-400 disabled:cursor-not-allowed`}
              >
                {actionLoading === selectedRequest?._id
                  ? 'Processing...'
                  : actionType === 'approve'
                  ? 'Approve'
                  : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
