// src/pages/DashboardPage.tsx
import React, {useState} from 'react';
import {Button, Card, Col, Modal, Row, Statistic} from 'antd';
import {ApartmentOutlined, PlusOutlined, SettingOutlined, TeamOutlined, UserOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import EmployeeForm from '../components/employee/EmployeeForm';
import DepartmentForm from '../components/department/DepartmentForm';
import useEmployees from '../hooks/useEmployees';
import {useDepartments} from '../hooks/useDepartments';
import {
    CreateDepartmentRequest,
    CreateEmployeeRequest,
    EmployeeStatus,
    UpdateDepartmentRequest,
    UpdateEmployeeRequest,
} from '../types/api';

const DashboardPage: React.FC = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Modal states
    const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
    const [isDepartmentModalVisible, setIsDepartmentModalVisible] = useState(false);

    // Hooks for forms
    const {
        createEmployee,
        loading: employeeLoading,
    } = useEmployees();

    const {
        departmentsSummary: departments,
        createDepartment,
        loading: departmentLoading,
    } = useDepartments(true, false); // Get departments for employee form dropdown

    const navigateToEmployees = () => {
        navigate('/employees');
    };

    // const navigateToDepartments = () => {
    //     navigate('/departments');
    // };

    const navigateToAdmin = () => {
        navigate('/admin');
    };

    // Quick Add Employee
    const handleQuickAddEmployee = () => {
        setIsEmployeeModalVisible(true);
    };

    const handleEmployeeFormSubmit = async (data: CreateEmployeeRequest | UpdateEmployeeRequest) => {
        const createData: CreateEmployeeRequest = {
            firstName: data.firstName!,
            lastName: data.lastName!,
            email: data.email!,
            phone: data.phone,
            position: data.position,
            salary: data.salary,
            hireDate: data.hireDate,
            status: EmployeeStatus.ACTIVE,
            departmentId: data.departmentId,
        }
        const success = await createEmployee(createData);

        if (success) {
            setIsEmployeeModalVisible(false);
        }
    };

    const handleEmployeeModalClose = () => {
        setIsEmployeeModalVisible(false);
    };

    // Quick Add Department
    const handleQuickAddDepartment = () => {
        setIsDepartmentModalVisible(true);
    };

    const handleDepartmentFormSubmit = async (data: CreateDepartmentRequest | UpdateDepartmentRequest) => {
        const createData: CreateDepartmentRequest = {
            name: data.name!,
            description: data.description,
            location: data.location,
            managerName: data.managerName,
        };

        const success = await createDepartment(createData);
        if (success) {
            setIsDepartmentModalVisible(false);
        }
    };

    const handleDepartmentModalClose = () => {
        setIsDepartmentModalVisible(false);
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
                            onClick={handleQuickAddEmployee}
                        >
                            Add Employee
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button
                            icon={<ApartmentOutlined />}
                            block
                            size="large"
                            onClick={handleQuickAddDepartment}
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

            {/* Quick Add Employee Modal */}
            <Modal
                title={null}
                open={isEmployeeModalVisible}
                onCancel={handleEmployeeModalClose}
                footer={null}
                width={800}
                centered
                destroyOnClose
                maskClosable={false}
            >
                <EmployeeForm
                    employee={null}
                    departments={departments}
                    loading={employeeLoading}
                    onSubmit={handleEmployeeFormSubmit}
                    onCancel={handleEmployeeModalClose}
                    mode="create"
                />
            </Modal>

            {/* Quick Add Department Modal */}
            <Modal
                title={null}
                open={isDepartmentModalVisible}
                onCancel={handleDepartmentModalClose}
                footer={null}
                width={800}
                centered
                destroyOnClose
                maskClosable={false}
            >
                <DepartmentForm
                    department={null}
                    loading={departmentLoading}
                    onSubmit={handleDepartmentFormSubmit}
                    onCancel={handleDepartmentModalClose}
                    mode="create"
                />
            </Modal>
        </div>
    );
};

export default DashboardPage;