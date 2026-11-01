package com.shopsphere.repository;

import com.shopsphere.entity.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    List<Product> findByActiveTrue();

    List<Product> findByActiveTrue(Sort sort);

    List<Product> findByFeaturedTrueAndActiveTrue();

    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);

    List<Product> findByCategoryIdAndActiveTrue(Long categoryId, Sort sort);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchProducts(@Param("query") String query, Sort sort);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> filterAndSearch(@Param("categoryId") Long categoryId, @Param("query") String query, Sort sort);
}
