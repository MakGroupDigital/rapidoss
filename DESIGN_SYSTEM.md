# Design System - Rapidoss

## 🎨 Palette de Couleurs

### Couleur Principale
```css
/* Bleu Rapidoss - Couleur dominante de la marque */
#005bff - Bleu primaire
#0047cc - Bleu foncé (hover states)
#0066ff - Bleu clair (highlights)
```

### Dégradés Bleus
```css
/* Dégradés principaux */
from-[#005bff] to-blue-600
from-[#005bff] to-[#0047cc]
from-blue-50 to-blue-100 (backgrounds)
from-blue-100 to-blue-200 (cards)
```

### Couleurs Secondaires
```css
#10B981 - Vert (succès, validation)
#EF4444 - Rouge (erreur, alerte)
#F59E0B - Orange (warning)
#FBBF24 - Jaune (rating)
```

### Couleurs Neutres
```css
#FFFFFF - Blanc
#F8FAFC - Gris très clair (background)
#E2E8F0 - Gris clair (borders)
#64748B - Gris moyen (text secondary)
#1E293B - Gris foncé (text primary)
```

## 🎭 Composants UI

### Boutons

#### Bouton Principal
```tsx
<button className="bg-gradient-to-r from-[#005bff] to-blue-600 text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 active:scale-95 transition-all">
  Texte du bouton
</button>
```

#### Bouton Secondaire
```tsx
<button className="bg-white border-2 border-[#005bff] text-[#005bff] py-4 px-6 rounded-2xl font-bold hover:bg-blue-50 transition-all">
  Texte du bouton
</button>
```

#### Bouton Tertiaire
```tsx
<button className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-4 px-6 rounded-2xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all">
  Texte du bouton
</button>
```

### Cartes

#### Carte Standard
```tsx
<div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-blue-100">
  {/* Contenu */}
</div>
```

#### Carte avec Gradient
```tsx
<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-[#005bff]/20">
  {/* Contenu */}
</div>
```

#### Carte Glassmorphism
```tsx
<div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-blue-100 shadow-lg">
  {/* Contenu */}
</div>
```

### Inputs

#### Input Standard
```tsx
<input 
  type="text"
  className="w-full bg-white border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:border-[#005bff] transition-all shadow-sm"
  placeholder="Placeholder"
/>
```

#### Textarea
```tsx
<textarea 
  className="w-full bg-white border-2 border-blue-100 rounded-xl px-4 py-3 h-20 resize-none focus:outline-none focus:border-[#005bff] transition-all shadow-sm"
  placeholder="Placeholder"
/>
```

### Badges

#### Badge Bleu
```tsx
<span className="inline-block px-3 py-1 bg-gradient-to-r from-[#005bff] to-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg shadow-blue-500/30">
  Badge
</span>
```

#### Badge Succès
```tsx
<span className="inline-block px-3 py-1 bg-gradient-to-r from-[#10B981] to-green-600 text-white text-xs font-bold rounded-full">
  Succès
</span>
```

### Icônes

#### Icône avec Fond Bleu
```tsx
<div className="w-10 h-10 bg-gradient-to-br from-[#005bff] to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
  <Icon className="text-white" size={20} />
</div>
```

#### Icône avec Fond Clair
```tsx
<div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center border-2 border-[#005bff]/20">
  <Icon className="text-[#005bff]" size={20} />
</div>
```

## 📐 Espacements

### Padding
```css
p-2  = 8px   (très petit)
p-3  = 12px  (petit)
p-4  = 16px  (moyen)
p-5  = 20px  (standard)
p-6  = 24px  (grand)
p-8  = 32px  (très grand)
```

### Margin
```css
m-2  = 8px   (très petit)
m-3  = 12px  (petit)
m-4  = 16px  (moyen)
m-6  = 24px  (standard)
m-8  = 32px  (grand)
```

### Gap
```css
gap-2 = 8px   (très petit)
gap-3 = 12px  (petit)
gap-4 = 16px  (moyen)
gap-6 = 24px  (grand)
```

## 🔤 Typographie

### Tailles de Police
```css
text-xs   = 12px  (très petit)
text-sm   = 14px  (petit)
text-base = 16px  (standard)
text-lg   = 18px  (grand)
text-xl   = 20px  (très grand)
text-2xl  = 24px  (titre)
text-3xl  = 30px  (grand titre)
```

### Poids de Police
```css
font-normal   = 400 (texte normal)
font-medium   = 500 (texte moyen)
font-semibold = 600 (texte semi-gras)
font-bold     = 700 (texte gras)
font-black    = 900 (texte très gras)
```

### Styles de Texte

#### Titre Principal
```tsx
<h1 className="text-3xl font-bold bg-gradient-to-r from-[#005bff] to-blue-600 bg-clip-text text-transparent">
  Titre
</h1>
```

#### Titre Secondaire
```tsx
<h2 className="text-2xl font-bold text-[#005bff]">
  Sous-titre
</h2>
```

#### Texte Standard
```tsx
<p className="text-base text-gray-600">
  Texte
</p>
```

## 🎬 Animations

### Transitions
```css
transition-all      (toutes les propriétés)
transition-colors   (couleurs uniquement)
transition-transform (transformations uniquement)
```

### Durées
```css
duration-150 = 150ms (rapide)
duration-200 = 200ms (standard)
duration-300 = 300ms (moyen)
duration-500 = 500ms (lent)
```

### Effets

#### Hover Scale
```tsx
<div className="hover:scale-105 transition-transform">
  {/* Contenu */}
</div>
```

#### Active Scale
```tsx
<button className="active:scale-95 transition-transform">
  {/* Contenu */}
</button>
```

#### Pulse
```tsx
<div className="animate-pulse">
  {/* Contenu */}
</div>
```

## 🌈 Ombres

### Ombres Standard
```css
shadow-sm  = petite ombre
shadow     = ombre moyenne
shadow-lg  = grande ombre
shadow-xl  = très grande ombre
shadow-2xl = ombre massive
```

### Ombres Colorées
```css
shadow-blue-500/30  = ombre bleue 30% opacité
shadow-blue-500/40  = ombre bleue 40% opacité
shadow-blue-500/50  = ombre bleue 50% opacité
shadow-green-500/30 = ombre verte 30% opacité
```

## 📱 Responsive

### Breakpoints
```css
sm: 640px   (mobile large)
md: 768px   (tablette)
lg: 1024px  (desktop)
xl: 1280px  (grand desktop)
2xl: 1536px (très grand desktop)
```

### Usage
```tsx
<div className="w-full sm:w-1/2 lg:w-1/3">
  {/* Contenu responsive */}
</div>
```

## 🎯 Bordures

### Border Radius
```css
rounded-lg   = 8px   (petit)
rounded-xl   = 12px  (moyen)
rounded-2xl  = 16px  (grand)
rounded-3xl  = 24px  (très grand)
rounded-full = 9999px (cercle)
```

### Border Width
```css
border    = 1px
border-2  = 2px
border-4  = 4px
```

### Border Colors
```css
border-blue-100     (clair)
border-blue-200     (moyen)
border-[#005bff]    (primaire)
border-[#005bff]/20 (primaire transparent)
```

## 🎨 Exemples de Compositions

### Header avec Glassmorphism
```tsx
<div className="bg-[#005bff]/90 backdrop-blur-md rounded-full p-1 flex items-center border border-white/20 shadow-lg">
  {/* Contenu */}
</div>
```

### Card avec Gradient et Bordure
```tsx
<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-[#005bff]/20 shadow-lg">
  {/* Contenu */}
</div>
```

### Bottom Sheet
```tsx
<div className="bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,91,255,0.2)] border-t-4 border-[#005bff] p-6">
  <div className="w-12 h-1.5 bg-gradient-to-r from-transparent via-[#005bff] to-transparent rounded-full mx-auto mb-6" />
  {/* Contenu */}
</div>
```

## 📋 Checklist Design

Lors de la création d'un nouveau composant, vérifier:

- [ ] Utilise le bleu #005bff de manière dominante
- [ ] A des ombres bleues (shadow-blue-500/XX)
- [ ] Utilise des gradients bleus
- [ ] A des bordures arrondies (rounded-2xl minimum)
- [ ] A des transitions fluides (transition-all)
- [ ] A des états hover et active
- [ ] Est responsive (mobile-first)
- [ ] A un contraste suffisant
- [ ] Utilise les espacements standards
- [ ] A des animations subtiles

## 🎯 Principes de Design

1. **Dominance du Bleu**: Le bleu #005bff doit être présent sur tous les éléments importants
2. **Gradients**: Utiliser des gradients pour donner de la profondeur
3. **Ombres Colorées**: Préférer les ombres bleues aux ombres grises
4. **Bordures**: Toujours utiliser des bordures bleues ou transparentes
5. **Animations**: Toutes les interactions doivent avoir un feedback visuel
6. **Cohérence**: Utiliser les mêmes patterns partout
7. **Modernité**: Design moderne avec glassmorphism et gradients
8. **Accessibilité**: Contraste suffisant et zones de tap adaptées

## 🚀 Utilisation

Pour créer un nouveau composant conforme au design system:

1. Commencer par une carte blanche avec bordure bleue
2. Ajouter un gradient bleu si c'est un élément important
3. Utiliser des icônes avec fond bleu dégradé
4. Ajouter des ombres bleues
5. Implémenter les états hover/active
6. Tester sur mobile et desktop
7. Vérifier l'accessibilité

Exemple complet:
```tsx
<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-[#005bff]/20 shadow-lg hover:shadow-xl transition-all">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 bg-gradient-to-br from-[#005bff] to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
      <Icon className="text-white" size={20} />
    </div>
    <h3 className="text-lg font-bold bg-gradient-to-r from-[#005bff] to-blue-600 bg-clip-text text-transparent">
      Titre
    </h3>
  </div>
  <p className="text-gray-600 mb-4">
    Description du composant
  </p>
  <button className="w-full bg-gradient-to-r from-[#005bff] to-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 active:scale-95 transition-all">
    Action
  </button>
</div>
```
