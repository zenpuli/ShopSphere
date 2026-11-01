package com.shopsphere.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CheckoutRequest {

    @NotBlank(message = "Recipient name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String recipientName;

    @NotBlank(message = "Recipient phone is required")
    @Size(min = 7, max = 20, message = "Valid phone number is required")
    private String recipientPhone;

    @NotBlank(message = "Shipping address is required")
    @Size(min = 5, message = "Please provide a complete shipping address")
    private String shippingAddress;

    private String paymentMethod = "CARD";

    public CheckoutRequest() {
    }

    public CheckoutRequest(String recipientName, String recipientPhone, String shippingAddress, String paymentMethod) {
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod != null ? paymentMethod : "CARD";
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

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
