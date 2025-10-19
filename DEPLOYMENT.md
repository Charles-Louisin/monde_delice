# 🚀 Guide de Déploiement - Monde Délice

## ✅ Migration Terminée !

Votre application a été migrée avec succès de Express vers Next.js API Routes.

## 📋 Prérequis

1. **Compte MongoDB Atlas** (gratuit)
2. **Compte Vercel** (gratuit)
3. **Git** installé

## 🔧 Configuration

### 1. MongoDB Atlas

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un compte gratuit
3. Créez un cluster (choisissez la région la plus proche)
4. Créez un utilisateur de base de données
5. Obtenez votre URI de connexion

### 2. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/monde-delice?retryWrites=true&w=majority

# JWT Secret (générez une clé sécurisée)
JWT_SECRET=your-super-secret-jwt-key-here

# Admin Password
ADMIN_PASSWORD=admin123

# Next.js
NEXT_PUBLIC_API_URL=/api
```

## 🚀 Déploiement sur Vercel

### 1. Préparer le projet

```bash
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit - Next.js app with API routes"

# Pousser vers GitHub
git remote add origin https://github.com/votre-username/monde-delice.git
git push -u origin main
```

### 2. Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project"
4. Sélectionnez votre repository `monde-delice`
5. Configurez les variables d'environnement :
   - `MONGODB_URI` : Votre URI MongoDB Atlas
   - `JWT_SECRET` : Une clé secrète forte
   - `ADMIN_PASSWORD` : Votre mot de passe admin
   - `NEXT_PUBLIC_API_URL` : `/api`
6. Cliquez sur "Deploy"

### 3. Configuration finale

1. **MongoDB Atlas** : Ajoutez l'IP de Vercel (0.0.0.0/0) dans les Network Access
2. **Vercel** : Votre site sera disponible à `https://votre-projet.vercel.app`

## 🎯 Fonctionnalités Disponibles

### API Routes
- ✅ `/api/products` - Gestion des produits
- ✅ `/api/blogs` - Gestion des blogs/réalisations
- ✅ `/api/blogs/[id]/like` - Système de likes
- ✅ `/api/images/upload` - Upload d'images
- ✅ `/api/admin/validate` - Authentification admin
- ✅ `/api/admin/stats` - Statistiques admin
- ✅ `/api/health` - Santé de l'API

### Frontend
- ✅ Pages publiques (accueil, blogs, services, contact)
- ✅ Interface d'administration
- ✅ Gestion des produits et blogs
- ✅ Upload d'images
- ✅ Système de likes

## 🔐 Sécurité

- ✅ Authentification JWT pour l'admin
- ✅ Validation des données avec Zod
- ✅ Protection CORS
- ✅ Validation des types de fichiers
- ✅ Limitation de taille des uploads

## 📊 Monitoring

- Vérifiez la santé de l'API : `https://votre-site.vercel.app/api/health`
- Dashboard Vercel pour les logs et métriques
- MongoDB Atlas pour les données

## 🆘 Support

En cas de problème :
1. Vérifiez les logs Vercel
2. Testez l'API avec `/api/health`
3. Vérifiez les variables d'environnement
4. Consultez la documentation MongoDB Atlas

## 🎉 Félicitations !

Votre application Monde Délice est maintenant prête et déployée !
