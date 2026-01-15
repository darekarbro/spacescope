import { Card, CardContent } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to SpaceScope
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your gateway to explore the universe, stay updated on cosmic events,
          and understand how space technology impacts Earth
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <h3 className="font-bold mb-2">Sky Events</h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Meteor showers, ISS passes, eclipses, and more
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-bold mb-2">Cosmic Weather</h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Real-time solar storms, aurora forecasts, radiation alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-bold mb-2">Mission Timeline</h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Timeline of past, current, and future space missions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-bold mb-2">Earth Impact</h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              How satellites monitor climate, agriculture, and disasters
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
