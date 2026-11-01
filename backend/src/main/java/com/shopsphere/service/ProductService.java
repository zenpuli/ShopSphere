package com.shopsphere.service;

import com.shopsphere.dto.ProductDto;
import com.shopsphere.entity.Category;
import com.shopsphere.entity.Product;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ProductDto> getAllProducts(Long categoryId, String query, String sortBy) {
        Sort sort = resolveSort(sortBy);

        String trimmedQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;

        List<Product> products = productRepository.filterAndSearch(categoryId, trimmedQuery, sort);
        return products.stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue().stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return ProductDto.fromEntity(product);
    }

    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return ProductDto.fromEntity(product);
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        String slug = dto.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = generateSlug(dto.getName());
        }

        if (productRepository.findBySlug(slug).isPresent()) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Product product = new Product(
                dto.getName().trim(),
                slug,
                dto.getDescription().trim(),
                dto.getPrice(),
                dto.getStockQuantity(),
                dto.getImageUrl(),
                category,
                dto.getFeatured() != null ? dto.getFeatured() : false,
                dto.getActive() != null ? dto.getActive() : true
        );

        Product saved = productRepository.save(product);
        return ProductDto.fromEntity(saved);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        if (dto.getCategoryId() != null && (product.getCategory() == null || !product.getCategory().getId().equals(dto.getCategoryId()))) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));
            product.setCategory(category);
        }

        if (dto.getName() != null) {
            product.setName(dto.getName().trim());
        }
        if (dto.getDescription() != null) {
            product.setDescription(dto.getDescription().trim());
        }
        if (dto.getPrice() != null) {
            product.setPrice(dto.getPrice());
        }
        if (dto.getStockQuantity() != null) {
            product.setStockQuantity(dto.getStockQuantity());
        }
        if (dto.getImageUrl() != null) {
            product.setImageUrl(dto.getImageUrl());
        }
        if (dto.getFeatured() != null) {
            product.setFeatured(dto.getFeatured());
        }
        if (dto.getActive() != null) {
            product.setActive(dto.getActive());
        }

        Product updated = productRepository.save(product);
        return ProductDto.fromEntity(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        // Soft delete / deactivate so historical orders remain valid
        product.setActive(false);
        productRepository.save(product);
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        return switch (sortBy.toLowerCase()) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "name_asc" -> Sort.by(Sort.Direction.ASC, "name");
            case "name_desc" -> Sort.by(Sort.Direction.DESC, "name");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    private String generateSlug(String name) {
        return name.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }
}
