// src/types/api.test.ts
import { EmployeeStatus, UserRole } from './api';

describe('API Types', () => {
    describe('EmployeeStatus Enum', () => {
        test('has correct values', () => {
            expect(EmployeeStatus.ACTIVE).toBe('ACTIVE');
            expect(EmployeeStatus.INACTIVE).toBe('INACTIVE');
            expect(EmployeeStatus.TERMINATED).toBe('TERMINATED');
        });

        test('contains all expected statuses', () => {
            const statuses = Object.values(EmployeeStatus);
            expect(statuses).toHaveLength(3);
            expect(statuses).toContain('ACTIVE');
            expect(statuses).toContain('INACTIVE');
            expect(statuses).toContain('TERMINATED');
        });
    });

    describe('UserRole Enum', () => {
        test('has correct values', () => {
            expect(UserRole.ADMIN).toBe('ADMIN');
            expect(UserRole.USER).toBe('USER');
        });

        test('contains all expected roles', () => {
            const roles = Object.values(UserRole);
            expect(roles).toHaveLength(2);
            expect(roles).toContain('ADMIN');
            expect(roles).toContain('USER');
        });
    });
});