'use client';

import { useState, useEffect } from 'react';
import { productApi, blogApi, Product, Blog } from '../api';

// Hook pour récupérer les services mis en avant
export function useFeaturedServices() {
  const [services, setServices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getAll(); // Récupérer tous les services
        if (response.success && response.data) {
          setServices(response.data.slice(0, 6)); // Limiter à 6 pour l'affichage
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error };
}

// Hook pour récupérer les blogs/réalisations mis en avant
export function useFeaturedBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await blogApi.getAll('', true); // Récupérer les blogs mis en vedette
        if (response.success && response.data) {
          setBlogs(response.data.slice(0, 6)); // Limiter à 6 pour l'affichage
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des réalisations');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return { blogs, loading, error };
}
