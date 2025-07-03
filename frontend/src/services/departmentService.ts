// src/services/departmentService.ts
import api from '../utils/api';
import {
    DepartmentDTO,
    DepartmentSummaryDTO,
    CreateDepartmentRequest,
    UpdateDepartmentRequest,
    ApiResponseDepartmentDTO,
    ApiResponseListDepartmentDTO,
    ApiResponseVoid,
} from '../types/api';

/**
 * Department Service - Handles all department-related API requests
 */
export class DepartmentService {

    /**
     * Get all departments (summary information)
     */
    static async getAllDepartmentsSummary(): Promise<DepartmentSummaryDTO[]> {
        try {
            const response: ApiResponseListDepartmentDTO = await api.get('/departments?includeEmployees=false');
            if (response.success && response.data) {
                // Convert to DepartmentSummaryDTO format
                const summaryDepartments: DepartmentSummaryDTO[] = response.data.map(dept => ({
                    id: dept.id,
                    name: dept.name,
                    location: dept.location,
                    managerName: dept.managerName,
                }));
                return summaryDepartments;
            }
            throw new Error(response.message || 'Failed to fetch department summaries');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * Get all departments (detailed information, including employees)
     */
    static async getAllDepartmentsWithEmployees(): Promise<DepartmentDTO[]> {
        try {
            const response: ApiResponseListDepartmentDTO = await api.get('/departments?includeEmployees=true');
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch departments with employees');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * Get department details by ID
     * @param id - The ID of the department
     * @param includeEmployees - Whether to include employee details
     */
    static async getDepartmentById(id: number, includeEmployees: boolean = true): Promise<DepartmentDTO> {
        try {
            const response: ApiResponseDepartmentDTO = await api.get(`/departments/${id}?includeEmployees=${includeEmployees}`);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || `Failed to fetch department with id: ${id}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * Create a new department
     * @param departmentData - The data for the new department
     */
    static async createDepartment(departmentData: CreateDepartmentRequest): Promise<DepartmentDTO> {
        try {
            const response: ApiResponseDepartmentDTO = await api.post('/departments', departmentData);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to create department');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * Update an existing department
     * @param id - The ID of the department to update
     * @param departmentData - The updated department data
     */
    static async updateDepartment(id: number, departmentData: UpdateDepartmentRequest): Promise<DepartmentDTO> {
        try {
            const response: ApiResponseDepartmentDTO = await api.put(`/departments/${id}`, departmentData);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to update department');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * Delete a department by ID
     * @param id - The ID of the department to delete
     */
    static async deleteDepartment(id: number): Promise<void> {
        try {
            const { data: responseBody } = await api.delete<ApiResponseVoid>(`/departments/${id}`);
            if (responseBody && typeof responseBody === 'object') {
                if ('success' in responseBody && !responseBody.success) {
                    const message = 'message' in responseBody ?
                        (responseBody.message as string) : 'Failed to delete department';
                    throw new Error(message);
                }


//            const {data: responseBody} = await api.delete<ApiResponseVoid>(`/departments/${id}`);
//            if (!responseBody.success) {
//                throw new Error(responseBody.message || 'Failed to delete department');

            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }


    /**
     * Search departments by name
     * @param name - The name to search for
     */
    static async searchDepartmentsByName(name: string): Promise<DepartmentSummaryDTO[]> {
        try {
            const response: ApiResponseListDepartmentDTO = await api.get(`/departments/search/name?name=${encodeURIComponent(name)}`);
            if (response.success && response.data) {
                return response.data.map(dept => ({
                    id: dept.id,
                    name: dept.name,
                    location: dept.location,
                    managerName: dept.managerName,
                }));
            }
            throw new Error(response.message || 'Failed to search departments');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }

    /**
     * Get a list of empty departments (departments with no employees)
     */
    static async getEmptyDepartments(): Promise<DepartmentDTO[]> {
        try {
            const response: ApiResponseListDepartmentDTO = await api.get('/departments/empty');
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch empty departments');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Network error');
        }
    }
}

export default DepartmentService;
