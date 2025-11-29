import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/client.js";

export const fetchMyLeaves = createAsyncThunk("leaves/my", async (_, thunkAPI) => {
  try {
    const res = await api.get("/leaves/my-requests");
    return res.data.leaves;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch");
  }
});

export const fetchBalance = createAsyncThunk("leaves/balance", async (_, thunkAPI) => {
  try {
    const res = await api.get("/leaves/balance");
    return res.data.leaveBalance;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch");
  }
});

export const applyLeave = createAsyncThunk("leaves/apply", async (data, thunkAPI) => {
  try {
    const res = await api.post("/leaves", data);
    return res.data.leave;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to apply");
  }
});

export const cancelLeave = createAsyncThunk("leaves/cancel", async (id, thunkAPI) => {
  try {
    await api.delete(`/leaves/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to cancel");
  }
});

export const fetchAllLeaves = createAsyncThunk("leaves/all", async (_, thunkAPI) => {
  try {
    const res = await api.get("/leaves/all");
    return res.data.leaves;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch");
  }
});

export const fetchPendingLeaves = createAsyncThunk(
  "leaves/pending",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/leaves/pending");
      return res.data.leaves;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch");
    }
  }
);

export const approveLeave = createAsyncThunk(
  "leaves/approve",
  async ({ id, managerComment }, thunkAPI) => {
    try {
      const res = await api.put(`/leaves/${id}/approve`, { managerComment });
      return res.data.leave;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to approve");
    }
  }
);

export const rejectLeave = createAsyncThunk(
  "leaves/reject",
  async ({ id, managerComment }, thunkAPI) => {
    try {
      const res = await api.put(`/leaves/${id}/reject`, { managerComment });
      return res.data.leave;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to reject");
    }
  }
);

export const fetchApprovedLeaves = createAsyncThunk(
  "leaves/approved",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const userRole = state.auth.user?.role;
      
      // Employee: fetch their approved leaves
      // Manager: fetch all approved leaves
      const endpoint = userRole === 'manager' 
        ? '/leaves/all?status=approved'
        : '/leaves/my-requests?status=approved';
      
      const res = await api.get(endpoint);
      return res.data.leaves;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch approved leaves");
    }
  }
);

const leaveSlice = createSlice({
  name: "leaves",
  initialState: {
    myRequests: [],
    leaveBalance: null,
    allRequests: [],
    pendingRequests: [],
    approvedLeaves: [],
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
      .addCase(fetchMyLeaves.pending, onPending)
      .addCase(fetchMyLeaves.rejected, onRejected)
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.myRequests = action.payload;
      })
      .addCase(fetchBalance.pending, onPending)
      .addCase(fetchBalance.rejected, onRejected)
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveBalance = action.payload;
      })
      .addCase(applyLeave.pending, onPending)
      .addCase(applyLeave.rejected, onRejected)
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.myRequests.unshift(action.payload);
      })
      .addCase(cancelLeave.pending, onPending)
      .addCase(cancelLeave.rejected, onRejected)
      .addCase(cancelLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.myRequests = state.myRequests.filter((l) => l._id !== action.payload);
      })
      .addCase(fetchAllLeaves.pending, onPending)
      .addCase(fetchAllLeaves.rejected, onRejected)
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.allRequests = action.payload;
      })
      .addCase(fetchPendingLeaves.pending, onPending)
      .addCase(fetchPendingLeaves.rejected, onRejected)
      .addCase(fetchPendingLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload;
      })
      .addCase(approveLeave.pending, onPending)
      .addCase(approveLeave.rejected, onRejected)
      .addCase(approveLeave.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.pendingRequests = state.pendingRequests.filter((l) => l._id !== updated._id);
        state.allRequests = state.allRequests.map((l) =>
          l._id === updated._id ? updated : l
        );
      })
      .addCase(rejectLeave.pending, onPending)
      .addCase(rejectLeave.rejected, onRejected)
      .addCase(rejectLeave.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.pendingRequests = state.pendingRequests.filter((l) => l._id !== updated._id);
        state.allRequests = state.allRequests.map((l) =>
          l._id === updated._id ? updated : l
        );
      })
      .addCase(fetchApprovedLeaves.pending, onPending)
      .addCase(fetchApprovedLeaves.rejected, onRejected)
      .addCase(fetchApprovedLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedLeaves = action.payload;
      });
  },
});

// Export aliases for consistency
export const getMyRequests = fetchMyLeaves;
export const getLeaveBalance = fetchBalance;
export const cancelLeaveRequest = cancelLeave;
export const getAllRequests = fetchAllLeaves;
export const getPendingRequests = fetchPendingLeaves;

export default leaveSlice.reducer;


