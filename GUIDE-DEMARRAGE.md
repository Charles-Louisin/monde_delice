# 🚀 Guide de Démarrage Rapide - Monde Délice

## ⚡ Démarrage Express (Sans MongoDB)

### 1. Démarrer le Frontend
```bash
npm run dev
```
Le frontend sera disponible sur http://localhost:3000

### 2. Tester les Likes (Mode Local)
- Les likes fonctionnent en mode local (localStorage uniquement)
- Pas besoin de backend pour tester l'interface
- Les animations et interactions sont pleinement fonctionnelles

## 🔧 Démarrage Complet (Avec Backend)

### Prérequis
- MongoDB installé et démarré
- Node.js 18+

### 1. Démarrer MongoDB
```bash
# Windows (si installé via MongoDB Community Server)
net start MongoDB

# Ou via Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Démarrer le Backend
```bash
cd backend
npm run dev
```
Le backend sera disponible sur http://localhost:5000

### 3. Démarrer le Frontend
```bash
npm run dev
```
Le frontend sera disponible sur http://localhost:3000

## 🎯 Test des Fonctionnalités

### Système de Likes
1. Aller sur `/blogs` ou `/blogs/[slug]`
2. Cliquer sur le bouton cœur 💜
3. Voir l'animation et le compteur se mettre à jour
4. Recharger la page → le like est conservé (localStorage)
5. Cliquer à nouveau → unlike automatique

### Interface Admin
1. Aller sur `/admin`
2. Mot de passe : `charleslouisin`
3. Accéder au dashboard d'administration

## 🐛 Résolution de Problèmes

### Erreur "Backend non disponible"
- Le système fonctionne en mode local
- Les likes sont sauvegardés dans localStorage
- Pas d'impact sur l'expérience utilisateur

### Erreur MongoDB
- Vérifier que MongoDB est démarré
- Vérifier la connexion sur le port 27017
- Le backend affichera des erreurs de connexion si MongoDB n'est pas disponible

### Erreur de Port
- Backend : port 5000
- Frontend : port 3000
- Vérifier qu'aucun autre service n'utilise ces ports

## 📱 Fonctionnalités Testées

✅ **Pages Frontend**
- Page d'accueil avec services et réalisations
- Page services avec recherche et filtres
- Page blogs avec système de likes
- Page de détail des blogs
- Page contact
- Interface admin

✅ **Système de Likes**
- Like/Unlike avec animations
- Persistance localStorage
- Compteur en temps réel
- Protection anti-abus (IP + localStorage)

✅ **Responsive Design**
- Mobile-first
- Animations Framer Motion
- Palette violet personnalisée

## 🎉 Prêt à l'utilisation !

Le projet est maintenant entièrement fonctionnel avec un système de likes robuste et une interface utilisateur fluide.
