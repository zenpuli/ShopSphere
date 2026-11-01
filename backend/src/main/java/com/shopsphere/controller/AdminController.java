package com.shopsphere.controller;

import com.shopsphere.dto.*;
import com.shopsphere.service.AdminService;
import com.shopsphere.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;

    public AdminController(AdminService adminService, ProductService productService) {
        this.adminService = adminService;
        this.productService = productService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getDashboardStats() {
        AdminStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getAllOrders() {
        List<OrderDto> orders = adminService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {

        OrderDto updated = adminService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully.", updated));
    }

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllCustomers() {
        List<UserDto> customers = adminService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success(customers));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody ProductDto dto) {
        ProductDto created = productService.createProduct(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully.", created));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductDto dto) {

        ProductDto updated = productService.updateProduct(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully.", updated));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deactivated successfully.", null));
    }
}
