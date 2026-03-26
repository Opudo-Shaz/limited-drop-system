import { useState, useEffect } from "react";
import { fetchProducts, Product } from "../api/products";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    const interval = setInterval(loadProducts, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return { products, loading, reload: loadProducts };
};