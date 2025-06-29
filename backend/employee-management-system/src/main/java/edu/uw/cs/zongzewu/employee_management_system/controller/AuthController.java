package edu.uw.cs.zongzewu.employee_management_system.controller;

import edu.uw.cs.zongzewu.employee_management_system.dto.*;
import edu.uw.cs.zongzewu.employee_management_system.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * User login
     * POST /api/auth/login
     * Body: { "username": "admin", "password": "password123" }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.login(loginRequest);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Login successful",
                    "data", authResponse
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * User registration
     * POST /api/auth/register
     * Body: { "username": "newuser", "password": "password123", "email": "user@example.com" }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            authService.register(registerRequest);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Registration successful"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Validate token
     * POST /api/auth/validate
     * Body: {"token": "jwt_token_here"}
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@Valid @RequestBody TokenValidationRequest tokenRequest) {
        try {
            boolean isValid = authService.validateToken(tokenRequest.getToken());

            if (isValid) {
                String username = authService.getUsernameFromToken(tokenRequest.getToken());
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "valid", true,
                        "username", username
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "valid", false
                ));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage(),
                    "valid", false
            ));
        }
    }

    /**
     * Refresh token
     * POST /api/auth/refresh
     * Body: { "refreshToken": "refresh_jwt_token_here" }
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest tokenRefreshRequest) {
        try {
            AuthResponse authResponse = authService.refreshToken(tokenRefreshRequest.getRefreshToken());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Token refreshed successfully",
                    "data", authResponse
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * User logout
     * POST /api/auth/logout
     * Header: Authorization: Bearer {token}
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        // For JWT, logout is handled on the client side by removing the token
        // Server-side token blacklisting can be implemented later if needed
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logout successful"
        ));
    }

    /**
     * Get current user info
     * GET /api/auth/me
     * Header: Authorization: Bearer {token}
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String username = authService.getUsernameFromToken(token);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "username", username
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}