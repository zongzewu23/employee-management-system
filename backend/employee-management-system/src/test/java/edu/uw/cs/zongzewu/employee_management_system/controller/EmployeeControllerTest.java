package edu.uw.cs.zongzewu.employee_management_system.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import edu.uw.cs.zongzewu.employee_management_system.dto.CreateEmployeeRequest;
import edu.uw.cs.zongzewu.employee_management_system.dto.UpdateEmployeeRequest;
import edu.uw.cs.zongzewu.employee_management_system.entity.Department;
import edu.uw.cs.zongzewu.employee_management_system.entity.Employee;
import edu.uw.cs.zongzewu.employee_management_system.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Comprehensive Employee Controller Test using Mockito Standalone Setup
 * This bypasses Spring Security entirely by not loading the Spring context
 */
@ExtendWith(MockitoExtension.class)
class EmployeeControllerTest {

    private MockMvc mockMvc;

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private EmployeeController employeeController;

    private ObjectMapper objectMapper;
    private Employee testEmployee;
    private Department testDepartment;

    @BeforeEach
    void setUp() {
        // Use StandaloneSetup to avoid Spring Security issues
        mockMvc = MockMvcBuilders.standaloneSetup(employeeController).build();

        // Configure ObjectMapper
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        // Create test data
        setupTestData();
    }

    private void setupTestData() {
        // Create test department
        testDepartment = new Department();
        testDepartment.setId(1L);
        testDepartment.setName("Engineering");
        testDepartment.setDescription("Software Development");
        testDepartment.setLocation("Seattle, WA");
        testDepartment.setManagerName("John Manager");
        testDepartment.setCreatedAt(LocalDateTime.now());
        testDepartment.setUpdatedAt(LocalDateTime.now());

        // Create test employee
        testEmployee = new Employee();
        testEmployee.setId(1L);
        testEmployee.setFirstName("John");
        testEmployee.setLastName("Doe");
        testEmployee.setEmail("john.doe@company.com");
        testEmployee.setPhone("1234567890");
        testEmployee.setPosition("Software Engineer");
        testEmployee.setSalary(new BigDecimal("75000.00"));
        testEmployee.setHireDate(LocalDate.of(2023, 1, 15));
        testEmployee.setStatus(Employee.EmployeeStatus.ACTIVE);
        testEmployee.setDepartment(testDepartment);
        testEmployee.setCreatedAt(LocalDateTime.now());
        testEmployee.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("GET /api/employees - Should return all employees successfully")
    void getAllEmployees_ShouldReturnAllEmployees_WhenCalled() throws Exception {
        // Given
        List<Employee> employees = Arrays.asList(testEmployee);
        when(employeeService.getAllEmployees()).thenReturn(employees);

        // When & Then
        mockMvc.perform(get("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Success"))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].firstName").value("John"))
                .andExpect(jsonPath("$.data[0].lastName").value("Doe"))
                .andExpect(jsonPath("$.data[0].email").value("john.doe@company.com"))
                .andExpect(jsonPath("$.data[0].department.name").value("Engineering"));

        // Verify service method was called exactly once
        verify(employeeService, times(1)).getAllEmployees();
        verifyNoMoreInteractions(employeeService);
    }

    @Test
    @DisplayName("GET /api/employees/{id} - Should return employee by ID successfully")
    void getEmployeeById_ShouldReturnEmployee_WhenEmployeeExists() throws Exception {
        // Given
        when(employeeService.getEmployeeById(1L)).thenReturn(Optional.of(testEmployee));

        // When & Then
        mockMvc.perform(get("/api/employees/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.firstName").value("John"))
                .andExpect(jsonPath("$.data.lastName").value("Doe"))
                .andExpect(jsonPath("$.data.email").value("john.doe@company.com"));

        verify(employeeService, times(1)).getEmployeeById(1L);
    }

    @Test
    @DisplayName("GET /api/employees/{id} - Should return 404 when employee not found")
    void getEmployeeById_ShouldReturn404_WhenEmployeeNotFound() throws Exception {
        // Given
        when(employeeService.getEmployeeById(999L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/employees/999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Resource not found"));

        verify(employeeService, times(1)).getEmployeeById(999L);
    }

    @Test
    @DisplayName("POST /api/employees - Should create employee successfully")
    void createEmployee_ShouldCreateEmployee_WhenValidData() throws Exception {
        // Given
        CreateEmployeeRequest request = new CreateEmployeeRequest();
        request.setFirstName("Jane");
        request.setLastName("Smith");
        request.setEmail("jane.smith@company.com");
        request.setPhone("0987654321");
        request.setPosition("Product Manager");
        request.setSalary(new BigDecimal("85000.00"));
        request.setHireDate(LocalDate.of(2023, 6, 1));
        request.setDepartmentId(1L);

        Employee createdEmployee = new Employee();
        createdEmployee.setId(2L);
        createdEmployee.setFirstName("Jane");
        createdEmployee.setLastName("Smith");
        createdEmployee.setEmail("jane.smith@company.com");
        createdEmployee.setPhone("0987654321");
        createdEmployee.setPosition("Product Manager");
        createdEmployee.setSalary(new BigDecimal("85000.00"));
        createdEmployee.setHireDate(LocalDate.of(2023, 6, 1));
        createdEmployee.setStatus(Employee.EmployeeStatus.ACTIVE);
        createdEmployee.setDepartment(testDepartment);

        when(employeeService.createEmployee(any(Employee.class), eq(1L))).thenReturn(createdEmployee);

        // When & Then
        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Employee created successfully"))
                .andExpect(jsonPath("$.data.firstName").value("Jane"))
                .andExpect(jsonPath("$.data.lastName").value("Smith"))
                .andExpect(jsonPath("$.data.email").value("jane.smith@company.com"));

        verify(employeeService, times(1)).createEmployee(any(Employee.class), eq(1L));
    }

    @Test
    @DisplayName("POST /api/employees - Should return validation error for invalid data")
    void createEmployee_ShouldReturnValidationError_WhenInvalidData() throws Exception {
        // Given - Create invalid request with empty first name
        CreateEmployeeRequest request = new CreateEmployeeRequest();
        request.setFirstName(""); // Invalid - empty
        request.setLastName("Smith");
        request.setEmail("invalid-email"); // Invalid email format

        // When & Then
        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));

        verify(employeeService, never()).createEmployee(any(Employee.class), any());
    }

    @Test
    @DisplayName("PUT /api/employees/{id} - Should update employee successfully")
    void updateEmployee_ShouldUpdateEmployee_WhenValidData() throws Exception {
        // Given
        UpdateEmployeeRequest request = new UpdateEmployeeRequest();
        request.setFirstName("John Updated");
        request.setPosition("Senior Software Engineer");
        request.setSalary(new BigDecimal("85000.00"));

        Employee updatedEmployee = new Employee();
        updatedEmployee.setId(1L);
        updatedEmployee.setFirstName("John Updated");
        updatedEmployee.setLastName("Doe");
        updatedEmployee.setEmail("john.doe@company.com");
        updatedEmployee.setPosition("Senior Software Engineer");
        updatedEmployee.setSalary(new BigDecimal("85000.00"));
        updatedEmployee.setDepartment(testDepartment);

        when(employeeService.updateEmployee(eq(1L), any(UpdateEmployeeRequest.class))).thenReturn(updatedEmployee);

        // When & Then
        mockMvc.perform(put("/api/employees/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Employee updated successfully"))
                .andExpect(jsonPath("$.data.firstName").value("John Updated"))
                .andExpect(jsonPath("$.data.position").value("Senior Software Engineer"));

        verify(employeeService, times(1)).updateEmployee(eq(1L), any(UpdateEmployeeRequest.class));
    }

    @Test
    @DisplayName("PUT /api/employees/{id} - Should return 404 when employee not found")
    void updateEmployee_ShouldReturn404_WhenEmployeeNotFound() throws Exception {
        // Given
        UpdateEmployeeRequest request = new UpdateEmployeeRequest();
        request.setFirstName("Updated Name");

        when(employeeService.updateEmployee(eq(999L), any(UpdateEmployeeRequest.class)))
                .thenThrow(new RuntimeException("Employee not found"));

        // When & Then
        mockMvc.perform(put("/api/employees/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Resource not found"));

        verify(employeeService, times(1)).updateEmployee(eq(999L), any(UpdateEmployeeRequest.class));
    }

    @Test
    @DisplayName("DELETE /api/employees/{id} - Should delete employee successfully")
    void deleteEmployee_ShouldDeleteEmployee_WhenEmployeeExists() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/employees/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Employee deleted successfully"));

        verify(employeeService, times(1)).deleteEmployee(1L);
    }

    @Test
    @DisplayName("DELETE /api/employees/{id} - Should return 404 when employee not found")
    void deleteEmployee_ShouldReturn404_WhenEmployeeNotFound() throws Exception {
        // Given
        doThrow(new RuntimeException("Employee not found")).when(employeeService).deleteEmployee(999L);

        // When & Then
        mockMvc.perform(delete("/api/employees/999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Resource not found"));

        verify(employeeService, times(1)).deleteEmployee(999L);
    }

    @Test
    @DisplayName("GET /api/employees/department/{departmentId} - Should return employees by department")
    void getEmployeesByDepartment_ShouldReturnEmployees_WhenDepartmentExists() throws Exception {
        // Given
        List<Employee> employees = Arrays.asList(testEmployee);
        when(employeeService.getEmployeesByDepartment(1L)).thenReturn(employees);

        // When & Then
        mockMvc.perform(get("/api/employees/department/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Found 1 employees in department 1"))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].department.name").value("Engineering"));

        verify(employeeService, times(1)).getEmployeesByDepartment(1L);
    }

    @Test
    @DisplayName("GET /api/employees/status/{status} - Should return employees by status")
    void getEmployeesByStatus_ShouldReturnEmployees_WhenStatusValid() throws Exception {
        // Given
        List<Employee> activeEmployees = Arrays.asList(testEmployee);
        when(employeeService.getEmployeesByStatus(Employee.EmployeeStatus.ACTIVE)).thenReturn(activeEmployees);

        // When & Then
        mockMvc.perform(get("/api/employees/status/ACTIVE")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Found 1 employees with status ACTIVE"))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].status").value("ACTIVE"));

        verify(employeeService, times(1)).getEmployeesByStatus(Employee.EmployeeStatus.ACTIVE);
    }

    @Test
    @DisplayName("GET /api/employees/search?name=xxx - Should return employees matching search")
    void searchEmployees_ShouldReturnEmployees_WhenNameMatches() throws Exception {
        // Given
        List<Employee> searchResults = Arrays.asList(testEmployee);
        when(employeeService.searchEmployeesByName("John")).thenReturn(searchResults);

        // When & Then
        mockMvc.perform(get("/api/employees/search")
                        .param("name", "John")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Found 1 employees matching 'John'"))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].firstName").value("John"));

        verify(employeeService, times(1)).searchEmployeesByName("John");
    }

    @Test
    @DisplayName("PATCH /api/employees/{id}/status - Should update employee status successfully")
    void updateEmployeeStatus_ShouldUpdateStatus_WhenEmployeeExists() throws Exception {
        // Given
        Employee updatedEmployee = new Employee();
        updatedEmployee.setId(1L);
        updatedEmployee.setFirstName("John");
        updatedEmployee.setLastName("Doe");
        updatedEmployee.setStatus(Employee.EmployeeStatus.INACTIVE);

        when(employeeService.updateEmployeeStatus(1L, Employee.EmployeeStatus.INACTIVE)).thenReturn(updatedEmployee);

        // When & Then
        mockMvc.perform(patch("/api/employees/1/status")
                        .param("status", "INACTIVE")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Employee status updated to INACTIVE"))
                .andExpect(jsonPath("$.data.status").value("INACTIVE"));

        verify(employeeService, times(1)).updateEmployeeStatus(1L, Employee.EmployeeStatus.INACTIVE);
    }

    @Test
    @DisplayName("GET /api/employees/count/department/{departmentId} - Should return employee count")
    void getEmployeeCountByDepartment_ShouldReturnCount_WhenDepartmentExists() throws Exception {
        // Given
        when(employeeService.getEmployeeCountByDepartment(1L)).thenReturn(5L);

        // When & Then
        mockMvc.perform(get("/api/employees/count/department/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Department 1 has 5 employees"))
                .andExpect(jsonPath("$.data").value(5));

        verify(employeeService, times(1)).getEmployeeCountByDepartment(1L);
    }
}