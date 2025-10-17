'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Send, MapPin, Phone, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';

export default function ContactPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const contactMethods = [
    {
      name: 'WhatsApp',
      description: 'Réponse rapide et directe',
      icon: MessageCircle,
      href: 'https://wa.me/682601458?text=Bonjour%20!%20Je%20souhaite%20obtenir%20plus%20d%27informations%20sur%20vos%20services.',
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white',
      details: '+237 682 60 14 58'
    },
    {
      name: 'Email',
      description: 'Réponse sous 24h',
      icon: Mail,
      href: 'mailto:clynlouisin@gmail.com?subject=Demande%20d%27information&body=Bonjour%20!%20Je%20souhaite%20obtenir%20plus%20d%27informations%20sur%20vos%20services.',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white',
      details: 'clynlouisin@gmail.com'
    },
    {
      name: 'Telegram',
      description: 'Message direct',
      icon: Send,
      href: 'https://t.me/Charles_Louisin?text=Bonjour%20!%20Je%20souhaite%20obtenir%20plus%20d%27informations%20sur%20vos%20services.',
      color: 'bg-blue-400 hover:bg-blue-500',
      textColor: 'text-white',
      details: '@Charles_Louisin'
    }
  ];

  const businessInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      content: 'Douala, Cameroun'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+237 682 60 14 58'
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: 'Lun - Ven: 9h - 18h\nSam: 9h - 16h\nDim: Fermé'
    }
  ];

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
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Nous sommes là pour vous accompagner dans vos projets de gâteaux et d&apos;événements
            </p>
          </motion.div>
        </div>
      </section>

      {/* Méthodes de contact */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choisissez votre méthode de contact
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Plusieurs façons de nous joindre selon vos préférences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.name}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${method.color} ${method.textColor} p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <method.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{method.name}</h3>
                  <p className="text-sm opacity-90 mb-4">{method.description}</p>
                  <p className="text-sm font-semibold">{method.details}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Informations pratiques */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Informations pratiques
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tout ce que vous devez savoir pour nous contacter
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {businessInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
                  <info.icon className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{info.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Les réponses aux questions que vous vous posez peut-être
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Combien de temps à l'avance dois-je commander ?",
                answer: "Nous recommandons de nous contacter au moins 2 semaines à l'avance pour les gâteaux simples et 1 mois pour les créations complexes ou les événements importants."
              },
              {
                question: "Livrez-vous à domicile ?",
                answer: "Oui, nous proposons un service de livraison dans un rayon de 30km autour de Paris. Des frais de livraison peuvent s'appliquer selon la distance."
              },
              {
                question: "Puis-je personnaliser mon gâteau ?",
                answer: "Absolument ! Nous adorons créer des gâteaux uniques selon vos goûts et vos idées. N'hésitez pas à nous partager vos inspirations."
              },
              {
                question: "Quels sont vos tarifs ?",
                answer: "Nos tarifs varient selon la complexité et la taille du gâteau. Contactez-nous pour un devis personnalisé gratuit."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-violet-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à créer votre gâteau de rêve ?
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
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
}
