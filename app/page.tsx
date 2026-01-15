import PageLayout from "@/components/page-layouts/page-layouts";
import HeroSection from '@/components/hero-sections-05';
import CTASection from '@/components/cta-sections-04';
import TextParallaxContentExample from '@/components/TextParallaxContent';

export default function HomePage() {
  return (
    <PageLayout>
      <div className="w-full">
        <HeroSection />

        <div className="w-full">
          <TextParallaxContentExample />
        </div>
      </div>

      <CTASection />

    </PageLayout>
  );
}
