import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/missions" className="block">
          <Card className="hover:shadow-lg transition cursor-pointer bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">🚀</div>
              <div className="font-semibold text-indigo-700 dark:text-indigo-300">Manage Missions</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/events" className="block">
          <Card className="hover:shadow-lg transition cursor-pointer bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">📅</div>
              <div className="font-semibold text-purple-700 dark:text-purple-300">Manage Events</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/scientists" className="block">
          <Card className="hover:shadow-lg transition cursor-pointer bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">👨‍🔬</div>
              <div className="font-semibold text-green-700 dark:text-green-300">Manage Scientists</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/reports" className="block">
          <Card className="hover:shadow-lg transition cursor-pointer bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="font-semibold text-orange-700 dark:text-orange-300">View Reports</div>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Pending Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approved Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scientist Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">23</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Event moderation queue...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Scientists</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">User account management...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
