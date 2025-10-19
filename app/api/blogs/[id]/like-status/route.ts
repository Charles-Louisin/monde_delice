import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import Like from '@/lib/models/Like';

// GET /api/blogs/[id]/like-status - Vérifier le statut de like
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer l'IP du client
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';

    // Vérifier si l'utilisateur a déjà liké
    const existingLike = await Like.findOne({
      blogId: id,
      ipAddress: ip
    });

    return NextResponse.json({
      success: true,
      data: {
        hasLiked: !!existingLike,
        totalLikes: blog.likes
      }
    });

  } catch (error) {
    console.error('Erreur GET /api/blogs/[id]/like-status:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
