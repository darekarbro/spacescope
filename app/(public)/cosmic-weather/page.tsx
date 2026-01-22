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
function getStatusColor(level: WeatherLevel): string {
  switch (level) {
    case 'green':
      return 'bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-500/50';
    case 'yellow':
      return 'bg-yellow-500/20 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300 border-yellow-500/50';
    case 'red':
      return 'bg-red-500/20 dark:bg-red-500/30 text-red-700 dark:text-red-300 border-red-500/50';
    default:
      return 'bg-gray-500/20 dark:bg-gray-500/30 text-gray-700 dark:text-gray-300 border-gray-500/50';
  }
}

function getBorderColor(level: WeatherLevel): string {
  switch (level) {
    case 'green':
      return 'border-l-green-500';
    case 'yellow':
      return 'border-l-yellow-500';
    case 'red':
      return 'border-l-red-500';
    default:
      return 'border-l-gray-500';
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

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              🌩️ Cosmic Weather Dashboard
            </h1>
          </div>
          
          <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-8 text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Unable to Load Weather Data</h2>
            <p className="text-gray-300 mb-4">{error || 'Connection failed'}</p>
            <div className="bg-gray-800/50 rounded-lg p-4 text-left max-w-md mx-auto">
              <p className="text-sm text-gray-400 mb-2">Make sure:</p>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                <li>Django server is running on <code className="bg-gray-700 px-1 rounded">localhost:8000</code></li>
                <li>CORS is enabled for <code className="bg-gray-700 px-1 rounded">localhost:3000</code></li>
                <li>API endpoint is accessible</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              API URL: {WEATHER_ENDPOINTS.FULL}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌩️ Cosmic Weather Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Real-time space weather from {data.data_source}
          </p>
        </div>

        {/* Kp Index Banner */}
        <div className={`mb-8 p-6 rounded-xl border-2 ${getStatusColor(data.solar_activity.level)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {data.solar_activity.emoji} Kp Index: {data.kp_index}
              </h2>
              <p className="text-gray-300">{data.solar_activity.description || 'Current solar activity conditions'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Last Updated</p>
              <p className="text-lg font-semibold">{data.last_updated ? getTimeAgo(data.last_updated) : 'Just now'}</p>
            </div>
          </div>
        </div>

        {/* Indicator Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Solar Activity */}
          <div className={`p-6 rounded-xl border-l-4 ${getBorderColor(data.solar_activity.level)} ${getStatusColor(data.solar_activity.level)} backdrop-blur-sm`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">☀️ Solar Activity</h3>
                <p className="text-sm opacity-80">Sun&apos;s current activity level</p>
              </div>
              <span className="text-4xl">{data.solar_activity.emoji}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm opacity-70">Status:</span>
                <span className="font-semibold">{data.solar_activity.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm opacity-70">Kp Index:</span>
                <span className="font-semibold">{data.solar_activity.value}</span>
              </div>
              {data.solar_activity.description && (
                <p className="text-sm opacity-80 mt-3">{data.solar_activity.description}</p>
              )}
            </div>
          </div>

          {/* Aurora Chance */}
          <div className={`p-6 rounded-xl border-l-4 ${getBorderColor(data.aurora_chance.level)} ${getStatusColor(data.aurora_chance.level)} backdrop-blur-sm`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">🌌 Aurora Chance</h3>
                <p className="text-sm opacity-80">Northern Lights visibility</p>
              </div>
              <span className="text-4xl">{data.aurora_chance.emoji}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm opacity-70">Visible:</span>
                <span className="font-semibold">{data.aurora_chance.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm opacity-70">Kp Index:</span>
                <span className="font-semibold">{data.kp_index}</span>
              </div>
              {data.aurora_chance.description && (
                <p className="text-sm opacity-80 mt-3">{data.aurora_chance.description}</p>
              )}
            </div>
          </div>

          {/* Radiation Level */}
          <div className={`p-6 rounded-xl border-l-4 ${getBorderColor(data.radiation.level)} ${getStatusColor(data.radiation.level)} backdrop-blur-sm`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">☢️ Radiation Level</h3>
                <p className="text-sm opacity-80">Solar radiation intensity</p>
              </div>
              <span className="text-4xl">{data.radiation.emoji}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm opacity-70">Status:</span>
                <span className="font-semibold">{data.radiation.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm opacity-70">Level:</span>
                <span className="font-semibold">{data.radiation.value}</span>
              </div>
              {data.radiation.description && (
                <p className="text-sm opacity-80 mt-3">{data.radiation.description}</p>
              )}
            </div>
          </div>

          {/* GPS Impact */}
          <div className={`p-6 rounded-xl border-l-4 ${getBorderColor(data.gps_impact.level)} ${getStatusColor(data.gps_impact.level)} backdrop-blur-sm`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">📡 GPS & Geomagnetic</h3>
                <p className="text-sm opacity-80">Impact on GPS signals</p>
              </div>
              <span className="text-4xl">{data.gps_impact.emoji}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm opacity-70">Status:</span>
                <span className="font-semibold">{data.gps_impact.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm opacity-70">Kp Index:</span>
                <span className="font-semibold">{data.kp_index}</span>
              </div>
              {data.gps_impact.description && (
                <p className="text-sm opacity-80 mt-3">{data.gps_impact.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4">📊 Status Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🟢</span>
              <div>
                <p className="font-semibold text-green-400">Low / Safe / Normal</p>
                <p className="text-sm text-gray-400">Quiet conditions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🟡</span>
              <div>
                <p className="font-semibold text-yellow-400">Medium</p>
                <p className="text-sm text-gray-400">Watch conditions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔴</span>
              <div>
                <p className="font-semibold text-red-400">High / Alert</p>
                <p className="text-sm text-gray-400">Warning conditions</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Data Source: <span className="text-white font-semibold">{data.data_source}</span> • 
              Last Updated: <span className="text-white font-semibold">{getTimeAgo(data.last_updated)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
