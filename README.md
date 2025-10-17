# Monde Délice - Plateforme de Gâteaux et Événements

Une plateforme web complète pour présenter des créations de gâteaux artisanaux et services d'événements, avec une interface d'administration sécurisée.

## 🎯 Fonctionnalités

### Frontend (Next.js + TypeScript)
- **Page d'accueil** avec hero section, services et réalisations
- **Page services** avec recherche et filtres
- **Page blogs/réalisations** avec système de tags et tri
- **Pages de détail** pour chaque service et réalisation
- **Page contact** avec multiples méthodes de contact
- **Interface admin** sécurisée avec authentification par mot de passe
- **Design responsive** avec palette violet personnalisée
- **Animations** subtiles avec Framer Motion

### Backend (Express + TypeScript + MongoDB)
- **API REST** complète pour la gestion des données
- **Authentification admin** sécurisée avec JWT
- **Upload d'images** avec optimisation (Sharp)
- **Modèles MongoDB** pour produits, blogs, images
- **Pagination** et recherche avancée
- **Validation** des données avec Zod

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- MongoDB
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <repository-url>
cd monde-delice
```

### 2. Installer les dépendances frontend
```bash
npm install
```

### 3. Installer les dépendances backend
```bash
cd backend
npm install
```

### 4. Configuration des variables d'environnement

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Backend (.env)
```env
# Base de données
MONGO_URI=mongodb://localhost:27017/monde-delice

# Configuration serveur
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Sécurité admin
ADMIN_PASSWORD=unMotDePasseTrèsFort2024!
ADMIN_SIGN_SECRET=unSecretTrèsSécuriséPourSignerLesJWTs
ADMIN_TOKEN_TTL=3600

# Cloudinary (optionnel)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Analytics (optionnel)
GA_TRACKING_ID=
HOTJAR_ID=
```

### 5. Démarrer les serveurs

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

### 6. Accéder à l'application
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000/api
- **Admin** : http://localhost:3000/admin

## 📁 Structure du Projet

```
monde-delice/
├── app/                          # Frontend Next.js
│   ├── components/               # Composants réutilisables
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ContactModal.tsx
│   ├── services/                 # Page services
│   ├── blogs/                    # Pages blogs/réalisations
│   │   └── [slug]/              # Pages de détail
│   ├── admin/                    # Interface d'administration
│   │   └── dashboard/
│   ├── contact/                  # Page contact
│   └── api/                      # Routes API Next.js
├── backend/                      # Backend Express
│   ├── src/
│   │   ├── controllers/          # Contrôleurs
│   │   ├── models/              # Modèles MongoDB
│   │   ├── routes/              # Routes API
│   │   ├── middleware/          # Middleware
│   │   ├── utils/               # Utilitaires
│   │   └── types/               # Types TypeScript
│   └── uploads/                 # Images uploadées
├── public/                       # Assets statiques
└── README.md
```

## 🎨 Design et UX

### Palette de Couleurs
- **Violet principal** : `#a855f7` (violet-500)
- **Nuances** : violet-50 à violet-900
- **Accents** : blanc et noir selon le thème

### Animations
- **Framer Motion** pour les transitions fluides
- **Micro-interactions** sur les cartes et boutons
- **Animations d'apparition** au scroll

### Responsive Design
- **Mobile-first** approach
- **Breakpoints** : sm, md, lg, xl
- **Composants adaptatifs** pour tous les écrans

## 🔐 Sécurité

### Authentification Admin
- **Mot de passe unique** stocké côté serveur
- **JWT temporaire** (1h par défaut)
- **Validation** côté backend uniquement
- **Pas d'exposition** du mot de passe dans le frontend

### Protection des Routes
- **Middleware** de vérification des tokens
- **Headers Authorization** requis
- **Expiration automatique** des sessions

## 📊 Fonctionnalités Admin

### Dashboard
- **Statistiques** en temps réel
- **Vue d'ensemble** des contenus
- **Navigation** intuitive

### Gestion de Contenu
- **CRUD complet** pour services et blogs
- **Upload d'images** avec optimisation
- **Système de favoris** pour les blogs
- **Modération** des commentaires (si activé)

### Interface
- **Design moderne** et professionnel
- **Recherche et filtres** avancés
- **Pagination** pour les grandes listes
- **Confirmations** pour les suppressions

## 🚀 Déploiement

### Frontend (Vercel)
1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Backend (Render/Heroku)
1. Connecter le repository
2. Configurer les variables d'environnement
3. Déployer avec MongoDB Atlas

### Variables d'Environnement de Production
```env
MONGO_URI=mongodb+srv://...
ADMIN_PASSWORD=MotDePasseTrèsSécurisé
ADMIN_SIGN_SECRET=SecretTrèsLongEtComplexe
FRONTEND_URL=https://votre-domaine.com
```

## 🛠️ Développement

### Scripts Disponibles

#### Frontend
```bash
npm run dev          # Démarrage en développement
npm run build        # Build de production
npm run start        # Démarrage en production
npm run lint         # Linting ESLint
```

#### Backend
```bash
npm run dev          # Démarrage en développement
npm run build        # Compilation TypeScript
npm run start        # Démarrage en production
```

### Technologies Utilisées

#### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **Framer Motion** - Animations
- **Lucide React** - Icônes
- **React Hook Form** - Gestion des formulaires

#### Backend
- **Express.js** - Framework Node.js
- **MongoDB** - Base de données
- **Mongoose** - ODM MongoDB
- **JWT** - Authentification
- **Multer** - Upload de fichiers
- **Sharp** - Optimisation d'images
- **Zod** - Validation des données

## 📝 API Endpoints

### Public
- `GET /api/products` - Liste des services
- `GET /api/products/:id` - Détail d'un service
- `GET /api/blogs` - Liste des blogs
- `GET /api/blogs/featured` - Blogs en vedette
- `GET /api/blogs/slug/:slug` - Blog par slug
- `GET /api/images` - Galerie d'images

### Admin (Authentifié)
- `POST /api/admin/validate` - Authentification
- `GET /api/admin/stats` - Statistiques
- `POST /api/products` - Créer un service
- `PUT /api/products/:id` - Modifier un service
- `DELETE /api/products/:id` - Supprimer un service
- `POST /api/blogs` - Créer un blog
- `PUT /api/blogs/:id` - Modifier un blog
- `DELETE /api/blogs/:id` - Supprimer un blog
- `POST /api/images/upload` - Upload d'image
- `DELETE /api/images/:id` - Supprimer une image

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- **Email** : contact@monde-delice.com
- **WhatsApp** : +33 1 23 45 67 89
- **Telegram** : @monde_delice

---

**Monde Délice** - Créations artisanales de gâteaux et services d'événements 🎂✨