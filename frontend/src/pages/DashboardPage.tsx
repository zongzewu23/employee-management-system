// src/pages/DashboardPage.tsx
import React from 'react';
import { Card, Row, Col, Statistic, Button } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    ApartmentOutlined,
    SettingOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const DashboardPage: React.FC = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    const navigateToEmployees = () => {
        navigate('/employees');
    };

    const navigateToDepartments = () => {
        navigate('/departments');
    };

    const navigateToAdmin = () => {
        navigate('/admin');
    };

    return (
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
    );
};

export default DashboardPage;