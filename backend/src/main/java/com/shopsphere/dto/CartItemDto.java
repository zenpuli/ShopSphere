package com.shopsphere.dto;

import com.shopsphere.entity.CartItem;

import java.math.BigDecimal;

public class CartItemDto {

    private Long id;
    private Long productId;
    private String productName;
    private String productSlug;
    private String productImageUrl;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
    private boolean inStock;
    private int availableStock;

    public CartItemDto() {
    }

    public CartItemDto(CartItem item) {
        if (item != null) {
            this.id = item.getId();
            if (item.getProduct() != null) {
                this.productId = item.getProduct().getId();
                this.productName = item.getProduct().getName();
                this.productSlug = item.getProduct().getSlug();
                this.productImageUrl = item.getProduct().getImageUrl();
                // Price is taken directly from the product to ensure fresh pricing
                this.unitPrice = item.getProduct().getPrice();
                this.availableStock = item.getProduct().getStockQuantity();
                this.inStock = item.getProduct().getStockQuantity() >= item.getQuantity() && item.getProduct().getActive();
            } else {
                this.unitPrice = item.getUnitPrice();
            }
            this.quantity = item.getQuantity();
            this.subtotal = this.unitPrice.multiply(BigDecimal.valueOf(this.quantity));
        }
    }

    public static CartItemDto fromEntity(CartItem item) {
        return new CartItemDto(item);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductSlug() {
        return productSlug;
    }

    public void setProductSlug(String productSlug) {
        this.productSlug = productSlug;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public boolean isInStock() {
        return inStock;
    }

    public void setInStock(boolean inStock) {
        this.inStock = inStock;
    }

    public int getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(int availableStock) {
        this.availableStock = availableStock;
    }
}
