import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function MySubmissionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">My Event Submissions</h1>
      
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} variant="outline">
            <CardHeader>
              <CardTitle>Event #{i}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">Status: <span className={i % 2 === 0 ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                {i % 2 === 0 ? 'Approved' : 'Pending'}
              </span></p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">Submitted: Jan {10 + i}, 2026</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
