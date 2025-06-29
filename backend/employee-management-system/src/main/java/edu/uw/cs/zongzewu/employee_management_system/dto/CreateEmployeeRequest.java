package edu.uw.cs.zongzewu.employee_management_system.dto;

import edu.uw.cs.zongzewu.employee_management_system.entity.Employee;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for creating employee
 * Contains data validation annotations
 */
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class CreateEmployeeRequest {
    @NotBlank(message = "FirstName is required")
    @Size(max = 100, message = "Frist name can not longer than 100 characters")
    private String firstName;

    @NotBlank(message = "Last Name is required")
    @Size(max = 100, message = "Last name can not longer than 100 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email has to be valid")
    @Size(max = 150, message = "Email must be less than 150 characters")
    private String email;

    @Size(max = 20, message = "Phone must be less than 20 characters")
    @Pattern(regexp = "^[+]?[\\d\\s()-]+$", message = "Phone number format is invalid")
    private String phone;

    @Size(max = 100, message = "Position must be less than 100 characters")
    private String position;

    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be greater than 0, right?")
    @Digits(integer = 8, fraction = 2, message = "Salary format is invalid")
    private BigDecimal salary;

    @PastOrPresent(message = "Hire date cannot be in the future")
    private LocalDate hireDate;

    private Employee.EmployeeStatus status;

    private Long departmentId; // not the entire department object

    /**
     * transfer to Entity
     * converter/Transformer !!!
     */
    public Employee toEntity() {
        Employee employee = new Employee();
        employee.setFirstName(this.firstName);
        employee.setLastName(this.lastName);
        employee.setEmail(this.email);
        employee.setPhone(this.phone);
        employee.setPosition(this.position);
        employee.setSalary(this.salary);
        employee.setHireDate(this.hireDate);
        employee.setStatus(this.status != null ? this.status : Employee.EmployeeStatus.ACTIVE);

        return employee;
    }

    /**
     * verify business Rules
     */
    public void validateBusinessRules() {
        if (this.salary != null && salary.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Salary must be greater than 0");
        }

        if (this.hireDate == null) {
            this.hireDate = LocalDate.now();
        }

        if (status == null) {
            status = Employee.EmployeeStatus.ACTIVE;
        }
    }
}
