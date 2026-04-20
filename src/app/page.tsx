import { ArrowRight, ShieldCheck, Heart, Users, Calendar, Banknote, Sparkles, Star, Check } from "lucide-react";
import { getUserProfile } from "@/services/dashboard";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/lib/config";

export default async function Home() {
  const session = await getUserProfile();
  const user = session?.user;

  return (
    <>
      <Navbar user={user} />

      {/* =============================
          HERO SECTION: THE SANCTUARY
          ============================= */}
      <section id="home" className="relative overflow-hidden bg-background">
        {/* Divine Light Gradients */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[800px] w-[800px] rounded-full bg-primary/5 blur-[140px] -z-10" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-accent/5 blur-[120px] -z-10" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-10 py-32 md:py-48 text-center">
          {/* Sanctuary Badge */}
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 group cursor-default">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              The Mission Hub v4.0
            </span>
          </div>

          <h1 className="mx-auto max-w-5xl text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.9] uppercase italic">
            Empowering the{" "}
            <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent italic">
              Mission
            </span>
          </h1>

          <p className="mx-auto mt-10 max-w-2xl text-lg text-muted-foreground font-medium leading-relaxed opacity-80">
            AdventFlow is the premier ecclesiastical operating system for the Seventh-day Adventist Church. 
            A unified sanctuary for personnel, treasury, and mission-wide coordination.
          </p>

          {/* Sanctuary Portal CTAs */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href={user ? "/dashboard" : "/signup"}
              className="group relative overflow-hidden px-10 py-4 text-xs font-black uppercase tracking-widest rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                Enter Sanctuary Portal
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </a>

            <a
              href="/#mission"
              className="px-10 py-4 text-xs font-black uppercase tracking-widest rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-foreground hover:bg-secondary transition-all flex items-center gap-3 active:scale-95"
            >
              Learn the Architecture
            </a>
          </div>

          {/* Trusted Badge */}
          <div className="mt-20 flex flex-col items-center gap-4 opacity-40">
            <p className="text-[9px] font-black uppercase tracking-[0.4em]">Integrated Hierarchies</p>
            <div className="flex gap-8 items-center grayscale opacity-60">
               <span className="font-black italic tracking-tighter text-lg text-foreground">MISSION</span>
               <span className="font-black italic tracking-tighter text-lg text-foreground">AREA</span>
               <span className="font-black italic tracking-tighter text-lg text-foreground">DIVISION</span>
               <span className="font-black italic tracking-tighter text-lg text-foreground">CHURCH</span>
            </div>
          </div>
        </div>
      </section>

      {/* =============================
          THE MISSION TREE (Hierarchical Excellence)
          ============================= */}
      <section id="mission" className="bg-card border-y border-border isolate">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Hierarchical Scoping</span>
              <h2 className="mt-6 text-4xl sm:text-5xl font-black text-foreground tracking-tighter leading-[0.9] uppercase italic">
                A Unified <br/> <span className="text-primary italic">Chain of Command</span>
              </h2>
              <p className="mt-8 text-muted-foreground text-lg font-medium leading-relaxed">
                AdventFlow mirrors the Adventist organizational structure perfectly. From the local Church member 
                to District Pastors and Mission Administrators, every layer is scoped, secured, and synchronized.
              </p>
              
              <div className="mt-12 space-y-6">
                {[
                  { icon: ShieldCheck, title: "RLS-Hardened Security", desc: "Every record is scoped to the user's specific organization level." },
                  { icon: Users, title: "Tiered Approvals", desc: "Verification flow follows the ecclesiastical chain of command." },
                  { icon: Sparkles, title: "AI-Driven Insights", desc: "Intelligent analytics for mission-wide progress tracking." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 h-6 w-6 text-primary shrink-0"><item.icon size={20} strokeWidth={3} /></div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Representation of the Mission Tree */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl group-hover:bg-primary/10 transition-colors" />
              <div className="relative aspect-square rounded-[3rem] border border-border/60 bg-gradient-to-br from-card to-background p-10 flex flex-col justify-center gap-6 shadow-2xl">
                {[
                  { label: "MISSION", level: "01", color: "from-primary to-blue-600", width: "w-full" },
                  { label: "AREA", level: "02", color: "from-blue-500 to-cyan-500", width: "w-[85%]" },
                  { label: "DIVISION", level: "03", color: "from-cyan-500 to-emerald-500", width: "w-[70%]" },
                  { label: "CHURCH", level: "04", color: "from-emerald-500 to-green-500", width: "w-[55%]" }
                ].map((tier, idx) => (
                  <div key={idx} className={`${tier.width} h-20 rounded-[1.5rem] bg-gradient-to-r ${tier.color} p-px shadow-lg`}>
                    <div className="w-full h-full rounded-[1.4rem] bg-card/90 backdrop-blur-xl flex items-center justify-between px-8">
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-foreground">{tier.level}</span>
                       <span className="text-sm font-black uppercase tracking-[0.2em] italic text-foreground">{tier.label}</span>
                       <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================
          ECCLESIASTICAL TOOLS
          ============================= */}
      <section id="community" className="bg-background">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-32">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Sanctuary Suite</span>
            <h2 className="mt-6 text-4xl sm:text-5xl font-black text-foreground tracking-tighter uppercase italic">
              Tools for God&apos;s Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Heart, 
                title: "Digital Bulletin", 
                desc: "Rich-text Tiptap editor for media teams to broadcast announcements across the mission.",
                color: "bg-red-500/10 text-red-500"
              },
              { 
                icon: Banknote, 
                title: "Treasury Hub", 
                desc: "Mobile-first financial remittance for Tithe and Offering tracking with automated reports.",
                color: "bg-emerald-500/10 text-emerald-500"
              },
              { 
                icon: Calendar, 
                title: "Mission Calendar", 
                desc: "Synchronized scheduling across all organizational tiers with role-based permissions.",
                color: "bg-blue-500/10 text-blue-500"
              }
            ].map((tool, idx) => (
              <div key={idx} className="group p-8 rounded-[2rem] bg-card/50 border border-border/40 hover:border-primary/20 hover:bg-card transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <tool.icon size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-4 italic italic text-foreground">{tool.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-sm">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================
          CALL TO ACTION
          ============================= */}
      <section className="relative py-32 overflow-hidden border-t border-border">
        {/* Background Accent */}
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="mx-auto max-w-4xl px-6 sm:px-10 text-center">
          <Star className="w-12 h-12 text-primary mx-auto mb-8 animate-pulse" fill="currentColor" />
          <h2 className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter uppercase italic leading-[0.9] mb-8">
            Begin the Mission <br/> Today
          </h2>
          <p className="text-muted-foreground text-lg font-medium mb-12 max-w-xl mx-auto">
            Ready to streamline your church administration? Join the mission and enter the Sanctuary Hub.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
            >
              Request Access
            </a>
            <a
              href="/login"
              className="w-full sm:w-auto px-12 py-5 rounded-2xl border border-border bg-card/50 font-black uppercase tracking-widest text-xs hover:bg-secondary transition-all text-foreground"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
