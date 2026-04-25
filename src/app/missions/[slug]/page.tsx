import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getMissionBySlug } from "@/services/onboarding"
import { getUserProfile } from "@/services/dashboard"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin, ChevronLeft, Calendar, Users2, GitBranch, Church as ChurchIcon } from "lucide-react"
import Link from "next/link"

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16">
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shrink-0">
            {mission.logo_url ? (
              <img src={mission.logo_url} alt={mission.name} className="w-14 h-14 object-contain" />
            ) : (
              <Globe className="w-12 h-12" />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <Badge className="bg-primary/5 text-primary border-primary/10 font-black uppercase text-[9px] px-3">
              Mission
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic leading-none">
              {mission.name}
            </h1>
            {mission.address && (
              <p className="text-muted-foreground font-semibold italic flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {mission.address}
              </p>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Users2,
              label: "Personnel",
              value: "—",
              desc: "Active mission members",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              icon: GitBranch,
              label: "Divisions",
              value: "—",
              desc: "Districts under this mission",
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
            {
              icon: ChurchIcon,
              label: "Churches",
              value: "—",
              desc: "Registered congregations",
              color: "text-primary",
              bg: "bg-primary/10",
            },
          ].map((item) => (
            <Card
              key={item.label}
              className="bg-card border border-border/50 rounded-[2rem] overflow-hidden group hover:border-primary/20 transition-all"
            >
              <CardContent className="p-8 space-y-6">
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                  <h4 className="text-4xl font-black tracking-tight text-foreground">{item.value}</h4>
                  <p className="text-[10px] font-medium text-muted-foreground mt-2">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission details card */}
        <Card className="bg-secondary/30 border border-border/40 rounded-[3rem] p-10 md:p-14 space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Established {new Date(mission.created_at).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h3 className="text-2xl font-black uppercase italic tracking-tight">{mission.name}</h3>
          <p className="text-muted-foreground font-semibold italic leading-relaxed text-sm max-w-2xl">
            This mission serves as a regional administrative body within the Adventist ecclesiastical hierarchy. It oversees the spiritual and organizational needs of its member churches, areas, and divisions.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
