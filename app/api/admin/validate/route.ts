import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier le mot de passe (dans un vrai projet, vous feriez un appel au backend)
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Simuler la génération d'un token JWT
    const token = 'mock-jwt-token-' + Date.now();
    const expiresIn = '1h';

    return NextResponse.json({
      success: true,
      data: {
        token,
        expiresIn
      },
      message: 'Authentification réussie'
    });

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
