package edu.uw.cs.zongzewu.employee_management_system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user registration request
 * Contains new user registration data with validation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    /**
     * Validate business rules for registration
     */
    public void validateBusinessRules() {
        if (username != null && username.toLowerCase().contains("admin")) {
            throw new IllegalArgumentException("Username cannot contain 'admin'");
        }

        if (password != null && password.equals(username)) {
            throw new IllegalArgumentException("Password cannot be the same as username");
        }
    }
}