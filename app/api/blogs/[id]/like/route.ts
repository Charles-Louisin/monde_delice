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

    try {
      // Créer le like
      const like = new Like({
        blogId: id,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || undefined
      });

      await like.save();
    } catch (duplicateError: any) {
      // Gérer l'erreur de clé dupliquée
      if (duplicateError.code === 11000) {
        return NextResponse.json(
          { success: false, message: 'Vous avez déjà liké ce blog' },
          { status: 400 }
        );
      }
      throw duplicateError;
    }

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

// DELETE /api/blogs/[id]/like - Supprimer un like
export async function DELETE(
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

    // Supprimer le like
    const deletedLike = await Like.findOneAndDelete({
      blogId: id,
      ipAddress: ip
    });

    if (!deletedLike) {
      return NextResponse.json(
        { success: false, message: 'Like non trouvé' },
        { status: 404 }
      );
    }

    // Décrémenter le compteur de likes
    blog.likes = Math.max(0, blog.likes - 1);
    await blog.save();

    return NextResponse.json({
      success: true,
      data: { likes: blog.likes },
      message: 'Like supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur DELETE /api/blogs/[id]/like:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
