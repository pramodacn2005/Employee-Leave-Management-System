import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Employee Leave Management API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
let MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/leave_mgmt";

// Fix MongoDB Atlas connection string if database name is missing
if (MONGO_URI.includes('mongodb+srv://') && !MONGO_URI.includes('/leave_mgmt')) {
  // Add database name before query parameters
  if (MONGO_URI.includes('?')) {
    MONGO_URI = MONGO_URI.replace('?', '/leave_mgmt?');
  } else {
    MONGO_URI = MONGO_URI + '/leave_mgmt';
  }
}

// MongoDB connection options
const mongooseOptions = {
  // For MongoDB Atlas, include retryWrites and other options in connection string
};

// If using local MongoDB, set dbName in options
if (!MONGO_URI.includes('mongodb+srv://') && !MONGO_URI.includes('/leave_mgmt')) {
  mongooseOptions.dbName = "leave_mgmt";
}

console.log("🔌 Attempting to connect to MongoDB...");

mongoose
  .connect(MONGO_URI, mongooseOptions)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("\n💡 Troubleshooting tips:");
    console.error("1. Check your MONGO_URI in .env file");
    console.error("2. For MongoDB Atlas:");
    console.error("   - Ensure your IP is whitelisted (0.0.0.0/0 for all IPs)");
    console.error("   - Verify username and password are correct");
    console.error("   - Check cluster is running and accessible");
    console.error("3. For local MongoDB: Ensure MongoDB service is running");
    console.error("4. Verify network connectivity");
    console.error("\n📝 Example MongoDB Atlas URI:");
    console.error("MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/leave_mgmt?retryWrites=true&w=majority");
    process.exit(1);
  });


