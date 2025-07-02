// src/components/layout/MainLayout.tsx
import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    ApartmentOutlined,
    LogoutOutlined,
    SettingOutlined,
    DashboardOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
    };

    const getSelectedKey = () => {
        const path = location.pathname;
        if (path.startsWith('/employees')) return 'employees';
        if (path.startsWith('/departments')) return 'departments';
        if (path.startsWith('/admin')) return 'admin';
        return 'dashboard';
    };

    // 用户下拉菜单
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

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/dashboard'),
        },
        {
            key: 'employees',
            icon: <TeamOutlined />,
            label: 'Employees',
            onClick: () => navigate('/employees'),
        },
        {
            key: 'departments',
            icon: <ApartmentOutlined />,
            label: 'Departments',
            onClick: () => navigate('/departments'),
        },
    ];

    if (isAdmin()) {
        menuItems.push({
            key: 'admin',
            icon: <SettingOutlined />,
            label: 'Admin Panel',
            onClick: () => navigate('/admin'),
        });
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* 侧边栏 */}
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
                    selectedKeys={[getSelectedKey()]}
                    items={menuItems}
                    onClick={({ key }) => {
                        const item = menuItems.find(item => item.key === key);
                        if (item && item.onClick) {
                            item.onClick();
                        }
                    }}
                />
            </Sider>

            <Layout style={{ marginLeft: 200 }}>
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

                <Content style={{
                    margin: '24px 16px 0',
                    overflow: 'initial',
                    background: '#f0f2f5',
                    minHeight: 'calc(100vh - 64px - 24px)'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;