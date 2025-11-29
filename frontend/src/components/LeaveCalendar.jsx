import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { fetchApprovedLeaves } from '../slices/leaveSlice';
import { FiCalendar, FiUser, FiClock, FiFileText, FiX } from 'react-icons/fi';

// Color mapping for leave types
const leaveTypeColors = {
  sickLeave: {
    backgroundColor: '#3b82f6', // blue-500
    borderColor: '#2563eb', // blue-600
    textColor: '#ffffff',
  },
  casualLeave: {
    backgroundColor: '#10b981', // emerald-500
    borderColor: '#059669', // emerald-600
    textColor: '#ffffff',
  },
  vacationLeave: {
    backgroundColor: '#a855f7', // purple-500
    borderColor: '#9333ea', // purple-600
    textColor: '#ffffff',
  },
};

// Format leave type for display
const formatLeaveType = (type) => {
  return type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export default function LeaveCalendar() {
  const dispatch = useDispatch();
  const { approvedLeaves, loading } = useSelector((state) => state.leave);
  const { user } = useSelector((state) => state.auth);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    dispatch(fetchApprovedLeaves());
  }, [dispatch]);

  // Convert API data to FullCalendar event format
  const calendarEvents = approvedLeaves?.map((leave) => {
    const colors = leaveTypeColors[leave.leaveType] || leaveTypeColors.sickLeave;
    const leaveTypeFormatted = formatLeaveType(leave.leaveType);
    
    // For manager view, include employee name; for employee view, just leave type
    const title = user?.role === 'manager' 
      ? `${leave.user?.name || 'Unknown'} - ${leaveTypeFormatted}`
      : leaveTypeFormatted;

    return {
      id: leave._id,
      title,
      start: leave.startDate,
      end: new Date(new Date(leave.endDate).getTime() + 24 * 60 * 60 * 1000), // Add 1 day for inclusive end date
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
      textColor: colors.textColor,
      extendedProps: {
        employeeName: leave.user?.name || 'Unknown',
        leaveType: leaveTypeFormatted,
        reason: leave.reason,
        startDate: leave.startDate,
        endDate: leave.endDate,
        totalDays: leave.totalDays,
      },
    };
  }) || [];

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 animate-fade-in max-w-screen-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Leave Calendar</h1>
        <p className="text-slate-600">
          {user?.role === 'manager' 
            ? 'View all approved leave requests across your team' 
            : 'View your approved leave requests'}
        </p>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: leaveTypeColors.sickLeave.backgroundColor }}></div>
          <span className="text-sm font-medium text-slate-700">Sick Leave</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: leaveTypeColors.casualLeave.backgroundColor }}></div>
          <span className="text-sm font-medium text-slate-700">Casual Leave</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: leaveTypeColors.vacationLeave.backgroundColor }}></div>
          <span className="text-sm font-medium text-slate-700">Vacation Leave</span>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-slate-600 font-medium">Loading calendar...</p>
            </div>
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth',
            }}
            height="auto"
            eventDisplay="block"
            dayMaxEvents={3}
            moreLinkClick="popover"
            eventClassNames="cursor-pointer hover:opacity-90 transition-opacity"
            eventTextColor="#ffffff"
            weekends={true}
            firstDay={1} // Start week on Monday
            locale="en"
            buttonText={{
              today: 'Today',
              month: 'Month',
            }}
            className="fc-custom"
          />
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ 
                    backgroundColor: selectedEvent.backgroundColor,
                  }}
                >
                  <FiCalendar className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Leave Details</h2>
                  <p className="text-sm text-slate-500">Leave request information</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <FiX className="text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              {user?.role === 'manager' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUser className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedEvent.extendedProps.employeeName}
                  </p>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <FiFileText className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Leave Type</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-6 w-6 rounded"
                    style={{ backgroundColor: selectedEvent.backgroundColor }}
                  ></div>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedEvent.extendedProps.leaveType}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <FiClock className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Duration</span>
                </div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  <span className="font-bold">{formatDate(selectedEvent.extendedProps.startDate)}</span>
                  {' → '}
                  <span className="font-bold">{formatDate(selectedEvent.extendedProps.endDate)}</span>
                </p>
                <p className="text-xs text-slate-500">
                  {selectedEvent.extendedProps.totalDays} day{selectedEvent.extendedProps.totalDays !== 1 ? 's' : ''}
                </p>
              </div>

              {selectedEvent.extendedProps.reason && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FiFileText className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Reason</span>
                  </div>
                  <p className="text-sm text-slate-700">
                    {selectedEvent.extendedProps.reason}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full mt-6 btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

