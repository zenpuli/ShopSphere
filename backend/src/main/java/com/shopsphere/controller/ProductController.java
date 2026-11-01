package com.shopsphere.controller;

import com.shopsphere.dto.ApiResponse;
import com.shopsphere.dto.ProductDto;
import com.shopsphere.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "newest") String sortBy) {

        List<ProductDto> products = productService.getAllProducts(categoryId, query, sortBy);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getFeaturedProducts() {
        List<ProductDto> featured = productService.getFeaturedProducts();
        return ResponseEntity.ok(ApiResponse.success(featured));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductBySlug(@PathVariable String slug) {
        ProductDto product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(product));
    }
}
