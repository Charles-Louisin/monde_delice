import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { verifyAdminToken } from '@/lib/auth';
import { z } from 'zod';

// Schéma de validation pour la création de blog
const createBlogSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().optional(),
  excerpt: z.string().min(20).max(300),
  content: z.string().min(50),
  images: z.array(z.string().url()).min(1),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).min(1),
  meta: z.object({
    author: z.string().min(1).max(100),
    eventDate: z.string().optional()
  })
});

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

// GET /api/blogs - Récupérer tous les blogs
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const featured = searchParams.get('featured') === 'true';
    const tag = searchParams.get('tag') || '';

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (featured) {
      query.featured = true;
    }

    if (tag) {
      query.tags = tag;
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: blogs,
      count: blogs.length
    });

  } catch (error) {
    console.error('Erreur GET /api/blogs:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Créer un nouveau blog
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

    const body = await request.json();
    const validatedData = createBlogSchema.parse(body);

    // Convertir eventDate en Date si fournie
    if (validatedData.meta.eventDate) {
      (validatedData.meta as { eventDate: string | Date }).eventDate = new Date(validatedData.meta.eventDate);
    }

    const blog = new Blog(validatedData);
    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
      message: 'Blog créé avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur POST /api/blogs:', error);
    
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
