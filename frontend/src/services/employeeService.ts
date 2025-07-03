// src/services/employeeService.ts
import api from '../utils/api';
import {
    EmployeeDTO,
    CreateEmployeeRequest,
    UpdateEmployeeRequest,
    ApiResponseEmployeeDTO,
    ApiResponseListEmployeeDTO,
    ApiResponseLong,
    EmployeeStatus, ApiResponseVoid,
} from '../types/api';

/**
 * Employee Service - handle all the employee related Api requests
 */
export class EmployeeService {

    /**
     * get all employees
     */
    static async getAllEmployees(): Promise<EmployeeDTO[]> {
        try {
            const response: ApiResponseListEmployeeDTO = await api.get('/employees');
            if (response.success && response.data) {
                return response.data;
            }

            throw new Error(response.message || 'Failed to fetch employees');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * get an employee with passed in id
     */
    static async getEmployeeById(id: number): Promise<EmployeeDTO> {
        try {
            const response: ApiResponseEmployeeDTO = await api.get(`/employees/${id}`);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || `Failed to fetch employee with id: ${id}`)
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * create an employee
     */
    static async createEmployee(employeeData: CreateEmployeeRequest): Promise<EmployeeDTO> {
        try {
            const response: ApiResponseEmployeeDTO = await api.post('/employees', employeeData);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to create employee');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * update an employee with id
     */
    static async updateEmployee(id: number, employeeData: UpdateEmployeeRequest): Promise<EmployeeDTO> {
        try {
            const response: ApiResponseEmployeeDTO = await api.put(`/employees/${id}`, employeeData);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to update employee');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * 删除员工 - 修复版本
     * @param id 员工ID
     */
    static async deleteEmployee(id: number): Promise<void> {
        try {
            const { data: responseBody } = await api.delete<ApiResponseVoid>(`/employees/${id}`);

            console.log('Delete response:', responseBody);

            if (responseBody && typeof responseBody === 'object') {
                if ('success' in responseBody && !responseBody.success) {
                    const message = 'message' in responseBody ?
                        (responseBody.message as string) : 'Failed to delete employee';
                    throw new Error(message);
                }
            }

            console.log(`Employee ${id} deleted successfully`);

        } catch (error: any) {
            console.error('Delete employee error:', error);

            if (error.response) {
                const status = error.response.status;
                const responseData = error.response.data;

                let message = 'An error occurred';
                if (responseData && typeof responseData === 'object' && 'message' in responseData) {
                    message = responseData.message as string;
                } else if (error.message) {
                    message = error.message;
                }

                if (status === 404) {
                    throw new Error(`Employee with ID ${id} not found`);
                } else if (status === 403) {
                    throw new Error('You do not have permission to delete this employee');
                } else {
                    throw new Error(`Server error (${status}): ${message}`);
                }
            } else if (error.request) {
                throw new Error('Network error: Unable to connect to server');
            } else {
                throw new Error(error.message || 'An unexpected error occurred');
            }
        }
    }

    /**
     * update employee status
     */
    static async updateEmployeeStatus(id: number, status: EmployeeStatus): Promise<EmployeeDTO> {
        try {
            const response: ApiResponseEmployeeDTO = await api.put(`/employees/${id}/status?status=${status}`);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to update employee status');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * get employees by status
     * @param status
     */
    static async getEmployeesByStatus(status: EmployeeStatus): Promise<EmployeeDTO[]> {
        try {
            const response: ApiResponseListEmployeeDTO = await api.get(`/employees/status/${status}`);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch employees by status');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * get employees by department id
     */
    static async getEmployeesByDepartment(departmentId: number): Promise<EmployeeDTO[]> {
        try {
            const response: ApiResponseListEmployeeDTO = await api.get(`/employees/department/${departmentId}`);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch employees by department');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * search employee by name
     */
    static async searchEmployees(name: string): Promise<EmployeeDTO[]> {
        try {
            const response: ApiResponseListEmployeeDTO = await api.get(`/employees/search?name=${encodeURIComponent(name)}`);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to search employees by name');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * get the number of employees in the department with the specified departmentId
     */
    static async getEmployeeCountByDepartment(departmentId: number): Promise<number> {
        try {
            const response: ApiResponseLong = await api.get(`/employees/count/department/${departmentId}`);
            if (response.success && typeof response.data === 'number') {
                return response.data;
            }
            throw new Error(response.message || 'Failed to get employee count');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }
}

export default EmployeeService;