// src/hooks/useDepartments.ts
import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import DepartmentService from '../services/departmentService';
import {
    DepartmentDTO,
    DepartmentSummaryDTO,
    CreateDepartmentRequest,
    UpdateDepartmentRequest,
} from '../types/api';

/**
 * Department Data Management Hook
 * Provides CRUD operations and state management for departments
 * @param {boolean} fetchOnMount - Whether to automatically fetch department list on component mount, defaults to false
 */
export const useDepartments = (fetchOnMount: boolean = false) => {
    // State definitions
    const [departments, setDepartments] = useState<DepartmentSummaryDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Fetch all departments (summary information)
    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await DepartmentService.getAllDepartmentsSummary();
            setDepartments(data);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch departments';
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch all departments (detailed information, including employees)
    const fetchDepartmentsWithEmployees = useCallback(async (): Promise<DepartmentDTO[]> => {
        setLoading(true);
        setError(null);

        try {
            const data = await DepartmentService.getAllDepartmentsWithEmployees();
            return data;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch departments with employees';
            setError(errorMessage);
            message.error(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Get department details by ID
    const getDepartmentById = useCallback(async (id: number, includeEmployees: boolean = true): Promise<DepartmentDTO | null> => {
        setLoading(true);
        setError(null);

        try {
            const department = await DepartmentService.getDepartmentById(id, includeEmployees);
            return department;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch department';
            setError(errorMessage);
            message.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Create department
    const createDepartment = useCallback(async (departmentData: CreateDepartmentRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const newDepartmentDTO = await DepartmentService.createDepartment(departmentData);
            const newDepartmentSummary: DepartmentSummaryDTO = {
                id: newDepartmentDTO.id,
                name: newDepartmentDTO.name,
                location: newDepartmentDTO.location,
                managerName: newDepartmentDTO.managerName,
            };
            setDepartments(prev => [...prev, newDepartmentSummary]);
            message.success('Department created successfully');
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to create department';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update department
    const updateDepartment = useCallback(async (id: number, departmentData: UpdateDepartmentRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const updatedDepartmentDTO = await DepartmentService.updateDepartment(id, departmentData);
            const updatedDepartmentSummary: DepartmentSummaryDTO = {
                id: updatedDepartmentDTO.id,
                name: updatedDepartmentDTO.name,
                location: updatedDepartmentDTO.location,
                managerName: updatedDepartmentDTO.managerName,
            };
            setDepartments(prev =>
                prev.map(dept => dept.id === id ? updatedDepartmentSummary : dept)
            );
            message.success('Department updated successfully');
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update department';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete department
    const deleteDepartment = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await DepartmentService.deleteDepartment(id);
            setDepartments(prev => prev.filter(dept => dept.id !== id));
            message.success('Department deleted successfully');
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to delete department';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Search departments (by name)
    const searchDepartmentsByName = useCallback(async (name: string): Promise<DepartmentSummaryDTO[]> => {
        if (!name.trim()) {
            return departments;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await DepartmentService.searchDepartmentsByName(name);
            return data;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to search departments';
            setError(errorMessage);
            message.error(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, [departments]);

    // Get list of empty departments
    const getEmptyDepartments = useCallback(async (): Promise<DepartmentDTO[]> => {
        setLoading(true);
        setError(null);

        try {
            const data = await DepartmentService.getEmptyDepartments();
            return data;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch empty departments';
            setError(errorMessage);
            message.error(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (fetchOnMount) {
            fetchDepartments();
        }
    }, [fetchOnMount, fetchDepartments]);

    return {
        // Data
        departments,

        // State
        loading,
        error,

        // Operation functions
        fetchDepartments,
        fetchDepartmentsWithEmployees,
        getDepartmentById,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        searchDepartmentsByName,
        getEmptyDepartments,
        clearError,
    };
};

export default useDepartments;
