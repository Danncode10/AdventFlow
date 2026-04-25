import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getMissionBySlug, getAreasWithDivisions, getDivisionsWithChurches, getChurchesByMission } from "@/services/onboarding"
import { getUserProfile } from "@/services/dashboard"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, MapPin, Calendar, Users2, GitBranch, Church as ChurchIcon, Info, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AnimateOnScroll, StaggerOnScroll, StaggerItem } from "@/components/animate-on-scroll"

interface MissionPageProps {
  params: Promise<{ slug: string }>
}

export default async function MissionPage({ params }: MissionPageProps) {
  const { slug } = await params

  const session = await getUserProfile()
  if (!session?.user) redirect("/login")

  const mission = await getMissionBySlug(slug).catch(() => null)
  if (!mission) notFound()

  const { user } = session

  // Fetch real data in parallel
  const [areas, divisions, churches] = await Promise.all([
    getAreasWithDivisions(mission.id).catch(() => []),
    getDivisionsWithChurches(mission.id).catch(() => []),
    getChurchesByMission(mission.id).catch(() => []),
  ])

  const totalDivisions = areas.reduce((acc: number, a: any) => acc + (a.divisions?.length ?? 0), 0)

  const bgImage = "/hero-bg.jpg"
  const defaultDescription = "This mission serves as a regional administrative body within the Adventist ecclesiastical hierarchy. It oversees the spiritual and organizational needs of its member churches, areas, and divisions."

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 flex flex-col">
        {/* ── HERO SECTION ── */}
        <section className="relative overflow-hidden pt-[100px] pb-[80px] md:pt-[140px] md:pb-[100px]">
          {/* Background Image */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
              style={{
                backgroundImage: `url('${bgImage}')`,
                backgroundPosition: "center 40%",
                filter: "brightness(0.4) saturate(1.1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
            {/* Back link */}
            <AnimateOnScroll variant="fade-up" delay={0}>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/20 px-4 py-1.5 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-foreground hover:bg-background/40 transition-colors mb-8"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Dashboard
              </Link>
            </AnimateOnScroll>

            <div className="flex flex-col md:flex-row md:items-end gap-8">
              {/* Logo */}
              <AnimateOnScroll variant="fade-up" delay={0.1} className="shrink-0">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center p-4">
                  {mission.logo_url ? (
                    <img src={mission.logo_url} alt={mission.name} className="w-full h-full object-contain drop-shadow-md" />
                  ) : (
                    <Globe className="w-16 h-16 text-primary/80" />
                  )}
                </div>
              </AnimateOnScroll>

              {/* Title & Info */}
              <div className="flex-1 space-y-4">
                <AnimateOnScroll variant="fade-up" delay={0.2}>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 font-black uppercase tracking-widest text-[10px] px-3 py-1 mb-2 backdrop-blur-sm">
                    Mission Headquarters
                  </Badge>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tighter uppercase italic leading-[0.9]">
                    {mission.name}
                  </h1>
                </AnimateOnScroll>

                <AnimateOnScroll variant="fade-up" delay={0.3}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-muted-foreground font-medium flex-wrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span className="italic">{mission.address || "Mabini, Alicia"}</span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <span className="italic">
                        Est. {new Date(mission.created_at).toLocaleDateString("en-PH", { year: "numeric", month: "long" })}
                      </span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center gap-2 flex-wrap gap-y-1">
                      <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/30 text-emerald-600">
                        {areas.length} Areas
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-bold border-blue-500/30 text-blue-600">
                        {totalDivisions} Divisions
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                        {churches.length} Churches
                      </Badge>
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTENT SECTION ── */}
        <section className="relative z-20 flex-1 bg-background -mt-8 rounded-t-[2.5rem] border-t border-border/50 px-6 md:px-8 py-10 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
          <div className="mx-auto max-w-7xl">
            <Tabs defaultValue="overview" className="w-full">
              <AnimateOnScroll variant="fade-up" delay={0.4}>
                <div className="mb-10 overflow-x-auto pb-1">
                  <TabsList className="bg-card border border-border/50 p-1 rounded-2xl h-auto inline-flex min-w-full sm:min-w-0">
                    <TabsTrigger value="overview" className="rounded-xl px-5 py-2.5 text-sm font-bold tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="areas" className="rounded-xl px-5 py-2.5 text-sm font-bold tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">
                      Areas · {areas.length}
                    </TabsTrigger>
                    <TabsTrigger value="divisions" className="rounded-xl px-5 py-2.5 text-sm font-bold tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">
                      Divisions · {totalDivisions}
                    </TabsTrigger>
                    <TabsTrigger value="churches" className="rounded-xl px-5 py-2.5 text-sm font-bold tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">
                      Churches · {churches.length}
                    </TabsTrigger>
                  </TabsList>
                </div>
              </AnimateOnScroll>

              {/* ── OVERVIEW TAB ── */}
              <TabsContent value="overview" className="mt-0 outline-none">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: About + Stats */}
                  <div className="lg:col-span-2 space-y-6">
                    <AnimateOnScroll variant="slide-left" delay={0.1}>
                      <Card className="bg-card border border-border/50 rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                          <CardTitle className="text-xl font-black uppercase italic flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary" />
                            About this Mission
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                          <p className="text-muted-foreground leading-relaxed text-base italic">
                            {defaultDescription}
                          </p>

                          {/* Population */}
                          <div className="bg-secondary/30 rounded-2xl p-6 border border-border/40">
                            <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-1 flex items-center gap-2">
                              <Users2 className="w-4 h-4" />
                              Estimated Population
                            </p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl font-black tracking-tighter text-foreground">120,500</span>
                              <span className="text-sm font-medium text-muted-foreground">people in Region II</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </AnimateOnScroll>

                    {/* Stats Grid */}
                    <StaggerOnScroll className="grid grid-cols-1 sm:grid-cols-3 gap-4" delay={0.2}>
                      {[
                        {
                          icon: GitBranch,
                          label: "Areas",
                          value: areas.length.toString(),
                          desc: "Provincial zones",
                          color: "text-emerald-500",
                          bg: "bg-emerald-500/10",
                          border: "hover:border-emerald-500/30",
                        },
                        {
                          icon: MapPin,
                          label: "Divisions",
                          value: totalDivisions.toString(),
                          desc: "District divisions",
                          color: "text-blue-500",
                          bg: "bg-blue-500/10",
                          border: "hover:border-blue-500/30",
                        },
                        {
                          icon: ChurchIcon,
                          label: "Churches",
                          value: churches.length.toString(),
                          desc: "Registered congregations",
                          color: "text-primary",
                          bg: "bg-primary/10",
                          border: "hover:border-primary/30",
                        },
                      ].map((item, idx) => (
                        <StaggerItem key={idx}>
                          <Card className={`bg-card border border-border/50 rounded-3xl overflow-hidden group transition-all duration-300 ${item.border}`}>
                            <CardContent className="p-6 flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                                <item.icon className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</p>
                                <h4 className="text-3xl font-black tracking-tight text-foreground">{item.value}</h4>
                                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </StaggerItem>
                      ))}
                    </StaggerOnScroll>
                  </div>

                  {/* Right: Leadership placeholder */}
                  <div>
                    <AnimateOnScroll variant="slide-right" delay={0.2}>
                      <Card className="bg-gradient-to-br from-card to-muted border border-border/50 rounded-[2rem]">
                        <CardHeader className="p-8 pb-4">
                          <CardTitle className="text-lg font-black uppercase italic flex items-center gap-2">
                            <Users2 className="w-5 h-5 text-primary" />
                            Leadership
                          </CardTitle>
                          <CardDescription>Mission administrators & officers</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 flex flex-col items-center justify-center text-center space-y-4 py-12">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users2 className="w-8 h-8 text-primary/40" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">Directory unavailable</p>
                            <p className="text-xs text-muted-foreground mt-1">Admin access required to view personnel</p>
                          </div>
                        </CardContent>
                      </Card>
                    </AnimateOnScroll>
                  </div>
                </div>
              </TabsContent>

              {/* ── AREAS TAB ── */}
              <TabsContent value="areas" className="mt-0 outline-none">
                {areas.length === 0 ? (
                  <AnimateOnScroll variant="fade-up">
                    <Card className="bg-card border border-border/50 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                        <GitBranch className="w-10 h-10 text-muted-foreground/40" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tight mb-2">No Areas Yet</h3>
                      <p className="text-muted-foreground text-sm">No areas have been added to this mission.</p>
                    </Card>
                  </AnimateOnScroll>
                ) : (
                  <StaggerOnScroll className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {areas.map((area: any, idx: number) => (
                      <StaggerItem key={area.id}>
                        <Card className="bg-card border border-border/50 rounded-[1.5rem] overflow-hidden group hover:border-emerald-500/30 hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)] transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                                <GitBranch className="w-6 h-6" />
                              </div>
                              <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/30 text-emerald-600">
                                {area.divisions?.length ?? 0} divisions
                              </Badge>
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-1">{area.name}</h3>
                            <p className="text-xs text-muted-foreground">Provincial area · Northeast Luzon</p>
                            {area.divisions && area.divisions.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-1.5">
                                {area.divisions.map((div: any) => (
                                  <span key={div.id} className="text-[10px] font-semibold bg-secondary text-muted-foreground rounded-full px-2.5 py-1">
                                    {div.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </StaggerItem>
                    ))}
                  </StaggerOnScroll>
                )}
              </TabsContent>

              {/* ── DIVISIONS TAB ── */}
              <TabsContent value="divisions" className="mt-0 outline-none">
                {divisions.length === 0 ? (
                  <AnimateOnScroll variant="fade-up">
                    <Card className="bg-card border border-border/50 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                        <MapPin className="w-10 h-10 text-muted-foreground/40" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tight mb-2">No Divisions Yet</h3>
                      <p className="text-muted-foreground text-sm">No divisions have been added yet.</p>
                    </Card>
                  </AnimateOnScroll>
                ) : (
                  <StaggerOnScroll className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {divisions.map((div: any) => (
                      <StaggerItem key={div.id}>
                        <Card className="bg-card border border-border/50 rounded-[1.5rem] overflow-hidden group hover:border-blue-500/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.08)] transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
                                <MapPin className="w-6 h-6" />
                              </div>
                              <Badge variant="outline" className="text-[10px] font-bold border-blue-500/30 text-blue-600">
                                {div.churches?.length ?? 0} churches
                              </Badge>
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-1">{div.name}</h3>
                            <p className="text-xs text-muted-foreground mb-3">District division</p>
                            {div.churches && div.churches.length > 0 && (
                              <div className="flex flex-col gap-1.5">
                                {div.churches.map((ch: any) => (
                                  <div key={ch.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ChurchIcon className="w-3 h-3 text-primary/50 shrink-0" />
                                    {ch.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </StaggerItem>
                    ))}
                  </StaggerOnScroll>
                )}
              </TabsContent>

              {/* ── CHURCHES TAB ── */}
              <TabsContent value="churches" className="mt-0 outline-none">
                {churches.length === 0 ? (
                  <AnimateOnScroll variant="fade-up">
                    <Card className="bg-card border border-border/50 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                        <ChurchIcon className="w-10 h-10 text-muted-foreground/40" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tight mb-2">No Churches Yet</h3>
                      <p className="text-muted-foreground text-sm">No churches have been registered yet.</p>
                    </Card>
                  </AnimateOnScroll>
                ) : (
                  <StaggerOnScroll className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {churches.map((church: any) => (
                      <StaggerItem key={church.id}>
                        <Card className="bg-card border border-border/50 rounded-[1.5rem] overflow-hidden group hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(30,58,138,0.08)] transition-all duration-300">
                          <CardContent className="p-5">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                              <ChurchIcon className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-tight text-foreground">{church.name}</h3>
                            <p className="text-[11px] text-muted-foreground mt-1">Local congregation</p>
                          </CardContent>
                        </Card>
                      </StaggerItem>
                    ))}
                  </StaggerOnScroll>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
