"use client";

import { UploadButton } from "@uploadthing/react";
import { ourFileRouter, type OurFileRouter } from "@/lib/uploadthing";
import { useState } from "react";
import OptimizedImage from "./OptimizedImage";

type ImageUploadProps = {
  images?: string[];
  onImagesChange?: (images: string[]) => void;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  maxImages?: number;
  className?: string;
  disabled?: boolean;
};

export default function ImageUpload({ 
  images = [],
  onImagesChange,
  onUploadComplete, 
  onUploadError, 
  maxImages = 10,
  className = "",
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUploadComplete = (res: { url: string; name: string; size: number; type: string }[] | undefined) => {
    setIsUploading(false);
    
    if (res && res[0]) {
      const url = res[0].url;
      setUploadedUrl(url);
      console.log("✅ Image uploadée avec succès:", url);
      
      // Si onImagesChange est fourni (mode modale), l'utiliser
      if (onImagesChange) {
        if (images.length >= maxImages) {
          setError(`Maximum ${maxImages} images autorisées`);
          return;
        }
        const newImages = [...images, url];
        onImagesChange(newImages);
        setSuccess("Image uploadée avec succès !");
        setError("");
      }
      
      // Si onUploadComplete est fourni (mode standalone), l'utiliser
      if (onUploadComplete) {
        onUploadComplete(url);
      }
      
      // Optionnel : sauvegarder en base via API
      saveImageToDatabase(url, res[0]);
    }
  };

  const handleUploadError = (error: Error) => {
    setIsUploading(false);
    setError("Erreur d'upload: " + error.message);
    setSuccess("");
    console.error("❌ Erreur d'upload:", error);
    
    if (onUploadError) {
      onUploadError(error);
    }
  };

  const handleUploadBegin = () => {
    setIsUploading(true);
    setUploadedUrl(null);
    setError("");
    setSuccess("");
  };

  const removeImage = (index: number) => {
    if (onImagesChange) {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    }
  };

  // Fonction pour sauvegarder l'image en base de données
  const saveImageToDatabase = async (url: string, fileData: { name: string; size: number; type: string }) => {
    try {
      const response = await fetch('/api/images/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          filename: fileData.name,
          size: fileData.size,
          mimetype: fileData.type,
        }),
      });

      if (response.ok) {
        console.log("✅ Image sauvegardée en base de données");
      } else {
        console.warn("⚠️ Erreur lors de la sauvegarde en base");
      }
    } catch (error) {
      console.warn("⚠️ Erreur lors de la sauvegarde en base:", error);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Uploader une image
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Formats acceptés : JPEG, PNG, WEBP, GIF (max 10MB)
        </p>
      </div>

      <div className="relative">
        <UploadButton<OurFileRouter, "imageUploader">
          endpoint="imageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          onUploadBegin={handleUploadBegin}
          disabled={disabled}
          appearance={{
            button: `
              bg-blue-600 hover:bg-blue-700 
              text-white font-medium py-2 px-4 
              rounded-lg transition-colors duration-200
              disabled:bg-gray-400 disabled:cursor-not-allowed
              ${isUploading ? 'opacity-50' : ''}
            `,
            allowedContent: "text-xs text-gray-500 mt-2",
          }}
        />
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Upload en cours...</span>
            </div>
          </div>
        )}
      </div>

      {/* Messages d'état */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-red-700 font-medium">
              {error}
            </span>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700 font-medium">
              {success}
            </span>
          </div>
        </div>
      )}

      {uploadedUrl && !onImagesChange && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700 font-medium">
              Image uploadée avec succès !
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1 break-all">
            URL: {uploadedUrl}
          </p>
        </div>
      )}

      {/* Aperçu des images existantes (mode modale) */}
      {onImagesChange && images.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Images sélectionnées ({images.length}/{maxImages})
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                  <OptimizedImage
                    src={image}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
