// src/components/employee/EmployeeList.tsx
import React, {useState} from 'react';
import {
    Table,
    Button,
    Space,
    Tag,
    Input,
    Select,
    Tooltip,
    Avatar,
    Popconfirm,
    Typography,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    UserOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {EmployeeDTO, EmployeeStatus} from '../../types/api';


const {Search} = Input;
const {Option} = Select;
const {Text} = Typography;

interface EmployeeListProps {
    employees: EmployeeDTO[];
    loading: boolean;
    onEdit: (employee: EmployeeDTO) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: EmployeeStatus) => void;
    onAdd: () => void;
    onSearch: (value: string) => void;
}

const EmployeeList = ({
                          employees,
                          loading,
                          onEdit,
                          onDelete,
                          onStatusChange,
                          onAdd,
                          onSearch
                      }: EmployeeListProps): React.JSX.Element => {
    const [searchText, setSearchText] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'ALL'>('ALL');

    const getStatusColor = (status: EmployeeStatus): string => {
        switch (status) {
            case EmployeeStatus.ACTIVE:
                return 'green';
            case EmployeeStatus.INACTIVE:
                return 'orange';
            case EmployeeStatus.TERMINATED:
                return 'red';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: EmployeeStatus): string => {
        switch (status) {
            case EmployeeStatus.ACTIVE:
                return 'Active';
            case EmployeeStatus.INACTIVE:
                return 'Inactive';
            case EmployeeStatus.TERMINATED:
                return 'Terminated';
            default:
                return status;
        }
    };

    const formatSalary = (salary: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(salary);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        onSearch(value);
    };

    const filteredEmployees = employees.filter(employee => {
        if (statusFilter === 'ALL') return true;
        return employee.status === statusFilter;
    });

    const columns: ColumnsType<EmployeeDTO> = [
        {
            title: 'Employee',
            key: 'employee',
            fixed: 'left',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div style={{ fontWeight: 500 }}>{record.fullName}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            width: 150,
            ellipsis: {
                showTitle: false,
            },
            render: (position) => (
                <Tooltip placement="topLeft" title={position}>
                    {position}
                </Tooltip>
            ),
        },
        {
            title: 'Department',
            key: 'department',
            width: 150,
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{record.department?.name || 'N/A'}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.department?.location || ''}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            filters: [
                { text: 'Active', value: EmployeeStatus.ACTIVE },
                { text: 'Inactive', value: EmployeeStatus.INACTIVE },
                { text: 'Terminated', value: EmployeeStatus.TERMINATED },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status: EmployeeStatus) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: 'Salary',
            dataIndex: 'salary',
            key: 'salary',
            width: 120,
            align: 'right',
            sorter: (a, b) => a.salary - b.salary,
            render: (salary: number) => (
                <Text strong>{formatSalary(salary)}</Text>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: 140,
            ellipsis: true,
        },
        {
            title: 'Hire Date',
            dataIndex: 'hireDate',
            key: 'hireDate',
            width: 120,
            sorter: (a, b) => new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime(),
            render: (date: string) => formatDate(date),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit Employee">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                            size="small"
                        />
                    </Tooltip>

                    <Select
                        value={record.status}
                        onChange={(value) => onStatusChange(record.id, value)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        <Option value={EmployeeStatus.ACTIVE}>Active</Option>
                        <Option value={EmployeeStatus.INACTIVE}>Inactive</Option>
                        <Option value={EmployeeStatus.TERMINATED}>Terminated</Option>
                    </Select>

                    <Popconfirm
                        title="Delete Employee"
                        description={`Are you sure you want to delete ${record.fullName}?`}
                        onConfirm={() => onDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okType="danger"
                    >
                        <Tooltip title="Delete Employee">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16
            }}>
                <Space wrap>
                    <Search
                        placeholder="Search employees by name..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        style={{ width: 300 }}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                    />

                    <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        size="large"
                        style={{ width: 120 }}
                    >
                        <Option value="ALL">All Status</Option>
                        <Option value={EmployeeStatus.ACTIVE}>Active</Option>
                        <Option value={EmployeeStatus.INACTIVE}>Inactive</Option>
                        <Option value={EmployeeStatus.TERMINATED}>Terminated</Option>
                    </Select>
                </Space>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onAdd}
                    size="large"
                >
                    Add Employee
                </Button>
            </div>

            {/* employee table */}
            <Table
                columns={columns}
                dataSource={filteredEmployees}
                rowKey="id"
                loading={loading}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} employees`,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    defaultPageSize: 20,
                }}
                scroll={{ x: 1200 }}
                size="middle"
                bordered
                rowClassName={(record) =>
                    record.status === EmployeeStatus.TERMINATED ? 'terminated-row' : ''
                }
            />

            <style>{`
        .terminated-row {
          background-color: #fff2f0;
        }
        .terminated-row:hover {
          background-color: #ffebe6 !important;
        }
      `}</style>
        </div>
    );

}

export default EmployeeList;