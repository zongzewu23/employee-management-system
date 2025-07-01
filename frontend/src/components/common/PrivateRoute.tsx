
// src/components/common/PrivateRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/api';

interface PrivateRouteProps {
    children: React.ReactNode;
    requiredRole?: UserRole;
    fallbackPath?: string;
}

const PrivateRoute = ({children, requiredRole, fallbackPath = '/login'}: PrivateRouteProps ): React.JSX.Element => {
    const { isAuthenticated, isLoading,hasRole}= useAuth();
    const Location = useLocation();

    if (isLoading) {
        return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <Spin size="large" tip="Loading..." />
        </div>
    );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return (
            <Navigate
                to={fallbackPath}
                state={{ from: Location }}
                replace
            />
        );
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column'
            }}>
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
            </div>
        );
    }

    return <>{children}</>
}

export default PrivateRoute;