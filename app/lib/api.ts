const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}


// Types pour les produits/services
export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  categories: string[];
  createdAt: string;
  updatedAt: string;
}

// Types pour les blogs/réalisations
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  images: string[];
  featured: boolean;
  likes: number;
  tags: string[];
  meta: {
    author: string;
    eventDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Types pour les statistiques
export interface AdminStats {
  totalProducts: number;
  totalBlogs: number;
  totalImages: number;
  featuredBlogs: number;
}

// Fonction utilitaire pour les appels API
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('adminToken');
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  
  console.log('🔗 URL API utilisée:', fullUrl);
  console.log('🔗 API_BASE_URL:', API_BASE_URL);
  console.log('🔗 Endpoint:', endpoint);
  
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    console.error('❌ Erreur API:', response.status, response.statusText);
    throw new Error(`Erreur API: ${response.status}`);
  }

  return response.json();
}

// API pour les produits/services
export const productApi = {
  // Récupérer tous les produits sans pagination
  getAll: async (search = '', category = '') => {
    const params = new URLSearchParams({
      ...(search && { search }),
      ...(category && { category }),
    });
    
    return apiCall<Product[]>(`/products?${params}`);
  },

  // Récupérer un produit par ID
  getById: async (id: string) => {
    return apiCall<Product>(`/products/${id}`);
  },

  // Créer un nouveau produit
  create: async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    return apiCall<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Mettre à jour un produit
  update: async (id: string, productData: Partial<Product>) => {
    return apiCall<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Supprimer un produit
  delete: async (id: string) => {
    return apiCall<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// API pour les blogs/réalisations
export const blogApi = {
  // Récupérer tous les blogs sans pagination
  getAll: async (search = '', featured = false) => {
    const params = new URLSearchParams({
      ...(search && { search }),
      ...(featured && { featured: 'true' }),
    });
    
    return apiCall<Blog[]>(`/blogs?${params}`);
  },

  // Récupérer un blog par ID
  getById: async (id: string) => {
    return apiCall<Blog>(`/blogs/${id}`);
  },

  // Créer un nouveau blog
  create: async (blogData: Omit<Blog, '_id' | 'createdAt' | 'updatedAt'>) => {
    return apiCall<Blog>('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  },

  // Mettre à jour un blog
  update: async (id: string, blogData: Partial<Blog>) => {
    return apiCall<Blog>(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
  },

  // Supprimer un blog
  delete: async (id: string) => {
    return apiCall<{ message: string }>(`/blogs/${id}`, {
      method: 'DELETE',
    });
  },
};

// API pour les statistiques admin
export const adminApi = {
  // Récupérer les statistiques
  getStats: async () => {
    return apiCall<AdminStats>('/admin/stats');
  },
};

// API pour l'authentification admin
export const authApi = {
  // Valider le mot de passe admin
  validate: async (password: string) => {
    return apiCall<{ token: string; expiresAt: Date }>('/admin/validate', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },
};

// API pour l'upload d'images
export const imageApi = {
  // Upload d'image
  upload: async (file: File): Promise<{ success: boolean; data?: { url: string; filename: string; originalName: string; size: number; mimetype: string }; message?: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('adminToken');

    console.log('🚀 Upload d\'image:', file.name, file.size, file.type);
    console.log('🔑 Token présent:', !!token);

    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Erreur upload:', result);
      throw new Error(result.message || `Erreur API: ${response.status}`);
    }

    console.log('✅ Upload réussi:', result);
    return result;
  },
};