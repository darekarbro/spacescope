import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Timeline } from '@/components/ui/timeline';
import { MISSIONS_ENDPOINTS } from '@/lib/api/endpoints';
import type { Mission } from '@/types/mission';

async function getMissions(): Promise<Mission[]> {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/missions/', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const result = await res.json();
    return result.data || [];
    
  } catch (error) {
    console.error('Error fetching missions:', error);
    return [];
  }
}

export default async function MissionsPage() {
  const missions = await getMissions();
  
  const data = missions.map((m) => ({
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
