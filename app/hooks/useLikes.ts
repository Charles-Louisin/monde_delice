'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/Toast';

interface LikeData {
  liked: boolean;
  totalLikes: number;
}

interface UseLikesReturn {
  likedBlogs: Set<string>;
  likeBlog: (blogId: string) => Promise<LikeData | null>;
  getLikeStatus: (blogId: string) => Promise<LikeData | null>;
  isLoading: boolean;
}

const LIKED_BLOGS_KEY = 'monde-delice-liked-blogs';

export const useLikes = (): UseLikesReturn => {
  const [likedBlogs, setLikedBlogs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  // Charger les likes depuis localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LIKED_BLOGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLikedBlogs(new Set(parsed));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des likes:', error);
    }
  }, []);

  // Sauvegarder les likes dans localStorage
  const saveLikedBlogs = useCallback((newLikedBlogs: Set<string>) => {
    try {
      localStorage.setItem(LIKED_BLOGS_KEY, JSON.stringify([...newLikedBlogs]));
      setLikedBlogs(newLikedBlogs);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des likes:', error);
    }
  }, []);

  // Fonction pour liker/unliker un blog
  const likeBlog = useCallback(async (blogId: string): Promise<LikeData | null> => {
    if (isLoading) return null;

    setIsLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${backendUrl}/blogs/${blogId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '127.0.0.1',
          'x-real-ip': '127.0.0.1',
        },
        body: JSON.stringify({ blogId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Si c'est une erreur 400 (déjà liké), afficher un toast d'info
        if (response.status === 400) {
          error(errorData.message || 'Vous avez déjà liké ce blog');
          return null;
        }
        
        // Pour les autres erreurs, afficher un toast d'erreur
        error(errorData.message || 'Erreur lors du like');
        
        // Fallback: gérer le like localement si le backend n'est pas disponible
        console.warn('Backend non disponible, utilisation du mode local');
        const newLikedBlogs = new Set(likedBlogs);
        const isCurrentlyLiked = newLikedBlogs.has(blogId);
        
        if (isCurrentlyLiked) {
          newLikedBlogs.delete(blogId);
        } else {
          newLikedBlogs.add(blogId);
        }
        
        saveLikedBlogs(newLikedBlogs);
        return {
          liked: !isCurrentlyLiked,
          totalLikes: 0 // On ne peut pas compter sans backend
        };
      }

      const data = await response.json();
      
      if (data.success) {
        const newLikedBlogs = new Set(likedBlogs);
        
        if (data.data.liked) {
          newLikedBlogs.add(blogId);
          success('Like ajouté avec succès ! ❤️');
        } else {
          newLikedBlogs.delete(blogId);
          success('Like supprimé');
        }
        
        saveLikedBlogs(newLikedBlogs);
        return data.data;
      }
      
      return null;
    } catch (err) {
      console.error('Erreur lors du like:', err);
      
      // Afficher un toast d'erreur
      error('Erreur de connexion. Mode local activé.');
      
      // Fallback: gérer le like localement si le backend n'est pas disponible
      console.warn('Erreur de connexion, utilisation du mode local');
      const newLikedBlogs = new Set(likedBlogs);
      const isCurrentlyLiked = newLikedBlogs.has(blogId);
      
      if (isCurrentlyLiked) {
        newLikedBlogs.delete(blogId);
        success('Like supprimé (mode local)');
      } else {
        newLikedBlogs.add(blogId);
        success('Like ajouté (mode local) ❤️');
      }
      
      saveLikedBlogs(newLikedBlogs);
      return {
        liked: !isCurrentlyLiked,
        totalLikes: 0 // On ne peut pas compter sans backend
      };
    } finally {
      setIsLoading(false);
    }
  }, [likedBlogs, isLoading, saveLikedBlogs]);

  // Fonction pour récupérer le statut de like
  const getLikeStatus = useCallback(async (blogId: string): Promise<LikeData | null> => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${backendUrl}/blogs/${blogId}/like-status`);
      
      if (!response.ok) {
        console.warn('API de statut des likes non disponible, utilisation du mode local');
        // Retourner le statut local au lieu de lever une erreur
        return {
          liked: likedBlogs.has(blogId),
          totalLikes: 0 // On ne peut pas compter sans backend
        };
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      }
      
      return null;
    } catch (err) {
      console.warn('Erreur lors de la récupération du statut, utilisation du mode local:', err);
      // Retourner le statut local au lieu de null
      return {
        liked: likedBlogs.has(blogId),
        totalLikes: 0 // On ne peut pas compter sans backend
      };
    }
  }, [likedBlogs]);

  return {
    likedBlogs,
    likeBlog,
    getLikeStatus,
    isLoading
  };
};
