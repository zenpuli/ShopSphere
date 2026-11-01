package com.shopsphere.service;

import com.shopsphere.dto.AdminStatsDto;
import com.shopsphere.dto.OrderDto;
import com.shopsphere.dto.UserDto;
import com.shopsphere.entity.OrderStatus;
import com.shopsphere.entity.Role;
import com.shopsphere.entity.Order;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public AdminService(OrderRepository orderRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public AdminStatsDto getDashboardStats() {
        List<Order> orders = orderRepository.findAll();

        BigDecimal totalRevenue = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalOrders = orders.size();
        long totalProducts = productRepository.count();
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long pendingOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PLACED || o.getStatus() == OrderStatus.PROCESSING)
                .count();
        long deliveredOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .count();

        return new AdminStatsDto(
                totalRevenue,
                totalOrders,
                totalProducts,
                totalCustomers,
                pendingOrders,
                deliveredOrders
        );
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        order.setStatus(status);
        Order updated = orderRepository.save(order);
        return OrderDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllCustomers() {
        return userRepository.findByRoleOrderByCreatedAtDesc(Role.CUSTOMER).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }
}
