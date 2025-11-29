import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getMe } from './slices/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Employee Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import ApplyLeave from './pages/ApplyLeave';
import MyRequests from './pages/MyRequests';
import Profile from './pages/Profile';

// Manager Pages
import ManagerDashboard from './pages/ManagerDashboard';
import PendingRequests from './pages/PendingRequests';
import AllRequests from './pages/AllRequests';

// Shared Components
import LeaveCalendar from './components/LeaveCalendar';

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem('elm_token');
    if (storedToken && !user) {
      dispatch(getMe());
    }
  }, [dispatch, user]);

  const isAuthenticated = !!user && !!token;
  const isManager = user?.role === 'manager';
  const isEmployee = user?.role === 'employee';

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="rounded-xl"
      />

      {isAuthenticated && <Navbar />}

      <div className={`flex ${isAuthenticated ? 'min-h-[calc(100vh-73px)]' : 'min-h-screen'}`}>
        {isAuthenticated && <Sidebar />}

        <main className="flex-1 min-w-0 overflow-auto bg-slate-50">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate
                    to={isManager ? '/manager/dashboard' : '/employee/dashboard'}
                    replace
                  />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate
                    to={isManager ? '/manager/dashboard' : '/employee/dashboard'}
                    replace
                  />
                ) : (
                  <Register />
                )
              }
            />

            {/* Employee Routes */}
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/apply"
              element={
                <ProtectedRoute requiredRole="employee">
                  <ApplyLeave />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/apply-leave"
              element={
                <Navigate to="/employee/apply" replace />
              }
            />
            <Route
              path="/employee/requests"
              element={
                <ProtectedRoute requiredRole="employee">
                  <MyRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/my-requests"
              element={
                <Navigate to="/employee/requests" replace />
              }
            />
            <Route
              path="/employee/profile"
              element={
                <ProtectedRoute requiredRole="employee">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/calendar"
              element={
                <ProtectedRoute requiredRole="employee">
                  <LeaveCalendar />
                </ProtectedRoute>
              }
            />

            {/* Manager Routes */}
            <Route
              path="/manager/dashboard"
              element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/pending"
              element={
                <ProtectedRoute requiredRole="manager">
                  <PendingRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/pending-requests"
              element={
                <Navigate to="/manager/pending" replace />
              }
            />
            <Route
              path="/manager/all-requests"
              element={
                <ProtectedRoute requiredRole="manager">
                  <AllRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/calendar"
              element={
                <ProtectedRoute requiredRole="manager">
                  <LeaveCalendar />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate
                    to={isManager ? '/manager/dashboard' : '/employee/dashboard'}
                    replace
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;


