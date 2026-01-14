import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminScientistsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Manage Scientists</h1>
      
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} variant="outline">
            <CardHeader>
              <CardTitle>Scientist #{i}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">Email: scientist{i}@example.com</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">Institution: University Name</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">Submissions: 5</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
