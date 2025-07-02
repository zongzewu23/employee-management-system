// src/pages/AdminPage.tsx
import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Breadcrumb,
    Alert,
    Spin,
    Button,
    Table,
    Space,
    Tag,
    Divider,
    Typography,
    List,
    Badge,
} from 'antd';
import {
    SettingOutlined,
    HomeOutlined,
    TeamOutlined,
    ApartmentOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DatabaseOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useEmployees from '../hooks/useEmployees';
import { useDepartments } from '../hooks/useDepartments';
import { EmployeeDTO, DepartmentDTO, EmployeeStatus } from '../types/api';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

const AdminPage = (): React.JSX.Element => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'departments' | 'system'>('overview');

    // Hooks for data
    const {
        employees,
        statistics: empStats,
        loading: empLoading,
        error: empError,
        deleteEmployee,
        updateEmployeeStatus,
    } = useEmployees();

    const {
        statistics: deptStats,
        loading: deptLoading,
        error: deptError,
        deleteDepartment,
        getEmptyDepartments,
    } = useDepartments(true, true);

    const [emptyDepartments, setEmptyDepartments] = useState<DepartmentDTO[]>([]);
    const [loadingEmpty, setLoadingEmpty] = useState(false);

    // Load empty departments
    const handleLoadEmptyDepartments = async () => {
        setLoadingEmpty(true);
        try {
            const empty = await getEmptyDepartments();
            setEmptyDepartments(empty);
        } catch (error) {
            console.error('Failed to load empty departments:', error);
        } finally {
            setLoadingEmpty(false);
        }
    };

    // Quick actions
    // const handleBulkDeactivate = async (employeeIds: number[]) => {
    //     for (const id of employeeIds) {
    //         await updateEmployeeStatus(id, EmployeeStatus.INACTIVE);
    //     }
    // };

    const handleDeleteEmptyDepartment = async (id: number) => {
        await deleteDepartment(id);
        setEmptyDepartments(prev => prev.filter(dept => dept.id !== id));
    };

    // Problem employees (inactive or terminated)
    const problemEmployees = employees.filter(emp =>
        emp.status === EmployeeStatus.INACTIVE || emp.status === EmployeeStatus.TERMINATED
    );

    // Employees without departments
    const employeesWithoutDept = employees.filter(emp => !emp.department);

    // Recent employees (hired in last 30 days)
    const recentEmployees = employees.filter(emp => {
        const hireDate = new Date(emp.hireDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return hireDate >= thirtyDaysAgo;
    });

    const problemEmployeeColumns: ColumnsType<EmployeeDTO> = [
        {
            title: 'Employee',
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{record.fullName}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status: EmployeeStatus) => (
                <Tag color={status === EmployeeStatus.TERMINATED ? 'red' : 'orange'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Department',
            render: (_, record) => record.department?.name || 'No Department',
        },
        {
            title: 'Actions',
            render: (_, record) => (
                <Space>
                    {record.status !== EmployeeStatus.TERMINATED && (
                        <Button
                            size="small"
                            onClick={() => updateEmployeeStatus(record.id, EmployeeStatus.ACTIVE)}
                        >
                            Reactivate
                        </Button>
                    )}
                    <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteEmployee(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const renderOverviewTab = () => (
        <div>
            {/* System Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Employees"
                            value={empStats.total}
                            prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Active Employees"
                            value={empStats.active}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Departments"
                            value={deptStats.total}
                            prefix={<ApartmentOutlined style={{ color: '#722ed1' }} />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Empty Departments"
                            value={deptStats.empty}
                            prefix={<ExclamationCircleOutlined style={{ color: '#fa8c16' }} />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* System Health Indicators */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                    <Card title="System Health" extra={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Database Status:</span>
                                <Badge status="success" text="Connected" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>API Status:</span>
                                <Badge status="success" text="Operational" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Problem Employees:</span>
                                <Badge count={problemEmployees.length} showZero />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Unassigned Employees:</span>
                                <Badge count={employeesWithoutDept.length} showZero />
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Recent Activity" extra={<ClockCircleOutlined />}>
                        <List
                            size="small"
                            dataSource={recentEmployees.slice(0, 5)}
                            renderItem={(emp) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={emp.fullName}
                                        description={`Hired on ${new Date(emp.hireDate).toLocaleDateString()}`}
                                    />
                                    <Tag color="blue">New</Tag>
                                </List.Item>
                            )}
                            locale={{ emptyText: 'No recent hires' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );

    const renderEmployeesTab = () => (
        <div>
            <Card title="Problem Employees" style={{ marginBottom: 16 }}>
                <Text type="secondary">
                    Employees with inactive or terminated status that may need attention.
                </Text>
                <Table
                    columns={problemEmployeeColumns}
                    dataSource={problemEmployees}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    size="small"
                    style={{ marginTop: 16 }}
                />
            </Card>

            <Card title="Employees Without Department">
                <Text type="secondary">
                    Employees not assigned to any department.
                </Text>
                <List
                    style={{ marginTop: 16 }}
                    dataSource={employeesWithoutDept}
                    renderItem={(emp) => (
                        <List.Item
                            actions={[
                                <Button size="small" type="link">Assign Department</Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={emp.fullName}
                                description={`${emp.position || 'No position'} - ${emp.email}`}
                            />
                        </List.Item>
                    )}
                    locale={{ emptyText: 'All employees are assigned to departments' }}
                />
            </Card>
        </div>
    );

    const renderDepartmentsTab = () => (
        <div>
            <Card
                title="Empty Departments"
                extra={
                    <Button
                        onClick={handleLoadEmptyDepartments}
                        loading={loadingEmpty}
                        size="small"
                    >
                        Refresh
                    </Button>
                }
            >
                <Text type="secondary">
                    Departments with no employees that can potentially be removed.
                </Text>
                <List
                    style={{ marginTop: 16 }}
                    loading={loadingEmpty}
                    dataSource={emptyDepartments}
                    renderItem={(dept) => (
                        <List.Item
                            actions={[
                                <Button
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteEmptyDepartment(dept.id)}
                                >
                                    Delete
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={dept.name}
                                description={`Location: ${dept.location || 'Not specified'} - Manager: ${dept.managerName || 'No manager'}`}
                            />
                        </List.Item>
                    )}
                    locale={{ emptyText: 'No empty departments found' }}
                />
            </Card>
        </div>
    );

    const renderSystemTab = () => (
        <div>
            <Card title="System Information" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div><strong>Current User:</strong> {user?.username}</div>
                            <div><strong>User Role:</strong> {user?.role}</div>
                            <div><strong>User Email:</strong> {user?.email}</div>
                            <div><strong>System Version:</strong> 1.0.0</div>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div><strong>Database:</strong> PostgreSQL</div>
                            <div><strong>Backend:</strong> Spring Boot + Hibernate</div>
                            <div><strong>Frontend:</strong> React + TypeScript</div>
                            <div><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</div>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Card title="Quick Actions">
                <Space wrap>
                    <Button icon={<DatabaseOutlined />} disabled>
                        Backup Database
                    </Button>
                    <Button icon={<ExclamationCircleOutlined />} disabled>
                        System Maintenance
                    </Button>
                    <Button icon={<TeamOutlined />} disabled>
                        Export User Data
                    </Button>
                    <Button icon={<SettingOutlined />} disabled>
                        System Settings
                    </Button>
                </Space>
                <div style={{ marginTop: 16 }}>
                    <Text type="secondary">
                        Note: These actions are disabled in this demo version.
                    </Text>
                </div>
            </Card>
        </div>
    );

    const isLoading = empLoading || deptLoading;
    const hasError = empError || deptError;

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
                    <SettingOutlined /> Admin Panel
                </Breadcrumb.Item>
            </Breadcrumb>

            {/* Error alert */}
            {hasError && (
                <Alert
                    message="Error"
                    description={empError || deptError}
                    type="error"
                    closable
                    style={{ marginBottom: 24 }}
                />
            )}

            {/* Page header */}
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>
                    <SettingOutlined style={{ marginRight: 8 }} />
                    Admin Panel
                </Title>
                <Text type="secondary">
                    System administration and management tools
                </Text>
            </div>

            {/* Tab navigation */}
            <div style={{ marginBottom: 24 }}>
                <Space size="large">
                    <Button
                        type={activeTab === 'overview' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </Button>
                    <Button
                        type={activeTab === 'employees' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('employees')}
                    >
                        Employee Issues
                    </Button>
                    <Button
                        type={activeTab === 'departments' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('departments')}
                    >
                        Department Cleanup
                    </Button>
                    <Button
                        type={activeTab === 'system' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('system')}
                    >
                        System Info
                    </Button>
                </Space>
            </div>

            <Divider />

            {/* Tab content */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" tip="Loading admin data..." />
                </div>
            ) : (
                <>
                    {activeTab === 'overview' && renderOverviewTab()}
                    {activeTab === 'employees' && renderEmployeesTab()}
                    {activeTab === 'departments' && renderDepartmentsTab()}
                    {activeTab === 'system' && renderSystemTab()}
                </>
            )}
        </div>
    );
};

export default AdminPage;