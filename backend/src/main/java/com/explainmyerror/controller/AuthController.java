package com.explainmyerror.controller;

import com.explainmyerror.dto.ApiResponse;
import com.explainmyerror.dto.AuthDto;
import com.explainmyerror.entity.User;
import com.explainmyerror.exception.AIAnalysisException;
import com.explainmyerror.repository.UserRepository;
import com.explainmyerror.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> register(
            @Valid @RequestBody AuthDto.RegisterRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("EMAIL_TAKEN", "An account with this email already exists."));
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();
        user = userRepo.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return ResponseEntity.ok(ApiResponse.success(buildAuthResponse(user, token)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> login(
            @Valid @RequestBody AuthDto.LoginRequest request) {

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new AIAnalysisException("User not found after authentication"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return ResponseEntity.ok(ApiResponse.success(buildAuthResponse(user, token)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> me(
            @org.springframework.security.core.annotation.AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("UNAUTHORIZED", "Not authenticated"));
        }
        User user = userRepo.findByEmail(principal.getUsername()).orElseThrow();
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return ResponseEntity.ok(ApiResponse.success(buildAuthResponse(user, token)));
    }

    private AuthDto.AuthResponse buildAuthResponse(User user, String token) {
        return AuthDto.AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .preferredExplanationLevel(user.getPreferredExplanationLevel())
                .defaultLanguage(user.getDefaultLanguage())
                .theme(user.getTheme())
                .build();
    }
}
