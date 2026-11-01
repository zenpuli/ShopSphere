package com.shopsphere.dto;

import com.shopsphere.entity.Role;
import com.shopsphere.entity.User;

import java.time.LocalDateTime;

public class UserDto {

    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private String phone;
    private String address;
    private LocalDateTime createdAt;

    public UserDto() {
    }

    public UserDto(User user) {
        if (user != null) {
            this.id = user.getId();
            this.email = user.getEmail();
            this.fullName = user.getFullName();
            this.role = user.getRole();
            this.phone = user.getPhone();
            this.address = user.getAddress();
            this.createdAt = user.getCreatedAt();
        }
    }

    public static UserDto fromEntity(User user) {
        return new UserDto(user);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
