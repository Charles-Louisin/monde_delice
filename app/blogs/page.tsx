'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import LikeButton from '../components/LikeButton';
import { useBlogs } from '../lib/hooks/useAdminData';

export default function BlogsPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<{
    type: 'blog';
    name: string;
    description: string;
    slug: string;
    image?: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  // Récupérer les données du backend
  const { 
    blogs, 
    loading, 
    error
  } = useBlogs(searchTerm, false);

  // Extraire tous les tags uniques
  const allTags = Array.from(
    new Set((blogs || []).flatMap(blog => blog.tags || []))
  ).filter(Boolean);

  const tags = ['Tous', ...allTags];

  // Filtrer et trier les blogs
  const filteredAndSortedBlogs = (blogs || [])
    .filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === '' || selectedTag === 'Tous' || blog.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'most-liked':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-violet-50 via-white to-violet-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Nos Réalisations
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Découvrez nos créations et l&apos;histoire derrière chaque gâteau
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filtres et recherche */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une réalisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
              />
            </div>

            {/* Filtres par tag */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === 'Tous' ? '' : tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    (selectedTag === '' && tag === 'Tous') || selectedTag === tag
                      ? 'bg-violet-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-violet-50 hover:text-violet-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Tri */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
              >
                <option value="newest">Plus récent</option>
                <option value="oldest">Plus ancien</option>
                <option value="most-viewed">Plus vus</option>
                <option value="most-liked">Plus aimés</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des blogs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              {loading ? 'Chargement...' : `${filteredAndSortedBlogs.length} réalisation${filteredAndSortedBlogs.length > 1 ? 's' : ''} trouvée${filteredAndSortedBlogs.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😞</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredAndSortedBlogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedBlogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                  >
                    <Link href={`/blogs/${blog.slug}`}>
                      <div className="relative h-48 bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center">
                        {blog.images && blog.images.length > 0 ? (
                          <Image
                            src={blog.images[0]}
                            alt={blog.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="text-6xl">🎂</div>
                        )}
                        {blog.featured && (
                          <div className="absolute top-4 right-4 bg-violet-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            En vedette
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-semibold">Voir plus</span>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-6">
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="bg-violet-100 text-violet-600 px-2 py-1 rounded-full text-xs font-semibold"
                            >
                              {tag}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">
                              +{blog.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <Link href={`/blogs/${blog.slug}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                        {blog.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(blog.createdAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                        <LikeButton 
                          blogId={blog._id} 
                          initialLikes={blog.likes}
                          size="sm"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Par {blog.meta?.author || 'Monde Délice'}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedBlog({
                              type: 'blog',
                              name: blog.title,
                              description: blog.excerpt,
                              slug: blog.slug,
                              image: blog.images?.[0]
                            });
                            setIsContactModalOpen(true);
                          }}
                          className="text-violet-600 hover:text-violet-700 font-semibold text-sm"
                        >
                          Me contacter
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune réalisation trouvée</h3>
              <p className="text-gray-600">
                {searchTerm || selectedTag 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Nos réalisations seront bientôt disponibles !'
                }
              </p>
              {(searchTerm || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag('');
                  }}
                  className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
      
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => {
          setIsContactModalOpen(false);
          setSelectedBlog(null);
        }}
        productInfo={selectedBlog || undefined}
      />
    </div>
  );
}
