// src/components/department/DepartmentList.tsx
import React, { useState } from 'react';
import {
    Table,
    Button,
    Space,
    Tag,
    Input,
    Tooltip,
    Popconfirm,
    Typography,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    ApartmentOutlined,
    PlusOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { DepartmentDTO } from '../../types/api';

const { Search } = Input;
const { Text } = Typography;

interface DepartmentListProps {
    departments: DepartmentDTO[];
    loading: boolean;
    onEdit: (department: DepartmentDTO) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
    onSearch: (value: string) => void;
    onViewEmployees: (department: DepartmentDTO) => void;
}

const DepartmentList = ({
                            departments,
                            loading,
                            onEdit,
                            onDelete,
                            onAdd,
                            onSearch,
                            onViewEmployees
                        }: DepartmentListProps): React.JSX.Element => {
    const [searchText, setSearchText] = useState<string>('');

    const handleSearch = (value: string) => {
        setSearchText(value);
        onSearch(value);
    };

    const getStatusColor = (isEmpty: boolean): string => {
        return isEmpty ? 'orange' : 'green';
    };

    const getStatusText = (department: DepartmentDTO): string => {
        if (department.empty) {
            return 'Empty';
        }
        return `${department.employeeCount} Employee${department.employeeCount !== 1 ? 's' : ''}`;
    };

    const columns: ColumnsType<DepartmentDTO> = [
        {
            title: 'Department',
            key: 'department',
            fixed: 'left',
            width: 250,
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 500, fontSize: '16px' }}>
                        <ApartmentOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        {record.name}
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        ID: {record.id}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 200,
            ellipsis: {
                showTitle: false,
            },
            render: (description) => (
                <Tooltip placement="topLeft" title={description || 'No description'}>
                    {description || <Text type="secondary">No description</Text>}
                </Tooltip>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            width: 150,
            ellipsis: true,
            render: (location) => location || <Text type="secondary">Not specified</Text>,
        },
        {
            title: 'Manager',
            dataIndex: 'managerName',
            key: 'managerName',
            width: 150,
            ellipsis: true,
            render: (managerName) => (
                <div>
                    {managerName ? (
                        <>
                            <UserOutlined style={{ marginRight: 4, color: '#52c41a' }} />
                            {managerName}
                        </>
                    ) : (
                        <Text type="secondary">No manager assigned</Text>
                    )}
                </div>
            ),
        },
        {
            title: 'Employees',
            key: 'employees',
            width: 120,
            align: 'center',
            sorter: (a, b) => a.employeeCount - b.employeeCount,
            render: (_, record) => (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 500, fontSize: '16px' }}>
                        {record.employeeCount}
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        Active: {record.activeEmployeeCount}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            width: 120,
            filters: [
                { text: 'Has Employees', value: false },
                { text: 'Empty', value: true },
            ],
            onFilter: (value, record) => record.empty === value,
            render: (_, record) => (
                <Tag color={getStatusColor(record.empty)} icon={<TeamOutlined />}>
                    {getStatusText(record)}
                </Tag>
            ),
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            render: (date: string) => new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Employees">
                        <Button
                            type="text"
                            icon={<TeamOutlined />}
                            onClick={() => onViewEmployees(record)}
                            size="small"
                            style={{ color: '#1890ff' }}
                        />
                    </Tooltip>

                    <Tooltip title="Edit Department">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                            size="small"
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Delete Department"
                        description={
                            record.employeeCount > 0
                                ? `This department has ${record.employeeCount} employee(s). Are you sure you want to delete it?`
                                : `Are you sure you want to delete "${record.name}"?`
                        }
                        onConfirm={() => onDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okType="danger"
                    >
                        <Tooltip title="Delete Department">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                                disabled={record.employeeCount > 0}
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
                        placeholder="Search departments by name..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        style={{ width: 300 }}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                    />
                </Space>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onAdd}
                    size="large"
                >
                    Add Department
                </Button>
            </div>

            {/* Department table */}
            <Table
                columns={columns}
                dataSource={departments}
                rowKey="id"
                loading={loading}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} departments`,
                    pageSizeOptions: ['10', '20', '50'],
                    defaultPageSize: 20,
                }}
                scroll={{ x: 1200 }}
                size="middle"
                bordered
                rowClassName={(record) =>
                    record.empty ? 'empty-department-row' : ''
                }
            />

            <style>{`
                .empty-department-row {
                    background-color: #fffbe6;
                }
                .empty-department-row:hover {
                    background-color: #fff7e6 !important;
                }
            `}</style>
        </div>
    );
};

export default DepartmentList;