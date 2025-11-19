# PediaGo

Assistant décisionnel pour l’urgence pédiatrique. L’application calcule automatiquement les posologies selon le poids/âge, affiche des protocoles séquentiels et réduit le risque d’erreurs pour les soignants.

## PediaGo en bref

- **Mission** : guider les équipes d’urgence pédiatrique (SMUR, réa, SAU) sur les bons gestes, médicaments et dosages en temps réel.
- **Stack** : Next.js (App Router) + Tailwind CSS pour le front, Supabase (Auth + Postgres) pour les données et l’authentification.
- **Cible** : médecins, infirmiers et internes qui ont besoin d’algorithmes fiables sans calcul mental.

## Installation & développement

```bash
npm install
npm run dev
```

L’interface est disponible sur [http://localhost:3000](http://localhost:3000). Configurez au minimum :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://jhynhvocvvwgggqqpkeb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoeW5odm9jdnZ3Z2dncXFwa2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMjUwMzcsImV4cCI6MjA3ODkwMTAzN30.D0rAOxiZl8c-gAkCuRMPVSjITShO_WEq7WrnkKcgNa0
```

## Abonnement Stripe (PediaGo+)

1. **Produit Stripe** : créez le produit « PediaGo+ Premium » dans Stripe et récupérez l’identifiant du prix (`STRIPE_PRICE_PREMIUM_ID`). Le code s’attend à un plan logique `premium-monthly` (surchargé via `STRIPE_PREMIUM_PLAN_CODE`).
2. **Variables d’environnement** :
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_PREMIUM_ID`
   - `STRIPE_WEBHOOK_SECRET` (signing secret envoyé par Stripe)
   - `STRIPE_PREMIUM_PLAN_CODE` *(optionnel)*
   - `SUPABASE_SERVICE_ROLE_KEY` (utilisé exclusivement par le webhook)
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Base Supabase** : lancez `supabase db push` pour créer `public.profiles`, `public.subscriptions` et la vue `public.user_entitlements`. La table `subscriptions` conserve `profile_id` (user_id), `status`, `current_period_end`, `metadata` Stripe.
4. **Checkout** : la page `/subscribe` propose le bouton « Passer Premium ». Elle appelle `POST /api/stripe/create-checkout-session`, qui crée la session via l’API Stripe (REST) puis redirige l’utilisateur.
5. **Webhook** : Stripe doit appeler `POST /api/stripe/webhook`. Le handler vérifie la signature (`verifyStripeSignature`), récupère l’abonnement et synchronise Supabase (`subscriptions` + `profiles.subscription_status / subscription_tier / expires_at`).
6. **Rafraîchissement des droits** : le hook `useUserEntitlements` interroge la vue `user_entitlements` et écoute en temps réel les mises à jour sur `profiles`. Les fiches premium et les redirections (ex : `/protocols/[slug]`) se mettent donc à jour automatiquement après paiement.

> ℹ️ Lors de la création du checkout, on envoie `metadata.supabase_user_id` et `metadata.plan_code` (ainsi que dans `subscription_data`). Le webhook s’appuie sur ces métadonnées pour rattacher les événements Stripe au bon utilisateur Supabase.

## Pages clés

- `/subscribe` : parcours d’abonnement (Stripe Checkout) + FAQ + messages de succès/annulation.
- `/mon-compte` : zone d’information (CTA vers Premium + rappel des raisons de redirection).
- `/api/stripe/create-checkout-session` : API route authentifiée (Supabase) qui crée une session Stripe.
- `/api/stripe/webhook` : webhook sécurisé qui met à jour Supabase.

## Scripts utiles

- `npm run dev` — serveur Next.js en mode développement.
- `npm run build` — compilation production.
- `npm run start` — serveur Next.js production.
- `npm run lint` — vérification ESLint.

## Déploiement

Projet compatible Vercel. Pensez à définir toutes les variables Stripe/Supabase sur Vercel (Production + Preview). Stripe doit pouvoir contacter `https://<domaine>/api/stripe/webhook`.
