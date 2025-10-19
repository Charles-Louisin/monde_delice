import { NextRequest, NextResponse } from 'next/server';

// POST /api/test-upload - Test d'upload sans MongoDB
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Test upload démarré');
    
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    console.log('📁 Fichier reçu:', file.name, file.size, file.type);

    return NextResponse.json({
      success: true,
      message: 'Test upload réussi',
      data: {
        filename: file.name,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('❌ Erreur test upload:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur test upload' },
      { status: 500 }
    );
  }
}
