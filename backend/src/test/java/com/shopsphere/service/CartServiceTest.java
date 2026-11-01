package com.shopsphere.service;

import com.shopsphere.dto.CartDto;
import com.shopsphere.entity.*;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Category category;
    private Product product;
    private Cart cart;

    @BeforeEach
    void setUp() {
        user = new User("test@example.com", "pass", "Test User", Role.CUSTOMER, "1234567890", "Address");
        user.setId(1L);

        category = new Category("Electronics", "electronics", "Desc", "url");
        category.setId(1L);

        product = new Product("Laptop", "laptop", "A high performance laptop", new BigDecimal("999.99"), 10, "img.jpg", category, true, true);
        product.setId(10L);

        cart = new Cart(user);
        cart.setId(100L);
    }

    @Test
    void addToCart_Success() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        CartDto result = cartService.addToCart(user, 10L, 2);

        assertNotNull(result);
        assertEquals(1, cart.getItems().size());
        assertEquals(2, cart.getItems().get(0).getQuantity());
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    void addToCart_ThrowsWhenStockInsufficient() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            cartService.addToCart(user, 10L, 25);
        });

        assertTrue(exception.getMessage().contains("Available stock"));
    }

    @Test
    void addToCart_ThrowsWhenProductInactive() {
        product.setActive(false);
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        assertThrows(BadRequestException.class, () -> {
            cartService.addToCart(user, 10L, 1);
        });
    }
}
