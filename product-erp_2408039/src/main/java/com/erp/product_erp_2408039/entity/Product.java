package com.erp.product_erp_2408039.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products") // This creates a table named 'products' in H2
@Data // Lombok: automatically gives you Getters, Setters, and toString
@NoArgsConstructor // Lombok: creates the empty constructor Hibernate needs
@AllArgsConstructor // Lombok: creates a constructor with all fields
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productName;

    private String category;

    @Column(nullable = false)
    private Double price;

    private Integer quantityInStock;
}