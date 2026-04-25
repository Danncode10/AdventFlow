import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getAllMissions } from "@/services/onboarding"
import { getUserProfile } from "@/services/dashboard"
import { AnimateOnScroll } from "@/components/animate-on-scroll"
import { MissionsGrid } from "@/components/missions-grid"

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
      <section className="relative overflow-hidden border-b border-border bg-card py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(30,58,138,0.06), transparent)",
          }}
        />
        <AnimateOnScroll
          variant="fade-up"
          className="relative mx-auto max-w-7xl px-6 text-center"
        >
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            Adventist Mission Network
          </div>
          <div className="mx-auto mb-5 h-[3px] w-12 rounded-full bg-gradient-to-r from-primary to-primary/40" />
          <h1 className="font-serif text-[clamp(36px,5vw,56px)] leading-[1.1] tracking-[-1px] text-foreground">
            Choose your{" "}
            <em className="not-italic text-primary">Mission</em>
          </h1>
          <p className="mx-auto mt-4 max-w-[500px] text-base leading-[1.7] text-muted-foreground">
            Select the mission territory you belong to. Each mission oversees
            the churches, divisions, and members within its region.
          </p>
        </AnimateOnScroll>
      </section>

      {/* Missions grid with search + pagination */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        <MissionsGrid missions={missions} />
      </main>

      <Footer />
    </div>
  )
}
