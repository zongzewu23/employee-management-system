package edu.uw.cs.zongzewu.employee_management_system.controller;

import edu.uw.cs.zongzewu.employee_management_system.entity.Department;
import edu.uw.cs.zongzewu.employee_management_system.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000")
public class DepartmentController {

    private final DepartmentService departmentService;

    /**
     * get all the departments
     * GET /api/departments
     */
    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    /**
     * get department according to id
     * GET /api/departments/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
        Optional<Department> department = departmentService.getDepartmentById(id);
        return department.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * create new department
     * POST /api/departments
     */
    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        try {
            Department createdDepartment = departmentService.createDepartment(department);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * updated department info
     * PUT /api/departments/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable Long id, @RequestBody Department department) {
        try {
            Department updatedDepartment = departmentService.updateDepartment(id, department);
            return ResponseEntity.ok(updatedDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * delete department
     * DELETE /api/departments/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        try {
            departmentService.deleteDepartment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build(); // 可能是因为部门有员工无法删除
        }
    }

    /**
     * search department by name
     * GET /api/departments/search/name?name=xxx
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<Department>> searchDepartmentsByName(@RequestParam String name) {
        List<Department> departments = departmentService.searchDepartmentsByName(name);
        return ResponseEntity.ok(departments);
    }

    /**
     * search department by location
     * GET /api/departments/search/location?location=xxx
     */
    @GetMapping("/search/location")
    public ResponseEntity<List<Department>> searchDepartmentsByLocation(@RequestParam String location) {
        List<Department> departments = departmentService.searchDepartmentsByLocation(location);
        return ResponseEntity.ok(departments);
    }

    /**
     * search department by manager's name
     * GET /api/departments/search/manager?manager=xxx
     */
    @GetMapping("/search/manager")
    public ResponseEntity<List<Department>> searchDepartmentsByManager(@RequestParam String manager) {
        List<Department> departments = departmentService.searchDepartmentsByManager(manager);
        return ResponseEntity.ok(departments);
    }

    /**
     * get all the departments that have employees
     * GET /api/departments/with-employees
     */
    @GetMapping("/with-employees")
    public ResponseEntity<List<Department>> getDepartmentsWithEmployees() {
        List<Department> departments = departmentService.getDepartmentsWithEmployees();
        return ResponseEntity.ok(departments);
    }

    /**
     * get all the departments that don't have employees
     * GET /api/departments/empty
     */
    @GetMapping("/empty")
    public ResponseEntity<List<Department>> getEmptyDepartments() {
        List<Department> departments = departmentService.getEmptyDepartments();
        return ResponseEntity.ok(departments);
    }

    /**
     * get the number of employees for this department
     * GET /api/departments/{id}/employee-count
     */
    @GetMapping("/{id}/employee-count")
    public ResponseEntity<Long> getEmployeeCount(@PathVariable Long id) {
        try {
            Long count = departmentService.getEmployeeCount(id);
            return ResponseEntity.ok(count);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * verify the department is actually exist
     * GET /api/departments/{id}/exists
     */
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> departmentExists(@PathVariable Long id) {
        boolean exists = departmentService.departmentExists(id);
        return ResponseEntity.ok(exists);
    }
}