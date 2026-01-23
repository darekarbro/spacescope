import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Timeline } from "@/components/ui/timeline";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Rocket, ArrowRight, Calendar, Globe } from "lucide-react";
import type { Mission } from "@/types/mission";

async function getMissions(): Promise<Mission[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/v1/missions/", {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching missions:", error);
    return [];
  }
}

export default async function MissionsPage() {
  const missions = await getMissions();

  const data = missions.map((m) => ({
    title: `${m.name} — ${m.launch_date?.slice(0, 4) ?? ""}`,
    content: (
      <Link href={`/missions/${m.id}`} className="block group">
        <Card className="overflow-hidden border-none shadow-none bg-muted hover:shadow-md transition-all duration-300 h-full">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {m.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {m.launch_date
                      ? new Date(m.launch_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "TBD"}
                  </span>
                </div>
              </div>
              <Rocket className="w-5 h-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-4 space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {m.description || "No description available"}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {m.status && (
                <Badge variant="outline" className="text-xs font-medium">
                  {m.status?.charAt(0).toUpperCase() + m.status?.slice(1)}
                </Badge>
              )}
              {m.agency && (
                <span className="text-xs text-muted-foreground">
                  {m.agency}
                </span>
              )}
            </div>
            {m.objectives && m.objectives.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Key Objectives:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {m.objectives.slice(0, 2).map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="line-clamp-1">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <div className="px-6 py-3 border-t border-border bg-background/60 flex items-center justify-between group-hover:bg-accent transition-colors">
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              View details
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all group-hover:translate-x-1" />
          </div>
        </Card>
      </Link>
    ),
  }));

  return (
    <div className="w-full bg-background">
      {/* Hero Section */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:py-24">
        <div className="space-y-6 mb-12">
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full px-2 py-1"
          >
            <Rocket className="size-4" />
            Space Missions
          </Badge>

          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-semibold">
              Space Missions Timeline
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              Explore humanity journey into space. From iconic missions to
              cutting-edge explorations, discover the milestones that shaped our
              understanding of the universe.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Button size="lg" className="rounded-full">
              Explore All Missions
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              Learn Resources
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-12">
          <Card className="bg-muted border-none shadow-none">
            <CardContent className="pt-6">
              <div className="flex flex-col items-start">
                <Rocket className="w-8 h-8 mb-3" />
                <p className="text-3xl font-bold">{missions.length}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Active Missions
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted border-none shadow-none">
            <CardContent className="pt-6">
              <div className="flex flex-col items-start">
                <Globe className="w-8 h-8 mb-3" />
                <p className="text-3xl font-bold">5</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Space Agencies
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted border-none shadow-none">
            <CardContent className="pt-6">
              <div className="flex flex-col items-start">
                <Calendar className="w-8 h-8 mb-3" />
                <p className="text-3xl font-bold">60+</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Years of History
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-3">Mission Evolution</h2>
          <p className="text-muted-foreground">
            Follow the progression of space exploration through the decades
          </p>
        </div>
        <Timeline data={data} />
      </section>

      {/* CTA Section */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 mb-12">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('/image4.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 px-8 py-12 md:px-16 md:py-16">
            <div className="max-w-2xl">
              <h2 className="font-heading text-4xl leading-10 text-white mb-4">
                Discover What Next in Space
              </h2>
              <p className="text-lg text-white/60 mb-6 leading-relaxed">
                Stay updated with the latest space missions and explore how
                these incredible journeys contribute to scientific advancement
                and our understanding of the cosmos.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg">Follow Missions</Button>
                <Button size="lg" variant="secondary">
                  Subscribe to Updates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
