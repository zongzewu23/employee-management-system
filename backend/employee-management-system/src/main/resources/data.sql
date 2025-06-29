-- =============================================================================
-- Employee Management System - Enhanced Data Initialization
-- Design with separate but associated Employee and User entities
-- =============================================================================

-- ========== 1. Insert System Users ==========
-- Administrator account
INSERT INTO users (username, password, email, role, enabled, created_at, updated_at)
VALUES ('admin', '$2a$10$jABlbSCL.DKuEJJn.rxuBOYdZ2IxZ51iWqTpUaQTjCqIfHLZlPsj2', 'admin@company.com', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Manager-level users (can manage employees)
INSERT INTO users (username, password, email, role, enabled, created_at, updated_at)
VALUES
    ('sarah.johnson', '$2a$10$sICoPmS1AekcYwLBgyvcle94CuC2JbJ8inX5TPUTlwVN.AdNInVAu', 'sarah.johnson@company.com', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('michael.chen', '$2a$10$sICoPmS1AekcYwLBgyvcle94CuC2JbJ8inX5TPUTlwVN.AdNInVAu', 'michael.chen@company.com', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('emily.rodriguez', '$2a$10$sICoPmS1AekcYwLBgyvcle94CuC2JbJ8inX5TPUTlwVN.AdNInVAu', 'emily.rodriguez@company.com', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
-- General employee users (can only view their own information)
INSERT INTO users (username, password, email, role, enabled, created_at, updated_at)
VALUES
    ('john.smith', '$2a$10$sICoPmS1AekcYwLBgyvcle94CuC2JbJ8inX5TPUTlwVN.AdNInVAu', 'john.smith@company.com', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('alice.cooper', '$2a$10$sICoPmS1AekcYwLBgyvcle94CuC2JbJ8inX5TPUTlwVN.AdNInVAu', 'alice.cooper@company.com', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('jennifer.lee', '$2a$10$sICoPmS1AekcYwLBgyvcle94CuC2JbJ8inX5TPUTlwVN.AdNInVAu', 'jennifer.lee@company.com', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Test user
INSERT INTO users (username, password, email, role, enabled, created_at, updated_at)
VALUES ('testuser', '$2a$10$sICoPmS1AekcYwLBgyvcle94CuC2JbJ8inX5TPUTlwVN.AdNInVAu', 'test@company.com', 'USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ========== 2. Insert Departments ==========
INSERT INTO departments (name, description, location, manager_name, created_at, updated_at)
VALUES
    ('Human Resources', 'Manages employee relations, hiring, and HR policies', 'Seattle, WA', 'Sarah Johnson', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Engineering', 'Software development and technical operations', 'Seattle, WA', 'Michael Chen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Marketing', 'Brand management, advertising, and market research', 'San Francisco, CA', 'Emily Rodriguez', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Sales', 'Customer acquisition and revenue generation', 'New York, NY', 'David Thompson', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Finance', 'Financial planning, accounting, and budget management', 'Chicago, IL', 'Lisa Wang', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Operations', 'Business operations and process optimization', 'Austin, TX', 'James Wilson', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Research & Development', 'Innovation and product development', 'Palo Alto, CA', 'Dr. Amanda Foster', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ========== 3. Insert Employees ==========
-- Note: Some employees inserted here have corresponding system users, while others do not.

-- HR Department employees
INSERT INTO employees (first_name, last_name, email, phone, position, salary, hire_date, status, department_id, created_at, updated_at)
VALUES
    -- Sarah Johnson - Has a system account (HR Director)
    ('Sarah', 'Johnson', 'sarah.johnson@company.com', '+1-206-555-0101', 'HR Director', 95000.00, '2020-01-15', 'ACTIVE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    -- Kevin Brown - Does not have a system account (HR Specialist)
    ('Kevin', 'Brown', 'kevin.brown@company.com', '+1-206-555-0102', 'HR Specialist', 55000.00, '2021-06-10', 'ACTIVE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    -- Maria Garcia - Does not have a system account (Recruiter)
    ('Maria', 'Garcia', 'maria.garcia@company.com', '+1-206-555-0103', 'Recruiter', 48000.00, '2022-03-20', 'ACTIVE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Engineering Department employees
INSERT INTO employees (first_name, last_name, email, phone, position, salary, hire_date, status, department_id, created_at, updated_at)
VALUES
    -- Michael Chen - Has a system account (Engineering Manager, ADMIN role)
    ('Michael', 'Chen', 'michael.chen@company.com', '+1-206-555-0201', 'Engineering Manager', 120000.00, '2019-08-01', 'ACTIVE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    -- John Smith - Has a system account (Senior Software Engineer)
    ('John', 'Smith', 'john.smith@company.com', '+1-206-555-0202', 'Senior Software Engineer', 95000.00, '2020-11-15', 'ACTIVE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    -- Alice Cooper - Has a system account (Software Engineer)
    ('Alice', 'Cooper', 'alice.cooper@company.com', '+1-206-555-0203', 'Software Engineer', 75000.00, '2021-09-01', 'ACTIVE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    -- Robert Davis - Does not have a system account (DevOps Engineer)
    ('Robert', 'Davis', 'robert.davis@company.com', '+1-206-555-0204', 'DevOps Engineer', 85000.00, '2022-01-10', 'ACTIVE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    -- Jennifer Lee - Has a system account (QA Engineer)
    ('Jennifer', 'Lee', 'jennifer.lee@company.com', '+1-206-555-0205', 'QA Engineer', 65000.00, '2022-07-15', 'ACTIVE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    -- Alex Kim - Does not have a system account (Frontend Developer)
    ('Alex', 'Kim', 'alex.kim@company.com', '+1-206-555-0206', 'Frontend Developer', 70000.00, '2023-02-01', 'ACTIVE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Marketing Department employees
INSERT INTO employees (first_name, last_name, email, phone, position, salary, hire_date, status, department_id, created_at, updated_at)
VALUES
    -- Emily Rodriguez - Has a system account (Marketing Director)
    ('Emily', 'Rodriguez', 'emily.rodriguez@company.com', '+1-415-555-0301', 'Marketing Director', 90000.00, '2020-05-20', 'ACTIVE', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    -- Christopher Miller - Does not have a system account (Marketing Specialist)
    ('Christopher', 'Miller', 'chris.miller@company.com', '+1-415-555-0302', 'Marketing Specialist', 52000.00, '2021-12-01', 'ACTIVE', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    -- Jessica Taylor - Does not have a system account (Content Creator)
    ('Jessica', 'Taylor', 'jessica.taylor@company.com', '+1-415-555-0303', 'Content Creator', 45000.00, '2022-08-15', 'ACTIVE', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sales Department employees (None have a system account)
INSERT INTO employees (first_name, last_name, email, phone, position, salary, hire_date, status, department_id, created_at, updated_at)
VALUES
    ('David', 'Thompson', 'david.thompson@company.com', '+1-212-555-0401', 'Sales Director', 100000.00, '2019-12-01', 'ACTIVE', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Michelle', 'White', 'michelle.white@company.com', '+1-212-555-0402', 'Senior Sales Rep', 65000.00, '2021-04-10', 'ACTIVE', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Steven', 'Anderson', 'steven.anderson@company.com', '+1-212-555-0403', 'Sales Rep', 50000.00, '2022-11-20', 'ACTIVE', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Finance Department employees (None have a system account)
INSERT INTO employees (first_name, last_name, email, phone, position, salary, hire_date, status, department_id, created_at, updated_at)
VALUES
    ('Lisa', 'Wang', 'lisa.wang@company.com', '+1-312-555-0501', 'Finance Director', 105000.00, '2020-02-15', 'ACTIVE', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Thomas', 'Clark', 'thomas.clark@company.com', '+1-312-555-0502', 'Senior Accountant', 62000.00, '2021-01-25', 'ACTIVE', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Rachel', 'Moore', 'rachel.moore@company.com', '+1-312-555-0503', 'Financial Analyst', 55000.00, '2022-06-01', 'ACTIVE', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Operations Department employees (None have a system account)
INSERT INTO employees (first_name, last_name, email, phone, position, salary, hire_date, status, department_id, created_at, updated_at)
VALUES
    ('James', 'Wilson', 'james.wilson@company.com', '+1-512-555-0601', 'Operations Director', 92000.00, '2020-07-10', 'ACTIVE', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Laura', 'Jackson', 'laura.jackson@company.com', '+1-512-555-0602', 'Operations Specialist', 58000.00, '2021-10-15', 'ACTIVE', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Research & Development Department employees (None have a system account)
INSERT INTO employees (first_name, last_name, email, phone, position, salary, hire_date, status, department_id, created_at, updated_at)
VALUES
    ('Amanda', 'Foster', 'amanda.foster@company.com', '+1-650-555-0701', 'R&D Director', 130000.00, '2019-04-01', 'ACTIVE', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Daniel', 'Martin', 'daniel.martin@company.com', '+1-650-555-0702', 'Research Scientist', 95000.00, '2020-09-01', 'ACTIVE', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Nicole', 'Harris', 'nicole.harris@company.com', '+1-650-555-0703', 'Product Designer', 78000.00, '2021-11-10', 'ACTIVE', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Terminated employees
INSERT INTO employees (first_name, last_name, email, phone, position, salary, hire_date, status, department_id, created_at, updated_at)
VALUES
    ('Mark', 'Johnson', 'mark.johnson@company.com', '+1-206-555-0999', 'Former Developer', 80000.00, '2021-05-01', 'TERMINATED', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Susan', 'Williams', 'susan.williams@company.com', '+1-415-555-0998', 'Former Marketer', 60000.00, '2021-08-15', 'INACTIVE', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ========== 4. Test Data Notes ==========
-- System User Accounts:
-- admin / admin123 (Administrator)
-- michael.chen / user123 (Engineering Manager, ADMIN role)
-- sarah.johnson / user123 (HR Director)
-- john.smith / user123 (Senior Software Engineer)
-- alice.cooper / user123 (Software Engineer)
-- jennifer.lee / user123 (QA Engineer)
-- emily.rodriguez / user123 (Marketing Director)
-- testuser / user123 (Test User)

-- Employee and User Relationship:
-- 1. Some employees have system accounts, some do not (a common business scenario).
-- 2. The association between Employee and User is established through the 'email' field.
-- 3. Management and technical staff typically have system accounts.
-- 4. Sales, Finance, and Operations personnel may not require system accounts.