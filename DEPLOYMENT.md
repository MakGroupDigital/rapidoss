# Guide de Déploiement - Rapidoss

## Prérequis

- Node.js 18+ installé
- npm ou yarn
- Compte sur la plateforme de déploiement choisie
- Variables d'environnement configurées

## Plateformes Recommandées

### 1. Vercel (Recommandé pour Next.js)

#### Avantages
- Optimisé pour Next.js
- Déploiement automatique depuis Git
- CDN global
- SSL gratuit
- Preview deployments

#### Déploiement

1. Installer Vercel CLI
```bash
npm i -g vercel
```

2. Se connecter
```bash
vercel login
```

3. Déployer
```bash
vercel
```

4. Production
```bash
vercel --prod
```

#### Configuration
Créer `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["cdg1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

### 2. Netlify

#### Déploiement

1. Installer Netlify CLI
```bash
npm i -g netlify-cli
```

2. Se connecter
```bash
netlify login
```

3. Initialiser
```bash
netlify init
```

4. Déployer
```bash
netlify deploy --prod
```

#### Configuration
Créer `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 3. AWS (Production Scale)

#### Services Nécessaires
- EC2 ou ECS pour l'application
- RDS pour la base de données
- S3 pour les fichiers statiques
- CloudFront pour le CDN
- Route 53 pour le DNS
- ElastiCache pour Redis

#### Déploiement avec Docker

1. Créer `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

2. Créer `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${API_URL}
    restart: unless-stopped
```

3. Build et push
```bash
docker build -t rapidoss-app .
docker tag rapidoss-app:latest your-registry/rapidoss-app:latest
docker push your-registry/rapidoss-app:latest
```

### 4. DigitalOcean App Platform

#### Déploiement

1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Choisir le plan (Basic $5/mois pour commencer)
4. Déployer

#### Configuration
Créer `.do/app.yaml`:
```yaml
name: rapidoss
region: fra
services:
- name: web
  github:
    repo: your-username/rapidoss
    branch: main
    deploy_on_push: true
  build_command: npm run build
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  http_port: 3000
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXT_PUBLIC_API_URL
    value: ${API_URL}
```

## Variables d'Environnement

### Production
Créer `.env.production`:
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.rapidoss.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_MPESA_API_KEY=your_mpesa_key
```

### Staging
Créer `.env.staging`:
```bash
NODE_ENV=staging
NEXT_PUBLIC_API_URL=https://api-staging.rapidoss.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_staging
```

## Build Optimisé

### Configuration Next.js
Dans `next.config.ts`:
```typescript
const nextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  images: {
    domains: ['api.rapidoss.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
  },
};
```

### Build
```bash
npm run build
```

### Analyse du bundle
```bash
npm run analyze
```

## Performance

### Optimisations
- Compression Gzip/Brotli activée
- Images optimisées avec next/image
- Code splitting automatique
- Lazy loading des composants
- Prefetch des routes importantes

### Monitoring
- Vercel Analytics
- Google Analytics
- Sentry pour les erreurs
- LogRocket pour les sessions

## Sécurité

### Headers de Sécurité
Dans `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        }
      ]
    }
  ];
}
```

### SSL/TLS
- Utiliser Let's Encrypt (gratuit)
- Forcer HTTPS
- HSTS activé

## CI/CD

### GitHub Actions
Créer `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Rollback

### Vercel
```bash
vercel rollback
```

### Docker
```bash
docker pull your-registry/rapidoss-app:previous-tag
docker-compose up -d
```

## Monitoring Post-Déploiement

### Checklist
- [ ] Application accessible
- [ ] SSL/HTTPS fonctionne
- [ ] API connectée
- [ ] Carte s'affiche correctement
- [ ] Authentification fonctionne
- [ ] Paiements fonctionnent
- [ ] Notifications fonctionnent
- [ ] Performance acceptable (< 3s)
- [ ] Pas d'erreurs dans les logs
- [ ] Analytics configuré

### Outils
- Uptime monitoring: UptimeRobot, Pingdom
- Performance: Lighthouse, WebPageTest
- Errors: Sentry
- Logs: Papertrail, Loggly

## Coûts Estimés

### Starter (0-100 utilisateurs)
- Vercel Hobby: Gratuit
- Total: $0/mois

### Growth (100-1000 utilisateurs)
- Vercel Pro: $20/mois
- Backend (DigitalOcean): $12/mois
- Database: $15/mois
- Redis: $10/mois
- Total: ~$60/mois

### Scale (1000+ utilisateurs)
- Vercel Enterprise: $150/mois
- AWS EC2/ECS: $100-500/mois
- RDS: $50-200/mois
- ElastiCache: $50/mois
- CloudFront: $50-200/mois
- Total: ~$400-1100/mois

## Support

Pour toute question sur le déploiement:
- Email: devops@rapidoss.com
- Slack: #rapidoss-devops
- Documentation: docs.rapidoss.com/deployment
