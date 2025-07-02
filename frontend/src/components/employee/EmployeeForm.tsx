// src/components/employee/EmployeeForm.tsx
import React, { useEffect } from 'react';
import {
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Button,
    Row,
    Col,
    Card,
    Divider,
} from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
    EmployeeDTO,
    CreateEmployeeRequest,
    UpdateEmployeeRequest,
    EmployeeStatus,
    DepartmentSummaryDTO,
} from '../../types/api';

const { Option } = Select;

interface EmployeeFormProps {
    employee?: EmployeeDTO | null;
    departments: DepartmentSummaryDTO[];
    loading: boolean;
    onSubmit: (data: CreateEmployeeRequest | UpdateEmployeeRequest) => Promise<void>;
    onCancel: () => void;
    mode: 'create' | 'edit';
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
                                                       employee,
                                                       departments,
                                                       loading,
                                                       onSubmit,
                                                       onCancel,
                                                       mode,
                                                   }) => {
    const [form] = Form.useForm();

    // Update form when employee data changes
    useEffect(() => {
        if (employee && mode === 'edit') {
            form.setFieldsValue({
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                phone: employee.phone,
                position: employee.position,
                salary: employee.salary,
                hireDate: employee.hireDate ? dayjs(employee.hireDate) : null,
                status: employee.status,
                departmentId: employee.department?.id,
            });
        } else if (mode === 'create') {
            form.resetFields();
            // Set default values
            form.setFieldsValue({
                status: EmployeeStatus.ACTIVE,
                hireDate: dayjs(),
            });
        }
    }, [employee, mode, form]);

    // Handle form submission
    const handleSubmit = async (values: any) => {
        try {
            const formattedValues = {
                ...values,
                hireDate: values.hireDate ? values.hireDate.format('YYYY-MM-DD') : undefined,
            };
            await onSubmit(formattedValues);
        } catch (error) {
            // Error handling is managed in the parent component
        }
    };

    // Validate phone number format
    const validatePhone = (_: any, value: string) => {
        if (!value) return Promise.resolve();
        const phoneRegex = /^[+]?[\d\s()-]+$/;
        if (!phoneRegex.test(value)) {
            return Promise.reject(new Error('Please enter a valid phone number'));
        }
        return Promise.resolve();
    };

    return (
        <Card
            title={
                <div style={{ textAlign: 'center' }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    {mode === 'create' ? 'Add New Employee' : 'Edit Employee'}
                </div>
            }
            bordered={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    status: EmployeeStatus.ACTIVE,
                    hireDate: dayjs(),
                }}
                size="large"
            >
                {/* Basic Information */}
                <Divider orientation="left">Basic Information</Divider>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="First Name"
                            name="firstName"
                            rules={[
                                { required: true, message: 'Please enter first name!' },
                                { max: 100, message: 'First name must not exceed 100 characters' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter first name"
                                disabled={loading}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Last Name"
                            name="lastName"
                            rules={[
                                { required: true, message: 'Please enter last name!' },
                                { max: 100, message: 'Last name must not exceed 100 characters' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter last name"
                                disabled={loading}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter email!' },
                                { type: 'email', message: 'Please enter a valid email!' },
                                { max: 150, message: 'Email must not exceed 150 characters' },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Enter email address"
                                disabled={loading}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                { max: 20, message: 'Phone must not exceed 20 characters' },
                                { validator: validatePhone },
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="Enter phone number"
                                disabled={loading}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Position Information */}
                <Divider orientation="left">Position Information</Divider>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Position"
                            name="position"
                            rules={[
                                { max: 100, message: 'Position must not exceed 100 characters' },
                            ]}
                        >
                            <Input
                                placeholder="Enter position/job title"
                                disabled={loading}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Department"
                            name="departmentId"
                            rules={[
                                { required: false, message: 'Please select a department!' },
                            ]}
                        >
                            <Select
                                placeholder="Select department"
                                allowClear
                                disabled={loading}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.children as unknown as string)
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >
                                {departments.map(dept => (
                                    <Option key={dept.id} value={dept.id}>
                                        {dept.name} ({dept.location})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Salary"
                            name="salary"
                            rules={[
                                { type: 'number', min: 0, message: 'Salary must be greater than 0' },
                            ]}
                        >
                            <InputNumber<number>
                                prefix={<DollarOutlined />}
                                placeholder="Enter annual salary"
                                style={{ width: '100%' }}
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ''))}
                                min={0}
                                max={9999999}
                                disabled={loading}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Hire Date"
                            name="hireDate"
                            rules={[
                                { required: false, message: 'Please select hire date!' },
                            ]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Select hire date"
                                format="YYYY-MM-DD"
                                disabled={loading}
                                disabledDate={(current) => current && current > dayjs().endOf('day')}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Status Information */}
                <Divider orientation="left">Status</Divider>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Employee Status"
                            name="status"
                            rules={[
                                { required: true, message: 'Please select employee status!' },
                            ]}
                        >
                            <Select
                                placeholder="Select status"
                                disabled={loading}
                            >
                                <Option value={EmployeeStatus.ACTIVE}>
                                    <span style={{ color: '#52c41a' }}>● Active</span>
                                </Option>
                                <Option value={EmployeeStatus.INACTIVE}>
                                    <span style={{ color: '#fa8c16' }}>● Inactive</span>
                                </Option>
                                <Option value={EmployeeStatus.TERMINATED}>
                                    <span style={{ color: '#ff4d4f' }}>● Terminated</span>
                                </Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Action Buttons */}
                <Divider />

                <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                    <Button
                        type="default"
                        onClick={onCancel}
                        size="large"
                        style={{ marginRight: 16, minWidth: 100 }}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={loading}
                        style={{ minWidth: 100 }}
                    >
                        {mode === 'create' ? 'Create Employee' : 'Update Employee'}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default EmployeeForm;