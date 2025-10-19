'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Image, 
  FileText, 
  LogOut, 
  Plus,
  Edit,
  Trash2,
  Star,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdminStats, useProducts, useBlogs } from '../../lib/hooks/useAdminData';
import ServiceModal from '../../components/admin/ServiceModal';
import BlogModal from '../../components/admin/BlogModal';
import { Product, Blog } from '../../lib/api';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingService, setEditingService] = useState<Product | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const router = useRouter();

  // Hooks pour les données
  const { stats, loading: statsLoading } = useAdminStats();
  const { 
    products, 
    loading: productsLoading, 
    createProduct,
    updateProduct,
    deleteProduct 
  } = useProducts(searchTerm);
  const { 
    blogs, 
    loading: blogsLoading, 
    createBlog,
    updateBlog,
    deleteBlog 
  } = useBlogs(searchTerm);

  // Vérifier l'authentification
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const expiry = localStorage.getItem('adminTokenExpiry');
      
      if (!token || !expiry || new Date(expiry) <= new Date()) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiry');
        router.push('/admin');
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    router.push('/admin');
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      const result = await deleteProduct(id);
      if (!result.success) {
        alert('Erreur lors de la suppression: ' + result.error);
      }
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réalisation ?')) {
      const result = await deleteBlog(id);
      if (!result.success) {
        alert('Erreur lors de la suppression: ' + result.error);
      }
    }
  };

  const handleCreateService = () => {
    setEditingService(null);
    setShowServiceModal(true);
  };

  const handleEditService = (service: Product) => {
    setEditingService(service);
    setShowServiceModal(true);
  };

  const handleSaveService = async (serviceData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (editingService) {
      return await updateProduct(editingService._id, serviceData);
    } else {
      return await createProduct(serviceData);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Erreur lors de la suppression du service:', error);
      }
    }
  };

  const handleCreateBlog = () => {
    setEditingBlog(null);
    setShowBlogModal(true);
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setShowBlogModal(true);
  };

  const handleSaveBlog = async (blogData: Omit<Blog, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (editingBlog) {
      return await updateBlog(editingBlog._id, blogData);
    } else {
      return await createBlog(blogData);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Bouton menu mobile */}
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-violet-600 transition-colors"
              >
                {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Administration</h1>
              <span className="hidden sm:inline-block bg-violet-100 text-violet-600 px-3 py-1 rounded-full text-sm font-semibold">
                Monde Délice
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row relative">
        {/* Overlay mobile */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-64 bg-white shadow-lg lg:shadow-sm
          transform transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2 h-full">
            <div className="flex flex-col gap-2">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'products', label: 'Services', icon: FileText },
              { id: 'blogs', label: 'Réalisations', icon: Image }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm lg:text-base">{item.label}</span>
              </button>
            ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Vue d&apos;ensemble</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[
                  { 
                    label: 'Services', 
                    value: statsLoading ? '...' : (stats?.totalProducts || 0), 
                    icon: FileText, 
                    color: 'bg-blue-500' 
                  },
                  { 
                    label: 'Réalisations', 
                    value: statsLoading ? '...' : (stats?.totalBlogs || 0), 
                    icon: Image, 
                    color: 'bg-green-500' 
                  },
                  { 
                    label: 'Images', 
                    value: statsLoading ? '...' : (stats?.totalImages || 0), 
                    icon: Image, 
                    color: 'bg-purple-500' 
                  },
                  { 
                    label: 'En vedette', 
                    value: statsLoading ? '...' : (stats?.featuredBlogs || 0), 
                    icon: Star, 
                    color: 'bg-yellow-500' 
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-4 lg:p-6 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm text-gray-600 truncate">{stat.label}</p>
                        <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-2 lg:p-3 rounded-lg ${stat.color} flex-shrink-0`}>
                        <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Services récents</h3>
                    <button 
                      onClick={() => setActiveTab('products')}
                      className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                    >
                      Voir tout
                    </button>
                  </div>
                  <div className="space-y-3">
                    {productsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
                      </div>
                    ) : (products || []).length > 0 ? (
                      (products || []).slice(0, 3).map((product) => (
                        <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              {product.categories.join(', ')} • {product.price} FCFA
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              Actif
                          </span>
                        </div>
                      </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Aucun service trouvé</p>
                    )}
                  </div>
                </div>

                {/* Recent Blogs */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Réalisations récentes</h3>
                    <button 
                      onClick={() => setActiveTab('blogs')}
                      className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                    >
                      Voir tout
                    </button>
                  </div>
                  <div className="space-y-3">
                    {blogsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
                      </div>
                    ) : (blogs || []).length > 0 ? (
                      (blogs || []).slice(0, 3).map((blog) => (
                        <div key={blog._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{blog.title}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(blog.createdAt).toLocaleDateString('fr-FR')} • {blog.likes} likes
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {blog.featured && (
                            <Star className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Aucune réalisation trouvée</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Services</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent w-full sm:w-64 placeholder-gray-400 text-gray-600"
                    />
                  </div>
                  <button 
                    onClick={handleCreateService}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                  <Plus className="w-5 h-5" />
                  <span>Ajouter un service</span>
                </button>
                </div>
              </div>

              {/* Vue mobile - Cartes */}
              <div className="block lg:hidden space-y-4">
                {productsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                  </div>
                ) : (products || []).length > 0 ? (
                  (products || []).map((product) => (
                    <div key={product._id} className="bg-white rounded-xl shadow-sm p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-3">
                          <button
                            onClick={() => handleEditService(product)}
                            className="p-2 text-gray-400 hover:text-violet-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(product._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-violet-600 font-semibold">{product.price} FCFA</span>
                        <span className="text-gray-500">{product.categories.join(', ')}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucun service trouvé</p>
                  </div>
                )}
              </div>

              {/* Vue desktop - Tableau */}
              <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Catégorie
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {productsLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
                              <span className="ml-2 text-gray-600">Chargement...</span>
                            </div>
                          </td>
                        </tr>
                      ) : (products || []).length > 0 ? (
                        (products || []).map((product) => (
                          <tr key={product._id}>
                            <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                              <div className="text-xs text-gray-500 sm:hidden mt-1">
                                {product.categories.join(', ')} • {product.price}€
                              </div>
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                              <div className="text-sm text-gray-500">{product.categories.join(', ')}</div>
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                              <div className="text-sm text-gray-900">{product.price} FCFA</div>
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                Actif
                            </span>
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-1 lg:space-x-2">
                                <button 
                                  onClick={() => handleEditService(product)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                >
                                <Edit className="w-4 h-4" />
                              </button>
                                <button 
                                  onClick={() => handleDeleteProduct(product._id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            Aucun service trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'blogs' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Réalisations</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher une réalisation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent w-full sm:w-64 placeholder-gray-400 text-gray-600"
                    />
                  </div>
                  <button 
                    onClick={handleCreateBlog}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                  <Plus className="w-5 h-5" />
                  <span>Ajouter une réalisation</span>
                </button>
                </div>
              </div>

              {/* Vue mobile - Cartes */}
              <div className="block lg:hidden space-y-4">
                {blogsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                  </div>
                ) : (blogs || []).length > 0 ? (
                  (blogs || []).map((blog) => (
                    <div key={blog._id} className="bg-white rounded-xl shadow-sm p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{blog.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{blog.excerpt}</p>
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                            <span>{new Date(blog.createdAt).toLocaleDateString('fr-FR')}</span>
                            <span>•</span>
                            <span>{blog.likes} likes</span>
                            {blog.featured && (
                              <>
                                <span>•</span>
                                <Star className="w-3 h-3 text-yellow-500 inline" />
                                <span>En vedette</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-3">
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="p-2 text-gray-400 hover:text-violet-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune réalisation trouvée</p>
                  </div>
                )}
              </div>

              {/* Vue desktop - Tableau */}
              <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Titre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Likes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vedette
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {blogsLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
                              <span className="ml-2 text-gray-600">Chargement...</span>
                            </div>
                          </td>
                        </tr>
                      ) : (blogs || []).length > 0 ? (
                        (blogs || []).map((blog) => (
                          <tr key={blog._id}>
                            <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                              <div className="text-xs text-gray-500 truncate max-w-xs">{blog.excerpt}</div>
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString('fr-FR')}</div>
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{blog.likes}</div>
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            {blog.featured ? (
                              <Star className="w-5 h-5 text-yellow-500" />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-1 lg:space-x-2">
                                <button 
                                  onClick={() => handleEditBlog(blog)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                >
                                <Edit className="w-4 h-4" />
                              </button>
                                <button 
                                  onClick={() => handleDeleteBlog(blog._id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            Aucune réalisation trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )} 
        </main>
      </div>

      {/* Modals */}
      <ServiceModal
        isOpen={showServiceModal}
        onClose={() => {
          setShowServiceModal(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
        service={editingService}
        title={editingService ? 'Modifier le service' : 'Nouveau service'}
      />

      <BlogModal
        isOpen={showBlogModal}
        onClose={() => {
          setShowBlogModal(false);
          setEditingBlog(null);
        }}
        onSave={handleSaveBlog}
        blog={editingBlog}
        title={editingBlog ? 'Modifier la réalisation' : 'Nouvelle réalisation'}
      />
    </div>
  );
}
