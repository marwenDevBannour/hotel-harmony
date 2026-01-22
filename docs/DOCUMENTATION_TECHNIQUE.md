# Documentation Technique - Système de Gestion Hôtelière (PMS)

> **Version:** 1.0.0  
> **Date de mise à jour:** 22 Janvier 2026  
> **Auteur:** Équipe de Développement

---

## Table des Matières

1. [Vue d'ensemble du Projet](#vue-densemble-du-projet)
2. [Architecture Technique](#architecture-technique)
3. [Système de Design (Thème)](#système-de-design-thème)
4. [Modules Fonctionnels](#modules-fonctionnels)
5. [Cahier des Charges](#cahier-des-charges)
6. [Guide de Développement](#guide-de-développement)

---

## Vue d'ensemble du Projet

### Description Générale

Le **Système de Gestion Hôtelière (PMS - Property Management System)** est une application web complète conçue pour centraliser et automatiser la gestion des opérations hôtelières. L'application couvre l'ensemble des besoins opérationnels d'un établissement hôtelier moderne.

### Objectifs Principaux

- **Centralisation des données** : Unification de toutes les informations clients, réservations, chambres et facturation
- **Automatisation des processus** : Réduction des tâches manuelles et optimisation des workflows
- **Expérience utilisateur optimale** : Interface intuitive et responsive pour tous les utilisateurs
- **Scalabilité** : Support jusqu'à 50 utilisateurs simultanés et 200 chambres

### Stack Technologique

| Catégorie | Technologies |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **État** | TanStack React Query |
| **Backend** | Lovable Cloud (Supabase) / Spring Boot (dev) |
| **Base de données** | PostgreSQL |
| **Validation** | Zod, React Hook Form |

---

## Architecture Technique

### Structure du Projet

```
src/
├── components/           # Composants React réutilisables
│   ├── ui/              # Composants UI de base (shadcn/ui)
│   ├── layout/          # Composants de mise en page
│   ├── modules/         # Composants dynamiques par type
│   ├── dashboard/       # Composants du tableau de bord
│   ├── billing/         # Composants de facturation
│   ├── guests/          # Composants clients
│   ├── reservations/    # Composants réservations
│   ├── restaurant/      # Composants restaurant
│   ├── rooms/           # Composants chambres
│   ├── settings/        # Composants paramètres
│   └── filters/         # Composants de filtrage
├── hooks/               # Hooks React personnalisés
├── lib/                 # Utilitaires et configuration
├── pages/               # Pages de l'application
├── services/            # Services API
├── types/               # Types TypeScript
└── integrations/        # Intégrations externes
```

### Système de Modules Dynamiques

L'application utilise un système de composants dynamiques basé sur une hiérarchie à trois niveaux :

```
Module (Module)
└── Sous-Module (SousModule)
    └── Événement (Evnmt)
        └── Configuration (ComponentConfig)
```

#### Types de Composants Disponibles

| Type | Description | Cas d'usage |
|------|-------------|-------------|
| `form` | Formulaires dynamiques | Création/édition d'entités |
| `table` | Tableaux de données | Affichage avec tri, filtre, pagination |
| `list` | Listes simples | Affichage en cartes/grilles |
| `dashboard` | Tableaux de bord | KPIs et visualisations |
| `settings` | Paramètres | Configuration système |

### Registre de Composants

```typescript
// Enregistrement d'un composant
registerComponent('TYPE_FORM', FormComponent);
registerComponent('TYPE_TABLE', TableComponent);
registerComponent('RESERVATION_LIST', ListComponent);

// Récupération d'un composant
const Component = getComponentByCode('TYPE_FORM');
```

---

## Système de Design (Thème)

### Philosophie de Design

Le thème est conçu autour des principes suivants :
- **Élégance professionnelle** : Aspect luxueux adapté à l'hôtellerie
- **Lisibilité** : Contraste optimal et typographie claire
- **Cohérence** : Tokens de design uniformes
- **Accessibilité** : Support des modes clair/sombre

### Palette de Couleurs

#### Mode Clair (Light Mode)

```css
:root {
  /* Couleurs de base */
  --background: 40 33% 98%;        /* Fond principal - Ivoire doux */
  --foreground: 30 10% 15%;        /* Texte principal - Gris foncé */
  
  /* Couleur primaire - Or */
  --primary: 45 80% 45%;           /* Doré élégant */
  --primary-foreground: 0 0% 100%; /* Texte sur primaire - Blanc */
  
  /* Couleurs secondaires */
  --secondary: 35 25% 92%;         /* Beige clair */
  --muted: 35 20% 95%;             /* Gris chaud atténué */
  --accent: 35 30% 88%;            /* Accent beige */
  
  /* États et feedbacks */
  --destructive: 0 84.2% 60.2%;    /* Rouge - Erreurs/Suppressions */
  
  /* Composants */
  --card: 40 33% 99%;              /* Fond des cartes */
  --popover: 40 33% 99%;           /* Fond des popovers */
  --border: 35 20% 88%;            /* Bordures */
  --ring: 45 80% 45%;              /* Focus ring */
}
```

#### Mode Sombre (Dark Mode)

```css
.dark {
  --background: 30 15% 10%;        /* Fond sombre élégant */
  --foreground: 40 20% 95%;        /* Texte clair */
  
  --primary: 45 70% 50%;           /* Or plus lumineux */
  --primary-foreground: 30 15% 10%;
  
  --secondary: 30 15% 18%;
  --muted: 30 10% 20%;
  --accent: 30 15% 22%;
  
  --card: 30 15% 12%;
  --border: 30 15% 20%;
}
```

### Couleurs Personnalisées

```css
/* Couleur "Gold" - Signature de l'hôtel */
--gold: 45 80% 45%;
--gold-light: 45 70% 60%;
--gold-dark: 45 85% 35%;

/* Couleur "Hotel" - Identité corporate */
--hotel-50: 35 30% 97%;
--hotel-100: 35 25% 92%;
--hotel-200: 35 20% 85%;
--hotel-500: 35 25% 50%;
--hotel-900: 30 20% 15%;
```

### Typographie

```css
/* Police d'affichage (titres) */
--font-display: 'Playfair Display', Georgia, serif;

/* Police de base (corps de texte) */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Échelle typographique */
.text-xs   { font-size: 0.75rem; }   /* 12px */
.text-sm   { font-size: 0.875rem; }  /* 14px */
.text-base { font-size: 1rem; }      /* 16px */
.text-lg   { font-size: 1.125rem; }  /* 18px */
.text-xl   { font-size: 1.25rem; }   /* 20px */
.text-2xl  { font-size: 1.5rem; }    /* 24px */
.text-3xl  { font-size: 1.875rem; }  /* 30px */
.text-4xl  { font-size: 2.25rem; }   /* 36px */
```

### Espacements

```css
/* Système d'espacement (multiples de 4px) */
.space-1  { 0.25rem; }  /* 4px */
.space-2  { 0.5rem; }   /* 8px */
.space-3  { 0.75rem; }  /* 12px */
.space-4  { 1rem; }     /* 16px */
.space-6  { 1.5rem; }   /* 24px */
.space-8  { 2rem; }     /* 32px */
.space-12 { 3rem; }     /* 48px */
```

### Rayons de Bordure

```css
--radius: 0.5rem;        /* 8px - Rayon par défaut */
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
```

### Ombres

```css
/* Ombres élégantes */
.shadow-sm   { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.shadow      { box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06); }
.shadow-md   { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
.shadow-lg   { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
.shadow-xl   { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
.shadow-gold { box-shadow: 0 4px 14px -3px rgba(180,140,50,0.25); }
```

### Composants UI (shadcn/ui)

#### Boutons

```tsx
// Variantes disponibles
<Button variant="default">Primaire (Gold)</Button>
<Button variant="secondary">Secondaire</Button>
<Button variant="outline">Contour</Button>
<Button variant="ghost">Fantôme</Button>
<Button variant="destructive">Destructif</Button>

// Tailles
<Button size="sm">Petit</Button>
<Button size="default">Normal</Button>
<Button size="lg">Grand</Button>
<Button size="icon">Icône</Button>
```

#### Cartes

```tsx
<Card className="shadow-md hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Contenu</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

#### Badges

```tsx
<Badge variant="default">Par défaut</Badge>
<Badge variant="secondary">Secondaire</Badge>
<Badge variant="outline">Contour</Badge>
<Badge variant="destructive">Destructif</Badge>
```

---

## Modules Fonctionnels

### 1. Module Dashboard (Tableau de Bord)

#### Description
Page d'accueil présentant une vue synthétique de l'activité hôtelière avec des indicateurs clés de performance.

#### Fonctionnalités
- **StatCards** : Affichage des KPIs principaux
  - Taux d'occupation
  - Revenus du jour
  - Arrivées/Départs du jour
  - Chambres disponibles
- **OccupancyChart** : Graphique d'évolution du taux d'occupation
- **TodayActivity** : Liste des arrivées et départs du jour
- **RoomOverview** : État en temps réel des chambres
- **RecentReservations** : Dernières réservations enregistrées
- **QuickActions** : Accès rapide aux actions fréquentes

#### Hooks Utilisés
```typescript
useRooms()          // Données des chambres
useRoomStats()      // Statistiques chambres
useReservations()   // Réservations
useTodayArrivals()  // Arrivées du jour
useTodayDepartures() // Départs du jour
```

---

### 2. Module Réservations

#### Description
Gestion complète du cycle de vie des réservations, de la création au check-out.

#### Fonctionnalités
- **Liste des réservations** avec filtrage et recherche
- **Création/Modification** via formulaire modal
- **Statuts** : Confirmée, En cours, Terminée, Annulée
- **Export CSV/Excel** des données filtrées
- **Calcul automatique** du nombre de nuits et montants

#### Structure de Données
```typescript
interface Reservation {
  id: string | number;
  checkInDate: string;
  checkOutDate: string;
  status?: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  adults?: number;
  children?: number;
  totalAmount?: number;
  paidAmount?: number;
  specialRequests?: string;
  guest?: Guest;
  room?: Room;
}
```

#### Hooks Utilisés
```typescript
useReservations()    // CRUD réservations
useSearchFilter()    // Filtrage avec persistance URL
```

---

### 3. Module Chambres

#### Description
Inventaire et gestion de l'état des chambres de l'établissement.

#### Fonctionnalités
- **Catalogue** : Liste de toutes les chambres avec caractéristiques
- **Types** : Single, Double, Suite, Familiale
- **Statuts** : Disponible, Occupée, Maintenance, Nettoyage
- **Tarification** : Prix par nuit par type
- **Équipements** : Liste des amenities par chambre

#### Structure de Données
```typescript
interface Room {
  id: string | number;
  number: string;
  type: 'single' | 'double' | 'suite' | 'family';
  capacity: number;
  price: number;
  floor?: number;
  status?: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  description?: string;
  amenities?: string[];
}
```

---

### 4. Module Clients (Guests)

#### Description
Base de données clients avec historique et programme de fidélité.

#### Fonctionnalités
- **Profils clients** : Informations personnelles complètes
- **Historique** : Séjours passés et préférences
- **Programme VIP** : Statut et points de fidélité
- **Recherche** : Par nom, email, téléphone
- **Statistiques** : Nombre de séjours, revenus générés

#### Structure de Données
```typescript
interface Guest {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  vip?: boolean;
  loyaltyPoints?: number;
  totalStays?: number;
  nationality?: string;
  notes?: string;
}
```

---

### 5. Module Facturation (Billing)

#### Description
Gestion financière : factures, paiements et rapports comptables.

#### Fonctionnalités
- **Factures** : Création, édition, suivi des paiements
- **Statuts** : Payée, En attente, Partiellement payée
- **Paiements** : Enregistrement des encaissements
- **Modes de paiement** : Carte, Espèces, Virement, Chèque
- **Export PDF** : Génération de factures imprimables

#### Structure de Données
```typescript
interface Invoice {
  id: string | number;
  invoiceNumber: string;
  issueDate: string;
  amount: number;
  paid: boolean;
  dueDate?: string;
  status?: 'paid' | 'pending' | 'partial';
  subtotal?: number;
  taxAmount?: number;
  totalAmount?: number;
  paidAmount?: number;
  guest?: Guest;
  reservation?: Reservation;
}
```

---

### 6. Module Restaurant

#### Description
Gestion des opérations de restauration : menu, tables et commandes.

#### Fonctionnalités
- **Gestion des tables** : Capacité, emplacement, statut
- **Menu** : Articles, catégories, prix, disponibilité
- **Commandes** : Prise de commande, suivi, facturation
- **Statuts commande** : En attente, Préparation, Servi, Payé

#### Sous-composants
- `TableCard` : Affichage d'une table avec statut
- `OrderCard` : Détail d'une commande avec workflow
- `MenuItemCard` : Article du menu avec image

#### Structure de Données
```typescript
interface RestaurantTable {
  id: string | number;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'closed';
  location?: string;
}

interface MenuItem {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl?: string;
}

interface RestaurantOrder {
  id: string | number;
  orderNumber: string;
  orderType: 'dine_in' | 'room_service' | 'takeaway';
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid';
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  table?: RestaurantTable;
  items?: OrderItem[];
}
```

---

### 7. Module Paramètres (Settings)

#### Description
Configuration système et gestion de la hiérarchie des modules.

#### Fonctionnalités
- **Gestion Modules** : CRUD sur les modules principaux
- **Sous-Modules** : Configuration des sous-sections
- **Événements** : Définition des composants et configurations
- **Configuration Composants** : Éditeur de colonnes/champs
- **Import/Export** : Sauvegarde de la configuration

---

## Hiérarchie Modules / Sous-Modules / Événements

Cette section décrit en détail l'architecture de configuration dynamique du système. La hiérarchie à trois niveaux permet une organisation flexible et modulaire de l'application.

### Vue d'ensemble de la Hiérarchie

```
┌─────────────────────────────────────────────────────────────────┐
│                          MODULE                                  │
│  Niveau 1 : Domaine fonctionnel principal                       │
│  (ex: Réservations, Chambres, Facturation)                      │
├─────────────────────────────────────────────────────────────────┤
│                       SOUS-MODULE                                │
│  Niveau 2 : Fonctionnalité spécifique du module                 │
│  (ex: Liste des réservations, Calendrier, Statistiques)         │
├─────────────────────────────────────────────────────────────────┤
│                        ÉVÉNEMENT                                 │
│  Niveau 3 : Composant UI et sa configuration                    │
│  (ex: Formulaire de création, Tableau de données, Dashboard)    │
└─────────────────────────────────────────────────────────────────┘
```

---

### 1. MODULE (Niveau 1)

#### Description Détaillée

Un **Module** représente un domaine fonctionnel principal de l'application. C'est le niveau le plus haut de la hiérarchie et correspond généralement à une section majeure du menu de navigation.

#### Caractéristiques

| Propriété | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `id` | `string \| number` | Identifiant unique du module | `1`, `"mod-001"` |
| `codeM` | `string` | Code unique d'identification (MAJUSCULES, underscore autorisé) | `"RESERVATIONS"`, `"CHAMBRES"` |
| `libelle` | `string` | Nom affiché dans l'interface | `"Gestion des Réservations"` |
| `ddeb` | `string` | Date de début de validité (ISO 8601) | `"2025-01-01"` |
| `dfin` | `string \| null` | Date de fin de validité (null = indéfini) | `"2099-12-31"`, `null` |

#### Interface TypeScript

```typescript
interface UnifiedModule {
  id: string | number;
  codeM: string;        // Code unique (ex: "RESERVATIONS")
  libelle: string;      // Libellé affiché (ex: "Gestion des Réservations")
  ddeb: string;         // Date début validité
  dfin: string | null;  // Date fin validité (null = sans limite)
}
```

#### Règles de Gestion

1. **Unicité** : Le `codeM` doit être unique dans tout le système
2. **Convention de nommage** : 
   - `codeM` en MAJUSCULES, sans espaces (underscores autorisés)
   - `libelle` en texte libre, clair et descriptif
3. **Validité temporelle** : Un module n'est actif que si `ddeb <= today <= dfin`
4. **Cascade** : La suppression d'un module entraîne la suppression de tous ses sous-modules et événements

#### Exemples de Modules

```yaml
Module: Réservations
  codeM: RESERVATIONS
  libelle: Gestion des Réservations
  ddeb: 2025-01-01
  dfin: null
  Description: Centralise toutes les fonctionnalités liées au cycle de vie 
               des réservations (création, modification, annulation, check-in/out)

Module: Chambres
  codeM: CHAMBRES
  libelle: Gestion des Chambres
  ddeb: 2025-01-01
  dfin: null
  Description: Gère l'inventaire des chambres, leurs caractéristiques,
               tarifs et états (disponible, occupée, maintenance)

Module: Facturation
  codeM: FACTURATION
  libelle: Facturation et Paiements
  ddeb: 2025-01-01
  dfin: null
  Description: Traite la création des factures, le suivi des paiements
               et la génération des rapports financiers

Module: Restaurant
  codeM: RESTAURANT
  libelle: Gestion du Restaurant
  ddeb: 2025-01-01
  dfin: null
  Description: Gère les tables, le menu, les commandes et le room service
```

---

### 2. SOUS-MODULE (Niveau 2)

#### Description Détaillée

Un **Sous-Module** représente une fonctionnalité spécifique au sein d'un module. Il permet de décomposer un domaine fonctionnel en sections plus précises et navigables.

#### Caractéristiques

| Propriété | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `id` | `string \| number` | Identifiant unique | `10`, `"sm-001"` |
| `codeS` | `string` | Code unique d'identification | `"RESERVATION_LIST"` |
| `libelle` | `string` | Nom affiché | `"Liste des réservations"` |
| `ddeb` | `string` | Date de début de validité | `"2025-01-01"` |
| `dfin` | `string \| null` | Date de fin de validité | `null` |
| `moduleId` | `string \| number` | Référence vers le module parent | `1` |
| `module` | `UnifiedModule?` | Objet module parent (optionnel) | `{ id: 1, codeM: "RESERVATIONS", ... }` |

#### Interface TypeScript

```typescript
interface UnifiedSousModule {
  id: string | number;
  codeS: string;              // Code unique (ex: "RESERVATION_LIST")
  libelle: string;            // Libellé affiché
  ddeb: string;               // Date début validité
  dfin: string | null;        // Date fin validité
  moduleId: string | number;  // ID du module parent
  module?: UnifiedModule;     // Module parent (chargement optionnel)
}
```

#### Règles de Gestion

1. **Unicité** : Le `codeS` doit être unique au sein de tout le système
2. **Dépendance** : Un sous-module doit obligatoirement être rattaché à un module
3. **Héritage de validité** : La période de validité doit être incluse dans celle du module parent
4. **Navigation** : Chaque sous-module génère une entrée dans le menu de navigation sous son module parent

#### Exemples de Sous-Modules

```yaml
# Sous-modules du Module RESERVATIONS
SousModule: Liste des réservations
  codeS: RESERVATION_LIST
  libelle: Liste des réservations
  moduleId: RESERVATIONS
  Description: Affiche un tableau paginé et filtrable de toutes les réservations
               avec options de recherche, tri et export

SousModule: Nouvelle réservation
  codeS: RESERVATION_CREATE
  libelle: Nouvelle réservation
  moduleId: RESERVATIONS
  Description: Formulaire de création d'une nouvelle réservation avec
               sélection du client, de la chambre et des dates

SousModule: Calendrier
  codeS: RESERVATION_CALENDAR
  libelle: Vue calendrier
  moduleId: RESERVATIONS
  Description: Visualisation des réservations sur un calendrier interactif
               avec vue jour/semaine/mois

# Sous-modules du Module CHAMBRES
SousModule: Inventaire
  codeS: ROOM_INVENTORY
  libelle: Inventaire des chambres
  moduleId: CHAMBRES
  Description: Liste complète des chambres avec leurs caractéristiques,
               tarifs et équipements

SousModule: États des chambres
  codeS: ROOM_STATUS
  libelle: États des chambres
  moduleId: CHAMBRES
  Description: Vue en temps réel du statut de chaque chambre
               (disponible, occupée, nettoyage, maintenance)

# Sous-modules du Module FACTURATION
SousModule: Factures
  codeS: INVOICE_LIST
  libelle: Liste des factures
  moduleId: FACTURATION
  Description: Gestion des factures avec suivi des paiements et relances

SousModule: Paiements
  codeS: PAYMENT_LIST
  libelle: Historique des paiements
  moduleId: FACTURATION
  Description: Journal de tous les paiements reçus avec détails et références
```

---

### 3. ÉVÉNEMENT (Niveau 3)

#### Description Détaillée

Un **Événement** (Evnmt) définit un composant UI spécifique et sa configuration. C'est le niveau le plus bas de la hiérarchie qui détermine comment les données sont affichées et manipulées.

#### Caractéristiques

| Propriété | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `id` | `string \| number` | Identifiant unique | `100`, `"evt-001"` |
| `codeEvnmt` | `string` | Code unique d'identification | `"TABLE_RESERVATIONS"` |
| `libelle` | `string` | Nom affiché | `"Tableau des réservations"` |
| `ddeb` | `string` | Date de début de validité | `"2025-01-01"` |
| `dfin` | `string \| null` | Date de fin de validité | `null` |
| `bactif` | `boolean` | Événement actuellement actif | `true` |
| `sousModuleId` | `string \| number` | Référence vers le sous-module parent | `10` |
| `componentType` | `EventComponentType` | Type de composant à rendre | `"table"`, `"form"` |
| `config` | `ComponentConfig?` | Configuration du composant (JSONB) | `{ columns: [...] }` |

#### Types de Composants Disponibles

| Type | Description | Cas d'Usage | Icône |
|------|-------------|-------------|-------|
| `form` | Formulaire dynamique | Création/édition d'entités | 📝 |
| `table` | Tableau de données | Affichage avec tri, filtre, pagination | 📊 |
| `list` | Liste en cartes | Affichage visuel en grille | 📋 |
| `dashboard` | Tableau de bord | KPIs et visualisations | 📈 |
| `settings` | Paramètres | Configuration et préférences | ⚙️ |

#### Interface TypeScript

```typescript
type EventComponentType = 'form' | 'table' | 'list' | 'dashboard' | 'settings';

interface UnifiedEvnmt {
  id: string | number;
  codeEvnmt: string;              // Code unique
  libelle: string;                // Libellé affiché
  ddeb: string;                   // Date début validité
  dfin: string | null;            // Date fin validité
  bactif: boolean;                // Actif (seul 1 par sous-module)
  sousModuleId: string | number;  // ID du sous-module parent
  sousModule?: UnifiedSousModule; // Sous-module parent (optionnel)
  componentType: EventComponentType; // Type de composant
  config?: ComponentConfig;       // Configuration JSONB
}
```

#### Règles de Gestion

1. **Unicité active** : Un seul événement avec `bactif = true` par sous-module
2. **Type obligatoire** : Le `componentType` doit être défini et valide
3. **Configuration dynamique** : Le champ `config` stocke la configuration spécifique au type
4. **Rendu conditionnel** : Seul l'événement actif est rendu dans l'interface

#### Exemples d'Événements

```yaml
# Événements pour RESERVATION_LIST
Evnmt: Tableau des réservations
  codeEvnmt: TABLE_RESERVATIONS
  libelle: Tableau des réservations
  sousModuleId: RESERVATION_LIST
  componentType: table
  bactif: true
  config:
    columns:
      - { key: "id", label: "#", type: "text", sortable: true }
      - { key: "guestName", label: "Client", type: "text", sortable: true }
      - { key: "roomNumber", label: "Chambre", type: "text" }
      - { key: "checkIn", label: "Arrivée", type: "date", sortable: true }
      - { key: "checkOut", label: "Départ", type: "date", sortable: true }
      - { key: "status", label: "Statut", type: "badge" }
    pageSize: 20
    actions: { create: true, edit: true, delete: true, export: true }

Evnmt: Liste visuelle (alternatif)
  codeEvnmt: LIST_RESERVATIONS
  libelle: Vue en cartes
  sousModuleId: RESERVATION_LIST
  componentType: list
  bactif: false
  config:
    columns:
      - { key: "guestName", label: "Client", type: "text" }
      - { key: "dates", label: "Période", type: "text" }
      - { key: "status", label: "Statut", type: "badge" }
    pageSize: 12

# Événement pour RESERVATION_CREATE
Evnmt: Formulaire nouvelle réservation
  codeEvnmt: FORM_NEW_RESERVATION
  libelle: Créer une réservation
  sousModuleId: RESERVATION_CREATE
  componentType: form
  bactif: true
  config:
    fields:
      - { key: "guestId", label: "Client", type: "select", required: true }
      - { key: "roomId", label: "Chambre", type: "select", required: true }
      - { key: "checkIn", label: "Date d'arrivée", type: "date", required: true }
      - { key: "checkOut", label: "Date de départ", type: "date", required: true }
      - { key: "adults", label: "Adultes", type: "number", min: 1, max: 10 }
      - { key: "children", label: "Enfants", type: "number", min: 0, max: 10 }
      - { key: "notes", label: "Demandes spéciales", type: "textarea" }
    actions: { create: true }

# Événement Dashboard
Evnmt: Dashboard général
  codeEvnmt: DASHBOARD_OVERVIEW
  libelle: Vue d'ensemble
  sousModuleId: DASHBOARD_MAIN
  componentType: dashboard
  bactif: true
  config:
    title: "Tableau de bord"
    description: "Vue synthétique de l'activité"
```

---

### 4. CONFIGURATION DES COMPOSANTS (ComponentConfig)

#### Description Détaillée

La configuration (`ComponentConfig`) est un objet JSON stocké dans le champ `config` de chaque événement. Elle définit dynamiquement le comportement et l'apparence du composant rendu.

#### Structure Complète

```typescript
interface ComponentConfig {
  // === MÉTADONNÉES ===
  title?: string;           // Titre affiché
  description?: string;     // Description/sous-titre
  
  // === COLONNES (Table & List) ===
  columns?: ColumnConfig[];
  
  // === CHAMPS (Form) ===
  fields?: FieldConfig[];
  
  // === PAGINATION ===
  pageSize?: number;        // Nombre d'items par page (défaut: 10)
  
  // === ACTIONS AUTORISÉES ===
  actions?: {
    create?: boolean;       // Bouton "Ajouter"
    edit?: boolean;         // Action "Modifier" par ligne
    delete?: boolean;       // Action "Supprimer" par ligne
    view?: boolean;         // Action "Voir" par ligne
    export?: boolean;       // Bouton "Exporter"
  };
  
  // === SOURCE DE DONNÉES ===
  dataSource?: {
    type: 'static' | 'supabase' | 'api';
    table?: string;         // Nom de la table Supabase
    endpoint?: string;      // URL de l'API externe
  };
}
```

#### Configuration des Colonnes (ColumnConfig)

Pour les composants `table` et `list` :

```typescript
interface ColumnConfig {
  key: string;              // Clé du champ dans les données
  label: string;            // Libellé affiché
  type: 'text' | 'number' | 'date' | 'badge' | 'boolean' | 'actions';
  sortable?: boolean;       // Colonne triable
  filterable?: boolean;     // Colonne filtrable
  width?: string;           // Largeur CSS (ex: "150px", "20%")
  
  // Pour type "badge" : variantes de couleur par valeur
  badgeVariants?: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'>;
}
```

**Exemples de colonnes :**

```json
{
  "columns": [
    { "key": "id", "label": "#", "type": "text", "width": "80px" },
    { "key": "name", "label": "Nom", "type": "text", "sortable": true },
    { "key": "amount", "label": "Montant", "type": "number", "sortable": true },
    { "key": "date", "label": "Date", "type": "date", "sortable": true },
    { 
      "key": "status", 
      "label": "Statut", 
      "type": "badge",
      "badgeVariants": {
        "confirmed": "default",
        "pending": "secondary",
        "cancelled": "destructive"
      }
    },
    { "key": "active", "label": "Actif", "type": "boolean" }
  ]
}
```

#### Configuration des Champs (FieldConfig)

Pour les composants `form` :

```typescript
interface FieldConfig {
  key: string;              // Nom du champ
  label: string;            // Libellé affiché
  type: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'switch' | 'checkbox';
  placeholder?: string;     // Texte indicatif
  required?: boolean;       // Champ obligatoire
  
  // Pour type "select" : options disponibles
  options?: { value: string; label: string }[];
  
  // Validation numérique
  min?: number;
  max?: number;
  
  // Validation texte
  minLength?: number;
  maxLength?: number;
  pattern?: string;         // Expression régulière
}
```

**Exemples de champs :**

```json
{
  "fields": [
    { 
      "key": "email", 
      "label": "Email", 
      "type": "email", 
      "required": true,
      "placeholder": "exemple@hotel.com"
    },
    { 
      "key": "phone", 
      "label": "Téléphone", 
      "type": "text",
      "pattern": "^\\+?[0-9]{10,14}$"
    },
    { 
      "key": "roomType", 
      "label": "Type de chambre", 
      "type": "select",
      "required": true,
      "options": [
        { "value": "single", "label": "Simple" },
        { "value": "double", "label": "Double" },
        { "value": "suite", "label": "Suite" }
      ]
    },
    { 
      "key": "nights", 
      "label": "Nombre de nuits", 
      "type": "number",
      "min": 1,
      "max": 365
    },
    { 
      "key": "notes", 
      "label": "Remarques", 
      "type": "textarea",
      "maxLength": 500
    },
    { 
      "key": "vip", 
      "label": "Client VIP", 
      "type": "switch"
    }
  ]
}
```

---

### 5. DIAGRAMME DE LA HIÉRARCHIE

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              SYSTÈME PMS                                      │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           │                          │                          │
           ▼                          ▼                          ▼
    ┌────────────┐            ┌────────────┐            ┌────────────┐
    │   MODULE   │            │   MODULE   │            │   MODULE   │
    │ RESERVATIONS│           │  CHAMBRES  │            │FACTURATION │
    └────────────┘            └────────────┘            └────────────┘
           │                          │                          │
     ┌─────┴─────┐              ┌─────┴─────┐              ┌─────┴─────┐
     │           │              │           │              │           │
     ▼           ▼              ▼           ▼              ▼           ▼
┌─────────┐ ┌─────────┐   ┌─────────┐ ┌─────────┐   ┌─────────┐ ┌─────────┐
│ SOUS-   │ │ SOUS-   │   │ SOUS-   │ │ SOUS-   │   │ SOUS-   │ │ SOUS-   │
│ MODULE  │ │ MODULE  │   │ MODULE  │ │ MODULE  │   │ MODULE  │ │ MODULE  │
│ Liste   │ │ Créer   │   │Inventaire│ │ Status  │   │Factures │ │Paiements│
└─────────┘ └─────────┘   └─────────┘ └─────────┘   └─────────┘ └─────────┘
     │           │              │           │              │           │
     ▼           ▼              ▼           ▼              ▼           ▼
┌─────────┐ ┌─────────┐   ┌─────────┐ ┌─────────┐   ┌─────────┐ ┌─────────┐
│  EVNMT  │ │  EVNMT  │   │  EVNMT  │ │  EVNMT  │   │  EVNMT  │ │  EVNMT  │
│  TABLE  │ │  FORM   │   │  TABLE  │ │DASHBOARD│   │  TABLE  │ │  LIST   │
│ ✓ actif │ │ ✓ actif │   │ ✓ actif │ │ ✓ actif │   │ ✓ actif │ │ ✓ actif │
└─────────┘ └─────────┘   └─────────┘ └─────────┘   └─────────┘ └─────────┘
     │           │              │           │              │           │
     ▼           ▼              ▼           ▼              ▼           ▼
┌─────────┐ ┌─────────┐   ┌─────────┐ ┌─────────┐   ┌─────────┐ ┌─────────┐
│ CONFIG  │ │ CONFIG  │   │ CONFIG  │ │ CONFIG  │   │ CONFIG  │ │ CONFIG  │
│ columns │ │ fields  │   │ columns │ │ widgets │   │ columns │ │ columns │
│ actions │ │ validat.│   │ pageSize│ │  kpis   │   │ actions │ │ pageSize│
└─────────┘ └─────────┘   └─────────┘ └─────────┘   └─────────┘ └─────────┘
```

---

### 6. FLUX DE RENDU DYNAMIQUE

```
1. L'utilisateur navigue vers /modules/RESERVATIONS/RESERVATION_LIST

2. ModulePage.tsx charge les données :
   ├── Trouve le module avec codeM = "RESERVATIONS"
   ├── Trouve le sous-module avec codeS = "RESERVATION_LIST"
   └── Trouve l'événement actif (bactif = true)

3. Le composant dynamique est résolu :
   ├── componentType = "table" → TableComponent
   └── config = { columns: [...], pageSize: 20 }

4. Le composant est rendu avec la configuration :
   ├── TableComponent reçoit { sousModule, evnmt }
   ├── Extrait evnmt.config.columns
   ├── Génère les colonnes du tableau
   └── Affiche les données avec les actions configurées
```

---

## Cahier des Charges

### 1. Exigences Fonctionnelles

#### 1.1 Gestion des Utilisateurs
| Exigence | Priorité | Statut |
|----------|----------|--------|
| Authentification email/mot de passe | Haute | ✅ Implémenté |
| Rôles et permissions (Admin, Staff, Manager) | Haute | ✅ Implémenté |
| Profils utilisateurs | Moyenne | ✅ Implémenté |
| Récupération de mot de passe | Moyenne | 🔄 En cours |

#### 1.2 Gestion des Réservations
| Exigence | Priorité | Statut |
|----------|----------|--------|
| Création de réservation | Haute | ✅ Implémenté |
| Modification de réservation | Haute | ✅ Implémenté |
| Annulation de réservation | Haute | ✅ Implémenté |
| Recherche et filtrage | Haute | ✅ Implémenté |
| Check-in / Check-out | Haute | ✅ Implémenté |
| Calendrier de disponibilité | Moyenne | 📋 Planifié |
| Réservation en ligne (public) | Basse | 📋 Planifié |

#### 1.3 Gestion des Chambres
| Exigence | Priorité | Statut |
|----------|----------|--------|
| CRUD chambres | Haute | ✅ Implémenté |
| Gestion des statuts | Haute | ✅ Implémenté |
| Tarification par type | Haute | ✅ Implémenté |
| Planning de maintenance | Moyenne | 📋 Planifié |
| Photos des chambres | Basse | 📋 Planifié |

#### 1.4 Gestion des Clients
| Exigence | Priorité | Statut |
|----------|----------|--------|
| CRUD clients | Haute | ✅ Implémenté |
| Historique des séjours | Moyenne | ✅ Implémenté |
| Programme de fidélité | Moyenne | ✅ Implémenté |
| Import/Export données | Basse | 📋 Planifié |

#### 1.5 Facturation
| Exigence | Priorité | Statut |
|----------|----------|--------|
| Création de factures | Haute | ✅ Implémenté |
| Suivi des paiements | Haute | ✅ Implémenté |
| Multi-modes de paiement | Haute | ✅ Implémenté |
| Export PDF | Moyenne | 🔄 En cours |
| Rapports financiers | Moyenne | 📋 Planifié |

#### 1.6 Restaurant
| Exigence | Priorité | Statut |
|----------|----------|--------|
| Gestion des tables | Haute | ✅ Implémenté |
| Gestion du menu | Haute | ✅ Implémenté |
| Prise de commandes | Haute | ✅ Implémenté |
| Room service | Moyenne | ✅ Implémenté |
| Statistiques restaurant | Basse | 📋 Planifié |

---

### 2. Exigences Non-Fonctionnelles

#### 2.1 Performance
| Métrique | Objectif | Actuel |
|----------|----------|--------|
| Temps de chargement initial | < 3s | ~2s |
| Temps de réponse API | < 500ms | ~200ms |
| Utilisateurs simultanés | 50 | ✅ Supporté |
| Nombre de chambres | 200 | ✅ Supporté |

#### 2.2 Sécurité
| Exigence | Statut |
|----------|--------|
| Authentification JWT | ✅ Implémenté |
| Row Level Security (RLS) | ✅ Implémenté |
| HTTPS obligatoire | ✅ Implémenté |
| Validation des entrées | ✅ Implémenté |
| Protection CSRF | ✅ Implémenté |

#### 2.3 Compatibilité
| Navigateur | Version Minimum |
|------------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

#### 2.4 Responsive Design
| Breakpoint | Largeur | Statut |
|------------|---------|--------|
| Mobile | < 640px | ✅ Supporté |
| Tablet | 640px - 1024px | ✅ Supporté |
| Desktop | > 1024px | ✅ Supporté |

---

### 3. Contraintes Techniques

#### 3.1 Architecture
- **Frontend-first** : Application SPA React
- **API RESTful** : Communication JSON
- **Base de données relationnelle** : PostgreSQL via Supabase

#### 3.2 Déploiement
- **Production** : Lovable Cloud (Supabase)
- **Développement** : Spring Boot localhost:8081
- **CI/CD** : Déploiement automatique via Lovable

#### 3.3 Maintenance
- **Logs** : Console et Supabase Analytics
- **Monitoring** : Métriques via Lovable Cloud
- **Backups** : Automatiques via Supabase

---

## Guide de Développement

### Conventions de Code

#### Nommage
```typescript
// Composants : PascalCase
export function ReservationCard() {}

// Hooks : camelCase avec préfixe "use"
export function useReservations() {}

// Fichiers composants : PascalCase.tsx
// Fichiers hooks : camelCase.tsx
// Fichiers utilitaires : camelCase.ts

// Types/Interfaces : PascalCase
interface ReservationInput {}
type RoomStatus = 'available' | 'occupied';
```

#### Structure des Composants
```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Types/Interfaces (si locales)
interface Props {
  reservation: Reservation;
  onEdit: (r: Reservation) => void;
}

// 3. Composant
export function ReservationCard({ reservation, onEdit }: Props) {
  // 3.1 Hooks
  const [isOpen, setIsOpen] = useState(false);
  
  // 3.2 Handlers
  const handleEdit = () => onEdit(reservation);
  
  // 3.3 Render
  return (
    <Card>
      {/* JSX */}
    </Card>
  );
}
```

### Création d'un Nouveau Module

1. **Créer le hook** dans `src/hooks/`
```typescript
// useNewModule.tsx
export function useNewModule() {
  return useQuery({
    queryKey: ['newModule'],
    queryFn: api.getAll,
  });
}
```

2. **Créer la page** dans `src/pages/`
```typescript
// NewModule.tsx
export default function NewModule() {
  const { data, isLoading } = useNewModule();
  return <MainLayout title="Nouveau Module">...</MainLayout>;
}
```

3. **Ajouter la route** dans `App.tsx`
```typescript
<Route path="/new-module" element={<NewModule />} />
```

4. **Ajouter au menu** dans `Sidebar.tsx`

### Ajout d'un Composant Dynamique

1. **Créer le composant** dans `src/components/modules/`
2. **Enregistrer** dans `src/lib/initComponentRegistry.ts`
```typescript
registerComponent('NEW_TYPE', NewComponent);
```

---

## Annexes

### A. Variables d'Environnement

```env
# Production (Lovable Cloud)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbG...

# Développement (Spring Boot)
VITE_API_URL=http://localhost:8081/api
```

### B. Scripts NPM

```bash
npm run dev      # Démarrer en mode développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
npm run lint     # Vérifier le code
```

### C. Ressources

- [Documentation React](https://react.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation shadcn/ui](https://ui.shadcn.com/)
- [Documentation Supabase](https://supabase.com/docs)

---

*Document généré automatiquement - Dernière mise à jour : 22 Janvier 2026*
