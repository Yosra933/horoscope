# Architecture - Horoscope App

## Structure du projet

```
horoscope-app/
├── server/                  # Backend Express
│   ├── index.js             # Serveur API (port 5000)
│   └── seeder.js            # Seed données (zodiac, produits, tarot)
├── src/                     # Frontend React (Vite, port 5173)
│   ├── App.jsx              # Orchestrateur principal (state + layout)
│   ├── App.css              # Styles globaux (ex-CSS-in-JS)
│   ├── Auth.jsx             # Modal login/register
│   ├── main.jsx             # Point d'entrée React
│   ├── index.css            # Styles résiduels
│   ├── components/          # Composants UI
│   │   ├── Header.jsx      # Navigation + auth + panier
│   │   ├── Footer.jsx      # Pied de page
│   │   ├── HomePage.jsx    # Page d'accueil (hero, horoscope, boutique, tarot)
│   │   ├── HoroscopePage.jsx # Page horoscope complet
│   │   ├── TarotPage.jsx   # Tirage de tarot
│   │   ├── ShopPage.jsx    # Boutique avec filtres
│   │   ├── ContactPage.jsx # Formulaire de contact
│   │   ├── Dashboard.jsx   # Admin (utilisateurs + commandes)
│   │   ├── CartModal.jsx   # Panier + checkout
│   │   ├── QuestionModal.jsx # Question voyant IA
│   │   ├── ProductCard.jsx # Carte produit
│   │   └── Stat.jsx        # Barre de progression (amour, travail...)
│   └── assets/             # Images statiques
├── .env                     # Variables d'environnement
├── package.json             # Dépendances et scripts
└── vite.config.js           # Configuration Vite
```

## Base de données (MySQL - horoscope_db)

### Tables

| Table | Contenu |
|-------|---------|
| `users` | Comptes (id, email, password, name, role, dates) |
| `zodiac_signs` | 12 signes astrologiques avec horoscope |
| `products` | 8 produits boutique (prix, catégorie, badge, gradient) |
| `tarot_cards` | 12 cartes de tarot (message, tag, emoji) |
| `orders` | Commandes (client, email, adresse, total, statut) |
| `order_items` | Articles d'une commande (produit, quantité, prix) |

### Rôles utilisateur

- `user` — rôle par défaut à l'inscription
- `admin` — accès au dashboard (créé automatiquement au démarrage)

## Flux de commande

```
Panier (step 0) → Adresse (step 1) → Confirmation (step 3)
```
- L'utilisateur doit être connecté pour commander
- L'email provient du compte, pas du formulaire
- Le nom est pré-rempli depuis le profil

## API Endpoints

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription (retourne token + user) |
| POST | `/api/auth/login` | Connexion (retourne token + user) |

### Données
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/zodiac` | Tous les signes |
| GET | `/api/products` | Tous les produits |
| GET | `/api/products/category/:cat` | Produits par catégorie |
| GET | `/api/tarot` | Toutes les cartes de tarot |
| POST | `/api/orders` | Créer commande (auth requis) |

### Admin (auth requis + rôle admin)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/admin/users` | Liste des utilisateurs |
| GET | `/api/admin/orders` | Liste des commandes + articles |

### Système
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/health` | Healthcheck |
| GET | `/api/tables` | Infos des tables BDD |

## Cycle de vie

1. **Démarrage** : `npm run server` → Express écoute sur le port 5000
2. **Base de données** : Création automatique de `horoscope_db` et des 6 tables (si inexistantes)
3. **Seed** : Les données (zodiac, produits, tarot) sont insérées uniquement si les tables sont vides
4. **Admin** : Le compte admin `yosra` est créé/mis à jour au démarrage
5. **Frontend** : `npm run dev` → Vite sert l'app React sur le port 5173
6. **Communication** : Le frontend fetch l'API REST via `http://localhost:5000`
7. **Auth** : JWT stocké dans localStorage, envoyé dans le header `Authorization: Bearer <token>`

## Commandes

```bash
npm run server   # Backend (port 5000)
npm run dev      # Frontend (port 5173)
npm run build    # Build production
npm run seed     # Seed BDD uniquement
```
