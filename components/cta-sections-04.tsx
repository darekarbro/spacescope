import { Button } from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-4">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover bg-bottom" />
            <div className="absolute inset-0 bg-black/55" />

            <div className="relative z-10 px-8 py-10 md:px-16 md:py-20">
          <header className="mb-8 max-w-2xl space-y-4">
            <h2 className="font-heading text-4xl leading-10 text-white lg:text-4xl">
              Join SpaceScope — Track Sky Events, Get Alerts, Explore Missions
            </h2>
            <p className="text-lg text-white/60">
              Sign up to receive real-time cosmic weather alerts, mission timelines, and
              educational resources tailored for students and educators.
            </p>
          </header>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button size="lg">Join Now</Button>
            <Button size="lg" variant="secondary">
              Request Access
            </Button>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
