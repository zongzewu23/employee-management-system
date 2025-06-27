package edu.uw.cs.zongzewu.employee_management_system.service;

import edu.uw.cs.zongzewu.employee_management_system.repository.UserRepository;
import edu.uw.cs.zongzewu.employee_management_system.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
/**
 * Authentication Service - Will be completed on Day 3
 * Currently only provides a basic framework
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    // TODO: Day 3 - Add dependencies like UserRepository, PasswordEncoder, JwtUtil, etc.
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    /**
     * User Login - To be implemented on Day 3
     */
    public String login(String email, String password) {
        // TODO: Day 3 Implementation
        // 1. Validate user credentials
        // 2. Generate JWT token
        // 3. Return token
        throw new RuntimeException("Login functionality will be implemented in Day 3");
    }

    /**
     * User Registration - To be implemented on Day 3
     */
    public void register(String email, String password, String firstName, String lastName) {
        // TODO: Day 3 Implementation
        // 1. Validate user information
        // 2. Encrypt password
        // 3. Save user
        throw new RuntimeException("Registration functionality will be implemented in Day 3");
    }

    /**
     * Validate Token - To be implemented on Day 3
     */
    public boolean validateToken(String token) {
        // TODO: Day 3 Implementation
        // 1. Parse JWT
        // 2. Validate signature and expiration time
        // 3. Return validation result
        return false;
    }

    /**
     * Get User Info from Token - To be implemented on Day 3
     */
    public String getUserEmailFromToken(String token) {
        // TODO: Day 3 Implementation
        // 1. Parse JWT
        // 2. Extract user email
        throw new RuntimeException("Token parsing will be implemented in Day 3");
    }

    /**
     * Refresh Token - To be implemented on Day 3
     */
    public String refreshToken(String token) {
        // TODO: Day 3 Implementation
        // 1. Validate old token
        // 2. Generate new token
        throw new RuntimeException("Token refresh will be implemented in Day 3");
    }
}