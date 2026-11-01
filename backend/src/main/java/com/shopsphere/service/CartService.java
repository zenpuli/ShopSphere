package com.shopsphere.service;

import com.shopsphere.dto.CartDto;
import com.shopsphere.entity.Cart;
import com.shopsphere.entity.CartItem;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Cart getOrCreateCartEntity(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(new Cart(user)));
    }

    @Transactional(readOnly = true)
    public CartDto getCartDtoForUser(User user) {
        Cart cart = getOrCreateCartEntity(user);
        return CartDto.fromEntity(cart);
    }

    @Transactional
    public CartDto addToCart(User user, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than zero.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        if (!Boolean.TRUE.equals(product.getActive())) {
            throw new BadRequestException("This product is currently unavailable.");
        }

        if (product.getStockQuantity() < quantity) {
            throw new BadRequestException("Cannot add " + quantity + " items. Available stock: " + product.getStockQuantity());
        }

        Cart cart = getOrCreateCartEntity(user);

        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            int newQuantity = item.getQuantity() + quantity;
            if (product.getStockQuantity() < newQuantity) {
                throw new BadRequestException("Cannot add more. Reached available stock limit (" + product.getStockQuantity() + ").");
            }
            item.setQuantity(newQuantity);
            item.setUnitPrice(product.getPrice());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(cart, product, quantity, product.getPrice());
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        Cart updatedCart = cartRepository.save(cart);
        return CartDto.fromEntity(updatedCart);
    }

    @Transactional
    public CartDto updateItemQuantity(User user, Long cartItemId, int quantity) {
        if (quantity <= 0) {
            return removeFromCart(user, cartItemId);
        }

        Cart cart = getOrCreateCartEntity(user);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        Product product = item.getProduct();
        if (product.getStockQuantity() < quantity) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + product.getStockQuantity() + ").");
        }

        item.setQuantity(quantity);
        item.setUnitPrice(product.getPrice());
        cartItemRepository.save(item);

        return CartDto.fromEntity(cartRepository.save(cart));
    }

    @Transactional
    public CartDto removeFromCart(User user, Long cartItemId) {
        Cart cart = getOrCreateCartEntity(user);

        CartItem itemToRemove = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        cart.removeItem(itemToRemove);
        cartItemRepository.delete(itemToRemove);

        return CartDto.fromEntity(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(User user) {
        Cart cart = getOrCreateCartEntity(user);
        cart.clearItems();
        cartRepository.save(cart);
    }
}
