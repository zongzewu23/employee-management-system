package edu.uw.cs.zongzewu.employee_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for authentication response
 * Contains JWT tokens and user information after successful authentication
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private String username;
    private String email;
    private String role;

    /**
     * Constructor without tokenType (defaults to "Bearer")
     */
    public AuthResponse(String accessToken, String refreshToken, String username, String email, String role) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = "Bearer";
        this.username = username;
        this.email = email;
        this.role = role;
    }

    /**
     * Create a response for successful authentication
     */
    public static AuthResponse success(String accessToken, String refreshToken,
                                       String username, String email, String role) {
        return new AuthResponse(accessToken, refreshToken, username, email, role);
    }
}