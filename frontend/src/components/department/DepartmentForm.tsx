// src/components/department/DepartmentForm.tsx
import React, { useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Divider,
    Row,
    Col,
} from 'antd';
import { ApartmentOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import {
    DepartmentDTO,
    CreateDepartmentRequest,
    UpdateDepartmentRequest,
} from '../../types/api';

const { TextArea } = Input;

interface DepartmentFormProps {
    department?: DepartmentDTO | null;
    loading: boolean;
    onSubmit: (data: CreateDepartmentRequest | UpdateDepartmentRequest) => Promise<void>;
    onCancel: () => void;
    mode: 'create' | 'edit';
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
                                                           department,
                                                           loading,
                                                           onSubmit,
                                                           onCancel,
                                                           mode,
                                                       }) => {
    const [form] = Form.useForm();

    // Update form when department data changes
    useEffect(() => {
        if (department && mode === 'edit') {
            form.setFieldsValue({
                name: department.name,
                description: department.description,
                location: department.location,
                managerName: department.managerName,
            });
        } else if (mode === 'create') {
            form.resetFields();
        }
    }, [department, mode, form]);

    // Handle form submission
    const handleSubmit = async (values: any) => {
        try {
            await onSubmit(values);
        } catch (error) {
            // Error handling is managed in the parent component
        }
    };

    return (
        <Card
            title={
                <div style={{ textAlign: 'center' }}>
                    <ApartmentOutlined style={{ marginRight: 8 }} />
                    {mode === 'create' ? 'Add New Department' : 'Edit Department'}
                </div>
            }
            bordered={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
            >
                {/* Basic Information */}
                <Divider orientation="left">Basic Information</Divider>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Department Name"
                            name="name"
                            rules={[
                                { required: true, message: 'Please enter department name!' },
                                { max: 100, message: 'Department name must not exceed 100 characters' },
                                { min: 2, message: 'Department name must be at least 2 characters' },
                            ]}
                        >
                            <Input
                                prefix={<ApartmentOutlined />}
                                placeholder="Enter department name"
                                disabled={loading}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Location"
                            name="location"
                            rules={[
                                { max: 100, message: 'Location must not exceed 100 characters' },
                            ]}
                        >
                            <Input
                                prefix={<EnvironmentOutlined />}
                                placeholder="Enter department location"
                                disabled={loading}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                { max: 500, message: 'Description must not exceed 500 characters' },
                            ]}
                        >
                            <TextArea
                                placeholder="Enter department description (optional)"
                                disabled={loading}
                                rows={4}
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Management Information */}
                <Divider orientation="left">Management</Divider>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Manager Name"
                            name="managerName"
                            rules={[
                                { max: 100, message: 'Manager name must not exceed 100 characters' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter manager name (optional)"
                                disabled={loading}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Show additional info for edit mode */}
                {mode === 'edit' && department && (
                    <>
                        <Divider orientation="left">Department Statistics</Divider>
                        <Row gutter={16}>
                            <Col xs={24} sm={8}>
                                <div style={{
                                    padding: 16,
                                    background: '#f0f2f5',
                                    borderRadius: 6,
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                                        {department.employeeCount}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#666' }}>
                                        Total Employees
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={8}>
                                <div style={{
                                    padding: 16,
                                    background: '#f0f2f5',
                                    borderRadius: 6,
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                                        {department.activeEmployeeCount}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#666' }}>
                                        Active Employees
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={8}>
                                <div style={{
                                    padding: 16,
                                    background: '#f0f2f5',
                                    borderRadius: 6,
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: department.empty ? '#fa8c16' : '#52c41a' }}>
                                        {department.empty ? 'Empty' : 'Active'}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#666' }}>
                                        Status
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </>
                )}

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
                        {mode === 'create' ? 'Create Department' : 'Update Department'}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default DepartmentForm;