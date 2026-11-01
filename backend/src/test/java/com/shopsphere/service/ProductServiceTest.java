package com.shopsphere.service;

import com.shopsphere.dto.ProductDto;
import com.shopsphere.entity.Category;
import com.shopsphere.entity.Product;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    private Category category;
    private Product product;

    @BeforeEach
    void setUp() {
        category = new Category("Electronics", "electronics", "Desc", "url");
        category.setId(1L);

        product = new Product("Wireless Earbuds", "wireless-earbuds", "Active noise cancellation",
                new BigDecimal("89.99"), 50, "earbuds.jpg", category, true, true);
        product.setId(10L);
    }

    @Test
    void getAllProducts_CallsRepositoryWithFilters() {
        when(productRepository.filterAndSearch(eq(1L), eq("earbuds"), any(Sort.class)))
                .thenReturn(List.of(product));

        List<ProductDto> results = productService.getAllProducts(1L, "earbuds", "price_asc");

        assertEquals(1, results.size());
        assertEquals("Wireless Earbuds", results.get(0).getName());
    }

    @Test
    void getProductById_ReturnsProduct() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        ProductDto result = productService.getProductById(10L);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("Wireless Earbuds", result.getName());
    }

    @Test
    void createProduct_SavesNewProduct() {
        ProductDto inputDto = new ProductDto();
        inputDto.setName("New Keyboard");
        inputDto.setDescription("RGB Mechanical Keyboard");
        inputDto.setPrice(new BigDecimal("129.99"));
        inputDto.setStockQuantity(20);
        inputDto.setCategoryId(1L);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> {
            Product p = inv.getArgument(0);
            p.setId(20L);
            return p;
        });

        ProductDto created = productService.createProduct(inputDto);

        assertNotNull(created);
        assertEquals(20L, created.getId());
        assertEquals("New Keyboard", created.getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }
}
