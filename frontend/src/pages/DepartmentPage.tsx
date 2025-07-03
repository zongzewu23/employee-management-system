// src/pages/DepartmentPage.tsx
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
    ApartmentOutlined,
    TeamOutlined,
    UserOutlined,
    HomeOutlined,
    BankOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import DepartmentList from '../components/department/DepartmentList';
import DepartmentForm from '../components/department/DepartmentForm';
import DepartmentEmployeeModal from '../components/department/DepartmentEmployeeModal';
import { useDepartments } from '../hooks/useDepartments';
import {
    DepartmentDTO,
    CreateDepartmentRequest,
    UpdateDepartmentRequest,
} from '../types/api';

const DepartmentPage = (): React.JSX.Element => {
    // State management
    const [isFormModalVisible, setIsFormModalVisible] = useState(false);
    const [isEmployeeModalVisible, setIsEmployeeModalVisible] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<DepartmentDTO | null>(null);
    const [viewingDepartment, setViewingDepartment] = useState<DepartmentDTO | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    // Custom hook with detailed department data (including employees)
    const {
        departments,
        statistics,
        loading,
        error,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        searchDepartmentsByName,
        resetSearch,
        getDepartmentById,
        clearError,
    } = useDepartments(true, true); // fetchOnMount=true, includeEmployees=true

    // Open the Add Department modal
    const handleAddDepartment = () => {
        setFormMode('create');
        setEditingDepartment(null);
        setIsFormModalVisible(true);
    };

    // Open the Edit Department modal
    const handleEditDepartment = (department: DepartmentDTO) => {
        setFormMode('edit');
        setEditingDepartment(department);
        setIsFormModalVisible(true);
    };

    // Close the form modal
    const handleCloseFormModal = () => {
        setIsFormModalVisible(false);
        setEditingDepartment(null);
    };

    // Handle form submission
    const handleFormSubmit = async (data: CreateDepartmentRequest | UpdateDepartmentRequest) => {
        try {
            let success = false;
            if (formMode === 'create') {
                success = await createDepartment(data as CreateDepartmentRequest);
            } else if (formMode === 'edit' && editingDepartment) {
                success = await updateDepartment(editingDepartment.id, data as UpdateDepartmentRequest);
            }

            if (success) {
                handleCloseFormModal();
            }
        } catch (error) {
            // Error handling is managed in the hook
        }
    };

    // Handle department deletion
    const handleDeleteDepartment = async (id: number) => {
        await deleteDepartment(id);
    };

    // Handle search - FIXED VERSION
    const handleSearch = async (searchTerm: string) => {
        if (!searchTerm.trim()) {
            // If search term is empty, reset to show all departments
            resetSearch();
        } else {
            await searchDepartmentsByName(searchTerm); // This now updates the departments state directly
        }
    };

    // Handle viewing employees in a department
    const handleViewEmployees = async (department: DepartmentDTO) => {
        try {
            // Fetch the latest department data with employees
            const detailedDepartment = await getDepartmentById(department.id, true);
            if (detailedDepartment) {
                setViewingDepartment(detailedDepartment);
                setIsEmployeeModalVisible(true);
            }
        } catch (error) {
            // Error is handled in the hook
        }
    };

    // Close the employee modal
    const handleCloseEmployeeModal = () => {
        setIsEmployeeModalVisible(false);
        setViewingDepartment(null);
    };

    const clearAllErrors = () => {
        clearError();
    };

    return (
        <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
            {/* Breadcrumb navigation */}
            <Breadcrumb style={{ marginBottom: 24 }}>
                <Breadcrumb.Item>
                    <Link to="/dashboard">
                        <HomeOutlined /> Dashboard
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <ApartmentOutlined /> Department Management
                </Breadcrumb.Item>
            </Breadcrumb>

            {/* Error alert */}
            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    closable
                    onClose={clearAllErrors}
                    style={{ marginBottom: 24 }}
                />
            )}

            {/* Statistics cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Departments"
                            value={statistics.total}
                            prefix={<ApartmentOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="With Employees"
                            value={statistics.withEmployees}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Empty Departments"
                            value={statistics.empty}
                            prefix={<BankOutlined style={{ color: '#fa8c16' }} />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Employees"
                            value={statistics.totalEmployees}
                            prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Additional statistics row */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12}>
                    <Card>
                        <Statistic
                            title="Average Employees per Department"
                            value={statistics.averageEmployeesPerDept}
                            precision={1}
                            prefix={<UserOutlined style={{ color: '#13c2c2' }} />}
                            valueStyle={{ color: '#13c2c2' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card style={{ background: '#f0f9ff', border: '1px solid #91d5ff' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: 8 }}>
                                Department Utilization
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                {statistics.total > 0
                                    ? Math.round((statistics.withEmployees / statistics.total) * 100)
                                    : 0}%
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                of departments have employees
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Department table */}
            <Card
                title={
                    <div style={{ fontSize: '18px', fontWeight: 500 }}>
                        <ApartmentOutlined style={{ marginRight: 8 }} />
                        Department List
                    </div>
                }
                bordered={false}
                style={{ marginBottom: 0 }}
            >
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <Spin size="large" tip="Loading departments..." />
                    </div>
                ) : (
                    <DepartmentList
                        departments={departments as DepartmentDTO[]}
                        loading={loading}
                        onAdd={handleAddDepartment}
                        onEdit={handleEditDepartment}
                        onDelete={handleDeleteDepartment}
                        onSearch={handleSearch}
                        onViewEmployees={handleViewEmployees}
                    />
                )}
            </Card>

            {/* Department form modal */}
            <Modal
                title={null}
                open={isFormModalVisible}
                onCancel={handleCloseFormModal}
                footer={null}
                width={800}
                centered
                destroyOnClose
                maskClosable={false}
            >
                <DepartmentForm
                    department={editingDepartment}
                    loading={loading}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseFormModal}
                    mode={formMode}
                />
            </Modal>

            {/* Department employees modal */}
            <DepartmentEmployeeModal
                visible={isEmployeeModalVisible}
                department={viewingDepartment}
                onClose={handleCloseEmployeeModal}
            />
        </div>
    );
};

export default DepartmentPage;