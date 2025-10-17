'use client';

import { useState, useEffect } from 'react';
import { productApi, blogApi, adminApi, Product, Blog, AdminStats } from '../api';

// Hook pour les statistiques admin
export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminApi.getStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch };
}

// Hook pour les produits/services
export function useProducts(search = '', category = '') {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getAll(search, category);
        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category]);

  const createProduct = async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await productApi.create(productData);
      if (response.success) {
        // Rafraîchir la liste
        const refreshResponse = await productApi.getAll(search, category);
        if (refreshResponse.success && refreshResponse.data) {
          setProducts(refreshResponse.data);
        }
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erreur lors de la création' };
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const response = await productApi.update(id, productData);
      if (response.success) {
        // Rafraîchir la liste
        const refreshResponse = await productApi.getAll(search, category);
        if (refreshResponse.success && refreshResponse.data) {
          setProducts(refreshResponse.data);
        }
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour' };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await productApi.delete(id);
      if (response.success) {
        // Rafraîchir la liste
        const refreshResponse = await productApi.getAll(search, category);
        if (refreshResponse.success && refreshResponse.data) {
          setProducts(refreshResponse.data);
        }
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erreur lors de la suppression' };
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

// Hook pour les blogs/réalisations
export function useBlogs(search = '', featured = false) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await blogApi.getAll(search, featured);
        if (response.success && response.data) {
          setBlogs(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [search, featured]);

  const createBlog = async (blogData: Omit<Blog, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await blogApi.create(blogData);
      if (response.success) {
        // Rafraîchir la liste
        const refreshResponse = await blogApi.getAll(search, featured);
        if (refreshResponse.success && refreshResponse.data) {
          setBlogs(refreshResponse.data);
        }
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erreur lors de la création' };
    }
  };

  const updateBlog = async (id: string, blogData: Partial<Blog>) => {
    try {
      const response = await blogApi.update(id, blogData);
      if (response.success) {
        // Rafraîchir la liste
        const refreshResponse = await blogApi.getAll(search, featured);
        if (refreshResponse.success && refreshResponse.data) {
          setBlogs(refreshResponse.data);
        }
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour' };
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      const response = await blogApi.delete(id);
      if (response.success) {
        // Rafraîchir la liste
        const refreshResponse = await blogApi.getAll(search, featured);
        if (refreshResponse.success && refreshResponse.data) {
          setBlogs(refreshResponse.data);
        }
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erreur lors de la suppression' };
    }
  };

  return {
    blogs,
    loading,
    error,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}
