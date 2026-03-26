# Guide de Contribution - Rapidoss

## Standards de Code

### TypeScript
- Utiliser TypeScript strict mode
- Typer toutes les fonctions et variables
- Éviter `any`, préférer `unknown` si nécessaire
- Utiliser des interfaces pour les objets complexes

### React
- Composants fonctionnels uniquement
- Hooks pour la gestion d'état
- Props typées avec TypeScript
- Nommer les composants en PascalCase

### Styling
- Utiliser Tailwind CSS uniquement
- Pas de CSS inline sauf exceptions
- Classes utilitaires réutilisables
- Responsive design (mobile-first)

### Couleurs
- Primaire: `#005bff` ou `bg-[#005bff]`
- Succès: `#10B981` ou `bg-[#10B981]`
- Erreur: `#EF4444` ou `bg-[#EF4444]`
- Warning: `#F59E0B` ou `bg-[#F59E0B]`

### Animations
- Utiliser Motion (Framer Motion) pour animations complexes
- Transitions Tailwind pour effets simples
- Durée: 200-300ms pour micro-interactions
- Easing: ease-in-out par défaut

## Structure des Fichiers

```
app/
├── (auth)/           # Routes authentification
├── (client)/         # Routes client
├── (driver)/         # Routes livreur
├── (admin)/          # Routes admin
├── api/              # API routes
└── layout.tsx        # Layout global

components/
├── ui/               # Composants UI réutilisables
├── forms/            # Formulaires
├── maps/             # Composants carte
└── shared/           # Composants partagés

lib/
├── utils.ts          # Utilitaires
├── api.ts            # Client API
├── constants.ts      # Constantes
└── types.ts          # Types TypeScript

hooks/
├── use-auth.ts       # Hook authentification
├── use-location.ts   # Hook géolocalisation
└── use-mobile.ts     # Hook détection mobile
```

## Conventions de Nommage

### Fichiers
- Composants: `PascalCase.tsx`
- Hooks: `use-kebab-case.ts`
- Utils: `kebab-case.ts`
- Types: `PascalCase.types.ts`

### Variables
- camelCase pour variables et fonctions
- PascalCase pour composants et types
- UPPER_SNAKE_CASE pour constantes

### Commits
Format: `type(scope): message`

Types:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, style
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

Exemples:
```
feat(client): add order tracking
fix(map): correct marker positioning
docs(readme): update installation steps
```

## Workflow Git

1. Créer une branche depuis `main`
   ```bash
   git checkout -b feat/ma-fonctionnalite
   ```

2. Faire des commits atomiques
   ```bash
   git add .
   git commit -m "feat(client): add payment method selection"
   ```

3. Pousser et créer une Pull Request
   ```bash
   git push origin feat/ma-fonctionnalite
   ```

4. Attendre la review et merge

## Tests

### Tests Unitaires
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Tests E2E
```typescript
import { test, expect } from '@playwright/test';

test('client can create order', async ({ page }) => {
  await page.goto('/client');
  await page.click('text=Où livrer le colis ?');
  // ...
});
```

## Performance

### Optimisations
- Lazy loading des composants lourds
- Dynamic imports pour code splitting
- Memoization avec `useMemo` et `useCallback`
- Optimisation des images (next/image)
- Prefetch des routes importantes

### Métriques
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse Score > 90

## Accessibilité

- Utiliser des balises sémantiques
- Ajouter des labels ARIA
- Support clavier complet
- Contraste suffisant (WCAG AA)
- Tailles de texte lisibles

## Sécurité

- Valider toutes les entrées utilisateur
- Sanitizer les données
- Utiliser HTTPS uniquement
- Pas de secrets dans le code
- Rate limiting sur API

## Documentation

### Composants
```typescript
/**
 * Button component with multiple variants
 * 
 * @param variant - Style variant (primary, secondary, ghost)
 * @param size - Size variant (sm, md, lg)
 * @param children - Button content
 * @param onClick - Click handler
 */
export function Button({ variant, size, children, onClick }: ButtonProps) {
  // ...
}
```

### Fonctions
```typescript
/**
 * Calculate delivery price based on distance and weight
 * 
 * @param distance - Distance in kilometers
 * @param weight - Package weight in kilograms
 * @returns Price in Congolese Francs
 */
export function calculatePrice(distance: number, weight: number): number {
  // ...
}
```

## Questions?

Contactez l'équipe sur:
- Email: dev@rapidoss.com
- Slack: #rapidoss-dev
- GitHub Issues: github.com/rapidoss/app/issues
