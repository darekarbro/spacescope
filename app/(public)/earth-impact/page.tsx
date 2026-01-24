import Link from 'next/link';

import { earthImpacts } from '@/lib/earthImpactData';

export default function EarthImpactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Hackathon MVP</p>
          <h1 className="text-4xl font-bold text-slate-900">🌍 Earth Impact by Satellites</h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Mocked stories that show how earth observation satellites visualize agriculture, climate, disasters,
            and pollution. Every card opens a deeper storytelling page with before/after imagery and simple
            explanations.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          {earthImpacts.map((impact) => (
            <Link
              key={impact.id}
              href={`/earth-impact/${impact.id}`}
              className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_35px_80px_-50px_rgba(15,23,42,0.2)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl" aria-hidden>
                  {impact.emoji}
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                  View
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">{impact.title}</h2>
              <p className="mt-2 text-slate-600">{impact.summary}</p>
              <div className="mt-6 flex items-center justify-between text-sm font-semibold text-blue-600">
                <span>Explore details</span>
                <span aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
