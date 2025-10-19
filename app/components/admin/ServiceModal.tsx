'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Product } from '../../lib/api';
import ImageUpload from '../ImageUpload';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  service?: Product | null;
  title: string;
}

export default function ServiceModal({ isOpen, onClose, onSave, service, title }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    categories: [] as string[],
    images: [] as string[],
  });
  const [categoryInput, setCategoryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        price: service.price,
        description: service.description,
        categories: service.categories,
        images: service.images,
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        description: '',
        categories: [],
        images: [],
      });
    }
    setError('');
  }, [service, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.description || formData.price <= 0) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const result = await onSave(formData);
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, categoryInput.trim()]
      }));
      setCategoryInput('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
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
              className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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

                {/* Nom du service */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du service *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
                    placeholder="Ex: Gâteau d'anniversaire personnalisé"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 3 caractères, maximum 100 caractères. Soyez descriptif et attractif.
                  </p>
                </div>

                {/* Prix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (FCFA) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
                    placeholder="Décrivez votre service en détail..."
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 20 caractères, maximum 500 caractères. Décrivez les ingrédients, la taille, les options disponibles.
                  </p>
                </div>

                {/* Catégories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégories
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 text-gray-600"
                      placeholder="Ajouter une catégorie..."
                    />
                    <button
                      type="button"
                      onClick={addCategory}
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Ajoutez des catégories pour organiser vos services (ex: Anniversaire, Mariage, Baptême). Appuyez sur Entrée ou cliquez sur &quot;Ajouter&quot;.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
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
                    maxImages={5}
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
