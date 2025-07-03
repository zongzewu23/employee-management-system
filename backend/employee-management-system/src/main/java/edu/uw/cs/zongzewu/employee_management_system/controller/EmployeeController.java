package edu.uw.cs.zongzewu.employee_management_system.controller;


import edu.uw.cs.zongzewu.employee_management_system.dto.ApiResponse;
import edu.uw.cs.zongzewu.employee_management_system.dto.CreateEmployeeRequest;
import edu.uw.cs.zongzewu.employee_management_system.dto.EmployeeDTO;
import edu.uw.cs.zongzewu.employee_management_system.dto.UpdateEmployeeRequest;
import edu.uw.cs.zongzewu.employee_management_system.entity.Employee;
import edu.uw.cs.zongzewu.employee_management_system.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {
    private final EmployeeService employeeService;

    /**
     * Get all employees
     * GET /api/employees
     * @return List of EmployeeDTO
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        List<EmployeeDTO> employeeDTOs = employees.stream()
                .map(EmployeeDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(employeeDTOs));
    }

    /**
     * Get employee by id
     * GET /api/employees/{id}
     * @param id Employee ID
     * @return EmployeeDTO
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        if (employee.isPresent()) {
            EmployeeDTO employeeDTO = EmployeeDTO.fromEntity(employee.get());
            return ResponseEntity.ok(ApiResponse.success(employeeDTO));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.notFound("Employee with ID " + id));
        }
    }

    /**
     * Create new employee
     * POST /api/employees
     * @param createRequest CreateEmployeeRequest with validation
     * @param bindingResult Validation results
     * @return Created EmployeeDTO
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest createRequest,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(ApiResponse.validationError(errorMessage));
        }

        try {
            createRequest.validateBusinessRules();
            Employee employee = createRequest.toEntity();

            // Pass the departmentId to the service
            Employee createdEmployee = employeeService.createEmployee(employee, createRequest.getDepartmentId());

            EmployeeDTO responseDTO = EmployeeDTO.fromEntity(createdEmployee);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Employee created successfully", responseDTO));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.validationError(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create employee", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error", e.getMessage()));
        }
    }

    /**
     * update employee info with id
     * PUT /api/employees/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmployeeRequest updateRequest,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(ApiResponse.validationError(errorMessage));
        }
        try {
            updateRequest.validateBusinessRules();
            Employee updatedEmployee = employeeService.updateEmployee(id, updateRequest);
            EmployeeDTO responseDTO = EmployeeDTO.fromEntity(updatedEmployee);

            return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", responseDTO));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.validationError(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.notFound("Employee with id: " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error", e.getMessage()));
        }
    }

    /**
     * Delete employee
     * DELETE /api/employees/{id}
     * @param id Employee ID
     * @return ApiResponse<Void>
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok(ApiResponse.success("Employee deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.notFound("Employee with ID " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete employee", e.getMessage()));
        }
    }

    /**
     * get employees by department id
     * GET /api/employees/department/{departmentId}
     */
    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public  ResponseEntity<ApiResponse<List<EmployeeDTO>>> getEmployeesByDepartment(@PathVariable Long departmentId) {
        try {
            List<Employee> employees = employeeService.getEmployeesByDepartment(departmentId);
            List<EmployeeDTO> employeeDTOS = employees.stream()
                    .map(EmployeeDTO::fromEntity)
                    .collect(Collectors.toList());
            String message = String.format("Found %d employees in department %d", employeeDTOS.size(), departmentId);
            return ResponseEntity.ok(ApiResponse.success(message, employeeDTOS));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.notFound("Department with ID " + departmentId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve employees", e.getMessage()));
        }
    }

    /**
     * get employee status
     * GET /api/employees/status/{status}
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getEmployeesByStatus(@PathVariable Employee.EmployeeStatus status) {
        try {
            List<Employee> employees = employeeService.getEmployeesByStatus(status);
            List<EmployeeDTO> employeeDTOs = employees.stream()
                    .map(EmployeeDTO::fromEntity)
                    .collect(Collectors.toList());

            String message = String.format("Found %d employees with status %s", employeeDTOs.size(), status);
            return ResponseEntity.ok(ApiResponse.success(message, employeeDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve employees by status", e.getMessage()));
        }
    }


    /**
     * Search employee by name
     * GET /api/employees/search?name=xxx
     * @param name Search term for employee name
     * @return ApiResponse<List<EmployeeDTO>>
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> searchEmployees(@RequestParam String name) {
        try {
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.validationError("Search name cannot be empty"));
            }

            List<Employee> employees = employeeService.searchEmployeesByName(name.trim());
            List<EmployeeDTO> employeeDTOs = employees.stream()
                    .map(EmployeeDTO::fromEntity)
                    .collect(Collectors.toList());

            String message = String.format("Found %d employees matching '%s'", employeeDTOs.size(), name);
            return ResponseEntity.ok(ApiResponse.success(message, employeeDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to search employees", e.getMessage()));
        }
    }

    /**
     * Update employee status
     * PATCH /api/employees/{id}/status
     * @param id Employee ID
     * @param status New employee status
     * @return ApiResponse<EmployeeDTO>
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateEmployeeStatus(
            @PathVariable Long id,
            @RequestParam Employee.EmployeeStatus status) {
        try {
            if (status == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.validationError("Status parameter is required"));
            }

            Employee updatedEmployee = employeeService.updateEmployeeStatus(id, status);
            EmployeeDTO responseDTO = EmployeeDTO.fromEntity(updatedEmployee);

            String message = String.format("Employee status updated to %s", status);
            return ResponseEntity.ok(ApiResponse.success(message, responseDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.notFound("Employee with ID " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update employee status", e.getMessage()));
        }
    }

    /**
     * Get the number of employees in the department
     * GET /api/employees/count/department/{departmentId}
     * @param departmentId Department ID
     * @return ApiResponse<Long>
     */
    @GetMapping("/count/department/{departmentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<Long>> getEmployeeCountByDepartment(@PathVariable Long departmentId) {
        try {
            Long count = employeeService.getEmployeeCountByDepartment(departmentId);
            String message = String.format("Department %d has %d employees", departmentId, count);
            return ResponseEntity.ok(ApiResponse.success(message, count));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.notFound("Department with ID " + departmentId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to count employees", e.getMessage()));
        }
    }
}