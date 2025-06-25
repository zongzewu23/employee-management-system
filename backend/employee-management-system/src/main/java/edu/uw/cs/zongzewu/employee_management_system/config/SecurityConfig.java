package edu.uw.cs.zongzewu.employee_management_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("SecurityConfig loaded");

        http
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/api/**").permitAll()  // allow all api
                                .requestMatchers("/error").permitAll()
                                .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable())  // forbid CSRF
                .cors(cors -> {})               // use CORS
                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny));

        System.out.println("Security config done");
        return http.build();
    }
}