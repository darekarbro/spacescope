import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
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
