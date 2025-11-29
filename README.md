# Employee Leave Management System

A full-stack web application for managing employee leave requests with role-based access control. Built with the MERN stack (MongoDB, Express, React, Node.js) and Redux Toolkit for state management.

##  Features

### Employee Features
-  User Registration & Login with JWT Authentication
-  Apply for Leave (Sick Leave, Casual Leave, Vacation Leave)
-  View Leave Balance
-  View My Leave Requests
-  Cancel Pending Leave Requests
-  Employee Dashboard with Statistics

### Manager Features
-  Manager Login
-  View All Pending Leave Requests
-  Approve/Reject Leave Requests with Comments
-  View All Leave Requests (History)
-  Manager Dashboard with Team Statistics

## 🛠️ Tech Stack

### Frontend
- **React** - UI Library
- **Redux Toolkit** - State Management
- **React Router** - Routing
- **TailwindCSS** - Styling
- **Vite** - Build Tool
- **Axios** - HTTP Client
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime Environment
- **Express** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password Hashing
- **dotenv** - Environment Variables

## Project Structure

```
Tap_Assesment-1/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── leaveController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── LeaveRequest.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── leaveRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── services/
│   │   │   └── leaveService.js
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Table.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── ApplyLeave.jsx
│   │   │   ├── MyRequests.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ManagerDashboard.jsx
│   │   │   ├── PendingRequests.jsx
│   │   │   └── AllRequests.jsx
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── leaveSlice.js
│   │   │   └── dashboardSlice.js
│   │   ├── store/
│   │   │   └── store.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.mjs
│   ├── vite.config.mjs
│   └── postcss.config.mjs
│
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Tap_Assesment-1
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and update the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/leave_mgmt
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**Note:** For MongoDB Atlas, use your connection string:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/leave_mgmt
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit `.env` and update the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port shown in terminal)

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new employee | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Protected |

### Employee Leave Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/leaves` | Apply for leave | Employee |
| GET | `/api/leaves/my-requests` | Get my leave requests | Employee |
| GET | `/api/leaves/balance` | Get leave balance | Employee |
| DELETE | `/api/leaves/:id` | Cancel leave request | Employee |

### Manager Leave Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/leaves/all` | Get all leave requests | Manager |
| GET | `/api/leaves/pending` | Get pending requests | Manager |
| PUT | `/api/leaves/:id/approve` | Approve leave request | Manager |
| PUT | `/api/leaves/:id/reject` | Reject leave request | Manager |

### Dashboard

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/employee` | Employee dashboard stats | Employee |
| GET | `/api/dashboard/manager` | Manager dashboard stats | Manager |

## Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "employee" | "manager",
  leaveBalance: {
    sickLeave: Number (default: 10),
    casualLeave: Number (default: 5),
    vacationLeave: Number (default: 5)
  }
}
```

### LeaveRequest Model

```javascript
{
  userId: ObjectId (ref: User),
  leaveType: "sickLeave" | "casualLeave" | "vacationLeave",
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  reason: String,
  status: "pending" | "approved" | "rejected",
  managerComment: String,
  createdAt: Date
}
```

## Authentication & Authorization

- **JWT Tokens**: Used for authentication, stored in localStorage
- **Role-Based Access**: Middleware checks user role before allowing access
- **Password Hashing**: bcrypt with salt rounds for secure password storage

## UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Clean Dashboard**: Statistics cards and quick actions
- **Status Indicators**: Color-coded status badges (Pending, Approved, Rejected)
- **Form Validation**: Client-side validation for leave applications
- **Toast Notifications**: User-friendly success/error messages

## Testing the Application

### Create Test Users

1. **Register as Employee**: Use the registration page to create an employee account
2. **Create Manager Account**: You can create a manager account through registration by setting role to "manager" (or modify the registration endpoint to allow role selection)

### Test Flow

1. **Employee Flow**:
   - Register/Login as employee
   - View dashboard and leave balance
   - Apply for leave
   - View submitted requests
   - Cancel pending requests

2. **Manager Flow**:
   - Login as manager
   - View dashboard with team statistics
   - Review pending requests
   - Approve/Reject requests with comments
   - View all requests history

## Troubleshooting

### Backend Issues

- **MongoDB Connection Error**: Ensure MongoDB is running locally or check your MongoDB Atlas connection string
- **Port Already in Use**: Change the PORT in `.env` file
- **JWT Errors**: Ensure JWT_SECRET is set in `.env`

### Frontend Issues

- **API Connection Error**: Check that backend is running and `VITE_API_URL` is correct
- **CORS Errors**: Ensure backend CORS is configured correctly
- **Build Errors**: Clear `node_modules` and reinstall dependencies

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/leave_mgmt
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## Production Deployment

### Backend

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production MongoDB instance
4. Use environment variables for all sensitive data

### Frontend

1. Build the application: `npm run build`
2. Serve the `dist` folder using a static file server
3. Update `VITE_API_URL` to production API URL

## License

This project is created for assessment purposes.

## Developer Notes

- All API responses follow RESTful conventions
- Error handling is implemented at both frontend and backend
- Code is organized with separation of concerns (controllers, services, routes)
- Redux Toolkit is used for efficient state management
- Protected routes ensure role-based access control

---

**Built with using MERN Stack**


