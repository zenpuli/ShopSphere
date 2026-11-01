package com.shopsphere.service;

import com.shopsphere.dto.AuthRequest;
import com.shopsphere.dto.RegisterRequest;
import com.shopsphere.dto.UserDto;
import com.shopsphere.entity.Cart;
import com.shopsphere.entity.Role;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.exception.UnauthorizedException;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, CartRepository cartRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        User user = new User(
                normalizedEmail,
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                Role.CUSTOMER,
                request.getPhone(),
                request.getAddress()
        );

        User savedUser = userRepository.save(user);

        // Automatically initialize persistent cart for the customer
        if (cartRepository.findByUserId(savedUser.getId()).isEmpty()) {
            cartRepository.save(new Cart(savedUser));
        }

        return savedUser;
    }

    public User authenticate(String email, String password) {
        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        return user;
    }

    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("Authentication required. Please log in.");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
    }

    public UserDto getCurrentUserDto() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(UserDto::fromEntity)
                .orElse(null);
    }
}
