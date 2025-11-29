import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";

// GET /api/dashboard/employee
export const getEmployeeDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalLeaves, pending, approved, rejected] = await Promise.all([
      LeaveRequest.countDocuments({ user: userId }),
      LeaveRequest.countDocuments({ user: userId, status: "pending" }),
      LeaveRequest.countDocuments({ user: userId, status: "approved" }),
      LeaveRequest.countDocuments({ user: userId, status: "rejected" }),
    ]);

    const recent = await LeaveRequest.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalLeaves,
        pending,
        approved,
        rejected,
      },
      recent,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/manager
export const getManagerDashboard = async (req, res, next) => {
  try {
    const [totalRequests, pending, approved, rejected, totalEmployees] = await Promise.all([
      LeaveRequest.countDocuments(),
      LeaveRequest.countDocuments({ status: "pending" }),
      LeaveRequest.countDocuments({ status: "approved" }),
      LeaveRequest.countDocuments({ status: "rejected" }),
      User.countDocuments({ role: "employee" }),
    ]);

    const recent = await LeaveRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalRequests,
        pendingRequests: pending,
        approvedRequests: approved,
        rejectedRequests: rejected,
        totalEmployees,
      },
      recent,
    });
  } catch (err) {
    next(err);
  }
};


