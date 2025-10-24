import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { verifyAdminToken } from '@/lib/auth';
import { z } from 'zod';

// Schéma de validation pour la création de produit
const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().min(0),
  description: z.string().min(1).max(1000),
  images: z.array(z.string().url()).min(1),
  categories: z.array(z.string()).min(1)
});

// Schéma de validation pour la mise à jour de produit
// const updateProductSchema = z.object({
//   name: z.string().min(2).max(100).optional(),
//   price: z.number().min(0).max(10000).optional(),
//   description: z.string().min(10).max(1000).optional(),
//   images: z.array(z.string().url()).optional(),
//   categories: z.array(z.string()).optional()
// });

// GET /api/products - Récupérer tous les produits
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    // const featured = searchParams.get('featured') === 'true';

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categories: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.categories = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    });

  } catch (error) {
    console.error('Erreur GET /api/products:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST /api/products - Créer un nouveau produit
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
    const validatedData = createProductSchema.parse(body);

    const product = new Product(validatedData);
    await product.save();

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Produit créé avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur POST /api/products:', error);
    
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(issue => {
        const field = issue.path.join('.');
        return `${field}: ${issue.message}`;
      });
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Données invalides', 
          errors: errorMessages 
        },
        { status: 400 }
      );
    }

    // Gestion des erreurs Mongoose
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const mongooseError = error as unknown as { errors: Record<string, { message: string }> };
      const errorMessages = Object.values(mongooseError.errors).map((err) => err.message);
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Erreur de validation', 
          errors: errorMessages 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erreur serveur' 
      },
      { status: 500 }
    );
  }
}
