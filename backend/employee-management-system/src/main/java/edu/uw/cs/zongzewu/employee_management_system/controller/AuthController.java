package edu.uw.cs.zongzewu.employee_management_system.controller;

import edu.uw.cs.zongzewu.employee_management_system.service.AuthService;
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
     * user login
     * POST /api/auth/login
     * Body: { "email": "user@example.com", "password": "password123" }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            String token = authService.login(email, password);

            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "message", "Login successful"
                    ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid credentials",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * user register
     * POST /api/auth/register
     * Body: { "email": "user@example.com", "password": "password123", "firstName": "John", "lastName": "Doe" }
     */
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        try {
            String email = registerRequest.get("email");
            String password = registerRequest.get("password");
            String firstName = registerRequest.get("firstName");
            String lastName = registerRequest.get("lastName");

            authService.register(email, password, firstName, lastName);

            return ResponseEntity.ok(Map.of(
                    "message", "Registration successful"
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
               "error", "Registration failed",
               "message", e.getMessage()
            ));
        }
    }

    /**
     * verify Token
     * POST /api/auth/validate
     * Body: {"token": "jwt_token_here"}
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> tokenRequest) {
        try {
            String token = tokenRequest.get("token");

            boolean isValid = authService.validateToken(token);
            if (isValid) {
                String userEmail = authService.getUserEmailFromToken(token);
                return ResponseEntity.ok(Map.of(
                        "valid", true,
                        "email", userEmail
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                        "valid", false
                ));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Token validation failed",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * refresh Token
     * POST /api/auth/refresh
     * Body: { "token": "old_jwt_token_here" }
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> tokenRequest) {
        try {
            String oldToken = tokenRequest.get("token");

            String newToken = authService.refreshToken(oldToken);

            return ResponseEntity.ok(Map.of(
                    "token", newToken,
                    "message", "Token refreshed successfully"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Token refresh failed",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * userLogout
     * POST /api/auth/logout
     * Header: Authorization: Bearer {token}
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {

        // return successful message for, now, might need to do more in the future
        return ResponseEntity.ok(Map.of(
                "message", "Logout successful"
        ));
    }
}
