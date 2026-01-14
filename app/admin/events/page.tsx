import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminEventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Event Moderation Queue</h1>
      
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} variant="outline">
            <CardHeader>
              <CardTitle>Event Submission #{i}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Submitted by: Scientist Name</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Approve
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  Reject
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
