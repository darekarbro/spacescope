import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SubmitEventPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Submit New Space Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input label="Event Title" required />
            <Input label="Event Type" type="select" required />
            <Input label="Description" type="textarea" />
            <Input label="Start Date & Time" type="datetime-local" required />
            <Input label="End Date & Time" type="datetime-local" required />
            <Input label="Latitude" type="number" step="0.001" />
            <Input label="Longitude" type="number" step="0.001" />
            <Input label="Magnitude" type="number" step="0.1" />
            <Input label="Image URL" type="url" />
            
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Submit Event
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Save as Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
