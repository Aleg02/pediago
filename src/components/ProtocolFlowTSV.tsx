"use client";

import { useMemo } from "react";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";

const formatNumber = (value?: number, digits = 1) =>
  Number.isFinite(value) ? Number((value as number).toFixed(digits)).toString() : "—";

const formatDose = (value?: number, unit = "mg") =>
  Number.isFinite(value) ? `${formatNumber(value, value && value >= 10 ? 0 : 1)} ${unit}` : "—";

const formatEnergy = (value?: number) =>
  Number.isFinite(value) ? `${formatNumber(value, value && value >= 10 ? 0 : 1)} J` : "—";

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="space-y-3 text-sm text-slate-700">{children}</div>
    </div>
  );
}

function SubCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[13px] font-semibold text-slate-900">{title}</p>
      <div className="mt-2 space-y-2 text-sm text-slate-700">{children}</div>
    </div>
  );
}

export default function ProtocolFlowTSV() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const effWeight = useMemo(() => {
    if (!Number.isFinite(weightFromStore ?? NaN) || (weightFromStore as number) <= 0) return undefined;
    return Number((weightFromStore as number).toFixed(1));
  }, [weightFromStore]);

  const cardioFirstMin = useMemo(() => (effWeight ? effWeight * 0.5 : undefined), [effWeight]);
  const cardioFirstMax = useMemo(() => (effWeight ? effWeight * 1 : undefined), [effWeight]);
  const cardioSecond = useMemo(() => (effWeight ? effWeight * 2 : undefined), [effWeight]);

  const adenosineDose1 = useMemo(() => {
    if (!effWeight) return undefined;
    return Math.min(effWeight * 0.1, 6);
  }, [effWeight]);

  const adenosineDose2 = useMemo(() => {
    if (!effWeight) return undefined;
    return Math.min(effWeight * 0.2, 12);
  }, [effWeight]);

  const amiodaroneDose = useMemo(() => (effWeight ? effWeight * 5 : undefined), [effWeight]);
  const procainamideMin = useMemo(() => (effWeight ? effWeight * 10 : undefined), [effWeight]);
  const procainamideMax = useMemo(() => (effWeight ? effWeight * 15 : undefined), [effWeight]);

  return (
    <div className="w-full pb-6">
      <div className="rounded-3xl bg-gradient-to-b from-rose-500 to-rose-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[12px] uppercase tracking-[0.25em] text-white/70">Rythme rapide</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide">TACHYCARDIE SUPRAVENTRICULAIRE</h1>
        <p className="text-sm text-white/80">Diagnostics HAS · SFP · SFC · AHA/PALS · NICE</p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(value) => setAgeLabel(value)}
            weightKg={Number.isFinite(weightFromStore as number) ? (weightFromStore as number) : null}
            setWeightKg={(value) => setWeightKg(value ?? 0)}
          />
          <p className="mt-2 text-xs text-slate-500">
            Calculs dynamiques basés sur un poids effectif {Number.isFinite(effWeight) ? `${effWeight} kg` : "—"}.
          </p>
        </div>
      </div>

      <div className="mt-4 px-4 space-y-5">
        <SectionCard title="Évaluation initiale (ABCDE)" subtitle="Stabiliser le patient en &lt; 5 min">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>A – Libérer les voies aériennes si détresse, PLS si inconscient.</li>
            <li>B – SpO₂, O₂ 10 L/min si &lt; 94 % (objectif 94–98 %).</li>
            <li>
              C – TA, FC, TRC ; rechercher hypotension, marbrures, signes de choc ou d&rsquo;insuffisance cardiaque.
            </li>
            <li>D – GCS/AVPU, surveillance neurologique.</li>
            <li>E – Température, déshydratation, toxiques, cardiopathie connue.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Confirmation TSV (ECG)">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Tachycardie régulière à QRS fins &lt; 80 ms, FC &gt; 220 bpm nourrisson, &gt; 180 bpm enfant.</li>
            <li>Onde P rétrograde parfois masquée ; début et fin brusques.</li>
            <li>Différencier d&rsquo;une tachycardie sinusale (variabilité, contexte fébrile).</li>
          </ul>
        </SectionCard>

        <SectionCard title="Signes d'instabilité" subtitle="→ cardioversion immédiate">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Altération de conscience, GCS bas.</li>
            <li>Hypotension sévère, TRC &gt; 3 s, marbrures, choc ou défaillance cardiaque.</li>
            <li>Dyspnée sévère, œdème aigu pulmonaire, lactates élevés.</li>
          </ul>

          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-sm font-semibold text-rose-900">Cardioversion synchronisée</p>
            <ul className="mt-2 space-y-1.5 text-sm text-rose-900">
              <li>
                1ʳᵉ tentative 0,5–1 J/kg →
                <strong> {formatEnergy(cardioFirstMin)} – {formatEnergy(cardioFirstMax)}</strong>
              </li>
              <li>
                2ᵉ tentative 2 J/kg → <strong>{formatEnergy(cardioSecond)}</strong>
              </li>
              <li>Sédation/analgésie si conscience préservée (midazolam, kétamine selon protocole).</li>
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="Enfant stable hémodynamiquement" subtitle="Conduite séquentielle">
          <div className="space-y-3">
            <SubCard title="Étape 1 — Manœuvres vagales">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Nourrisson : immersion visage eau glacée 3–5 s (pas de massage oculaire).</li>
                <li>Enfant &gt; 5 ans : Valsalva modifié (expiration forcée dans seringue, jambes relevées).</li>
                <li>Réévaluer immédiatement ; si échec → adénosine.</li>
              </ul>
            </SubCard>

            <SubCard title="Étape 2 — Adénosine IV (bolus rapide + rinçage)">
              <ul className="space-y-2">
                <li>
                  Dose 1 = 0,1 mg/kg (max 6 mg) → <strong>{formatDose(adenosineDose1)}</strong>
                  <p className="text-xs text-slate-500">Injecter en 1–2 s via VVP proximale + 5–10 mL NaCl 0,9 %.</p>
                </li>
                <li>
                  Dose 2 = 0,2 mg/kg (max 12 mg) → <strong>{formatDose(adenosineDose2)}</strong>
                  <p className="text-xs text-slate-500">Administration identique si absence de conversion après 1ʳᵉ dose.</p>
                </li>
                <li>Contre-indiquée en cas de FA + syndrome de WPW.</li>
              </ul>
            </SubCard>

            <SubCard title="Étape 3 — Antiarythmiques si échec / CI adénosine">
              <ul className="space-y-2">
                <li>
                  Amiodarone IV 5 mg/kg sur 20–60 min → <strong>{formatDose(amiodaroneDose)}</strong>
                  <p className="text-xs text-slate-500">ECG continu, prévoir dilution dans G5 %.</p>
                </li>
                <li>
                  Procaïnamide IV 10–15 mg/kg sur 30–60 min → <strong>
                    {formatDose(procainamideMin)} – {formatDose(procainamideMax)}
                  </strong>
                </li>
                <li>Avis cardiopédiatre recommandé, surveillance tensionnelle rapprochée.</li>
              </ul>
            </SubCard>

            <SubCard title="Étape 4 — Cardioversion">
              <p>
                Si persistance de la TSV après antiarythmique ou si intolérance clinique → reprendre la cardioversion
                synchronisée (0,5–2 J/kg) et transférer en milieu spécialisé.
              </p>
            </SubCard>
          </div>
        </SectionCard>

        <SectionCard title="Traitements associés & surveillance">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>O₂ titré, monitorage ECG continu, TA invasive si choc.</li>
            <li>Corriger troubles hydro-électrolytiques, traiter fièvre (paracétamol 15 mg/kg).</li>
            <li>Bilan : ECG 12 dérivations, ionogramme, magnésium, bilan infectieux selon contexte.</li>
            <li>Éviter bêta-2, vérifier absence de WPW avant adénosine ; privilégier amiodarone/cardioversion si doute.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Orientation">
          <div className="grid gap-3">
            <SubCard title="Hospitalisation recommandée">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>TSV nécessitant adénosine, antiarythmique ou cardioversion.</li>
                <li>Récurrence, cardiopathie congénitale, suspicion voie accessoire (WPW).</li>
                <li>Instabilité initiale ou comorbidité (nourrisson &lt; 1 an).</li>
              </ul>
            </SubCard>
            <SubCard title="Critères de sortie">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Rythme sinusal stable &gt; 4 h, tolérance clinique, ECG normalisé.</li>
                <li>Avis cardiopédiatre obtenu + plan de suivi.</li>
                <li>Parents informés des signes d&rsquo;alerte et conduite à tenir en cas de récidive.</li>
              </ul>
            </SubCard>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
