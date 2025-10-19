'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { Blog } from '../../lib/api';
import ImageUpload from '../ImageUpload';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blogData: Omit<Blog, '_id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  blog?: Blog | null;
  title: string;
}

export default function BlogModal({ isOpen, onClose, onSave, blog, title }: BlogModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    images: [] as string[],
    featured: false,
    tags: [] as string[],
    meta: {
      author: '',
      eventDate: '',
    },
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        images: blog.images,
        featured: blog.featured,
        tags: blog.tags,
        meta: {
          author: blog.meta.author,
          eventDate: blog.meta.eventDate ? new Date(blog.meta.eventDate).toISOString().split('T')[0] : '',
        },
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        images: [],
        featured: false,
        tags: [],
        meta: {
          author: '',
          eventDate: '',
        },
      });
    }
    setError('');
  }, [blog, isOpen]);

  // Générer le slug automatiquement à partir du titre
  useEffect(() => {
    if (formData.title && !blog) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, blog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.title || !formData.excerpt || !formData.content || !formData.meta.author) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }

      // S'assurer que le slug est généré
      let finalSlug = formData.slug;
      if (!finalSlug && formData.title) {
        finalSlug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }

      const result = await onSave({
        ...formData,
        slug: finalSlug,
        likes: 0, // Initialiser les likes à 0
        meta: {
          ...formData.meta,
          eventDate: formData.meta.eventDate && formData.meta.eventDate.trim() !== '' 
            ? new Date(formData.meta.eventDate).toISOString() 
            : undefined,
        },
      });
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Titre */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
                      placeholder="Ex: Mariage de Sophie & Marc"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Minimum 5 caractères, maximum 100 caractères.
                    </p>
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
                      placeholder="mariage-sophie-marc"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Généré automatiquement.
                    </p>
                  </div>

                  {/* Auteur */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auteur *
                    </label>
                    <input
                      type="text"
                      value={formData.meta.author}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        meta: { ...prev.meta, author: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
                      placeholder="Votre nom"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Nom de l&apos;auteur de cette réalisation (ex: Chef Marie, Monde Délice).
                    </p>
                  </div>

                  {/* Date de l'événement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de l&apos;événement
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        value={formData.meta.eventDate}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          meta: { ...prev.meta, eventDate: e.target.value }
                        }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Date de l&apos;événement à laquelle cette réalisation a été créée.
                    </p>
                  </div>

                  {/* En vedette */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                      Mettre en vedette
                    </label>
                  </div>
                </div>

                {/* Extrait */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extrait *
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
                    placeholder="Courte description qui apparaîtra dans la liste..."
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Résumé court (Minimum 50- Maximum 200 caractères).
                  </p>
                </div>

                {/* Contenu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
                    placeholder="Décrivez en détail cette réalisation..."
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Description détaillée (minimum 100 caractères). Racontez l&apos;histoire, les défis, les techniques utilisées.
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
                      placeholder="Ajouter un tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Ajoutez des mots-clés pour faciliter la recherche (ex: Mariage, Chocolat, 3 étages). Appuyez sur Entrée ou cliquez sur &quot;Ajouter&quot;.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-violet-600 hover:text-violet-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                    maxImages={10}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                  >
                    {isLoading && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
