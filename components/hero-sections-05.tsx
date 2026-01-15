import { Sun } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 lg:py-20">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full px-2 py-1">
            <Sun className="size-4" />
            Hack The Space — SpaceScope
          </Badge>

          <div className="mx-auto max-w-xl space-y-6 text-center lg:mx-0 lg:text-start">
            <h1 className="text-4xl lg:text-5xl font-semibold">
              SpaceScope - Explore, Learn, Connected 
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Centralized, student-friendly platform for upcoming sky events, real-time cosmic
              weather, mission timelines, and interactive learning that shows how satellite data
              helps solve real-world problems on Earth.
            </p>
          </div>

          <div className="flex justify-center gap-4 lg:justify-start">
            <Button size="lg" className="rounded-full">
              Explore Events
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              View Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 space-y-6">
          <div className="space-y-6">
            <Card className="mt-8 overflow-hidden border-none p-0 shadow-none">
              <img
                src="/hero.jpeg"
                alt="Sky events"
                className="aspect-4/3 w-full object-cover"
              />
            </Card>
            <Card className="bg-muted aspect-4/3 border-none shadow-none">
              <CardContent className="flex h-full flex-col justify-end">
                <div>
                  <div className="mb-2 text-4xl">120+</div>
                  <div className="text-muted-foreground">Upcoming sky events tracked</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="-mb-8 space-y-6">
            <Card className="bg-muted aspect-4/3 border-none shadow-none">
              <CardContent className="flex h-full flex-col justify-end">
                <div>
                  <div className="mb-2 text-4xl">Realtime</div>
                  <div className="text-muted-foreground">Cosmic weather & alerts</div>
                </div>
              </CardContent>
            </Card>
            <Card className="aspect-4/3 border-none bg-amber-50 shadow-none dark:bg-amber-950">
              <CardContent className="flex h-full flex-col justify-end">
                <div className="mb-2 text-4xl">Missions</div>
                <div className="text-muted-foreground mb-4">Visual timeline of missions</div>
                <div className="flex -space-x-2">
                  <Avatar className="border-background border-2">
                    <AvatarImage src="/images/avatar1.jpg" />
                    <AvatarFallback>SS</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-background border-2">
                    <AvatarImage src="/images/avatar2.jpg" />
                    <AvatarFallback>EN</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-background border-2">
                    <AvatarImage src="/images/avatar3.jpg" />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
