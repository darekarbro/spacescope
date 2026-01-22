import React from "react";
import SimpleMarkdown from "@/components/ui/SimpleMarkdown";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Calendar,
  Clock,
  Rocket,
  Users,
  Target,
  ArrowLeft,
} from "lucide-react";
import { MISSIONS } from "@/mock/missionsData";
import type { Mission } from "@/types/mission";

interface Props {
  mission: Mission;
  allMissions?: Mission[];
}

const MissionDetail: React.FC<Props> = ({ mission, allMissions = [] }) => {
  const launch = mission.launch_date ? new Date(mission.launch_date) : null;
  const ret = mission.return_date ? new Date(mission.return_date) : null;

  let duration = undefined;
  if (launch && ret) {
    const diff = Math.abs(ret.getTime() - launch.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    duration = `${days} days`;
  }

  const related = (mission.related_ids || [])
    .map((id) => MISSIONS.find((m) => m.id === id))
    .filter(Boolean) as Mission[];

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Back Button */}
        <Link href="/missions">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Missions
          </Button>
        </Link>

        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden">
          {mission.banner_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mission.banner_image}
              alt={`${mission.name} banner`}
              className="w-full h-80 object-cover"
            />
          ) : (
            <div className="w-full h-80 bg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-8 py-8 text-white">
              <Badge
                variant="outline"
                className="mb-3 bg-white/10 border-white/20 text-white"
              >
                {mission.agency || "Space Mission"}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                {mission.name}
              </h1>
              <p className="text-white/80 max-w-3xl text-lg">
                {mission.description}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Panel */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-muted border-none shadow-none">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Launch Date
                    </div>
                    <div className="font-semibold">
                      {launch
                        ? launch.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "TBD"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted border-none shadow-none">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Return Date
                    </div>
                    <div className="font-semibold">
                      {ret
                        ? ret.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted border-none shadow-none">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Duration
                    </div>
                    <div className="font-semibold">{duration ?? "—"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted border-none shadow-none">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-3">
                  <Rocket className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Status
                    </div>
                    <Badge variant="outline" className="font-semibold">
                      {mission.status?.charAt(0).toUpperCase() +
                        mission.status?.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Mission Overview
          </h2>
          <Card className="bg-muted border-none shadow-none">
            <CardContent className="pt-6">
              <SimpleMarkdown text={mission.description} />
            </CardContent>
          </Card>
        </section>

        {/* Research / Objectives */}
        {mission.objectives && mission.objectives.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Research & Objectives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mission.objectives.map((o, i) => (
                <Card key={i} className="bg-muted border-none shadow-none">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed">{o}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Mission Timeline */}
        {mission.timeline && mission.timeline.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Mission Timeline
            </h2>
            <div className="space-y-3">
              {mission.timeline.map((ev, i) => (
                <Card key={i} className="bg-muted border-none shadow-none">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                          {i + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-1">
                          {ev.date}
                        </div>
                        <div className="font-semibold mb-1">{ev.title}</div>
                        {ev.description && (
                          <div className="text-sm text-muted-foreground">
                            {ev.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Meet the Crew */}
        {mission.crew && mission.crew.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Meet the Crew
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mission.crew.map((c, i) => (
                <Card key={i} className="bg-muted border-none shadow-none">
                  <CardContent className="pt-6 pb-6 text-center">
                    <img
                      src={c.photo || "/images/crew/default.jpg"}
                      alt={c.name}
                      className="mx-auto h-24 w-24 rounded-full object-cover mb-3 ring-2 ring-border"
                    />
                    <div className="font-semibold mb-1">{c.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.role}
                    </div>
                    {c.country && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {c.country}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Related Missions */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Related Missions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {related.slice(0, 3).map((r) => (
                <Link
                  key={r.id}
                  href={`/missions/${r.id}`}
                  className="block group"
                >
                  <Card className="bg-muted border-none shadow-none hover:shadow-md transition-all">
                    <CardContent className="pt-6 pb-6">
                      <Rocket className="w-6 h-6 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {r.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {r.agency}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MissionDetail;
