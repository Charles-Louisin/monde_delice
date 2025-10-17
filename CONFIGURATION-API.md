# Configuration API Frontend ↔ Backend

## ✅ Architecture confirmée

Le frontend communique **uniquement** avec le backend via l'API REST. Aucune connexion directe à MongoDB.

## 🔗 Configuration des URLs

### Frontend (Next.js - Port 3000)
- **API Base URL**: `http://localhost:5000/api`
- **Configuration**: `app/lib/api.ts` ligne 1
- **Variable d'environnement**: `NEXT_PUBLIC_API_URL`

### Backend (Express - Port 5000)
- **Port**: 5000
- **CORS Origin**: `http://localhost:3000`
- **Configuration**: `backend/src/config/index.ts`

## 🚀 Démarrage des services

### 1. Démarrer MongoDB
```bash
# Option 1: Service Windows
net start MongoDB

# Option 2: Manuel
mongod --dbpath C:\data\db
```

### 2. Démarrer le Backend
```bash
cd backend
npm run dev
```

### 3. Démarrer le Frontend
```bash
npm run dev
```

## 📡 Endpoints API utilisés par le frontend

### Produits/Services
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Blogs/Réalisations
- `GET /api/blogs` - Liste des blogs
- `POST /api/blogs` - Créer un blog
- `PUT /api/blogs/:id` - Modifier un blog
- `DELETE /api/blogs/:id` - Supprimer un blog

### Likes
- `POST /api/blogs/:id/like` - Liker un blog
- `GET /api/blogs/:id/like-status` - Statut du like

### Images
- `POST /api/images/upload` - Upload d'image

### Admin
- `GET /api/admin/stats` - Statistiques admin (authentification requise)
- `POST /api/auth/validate` - Validation mot de passe admin
- `GET /api/auth/verify` - Vérification du token JWT
- `GET /api/auth/profile` - Profil de l'utilisateur connecté

### Images (Authentification requise)
- `POST /api/images/upload` - Upload d'image (authentification requise)
- `GET /api/images` - Liste des images
- `DELETE /api/images/:id` - Supprimer une image (authentification requise)

## 🔒 Sécurité

- **Authentification**: JWT tokens pour l'admin
- **CORS**: Configuré pour `http://localhost:3000`
- **Rate Limiting**: 100 requêtes/15min
- **Validation**: Zod schemas côté backend
- **Upload d'images**: Authentification requise
- **Mot de passe admin**: `charleslouisin` (configurable via `ADMIN_PASSWORD`)

## ✅ Vérifications

1. ✅ Frontend n'a pas de dépendances MongoDB
2. ✅ Toutes les requêtes passent par l'API REST
3. ✅ Backend gère toutes les opérations MongoDB
4. ✅ CORS configuré correctement
5. ✅ Authentification JWT implémentée

## 🐛 Dépannage

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB fonctionne
mongo
```

### Erreur CORS
- Vérifier que le backend écoute sur le port 5000
- Vérifier que le frontend utilise `http://localhost:3000`

### Erreur API
- Vérifier les logs du backend
- Vérifier l'URL dans `app/lib/api.ts`
