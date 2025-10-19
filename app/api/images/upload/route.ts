import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Image from '@/lib/models/Image';
import { verifyAdminToken } from '@/lib/auth';

// POST /api/images/upload - Upload d'image via UploadThing
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyAdminToken(token);
    if (!payload || !payload.admin) {
      return NextResponse.json(
        { success: false, message: 'Token invalide' },
        { status: 401 }
      );
    }

    await connectDB();

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Type de fichier non autorisé' },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 4MB pour UploadThing)
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'Fichier trop volumineux (max 4MB)' },
        { status: 400 }
      );
    }

    // Upload via UploadThing - Utiliser l'API UploadThing directement
    const uploadFormData = new FormData();
    uploadFormData.append('files', file);
    
    // Construire l'URL complète pour UploadThing
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    const uploadUrl = baseUrl.startsWith('http') 
      ? `${baseUrl}/uploadthing` 
      : `https://monde-delice-7nj9.vercel.app${baseUrl}/uploadthing`;
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: uploadFormData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Erreur UploadThing:', errorText);
      throw new Error('Erreur lors de l\'upload UploadThing');
    }

    const uploadResult = await uploadResponse.json();
    const uploadedFile = uploadResult[0];

    // Sauvegarder les métadonnées en base
    const imageDoc = new Image({
      filename: uploadedFile.name,
      originalName: file.name,
      url: uploadedFile.url,
      size: file.size,
      mimetype: file.type,
      uploadedBy: 'admin'
    });

    await imageDoc.save();

    return NextResponse.json({
      success: true,
      data: {
        url: uploadedFile.url,
        filename: uploadedFile.name,
        originalName: file.name,
        size: file.size,
        mimetype: file.type
      },
      message: 'Image uploadée avec succès'
    });

  } catch (error) {
    console.error('Erreur POST /api/images/upload:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
