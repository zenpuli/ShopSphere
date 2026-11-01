package com.shopsphere.dto;

import com.shopsphere.entity.Order;
import com.shopsphere.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderDto {

    private Long id;
    private String orderNumber;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private String recipientName;
    private String recipientPhone;
    private String paymentMethod;
    private String paymentStatus;
    private Long customerId;
    private String customerEmail;
    private String customerName;
    private List<OrderItemDto> items = new ArrayList<>();

    public OrderDto() {
    }

    public OrderDto(Order order) {
        if (order != null) {
            this.id = order.getId();
            this.orderNumber = order.getOrderNumber();
            this.orderDate = order.getOrderDate();
            this.status = order.getStatus();
            this.totalAmount = order.getTotalAmount();
            this.shippingAddress = order.getShippingAddress();
            this.recipientName = order.getRecipientName();
            this.recipientPhone = order.getRecipientPhone();
            this.paymentMethod = order.getPaymentMethod();
            this.paymentStatus = order.getPaymentStatus();
            if (order.getUser() != null) {
                this.customerId = order.getUser().getId();
                this.customerEmail = order.getUser().getEmail();
                this.customerName = order.getUser().getFullName();
            }
            if (order.getItems() != null) {
                for (var item : order.getItems()) {
                    this.items.add(new OrderItemDto(item));
                }
            }
        }
    }

    public static OrderDto fromEntity(Order order) {
        return new OrderDto(order);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientPhone() {
        return recipientPhone;
    }

    public void setRecipientPhone(String recipientPhone) {
        this.recipientPhone = recipientPhone;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public List<OrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }
}
