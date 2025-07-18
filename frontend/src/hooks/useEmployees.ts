// src/hooks/useEmployees.ts
import {useCallback, useEffect, useState} from 'react';
import {message} from 'antd';
import EmployeeService from '../services/employeeService';
import {CreateEmployeeRequest, EmployeeDTO, EmployeeStatus, UpdateEmployeeRequest,} from '../types/api';

/**
 * Employee data management Hook
 * Provide employee CRUD operations and status management
 */
export const useEmployees = () => {
    const [employees, setEmployees] = useState<EmployeeDTO[]>([]);
    const [allEmployees, setAllEmployees] = useState<EmployeeDTO[]>([]); // Store all employees
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // clear error
    const clearError = useCallback(()=> {
        setError(null);
    }, []);

    // fetch all employees
    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await EmployeeService.getAllEmployees();
            setEmployees(data);
            setAllEmployees(data); // Store complete list
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch employees';
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // get employee by id
    const getEmployeeById = useCallback(async (id: number): Promise<EmployeeDTO | null> => {
        setLoading(true);
        setError(null);
        try {
            const employee = await EmployeeService.getEmployeeById(id);
            return employee;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch employee';
            setError(errorMessage);
            message.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    },[]);

    // create employee
    const createEmployee = useCallback(async (employeeData: CreateEmployeeRequest):Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const newEmployee =  await  EmployeeService.createEmployee(employeeData);
            setEmployees(prev => [...prev, newEmployee]);
            setAllEmployees(prev => [...prev, newEmployee]); // Update both lists
            message.success('Employee created successfully');
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to create employee';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update employee
    const updateEmployee = useCallback(async (id: number, employeeData: UpdateEmployeeRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const updatedEmployee = await EmployeeService.updateEmployee(id, employeeData);
            setEmployees(prev =>
                prev.map(emp => emp.id === id ? updatedEmployee : emp)
            );
            setAllEmployees(prev =>
                prev.map(emp => emp.id === id ? updatedEmployee : emp)
            );
            message.success('Employee updated successfully');
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update employee';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete employee
    const deleteEmployee = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await EmployeeService.deleteEmployee(id);
            setEmployees(prev => prev.filter(emp => emp.id !== id));
            setAllEmployees(prev => prev.filter(emp => emp.id !== id));
            message.success('Employee deleted successfully');
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to delete employee';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update employee status
    const updateEmployeeStatus = useCallback(async (id: number, status: EmployeeStatus): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const updatedEmployee = await EmployeeService.updateEmployeeStatus(id, status);
            setEmployees(prev =>
                prev.map(emp => emp.id === id ? updatedEmployee : emp)
            );
            setAllEmployees(prev =>
                prev.map(emp => emp.id === id ? updatedEmployee : emp)
            );
            message.success('Employee status updated successfully');
            return true;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update employee status';
            setError(errorMessage);
            message.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Filter employees by status
    const getEmployeesByStatus = useCallback(async (status: EmployeeStatus): Promise<EmployeeDTO[]> => {
        setLoading(true);
        setError(null);

        try {
            const data = await EmployeeService.getEmployeesByStatus(status);
            return data;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch employees by status';
            setError(errorMessage);
            message.error(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Filter employees by department
    const getEmployeesByDepartment = useCallback(async (departmentId: number): Promise<EmployeeDTO[]> => {
        setLoading(true);
        setError(null);

        try {
            const data = await EmployeeService.getEmployeesByDepartment(departmentId);
            return data;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch employees by department';
            setError(errorMessage);
            message.error(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Search employees - FIXED VERSION
    const searchEmployees = useCallback(async (name: string): Promise<void> => {
        if (!name.trim()) {
            // If search is empty, restore all employees
            setEmployees(allEmployees);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await EmployeeService.searchEmployees(name);
            setEmployees(data); // Update displayed employees with search results
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to search employees';
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [allEmployees]);

    // Reset search - restore all employees
    const resetSearch = useCallback(() => {
        setEmployees(allEmployees);
    }, [allEmployees]);

    // Automatically fetch employee list when component mounts
    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const statistics = {
        total: allEmployees.length, // Use allEmployees for accurate total count
        active: allEmployees.filter(emp => emp.status === EmployeeStatus.ACTIVE).length,
        inactive: allEmployees.filter(emp => emp.status === EmployeeStatus.INACTIVE).length,
        terminated: allEmployees.filter(emp => emp.status === EmployeeStatus.TERMINATED).length,
    }

    return {
        // data
        employees, // Currently displayed employees (filtered by search)
        allEmployees, // All employees (for statistics)
        statistics,

        // state
        loading,
        error,

        // operation functions
        fetchEmployees,
        getEmployeesByStatus,
        getEmployeeById,
        getEmployeesByDepartment,
        createEmployee,
        updateEmployee,
        updateEmployeeStatus,
        deleteEmployee,
        searchEmployees,
        resetSearch,
        clearError,
    };
};

export default useEmployees;