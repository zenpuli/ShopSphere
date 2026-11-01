package com.shopsphere.controller;

import com.shopsphere.dto.ApiResponse;
import com.shopsphere.dto.CheckoutRequest;
import com.shopsphere.dto.OrderDto;
import com.shopsphere.entity.User;
import com.shopsphere.service.AuthService;
import com.shopsphere.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    public OrderController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderDto>> checkout(@Valid @RequestBody CheckoutRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        OrderDto order = orderService.checkout(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully.", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDto>>> getOrderHistory() {
        User user = authService.getCurrentAuthenticatedUser();
        List<OrderDto> orders = orderService.getOrdersForUser(user);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        OrderDto order = orderService.getOrderByIdForUser(id, user);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderByNumber(@PathVariable String orderNumber) {
        User user = authService.getCurrentAuthenticatedUser();
        OrderDto order = orderService.getOrderByOrderNumberForUser(orderNumber, user);
        return ResponseEntity.ok(ApiResponse.success(order));
    }
}
