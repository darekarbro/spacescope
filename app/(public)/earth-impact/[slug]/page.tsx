import Link from 'next/link';
import { notFound } from 'next/navigation';

import { earthImpacts } from '@/lib/earthImpactData';

export function generateStaticParams() {
  return earthImpacts.map((impact) => ({
    slug: impact.id,
  }));
}

export default async function EarthImpactDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const impact = earthImpacts.find((story) => story.id === slug);

  if (!impact) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <Link
          className="text-sm font-semibold text-blue-600 hover:text-blue-800"
          href="/earth-impact"
        >
          ← Back to Earth Impact home
        </Link>

        <header className="rounded-3xl bg-white p-8 shadow-[0_35px_65px_-45px_rgba(15,23,42,0.4)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Story Mode</p>
              <h1 className="mt-2 text-4xl font-bold text-slate-900">
                {impact.emoji} {impact.title} Monitoring
              </h1>
              <p className="mt-2 max-w-3xl text-lg text-slate-600">{impact.summary}</p>
            </div>
            <div className="text-5xl" aria-hidden>
              {impact.emoji}
            </div>
          </div>
        </header>

        <section className="rounded-3xl bg-white p-8 shadow-[0_25px_45px_-40px_rgba(15,23,42,0.3)]">
          <h2 className="text-xl font-semibold text-slate-900">Problem</h2>
          <p className="mt-3 text-slate-600">{impact.problem}</p>
          {impact.problem_highlights && (
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {impact.problem_highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-8 shadow-[0_25px_45px_-40px_rgba(15,23,42,0.3)]">
            <h3 className="text-lg font-semibold text-slate-900">Satellite Used</h3>
            <p className="mt-2 text-sm text-slate-500">
              Mocked satellite names to keep the storytelling grounded.
            </p>
            <div className="mt-4 space-y-3">
              {impact.satellite_used.map((satellite) => (
                <div key={satellite} className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-slate-300" aria-hidden />
                  <span className="text-sm font-semibold text-slate-700">{satellite}</span>
                </div>
              ))}
            </div>
          </section>

          {impact.what_is_tracked && (
            <section className="rounded-3xl bg-white p-8 shadow-[0_25px_45px_-40px_rgba(15,23,42,0.3)]">
              <h3 className="text-lg font-semibold text-slate-900">What is Tracked</h3>
              <div className="mt-4 space-y-3">
                {impact.what_is_tracked.map((item) => (
                  <p key={item} className="text-sm text-slate-600">
                    • {item}
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>

        {impact.disasters_covered && (
          <section className="rounded-3xl bg-white p-8 shadow-[0_25px_45px_-40px_rgba(15,23,42,0.3)]">
            <h3 className="text-lg font-semibold text-slate-900">Disasters Covered</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {impact.disasters_covered.map((item) => (
                <span
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        )}

        {impact.monitors && (
          <section className="rounded-3xl bg-white p-8 shadow-[0_25px_45px_-40px_rgba(15,23,42,0.3)]">
            <h3 className="text-lg font-semibold text-slate-900">Monitors</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {impact.monitors.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        )}

        {impact.how_it_helps && (
          <section className="rounded-3xl bg-white p-8 shadow-[0_25px_45px_-40px_rgba(15,23,42,0.3)]">
            <h3 className="text-lg font-semibold text-slate-900">How Satellites Help</h3>
            <div className="mt-4 space-y-3">
              {impact.how_it_helps.map((detail) => (
                <p key={detail} className="text-sm leading-relaxed text-slate-600">
                  • {detail}
                </p>
              ))}
            </div>
          </section>
        )}

        {impact.why_it_matters && (
          <section className="rounded-3xl bg-white p-8 shadow-[0_25px_45px_-40px_rgba(15,23,42,0.3)]">
            <h3 className="text-lg font-semibold text-slate-900">Why It Matters</h3>
            <p className="mt-3 text-slate-600">{impact.why_it_matters}</p>
          </section>
        )}

        <section className="rounded-3xl bg-white p-8 shadow-[0_25px_45px_-40px_rgba(15,23,42,0.3)]">
          <h3 className="text-lg font-semibold text-slate-900">Results</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {impact.result.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-[0_25px_45px_-40px_rgba(15,23,42,0.3)]">
          <h3 className="text-lg font-semibold text-slate-900">Visual Story</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <figure className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <img
                className="h-56 w-full object-cover rounded-2xl"
                src={impact.image_before.src}
                alt={impact.image_before.alt}
                loading="lazy"
              />
              <figcaption className="mt-3 text-sm font-semibold text-slate-700">
                {impact.image_before.label}
              </figcaption>
            </figure>
            <figure className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <img
                className="h-56 w-full object-cover rounded-2xl"
                src={impact.image_after.src}
                alt={impact.image_after.alt}
                loading="lazy"
              />
              <figcaption className="mt-3 text-sm font-semibold text-slate-700">
                {impact.image_after.label}
              </figcaption>
            </figure>
          </div>
          {impact.extras && (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {impact.extras.map((visual) => (
                <figure key={visual.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <img
                    className="h-44 w-full object-cover rounded-2xl"
                    src={visual.src}
                    alt={visual.alt}
                    loading="lazy"
                  />
                  <figcaption className="mt-3 text-sm font-semibold text-slate-700">
                    {visual.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}