import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/client.js";

const userFromStorage = (() => {
  try {
    const raw = localStorage.getItem("elm_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
})();

const tokenFromStorage = (() => {
  try {
    return localStorage.getItem("elm_token") || null;
  } catch {
    return null;
  }
})();

export const register = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Register failed");
  }
});

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const fetchMe = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetch profile failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
    token: tokenFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("elm_user");
      localStorage.removeItem("elm_token");
    },
  },
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
      .addCase(register.pending, onPending)
      .addCase(register.rejected, onRejected)
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("elm_user", JSON.stringify(action.payload.user));
        localStorage.setItem("elm_token", action.payload.token);
      })
      .addCase(login.pending, onPending)
      .addCase(login.rejected, onRejected)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("elm_user", JSON.stringify(action.payload.user));
        localStorage.setItem("elm_token", action.payload.token);
      })
      .addCase(fetchMe.pending, onPending)
      .addCase(fetchMe.rejected, onRejected)
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("elm_user", JSON.stringify(action.payload.user));
      });
  },
});

export const { logout } = authSlice.actions;

// Export alias for consistency
export const getMe = fetchMe;

export default authSlice.reducer;



