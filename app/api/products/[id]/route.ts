import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { verifyAdminToken } from '@/lib/auth';
import { z } from 'zod';

// Schéma de validation pour la mise à jour de produit
const updateProductSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  price: z.number().min(0).max(10000).optional(),
  description: z.string().min(10).max(1000).optional(),
  images: z.array(z.string().url()).optional(),
  categories: z.array(z.string()).optional()
});

// GET /api/products/[id] - Récupérer un produit par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Erreur GET /api/products/[id]:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Mettre à jour un produit
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
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    Object.assign(product, validatedData);
    await product.save();

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Produit mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur PUT /api/products/[id]:', error);
    
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

// DELETE /api/products/[id] - Supprimer un produit
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
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur DELETE /api/products/[id]:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
