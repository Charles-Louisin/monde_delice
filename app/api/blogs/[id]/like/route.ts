import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import Like from '@/lib/models/Like';

// POST /api/blogs/[id]/like - Ajouter un like
export async function POST(
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

    if (existingLike) {
      return NextResponse.json(
        { success: false, message: 'Vous avez déjà liké ce blog' },
        { status: 400 }
      );
    }

    // Créer le like
    const like = new Like({
      blogId: id,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined
    });

    await like.save();

    // Incrémenter le compteur de likes
    blog.likes += 1;
    await blog.save();

    return NextResponse.json({
      success: true,
      data: { likes: blog.likes },
      message: 'Like ajouté avec succès'
    });

  } catch (error) {
    console.error('Erreur POST /api/blogs/[id]/like:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
