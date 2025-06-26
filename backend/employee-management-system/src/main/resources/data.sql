-- =============================================================================
-- Employee Management System - Simple Data Initialization
-- 兼容 Spring Boot SQL 脚本执行器
-- =============================================================================

-- Insert Sample Departments
INSERT INTO departments (name, description, location, manager_name, created_at, updated_at)
VALUES ('Human Resources', 'Manages employee relations, hiring, and HR policies', 'Seattle, WA', 'Sarah Johnson',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Engineering', 'Software development and technical operations', 'Seattle, WA', 'Michael Chen',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Marketing', 'Brand management, advertising, and market research', 'San Francisco, CA', 'Emily Rodriguez',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Sales', 'Customer acquisition and revenue generation', 'New York, NY', 'David Thompson', CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       ('Finance', 'Financial planning, accounting, and budget management', 'Chicago, IL', 'Lisa Wang',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Operations', 'Business operations and process optimization', 'Austin, TX', 'James Wilson', CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       ('Research & Development', 'Innovation and product development', 'Palo Alto, CA', 'Dr. Amanda Foster',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Sample Employees
-- HR Department Employees
INSERT INTO employees (first_name, last_name, email, phone, position, salary, hire_date, status, department_id,
                       created_at, updated_at)
VALUES ('Sarah', 'Johnson', 'sarah.johnson@company.com', '+1-206-555-0101', 'HR Director', 95000.00, '2020-01-15',
        'ACTIVE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Kevin', 'Brown', 'kevin.brown@company.com', '+1-206-555-0102', 'HR Specialist', 55000.00, '2021-06-10',
        'ACTIVE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Maria', 'Garcia', 'maria.garcia@company.com', '+1-206-555-0103', 'Recruiter', 48000.00, '2022-03-20', 'ACTIVE',
        1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Engineering Department Employees
       ('Michael', 'Chen', 'michael.chen@company.com', '+1-206-555-0201', 'Engineering Manager', 120000.00,
        '2019-08-01', 'ACTIVE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('John', 'Smith', 'john.smith@company.com', '+1-206-555-0202', 'Senior Software Engineer', 95000.00,
        '2020-11-15', 'ACTIVE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Alice', 'Cooper', 'alice.cooper@company.com', '+1-206-555-0203', 'Software Engineer', 75000.00, '2021-09-01',
        'ACTIVE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Robert', 'Davis', 'robert.davis@company.com', '+1-206-555-0204', 'DevOps Engineer', 85000.00, '2022-01-10',
        'ACTIVE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Jennifer', 'Lee', 'jennifer.lee@company.com', '+1-206-555-0205', 'QA Engineer', 65000.00, '2022-07-15',
        'ACTIVE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Alex', 'Kim', 'alex.kim@company.com', '+1-206-555-0206', 'Frontend Developer', 70000.00, '2023-02-01',
        'ACTIVE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Marketing Department Employees
       ('Emily', 'Rodriguez', 'emily.rodriguez@company.com', '+1-415-555-0301', 'Marketing Director', 90000.00,
        '2020-05-20', 'ACTIVE', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Christopher', 'Miller', 'chris.miller@company.com', '+1-415-555-0302', 'Marketing Specialist', 52000.00,
        '2021-12-01', 'ACTIVE', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Jessica', 'Taylor', 'jessica.taylor@company.com', '+1-415-555-0303', 'Content Creator', 45000.00, '2022-08-15',
        'ACTIVE', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sales Department Employees
       ('David', 'Thompson', 'david.thompson@company.com', '+1-212-555-0401', 'Sales Director', 100000.00, '2019-12-01',
        'ACTIVE', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Michelle', 'White', 'michelle.white@company.com', '+1-212-555-0402', 'Senior Sales Rep', 65000.00,
        '2021-04-10', 'ACTIVE', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Steven', 'Anderson', 'steven.anderson@company.com', '+1-212-555-0403', 'Sales Rep', 50000.00, '2022-11-20',
        'ACTIVE', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Finance Department Employees
       ('Lisa', 'Wang', 'lisa.wang@company.com', '+1-312-555-0501', 'Finance Director', 105000.00, '2020-02-15',
        'ACTIVE', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Thomas', 'Clark', 'thomas.clark@company.com', '+1-312-555-0502', 'Senior Accountant', 62000.00, '2021-01-25',
        'ACTIVE', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Rachel', 'Moore', 'rachel.moore@company.com', '+1-312-555-0503', 'Financial Analyst', 55000.00, '2022-06-01',
        'ACTIVE', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Operations Department Employees
       ('James', 'Wilson', 'james.wilson@company.com', '+1-512-555-0601', 'Operations Director', 92000.00, '2020-07-10',
        'ACTIVE', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Laura', 'Jackson', 'laura.jackson@company.com', '+1-512-555-0602', 'Operations Specialist', 58000.00,
        '2021-10-15', 'ACTIVE', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- R&D Department Employees
       ('Amanda', 'Foster', 'amanda.foster@company.com', '+1-650-555-0701', 'R&D Director', 130000.00, '2019-04-01',
        'ACTIVE', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Daniel', 'Martin', 'daniel.martin@company.com', '+1-650-555-0702', 'Research Scientist', 95000.00,
        '2020-09-01', 'ACTIVE', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Nicole', 'Harris', 'nicole.harris@company.com', '+1-650-555-0703', 'Product Designer', 78000.00, '2021-11-10',
        'ACTIVE', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Some Inactive/Terminated Employees for Testing
       ('Mark', 'Johnson', 'mark.johnson@company.com', '+1-206-555-0999', 'Former Developer', 80000.00, '2021-05-01',
        'TERMINATED', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Susan', 'Williams', 'susan.williams@company.com', '+1-415-555-0998', 'Former Marketer', 60000.00, '2021-08-15',
        'INACTIVE', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);