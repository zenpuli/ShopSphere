package com.shopsphere.service;

import com.shopsphere.dto.CheckoutRequest;
import com.shopsphere.dto.OrderDto;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CartService cartService;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private User otherUser;
    private Product product;
    private Cart cart;

    @BeforeEach
    void setUp() {
        user = new User("customer@example.com", "pass", "Customer One", Role.CUSTOMER, "1112223333", "123 Street");
        user.setId(1L);

        otherUser = new User("other@example.com", "pass", "Customer Two", Role.CUSTOMER, "9998887777", "456 Avenue");
        otherUser.setId(2L);

        Category category = new Category("Gadgets", "gadgets", "Desc", "url");
        product = new Product("Smart Watch", "smart-watch", "Top smartwatch", new BigDecimal("199.99"), 15, "img.jpg", category, true, true);
        product.setId(20L);

        cart = new Cart(user);
        cart.setId(50L);
        CartItem cartItem = new CartItem(cart, product, 2, product.getPrice());
        cart.addItem(cartItem);
    }

    @Test
    void checkout_SuccessfulOrderCreation_And_StockDecrement() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(20L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(999L);
            return o;
        });

        CheckoutRequest request = new CheckoutRequest(
                "Customer One",
                "1112223333",
                "123 Street, City",
                "CARD"
        );

        OrderDto orderDto = orderService.checkout(user, request);

        assertNotNull(orderDto);
        assertEquals(OrderStatus.PLACED, orderDto.getStatus());
        assertEquals(new BigDecimal("399.98"), orderDto.getTotalAmount());
        // Verify stock was decremented from 15 to 13
        assertEquals(13, product.getStockQuantity());
        verify(productRepository, times(1)).save(product);
        // Verify cart cleared
        verify(cartService, times(1)).clearCart(user);
    }

    @Test
    void checkout_ThrowsWhenStockDepleted() {
        product.setStockQuantity(1); // Cart requires 2
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(20L)).thenReturn(Optional.of(product));

        CheckoutRequest request = new CheckoutRequest("Customer One", "1112223333", "123 Street", "CARD");

        assertThrows(BadRequestException.class, () -> orderService.checkout(user, request));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void getOrderByIdForUser_EnforcesDataIsolation() {
        Order order = new Order("ORD-123", user, new BigDecimal("100.00"), "Address", "Name", "Phone", "CARD", "PAID");
        order.setId(500L);

        when(orderRepository.findById(500L)).thenReturn(Optional.of(order));

        // otherUser attempts to access user's order
        assertThrows(AccessDeniedException.class, () -> {
            orderService.getOrderByIdForUser(500L, otherUser);
        });
    }
}
