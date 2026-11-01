package com.shopsphere.dto;

import com.shopsphere.entity.Product;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDto {

    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;

    private String slug;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stockQuantity;

    private String imageUrl;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private String categoryName;
    private String categorySlug;
    private Boolean featured;
    private Boolean active;
    private LocalDateTime createdAt;

    public ProductDto() {
    }

    public ProductDto(Product product) {
        if (product != null) {
            this.id = product.getId();
            this.name = product.getName();
            this.slug = product.getSlug();
            this.description = product.getDescription();
            this.price = product.getPrice();
            this.stockQuantity = product.getStockQuantity();
            this.imageUrl = product.getImageUrl();
            if (product.getCategory() != null) {
                this.categoryId = product.getCategory().getId();
                this.categoryName = product.getCategory().getName();
                this.categorySlug = product.getCategory().getSlug();
            }
            this.featured = product.getFeatured();
            this.active = product.getActive();
            this.createdAt = product.getCreatedAt();
        }
    }

    public static ProductDto fromEntity(Product product) {
        return new ProductDto(product);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategorySlug() {
        return categorySlug;
    }

    public void setCategorySlug(String categorySlug) {
        this.categorySlug = categorySlug;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
