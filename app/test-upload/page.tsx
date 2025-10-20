"use client";

import ImageUpload from "@/components/ImageUpload";
import { useState } from "react";

export default function TestUploadPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleUploadComplete = (url: string) => {
    setUploadedImages(prev => [...prev, url]);
    console.log("🖼️ Nouvelle image uploadée:", url);
  };

  const handleUploadError = (error: Error) => {
    console.error("❌ Erreur d'upload:", error);
    alert("Erreur d'upload: " + error.message);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Test d&apos;Upload d&apos;Images
          </h1>
          
          <ImageUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            className="mb-8"
          />

          {uploadedImages.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Images uploadées ({uploadedImages.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <img
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="text-xs text-gray-600 break-all">
                      {url}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
