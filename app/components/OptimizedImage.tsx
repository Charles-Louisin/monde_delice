"use client";

import Image from "next/image";
import { useState } from "react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = () => {
    // Pour les URLs UploadThing, retry automatique
    if (src.includes('utfs.io') || src.includes('uploadthing.com')) {
      if (retryCount < 3) {
        // Retry jusqu'à 3 fois avec délai croissant
        const delay = (retryCount + 1) * 2000; // 2s, 4s, 6s
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setImageSrc(src + '?retry=' + (retryCount + 1)); // Forcer le rechargement
          setIsLoading(true);
          setHasError(false);
        }, delay);
      } else {
        // Après 3 tentatives, afficher l'erreur
        setHasError(true);
        setIsLoading(false);
        setImageSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBjaGFyZ2VlPC90ZXh0Pjwvc3ZnPg==');
      }
    } else {
      // Pour les autres images, erreur immédiate
      setHasError(true);
      setIsLoading(false);
      setImageSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBjaGFyZ2VlPC90ZXh0Pjwvc3ZnPg==');
    }
  };

  const handleLoad = () => {
    setHasError(false);
    setIsLoading(false);
  };

  return (
    <div className="relative">
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
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          {retryCount > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Tentative {retryCount + 1}/3...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
