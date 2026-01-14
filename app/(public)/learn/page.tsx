import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LearnPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">📚 Learning Zone</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Test your space knowledge...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Infographics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Visual learning resources...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">In-depth space topics...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experiments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Interactive space simulations...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
