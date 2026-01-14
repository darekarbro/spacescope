import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function CosmicWeatherPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Cosmic Weather</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Solar Storms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Real-time solar activity data...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aurora Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Aurora visibility predictions...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Radiation Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Current radiation levels...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geomagnetic Index</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">KP Index and solar flux data...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
