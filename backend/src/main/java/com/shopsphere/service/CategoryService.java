package com.shopsphere.service;

import com.shopsphere.dto.CategoryDto;
import com.shopsphere.entity.Category;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return CategoryDto.fromEntity(category);
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return CategoryDto.fromEntity(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        String slug = dto.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = dto.getName().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        }

        if (categoryRepository.existsBySlug(slug)) {
            throw new BadRequestException("Category slug already exists: " + slug);
        }

        Category category = new Category(dto.getName(), slug, dto.getDescription(), dto.getImageUrl());
        Category saved = categoryRepository.save(category);
        return CategoryDto.fromEntity(saved);
    }
}
