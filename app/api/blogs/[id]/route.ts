import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { verifyAdminToken } from '@/lib/auth';
import { z } from 'zod';

// Schéma de validation pour la mise à jour de blog
const updateBlogSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  slug: z.string().optional(),
  excerpt: z.string().min(20).max(300).optional(),
  content: z.string().min(50).optional(),
  images: z.array(z.string().url()).optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  meta: z.object({
    author: z.string().min(1).max(100).optional(),
    eventDate: z.string().optional()
  }).optional()
});

// GET /api/blogs/[id] - Récupérer un blog par ID
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

    return NextResponse.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Erreur GET /api/blogs/[id]:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Mettre à jour un blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog non trouvé' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateBlogSchema.parse(body);

    // Convertir eventDate en Date si fournie
    if (validatedData.meta?.eventDate) {
      (validatedData.meta as { eventDate: string | Date }).eventDate = new Date(validatedData.meta.eventDate);
    }

    Object.assign(blog, validatedData);
    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
      message: 'Blog mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur PUT /api/blogs/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Données invalides', errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Supprimer un blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur DELETE /api/blogs/[id]:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
