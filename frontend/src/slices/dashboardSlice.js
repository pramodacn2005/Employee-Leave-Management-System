import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/client.js";

export const fetchEmployeeDashboard = createAsyncThunk(
  "dashboard/employee",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/dashboard/employee");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load dashboard"
      );
    }
  }
);

export const fetchManagerDashboard = createAsyncThunk(
  "dashboard/manager",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/dashboard/manager");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load dashboard"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const onPending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const onRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    };

    builder
      .addCase(fetchEmployeeDashboard.pending, onPending)
      .addCase(fetchEmployeeDashboard.rejected, onRejected)
      .addCase(fetchEmployeeDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      })
      .addCase(fetchManagerDashboard.pending, onPending)
      .addCase(fetchManagerDashboard.rejected, onRejected)
      .addCase(fetchManagerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      });
  },
});

export const getDashboardStats = (role) => {
  return role === 'manager' ? fetchManagerDashboard : fetchEmployeeDashboard;
};

export default dashboardSlice.reducer;


