package com.shopsphere.dto;

import java.math.BigDecimal;

public class AdminStatsDto {

    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private long totalOrders = 0;
    private long totalProducts = 0;
    private long totalCustomers = 0;
    private long pendingOrders = 0;
    private long deliveredOrders = 0;

    public AdminStatsDto() {
    }

    public AdminStatsDto(BigDecimal totalRevenue, long totalOrders, long totalProducts, long totalCustomers, long pendingOrders, long deliveredOrders) {
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
        this.totalProducts = totalProducts;
        this.totalCustomers = totalCustomers;
        this.pendingOrders = pendingOrders;
        this.deliveredOrders = deliveredOrders;
    }

    // Getters and Setters
    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }
}
