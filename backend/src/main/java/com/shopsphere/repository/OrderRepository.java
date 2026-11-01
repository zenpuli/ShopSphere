package com.shopsphere.repository;

import com.shopsphere.entity.Order;
import com.shopsphere.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    Optional<Order> findByIdAndUserId(Long id, Long userId);

    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    List<Order> findAllByOrderByOrderDateDesc();

    long countByStatus(OrderStatus status);

    long countByUserId(Long userId);
}
