package edu.uw.cs.zongzewu.employee_management_system.dto;

import edu.uw.cs.zongzewu.employee_management_system.entity.Employee;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateEmployeeRequest {
    @Size(max = 100, message = "First name must be less than 100 characters")
    private String firstName;

    @Size(max = 100, message = "Last name must be less than 100 characters")
    private String lastName;

    @Email(message = "Email should be valid")
    @Size(max = 150, message = "Email must be less than 150 characters")
    private String email;

    @Size(max = 20, message = "Phone must be less than 20 characters")
    @Pattern(regexp = "^[+]?[0-9\\s\\-\\(\\)]+$", message = "Phone number format is invalid")
    private String phone;

    @Size(max = 100, message = "Position must be less than 100 characters")
    private String position;

    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Salary format is invalid")
    private BigDecimal salary;

    @PastOrPresent(message = "Hire date cannot be in the future")
    private LocalDate hireDate;

    private Employee.EmployeeStatus status;

    private Long departmentId;

    /**
     * Apply update to current Employee Entity
     * Only update not null fields
     */
    public void applyToEntity(Employee employee) {
        if (this.firstName != null) {
            employee.setFirstName(this.firstName);
        }
        if (this.lastName != null) {
            employee.setLastName(this.lastName);
        }
        if (this.email != null) {
            employee.setEmail(this.email);
        }
        if (this.phone != null) {
            employee.setPhone(this.phone);
        }
        if (this.position != null) {
            employee.setPosition(this.position);
        }
        if (this.salary != null) {
            employee.setSalary(this.salary);
        }
        if (this.hireDate != null) {
            employee.setHireDate(this.hireDate);
        }
        if (this.status != null) {
            employee.setStatus(this.status);
        }

        // Department association is handled at the Service layer
    }

    /**
     * check if any field needs to be updated
     */
    public boolean hasUpdates() {
        return firstName != null || lastName != null || email != null ||
                phone != null || position != null || salary != null ||
                hireDate != null || status != null || departmentId != null;
    }

    /**
     * verify business rules
     */
    public void validateBusinessRules() {
        if (this.salary != null && this.salary.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Salary must be greater than 0");
        }

        if (hireDate != null && hireDate.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Hire date cannot be in the future");
        }
    }

    /**
     * Create UpdateRequest from existing Employee (for form echo)
     */
    public static UpdateEmployeeRequest fromEntity(Employee employee) {
        UpdateEmployeeRequest request = new UpdateEmployeeRequest();
        request.setFirstName(employee.getFirstName());
        request.setLastName(employee.getLastName());
        request.setEmail(employee.getEmail());
        request.setPhone(employee.getPhone());
        request.setPosition(employee.getPosition());
        request.setSalary(employee.getSalary());
        request.setHireDate(employee.getHireDate());
        request.setStatus(employee.getStatus());
        if (employee.getDepartment() != null) {
            request.setDepartmentId(employee.getDepartment().getId());
        }
        return request;
    }
}
