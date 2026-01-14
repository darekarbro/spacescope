import { getMissionById } from '@/mock/missionsData';
import MissionDetail from '@/components/missions/MissionDetail';
import Link from 'next/link';

export default function MissionDetailPage({ params }: { params: { id: string } }) {
  const mission = getMissionById(params.id);

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

  return <MissionDetail mission={mission} />;
}
