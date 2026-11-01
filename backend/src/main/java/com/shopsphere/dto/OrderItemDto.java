package com.shopsphere.dto;

import com.shopsphere.entity.OrderItem;

import java.math.BigDecimal;

public class OrderItemDto {

    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private BigDecimal productPrice;
    private Integer quantity;
    private BigDecimal subtotal;

    public OrderItemDto() {
    }

    public OrderItemDto(OrderItem item) {
        if (item != null) {
            this.id = item.getId();
            if (item.getProduct() != null) {
                this.productId = item.getProduct().getId();
                this.productImageUrl = item.getProduct().getImageUrl();
            }
            this.productName = item.getProductName();
            this.productPrice = item.getProductPrice();
            this.quantity = item.getQuantity();
            this.subtotal = item.getSubtotal();
        }
    }

    public static OrderItemDto fromEntity(OrderItem item) {
        return new OrderItemDto(item);
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

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public BigDecimal getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(BigDecimal productPrice) {
        this.productPrice = productPrice;
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
}
