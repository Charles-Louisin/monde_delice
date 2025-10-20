"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  fill = false, 
  width, 
  height, 
  className = "", 
  priority = false,
  sizes 
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxRetries = 5;
  const retryDelays = [1000, 2000, 5000, 10000, 30000]; // Délais progressifs

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback vers une image placeholder
      setImageSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBjaGFyZ2VlPC90ZXh0Pjwvc3ZnPg==');
      
      // Démarrer le retry en background
      startRetry();
    }
  };

  const startRetry = () => {
    if (retryCountRef.current >= maxRetries || isRetrying) {
      return;
    }

    setIsRetrying(true);
    const delay = retryDelays[Math.min(retryCountRef.current, retryDelays.length - 1)];
    
    retryTimeoutRef.current = setTimeout(() => {
      retryCountRef.current++;
      console.log(`🔄 Retry ${retryCountRef.current}/${maxRetries} pour l'image:`, src);
      
      // Essayer de recharger l'image originale
      setImageSrc(src);
      setIsRetrying(false);
    }, delay);
  };

  const handleLoad = () => {
    if (hasError) {
      console.log(`✅ Image chargée avec succès après ${retryCountRef.current} tentatives:`, src);
    }
    setHasError(false);
    setIsRetrying(false);
    retryCountRef.current = 0;
    
    // Annuler le retry en cours
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  };

  // Nettoyer les timeouts au démontage
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={handleError}
      onLoad={handleLoad}
      // Configuration pour les images externes
      unoptimized={src.includes('utfs.io') || src.includes('uploadthing.com')}
    />
  );
}
