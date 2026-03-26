# API Documentation - Rapidoss

## Base URL
```
Production: https://api.rapidoss.com/v1
Development: http://localhost:4000/v1
```

## Authentication
Toutes les requêtes authentifiées nécessitent un token JWT dans le header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Créer un nouveau compte

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+243123456789",
  "role": "client" | "driver"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "client"
  },
  "token": "jwt_token"
}
```

#### POST /auth/login
Se connecter

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /auth/google
Authentification Google OAuth

**Body:**
```json
{
  "idToken": "google_id_token"
}
```

### Users

#### GET /users/me
Obtenir le profil de l'utilisateur connecté

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+243123456789",
  "role": "client",
  "avatar": "https://...",
  "rating": 4.8,
  "totalOrders": 42
}
```

#### PATCH /users/me
Mettre à jour le profil

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+243123456789",
  "avatar": "base64_image"
}
```

### Orders (Client)

#### POST /orders
Créer une nouvelle course

**Body:**
```json
{
  "pickup": {
    "address": "14 Rue de la Paix, Gombe",
    "lat": -4.3200,
    "lng": 15.3100,
    "instructions": "Appeler en arrivant"
  },
  "transit": {
    "address": "Optional transit point",
    "lat": -4.3250,
    "lng": 15.3150
  },
  "dropoff": {
    "address": "89 Avenue Kasa-Vubu",
    "lat": -4.3400,
    "lng": 15.3300,
    "instructions": "Code porte 1234"
  },
  "package": {
    "type": "small" | "medium" | "large",
    "weight": 1.5,
    "description": "Documents fragiles"
  },
  "paymentMethod": "mobile_money" | "cash"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "pending",
  "price": 4000,
  "estimatedDuration": 18,
  "distance": 4.2,
  "createdAt": "2024-01-01T12:00:00Z"
}
```

#### GET /orders
Liste des courses du client

**Query params:**
- `status`: pending | accepted | in_progress | completed | cancelled
- `page`: 1
- `limit`: 20

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "status": "completed",
      "price": 4000,
      "pickup": {...},
      "dropoff": {...},
      "driver": {
        "id": "uuid",
        "firstName": "Didier",
        "lastName": "K.",
        "rating": 4.9,
        "vehicle": "Honda PCX"
      },
      "createdAt": "2024-01-01T12:00:00Z",
      "completedAt": "2024-01-01T12:30:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "pages": 3
}
```

#### GET /orders/:id
Détails d'une course

#### PATCH /orders/:id/cancel
Annuler une course

### Orders (Driver)

#### GET /orders/available
Courses disponibles à proximité

**Query params:**
- `lat`: -4.3276
- `lng`: 15.3136
- `radius`: 5 (km)

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "price": 4000,
      "distance": 4.2,
      "estimatedDuration": 18,
      "pickup": {...},
      "dropoff": {...},
      "expiresAt": "2024-01-01T12:05:00Z"
    }
  ]
}
```

#### POST /orders/:id/accept
Accepter une course

#### POST /orders/:id/pickup
Confirmer la récupération du colis

**Body:**
```json
{
  "photo": "base64_image",
  "notes": "Colis récupéré"
}
```

#### POST /orders/:id/deliver
Confirmer la livraison

**Body:**
```json
{
  "photo": "base64_image",
  "signature": "base64_signature",
  "notes": "Livré au destinataire"
}
```

### Location (Driver)

#### POST /location
Mettre à jour la position du livreur

**Body:**
```json
{
  "lat": -4.3276,
  "lng": 15.3136,
  "heading": 45,
  "speed": 30
}
```

#### GET /location/:driverId
Obtenir la position d'un livreur (pour le client)

### Payments

#### POST /payments/mobile-money
Initier un paiement Mobile Money

**Body:**
```json
{
  "orderId": "uuid",
  "provider": "mpesa" | "orange" | "airtel",
  "phone": "+243123456789",
  "amount": 4000
}
```

**Response:**
```json
{
  "transactionId": "uuid",
  "status": "pending",
  "message": "Veuillez confirmer le paiement sur votre téléphone"
}
```

#### GET /payments/:transactionId
Vérifier le statut d'un paiement

### Ratings

#### POST /ratings
Noter une course

**Body:**
```json
{
  "orderId": "uuid",
  "rating": 5,
  "comment": "Excellent service!",
  "tags": ["ponctuel", "professionnel", "sympathique"]
}
```

### Statistics (Driver)

#### GET /statistics/earnings
Statistiques de gains

**Query params:**
- `period`: today | week | month | year
- `startDate`: 2024-01-01
- `endDate`: 2024-01-31

**Response:**
```json
{
  "totalEarnings": 125000,
  "totalOrders": 42,
  "averageRating": 4.8,
  "completionRate": 98.5,
  "onlineHours": 120,
  "breakdown": {
    "base": 84000,
    "distance": 35000,
    "weight": 6000
  }
}
```

## WebSocket Events

### Connection
```javascript
const socket = io('wss://api.rapidoss.com', {
  auth: { token: 'jwt_token' }
});
```

### Events (Client)

#### order:status
Mise à jour du statut de la course
```json
{
  "orderId": "uuid",
  "status": "accepted" | "in_progress" | "completed",
  "driver": {...}
}
```

#### driver:location
Position du livreur en temps réel
```json
{
  "orderId": "uuid",
  "lat": -4.3276,
  "lng": 15.3136,
  "heading": 45,
  "eta": 15
}
```

### Events (Driver)

#### order:new
Nouvelle course disponible
```json
{
  "orderId": "uuid",
  "price": 4000,
  "pickup": {...},
  "dropoff": {...},
  "expiresIn": 15
}
```

## Error Responses

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email ou mot de passe incorrect",
    "details": {}
  }
}
```

### Error Codes
- `INVALID_CREDENTIALS`: Identifiants incorrects
- `UNAUTHORIZED`: Non authentifié
- `FORBIDDEN`: Accès refusé
- `NOT_FOUND`: Ressource introuvable
- `VALIDATION_ERROR`: Erreur de validation
- `ORDER_EXPIRED`: Course expirée
- `ORDER_ALREADY_ACCEPTED`: Course déjà acceptée
- `INSUFFICIENT_BALANCE`: Solde insuffisant
- `PAYMENT_FAILED`: Paiement échoué

## Rate Limiting
- 100 requêtes par minute pour les endpoints publics
- 1000 requêtes par minute pour les endpoints authentifiés
- 10 requêtes par seconde pour les mises à jour de position

## Pagination
Tous les endpoints de liste supportent la pagination:
```
GET /orders?page=1&limit=20
```

Response headers:
```
X-Total-Count: 42
X-Page: 1
X-Per-Page: 20
X-Total-Pages: 3
```

## Versioning
L'API utilise le versioning dans l'URL: `/v1/`, `/v2/`, etc.
Les anciennes versions sont maintenues pendant 6 mois après la sortie d'une nouvelle version.
