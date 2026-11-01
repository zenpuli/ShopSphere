package com.shopsphere.controller;

import com.shopsphere.dto.ApiResponse;
import com.shopsphere.dto.AuthRequest;
import com.shopsphere.dto.RegisterRequest;
import com.shopsphere.dto.UserDto;
import com.shopsphere.entity.User;
import com.shopsphere.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(AuthService authService,
                          AuthenticationManager authenticationManager,
                          SecurityContextRepository securityContextRepository) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDto>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        User registeredUser = authService.register(request);

        // Auto-login upon registration
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                registeredUser.getEmail(),
                null,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + registeredUser.getRole().name()))
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authToken);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account registered and authenticated successfully.", UserDto.fromEntity(registeredUser)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDto>> login(
            @Valid @RequestBody AuthRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);

        User user = authService.authenticate(request.getEmail(), request.getPassword());

        return ResponseEntity.ok(ApiResponse.success("Login successful.", UserDto.fromEntity(user)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully.", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        UserDto userDto = authService.getCurrentUserDto();
        if (userDto == null) {
            return ResponseEntity.ok(ApiResponse.success("No active session", null));
        }
        return ResponseEntity.ok(ApiResponse.success("Current user profile retrieved", userDto));
    }
}
