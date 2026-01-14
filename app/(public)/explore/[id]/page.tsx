export default function EventDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-4">Event: {params.id}</h1>
      <p className="text-gray-600">Event detail page coming soon...</p>
    </div>
  );
}
