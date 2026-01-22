# 📡 Documentation API REST

## Vue d'ensemble

Cette documentation décrit l'API REST du système de gestion hôtelière. L'API supporte deux backends :
- **Lovable Cloud (Supabase)** - Backend cloud intégré
- **Spring Boot** - Backend Java personnalisé

---

## 🔐 Authentification

### Configuration

```typescript
// Headers requis pour toutes les requêtes authentifiées
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Endpoints d'authentification

#### POST `/api/auth/login`
Authentifie un utilisateur et retourne un token JWT.

**Requête :**
```json
{
  "email": "admin@hotel.com",
  "password": "motdepasse123"
}
```

**Réponse (200 OK) :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-user-123",
    "email": "admin@hotel.com",
    "firstName": "Admin",
    "lastName": "Hotel"
  }
}
```

**Erreurs possibles :**
| Code | Message | Description |
|------|---------|-------------|
| 401 | `Invalid credentials` | Email ou mot de passe incorrect |
| 422 | `Validation error` | Données manquantes ou invalides |

---

#### POST `/api/auth/signup`
Crée un nouveau compte utilisateur.

**Requête :**
```json
{
  "email": "nouveau@hotel.com",
  "password": "motdepasse123",
  "firstName": "Jean",
  "lastName": "Dupont"
}
```

**Réponse (201 Created) :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-user-456",
    "email": "nouveau@hotel.com",
    "firstName": "Jean",
    "lastName": "Dupont"
  }
}
```

---

#### POST `/api/auth/logout`
Déconnecte l'utilisateur actuel.

**Réponse (200 OK) :**
```json
{
  "message": "Déconnexion réussie"
}
```

---

#### GET `/api/auth/me`
Récupère les informations de l'utilisateur connecté.

**Réponse (200 OK) :**
```json
{
  "id": "uuid-user-123",
  "email": "admin@hotel.com",
  "firstName": "Admin",
  "lastName": "Hotel",
  "roles": ["admin", "receptionist"]
}
```

---

## 🏨 Chambres (Rooms)

### Modèle de données

```typescript
interface Room {
  id: string;                    // UUID unique
  number: string;                // Numéro de chambre (ex: "101")
  type: RoomType;                // 'standard' | 'deluxe' | 'suite' | 'presidential'
  capacity: number;              // Capacité maximale
  price_per_night: number;       // Prix par nuit (décimal)
  floor: number;                 // Étage
  status: RoomStatus;            // 'available' | 'occupied' | 'maintenance' | 'cleaning'
  description?: string;          // Description optionnelle
  amenities?: string[];          // Liste des équipements
  created_at: string;            // ISO 8601
  updated_at: string;            // ISO 8601
}
```

### Endpoints

#### GET `/api/rooms`
Liste toutes les chambres.

**Paramètres de requête :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `status` | string | Filtrer par statut |
| `type` | string | Filtrer par type |
| `floor` | number | Filtrer par étage |
| `minPrice` | number | Prix minimum |
| `maxPrice` | number | Prix maximum |

**Exemple :**
```
GET /api/rooms?status=available&type=deluxe
```

**Réponse (200 OK) :**
```json
[
  {
    "id": "uuid-room-1",
    "number": "101",
    "type": "deluxe",
    "capacity": 2,
    "price_per_night": 150.00,
    "floor": 1,
    "status": "available",
    "description": "Chambre deluxe avec vue sur jardin",
    "amenities": ["wifi", "tv", "minibar", "balcon"],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": "uuid-room-2",
    "number": "201",
    "type": "suite",
    "capacity": 4,
    "price_per_night": 300.00,
    "floor": 2,
    "status": "available",
    "amenities": ["wifi", "tv", "minibar", "jacuzzi", "salon"],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

---

#### GET `/api/rooms/:id`
Récupère une chambre par son ID.

**Réponse (200 OK) :**
```json
{
  "id": "uuid-room-1",
  "number": "101",
  "type": "deluxe",
  "capacity": 2,
  "price_per_night": 150.00,
  "floor": 1,
  "status": "available",
  "description": "Chambre deluxe avec vue sur jardin",
  "amenities": ["wifi", "tv", "minibar", "balcon"]
}
```

**Erreurs :**
| Code | Message |
|------|---------|
| 404 | `Room not found` |

---

#### POST `/api/rooms`
Crée une nouvelle chambre.

**Requête :**
```json
{
  "number": "302",
  "type": "standard",
  "capacity": 2,
  "price_per_night": 100.00,
  "floor": 3,
  "status": "available",
  "description": "Chambre standard confortable",
  "amenities": ["wifi", "tv"]
}
```

**Réponse (201 Created) :**
```json
{
  "id": "uuid-room-new",
  "number": "302",
  "type": "standard",
  "capacity": 2,
  "price_per_night": 100.00,
  "floor": 3,
  "status": "available",
  "description": "Chambre standard confortable",
  "amenities": ["wifi", "tv"],
  "created_at": "2024-01-20T14:00:00Z",
  "updated_at": "2024-01-20T14:00:00Z"
}
```

---

#### PUT `/api/rooms/:id`
Met à jour une chambre existante.

**Requête :**
```json
{
  "price_per_night": 120.00,
  "status": "maintenance",
  "description": "En rénovation jusqu'au 15 février"
}
```

**Réponse (200 OK) :**
```json
{
  "id": "uuid-room-1",
  "number": "101",
  "type": "deluxe",
  "capacity": 2,
  "price_per_night": 120.00,
  "floor": 1,
  "status": "maintenance",
  "description": "En rénovation jusqu'au 15 février",
  "amenities": ["wifi", "tv", "minibar", "balcon"],
  "updated_at": "2024-01-20T15:00:00Z"
}
```

---

#### DELETE `/api/rooms/:id`
Supprime une chambre.

**Réponse (204 No Content)**

---

## 👤 Clients (Guests)

### Modèle de données

```typescript
interface Guest {
  id: string;                    // UUID unique
  first_name: string;            // Prénom
  last_name: string;             // Nom
  email: string;                 // Email unique
  phone: string;                 // Téléphone
  nationality?: string;          // Nationalité
  id_type?: string;              // Type de pièce d'identité
  id_number?: string;            // Numéro de pièce d'identité
  vip: boolean;                  // Statut VIP
  loyalty_points: number;        // Points de fidélité
  total_stays: number;           // Nombre total de séjours
  notes?: string;                // Notes internes
  created_at: string;
  updated_at: string;
}
```

### Endpoints

#### GET `/api/guests`
Liste tous les clients.

**Paramètres de requête :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `search` | string | Recherche par nom, email ou téléphone |
| `vip` | boolean | Filtrer les clients VIP |
| `limit` | number | Limite de résultats (défaut: 50) |
| `offset` | number | Décalage pour pagination |

**Exemple :**
```
GET /api/guests?search=dupont&vip=true&limit=10
```

**Réponse (200 OK) :**
```json
[
  {
    "id": "uuid-guest-1",
    "first_name": "Marie",
    "last_name": "Dupont",
    "email": "marie.dupont@email.com",
    "phone": "+33612345678",
    "nationality": "Française",
    "vip": true,
    "loyalty_points": 1500,
    "total_stays": 12,
    "notes": "Client fidèle, préfère les chambres avec vue"
  }
]
```

---

#### GET `/api/guests/:id`
Récupère un client par son ID.

**Réponse (200 OK) :**
```json
{
  "id": "uuid-guest-1",
  "first_name": "Marie",
  "last_name": "Dupont",
  "email": "marie.dupont@email.com",
  "phone": "+33612345678",
  "nationality": "Française",
  "id_type": "passport",
  "id_number": "12AB34567",
  "vip": true,
  "loyalty_points": 1500,
  "total_stays": 12,
  "notes": "Client fidèle, préfère les chambres avec vue"
}
```

---

#### POST `/api/guests`
Crée un nouveau client.

**Requête :**
```json
{
  "first_name": "Pierre",
  "last_name": "Martin",
  "email": "pierre.martin@email.com",
  "phone": "+33698765432",
  "nationality": "Française",
  "id_type": "carte_identite",
  "id_number": "123456789012"
}
```

**Réponse (201 Created) :**
```json
{
  "id": "uuid-guest-new",
  "first_name": "Pierre",
  "last_name": "Martin",
  "email": "pierre.martin@email.com",
  "phone": "+33698765432",
  "nationality": "Française",
  "id_type": "carte_identite",
  "id_number": "123456789012",
  "vip": false,
  "loyalty_points": 0,
  "total_stays": 0,
  "created_at": "2024-01-20T14:00:00Z"
}
```

---

#### PUT `/api/guests/:id`
Met à jour un client.

**Requête :**
```json
{
  "vip": true,
  "loyalty_points": 500,
  "notes": "Nouveau client VIP suite à son séjour prolongé"
}
```

---

#### DELETE `/api/guests/:id`
Supprime un client.

**Réponse (204 No Content)**

---

## 📅 Réservations

### Modèle de données

```typescript
interface Reservation {
  id: string;                      // UUID unique
  reservation_number: string;      // Numéro auto-généré (ex: "R240120-1234")
  guest_id: string;                // Référence au client
  room_id: string;                 // Référence à la chambre
  check_in: string;                // Date d'arrivée (YYYY-MM-DD)
  check_out: string;               // Date de départ (YYYY-MM-DD)
  adults: number;                  // Nombre d'adultes
  children: number;                // Nombre d'enfants
  status: ReservationStatus;       // 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  source: ReservationSource;       // 'direct' | 'booking' | 'expedia' | 'airbnb' | 'phone' | 'email'
  total_amount: number;            // Montant total
  paid_amount: number;             // Montant payé
  special_requests?: string;       // Demandes spéciales
  created_by?: string;             // Créé par (user_id)
  created_at: string;
  updated_at: string;
  
  // Relations (incluses selon la requête)
  guest?: Guest;
  room?: Room;
}
```

### Endpoints

#### GET `/api/reservations`
Liste toutes les réservations.

**Paramètres de requête :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `status` | string | Filtrer par statut |
| `from` | string | Date de début (YYYY-MM-DD) |
| `to` | string | Date de fin (YYYY-MM-DD) |
| `guest_id` | string | Filtrer par client |
| `room_id` | string | Filtrer par chambre |

**Exemple :**
```
GET /api/reservations?status=confirmed&from=2024-01-01&to=2024-01-31
```

**Réponse (200 OK) :**
```json
[
  {
    "id": "uuid-res-1",
    "reservation_number": "R240115-4532",
    "guest_id": "uuid-guest-1",
    "room_id": "uuid-room-1",
    "check_in": "2024-01-20",
    "check_out": "2024-01-25",
    "adults": 2,
    "children": 1,
    "status": "confirmed",
    "source": "direct",
    "total_amount": 750.00,
    "paid_amount": 750.00,
    "special_requests": "Lit bébé requis",
    "guest": {
      "id": "uuid-guest-1",
      "first_name": "Marie",
      "last_name": "Dupont",
      "email": "marie.dupont@email.com"
    },
    "room": {
      "id": "uuid-room-1",
      "number": "101",
      "type": "deluxe"
    }
  }
]
```

---

#### GET `/api/reservations/today/arrivals`
Récupère les arrivées du jour.

**Réponse (200 OK) :**
```json
[
  {
    "id": "uuid-res-2",
    "reservation_number": "R240120-1234",
    "check_in": "2024-01-20",
    "check_out": "2024-01-22",
    "status": "confirmed",
    "guest": {
      "first_name": "Jean",
      "last_name": "Durand"
    },
    "room": {
      "number": "205",
      "type": "standard"
    }
  }
]
```

---

#### GET `/api/reservations/today/departures`
Récupère les départs du jour.

---

#### POST `/api/reservations`
Crée une nouvelle réservation.

**Requête :**
```json
{
  "guest_id": "uuid-guest-1",
  "room_id": "uuid-room-1",
  "check_in": "2024-02-01",
  "check_out": "2024-02-05",
  "adults": 2,
  "children": 0,
  "source": "direct",
  "total_amount": 600.00,
  "special_requests": "Arrivée tardive prévue vers 22h"
}
```

**Réponse (201 Created) :**
```json
{
  "id": "uuid-res-new",
  "reservation_number": "R240120-7890",
  "guest_id": "uuid-guest-1",
  "room_id": "uuid-room-1",
  "check_in": "2024-02-01",
  "check_out": "2024-02-05",
  "adults": 2,
  "children": 0,
  "status": "pending",
  "source": "direct",
  "total_amount": 600.00,
  "paid_amount": 0.00,
  "special_requests": "Arrivée tardive prévue vers 22h"
}
```

---

#### PUT `/api/reservations/:id`
Met à jour une réservation.

**Requête :**
```json
{
  "status": "checked_in",
  "paid_amount": 600.00
}
```

---

#### DELETE `/api/reservations/:id`
Annule/supprime une réservation.

---

## 💰 Facturation (Invoices)

### Modèle de données

```typescript
interface Invoice {
  id: string;                      // UUID unique
  invoice_number: string;          // Numéro auto-généré (ex: "F240120-5678")
  guest_id: string;                // Référence au client
  reservation_id?: string;         // Référence à la réservation (optionnel)
  type: InvoiceType;               // 'reservation' | 'restaurant' | 'service' | 'other'
  status: InvoiceStatus;           // 'draft' | 'pending' | 'paid' | 'cancelled'
  subtotal: number;                // Sous-total HT
  tax_rate: number;                // Taux de TVA (%)
  tax_amount: number;              // Montant TVA
  total_amount: number;            // Total TTC
  paid_amount: number;             // Montant payé
  due_date?: string;               // Date d'échéance
  notes?: string;                  // Notes
  created_by?: string;             // Créé par
  created_at: string;
  updated_at: string;
  
  // Relations
  guest?: Guest;
  reservation?: Reservation;
  items?: InvoiceItem[];
  payments?: Payment[];
}

interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  item_type: string;               // 'room' | 'service' | 'restaurant' | 'minibar' | 'other'
  quantity: number;
  unit_price: number;
  total_price: number;
}
```

### Endpoints

#### GET `/api/invoices`
Liste toutes les factures.

**Paramètres de requête :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `status` | string | Filtrer par statut |
| `type` | string | Filtrer par type |
| `guest_id` | string | Filtrer par client |
| `from` | string | Date de début |
| `to` | string | Date de fin |

**Réponse (200 OK) :**
```json
[
  {
    "id": "uuid-inv-1",
    "invoice_number": "F240120-5678",
    "guest_id": "uuid-guest-1",
    "reservation_id": "uuid-res-1",
    "type": "reservation",
    "status": "paid",
    "subtotal": 681.82,
    "tax_rate": 10.00,
    "tax_amount": 68.18,
    "total_amount": 750.00,
    "paid_amount": 750.00,
    "guest": {
      "first_name": "Marie",
      "last_name": "Dupont"
    }
  }
]
```

---

#### GET `/api/invoices/:id`
Récupère une facture avec ses détails.

**Réponse (200 OK) :**
```json
{
  "id": "uuid-inv-1",
  "invoice_number": "F240120-5678",
  "guest_id": "uuid-guest-1",
  "type": "reservation",
  "status": "paid",
  "subtotal": 681.82,
  "tax_rate": 10.00,
  "tax_amount": 68.18,
  "total_amount": 750.00,
  "paid_amount": 750.00,
  "items": [
    {
      "id": "uuid-item-1",
      "description": "Chambre Deluxe - 5 nuits",
      "item_type": "room",
      "quantity": 5,
      "unit_price": 136.36,
      "total_price": 681.82
    }
  ],
  "payments": [
    {
      "id": "uuid-pay-1",
      "amount": 750.00,
      "payment_method": "card",
      "created_at": "2024-01-25T10:00:00Z"
    }
  ]
}
```

---

#### POST `/api/invoices`
Crée une nouvelle facture.

**Requête :**
```json
{
  "guest_id": "uuid-guest-1",
  "reservation_id": "uuid-res-1",
  "type": "reservation",
  "tax_rate": 10.00,
  "due_date": "2024-02-15",
  "items": [
    {
      "description": "Chambre Deluxe - 5 nuits",
      "item_type": "room",
      "quantity": 5,
      "unit_price": 136.36
    },
    {
      "description": "Petit-déjeuner",
      "item_type": "service",
      "quantity": 10,
      "unit_price": 15.00
    }
  ]
}
```

---

#### POST `/api/invoices/:id/payments`
Ajoute un paiement à une facture.

**Requête :**
```json
{
  "amount": 300.00,
  "payment_method": "cash",
  "reference": "Acompte"
}
```

**Réponse (201 Created) :**
```json
{
  "id": "uuid-pay-new",
  "invoice_id": "uuid-inv-1",
  "amount": 300.00,
  "payment_method": "cash",
  "reference": "Acompte",
  "created_at": "2024-01-20T14:30:00Z"
}
```

---

## 🍽️ Restaurant

### Menu Items

#### GET `/api/restaurant/menu`
Liste tous les articles du menu.

**Paramètres :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `category` | string | Filtrer par catégorie |
| `available` | boolean | Filtrer les disponibles |

**Réponse (200 OK) :**
```json
[
  {
    "id": "uuid-menu-1",
    "name": "Steak Frites",
    "description": "Entrecôte grillée avec frites maison",
    "category": "plats",
    "price": 24.50,
    "available": true,
    "image_url": "https://..."
  },
  {
    "id": "uuid-menu-2",
    "name": "Salade César",
    "description": "Laitue romaine, parmesan, croûtons",
    "category": "entrées",
    "price": 12.00,
    "available": true
  }
]
```

---

#### POST `/api/restaurant/menu`
Ajoute un article au menu.

**Requête :**
```json
{
  "name": "Tiramisu",
  "description": "Dessert italien traditionnel",
  "category": "desserts",
  "price": 8.50,
  "available": true
}
```

---

### Tables

#### GET `/api/restaurant/tables`
Liste toutes les tables du restaurant.

**Réponse (200 OK) :**
```json
[
  {
    "id": "uuid-table-1",
    "number": "T1",
    "capacity": 4,
    "status": "available",
    "location": "intérieur"
  },
  {
    "id": "uuid-table-2",
    "number": "T2",
    "capacity": 2,
    "status": "occupied",
    "location": "terrasse"
  }
]
```

---

### Commandes (Orders)

#### GET `/api/restaurant/orders`
Liste les commandes du restaurant.

**Paramètres :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `status` | string | 'pending' \| 'preparing' \| 'ready' \| 'served' \| 'paid' |
| `table_id` | string | Filtrer par table |
| `date` | string | Filtrer par date |

**Réponse (200 OK) :**
```json
[
  {
    "id": "uuid-order-1",
    "order_number": "C240120-1234",
    "table_id": "uuid-table-1",
    "order_type": "dine_in",
    "status": "preparing",
    "subtotal": 49.00,
    "tax_amount": 4.90,
    "total_amount": 53.90,
    "items": [
      {
        "menu_item_id": "uuid-menu-1",
        "quantity": 2,
        "unit_price": 24.50,
        "total_price": 49.00,
        "status": "preparing",
        "notes": "Cuisson saignante"
      }
    ],
    "table": {
      "number": "T1"
    }
  }
]
```

---

#### POST `/api/restaurant/orders`
Crée une nouvelle commande.

**Requête :**
```json
{
  "table_id": "uuid-table-1",
  "order_type": "dine_in",
  "items": [
    {
      "menu_item_id": "uuid-menu-1",
      "quantity": 2,
      "notes": "Cuisson saignante"
    },
    {
      "menu_item_id": "uuid-menu-2",
      "quantity": 1
    }
  ],
  "notes": "Allergique aux noix"
}
```

---

## 📦 Modules Dynamiques

### Modules

#### GET `/api/v1/modules`
Liste tous les modules.

**Réponse (200 OK) :**
```json
[
  {
    "id": "uuid-mod-1",
    "code_m": "RES",
    "libelle": "Réservations",
    "ddeb": "2024-01-01",
    "dfin": null
  },
  {
    "id": "uuid-mod-2",
    "code_m": "REST",
    "libelle": "Restaurant",
    "ddeb": "2024-01-01",
    "dfin": null
  }
]
```

---

#### POST `/api/v1/modules`
Crée un nouveau module.

**Requête :**
```json
{
  "code_m": "SPA",
  "libelle": "Spa & Wellness",
  "ddeb": "2024-02-01"
}
```

---

### Sous-Modules

#### GET `/api/v1/sousModules`
Liste tous les sous-modules.

**Paramètres :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `module_id` | string | Filtrer par module parent |

**Réponse (200 OK) :**
```json
[
  {
    "id": "uuid-sm-1",
    "code_s": "RES-LIST",
    "libelle": "Liste des réservations",
    "module_id": "uuid-mod-1",
    "ddeb": "2024-01-01",
    "module": {
      "id": "uuid-mod-1",
      "code_m": "RES",
      "libelle": "Réservations"
    }
  }
]
```

---

### Événements (Evnmts)

#### GET `/api/v1/evnmts`
Liste tous les événements (composants dynamiques).

**Réponse (200 OK) :**
```json
[
  {
    "id": "uuid-evt-1",
    "code_evnmt": "RES-LIST-TABLE",
    "libelle": "Tableau des réservations",
    "sous_module_id": "uuid-sm-1",
    "component_type": "table",
    "bactif": true,
    "config": {
      "columns": [
        {
          "key": "reservation_number",
          "label": "N° Réservation",
          "type": "string"
        },
        {
          "key": "guest.name",
          "label": "Client",
          "type": "string"
        },
        {
          "key": "check_in",
          "label": "Arrivée",
          "type": "date"
        },
        {
          "key": "status",
          "label": "Statut",
          "type": "badge"
        }
      ],
      "actions": ["view", "edit", "delete"]
    }
  }
]
```

---

#### POST `/api/v1/evnmts`
Crée un nouvel événement.

**Requête :**
```json
{
  "code_evnmt": "SPA-BOOK-FORM",
  "libelle": "Formulaire de réservation spa",
  "sous_module_id": "uuid-sm-spa",
  "component_type": "form",
  "bactif": true,
  "config": {
    "fields": [
      {
        "name": "service",
        "label": "Service",
        "type": "select",
        "required": true,
        "options": [
          { "value": "massage", "label": "Massage" },
          { "value": "sauna", "label": "Sauna" },
          { "value": "hammam", "label": "Hammam" }
        ]
      },
      {
        "name": "date",
        "label": "Date",
        "type": "date",
        "required": true
      },
      {
        "name": "duration",
        "label": "Durée (minutes)",
        "type": "number",
        "min": 30,
        "max": 120
      }
    ]
  }
}
```

---

## 🔄 Codes de réponse HTTP

| Code | Signification | Usage |
|------|---------------|-------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée |
| 204 | No Content | Suppression réussie |
| 400 | Bad Request | Requête invalide |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Accès refusé |
| 404 | Not Found | Ressource inexistante |
| 409 | Conflict | Conflit (ex: email déjà utilisé) |
| 422 | Unprocessable Entity | Validation échouée |
| 500 | Internal Server Error | Erreur serveur |

---

## 📊 Format des erreurs

Toutes les erreurs suivent ce format :

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Les données fournies sont invalides",
    "details": [
      {
        "field": "email",
        "message": "Format email invalide"
      },
      {
        "field": "phone",
        "message": "Le numéro de téléphone est requis"
      }
    ]
  }
}
```

---

## 🔧 Configuration CORS

Pour les environnements de développement et production :

```java
// Spring Boot SecurityConfig
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList(
        "http://localhost:5173",
        "http://localhost:8080",
        "https://*.lovableproject.com",
        "https://*.lovable.app"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

## 📝 Notes d'implémentation

### Différences Supabase vs Spring Boot

| Aspect | Supabase (Lovable Cloud) | Spring Boot |
|--------|--------------------------|-------------|
| Format des champs | `snake_case` | `camelCase` |
| IDs | UUID (string) | Long ou UUID |
| Authentification | Supabase Auth + RLS | JWT custom |
| Base URL | Auto-configurée | `/api/v1/...` |

### Adaptateurs de données

Le frontend utilise des adaptateurs pour normaliser les données :

```typescript
// src/lib/adapters.ts
export const normalizeRoom = (room: ApiRoom | SupabaseRoom): UnifiedRoom => {
  if ('price_per_night' in room) {
    // Supabase format
    return {
      id: room.id,
      number: room.number,
      price: room.price_per_night,  // Mapping snake_case → camelCase
      // ...
    };
  } else {
    // Spring Boot format
    return {
      id: room.id,
      number: room.number,
      price: room.price,
      // ...
    };
  }
};
```

---

*Documentation générée le 22 janvier 2026*
*Version API : 1.0.0*
