// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { UserRole } from './types/api';
import './App.css';


// Define your Ant Design theme here, if not in a separate file
const theme = {
  token: {
    colorPrimary: '#00b96b',
  },
};

// --- CHANGE IS HERE ---
const App = (): React.JSX.Element => { // Explicitly define props (none here) and return type
// ---
  return (
      <ConfigProvider theme={theme}>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <DashboardPage />
                      </PrivateRoute>
                    }
                />

                {/* Admin Only Routes */}
                <Route
                    path="/admin/*"
                    element={
                      <PrivateRoute requiredRole={UserRole.ADMIN}>
                        <div style={{ padding: 24 }}>
                          <h2>Admin Panel</h2>
                          <p>This is an admin-only section.</p>
                        </div>
                      </PrivateRoute>
                    }
                />

                {/* Employee Management Routes */}
                <Route
                    path="/employees"
                    element={
                      <PrivateRoute>
                        <div style={{ padding: 24 }}>
                          <h2>Employee Management</h2>
                          <p>Employee list and management will be implemented here.</p>
                        </div>
                      </PrivateRoute>
                    }
                />

                {/* Department Management Routes */}
                <Route
                    path="/departments"
                    element={
                      <PrivateRoute>
                        <div style={{ padding: 24 }}>
                          <h2>Department Management</h2>
                          <p>Department list and management will be implemented here.</p>
                        </div>
                      </PrivateRoute>
                    }
                />

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 Not Found */}
                <Route
                    path="*"
                    element={
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        flexDirection: 'column'
                      }}>
                        <h1>404 - Page Not Found</h1>
                        <p>The page you are looking for does not exist.</p>
                      </div>
                    }
                />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ConfigProvider>
  );
};

export default App;