package edu.uw.cs.zongzewu.employee_management_system.service;

import edu.uw.cs.zongzewu.employee_management_system.dto.UpdateDepartmentRequest;
import edu.uw.cs.zongzewu.employee_management_system.entity.Department;
import edu.uw.cs.zongzewu.employee_management_system.repository.DepartmentRepository;
import edu.uw.cs.zongzewu.employee_management_system.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    /**
     * Get all departments
     * @return all departments
     */
    @Transactional(readOnly = true)
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    /**
     * get department by id
     * @param id
     * @return Optional<Department>
     */
    @Transactional(readOnly = true)
    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }

    /**
     * create a new department
     */
    public Department createDepartment(Department department) {
        // verify the uniqueness of the department's name
        if (departmentRepository.findByName(department.getName()).isPresent()) {
            throw new RuntimeException("Department name already exists: " + department.getName());
        }

        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department updatedDepartment) {
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Department not found: " + id));

        Optional<Department> nameCheck = departmentRepository.findByName((updatedDepartment.getName()));
        if (nameCheck.isPresent() && !nameCheck.get().getId().equals(id)) {
            throw  new RuntimeException("Department name already exists: " + updatedDepartment.getName());
        }

        existingDepartment.setName(updatedDepartment.getName());
        existingDepartment.setDescription((updatedDepartment.getDescription()));
        existingDepartment.setLocation(updatedDepartment.getLocation());
        existingDepartment.setManagerName(updatedDepartment.getManagerName());

        return departmentRepository.save(existingDepartment);
    }

    /**
     * Update department using UpdateDepartmentRequest DTO
     * @param id Department ID
     * @param updateRequest UpdateDepartmentRequest with validation
     * @return Updated Department entity
     * @throws RuntimeException if department not found
     */
    public Department updateDepartment(Long id, UpdateDepartmentRequest updateRequest) {
        // Find existing department
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));

        // Validate business rules
        updateRequest.validateBusinessRules();

        // Check if no updates are provided
        if (!updateRequest.hasUpdates()) {
            throw new IllegalArgumentException("No updates provided");
        }

        // Check for name uniqueness if name is being updated
        if (updateRequest.getName() != null &&
                !updateRequest.getName().equals(existingDepartment.getName())) {
            boolean nameExists = departmentRepository.existsByNameAndIdNot(
                    updateRequest.getName(), id);
            if (nameExists) {
                throw new RuntimeException("Department name already exists: " + updateRequest.getName());
            }
        }

        // Apply updates to existing department
        updateRequest.applyToEntity(existingDepartment);

        // Save and return updated department
        return departmentRepository.save(existingDepartment);
    }

    /**
     * delete department by id
     */
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found: " + id));

        // Check if there are any employees associated with
        Long employeeCount = employeeRepository.countByDepartmentId(id);
        if (employeeCount > 0) {
            throw new RuntimeException("Cannot delete department with " + employeeCount + " employees. Please reassign employees first.");
        }

        departmentRepository.deleteById(id);
    }

    /**
     * search department by name
     */
    @Transactional(readOnly = true)
    public List<Department> searchDepartmentsByName(String name) {
        return departmentRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * search department by location
     */
    @Transactional(readOnly = true)
    public List<Department> searchDepartmentsByLocation(String location) {
        return departmentRepository.findByLocationContainingIgnoreCase(location);
    }

    /**
     * search department by manager's name
     */
    @Transactional(readOnly = true)
    public List<Department> searchDepartmentsByManager(String managerName) {
        return departmentRepository.findByManagerNameContainingIgnoreCase(managerName);
    }

    /**
     * get all the departments that have employees
     */
    @Transactional(readOnly = true)
    public List<Department> getDepartmentsWithEmployees() {
        return departmentRepository.findDepartmentsWithEmployees();
    }

    /**
     * get departments that don't have employees
     */
    @Transactional(readOnly = true)
    public List<Department> getEmptyDepartments() {
        return departmentRepository.findEmptyDepartments();
    }

    /**
     * get the number of employees under this department
     */
    @Transactional(readOnly = true)
    public Long getEmployeeCount(Long departmentId) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new RuntimeException("Department not found: " + departmentId);
        }
        return employeeRepository.countByDepartmentId(departmentId);
    }

    /**
     * verify the department exists
     */
    @Transactional(readOnly = true)
    public boolean departmentExists(Long id) {
        return departmentRepository.existsById(id);
    }

}
