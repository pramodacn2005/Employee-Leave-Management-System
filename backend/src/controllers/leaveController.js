import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";
import { applyLeave, updateLeaveStatus } from "../services/leaveService.js";
import { sendEmail } from "../utils/email/emailService.js";
import { leaveAppliedEmployeeTemplate } from "../utils/email/leaveAppliedEmployeeTemplate.js";
import { leaveAppliedManagerTemplate } from "../utils/email/leaveAppliedManagerTemplate.js";
import { leaveApprovedTemplate } from "../utils/email/leaveApprovedTemplate.js";
import { leaveRejectedTemplate } from "../utils/email/leaveRejectedTemplate.js";

// POST /api/leaves
export const createLeaveRequest = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const leave = await applyLeave(req.user._id, {
      leaveType,
      startDate,
      endDate,
      reason,
    });

    // Populate user info for consistency with other endpoints
    await leave.populate('user', 'name email');
    
    // Send email to employee confirming submission
    const employeeEmailHtml = leaveAppliedEmployeeTemplate({
      employeeName: leave.user.name,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      totalDays: leave.totalDays,
      reason: leave.reason,
      status: leave.status,
    });
    
    sendEmail(
      leave.user.email,
      "Leave Request Submitted - Employee Leave Manager",
      employeeEmailHtml
    ).catch((err) => {
      console.error("Failed to send email to employee:", err);
    });

    // Find all managers and send notification
    const managers = await User.find({ role: "manager" }).select("name email");
    
    if (managers.length > 0) {
      const managerEmailHtml = leaveAppliedManagerTemplate({
        employeeName: leave.user.name,
        employeeEmail: leave.user.email,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        totalDays: leave.totalDays,
        reason: leave.reason,
      });

      // Send email to all managers
      const managerEmails = managers.map((m) => m.email);
      managerEmails.forEach((managerEmail) => {
        sendEmail(
          managerEmail,
          `New Leave Request from ${leave.user.name} - Employee Leave Manager`,
          managerEmailHtml
        ).catch((err) => {
          console.error(`Failed to send email to manager ${managerEmail}:`, err);
        });
      });
    }
    
    res.status(201).json({ leave });
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

// GET /api/leaves/my-requests
export const getMyLeaves = async (req, res, next) => {
  try {
    const query = { user: req.user._id };
    
    // Support status filtering for calendar view
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    const leaves = await LeaveRequest.find(query)
      .populate('user', 'name email role')
      .select('leaveType startDate endDate totalDays reason status managerComment createdAt user')
      .sort({ createdAt: -1 });
    res.json({ leaves });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/leaves/:id
export const cancelLeaveRequest = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (leave.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending requests can be cancelled" });
    }

    await leave.deleteOne();
    res.json({ message: "Leave request cancelled" });
  } catch (err) {
    next(err);
  }
};

// GET /api/leaves/balance
export const getLeaveBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ leaveBalance: user.leaveBalance });
  } catch (err) {
    next(err);
  }
};

// MANAGER: GET /api/leaves/all
export const getAllLeaves = async (req, res, next) => {
  try {
    const query = {};
    
    // Support status filtering for calendar view
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    const leaves = await LeaveRequest.find(query)
      .populate("user", "name email role")
      .select('leaveType startDate endDate totalDays reason status managerComment createdAt user')
      .sort({ createdAt: -1 });
    res.json({ leaves });
  } catch (err) {
    next(err);
  }
};

// MANAGER: GET /api/leaves/pending
export const getPendingLeaves = async (req, res, next) => {
  try {
    const leaves = await LeaveRequest.find({ status: "pending" })
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.json({ leaves });
  } catch (err) {
    next(err);
  }
};

// MANAGER: PUT /api/leaves/:id/approve
export const approveLeave = async (req, res, next) => {
  try {
    const leave = await updateLeaveStatus(
      req.user,
      req.params.id,
      "approved",
      req.body.managerComment || ""
    );

    // Populate user info for email
    await leave.populate('user', 'name email');

    // Send approval email to employee
    const approvalEmailHtml = leaveApprovedTemplate({
      employeeName: leave.user.name,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      totalDays: leave.totalDays,
      reason: leave.reason,
      managerComment: leave.managerComment,
      managerName: req.user.name,
    });

    sendEmail(
      leave.user.email,
      "Leave Request Approved - Employee Leave Manager",
      approvalEmailHtml
    ).catch((err) => {
      console.error("Failed to send approval email to employee:", err);
    });

    res.json({ leave });
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

// MANAGER: PUT /api/leaves/:id/reject
export const rejectLeave = async (req, res, next) => {
  try {
    const leave = await updateLeaveStatus(
      req.user,
      req.params.id,
      "rejected",
      req.body.managerComment || ""
    );

    // Populate user info for email
    await leave.populate('user', 'name email');

    // Send rejection email to employee
    const rejectionEmailHtml = leaveRejectedTemplate({
      employeeName: leave.user.name,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      totalDays: leave.totalDays,
      reason: leave.reason,
      managerComment: leave.managerComment,
      managerName: req.user.name,
    });

    sendEmail(
      leave.user.email,
      "Leave Request Rejected - Employee Leave Manager",
      rejectionEmailHtml
    ).catch((err) => {
      console.error("Failed to send rejection email to employee:", err);
    });

    res.json({ leave });
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};



