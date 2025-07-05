package edu.uw.cs.zongzewu.employee_management_system.controller;

import edu.uw.cs.zongzewu.employee_management_system.dto.*;
import edu.uw.cs.zongzewu.employee_management_system.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and authorization endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(
            summary = "User login",
            description = "Authenticate user and return JWT token"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Login successful",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthResponse.class),
                            examples = @ExampleObject(
                                    value = """
                    {
                        "success": true,
                        "message": "Login successful",
                        "data": {
                            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            "username": "admin",
                            "expiresIn": 86400
                        }
                    }
                    """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid credentials",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                    {
                        "success": false,
                        "message": "Invalid username or password"
                    }
                    """
                            )
                    )
            )
    })
    public ResponseEntity<?> login(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Login credentials",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = LoginRequest.class),
                            examples = @ExampleObject(
                                    value = """
                    {
                        "username": "admin",
                        "password": "password123"
                    }
                    """
                            )
                    )
            )
            @Valid @RequestBody LoginRequest loginRequest) {
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

    @PostMapping("/register")
    @Operation(
            summary = "User registration",
            description = "Register a new user account"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registration successful"),
            @ApiResponse(responseCode = "400", description = "Registration failed")
    })
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

    @PostMapping("/validate")
    @Operation(
            summary = "Validate JWT token",
            description = "Check if a JWT token is valid and return user information"
    )
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

    @PostMapping("/refresh")
    @Operation(
            summary = "Refresh JWT token",
            description = "Get a new access token using refresh token"
    )
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

    @PostMapping("/logout")
    @Operation(
            summary = "User logout",
            description = "Logout user (client-side token removal)"
    )
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> logout(
            @Parameter(description = "Authorization header with Bearer token")
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        // For JWT, logout is handled on the client side by removing the token
        // Server-side token blacklisting can be implemented later if needed
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logout successful"
        ));
    }

    @GetMapping("/me")
    @Operation(
            summary = "Get current user info",
            description = "Get information about the currently authenticated user"
    )
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> getCurrentUser(
            @Parameter(description = "Authorization header with Bearer token")
            @RequestHeader("Authorization") String authHeader) {
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

    @GetMapping("/health")
    @Operation(
            summary = "Health check",
            description = "Simple health check endpoint for container health monitoring"
    )
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Service is healthy",
                "timestamp", System.currentTimeMillis()
        ));
    }
}