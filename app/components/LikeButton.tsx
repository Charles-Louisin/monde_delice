'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useLikes } from '../hooks/useLikes';

interface LikeButtonProps {
  blogId: string;
  initialLikes?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LikeButton({ 
  blogId, 
  initialLikes = 0, 
  className = '',
  size = 'md'
}: LikeButtonProps) {
  const { likedBlogs, likeBlog, getLikeStatus, isLoading } = useLikes();
  const [totalLikes, setTotalLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  // Charger le statut initial
  useEffect(() => {
    const loadInitialStatus = async () => {
      try {
        const status = await getLikeStatus(blogId);
        if (status) {
          setTotalLikes(status.totalLikes);
          setIsLiked(status.liked);
        } else {
          // Fallback sur les données locales
          setIsLiked(likedBlogs.has(blogId));
        }
      } catch (error) {
        // En cas d'erreur, utiliser les données locales
        console.warn('Impossible de charger le statut des likes, utilisation du mode local');
        setIsLiked(likedBlogs.has(blogId));
      }
    };

    loadInitialStatus();
  }, [blogId, getLikeStatus, likedBlogs]);

  const handleLike = async () => {
    if (isLoading) return;

    const result = await likeBlog(blogId);
    if (result) {
      setTotalLikes(result.totalLikes);
      setIsLiked(result.liked);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading}
      className={`group flex items-center space-x-2 px-3 py-2 rounded-full border-2 transition-all duration-200 ${className} ${
        isLoading 
          ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-100' 
          : isLiked
            ? 'border-pink-500 bg-pink-100 hover:bg-pink-200 hover:border-pink-600 shadow-md hover:shadow-lg'
            : 'border-gray-300 bg-white hover:border-pink-400 hover:bg-pink-50 shadow-sm hover:shadow-md'
      }`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        animate={{
          scale: isLiked ? [1, 1.3, 1] : 1,
          color: isLiked ? '#ec4899' : '#6b7280'
        }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Heart 
          className={`${sizeClasses[size]} ${
            isLiked ? 'fill-current text-pink-500' : 'group-hover:fill-pink-200'
          } transition-all duration-200`} 
        />
        {/* Effet de pulsation pour les likes */}
        {isLiked && (
          <motion.div
            className="absolute inset-0 rounded-full bg-pink-400 opacity-30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </motion.div>
      
      <span className={`${textSizeClasses[size]} font-semibold transition-colors duration-200 ${
        isLiked 
          ? 'text-pink-600' 
          : 'text-gray-600 group-hover:text-pink-600'
      }`}>
        {totalLikes}
      </span>
      
    </motion.button>
  );
}
