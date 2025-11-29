import express from "express";
import {
  getEmployeeDashboard,
  getManagerDashboard,
} from "../controllers/dashboardController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/employee",
  protect,
  authorizeRoles("employee", "manager"),
  getEmployeeDashboard
);
router.get("/manager", protect, authorizeRoles("manager"), getManagerDashboard);

export default router;



