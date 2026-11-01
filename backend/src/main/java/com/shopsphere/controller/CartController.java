package com.shopsphere.controller;

import com.shopsphere.dto.AddToCartRequest;
import com.shopsphere.dto.ApiResponse;
import com.shopsphere.dto.CartDto;
import com.shopsphere.dto.UpdateCartItemRequest;
import com.shopsphere.entity.User;
import com.shopsphere.service.AuthService;
import com.shopsphere.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    public CartController(CartService cartService, AuthService authService) {
        this.cartService = cartService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart() {
        User user = authService.getCurrentAuthenticatedUser();
        CartDto cart = cartService.getCartDtoForUser(user);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(@Valid @RequestBody AddToCartRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        CartDto updatedCart = cartService.addToCart(user, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("Product added to cart.", updatedCart));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        User user = authService.getCurrentAuthenticatedUser();
        CartDto updatedCart = cartService.updateItemQuantity(user, itemId, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("Cart item updated.", updatedCart));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDto>> removeCartItem(@PathVariable Long itemId) {
        User user = authService.getCurrentAuthenticatedUser();
        CartDto updatedCart = cartService.removeFromCart(user, itemId);
        return ResponseEntity.ok(ApiResponse.success("Cart item removed.", updatedCart));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> clearCart() {
        User user = authService.getCurrentAuthenticatedUser();
        cartService.clearCart(user);
        return ResponseEntity.ok(ApiResponse.success("Cart emptied.", null));
    }
}
