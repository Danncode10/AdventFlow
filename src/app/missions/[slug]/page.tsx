import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getMissionBySlug } from "@/services/onboarding"
import { getUserProfile } from "@/services/dashboard"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, MapPin, ChevronLeft, Calendar, Users2, GitBranch, Church as ChurchIcon, Info, ArrowLeft } from "lucide-react"
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

  // Default values
  const bgImage = "/hero-bg.jpg" // We could use mission.cover_url if available
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
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out hover:scale-105"
              style={{
                backgroundImage: `url('${bgImage}')`,
                backgroundPosition: "center 40%",
                filter: "brightness(0.4) saturate(1.1)",
              }}
            />
            {/* Gradient overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
            {/* Back to AdventFlow / Dashboard */}
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="italic">{mission.address || "Address not provided"}</span>
                    </div>
                    <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border" />
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="italic">
                        Est. {new Date(mission.created_at).toLocaleDateString("en-PH", { year: "numeric", month: "long" })}
                      </span>
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <TabsList className="bg-card border border-border/50 p-1 rounded-2xl h-auto w-full md:w-auto overflow-x-auto no-scrollbar justify-start">
                    <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 text-sm font-bold tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="areas" className="rounded-xl px-6 py-2.5 text-sm font-bold tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Areas
                    </TabsTrigger>
                    <TabsTrigger value="divisions" className="rounded-xl px-6 py-2.5 text-sm font-bold tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Divisions
                    </TabsTrigger>
                    <TabsTrigger value="churches" className="rounded-xl px-6 py-2.5 text-sm font-bold tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Churches
                    </TabsTrigger>
                  </TabsList>
                </div>
              </AnimateOnScroll>

              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="mt-0 outline-none">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Stats & Description */}
                  <div className="lg:col-span-2 space-y-8">
                    <AnimateOnScroll variant="slide-left" delay={0.5}>
                      <Card className="bg-card border border-border/50 rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                          <CardTitle className="text-xl font-black uppercase italic flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary" />
                            About Mission
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                          <p className="text-muted-foreground leading-relaxed text-lg italic">
                            {defaultDescription}
                          </p>
                        </CardContent>
                      </Card>
                    </AnimateOnScroll>

                    <StaggerOnScroll className="grid grid-cols-1 sm:grid-cols-2 gap-4" delay={0.6}>
                      {[
                        {
                          icon: GitBranch,
                          label: "Active Areas",
                          value: "—",
                          desc: "Regional zones",
                          color: "text-emerald-500",
                          bg: "bg-emerald-500/10",
                          border: "hover:border-emerald-500/30",
                        },
                        {
                          icon: ChurchIcon,
                          label: "Total Churches",
                          value: "—",
                          desc: "Registered congregations",
                          color: "text-primary",
                          bg: "bg-primary/10",
                          border: "hover:border-primary/30",
                        },
                      ].map((item, idx) => (
                        <StaggerItem key={idx}>
                          <Card className={`bg-card border border-border/50 rounded-3xl overflow-hidden group transition-all duration-300 ${item.border}`}>
                            <CardContent className="p-6 flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                <item.icon className="w-7 h-7" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">{item.label}</p>
                                <h4 className="text-3xl font-black tracking-tight text-foreground">{item.value}</h4>
                                <p className="text-xs font-medium text-muted-foreground mt-0.5">{item.desc}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </StaggerItem>
                      ))}
                    </StaggerOnScroll>
                  </div>

                  {/* Right Column: Mission Admin / Directory placeholder */}
                  <div className="space-y-8">
                    <AnimateOnScroll variant="slide-right" delay={0.5}>
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
                            <Users2 className="w-8 h-8 text-primary/50" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">Directory unavailable</p>
                            <p className="text-sm text-muted-foreground">Admin access required to view personnel</p>
                          </div>
                        </CardContent>
                      </Card>
                    </AnimateOnScroll>
                  </div>
                </div>
              </TabsContent>

              {/* AREAS TAB */}
              <TabsContent value="areas" className="mt-0 outline-none">
                <AnimateOnScroll variant="fade-up" delay={0.2}>
                  <Card className="bg-card border border-border/50 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                      <GitBranch className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Areas</h3>
                    <p className="text-muted-foreground max-w-md">
                      A list of regional areas managed by this mission will appear here.
                    </p>
                  </Card>
                </AnimateOnScroll>
              </TabsContent>

              {/* DIVISIONS TAB */}
              <TabsContent value="divisions" className="mt-0 outline-none">
                <AnimateOnScroll variant="fade-up" delay={0.2}>
                  <Card className="bg-card border border-border/50 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                      <MapPin className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Divisions</h3>
                    <p className="text-muted-foreground max-w-md">
                      A directory of district divisions within the areas.
                    </p>
                  </Card>
                </AnimateOnScroll>
              </TabsContent>

              {/* CHURCHES TAB */}
              <TabsContent value="churches" className="mt-0 outline-none">
                <AnimateOnScroll variant="fade-up" delay={0.2}>
                  <Card className="bg-card border border-border/50 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                      <ChurchIcon className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Churches</h3>
                    <p className="text-muted-foreground max-w-md">
                      All registered congregations associated with this mission.
                    </p>
                  </Card>
                </AnimateOnScroll>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

