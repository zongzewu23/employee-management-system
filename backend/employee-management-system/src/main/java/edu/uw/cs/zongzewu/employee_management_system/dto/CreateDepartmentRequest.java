package edu.uw.cs.zongzewu.employee_management_system.dto;

import edu.uw.cs.zongzewu.employee_management_system.entity.Department;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating department
 * Contains data validation annotations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDepartmentRequest {

    @NotBlank(message = "Department name is required")
    @Size(max = 100, message = "Department name must be less than 100 characters")
    private String name;

    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    @Size(max = 100, message = "Location must be less than 100 characters")
    private String location;

    @Size(max = 100, message = "Manager name must be less than 100 characters")
    private String managerName;

    /**
     * Convert to Entity
     * Factory pattern for entity creation
     */
    public Department toEntity() {
        Department department = new Department();
        department.setName(this.name);
        department.setDescription(this.description);
        department.setLocation(this.location);
        department.setManagerName(this.managerName);
        return department;
    }

    /**
     * Validate business rules
     */
    public void validateBusinessRules() {
        if (this.name != null) {
            this.name = this.name.trim();
            if (this.name.isEmpty()) {
                throw new IllegalArgumentException("Department name cannot be empty");
            }
        }

        // Trim other fields to remove leading/trailing whitespace
        if (this.description != null) {
            this.description = this.description.trim();
        }
        if (this.location != null) {
            this.location = this.location.trim();
        }
        if (this.managerName != null) {
            this.managerName = this.managerName.trim();
        }
    }
}