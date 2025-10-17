'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cake, Mail, MessageCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const pathname = usePathname();
  const contactLinks = [
    {
      name: 'WhatsApp',
      href: 'https://wa.me/682601458?text=Bonjour%20!%20Je%20souhaite%20obtenir%20plus%20d%27informations%20sur%20vos%20services.',
      icon: MessageCircle,
      color: 'text-green-600 hover:text-green-700'
    },
    {
      name: 'Email',
      href: 'mailto:clynlouisin@gmail.com?subject=Demande%20d%27information&body=Bonjour%20!%20Je%20souhaite%20obtenir%20plus%20d%27informations%20sur%20vos%20services.',
      icon: Mail,
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      name: 'Telegram',
      href: 'https://t.me/Charles_Louisin?text=Bonjour%20!%20Je%20souhaite%20obtenir%20plus%20d%27informations%20sur%20vos%20services.',
      icon: Send,
      color: 'text-blue-500 hover:text-blue-600'
    }
  ];

  const quickLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/services', label: 'Services' },
    { href: '/blogs', label: 'Réalisations' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2"
            >
              <div className="p-2 bg-violet-500 rounded-lg">
                <Cake className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Monde Délice</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 leading-relaxed"
            >
              Créations artisanales de gâteaux et services d&apos;événements pour vos moments spéciaux.
            </motion.p>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg font-semibold"
            >
              Navigation
            </motion.h3>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              {quickLinks.map((link) => {
                const isActive = pathname === link.href || 
                  (link.href === '/blogs' && pathname.startsWith('/blogs/'));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`transition-colors ${
                        isActive
                          ? 'text-violet-400 font-semibold'
                          : 'text-gray-300 hover:text-violet-400'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </motion.ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg font-semibold"
            >
              Contact
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              {contactLinks.map((contact) => (
                <a
                  key={contact.name}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-2 ${contact.color} transition-colors group`}
                >
                  <contact.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{contact.name}</span>
                </a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
        >
          <p>&copy; 2024 Monde Délice. Tous droits réservés.</p>
        </motion.div>
      </div>
    </footer>
  );
}
