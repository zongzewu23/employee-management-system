// src/pages/LoginPage.tsx
import React, { useEffect } from 'react';
import { Layout, Typography, Divider } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const LoginPage = (): React.JSX.Element | null => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoading } = useAuth();

    // Get the redirect path from location state, default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';

    useEffect(() => {
        // If user is already authenticated, redirect to the target page
        if (isAuthenticated && !isLoading) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate, from]);

    const handleLoginSuccess = () => {
        // Redirect to the intended page after successful login
        navigate(from, { replace: true });
    };

    // Show loading if authentication is being checked
    if (isLoading) {
        return (
            <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
                <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={3}>Loading...</Title>
                    </div>
                </Content>
            </Layout>
        );
    }

    // Don't render login form if user is already authenticated
    if (isAuthenticated) {
        return null;
    }

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 20 }}>
                <Title level={1} style={{ color: '#1890ff', marginBottom: 8 }}>
                    Welcome to 404 Inc. EMS
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                    Employee Management System
                </Text>
            </div>

            {/* Main Content */}
            <Content style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '0 20px'
            }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <LoginForm onLoginSuccess={handleLoginSuccess} />

                    {/* Additional Info */}
                    <div style={{
                        marginTop: 24,
                        padding: 16,
                        backgroundColor: 'white',
                        borderRadius: 8,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <Title level={5} style={{ marginBottom: 12 }}>
                            System Features:
                        </Title>
                        <ul style={{ margin: 0, paddingLeft: 20, color: '#666' }}>
                            <li>Employee Management</li>
                            <li>Department Management</li>
                            <li>Role-based Access Control</li>
                            <li>Real-time Data Updates</li>
                        </ul>
                    </div>
                </div>
            </Content>

            <Divider style={{ margin: '40px 0 20px 0' }} />

            {/* Footer */}
            <Footer style={{
                textAlign: 'center',
                backgroundColor: 'transparent',
                padding: '0 0 40px 0'
            }}>
                <Text type="secondary">
                    Employee Management System ©2025 Created by Your Team
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Built with React + TypeScript + Spring Boot + Hibernate + PostgresSQL
                </Text>
            </Footer>
        </Layout>
    );
};

export default LoginPage;