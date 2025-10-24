'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import { useProducts } from '../lib/hooks/useAdminData';
import OptimizedImage from '@/components/OptimizedImage';

export default function ServicesPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    type: 'service';
    name: string;
    description: string;
    price: string;
    image?: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentServiceImages, setCurrentServiceImages] = useState<string[]>([]);
  const { 
    products: services, 
    loading, 
    error
  } = useProducts(searchTerm, selectedCategory);

  // Extraire toutes les catégories uniques
  const allCategories = Array.from(
    new Set((services || []).flatMap(service => service.categories || []))
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-50 via-white to-violet-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Nos <span className="text-violet-600">Services</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Découvrez notre gamme complète de créations artisanales pour tous vos événements
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
              >
                <option value="">Toutes les catégories</option>
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                  {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
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
          ) : (services || []).length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {(services || []).map((service, index) => (
                <motion.div
                    key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="relative h-48 bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center">
                      {service.images && service.images.length > 0 ? (
                        <div 
                          className="w-full h-full cursor-pointer group" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(service.images[0]);
                            setCurrentImageIndex(0);
                            setCurrentServiceImages(service.images);
                          }}
                        >
                          <OptimizedImage
                            src={service.images[0]}
                            alt={service.name}
                            fill
                            priority={index < 3}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          {service.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                              +{service.images.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-6xl">🎂</div>
                      )}
                      {service.categories && service.categories.includes('Populaire') && (
                        <div className="absolute top-4 right-4 bg-violet-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3" />
                        Populaire
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                      {service.name}
                    </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    
                      {service.categories && service.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {service.categories.slice(0, 2).map((category) => (
                            <span
                              key={category}
                              className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                          {service.categories.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{service.categories.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-violet-600">
                          {service.price} FCFA
                      </span>
                      <button
                        onClick={() => {
                          setSelectedService({
                            type: 'service',
                            name: service.name,
                            description: service.description,
                            price: `${service.price} FCFA`,
                            image: service.images?.[0]
                          });
                          setIsContactModalOpen(true);
                        }}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Commander
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎂</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun service trouvé</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory 
                  ? 'Aucun service ne correspond à vos critères de recherche.'
                  : 'Nos services seront bientôt disponibles !'
                }
              </p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg transition-colors"
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
          setSelectedService(null);
        }}
        productInfo={selectedService || undefined}
      />
      
      {/* Modal plein écran pour les images */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative flex items-center justify-center max-w-4xl max-h-[80vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {currentServiceImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = currentImageIndex === 0 ? currentServiceImages.length - 1 : currentImageIndex - 1;
                    setCurrentImageIndex(newIndex);
                    setSelectedImage(currentServiceImages[newIndex]);
                  }}
                  className="absolute left-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = currentImageIndex === currentServiceImages.length - 1 ? 0 : currentImageIndex + 1;
                    setCurrentImageIndex(newIndex);
                    setSelectedImage(currentServiceImages[newIndex]);
                  }}
                  className="absolute right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm text-white">
                  {currentImageIndex + 1} / {currentServiceImages.length}
                </div>
              </>
            )}
            
            <div className="w-full h-full flex items-center justify-center">
              <OptimizedImage
                src={selectedImage}
                alt="Image en plein écran"
                width={1200}
                height={800}
                className="max-h-full w-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
