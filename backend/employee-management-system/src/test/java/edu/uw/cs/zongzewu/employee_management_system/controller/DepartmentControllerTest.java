package edu.uw.cs.zongzewu.employee_management_system.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.uw.cs.zongzewu.employee_management_system.dto.CreateDepartmentRequest;
import edu.uw.cs.zongzewu.employee_management_system.dto.UpdateDepartmentRequest;
import edu.uw.cs.zongzewu.employee_management_system.entity.Department;
import edu.uw.cs.zongzewu.employee_management_system.service.DepartmentService;
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

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Simple Department Controller Test using Mockito Standalone Setup
 * This bypasses Spring Security entirely by not loading the Spring context
 */
@ExtendWith(MockitoExtension.class)
class DepartmentControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private DepartmentService departmentService;

    @InjectMocks
    private DepartmentController departmentController;

    private Department testDepartment;

    @BeforeEach
    void setUp() {
        // Use StandaloneSetup to avoid Spring Security issues
        mockMvc = MockMvcBuilders.standaloneSetup(departmentController).build();

        // Configure ObjectMapper
        objectMapper = new ObjectMapper();

        // Create test data
        testDepartment = new Department();
        testDepartment.setId(1L);
        testDepartment.setName("Engineering");
        testDepartment.setDescription("Software Development Department");
        testDepartment.setLocation("Seattle, WA");
        testDepartment.setManagerName("John Manager");
        testDepartment.setCreatedAt(LocalDateTime.now());
        testDepartment.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Get all departments - Success")
    void getAllDepartments_Success() throws Exception {
        // Given
        List<Department> departments = Arrays.asList(testDepartment);
        when(departmentService.getAllDepartments()).thenReturn(departments);

        // When & Then
        mockMvc.perform(get("/api/departments")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].name").value("Engineering"))
                .andExpect(jsonPath("$.data[0].location").value("Seattle, WA"))
                .andExpect(jsonPath("$.data[0].managerName").value("John Manager"));
    }

    @Test
    @DisplayName("Get department by ID - Success")
    void getDepartmentById_Success() throws Exception {
        // Given
        when(departmentService.getDepartmentById(1L)).thenReturn(Optional.of(testDepartment));

        // When & Then
        mockMvc.perform(get("/api/departments/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Engineering"))
                .andExpect(jsonPath("$.data.description").value("Software Development Department"));
    }

    @Test
    @DisplayName("Get department by ID - Not Found")
    void getDepartmentById_NotFound() throws Exception {
        // Given
        when(departmentService.getDepartmentById(999L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/departments/999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Resource not found"));
    }

    @Test
    @DisplayName("Create department - Success")
    void createDepartment_Success() throws Exception {
        // Given
        CreateDepartmentRequest request = new CreateDepartmentRequest();
        request.setName("Marketing");
        request.setDescription("Marketing and Sales Department");
        request.setLocation("San Francisco, CA");
        request.setManagerName("Jane Marketing");

        Department createdDepartment = new Department();
        createdDepartment.setId(2L);
        createdDepartment.setName("Marketing");
        createdDepartment.setDescription("Marketing and Sales Department");
        createdDepartment.setLocation("San Francisco, CA");
        createdDepartment.setManagerName("Jane Marketing");
        createdDepartment.setCreatedAt(LocalDateTime.now());
        createdDepartment.setUpdatedAt(LocalDateTime.now());

        when(departmentService.createDepartment(any(Department.class))).thenReturn(createdDepartment);

        // When & Then
        mockMvc.perform(post("/api/departments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Department created successfully"))
                .andExpect(jsonPath("$.data.name").value("Marketing"))
                .andExpect(jsonPath("$.data.location").value("San Francisco, CA"));
    }

    @Test
    @DisplayName("Create department - Validation Failure")
    void createDepartment_ValidationError() throws Exception {
        // Given - Create an invalid request (assuming name is a required field)
        CreateDepartmentRequest request = new CreateDepartmentRequest();
        request.setName(""); // Empty name
        request.setDescription("Test Description");

        // When & Then
        mockMvc.perform(post("/api/departments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("Update department - Success")
    void updateDepartment_Success() throws Exception {
        // Given
        UpdateDepartmentRequest request = new UpdateDepartmentRequest();
        request.setName("Engineering Updated");
        request.setDescription("Updated Software Development Department");
        request.setLocation("Bellevue, WA");

        Department updatedDepartment = new Department();
        updatedDepartment.setId(1L);
        updatedDepartment.setName("Engineering Updated");
        updatedDepartment.setDescription("Updated Software Development Department");
        updatedDepartment.setLocation("Bellevue, WA");
        updatedDepartment.setManagerName("John Manager");

        when(departmentService.updateDepartment(eq(1L), any(UpdateDepartmentRequest.class)))
                .thenReturn(updatedDepartment);

        // When & Then
        mockMvc.perform(put("/api/departments/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Department updated successfully"))
                .andExpect(jsonPath("$.data.name").value("Engineering Updated"))
                .andExpect(jsonPath("$.data.location").value("Bellevue, WA"));
    }

    @Test
    @DisplayName("Delete department - Success")
    void deleteDepartment_Success() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/departments/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Department deleted successfully"));
    }

    @Test
    @DisplayName("Search departments by name - Success")
    void searchDepartmentsByName_Success() throws Exception {
        // Given
        List<Department> departments = Arrays.asList(testDepartment);
        when(departmentService.searchDepartmentsByName("Engineering")).thenReturn(departments);

        // When & Then
        mockMvc.perform(get("/api/departments/search/name")
                        .param("name", "Engineering")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].name").value("Engineering"));
    }

    @Test
    @DisplayName("Search departments by location - Success")
    void searchDepartmentsByLocation_Success() throws Exception {
        // Given
        List<Department> departments = Arrays.asList(testDepartment);
        when(departmentService.searchDepartmentsByLocation("Seattle")).thenReturn(departments);

        // When & Then
        mockMvc.perform(get("/api/departments/search/location")
                        .param("location", "Seattle")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].location").value("Seattle, WA"));
    }

    @Test
    @DisplayName("Search departments by manager - Success")
    void searchDepartmentsByManager_Success() throws Exception {
        // Given
        List<Department> departments = Arrays.asList(testDepartment);
        when(departmentService.searchDepartmentsByManager("John")).thenReturn(departments);

        // When & Then
        mockMvc.perform(get("/api/departments/search/manager")
                        .param("manager", "John")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].managerName").value("John Manager"));
    }

    @Test
    @DisplayName("Get departments with employees - Success")
    void getDepartmentsWithEmployees_Success() throws Exception {
        // Given
        List<Department> departments = Arrays.asList(testDepartment);
        when(departmentService.getDepartmentsWithEmployees()).thenReturn(departments);

        // When & Then
        mockMvc.perform(get("/api/departments/with-employees")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)));
    }

    @Test
    @DisplayName("Get empty departments - Success")
    void getEmptyDepartments_Success() throws Exception {
        // Given
        List<Department> departments = Arrays.asList(testDepartment);
        when(departmentService.getEmptyDepartments()).thenReturn(departments);

        // When & Then
        mockMvc.perform(get("/api/departments/empty")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)));
    }

    @Test
    @DisplayName("Get employee count for department - Success")
    void getEmployeeCount_Success() throws Exception {
        // Given
        when(departmentService.getEmployeeCount(1L)).thenReturn(5L);

        // When & Then
        mockMvc.perform(get("/api/departments/1/employee-count")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value(5));
    }

    @Test
    @DisplayName("Check if department exists - Success")
    void departmentExists_Success() throws Exception {
        // Given
        when(departmentService.departmentExists(1L)).thenReturn(true);

        // When & Then
        mockMvc.perform(get("/api/departments/1/exists")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value(true));
    }
}