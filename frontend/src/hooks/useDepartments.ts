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
 * @param {boolean} includeEmployees - Whether to fetch departments with employee details, defaults to false
 */
export const useDepartments = (fetchOnMount: boolean = false, includeEmployees: boolean = false) => {
    // State definitions
    const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
    const [departmentsSummary, setDepartmentsSummary] = useState<DepartmentSummaryDTO[]>([]);
    const [allDepartments, setAllDepartments] = useState<DepartmentDTO[]>([]); // Store all departments
    const [allDepartmentsSummary, setAllDepartmentsSummary] = useState<DepartmentSummaryDTO[]>([]); // Store all departments summary

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Fetch all departments with full details (including employees)
    const fetchDepartmentsWithEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await DepartmentService.getAllDepartmentsWithEmployees();
            setDepartments(data);
            setAllDepartments(data); // Store complete list
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

    // Fetch all departments (summary information only)
    const fetchDepartmentsSummary = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await DepartmentService.getAllDepartmentsSummary();
            setDepartmentsSummary(data);
            setAllDepartmentsSummary(data); // Store complete list
            return data;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch departments';
            setError(errorMessage);
            message.error(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Unified fetch function that respects the includeEmployees parameter
    const fetchDepartments = useCallback(async () => {
        if (includeEmployees) {
            return await fetchDepartmentsWithEmployees();
        } else {
            return await fetchDepartmentsSummary();
        }
    }, [includeEmployees, fetchDepartmentsWithEmployees, fetchDepartmentsSummary]);

    // Get department details by ID
    const getDepartmentById = useCallback(async (id: number, includeEmployeeDetails: boolean = true): Promise<DepartmentDTO | null> => {
        setLoading(true);
        setError(null);

        try {
            const department = await DepartmentService.getDepartmentById(id, includeEmployeeDetails);
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
            const newDepartment = await DepartmentService.createDepartment(departmentData);

            // Update both current and all state based on mode
            if (includeEmployees) {
                setDepartments(prev => [...prev, newDepartment]);
                setAllDepartments(prev => [...prev, newDepartment]);
            } else {
                const newDepartmentSummary: DepartmentSummaryDTO = {
                    id: newDepartment.id,
                    name: newDepartment.name,
                    location: newDepartment.location,
                    managerName: newDepartment.managerName,
                };
                setDepartmentsSummary(prev => [...prev, newDepartmentSummary]);
                setAllDepartmentsSummary(prev => [...prev, newDepartmentSummary]);
            }

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
    }, [includeEmployees]);

    // Update department
    const updateDepartment = useCallback(async (id: number, departmentData: UpdateDepartmentRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const updatedDepartment = await DepartmentService.updateDepartment(id, departmentData);

            // Update both current and all state based on mode
            if (includeEmployees) {
                setDepartments(prev =>
                    prev.map(dept => dept.id === id ? updatedDepartment : dept)
                );
                setAllDepartments(prev =>
                    prev.map(dept => dept.id === id ? updatedDepartment : dept)
                );
            } else {
                const updatedDepartmentSummary: DepartmentSummaryDTO = {
                    id: updatedDepartment.id,
                    name: updatedDepartment.name,
                    location: updatedDepartment.location,
                    managerName: updatedDepartment.managerName,
                };
                setDepartmentsSummary(prev =>
                    prev.map(dept => dept.id === id ? updatedDepartmentSummary : dept)
                );
                setAllDepartmentsSummary(prev =>
                    prev.map(dept => dept.id === id ? updatedDepartmentSummary : dept)
                );
            }

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
    }, [includeEmployees]);

    // Delete department
    const deleteDepartment = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await DepartmentService.deleteDepartment(id);

            // Update both current and all state based on mode
            if (includeEmployees) {
                setDepartments(prev => prev.filter(dept => dept.id !== id));
                setAllDepartments(prev => prev.filter(dept => dept.id !== id));
            } else {
                setDepartmentsSummary(prev => prev.filter(dept => dept.id !== id));
                setAllDepartmentsSummary(prev => prev.filter(dept => dept.id !== id));
            }

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
    }, [includeEmployees]);

    // Search departments (by name) - FIXED VERSION
    const searchDepartmentsByName = useCallback(async (name: string): Promise<void> => {
        if (!name.trim()) {
            // If search is empty, restore all departments
            if (includeEmployees) {
                setDepartments(allDepartments);
            } else {
                setDepartmentsSummary(allDepartmentsSummary);
            }
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await DepartmentService.searchDepartmentsByName(name);

            // Update the displayed departments with search results
            if (includeEmployees) {
                setDepartments(data as DepartmentDTO[]);
            } else {
                setDepartmentsSummary(data as DepartmentSummaryDTO[]);
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to search departments';
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [includeEmployees, allDepartments, allDepartmentsSummary]);

    // Reset search - restore all departments
    const resetSearch = useCallback(() => {
        if (includeEmployees) {
            setDepartments(allDepartments);
        } else {
            setDepartmentsSummary(allDepartmentsSummary);
        }
    }, [includeEmployees, allDepartments, allDepartmentsSummary]);

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

    // Refresh departments data after any modification
    const refreshDepartments = useCallback(async () => {
        return await fetchDepartments();
    }, [fetchDepartments]);

    // Get departments for dropdown/selection (returns summary format)
    const getDepartmentsForSelection = useCallback(async (): Promise<DepartmentSummaryDTO[]> => {
        try {
            const data = await DepartmentService.getAllDepartmentsSummary();
            return data;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch departments for selection';
            setError(errorMessage);
            return [];
        }
    }, []);

    // Computed statistics - use all departments for accurate counts
    const statistics = {
        total: includeEmployees ? allDepartments.length : allDepartmentsSummary.length,
        empty: includeEmployees ? allDepartments.filter(dept => dept.empty).length : 0,
        withEmployees: includeEmployees ? allDepartments.filter(dept => !dept.empty).length : 0,
        totalEmployees: includeEmployees ? allDepartments.reduce((sum, dept) => sum + dept.employeeCount, 0) : 0,
        averageEmployeesPerDept: includeEmployees && allDepartments.length > 0
            ? Math.round(allDepartments.reduce((sum, dept) => sum + dept.employeeCount, 0) / allDepartments.length * 100) / 100
            : 0,
    };

    useEffect(() => {
        if (fetchOnMount) {
            fetchDepartments();
        }
    }, [fetchOnMount, fetchDepartments]);

    return {
        // Data - return the appropriate data based on mode (filtered by search)
        departments: includeEmployees ? departments : departmentsSummary,
        departmentsDetailed: departments,
        departmentsSummary,
        allDepartments, // Complete list for reference
        allDepartmentsSummary, // Complete summary list for reference
        statistics,

        // State
        loading,
        error,

        // Operation functions
        fetchDepartments,
        fetchDepartmentsWithEmployees,
        fetchDepartmentsSummary,
        getDepartmentById,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        searchDepartmentsByName,
      
        resetSearch,

        getEmptyDepartments,
        refreshDepartments,
        getDepartmentsForSelection,
        clearError,
    };
};

export default useDepartments;