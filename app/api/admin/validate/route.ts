import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword, generateAdminToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier le mot de passe
    if (!validateAdminPassword(password)) {
      return NextResponse.json(
        { success: false, message: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Générer un token JWT
    const token = generateAdminToken();
    const expiresIn = '24h';

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
