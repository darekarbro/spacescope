import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Upcoming Sky Events</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Event #{i}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Event details coming soon...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
