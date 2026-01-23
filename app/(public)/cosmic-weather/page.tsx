import { WEATHER_ENDPOINTS } from '@/lib/api/endpoints';
import type { CosmicWeatherData, WeatherLevel } from '@/types/weather';

// Force dynamic rendering (no caching for real-time weather data)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// API Response wrapper type
interface ApiResponse {
  success: boolean;
  data: CosmicWeatherData;
  message: string;
}

// Fetch cosmic weather data from the API (server-side)
async function getCosmicWeather(): Promise<{ data: CosmicWeatherData | null; error: string | null }> {
  try {
    const apiUrl = WEATHER_ENDPOINTS.FULL;
    console.log('[Cosmic Weather] Fetching from:', apiUrl);
    
    const res = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return { data: null, error: `API returned ${res.status}: ${res.statusText}` };
    }

    const response: ApiResponse = await res.json();
    
    // Extract data from the wrapper
    if (response.success && response.data) {
      return { data: response.data, error: null };
    }
    
    return { data: null, error: response.message || 'API returned unsuccessful response' };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Cosmic Weather] Fetch error:', errorMessage);
    return { data: null, error: errorMessage };
  }
}

// Get status color based on level
function getStatusColor(level: WeatherLevel) {
  switch (level) {
    case 'green':
      return { dot: 'bg-green-400', label: 'text-green-300' };
    case 'yellow':
      return { dot: 'bg-amber-300', label: 'text-amber-300' };
    case 'red':
      return { dot: 'bg-red-400', label: 'text-red-300' };
    default:
      return { dot: 'bg-slate-500', label: 'text-slate-300' };
  }
}

// Time ago helper
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const updated = new Date(dateString);
  const diffMs = now.getTime() - updated.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default async function CosmicWeatherPage() {
  const { data, error } = await getCosmicWeather();

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white py-12 px-4">
        <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.15)]">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Cosmic Weather</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">🌩️ Cosmic Weather Dashboard</h1>
          </div>
          <div className="space-y-3 text-center">
            <p className="text-lg text-slate-600">
              Data unavailable right now. We will retry automatically when the endpoint responds.
            </p>
            <div className="rounded-2xl border border-red-500/40 bg-red-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-widest text-red-600">Offline</p>
              <p className="mt-2 text-sm text-slate-600">{error || 'Connection failed'}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              API URL: {WEATHER_ENDPOINTS.FULL}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const kpiStatus = getStatusColor(data.solar_activity.level);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Live Space Weather</p>
          <h1 className="text-5xl font-semibold text-slate-900">🌩️ Cosmic Weather Dashboard</h1>
          <p className="text-lg text-slate-600">
            Real-time space weather readings from {data.data_source}
          </p>
        </header>

        <section className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Kp Index</p>
              <div className="mt-2 flex items-center gap-4">
                <span className="text-5xl font-semibold text-slate-900">{data.kp_index}</span>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-3 w-3 rounded-full ${kpiStatus.dot}`}></span>
                  <span className={`text-sm font-semibold uppercase tracking-[0.4em] ${kpiStatus.label}`}>{data.solar_activity.status}</span>
                </div>
              </div>
              <p className="mt-1 max-w-xl text-sm text-slate-500">
                {data.solar_activity.description || 'Current solar activity conditions based on the latest readings.'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Last updated</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {data.last_updated ? getTimeAgo(data.last_updated) : 'Just now'}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[
            {
              title: '☀️ Solar Activity',
              description: "Sun's current activity",
              statusValue: data.solar_activity.status,
              metricLabel: 'Kp Index',
              metricValue: data.solar_activity.value,
              detail: data.solar_activity.description,
              emoji: data.solar_activity.emoji,
              tone: getStatusColor(data.solar_activity.level),
            },
            {
              title: '🌌 Aurora Chance',
              description: 'Northern Lights visibility',
              statusValue: data.aurora_chance.status,
              metricLabel: 'Visible',
              metricValue: data.aurora_chance.visible ? 'Yes' : 'No',
              detail: data.aurora_chance.description,
              emoji: data.aurora_chance.emoji,
              tone: getStatusColor(data.aurora_chance.level),
            },
            {
              title: '☢️ Radiation Level',
              description: 'Solar radiation intensity',
              statusValue: data.radiation.status,
              metricLabel: 'Current',
              metricValue: data.radiation.value,
              detail: data.radiation.description,
              emoji: data.radiation.emoji,
              tone: getStatusColor(data.radiation.level),
            },
            {
              title: '📡 GPS & Geomagnetic',
              description: 'Impact on GPS signals',
              statusValue: data.gps_impact.status,
              metricLabel: 'Status',
              metricValue: data.gps_impact.status,
              detail: data.gps_impact.description,
              emoji: data.gps_impact.emoji,
              tone: getStatusColor(data.gps_impact.level),
            },
          ].map((card) => (
            <article
              key={card.title}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_35px_80px_-50px_rgba(15,23,42,0.18)]"
            >
              <header className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{card.description}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">{card.title}</h3>
                </div>
                <span className="text-4xl">{card.emoji}</span>
              </header>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{card.metricLabel}</span>
                  <span className="text-lg font-semibold text-slate-900">{card.metricValue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                    <span className={`inline-flex h-3 w-3 rounded-full ${card.tone.dot}`}></span>
                    <span className={`text-sm font-semibold uppercase tracking-[0.3em] ${card.tone.label}`}>{card.statusValue}</span>
                  </div>
                  <span className="text-xs text-slate-400">Updated just now</span>
                </div>
                {card.detail && <p className="text-sm text-slate-500">{card.detail}</p>}
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.2)]">
          <h3 className="text-xl font-bold text-slate-900 mb-4">📊 Status Legend</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🟢</span>
              <div>
                <p className="font-semibold text-green-400">Low / Safe / Normal</p>
                <p className="text-sm text-slate-500">Quiet conditions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🟡</span>
              <div>
                <p className="font-semibold text-amber-300">Medium</p>
                <p className="text-sm text-slate-500">Watch conditions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔴</span>
              <div>
                <p className="font-semibold text-red-400">High / Alert</p>
                <p className="text-sm text-slate-500">Warning conditions</p>
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-500">
              Data Source: <span className="font-semibold text-slate-900">{data.data_source}</span> • Last Updated: <span className="font-semibold text-slate-900">{getTimeAgo(data.last_updated)}</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
