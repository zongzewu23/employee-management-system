// Complete type definition generated based on OpenAPI documen

// ====================== Common response types ======================
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
    timeStamp: string;
}
// Specialized response types
export interface ApiResponseVoid extends ApiResponse<object> {}
export interface ApiResponseBoolean extends ApiResponse<boolean> {}
export interface ApiResponseLong extends ApiResponse<number> {}

// ====================== Authentication related types ======================
export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;  // 3-50 characters
    password: string;  // > 6 chars
    email: string;
}

export  interface  AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    username: string;
    email: string;
    role: string;
}

export interface TokenValidationRequest {
    token: string;
}

export interface TokenRefreshRequest {
    refreshToken: string;
}

// ====================== Employee Related types ======================
export enum EmployeeStatus {
    ACTIVE  = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    TERMINATED = 'TERMINATED'
}

export interface EmployeeDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    salary: number;
    hireDate: string;  // date format
    status: EmployeeStatus;
    createdAt: string; // date-time format
    updatedAt: string;
    department: DepartmentSummaryDTO;
    active: boolean;
    fullName: string;
}

export interface EmployeeSummaryDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    status: EmployeeStatus;
    fullName: string;
}

export interface CreateEmployeeRequest {
    firstName: string;    // Required, max 100 characters
    lastName: string;     // Required, max 100 characters
    email: string;        // Required, max 150 characters
    phone?: string;        // Optional, max 20 characters, format: ^[+]?[\d\s()-]+$
    position?: string;    // Optional, max 100 characters
    salary?: number;      // Optional, must be greater than 0
    hireDate?: string;    // Optional, date format
    status?: EmployeeStatus; // Optional
    departmentId?: number; // Optional
}

export interface UpdateEmployeeRequest {
    firstName?: string;    // max 100 characters
    lastName?: string;     // max 100 characters
    email?: string;        // max 150 characters
    phone?: string;        // max 20 characters, format: ^[+]?[0-9\s\-\(\)]+$
    position?: string;     // max 100 characters
    salary?: number;        // must be greater than 0
    hireDate?: string;     // date format
    status?: EmployeeStatus;
    departmentId?: number;
}

// ====================== Department related types ======================
export interface DepartmentDTO {
    id: number;
    name: string;
    description: string;
    location: string;
    managerName: string;
    createdAt: string;       // date-time format
    updatedAt: string;       // date-time format
    employees: EmployeeSummaryDTO[];
    employeeCount: number;
    activeEmployeeCount: number;
    empty: boolean;
}

export interface DepartmentSummaryDTO {
    id: number;
    name: string;
    location: string;
    managerName: string;
}

export interface CreateDepartmentRequest {
    name: string;          // Required, max 100 characters
    description?: string;  // Optional, max 500 characters
    location?: string;     // Optional, max 100 characters
    managerName?: string;  // Optional, max 100 characters
}

export interface UpdateDepartmentRequest {
    name?: string;          // max 100 characters
    description?: string;  // max 500 characters
    location?: string;     // max 100 characters
    managerName?: string;  // max 100 characters
}

// ====================== API Response Types ======================
export interface ApiResponseEmployeeDTO extends ApiResponse<EmployeeDTO> {}
export interface ApiResponseListEmployeeDTO extends ApiResponse<EmployeeDTO[]> {}
export interface ApiResponseDepartmentDTO extends ApiResponse<DepartmentDTO> {}
export interface ApiResponseListDepartmentDTO extends ApiResponse<DepartmentDTO[]> {}

// ====================== API Parameter types ======================
export interface EmployeeSearchParams {
    name?: string;
    departmentId?: number;
    status?: EmployeeStatus;
}

export interface DepartmentSearchParams {
    name?: string;
    location?: string;
    manager?: string;
    includeEmployees?: boolean;
}

// ====================== User related types ======================
export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export  enum UserRole {
    ADMIN = 'ADMIN', USER = 'USER'
}
// ====================== Error handling types ======================
export interface ApiError {
    success: false;
    message: string;
    error: string;
    timeStamp: string;
}

// ====================== Request Configuration Types ======================
export interface AuthHeaders {
    Authorization: string;
}

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'ASC' | 'DESC';
}
