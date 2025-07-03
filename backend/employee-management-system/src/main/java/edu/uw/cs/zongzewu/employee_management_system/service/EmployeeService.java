package edu.uw.cs.zongzewu.employee_management_system.service;


import edu.uw.cs.zongzewu.employee_management_system.dto.UpdateEmployeeRequest;
import edu.uw.cs.zongzewu.employee_management_system.entity.Department;
import edu.uw.cs.zongzewu.employee_management_system.entity.Employee;
import edu.uw.cs.zongzewu.employee_management_system.repository.DepartmentRepository;
import edu.uw.cs.zongzewu.employee_management_system.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    /**
     * Get all employees
     * @return all employees
     */
    @Transactional(readOnly = true)
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    /**
     * Get employee by id
     */
    @Transactional(readOnly = true)
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    /**
     * Create new employee
     * @param employee Employee entity
     * @param departmentId Department ID (can be null)
     * @return Created employee
     */
    public Employee createEmployee(Employee employee, Long departmentId) {
        // Verify email uniqueness
        if (employeeRepository.findByEmail(employee.getEmail()).isPresent()) {
            throw new RuntimeException("This email already exists: " + employee.getEmail());
        }

        // Handle department association if departmentId is provided
        if (departmentId != null) {
            Department department = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));
            employee.setDepartment(department);
        }

        // Set the default status if not provided
        if (employee.getStatus() == null) {
            employee.setStatus(Employee.EmployeeStatus.ACTIVE);
        }

        return employeeRepository.save(employee);
    }

    /**
     * Overloaded method for backward compatibility
     */
    public Employee createEmployee(Employee employee) {
        return createEmployee(employee, null);
    }

    /**
     * update employee
     * @param id
     * @param updatedEmployee
     * @return updated Employee
     */
    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Employee not found:" + id));
        Optional<Employee> emailCheck = employeeRepository.findByEmail(updatedEmployee.getEmail());
        if (emailCheck.isPresent() && !emailCheck.get().getId().equals(id)) {
            throw new RuntimeException("Email already exists: " + updatedEmployee.getEmail());
        }

        // Update fields, modifier model
        existingEmployee.setFirstName(updatedEmployee.getFirstName());
        existingEmployee.setLastName(updatedEmployee.getLastName());
        existingEmployee.setEmail(updatedEmployee.getEmail());
        existingEmployee.setPhone(updatedEmployee.getPhone());
        existingEmployee.setPosition(updatedEmployee.getPosition());
        existingEmployee.setSalary(updatedEmployee.getSalary());
        existingEmployee.setHireDate(updatedEmployee.getHireDate());
        existingEmployee.setStatus(updatedEmployee.getStatus());

        if (updatedEmployee.getDepartment() != null && updatedEmployee.getDepartment().getId() != null) {
            Department department = departmentRepository.findById(updatedEmployee.getDepartment().getId())
                    .orElseThrow(()-> new RuntimeException("Department not found: " + updatedEmployee.getDepartment().getId()));
            existingEmployee.setDepartment(department);
        }

        return  employeeRepository.save(existingEmployee);
    }

    /**
     * Update employee using UpdateEmployeeRequest DTO
     * @param id Employee ID
     * @param updateRequest UpdateEmployeeRequest with validation
     * @return Updated Employee entity
     * @throws RuntimeException if employee not found or department not found
     */
    public Employee updateEmployee(Long id, UpdateEmployeeRequest updateRequest) {
        // Find existing employee
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Validate business rules
        updateRequest.validateBusinessRules();

        // Check if no updates are provided
        if (!updateRequest.hasUpdates()) {
            throw new IllegalArgumentException("No updates provided");
        }

        // Check email uniqueness if email is being updated
        if (updateRequest.getEmail() != null &&
                !updateRequest.getEmail().equals(existingEmployee.getEmail())) {
            Optional<Employee> emailCheck = employeeRepository.findByEmail(updateRequest.getEmail());
            if (emailCheck.isPresent() && !emailCheck.get().getId().equals(id)) {
                throw new RuntimeException("Email already exists: " + updateRequest.getEmail());
            }
        }

        // Handle department association if departmentId is provided
        if (updateRequest.getDepartmentId() != null) {
            Department department = departmentRepository.findById(updateRequest.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found with id: " + updateRequest.getDepartmentId()));
            existingEmployee.setDepartment(department);
        }

        // Apply updates to existing employee
        updateRequest.applyToEntity(existingEmployee);

        // Save and return updated employee
        return employeeRepository.save(existingEmployee);
    }

    /**
     * delete employee with id
     * @param id
     */
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + id));

        try {
            if (employee.getDepartment() != null) {
                Department department = employee.getDepartment();
                if (department.getEmployees() != null) {
                    department.getEmployees().remove(employee);
                }
                employee.setDepartment(null);
                employeeRepository.save(employee);
            }

            employeeRepository.deleteById(id);

            employeeRepository.flush();

            if (employeeRepository.existsById(id)) {
                throw new RuntimeException("Failed to delete employee - record still exists");
            }


        } catch (Exception e) {
            throw new RuntimeException("Delete operation failed: " + e.getMessage(), e);
        }
    }

    /**
     * get all the employees belongs to the department with the id
     * @param departmentId
     * @return List of employee
     */
    @Transactional(readOnly = true)
    public List<Employee> getEmployeesByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId);
    }

    /**
     * get employees that are under status
     * @param status
     * @return List of employees
     */
    @Transactional(readOnly = true)
    public List<Employee> getEmployeesByStatus(Employee.EmployeeStatus status) {
        return employeeRepository.findByStatus(status);
    }

    /**
     * find all the employees that likely have this name
     * @param name
     * @return List of employees
     */
    @Transactional(readOnly = true)
    public List<Employee> searchEmployeesByName(String name) {
        return employeeRepository.findByNameContaining(name);
    }

    /**
     * update employee status
     * @param id
     * @param status
     * @return this employee
     */
    public Employee updateEmployeeStatus(Long id, Employee.EmployeeStatus status) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + id));

        employee.setStatus(status);
        return employeeRepository.save(employee);
    }

    /**
     * get the number of employees under this department
     * @param departmentId
     * @return Number of employees
     */
    @Transactional(readOnly = true)
    public Long getEmployeeCountByDepartment(Long departmentId) {
        return employeeRepository.countByDepartmentId(departmentId);
    }
}
