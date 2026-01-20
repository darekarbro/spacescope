import MissionDetail from '@/components/missions/MissionDetail';
import Link from 'next/link';
import { MISSIONS_ENDPOINTS } from '@/lib/api/endpoints';
import type { Mission } from '@/types/mission';

async function getMission(id: string): Promise<Mission | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/missions/${id}/`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const result = await res.json();
    return result.data || null;
    
  } catch (error) {
    console.error('Error fetching mission:', error);
    return null;
  }
}

async function getAllMissions(): Promise<Mission[]> {
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

export default async function MissionDetailPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolved = await params;
  const [mission, allMissions] = await Promise.all([
    getMission(resolved.id),
    getAllMissions(),
  ]);

  if (!mission) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Mission not found</h1>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">We couldn't find the mission you're looking for.</p>
          <Link href="/missions" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded">Back to missions</Link>
        </div>
      </div>
    );
  }

  return <MissionDetail mission={mission} allMissions={allMissions} />;
}
