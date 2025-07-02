// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeePage from './pages/EmployeePage';
import './App.css';
import { UserRole } from "./types/api";
import DepartmentPage from "./pages/DepartmentPage";

// Ant Design theme configuration
const theme = {
    token: {
        colorPrimary: '#1890ff',
        borderRadius: 6,
    },
};

const App: React.FC = () => {
    return (
        <ConfigProvider theme={theme}>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            {/* Public routing - no layout required */}
                            <Route path="/login" element={<LoginPage />} />

                            {/* Protected Routes - Using Shared Layout*/}
                            <Route
                                path="/*"
                                element={
                                    <PrivateRoute>
                                        <MainLayout />
                                    </PrivateRoute>
                                }
                            >
                                {/* Nested Routes - These are rendered in the <Outlet /> of the MainLayout */}
                                <Route path="dashboard" element={<DashboardPage />} />
                                <Route path="employees" element={<EmployeePage />} />
                                <Route path="departments"  element={<DepartmentPage/>} />
                                <Route
                                    path="admin/*"
                                    element={
                                        <PrivateRoute requiredRole={UserRole.ADMIN}>
                                            <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
                                                <h2>Admin Panel</h2>
                                                <p>This is an admin-only section.</p>
                                            </div>
                                        </PrivateRoute>
                                    }
                                />

                                <Route index element={<Navigate to="/dashboard" replace />} />

                                <Route
                                    path="*"
                                    element={
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '50vh',
                                            flexDirection: 'column',
                                            background: '#fff',
                                            borderRadius: 8,
                                            margin: 24
                                        }}>
                                            <h1>404 - Page Not Found</h1>
                                            <p>The page you are looking for does not exist.</p>
                                        </div>
                                    }
                                />
                            </Route>
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ConfigProvider>
    );
};

export default App;