import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getAllMissions } from "@/services/onboarding"
import { getUserProfile } from "@/services/dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin, ChevronRight } from "lucide-react"
import { AnimateOnScroll, StaggerOnScroll, StaggerItem } from "@/components/animate-on-scroll"

export default async function MissionsPage() {
  const [session, missions] = await Promise.all([
    getUserProfile(),
    getAllMissions(),
  ])

  const user = session?.user ?? null

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card py-[80px]">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(30,58,138,0.06), transparent)" }} />
        <AnimateOnScroll variant="fade-up" className="relative mx-auto max-w-7xl px-8 text-center">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            Adventist Mission Network
          </div>
          <div className="mx-auto mb-4 h-[3px] w-12 rounded-full bg-gradient-to-r from-gold to-gold-light" />
          <h1 className="font-serif text-[clamp(36px,5vw,60px)] leading-[1.1] tracking-[-1px] text-foreground">
            Choose your <em className="not-italic text-primary">Mission</em>
          </h1>
          <p className="mx-auto mt-4 max-w-[480px] text-[16px] leading-[1.7] text-muted-foreground">
            Select the mission territory you belong to. Each mission oversees the churches, divisions, and members within its region.
          </p>
        </AnimateOnScroll>
      </section>

      {/* Mission grid */}
      <main className="mx-auto max-w-7xl px-8 py-[80px]">
        {missions.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 rounded-[3rem] border border-dashed border-border bg-muted/20 p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <Globe className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl text-foreground">No missions configured</h3>
              <p className="text-sm text-muted-foreground">Mission records will appear here once added.</p>
            </div>
          </div>
        ) : (
          <StaggerOnScroll className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {missions.map((mission) => (
              <StaggerItem key={mission.id}>
                <a href={`/missions/${mission.slug}`} className="group block h-full">
                  <Card className="h-full overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
                    <CardContent className="flex h-full flex-col gap-6 p-8">
                      {/* Icon + badge */}
                      <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:bg-primary/20">
                          {mission.logo_url ? (
                            <img src={mission.logo_url} alt={mission.name} className="h-8 w-8 object-contain" />
                          ) : (
                            <Globe className="h-7 w-7" />
                          )}
                        </div>
                        <Badge className="border-primary/10 bg-primary/5 text-[9px] font-black uppercase tracking-widest text-primary px-3">
                          Mission
                        </Badge>
                      </div>

                      {/* Name + address */}
                      <div className="flex-1 space-y-2">
                        <h2 className="font-serif text-[20px] leading-tight tracking-[-0.2px] text-foreground transition-colors group-hover:text-primary">
                          {mission.name}
                        </h2>
                        {mission.address && (
                          <p className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {mission.address}
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary transition-all group-hover:gap-2.5">
                        View Mission <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </StaggerItem>
            ))}
          </StaggerOnScroll>
        )}
      </main>

      <Footer />
    </div>
  )
}
