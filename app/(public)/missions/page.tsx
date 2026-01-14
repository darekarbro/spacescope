import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function MissionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Space Missions Timeline</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} variant="outline">
            <CardHeader>
              <CardTitle>Mission #{i}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Mission details and timeline...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
