// src/pages/DashboardPage.tsx
import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Card, Row, Col, Statistic } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    ApartmentOutlined,
    LogoutOutlined,
    SettingOutlined,
    DashboardOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../context/AuthContext";

const { Header, Sider, Content } = Layout;

const DashboardPage: React.FC = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    };

    const navigateToEmployees = () => {
        navigate('/employees');
    };

    const navigateToDepartments = () => {
        navigate('/departments');
    };

    const navigateToAdmin = () => {
        navigate('/admin');
    };

    // User dropdown menu
    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
        },
    ];

    // Sidebar menu items
    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: 'employees',
            icon: <TeamOutlined />,
            label: 'Employees',
            onClick: navigateToEmployees,
        },
        {
            key: 'departments',
            icon: <ApartmentOutlined />,
            label: 'Departments',
            onClick: navigateToDepartments,
        },
    ];

    // Add admin-only menu items
    if (isAdmin()) {
        menuItems.push({
            key: 'admin',
            icon: <SettingOutlined />,
            label: 'Admin Panel',
            onClick: navigateToAdmin,
        });
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <Sider
                collapsible
                theme="dark"
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div style={{
                    height: 32,
                    margin: 16,
                    background: 'rgba(255,255,255,.2)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    EMS
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    items={menuItems}
                    onClick={({ key }) => {
                        const item = menuItems.find(item => item.key === key);
                        if (item && item.onClick) {
                            item.onClick();
                        }
                    }}
                />
            </Sider>

            {/* Main Layout */}
            <Layout style={{ marginLeft: 200 }}>
                {/* Header */}
                <Header style={{
                    padding: '0 16px',
                    background: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 1px 4px rgba(0,21,41,.08)'
                }}>
                    <h2 style={{ margin: 0, color: '#1890ff' }}>
                        Employee Management System
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span>Welcome, {user?.username}</span>
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <Button
                                type="text"
                                icon={<Avatar icon={<UserOutlined />} />}
                                style={{ border: 'none' }}
                            >
                                {user?.username}
                            </Button>
                        </Dropdown>
                    </div>
                </Header>

                {/* Content */}
                <Content style={{
                    margin: '24px 16px 0',
                    overflow: 'initial',
                    background: '#f0f2f5',
                    minHeight: 'calc(100vh - 64px - 24px)'
                }}>
                    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
                        {/* Dashboard Stats */}
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Total Employees"
                                        value={128}
                                        prefix={<TeamOutlined />}
                                        valueStyle={{ color: '#3f8600' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Departments"
                                        value={8}
                                        prefix={<ApartmentOutlined />}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Active Users"
                                        value={98}
                                        prefix={<UserOutlined />}
                                        valueStyle={{ color: '#722ed1' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="This Month"
                                        value={12}
                                        prefix={<PlusOutlined />}
                                        suffix="New"
                                        valueStyle={{ color: '#cf1322' }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        {/* Quick Actions */}
                        <Card title="Quick Actions" style={{ marginBottom: 24 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        block
                                        size="large"
                                        onClick={navigateToEmployees}
                                    >
                                        Add Employee
                                    </Button>
                                </Col>
                                <Col span={6}>
                                    <Button
                                        icon={<ApartmentOutlined />}
                                        block
                                        size="large"
                                        onClick={navigateToDepartments}
                                    >
                                        Add Department
                                    </Button>
                                </Col>
                                <Col span={6}>
                                    <Button
                                        icon={<TeamOutlined />}
                                        block
                                        size="large"
                                        onClick={navigateToEmployees}
                                    >
                                        View All Employees
                                    </Button>
                                </Col>
                                <Col span={6}>
                                    <Button
                                        icon={<SettingOutlined />}
                                        block
                                        size="large"
                                        disabled={!isAdmin()}
                                        onClick={isAdmin() ? navigateToAdmin : undefined}
                                    >
                                        System Settings
                                    </Button>
                                </Col>
                            </Row>
                        </Card>

                        {/* Welcome Card */}
                        <Card title={`Welcome back, ${user?.username}!`}>
                            <p>
                                You are logged in as: <strong>{user?.role}</strong>
                            </p>
                            <p>
                                Email: <strong>{user?.email}</strong>
                            </p>
                            <p>
                                This is your dashboard where you can manage employees, departments, and system settings.
                            </p>
                            {isAdmin() && (
                                <p style={{ color: '#1890ff' }}>
                                    <strong>Admin Access:</strong> You have full administrative privileges.
                                </p>
                            )}
                        </Card>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardPage;