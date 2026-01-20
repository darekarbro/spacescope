import React from 'react';
import SimpleMarkdown from '@/components/ui/SimpleMarkdown';
import Link from 'next/link';
import { MISSIONS } from '@/mock/missionsData';
import type { Mission } from '@/types/mission';

interface Props {
  mission: Mission;
}

const MissionDetail: React.FC<Props> = ({ mission }) => {
  const launch = mission.launch_date ? new Date(mission.launch_date) : null;
  const ret = mission.return_date ? new Date(mission.return_date) : null;

  let duration = undefined;
  if (launch && ret) {
    const diff = Math.abs(ret.getTime() - launch.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    duration = `${days} days`;
  }

  const related = (mission.related_ids || [])
    .map((id) => MISSIONS.find((m) => m.id === id))
    .filter(Boolean) as Mission[];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* A. Hero */}
      <section className="relative rounded-lg overflow-hidden">
        {mission.banner_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mission.banner_image} alt={`${mission.name} banner`} className="w-full h-64 object-cover opacity-60" />
        ) : (
          <div className="w-full h-64 bg-gradient-to-b from-black to-neutral-800 opacity-60" />
        )}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-6 py-8 text-white">
            <h1 className="text-3xl md:text-5xl font-bold">{mission.name}</h1>
            <p className="mt-2 text-neutral-200 max-w-2xl">{mission.description}</p>
          </div>
        </div>
      </section>

      {/* B. Stats Panel */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded">
            <div className="text-xs text-neutral-500">Launch Date</div>
            <div className="font-medium">{launch ? launch.toDateString() : 'TBD'}</div>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded">
            <div className="text-xs text-neutral-500">Return Date</div>
            <div className="font-medium">{ret ? ret.toDateString() : '—'}</div>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded">
            <div className="text-xs text-neutral-500">Mission Duration</div>
            <div className="font-medium">{duration ?? '—'}</div>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded">
            <div className="text-xs text-neutral-500">Status</div>
            <div className="font-medium capitalize">{mission.status}</div>
          </div>
        </div>
      </section>

      {/* C. Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Mission Overview</h2>
        <SimpleMarkdown text={mission.description} />
      </section>

      {/* D. Mission Timeline */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Mission Timeline</h2>
        <div className="space-y-4">
          {(mission.timeline || []).map((ev, i) => (
            <div key={i} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded">
              <div className="text-xs text-neutral-500">{ev.date}</div>
              <div className="font-medium">{ev.title}</div>
              {ev.description && <div className="text-neutral-700 dark:text-neutral-300 mt-1">{ev.description}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* E. Meet the Crew */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Meet the Crew</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(mission.crew || []).map((c, i) => (
            <div key={i} className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded text-center">
              <img src={c.photo || '/images/crew/default.jpg'} alt={c.name} className="mx-auto h-24 w-24 rounded-full object-cover mb-2" />
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-neutral-500">{c.role}</div>
              {c.country && <div className="text-sm text-neutral-400">{c.country}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* F. Research / Objectives */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Research & Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(mission.objectives || []).map((o, i) => (
            <div key={i} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded">
              {o}
            </div>
          ))}
        </div>
      </section>

      {/* G. Related Missions */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Related Missions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {related.slice(0, 3).map((r) => (
              <Link key={r.id} href={`/missions/${r.id}`} className="block">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded hover:shadow-lg transition">
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-sm text-neutral-500">{r.agency}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MissionDetail;
