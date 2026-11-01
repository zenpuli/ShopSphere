package com.shopsphere.service;

import com.shopsphere.dto.CheckoutRequest;
import com.shopsphere.dto.OrderDto;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        ProductRepository productRepository,
                        CartService cartService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.cartService = cartService;
    }

    @Transactional
    public OrderDto checkout(User user, CheckoutRequest request) {
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Shopping cart is empty. Please add items before checkout."));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty. Please add products before checking out.");
        }

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        String orderNumber = generateOrderNumber();

        Order order = new Order(
                orderNumber,
                user,
                BigDecimal.ZERO, // Will update with server-computed total
                request.getShippingAddress().trim(),
                request.getRecipientName().trim(),
                request.getRecipientPhone().trim(),
                request.getPaymentMethod() != null ? request.getPaymentMethod() : "CARD",
                "PAID"
        );

        for (CartItem cartItem : cart.getItems()) {
            // Fresh reload of product to verify current price and prevent race conditions
            Product product = productRepository.findById(cartItem.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product no longer available: " + cartItem.getProduct().getName()));

            if (!Boolean.TRUE.equals(product.getActive())) {
                throw new BadRequestException("Product '" + product.getName() + "' is currently unavailable.");
            }

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for '" + product.getName() + "'. Available: "
                        + product.getStockQuantity() + ", requested: " + cartItem.getQuantity());
            }

            // Decrement stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            // Compute subtotal exclusively on backend
            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            calculatedTotal = calculatedTotal.add(itemSubtotal);

            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    product.getName(),
                    product.getPrice(),
                    cartItem.getQuantity(),
                    itemSubtotal
            );

            order.addItem(orderItem);
        }

        order.setTotalAmount(calculatedTotal);
        Order savedOrder = orderRepository.save(order);

        // Clear cart only after successful order placement
        cartService.clearCart(user);

        return OrderDto.fromEntity(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersForUser(User user) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId()).stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderByIdForUser(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        // Enforce customer data isolation
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You are not authorized to view this order.");
        }

        return OrderDto.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderByOrderNumberForUser(String orderNumber, User user) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You are not authorized to view this order.");
        }

        return OrderDto.fromEntity(order);
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "ORD-" + timestamp + "-" + randomSuffix;
    }
}
