import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";

export const calculateTotalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) return null;
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
};

export const validateLeaveBalance = (user, leaveType, totalDays) => {
  const balance = user.leaveBalance?.[leaveType] ?? 0;
  return balance >= totalDays;
};

export const applyLeave = async (userId, data) => {
  const { leaveType, startDate, endDate, reason } = data;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const totalDays = calculateTotalDays(startDate, endDate);
  if (!totalDays) {
    const error = new Error("Invalid date range");
    error.statusCode = 400;
    throw error;
  }

  if (!validateLeaveBalance(user, leaveType, totalDays)) {
    const error = new Error("Insufficient leave balance");
    error.statusCode = 400;
    throw error;
  }

  const leave = await LeaveRequest.create({
    user: userId,
    leaveType,
    startDate,
    endDate,
    totalDays,
    reason,
  });

  return leave;
};

export const updateLeaveStatus = async (manager, leaveId, status, comment) => {
  const leave = await LeaveRequest.findById(leaveId).populate("user");
  if (!leave) {
    const error = new Error("Leave request not found");
    error.statusCode = 404;
    throw error;
  }

  if (leave.status !== "pending") {
    const error = new Error("Only pending requests can be updated");
    error.statusCode = 400;
    throw error;
  }

  leave.status = status;
  leave.managerComment = comment;

  // On approval, deduct leave balance
  if (status === "approved") {
    const user = leave.user;
    const current = user.leaveBalance?.[leave.leaveType] ?? 0;
    user.leaveBalance[leave.leaveType] = Math.max(0, current - leave.totalDays);
    await user.save();
  }

  await leave.save();
  return leave;
};



