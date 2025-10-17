'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle, Mail, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductInfo {
  type: 'service' | 'blog';
  name: string;
  description: string;
  price?: string;
  image?: string;
  slug?: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  productInfo?: ProductInfo;
}

export default function ContactModal({ isOpen, onClose, productInfo }: ContactModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const generateMessage = () => {
    if (!productInfo) {
      return "Bonjour ! Je souhaite obtenir plus d'informations sur vos services.";
    }

    const { type, name, description, price, slug } = productInfo;
    const productType = type === 'service' ? 'service' : 'réalisation';
    
    let message = `Bonjour ! Je suis intéressé(e) par votre ${productType} :\n\n`;
    message += `📋 *${name}*\n`;
    message += `📝 _${description}_ \n`;
    
    if (price) {
      message += `💰 Prix : ${price}\n`;
    }
    
    if (slug) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const productUrl = type === 'service' 
        ? `${baseUrl}/services` 
        : `${baseUrl}/blogs/${slug}`;
      message += `🔗 Voir le ${productType} : ${productUrl}\n`;
    }
    
    message += `\nPouvez-vous me donner plus d'informations ?`;
    
    return message;
  };

  const contactOptions = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/682601458?text=${encodeURIComponent(generateMessage())}`,
      icon: MessageCircle,
      description: 'Réponse rapide',
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    },
    {
      name: 'Email',
      href: `mailto:clynlouisin@gmail.com?subject=${encodeURIComponent(productInfo ? `Demande d'information - ${productInfo.name}` : 'Demande d\'information')}&body=${encodeURIComponent(generateMessage())}`,
      icon: Mail,
      description: 'Réponse sous 24h',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
    {
      name: 'Telegram',
      href: `https://t.me/Charles_Louisin?text=${encodeURIComponent(generateMessage())}`,
      icon: Send,
      description: 'Message direct',
      color: 'bg-blue-400 hover:bg-blue-500',
      textColor: 'text-white'
    }
  ];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Comment nous contacter ?
              </h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                {productInfo 
                  ? `Contactez-nous pour plus d'informations sur "${productInfo.name}"`
                  : 'Choisissez votre méthode de contact préférée'
                }
              </p>

              <div className="space-y-3">
                {contactOptions.map((option, index) => (
                  <motion.a
                    key={option.name}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center p-4 rounded-xl ${option.color} ${option.textColor} transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
                    onClick={handleClose}
                  >
                    <div className="flex-shrink-0 mr-4">
                      <option.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{option.name}</h3>
                      <p className="text-sm opacity-90">{option.description}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
