import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Timeline } from '@/components/ui/timeline';
import MISSIONS from '@/mock/missionsData';

export default function MissionsPage() {
  const data = MISSIONS.map((m) => ({
    title: `${m.name} — ${m.launch_date?.slice(0, 4) ?? ''}`,
    content: (
      <Link href={`/missions/${m.id}`} className="block">
        <Card variant="outline">
          <CardHeader>
            <CardTitle>{m.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">{m.description}</p>
          </CardContent>
        </Card>
      </Link>
    ),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Space Missions Timeline</h1>
      <Timeline data={data} />
    </div>
  );
}
