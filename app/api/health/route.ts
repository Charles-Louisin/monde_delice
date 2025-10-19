import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

// GET /api/health - Vérifier la santé de l'API
export async function GET() {
  try {
    // Tenter de se connecter à la base de données
    await connectDB();

    return NextResponse.json({
      success: true,
      message: 'API Monde Délice est en ligne',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected'
    });

  } catch (error) {
    console.error('Erreur de santé API:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'API Monde Délice - Problème de connexion',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
