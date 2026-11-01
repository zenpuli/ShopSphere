package com.shopsphere.dto;

import com.shopsphere.entity.Category;

public class CategoryDto {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private int productCount;

    public CategoryDto() {
    }

    public CategoryDto(Category category) {
        if (category != null) {
            this.id = category.getId();
            this.name = category.getName();
            this.slug = category.getSlug();
            this.description = category.getDescription();
            this.imageUrl = category.getImageUrl();
            try {
                this.productCount = category.getProducts() != null ? category.getProducts().size() : 0;
            } catch (Exception e) {
                this.productCount = 0;
            }
        }
    }

    public static CategoryDto fromEntity(Category category) {
        return new CategoryDto(category);
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getProductCount() {
        return productCount;
    }

    public void setProductCount(int productCount) {
        this.productCount = productCount;
    }
}
