import PageLayout from "@/components/page-layouts/page-layouts";
import HeroSection from '@/components/hero-sections-05';
import CTASection from '@/components/cta-sections-04';

export default function HomePage() {
  return (
    <PageLayout>
      <div className="w-full">
        <HeroSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-bold mb-2">Sky Events</h3>
            <p className="text-sm text-gray-600">
              Meteor showers, ISS passes, eclipses, and more
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-bold mb-2">Cosmic Weather</h3>
            <p className="text-sm text-gray-600">
              Real-time solar storms, aurora forecasts, radiation alerts
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-bold mb-2">Mission Timeline</h3>
            <p className="text-sm text-gray-600">
              Timeline of past, current, and future space missions
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-bold mb-2">Earth Impact</h3>
            <p className="text-sm text-gray-600">
              How satellites monitor climate, agriculture, and disasters
            </p>
          </div>
        </div>
      </div>
      </div>

      <CTASection />

    </PageLayout>
  );
}
