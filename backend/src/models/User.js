import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
  {
    sickLeave: { type: Number, default: 10 },
    casualLeave: { type: Number, default: 5 },
    vacationLeave: { type: Number, default: 5 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["employee", "manager"],
      default: "employee",
    },
    leaveBalance: {
      type: leaveBalanceSchema,
      default: () => ({
        sickLeave: 10,
        casualLeave: 5,
        vacationLeave: 5,
      }),
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;



