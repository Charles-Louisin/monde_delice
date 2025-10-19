import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Image from '@/lib/models/Image';

// POST /api/images/save - Sauvegarder une image en base de données
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { url, filename, size, mimetype } = await request.json();

    if (!url || !filename) {
      return NextResponse.json(
        { success: false, message: 'URL et nom de fichier requis' },
        { status: 400 }
      );
    }

    // Créer le document Image
    const imageDoc = new Image({
      filename,
      originalName: filename,
      url,
      size: size || 0,
      mimetype: mimetype || 'image/jpeg',
      uploadedBy: 'client'
    });

    await imageDoc.save();

    return NextResponse.json({
      success: true,
      data: {
        id: imageDoc._id,
        url: imageDoc.url,
        filename: imageDoc.filename
      },
      message: 'Image sauvegardée avec succès'
    });

  } catch (error) {
    console.error('Erreur POST /api/images/save:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
