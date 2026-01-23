import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import SolarSystemExplorer from '@/components/solar-system/SolarSystemExplorer';

export default function LearnPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">📚 Learning Zone</h1>
      
      {/* Solar System Explorer Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          🪐 Interactive Solar System Explorer
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Explore our solar system in 3D! Drag to rotate, scroll to zoom, and click on planets to learn more about them.
        </p>
        <SolarSystemExplorer />
      </section>

      {/* Other Learning Resources */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">More Learning Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">Test your space knowledge...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Infographics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">Visual learning resources...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">In-depth space topics...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experiments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">Interactive space simulations...</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
