// src/components/auth/LoginForm.tsx
import React from 'react';
import { Form, Input, Button, Alert, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { LoginRequest } from '../../types/api';

const { Title } = Typography;

interface LoginFormProps {
    onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const { login, isLoading, error, clearError } = useAuth();
    const [form] = Form.useForm();

    const handleSubmit = async (values: LoginRequest) => {
        // Clear previous errors
        clearError();

        try {
            const success = await login(values);
            if (success) {
                form.resetFields();
                onLoginSuccess?.();
            }
        } catch (err) {
            // Error is already handled by AuthContext
        }
    };

    const handleFormChange = () => {
        // Clear error when user starts typing
        if (error) {
            clearError();
        }
    };

    return (
        <Card
            style={{
                width: 400,
                margin: '0 auto',
                marginTop: '100px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={3}>Employee Management System</Title>
                <Title level={4} type="secondary">Login</Title>
            </div>

            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    onClose={clearError}
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form
                form={form}
                name="login"
                onFinish={handleSubmit}
                onValuesChange={handleFormChange}
                autoComplete="off"
                size="large"
            >
                <Form.Item
                    name="username"
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        { min: 3, message: 'Username must be at least 3 characters!' }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Username"
                        disabled={isLoading}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Password"
                        disabled={isLoading}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        block
                        style={{ height: 40 }}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Typography.Text type="secondary">
                    Default credentials: admin / password123
                </Typography.Text>
            </div>
        </Card>
    );
};

export default LoginForm;