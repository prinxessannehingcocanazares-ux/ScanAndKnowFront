import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import Rooms from './pages/Rooms';
import QRScanner from './pages/QRScanner';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import { AuthProvider, useAuth } from "./context/AuthContext";

// --- Layouts ---

const AppLayout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, title }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppLayout title={title}>{children}</AppLayout>;
};

// --- Main App ---

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute title="Dashboard"><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute title="My Profile"><Profile /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute title="Schedule"><Schedule /></ProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute title="Room Management"><Rooms /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute title="Attendance Logs"><Attendance /></ProtectedRoute>} />
          <Route path="/qr-scanner" element={<ProtectedRoute title="QR Scanner"><QRScanner /></ProtectedRoute>} />
          {/* <Route path="/reports" element={<ProtectedRoute title="Teacher Reports"><Reports /></ProtectedRoute>} /> */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}