'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Heart, ArrowLeft, Share2, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ContactModal from '../../components/ContactModal';
import LikeButton from '../../components/LikeButton';
import { blogApi, Blog } from '../../lib/api';
import Image from 'next/image';

export default function BlogDetailPage() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<{
    type: 'blog';
    name: string;
    description: string;
    slug: string;
    image?: string;
  } | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!params.slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer tous les blogs et trouver celui avec le bon slug
        const response = await blogApi.getAll(); // Récupérer tous les blogs
        if (response.success && response.data) {
          const foundBlog = response.data.find(b => b.slug === params.slug);
          if (foundBlog) {
            setBlog(foundBlog);
          } else {
            setError('Article non trouvé');
          }
        } else {
          setError('Erreur lors du chargement de l\'article');
        }
      } catch (err) {
        setError('Erreur lors du chargement de l\'article');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erreur lors du partage:', err);
      }
    } else {
      // Fallback: copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
            <p className="text-gray-600 mb-8">{error || 'L\'article que vous cherchez n\'existe pas.'}</p>
            <Link
              href="/blogs"
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux réalisations
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Navigation */}
      <div className="pt-24 pb-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux réalisations
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-violet-100 text-violet-600 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {tag}
                  </span>
                ))}
                {blog.featured && (
                  <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    En vedette
                  </span>
                )}
              </div>
            )}

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(blog.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{blog.meta?.author || 'Monde Délice'}</span>
              </div>
              {blog.meta?.eventDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Événement: {new Date(blog.meta.eventDate).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
              <LikeButton 
                blogId={blog._id} 
                initialLikes={blog.likes}
                size="lg"
              />
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Me contacter
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image principale */}
      {blog.images && blog.images.length > 0 && (
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src={blog.images[0]}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contenu de l'article */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {/* Extrait */}
            <div className="bg-violet-50 border-l-4 border-violet-600 p-6 rounded-r-lg mb-8">
              <p className="text-lg text-gray-700 italic">
                {blog.excerpt}
              </p>
            </div>

            {/* Contenu principal */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Galerie d'images */}
            {blog.images && blog.images.length > 1 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Galerie</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {blog.images.slice(1).map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="relative h-48 rounded-lg overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={image}
                        alt={`${blog.title} - Image ${index + 2}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-violet-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Vous aimez cette réalisation ?
            </h2>
            <p className="text-xl text-violet-100 mb-8">
              Contactez-nous pour créer votre propre gâteau personnalisé
            </p>
            <button
              onClick={() => {
                if (blog) {
                  setSelectedBlog({
                    type: 'blog',
                    name: blog.title,
                    description: blog.excerpt,
                    slug: blog.slug,
                    image: blog.images?.[0]
                  });
                }
                setIsContactModalOpen(true);
              }}
              className="bg-white text-violet-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Commander maintenant
            </button>
          </motion.div>
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