import express from "express";
import {
  createLeaveRequest,
  getMyLeaves,
  cancelLeaveRequest,
  getLeaveBalance,
  getAllLeaves,
  getPendingLeaves,
  approveLeave,
  rejectLeave,
} from "../controllers/leaveController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee routes
router.post("/", protect, authorizeRoles("employee", "manager"), createLeaveRequest);
router.get(
  "/my-requests",
  protect,
  authorizeRoles("employee", "manager"),
  getMyLeaves
);
router.delete("/:id", protect, authorizeRoles("employee", "manager"), cancelLeaveRequest);
router.get("/balance", protect, authorizeRoles("employee", "manager"), getLeaveBalance);

// Manager routes
router.get("/all", protect, authorizeRoles("manager"), getAllLeaves);
router.get("/pending", protect, authorizeRoles("manager"), getPendingLeaves);
router.put("/:id/approve", protect, authorizeRoles("manager"), approveLeave);
router.put("/:id/reject", protect, authorizeRoles("manager"), rejectLeave);

export default router;


