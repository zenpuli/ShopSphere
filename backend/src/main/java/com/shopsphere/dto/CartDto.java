package com.shopsphere.dto;

import com.shopsphere.entity.Cart;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartDto {

    private Long id;
    private List<CartItemDto> items = new ArrayList<>();
    private int totalItems = 0;
    private BigDecimal totalAmount = BigDecimal.ZERO;
    private boolean validForCheckout = true;

    public CartDto() {
    }

    public CartDto(Cart cart) {
        if (cart != null) {
            this.id = cart.getId();
            BigDecimal sum = BigDecimal.ZERO;
            int count = 0;
            boolean valid = true;

            if (cart.getItems() != null) {
                for (var item : cart.getItems()) {
                    CartItemDto itemDto = new CartItemDto(item);
                    this.items.add(itemDto);
                    sum = sum.add(itemDto.getSubtotal());
                    count += itemDto.getQuantity();
                    if (!itemDto.isInStock()) {
                        valid = false;
                    }
                }
            }
            this.totalItems = count;
            this.totalAmount = sum;
            this.validForCheckout = valid && count > 0;
        }
    }

    public static CartDto fromEntity(Cart cart) {
        return new CartDto(cart);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public boolean isValidForCheckout() {
        return validForCheckout;
    }

    public void setValidForCheckout(boolean validForCheckout) {
        this.validForCheckout = validForCheckout;
    }
}
