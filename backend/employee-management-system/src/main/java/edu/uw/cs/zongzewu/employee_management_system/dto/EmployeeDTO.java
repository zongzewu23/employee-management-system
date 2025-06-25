package edu.uw.cs.zongzewu.employee_management_system.dto;


import edu.uw.cs.zongzewu.employee_management_system.entity.Department;
import edu.uw.cs.zongzewu.employee_management_system.entity.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * employee Data transfer object
 * For frontend displaying, no sensitive info
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String position;
    private BigDecimal salary;
    private LocalDate hireDate;
    private Employee.EmployeeStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // simplified, no sensitive info version of Department
    private DepartmentSummaryDTO department;

    /**
     * From entity to DTO
     */
    public static EmployeeDTO fromEntity(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setPosition(employee.getPosition());
        dto.setSalary(employee.getSalary());
        dto.setHireDate(employee.getHireData());
        dto.setStatus(employee.getStatus());
        dto.setCreatedAt(employee.getCreatedAt());
        dto.setUpdatedAt(employee.getUpdatedAt());

        if (employee.getDepartment() != null) {
            dto.setDepartment(DepartmentSummaryDTO.fromEntity(employee.getDepartment()));
        }

        return dto;
    }

    /**
     * get employee full name
     */
    public String getFullName() {
        return this.firstName + " " + this.lastName;
    }

    /**
     * check if this is an active employee
     */
    public boolean isActive () {
        return Employee.EmployeeStatus.ACTIVE.equals(this.status);
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class DepartmentSummaryDTO {
        private Long id;
        private String name;
        private String Location;
        private String managerName;

        public static DepartmentSummaryDTO fromEntity(Department department) {
            DepartmentSummaryDTO dto = new DepartmentSummaryDTO();
            dto.setId(department.getId());
            dto.setName(department.getName());
            dto.setLocation(department.getLocation());
            dto.setManagerName(department.getManagerName());
            return dto;
        }
    }
}
