package edu.uw.cs.zongzewu.employee_management_system.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for token refresh request
 * Contains refresh token to obtain new access token
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenRefreshRequest {

    @NotBlank(message = "Refresh token is required")
    private String refreshToken;

    /**
     * Validate refresh token format
     */
    public void validateToken() {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new IllegalArgumentException("Refresh token cannot be empty");
        }

        // Basic JWT format validation (should have 3 parts separated by dots)
        String[] parts = refreshToken.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid refresh token format");
        }
    }
}