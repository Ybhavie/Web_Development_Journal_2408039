package com.erp.product_erp_2408039.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erp.product_erp_2408039.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // That's it! Spring handles the Save, Update, Delete, and Find logic.
}