// src/components/department/DepartmentEmployeeModal.tsx
import React from 'react';
import {
    Modal,
    Table,
    Tag,
    Avatar,
    Space,
    Typography,
    Empty,
} from 'antd';
import {
    UserOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { DepartmentDTO, EmployeeSummaryDTO, EmployeeStatus } from '../../types/api';

const { Text, Title } = Typography;

interface DepartmentEmployeeModalProps {
    visible: boolean;
    department: DepartmentDTO | null;
    onClose: () => void;
}

const DepartmentEmployeeModal: React.FC<DepartmentEmployeeModalProps> = ({
                                                                             visible,
                                                                             department,
                                                                             onClose,
                                                                         }) => {
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

    const columns: ColumnsType<EmployeeSummaryDTO> = [
        {
            title: 'Employee',
            key: 'employee',
            width: 250,
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
        render: (position) => position || <Text type="secondary">No position</Text>,
    },
    {
        title: 'Status',
            dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status: EmployeeStatus) => (
        <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
            </Tag>
    ),
    },
];

    return (
        <Modal
            title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
    <TeamOutlined style={{ marginRight: 8, color: '#1890ff' }} />
    <span>Employees in {department?.name}</span>
    </div>
}
    open={visible}
    onCancel={onClose}
    footer={null}
    width={800}
    centered
    >
    {department ? (
            <div>
                {/* Department Info */}
            <div style={{
        background: '#f0f2f5',
            padding: 16,
            borderRadius: 6,
            marginBottom: 16
    }}>
    <Title level={5} style={{ margin: 0, marginBottom: 8 }}>
    Department Information
    </Title>
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
    <div>
        <Text type="secondary">Location:</Text>
    <div>{department.location || 'Not specified'}</div>
    </div>
    <div>
    <Text type="secondary">Manager:</Text>
    <div>{department.managerName || 'No manager assigned'}</div>
    </div>
    <div>
    <Text type="secondary">Total Employees:</Text>
    <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
    {department.employeeCount}
    </div>
    </div>
    <div>
    <Text type="secondary">Active Employees:</Text>
    <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
    {department.activeEmployeeCount}
    </div>
    </div>
    </div>
    {department.description && (
        <div style={{ marginTop: 12 }}>
        <Text type="secondary">Description:</Text>
    <div>{department.description}</div>
    </div>
    )}
    </div>

    {/* Employee List */}
    {department.employees && department.employees.length > 0 ? (
            <Table
                columns={columns}
        dataSource={department.employees}
        rowKey="id"
        pagination={{
        pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} employees`,
    }}
        size="small"
            />
    ) : (
        <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
            <span>
            No employees in this department yet.
    <br />
    <Text type="secondary">
        Employees can be assigned to this department when creating or editing them.
    </Text>
    </span>
    }
        />
    )}
    </div>
) : (
        <Empty description="No department data available" />
    )}
    </Modal>
);
};

export default DepartmentEmployeeModal;