package edu.uw.cs.zongzewu.employee_management_system.service;

import edu.uw.cs.zongzewu.employee_management_system.dto.AuthResponse;
import edu.uw.cs.zongzewu.employee_management_system.dto.LoginRequest;
import edu.uw.cs.zongzewu.employee_management_system.dto.RegisterRequest;
import edu.uw.cs.zongzewu.employee_management_system.entity.User;
import edu.uw.cs.zongzewu.employee_management_system.repository.UserRepository;
import edu.uw.cs.zongzewu.employee_management_system.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
/**
 * Authentication Service - Will be completed on Day 3
 * Currently only provides a basic framework
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    /**
     * User Login - To be implemented on Day 3
     */
    public AuthResponse login(LoginRequest loginRquest) {
        try {
            // authenticate user
            Authentication authentication = authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                      loginRquest.getUsername(),
                      loginRquest.getPassword()
              )
            );

            // get user details
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(()-> new RuntimeException("User not found"));

            // Generate tokens
            String accessToken = jwtUtil.generateAccessToken(userDetails);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);

            return new AuthResponse(
                    accessToken,
                    refreshToken,
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name()
            );

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid username or password");
        }
    }

    /**
     * User Registration - To be implemented on Day 3
     */
    public void register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("User already exists");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setRole(User.Role.USER);
        user.setEnabled(true);

        userRepository.save(user);
    }

    /**
     * Validate Token - To be implemented on Day 3
     */
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    /**
     * Get User Info from Token - To be implemented on Day 3
     */
    public String getUsernameFromToken(String token) {
        return jwtUtil.extractUsername(token);
    }

    /**
     * Refresh Token - To be implemented on Day 3
     */
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh Token");
        }

        if (!jwtUtil.isRefreshToken(refreshToken)) {
            throw new RuntimeException("Token is not a refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("User not found"));

        // generate new tokens
        String newAccessToken = jwtUtil.generateAccessToken(userDetails);
        String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}