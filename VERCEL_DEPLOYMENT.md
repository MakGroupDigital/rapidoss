# 🚀 Guide de déploiement Vercel - Rapidoss

## Étapes de déploiement

### 1. Prérequis
- Compte Vercel (gratuit sur [vercel.com](https://vercel.com))
- Repository GitHub : https://github.com/MakGroupDigital/rapidoss.git

### 2. Déploiement via l'interface Vercel

1. **Connectez-vous à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec votre compte GitHub

2. **Importez le projet**
   - Cliquez sur "Add New Project"
   - Sélectionnez le repository `MakGroupDigital/rapidoss`
   - Cliquez sur "Import"

3. **Configuration du projet**
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./` (racine)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)
   - **Install Command** : `npm install` (par défaut)

4. **Variables d'environnement** (optionnel)
   ```
   NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
   ```

5. **Déployez**
   - Cliquez sur "Deploy"
   - Attendez 2-3 minutes
   - Votre app sera disponible sur `https://rapidoss.vercel.app`

### 3. Déploiement via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer en preview
vercel

# Déployer en production
vercel --prod
```

### 4. Configuration du domaine personnalisé

1. Dans le dashboard Vercel, allez dans **Settings** > **Domains**
2. Ajoutez votre domaine personnalisé (ex: `rapidoss.com`)
3. Configurez les DNS selon les instructions Vercel
4. Mettez à jour la variable d'environnement :
   ```
   NEXT_PUBLIC_APP_URL=https://rapidoss.com
   ```

### 5. Déploiement automatique

Chaque push sur la branche `main` déclenchera automatiquement :
- ✅ Build de production
- ✅ Tests de qualité
- ✅ Déploiement automatique
- ✅ Preview URL pour chaque PR

### 6. Optimisations Vercel

Le projet est déjà optimisé pour Vercel avec :
- ✅ `vercel.json` configuré
- ✅ Headers de sécurité
- ✅ Région optimale (iad1 - US East)
- ✅ Next.js 15 avec App Router
- ✅ Images optimisées
- ✅ Code splitting automatique

### 7. Monitoring

Après déploiement, surveillez :
- **Analytics** : Trafic et performance
- **Logs** : Erreurs et warnings
- **Speed Insights** : Core Web Vitals
- **Real-time logs** : Debugging en temps réel

### 8. URLs importantes

- **Production** : https://rapidoss.vercel.app
- **Dashboard** : https://vercel.com/makgroupdigital/rapidoss
- **GitHub** : https://github.com/MakGroupDigital/rapidoss

### 9. Commandes utiles

```bash
# Voir les déploiements
vercel ls

# Voir les logs
vercel logs

# Promouvoir un déploiement en production
vercel promote [deployment-url]

# Supprimer un déploiement
vercel rm [deployment-url]
```

### 10. Troubleshooting

**Build échoue ?**
- Vérifiez les logs dans le dashboard Vercel
- Testez localement : `npm run build`
- Vérifiez les dépendances : `npm install`

**Variables d'environnement manquantes ?**
- Ajoutez-les dans Settings > Environment Variables
- Redéployez : `vercel --prod`

**Performance lente ?**
- Vérifiez Speed Insights
- Optimisez les images
- Utilisez le cache Vercel

### 11. Checklist post-déploiement

- [ ] Vérifier que l'app se charge correctement
- [ ] Tester la navigation client/driver
- [ ] Vérifier les cartes Leaflet
- [ ] Tester sur mobile
- [ ] Vérifier les métadonnées (Open Graph)
- [ ] Tester l'installation PWA
- [ ] Configurer le domaine personnalisé
- [ ] Activer Analytics
- [ ] Configurer les alertes

### 12. Support

- **Documentation Vercel** : https://vercel.com/docs
- **Support Vercel** : https://vercel.com/support
- **GitHub Issues** : https://github.com/MakGroupDigital/rapidoss/issues

---

**Déploiement réussi ! 🎉**

Votre application Rapidoss est maintenant en ligne et accessible au monde entier.
