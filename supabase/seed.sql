-- Seed data for local development
-- Replace the UUID below with an existing auth.users.id from your environment before running.
insert into public.profiles (id, full_name, job_role, subscription_tier, subscription_status, expires_at, features)
values (
  '00000000-0000-4000-8000-000000000001',
  'Dr. Demo Premium',
  'Urgentiste pédiatrique',
  'premium',
  'active',
  timezone('utc', now()) + interval '30 days',
  jsonb_build_object('can_access_drugs', true, 'can_download_pdf', true)
)
on conflict (id) do update set
  full_name = excluded.full_name,
  job_role = excluded.job_role,
  subscription_tier = excluded.subscription_tier,
  subscription_status = excluded.subscription_status,
  expires_at = excluded.expires_at,
  features = excluded.features,
  updated_at = timezone('utc', now());

insert into public.subscriptions (profile_id, provider, provider_customer_id, plan_code, status, current_period_end, metadata)
values (
  '00000000-0000-4000-8000-000000000001',
  'stripe',
  'cus_pediago_demo',
  'premium-monthly',
  'active',
  timezone('utc', now()) + interval '30 days',
  jsonb_build_object('trial', false)
)
on conflict (profile_id, provider, plan_code)
do update set
  status = excluded.status,
  current_period_end = excluded.current_period_end,
  metadata = excluded.metadata,
  updated_at = timezone('utc', now());

-- Seed protocol cards (free + premium)
with upsert as (
  insert into public.cards (slug, protocol, title, version, tags, icon, accent_color, sources, content, is_premium)
  values
    (
      'anaphylaxie',
      'anaphylaxie',
      'Anaphylaxie sévère',
      'V1.0',
      array['allergie','urgence'],
      '🧯',
      '#f97316',
      jsonb_build_array(
        jsonb_build_object('label', 'HAS – Réaction anaphylactique', 'url', 'https://www.has-sante.fr'),
        jsonb_build_object('label', 'SFAR – Protocoles allergie aiguë')
      ),
      jsonb_build_object(
        'summary', 'Prise en charge séquentielle de la réaction anaphylactique pédiatrique.',
        'cta', 'Préparer adrénaline IM + remplissage'
      ),
      false
    ),
    (
      'acr-enfant',
      'acr-enfant',
      'Arrêt cardio-respiratoire (ACR enfant)',
      'V1.1',
      array['reanimation','urgence'],
      '❤️‍🔥',
      '#ef4444',
      jsonb_build_array(
        jsonb_build_object('label', 'ERC 2021 – PALS', 'url', 'https://www.cprguidelines.eu'),
        jsonb_build_object('label', 'SRLF – Réanimation pédiatrique')
      ),
      jsonb_build_object('summary', 'Conduite en RCP avancée adaptée au poids et à l’équipement disponible.'),
      false
    ),
    (
      'eme',
      'eme',
      'État de mal épileptique (EME)',
      'V0.2',
      array['neuro','urgence'],
      '⚡️',
      '#8b5cf6',
      jsonb_build_array(
        jsonb_build_object('label', 'SFNP – Status epilepticus'),
        jsonb_build_object('label', 'HAS – Urgences neurologiques')
      ),
      jsonb_build_object('summary', 'Séquençage des bolus et perfusions antiépileptiques.', 'cta', 'Préparer benzodiazépine IV/IN'),
      true
    ),
    (
      'hypoglycemie',
      'hypoglycemie',
      'Hypoglycémie aiguë',
      'V0.9',
      array['metabolique','urgence'],
      '🍬',
      '#0ea5e9',
      jsonb_build_array(
        jsonb_build_object('label', 'HAS – Hypoglycémies de l’enfant'),
        jsonb_build_object('label', 'SFP – Algorithme hypoglycémie')
      ),
      jsonb_build_object('summary', 'Correction par paliers avec surveillance rapprochée.'),
      true
    )
  on conflict (slug) do update set
    protocol = excluded.protocol,
    title = excluded.title,
    version = excluded.version,
    tags = excluded.tags,
    icon = excluded.icon,
    accent_color = excluded.accent_color,
    sources = excluded.sources,
    content = excluded.content,
    is_premium = excluded.is_premium,
    updated_at = timezone('utc', now())
  returning id, slug
)
select * from upsert;

-- Sections for seeded cards
-- Anaphylaxie sections
with card_ref as (
  select id from public.cards where slug = 'anaphylaxie'
)
delete from public.card_sections where card_id = (select id from card_ref);

insert into public.card_sections (card_id, title, content, position)
select card_id, title, content, position
from (
  select
    (select id from public.cards where slug = 'anaphylaxie') as card_id,
    *
  from (values
    ('Diagnostic rapide', jsonb_build_object('bullets', jsonb_build_array('Confirmations cliniques immédiates', 'Retrait agent déclenchant', 'Surveillance de la saturation et de la TA')), 0),
    ('Traitement initial', jsonb_build_object('bullets', jsonb_build_array('Adrénaline IM 10 µg/kg (max 0,5 mg)', 'Voie veineuse + remplissage cristalloïdes 20 ml/kg', 'Oxygénothérapie haut débit')), 1),
    ('Escalade', jsonb_build_object('bullets', jsonb_build_array('Perfusion adrénaline si choc persistant', 'Préparation intubation difficile', 'Transfert vers réa pédiatrique')), 2)
  ) as rows(title, content, position)
) as data;

-- ACR sections
with card_ref as (
  select id from public.cards where slug = 'acr-enfant'
)
delete from public.card_sections where card_id = (select id from card_ref);

insert into public.card_sections (card_id, title, content, position)
select card_id, title, content, position
from (
  select
    (select id from public.cards where slug = 'acr-enfant') as card_id,
    *
  from (values
    ('Chaîne de survie', jsonb_build_object('bullets', jsonb_build_array('Reconnaissance immédiate', 'Appel équipe RCP', 'Préparation défibrillateur')), 0),
    ('RCP avancée', jsonb_build_object('bullets', jsonb_build_array('Compress 100-120/min', 'Adré IV 10 µg/kg toutes 3-5 min', 'Choc 4 J/kg si FV/TV')), 1)
  ) as rows(title, content, position)
) as data;

-- EME sections
with card_ref as (
  select id from public.cards where slug = 'eme'
)
delete from public.card_sections where card_id = (select id from card_ref);

insert into public.card_sections (card_id, title, content, position)
select card_id, title, content, position
from (
  select
    (select id from public.cards where slug = 'eme') as card_id,
    *
  from (values
    ('Phase 0-5 min', jsonb_build_object('bullets', jsonb_build_array('Stabilisation ABC', 'Glycémie capillaire', 'Accès IV ou IN')), 0),
    ('Phase 5-20 min', jsonb_build_object('bullets', jsonb_build_array('Benzodiazépine 1 (midazolam 0,2 mg/kg IN/IM)', 'Répéter une fois si nécessaire', 'Préparer antiépileptique de 2e ligne')), 1),
    ('Phase >20 min', jsonb_build_object('bullets', jsonb_build_array('Charge lévétiracétam 60 mg/kg', 'Prévoir intubation + sédation', 'Contact réa pour monitorage EEG')), 2)
  ) as rows(title, content, position)
) as data;

-- Hypoglycémie sections
with card_ref as (
  select id from public.cards where slug = 'hypoglycemie'
)
delete from public.card_sections where card_id = (select id from card_ref);

insert into public.card_sections (card_id, title, content, position)
select card_id, title, content, position
from (
  select
    (select id from public.cards where slug = 'hypoglycemie') as card_id,
    *
  from (values
    ('Évaluation initiale', jsonb_build_object('bullets', jsonb_build_array('Glycémie capillaire immédiate', 'Recherche signe neuro', 'Accès veineux ou IO')), 0),
    ('Bolus rapide', jsonb_build_object('bullets', jsonb_build_array('Glucose 10% : 2 ml/kg IV lent', 'Contrôle glycémie 5 min', 'Préparer perfusion continue')), 1),
    ('Stabilisation', jsonb_build_object('bullets', jsonb_build_array('Perf 10% à 5-8 mg/kg/min', 'Apport per os dès que possible', 'Investiguer cause métabolique')), 2)
  ) as rows(title, content, position)
) as data;
