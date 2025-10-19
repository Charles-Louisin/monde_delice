import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Blog from '@/lib/models/Blog';
import Image from '@/lib/models/Image';
import { verifyAdminToken } from '@/lib/auth';

// GET /api/admin/stats - Récupérer les statistiques admin
export async function GET(request: NextRequest) {
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

    // Récupérer les statistiques
    const [
      totalProducts,
      totalBlogs,
      totalImages,
      featuredBlogs
    ] = await Promise.all([
      Product.countDocuments(),
      Blog.countDocuments(),
      Image.countDocuments(),
      Blog.countDocuments({ featured: true })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalBlogs,
        totalImages,
        featuredBlogs
      }
    });

  } catch (error) {
    console.error('Erreur GET /api/admin/stats:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
