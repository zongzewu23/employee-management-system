package edu.uw.cs.zongzewu.employee_management_system.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for token validation request
 * Contains token to be validated
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenValidationRequest {

    @NotBlank(message = "Token is required")
    private String token;

    /**
     * Validate token format
     */
    public void validateToken() {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token cannot be empty");
        }

        // Remove Bearer prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // Basic JWT format validation (should have 3 parts separated by dots)
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid token format");
        }
    }

    /**
     * Get token without Bearer prefix
     */
    @JsonIgnore
    public String getCleanToken() {
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return token;
    }
}