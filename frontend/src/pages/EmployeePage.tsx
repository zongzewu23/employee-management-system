// src/pages/EmployeePage.tsx
import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Modal,
    Breadcrumb,
    Alert,
    Spin,
} from 'antd';
import {
    TeamOutlined,
    UserOutlined,
    UserDeleteOutlined,
    PauseCircleOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import EmployeeList from '../components/employee/EmployeeList';
import EmployeeForm from '../components/employee/EmployeeForm';
import useEmployees from '../hooks/useEmployees';
import { useDepartments } from '../hooks/useDepartments';
import {
    EmployeeDTO,
    CreateEmployeeRequest,
    UpdateEmployeeRequest,
    EmployeeStatus,
} from '../types/api';

const EmployeePage = (): React.JSX.Element => {
    // state management
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<EmployeeDTO | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    // custom hooks
    const {
        employees,
        statistics,
        loading: employeeLoading,
        error: employeeError,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        updateEmployeeStatus,
        searchEmployees,
        resetSearch,
        clearError: clearEmployeeError,
    } = useEmployees();

    const {
        departmentsSummary: departments,
        loading: departmentLoading,
        error: departmentError,
    } = useDepartments(true, false); // fetchOnMount=true, includeEmployees=false

    // Open the Add Employee modal box
    const handleAddEmployee = () => {
        setFormMode('create');
        setEditingEmployee(null);
        setIsModalVisible(true);
    };

    const handleEditEmployee = (employee: EmployeeDTO) => {
        setFormMode('edit');
        setEditingEmployee(employee);
        setIsModalVisible(true);
    }

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingEmployee(null);
    }

    const handleFormSubmit = async (data: CreateEmployeeRequest | UpdateEmployeeRequest) => {
        try {
            let success = false;
            if (formMode === 'create') {
                success = await createEmployee(data as CreateEmployeeRequest);
            } else if (formMode === 'edit' && editingEmployee) {
                success = await updateEmployee(editingEmployee.id, data as UpdateEmployeeRequest);
            }

            if (success) {
                handleCloseModal();
            }
        } catch (error) {
            // handled in hook
        }
    }

    const handleDeleteEmployee = async (id: number) => {
        await deleteEmployee(id);
    };

    const handleStatusChange = async (id: number, status: EmployeeStatus) => {
        await updateEmployeeStatus(id, status);
    };

    const handleSearch = async (searchTerm: string) => {
        if (!searchTerm.trim()) {
            // If search term is empty, reset to show all employees
            resetSearch();
        } else {
            await searchEmployees(searchTerm); // This now updates the employees state directly
        }
    };

    const clearAllErrors = () => {
        clearEmployeeError();
    };

    const isLoading = employeeLoading || departmentLoading;
    const hasError = employeeError || departmentError

    return (
        <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
            {/* bread crumb navigation */}
            <Breadcrumb style={{ marginBottom: 24 }}>
                <Breadcrumb.Item>
                    <Link to="/dashboard">
                        <HomeOutlined /> Dashboard
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <TeamOutlined /> Employee Management
                </Breadcrumb.Item>
            </Breadcrumb>

            {/* errors */}
            {hasError && (
                <Alert
                    message="Error"
                    description={employeeError || departmentError}
                    type="error"
                    closable
                    onClose={clearAllErrors}
                    style={{ marginBottom: 24 }}
                />
            )}

            {/* statistic card */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Employees"
                            value={statistics.total}
                            prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Active"
                            value={statistics.active}
                            prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Inactive"
                            value={statistics.inactive}
                            prefix={<PauseCircleOutlined style={{ color: '#fa8c16' }} />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Terminated"
                            value={statistics.terminated}
                            prefix={<UserDeleteOutlined style={{ color: '#ff4d4f' }} />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* employee table */}
            <Card
                title={
                    <div style={{ fontSize: '18px', fontWeight: 500 }}>
                        <TeamOutlined style={{ marginRight: 8 }} />
                        Employee List
                    </div>
                }
                bordered={false}
                style={{ marginBottom: 0 }}
            >
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <Spin size="large" tip="Loading employees..." />
                    </div>
                ) : (
                    <EmployeeList
                        employees={employees}
                        loading={employeeLoading}
                        onAdd={handleAddEmployee}
                        onEdit={handleEditEmployee}
                        onDelete={handleDeleteEmployee}
                        onStatusChange={handleStatusChange}
                        onSearch={handleSearch}
                    />
                )}
            </Card>

            {/* employee form modal box */}
            <Modal
                title={null}
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
                centered
                destroyOnClose
                maskClosable={false}
            >
                <EmployeeForm
                    employee={editingEmployee}
                    departments={departments}
                    loading={employeeLoading}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    mode={formMode}
                />
            </Modal>
        </div>
    );
}

export default EmployeePage;