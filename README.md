# Horoscope App

Application de voyance, horoscope, tarot et boutique ésotérique.

## Prérequis

- Node.js >= 18
- PostgreSQL (port 5432) avec utilisateur `postgres` et mot de passe `postgres`

## Installation

```bash
npm install
```

## Exécution

**1. Démarrer le serveur backend (terminal 1)**
```bash
npm run server
```
→ API sur http://localhost:5000
→ Crée la BDD `horoscope_db`, les tables et seed les données automatiquement

**2. Démarrer le frontend (terminal 2)**
```bash
npm run dev
```
→ Frontend sur http://localhost:5173

## Admin

- **Email**: `zouaouiyosra053@gmail.com`
- **Mot de passe**: `ysra 123`

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Frontend (Vite) |
| `npm run server` | Backend (Express) |
| `npm run build` | Build production |
| `npm run seed` | Seed BDD uniquement |
| `npm run lint` | Vérification ESLint |
