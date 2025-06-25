package edu.uw.cs.zongzewu.employee_management_system.dto;

import edu.uw.cs.zongzewu.employee_management_system.entity.Department;
import edu.uw.cs.zongzewu.employee_management_system.entity.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentDTO {
    private Long id;
    private String name;
    private String description;
    private String location;
    private String managerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Avoiding circular reference
    private List<EmployeeSummaryDTO> employees;

    // statistic info
    private Integer employeeCount;
    private Integer activeEmployeeCount;

    /**
     * Transfer from entity to a DTO
     * Factory model!
     */
    public static DepartmentDTO fromEntity(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        dto.setLocation(department.getLocation());
        dto.setManagerName(department.getManagerName());
        dto.setCreatedAt(department.getCreatedAt());
        dto.setUpdatedAt(department.getUpdatedAt());

        if (department.getEmployees() != null) {
            dto.setEmployees(
                    department.getEmployees().stream()
                            .map(EmployeeSummaryDTO::fromEntity)
                            .collect(Collectors.toList())
            );
            dto.setEmployeeCount(department.getEmployees().size());
            dto.setActiveEmployeeCount((int) department.getEmployees().stream().filter((employee -> Employee.EmployeeStatus.ACTIVE
                    .equals(employee.getStatus()))).count());
        } else {
            dto.setEmployeeCount(0);
            dto.setActiveEmployeeCount(0);
        }

        return dto;
    }


    /**
     * simpler version of fromEntity, no employees info
     */
    public static DepartmentDTO fromEntitySimple(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        dto.setLocation(department.getLocation());
        dto.setManagerName(department.getManagerName());
        dto.setCreatedAt(department.getCreatedAt());
        dto.setUpdatedAt(department.getUpdatedAt());

        if (department.getEmployees() != null) {
            dto.setEmployeeCount(department.getEmployees().size());
            dto.setActiveEmployeeCount((int) department.getEmployees().stream().filter((employee -> Employee.EmployeeStatus.ACTIVE
                    .equals(employee.getStatus()))).count());
        } else {
            dto.setEmployeeCount(0);
            dto.setActiveEmployeeCount(0);
        }

        return dto;
    }

    public boolean isEmpty() {
        return employeeCount == null || employeeCount == 0;
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class EmployeeSummaryDTO{
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String position;
        private Employee.EmployeeStatus status;

        public static EmployeeSummaryDTO fromEntity(Employee employee) {
            EmployeeSummaryDTO dto = new EmployeeSummaryDTO();

            dto.setId(employee.getId());
            dto.setFirstName(employee.getFirstName());
            dto.setLastName(employee.getLastName());
            dto.setEmail(employee.getEmail());
            dto.setPosition(employee.getPosition());
            dto.setStatus(employee.getStatus());

            return dto;
        }

        public String getFullName() {
            return this.firstName + " " + this.lastName;
        }
    }
}
