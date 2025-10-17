'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Sparkles, Heart } from 'lucide-react';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import LikeButton from './components/LikeButton';
import { useFeaturedServices, useFeaturedBlogs } from './lib/hooks/useHomeData';
import Image from 'next/image';

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    type: 'service';
    name: string;
    description: string;
    price: string;
    image?: string;
  } | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<{
    type: 'blog';
    name: string;
    description: string;
    slug: string;
    image?: string;
  } | null>(null);

  // Récupérer les données réelles
  const { services, loading: servicesLoading } = useFeaturedServices();
  const { blogs: featuredBlogs, loading: blogsLoading } = useFeaturedBlogs();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-violet-100" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            >
              Monde{' '}
              <span className="text-violet-600">Délice</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
            >
              Créations artisanales de gâteaux et services d&apos;événements
              <br />
              pour vos moments les plus précieux
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center group"
              >
                Me contacter
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <Link 
                href="/blogs"
                className="border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center group"
              >
                Voir nos créations
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <Sparkles className="w-8 h-8 text-violet-400 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-1000">
          <Heart className="w-6 h-6 text-pink-400 opacity-60" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-2000">
          <Star className="w-7 h-7 text-yellow-400 opacity-60" />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nos Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des créations sur mesure pour chaque occasion spéciale
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesLoading ? (
              // Skeleton loading
              Array.from({ length: 3 }).map((_, index) => (
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
              ))
            ) : (services || []).length > 0 ? (
              (services || []).map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="relative h-48 bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center">
                    {service.images && service.images.length > 0 ? (
                      <Image
                        src={service.images[0]}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-6xl">🎂</div>
                    )}
                    {service.categories && service.categories.includes('Populaire') && (
                      <div className="absolute top-4 right-4 bg-violet-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Populaire
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {service.description}
                    </p>
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
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🎂</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun service disponible</h3>
                <p className="text-gray-600">Nos services seront bientôt disponibles !</p>
              </div>
            )}
          </div>

          {/* Bouton Voir tout - Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              href="/services"
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl inline-block"
            >
              Voir tous nos services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nos Réalisations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos dernières créations et témoignages clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogsLoading ? (
              // Skeleton loading
              Array.from({ length: 3 }).map((_, index) => (
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
              ))
            ) : (featuredBlogs || []).length > 0 ? (
              (featuredBlogs || []).map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <Link href={`/blogs/${blog.slug}`} className="block">
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
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-semibold">Voir plus</span>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <Link href={`/blogs/${blog.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(blog.createdAt).toLocaleDateString('fr-FR')}</span>
                      <div className="flex items-center space-x-3">
                        <LikeButton 
                          blogId={blog._id} 
                          initialLikes={blog.likes}
                          size="sm"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedBlog({
                              type: 'blog',
                              name: blog.title,
                              description: blog.excerpt,
                              slug: blog.slug,
                              image: blog.images?.[0]
                            });
                            setIsContactModalOpen(true);
                          }}
                          className="text-violet-600 hover:text-violet-700 font-semibold"
                        >
                          Me contacter
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🎂</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune réalisation disponible</h3>
                <p className="text-gray-600">Nos réalisations seront bientôt disponibles !</p>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              href="/blogs"
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl inline-block"
            >
              Voir toutes nos réalisations
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-violet-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à créer des moments magiques ?
            </h2>
            <p className="text-xl text-violet-100 mb-8">
              Contactez-nous dès maintenant pour discuter de votre projet
            </p>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="bg-white text-violet-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Commencer mon projet
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
      
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => {
          setIsContactModalOpen(false);
          setSelectedService(null);
          setSelectedBlog(null);
        }}
        productInfo={selectedService || selectedBlog || undefined}
      />
    </div>
  );
}
