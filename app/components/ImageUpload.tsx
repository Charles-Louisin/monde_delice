"use client";

import { UploadButton } from "@uploadthing/react";
import { ourFileRouter } from "@/lib/uploadthing";
import { useState } from "react";

type ImageUploadProps = {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  disabled?: boolean;
};

export default function ImageUpload({ 
  onUploadComplete, 
  onUploadError, 
  className = "",
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleUploadComplete = (res: any) => {
    setIsUploading(false);
    
    if (res && res[0]) {
      const url = res[0].url;
      setUploadedUrl(url);
      console.log("✅ Image uploadée avec succès:", url);
      
      // Appeler le callback si fourni
      if (onUploadComplete) {
        onUploadComplete(url);
      }
      
      // Optionnel : sauvegarder en base via API
      saveImageToDatabase(url, res[0]);
    }
  };

  const handleUploadError = (error: Error) => {
    setIsUploading(false);
    console.error("❌ Erreur d'upload:", error);
    
    if (onUploadError) {
      onUploadError(error);
    }
  };

  const handleUploadBegin = () => {
    setIsUploading(true);
    setUploadedUrl(null);
  };

  // Fonction pour sauvegarder l'image en base de données
  const saveImageToDatabase = async (url: string, fileData: any) => {
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
        <UploadButton
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

      {uploadedUrl && (
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
    </div>
  );
}
