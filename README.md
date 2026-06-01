# DermAssist — Assistant médical en dermatologie

Application web qui met à disposition un **assistant IA spécialisé en dermatologie**, répondant aux questions sur le cancer de la peau, le mélanome, les naevi (grains de beauté), la photoprotection et les lésions cutanées.

> ⚠️ **Avertissement médical** : cet outil fournit uniquement des informations à but éducatif. Il ne pose aucun diagnostic et ne remplace en aucun cas une consultation avec un dermatologue qualifié. En cas de doute, de lésion suspecte, d'évolution rapide, de saignement ou de démangeaison, consultez un professionnel de santé.

---

## Fonctionnalités

- **Questionnaire libre** — Posez vos questions sur la dermatologie dans un champ texte.
- **Réponses structurées** — L'assistant rédige des réponses claires en français, avec mise en forme Markdown.
- **Suggestions rapides** — Boutons d'exemples cliquables (règle ABCDE, signes de suspicion, protection solaire).
- **Recommandation systématique** — Chaque réponse se termine par un rappel à consulter un dermatologue.
- **Hors-sujet filtré** — L'assistant refuse poliment les questions non liées à la dermatologie.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + SSR/SSG) |
| Langage | TypeScript |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui (Radix + Tailwind) |
| IA | Lovable AI Gateway (Gemini 3 Flash Preview) |
| Validation | Zod |
| Build | Vite 7 |

---

## Prérequis

- [Bun](https://bun.sh/) (ou Node.js ≥ 18)
- Une clé `LOVABLE_API_KEY` configurée dans l'environnement (fournie par la plateforme Lovable)

---

## Installation & lancement local

```bash
# 1. Installer les dépendances
bun install

# 2. Lancer le serveur de développement
bun run dev
```

L'application est accessible sur `http://localhost:3000`.

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `bun run dev` | Serveur de développement avec hot reload |
| `bun run build` | Build de production |
| `bun run build:dev` | Build en mode développement |
| `bun run preview` | Prévisualiser le build de production |
| `bun run lint` | Linter ESLint |
| `bun run format` | Formater le code avec Prettier |

---

## Structure du projet

```
src/
├── components/ui/          # Composants shadcn/ui (boutons, cartes, dialogues…)
├── hooks/                  # Hooks React réutilisables
├── lib/
│   ├── ai-gateway.server.ts    # Client OpenAI-compatible vers Lovable AI Gateway
│   ├── dermato.functions.ts  # ServerFn : logique métier + prompt IA
│   └── utils.ts                # Utilitaires (cn, etc.)
├── routes/
│   ├── __root.tsx          # Layout racine (shell HTML)
│   ├── index.tsx           # Page d'accueil / assistant
│   └── api/                # Routes API serveur (si besoin)
├── router.tsx              # Configuration du router TanStack
├── server.ts               # Point d'entrée serveur
├── start.ts                # Configuration de l'instance Start
└── styles.css              # Design tokens CSS (variables oklch)
```

---

## Variables d'environnement

Ces variables sont injectées automatiquement par la plateforme Lovable. En local, elles peuvent être définies dans un fichier `.env` :

| Variable | Description |
|----------|-------------|
| `LOVABLE_API_KEY` | Clé d'accès à Lovable AI Gateway (obligatoire pour les réponses IA) |
| `VITE_SUPABASE_URL` | URL du projet Supabase (si utilisé) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clé publique Supabase |

> **Important** : les variables côté serveur (`process.env.LOVABLE_API_KEY`) ne sont jamais exposées au client.

---

## Fonctionnement de l'IA

La génération de réponses s'effectue côté serveur via une `createServerFn` :

1. L'utilisateur saisit une question (3 à 2000 caractères).
2. La question est envoyée au serveur via TanStack Start.
3. Le serveur appelle le modèle **Gemini 3 Flash Preview** via Lovable AI Gateway.
4. Un **system prompt strict** encadre le comportement de l'assistant :
   - Réponses dermatologiques uniquement
   - Aucun diagnostic définitif
   - Recommandation finale systématique de consulter un dermatologue
5. La réponse est renvoyée au client et affichée en Markdown.

---

## Personnalisation du thème

Les couleurs et le design system sont définis dans `src/styles.css` via des variables CSS en `oklch`. Pour modifier l'apparence :

- **Palette** : éditer les variables dans le bloc `:root`
- **Rayons de bordure** : ajuster `--radius`
- **Typographie** : modifier la famille de police dans `@layer base`

---

## Déploiement

L'application est conçue pour être déployée via la plateforme **Lovable**. Le build de production génère des assets statiques et des fonctions serverless compatibles Edge.

---

## Licence

Projet personnel / éducatif. Le code source est librement réutilisable dans un cadre non commercial avec mention de l'auteur.

---

*DermAssist — Informations à but éducatif uniquement. Ne remplace pas une consultation médicale.*
