package edu.uw.cs.zongzewu.employee_management_system.controller;

import edu.uw.cs.zongzewu.employee_management_system.dto.ApiResponse;
import edu.uw.cs.zongzewu.employee_management_system.dto.CreateDepartmentRequest;
import edu.uw.cs.zongzewu.employee_management_system.dto.DepartmentDTO;
import edu.uw.cs.zongzewu.employee_management_system.dto.UpdateDepartmentRequest;
import edu.uw.cs.zongzewu.employee_management_system.entity.Department;
import edu.uw.cs.zongzewu.employee_management_system.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
public class DepartmentController {

    private final DepartmentService departmentService;

    /**
     * Get all departments
     * GET /api/departments
     * @param includeEmployees Whether to include employee details (default: false)
     * @return ApiResponse<List<DepartmentDTO>>
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getAllDepartments(
            @RequestParam(value = "includeEmployees", defaultValue = "false") boolean includeEmployees) {
        try {
            List<Department> departments = departmentService.getAllDepartments();
            List<DepartmentDTO> departmentDTOs = departments.stream()
                    .map(department -> includeEmployees
                            ? DepartmentDTO.fromEntity(department)
                            : DepartmentDTO.fromEntitySimple(department))
                    .collect(Collectors.toList());

            String message = String.format("Retrieved %d departments", departmentDTOs.size());
            return ResponseEntity.ok(ApiResponse.success(message, departmentDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve departments", e.getMessage()));
        }
    }

    /**
     * Get department by id
     * GET /api/departments/{id}
     * @param id Department ID
     * @param includeEmployees Whether to include employee details (default: true)
     * @return ApiResponse<DepartmentDTO>
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> getDepartmentById(
            @PathVariable Long id,
            @RequestParam(value = "includeEmployees", defaultValue = "true") boolean includeEmployees) {
        try {
            Optional<Department> department = departmentService.getDepartmentById(id);
            if (department.isPresent()) {
                DepartmentDTO departmentDTO = includeEmployees
                        ? DepartmentDTO.fromEntity(department.get())
                        : DepartmentDTO.fromEntitySimple(department.get());
                return ResponseEntity.ok(ApiResponse.success("Department retrieved successfully", departmentDTO));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.notFound("Department with ID " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve department", e.getMessage()));
        }
    }

    /**
     * Create new department
     * POST /api/departments
     * @param createRequest CreateDepartmentRequest with validation
     * @param bindingResult Validation results
     * @return ApiResponse<DepartmentDTO>
     */
    @PostMapping
    public ResponseEntity<ApiResponse<DepartmentDTO>> createDepartment(
            @Valid @RequestBody CreateDepartmentRequest createRequest,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(ApiResponse.validationError(errorMessage));
        }

        try {
            createRequest.validateBusinessRules();
            Department department = createRequest.toEntity();
            Department createdDepartment = departmentService.createDepartment(department);
            DepartmentDTO responseDTO = DepartmentDTO.fromEntitySimple(createdDepartment);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Department created successfully", responseDTO));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.validationError(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create department", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error", e.getMessage()));
        }
    }


    /**
     * Update department info
     * PUT /api/departments/{id}
     * @param id Department ID
     * @param updateRequest UpdateDepartmentRequest with validation
     * @param bindingResult Validation results
     * @return ApiResponse<DepartmentDTO>
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDepartmentRequest updateRequest,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(ApiResponse.validationError(errorMessage));
        }

        try {
            updateRequest.validateBusinessRules();
            Department updatedDepartment = departmentService.updateDepartment(id, updateRequest);
            DepartmentDTO responseDTO = DepartmentDTO.fromEntitySimple(updatedDepartment);

            return ResponseEntity.ok(ApiResponse.success("Department updated successfully", responseDTO));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.validationError(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.notFound("Department with ID " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error", e.getMessage()));
        }
    }

    /**
     * Delete department
     * DELETE /api/departments/{id}
     * @param id Department ID
     * @return ApiResponse<Void>
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        try {
            departmentService.deleteDepartment(id);
            return ResponseEntity.ok(ApiResponse.success("Department deleted successfully"));
        } catch (RuntimeException e) {
            // Check if it's a constraint violation (department has employees)
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("cannot delete")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Cannot delete department", "Department has employees and cannot be deleted"));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.notFound("Department with ID " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete department", e.getMessage()));
        }
    }

    /**
     * Search departments by name
     * GET /api/departments/search/name?name=xxx
     * @param name Department name search term
     * @return ApiResponse<List<DepartmentDTO>>
     */
    @GetMapping("/search/name")
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> searchDepartmentsByName(@RequestParam String name) {
        try {
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.validationError("Search name cannot be empty"));
            }

            List<Department> departments = departmentService.searchDepartmentsByName(name.trim());
            List<DepartmentDTO> departmentDTOs = departments.stream()
                    .map(DepartmentDTO::fromEntitySimple)
                    .collect(Collectors.toList());

            String message = String.format("Found %d departments matching name '%s'", departmentDTOs.size(), name);
            return ResponseEntity.ok(ApiResponse.success(message, departmentDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to search departments by name", e.getMessage()));
        }
    }

    /**
     * Search departments by location
     * GET /api/departments/search/location?location=xxx
     * @param location Department location search term
     * @return ApiResponse<List<DepartmentDTO>>
     */
    @GetMapping("/search/location")
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> searchDepartmentsByLocation(@RequestParam String location) {
        try {
            if (location == null || location.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.validationError("Search location cannot be empty"));
            }

            List<Department> departments = departmentService.searchDepartmentsByLocation(location.trim());
            List<DepartmentDTO> departmentDTOs = departments.stream()
                    .map(DepartmentDTO::fromEntitySimple)
                    .collect(Collectors.toList());

            String message = String.format("Found %d departments in location '%s'", departmentDTOs.size(), location);
            return ResponseEntity.ok(ApiResponse.success(message, departmentDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to search departments by location", e.getMessage()));
        }
    }

    /**
     * Search departments by manager's name
     * GET /api/departments/search/manager?manager=xxx
     * @param manager Manager name search term
     * @return ApiResponse<List<DepartmentDTO>>
     */
    @GetMapping("/search/manager")
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> searchDepartmentsByManager(@RequestParam String manager) {
        try {
            if (manager == null || manager.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.validationError("Search manager name cannot be empty"));
            }

            List<Department> departments = departmentService.searchDepartmentsByManager(manager.trim());
            List<DepartmentDTO> departmentDTOs = departments.stream()
                    .map(DepartmentDTO::fromEntitySimple)
                    .collect(Collectors.toList());

            String message = String.format("Found %d departments with manager '%s'", departmentDTOs.size(), manager);
            return ResponseEntity.ok(ApiResponse.success(message, departmentDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to search departments by manager", e.getMessage()));
        }
    }

    /**
     * Get all departments that have employees
     * GET /api/departments/with-employees
     * @return ApiResponse<List<DepartmentDTO>>
     */
    @GetMapping("/with-employees")
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getDepartmentsWithEmployees() {
        try {
            List<Department> departments = departmentService.getDepartmentsWithEmployees();
            List<DepartmentDTO> departmentDTOs = departments.stream()
                    .map(DepartmentDTO::fromEntitySimple)
                    .collect(Collectors.toList());

            String message = String.format("Found %d departments with employees", departmentDTOs.size());
            return ResponseEntity.ok(ApiResponse.success(message, departmentDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve departments with employees", e.getMessage()));
        }
    }

    /**
     * Get all departments that don't have employees
     * GET /api/departments/empty
     * @return ApiResponse<List<DepartmentDTO>>
     */
    @GetMapping("/empty")
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getEmptyDepartments() {
        try {
            List<Department> departments = departmentService.getEmptyDepartments();
            List<DepartmentDTO> departmentDTOs = departments.stream()
                    .map(DepartmentDTO::fromEntitySimple)
                    .collect(Collectors.toList());

            String message = String.format("Found %d empty departments", departmentDTOs.size());
            return ResponseEntity.ok(ApiResponse.success(message, departmentDTOs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve empty departments", e.getMessage()));
        }
    }

    /**
     * Get the number of employees for this department
     * GET /api/departments/{id}/employee-count
     * @param id Department ID
     * @return ApiResponse<Long>
     */
    @GetMapping("/{id}/employee-count")
    public ResponseEntity<ApiResponse<Long>> getEmployeeCount(@PathVariable Long id) {
        try {
            Long count = departmentService.getEmployeeCount(id);
            String message = String.format("Department %d has %d employees", id, count);
            return ResponseEntity.ok(ApiResponse.success(message, count));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.notFound("Department with ID " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to count employees", e.getMessage()));
        }
    }

    /**
     * Verify the department actually exists
     * GET /api/departments/{id}/exists
     * @param id Department ID
     * @return ApiResponse<Boolean>
     */
    @GetMapping("/{id}/exists")
    public ResponseEntity<ApiResponse<Boolean>> departmentExists(@PathVariable Long id) {
        try {
            boolean exists = departmentService.departmentExists(id);
            String message = exists
                    ? String.format("Department %d exists", id)
                    : String.format("Department %d does not exist", id);
            return ResponseEntity.ok(ApiResponse.success(message, exists));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to check department existence", e.getMessage()));
        }
    }
}