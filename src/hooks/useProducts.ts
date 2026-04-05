'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import { v4 as uuidv4 } from 'uuid';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const isProduct = (value: unknown): value is Product => {
    if (typeof value !== "object" || value === null) return false;
    const p = value as Partial<Product>;
    return (
      typeof p.id === "string" &&
      typeof p.name === "string" &&
      typeof p.price === "number" &&
      typeof p.description === "string"
    );
  };

  // Load products from localStorage
 useEffect(() => {
  try {
    const saved = localStorage.getItem("products");

    if (!saved) return;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid data format");
    }

    const validProducts: Product[] = parsed.filter(isProduct);

    setProducts(validProducts);
  } catch (error) {
    console.error("Failed to load products:", error);
    localStorage.removeItem("products"); // Clear corrupted data
  } finally {
    setLoading(false);
  }
}, []);
  // Save to localStorage
  const saveToStorage = useCallback((updatedProducts: Product[]) => {
    try {
      localStorage.setItem('products', JSON.stringify(updatedProducts, null, 2));
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Failed to save products:', error);
    }
  }, []);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    saveToStorage([newProduct, ...products]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    const updated = products.map((product) =>
      product.id === id
        ? { 
            ...product, 
            ...updatedProduct,
            // Ensure price remains a number
            ...(updatedProduct.price !== undefined && { price: Number(updatedProduct.price) })
          }
        : product
    );
    saveToStorage(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((product) => product.id !== id);
    saveToStorage(updated);
  };

  const searchProducts = (query: string) => {
    if (!query.trim()) return products;
    const lowerQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery)
    );
  };

  // Get stats
  const getStats = () => ({
    total: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
  });

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    stats: getStats(),
  };
};