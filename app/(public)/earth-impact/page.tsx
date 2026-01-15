import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function EarthImpactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Earth Impact: How Satellites Help</h1>
      <p className="text-neutral-700 dark:text-neutral-300 mb-8">
        Discover how space technology is solving real-world problems on Earth
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agriculture Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Satellite data optimizes crop yields and resource management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Climate Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Real-time monitoring of global temperature, CO2, and weather patterns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disaster Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Early warning systems for hurricanes, floods, and earthquakes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pollution Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Monitor air and water quality changes across regions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
