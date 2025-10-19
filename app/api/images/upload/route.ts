import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Image from '@/lib/models/Image';
import { verifyAdminToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// POST /api/images/upload - Upload d'image
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

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'Fichier trop volumineux (max 5MB)' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${fileExtension}`;
    
    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Sauvegarder le fichier
    const filePath = join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Créer l'URL publique
    const url = `/uploads/${filename}`;

    // Sauvegarder les métadonnées en base
    const imageDoc = new Image({
      filename,
      originalName: file.name,
      url,
      size: file.size,
      mimetype: file.type,
      uploadedBy: 'admin'
    });

    await imageDoc.save();

    return NextResponse.json({
      success: true,
      data: {
        url,
        filename,
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
