package edu.uw.cs.zongzewu.employee_management_system.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.uw.cs.zongzewu.employee_management_system.dto.CreateEmployeeRequest;
import edu.uw.cs.zongzewu.employee_management_system.dto.UpdateEmployeeRequest;
import edu.uw.cs.zongzewu.employee_management_system.entity.Department;
import edu.uw.cs.zongzewu.employee_management_system.entity.Employee;
import edu.uw.cs.zongzewu.employee_management_system.repository.DepartmentRepository;
import edu.uw.cs.zongzewu.employee_management_system.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test") // Use test profile
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@Transactional
class EmployeeIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    private Department testDepartment;

    @BeforeEach
    void setUp() {
        // Clear the database
        employeeRepository.deleteAll();
        departmentRepository.deleteAll();

        // Create test department
        testDepartment = new Department();
        testDepartment.setName("Test Engineering");
        testDepartment.setDescription("Test Department");
        testDepartment.setLocation("Test Location");
        testDepartment.setManagerName("Test Manager");
        testDepartment = departmentRepository.save(testDepartment);
    }

    @Test
    @DisplayName("Full Employee CRUD Flow Test")
    @WithMockUser(roles = "ADMIN")
    void fullEmployeeCrudFlow() throws Exception {
        // 1. Create Employee
        CreateEmployeeRequest createRequest = new CreateEmployeeRequest();
        createRequest.setFirstName("Integration");
        createRequest.setLastName("Test");
        createRequest.setEmail("integration.test@company.com");
        createRequest.setPhone("1234567890");
        createRequest.setPosition("Test Engineer");
        createRequest.setSalary(new BigDecimal("70000.00"));
        createRequest.setHireDate(LocalDate.of(2023, 1, 1));
        createRequest.setStatus(Employee.EmployeeStatus.ACTIVE);
        createRequest.setDepartmentId(testDepartment.getId());

        // Create employee
        String createResponse = mockMvc.perform(post("/api/employees")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.firstName").value("Integration"))
                .andExpect(jsonPath("$.data.department.name").value("Test Engineering"))
                .andReturn().getResponse().getContentAsString();

        // Extract the created employee ID
        Long employeeId = objectMapper.readTree(createResponse)
                .get("data").get("id").asLong();

        // 2. Get Employee Details
        mockMvc.perform(get("/api/employees/" + employeeId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.firstName").value("Integration"))
                .andExpect(jsonPath("$.data.email").value("integration.test@company.com"));

        // 3. Update Employee
        UpdateEmployeeRequest updateRequest = new UpdateEmployeeRequest();
        updateRequest.setFirstName("Updated Integration");
        updateRequest.setPosition("Senior Test Engineer");
        updateRequest.setSalary(new BigDecimal("80000.00"));

        mockMvc.perform(put("/api/employees/" + employeeId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.firstName").value("Updated Integration"))
                .andExpect(jsonPath("$.data.position").value("Senior Test Engineer"));

        // 4. Search Employees
        mockMvc.perform(get("/api/employees/search")
                        .param("name", "Updated")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].firstName").value("Updated Integration"));

        // 5. Get Employees by Department
        mockMvc.perform(get("/api/employees/department/" + testDepartment.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)));

        // 6. Update Employee Status
        mockMvc.perform(patch("/api/employees/" + employeeId + "/status")
                        .with(csrf())
                        .param("status", "INACTIVE")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("INACTIVE"));

        // 7. Get Employees by Status
        mockMvc.perform(get("/api/employees/status/INACTIVE")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)));

        // 8. Delete Employee
        mockMvc.perform(delete("/api/employees/" + employeeId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 9. Verify employee deleted
        mockMvc.perform(get("/api/employees/" + employeeId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test Business Rule Validation")
    @WithMockUser(roles = "ADMIN")
    void testBusinessValidation() throws Exception {
        // 1. Test email uniqueness
        CreateEmployeeRequest request1 = new CreateEmployeeRequest();
        request1.setFirstName("First");
        request1.setLastName("Employee");
        request1.setEmail("duplicate@company.com");
        request1.setPosition("Engineer");
        request1.setSalary(new BigDecimal("50000"));
        request1.setDepartmentId(testDepartment.getId());

        // Create the first employee
        mockMvc.perform(post("/api/employees")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());

        // Try to create an employee with the same email
        CreateEmployeeRequest request2 = new CreateEmployeeRequest();
        request2.setFirstName("Second");
        request2.setLastName("Employee");
        request2.setEmail("duplicate@company.com"); // Same email
        request2.setPosition("Developer");
        request2.setSalary(new BigDecimal("60000"));
        request2.setDepartmentId(testDepartment.getId());

        mockMvc.perform(post("/api/employees")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Failed to create employee"));

        // 2. Test invalid department ID
        CreateEmployeeRequest request3 = new CreateEmployeeRequest();
        request3.setFirstName("Third");
        request3.setLastName("Employee");
        request3.setEmail("valid@company.com");
        request3.setPosition("Tester");
        request3.setSalary(new BigDecimal("55000"));
        request3.setDepartmentId(9999L); // Non-existent department ID

        mockMvc.perform(post("/api/employees")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request3)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("Test Database Consistency")
    @WithMockUser(roles = "ADMIN")
    void testDatabaseConsistency() throws Exception {
        // Create employee
        CreateEmployeeRequest createRequest = new CreateEmployeeRequest();
        createRequest.setFirstName("DB");
        createRequest.setLastName("Test");
        createRequest.setEmail("db.test@company.com");
        createRequest.setPosition("DB Engineer");
        createRequest.setSalary(new BigDecimal("65000"));
        createRequest.setDepartmentId(testDepartment.getId());

        String response = mockMvc.perform(post("/api/employees")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long employeeId = objectMapper.readTree(response)
                .get("data").get("id").asLong();

        // Verify the employee exists in the database
        Employee savedEmployee = employeeRepository.findById(employeeId).orElse(null);
        assert savedEmployee != null;
        assert savedEmployee.getFirstName().equals("DB");
        assert savedEmployee.getDepartment().getId().equals(testDepartment.getId());

        // Verify department employee count
        mockMvc.perform(get("/api/employees/count/department/" + testDepartment.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(1));
    }

    @Test
    @DisplayName("Test Permission Control")
    @WithMockUser(roles = "USER") // USER role
    void testPermissionControl() throws Exception {
        // USER role can view employees
        mockMvc.perform(get("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // But cannot create employees
        CreateEmployeeRequest createRequest = new CreateEmployeeRequest();
        createRequest.setFirstName("Unauthorized");
        createRequest.setLastName("User");
        createRequest.setEmail("unauthorized@company.com");
        createRequest.setPosition("Developer");
        createRequest.setSalary(new BigDecimal("60000"));
        createRequest.setDepartmentId(testDepartment.getId()); // Added department ID for a more complete request

        mockMvc.perform(post("/api/employees")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isForbidden());
    }
}