package edu.uw.cs.zongzewu.employee_management_system.dto;

import edu.uw.cs.zongzewu.employee_management_system.entity.Department;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating department
 * Contains optional fields for partial updates
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDepartmentRequest {

    @Size(max = 100, message = "Department name must be less than 100 characters")
    private String name;

    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    @Size(max = 100, message = "Location must be less than 100 characters")
    private String location;

    @Size(max = 100, message = "Manager name must be less than 100 characters")
    private String managerName;

    /**
     * Apply updates to existing Department entity
     * Only update non-null fields (partial update pattern)
     */
    public void applyToEntity(Department department) {
        if (this.name != null) {
            department.setName(this.name);
        }
        if (this.description != null) {
            department.setDescription(this.description);
        }
        if (this.location != null) {
            department.setLocation(this.location);
        }
        if (this.managerName != null) {
            department.setManagerName(this.managerName);
        }
    }

    /**
     * Check if any field needs to be updated
     */
    public boolean hasUpdates() {
        return name != null || description != null ||
                location != null || managerName != null;
    }

    /**
     * Validate business rules
     */
    public void validateBusinessRules() {
        // Trim and validate name if provided
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

    /**
     * Create UpdateDepartmentRequest from existing Department (for form pre-population)
     */
    public static UpdateDepartmentRequest fromEntity(Department department) {
        UpdateDepartmentRequest request = new UpdateDepartmentRequest();
        request.setName(department.getName());
        request.setDescription(department.getDescription());
        request.setLocation(department.getLocation());
        request.setManagerName(department.getManagerName());
        return request;
    }
}