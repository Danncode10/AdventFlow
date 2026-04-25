import { getUserProfile } from "@/services/dashboard";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

async function getDailyVerse() {
  try {
    const res = await fetch("https://bible-api.com/john+3:16", { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    return { text: data.text?.trim(), reference: data.reference };
  } catch {
    return null;
  }
}

export default async function Home() {
  const [session] = await Promise.all([getUserProfile()]);
  const user = session?.user;

  return (
    <>
      <Navbar user={user} />

      {/* ── HERO ── */}
      <section id="home" className="relative overflow-hidden" style={{ padding: "120px 0 90px" }}>
        {/* Background photo */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/hero-bg.jpg')",
              backgroundPosition: "center 35%",
              filter: "brightness(0.55) saturate(0.9)",
            }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(12,26,64,0.5) 0%, rgba(12,26,64,0.3) 40%, rgba(250,250,248,0.95) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(30,58,138,0.2) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-8 text-center">
          {/* Eyebrow */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-hero-gold animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/85">
              For Seventh-day Adventist Members &amp; Leaders
            </span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto mb-6 max-w-[780px] font-serif text-[clamp(48px,7vw,80px)] leading-[1.05] tracking-[-1.5px] text-white" style={{ textShadow: "0 2px 24px rgba(6,13,31,0.6)" }}>
            Your church, <em className="not-italic text-hero-gold">connected and organized</em>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-12 max-w-[520px] text-[17px] leading-[1.7] text-white/70">
            AdventFlow is the online home for your Adventist congregation — where members stay informed, leaders coordinate, and the whole mission moves forward together.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-[14px] font-semibold text-white no-underline shadow-[0_2px_8px_rgba(30,58,138,0.3),0_12px_32px_rgba(30,58,138,0.2)] transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_4px_12px_rgba(30,58,138,0.35),0_16px_40px_rgba(30,58,138,0.25)]"
            >
              Join your congregation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-7 py-3.5 text-[14px] font-medium text-foreground no-underline transition-all hover:bg-card hover:border-border/80"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-8 py-[100px]">
          <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">

            {/* Left: text */}
            <div>
              <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                How AdventFlow Works
              </div>
              <div className="mb-6 h-[3px] w-12 rounded-full bg-gradient-to-r from-gold to-gold-light" />
              <h2 className="mb-4 font-serif text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.5px] text-foreground">
                From your local church{" "}
                <em className="not-italic text-primary">to the whole Mission</em>
              </h2>
              <p className="max-w-[440px] text-[16px] leading-[1.7] text-muted-foreground">
                The Adventist Church is organized in levels — your local congregation is part of a District, which belongs to a Mission. AdventFlow connects all these levels so everyone stays on the same page.
              </p>

              <div className="mt-9 flex flex-col gap-6">
                {[
                  {
                    bg: "bg-primary/[0.07]",
                    stroke: "#1e3a8a",
                    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
                    title: "Your information is private & safe",
                    desc: "Each member sees only what they need. Elders see their congregation. Pastors see their district. No one sees more than they should.",
                  },
                  {
                    bg: "bg-gold/[0.08]",
                    stroke: "#b08c3a",
                    path: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
                    title: "Leaders approve the right way",
                    desc: "Just like in your church — Elders confirm Members, Pastors confirm Elders, Mission Admins confirm Pastors. The proper church order is followed every step of the way.",
                  },
                  {
                    bg: "bg-green-500/[0.08]",
                    stroke: "#16a34a",
                    path: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
                    title: "Administrators get a clear overview",
                    desc: "Mission administrators can see financial summaries and church activities across all congregations — without sifting through paperwork.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3.5">
                    <div className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] ${item.bg}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.path} />
                      </svg>
                    </div>
                    <div>
                      <div className="mb-0.5 text-[14px] font-semibold text-foreground">{item.title}</div>
                      <div className="text-[13px] leading-[1.6] text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: hierarchy visual */}
            <div className="relative rounded-[32px] border border-border bg-gradient-to-br from-[#f8faff] to-[#eef3fb] p-10">
              <div className="absolute inset-0 rounded-[32px] pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(30,58,138,0.06), transparent)" }} />
              <div className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Your church fits here
              </div>
              <div className="flex flex-col gap-3.5">
                {[
                  { num: "01", name: "Mission", badge: "Mission Admin", active: false },
                  { num: "02", name: "Area", badge: "District Leader", active: false },
                  { num: "03", name: "Division", badge: "District Pastor", active: false },
                  { num: "04", name: "Your Church", badge: "Members & Elders", active: true },
                ].map((tier, idx) => (
                  <div key={idx}>
                    {idx > 0 && <div className="mx-auto my-0 block h-3.5 w-px bg-gradient-to-b from-border to-transparent" />}
                    <div
                      className={`flex items-center justify-between rounded-[14px] border px-5 py-4 transition-all hover:shadow-[0_4px_16px_rgba(30,58,138,0.08)] ${
                        tier.active
                          ? "border-primary/30 bg-primary/[0.03]"
                          : "border-border bg-white hover:border-primary/25"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-[26px] w-[26px] items-center justify-center rounded-[7px] text-[11px] font-bold ${tier.active ? "bg-primary/15 text-primary" : "bg-primary/[0.07] text-primary"}`}>
                          {tier.num}
                        </div>
                        <span className={`text-[14px] font-semibold tracking-[0.02em] ${tier.active ? "font-bold text-primary" : "text-foreground"}`}>
                          {tier.name}
                        </span>
                      </div>
                      <span className={`rounded-full px-2.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.1em] ${tier.active ? "bg-primary/12 text-primary" : "bg-primary/[0.07] text-primary"}`}>
                        {tier.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2.5 border-t border-border pt-5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <span className="text-[12px] font-medium text-muted-foreground">Every level stays updated in real time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLS / FEATURES ── */}
      <section id="tools" className="bg-background py-[100px]">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-[60px] text-center">
            <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">What You Can Do</div>
            <div className="mx-auto mt-3.5 mb-3.5 h-[3px] w-12 rounded-full bg-gradient-to-r from-gold to-gold-light" />
            <h2 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.5px] text-foreground">
              Everything your congregation needs
            </h2>
            <p className="mx-auto mt-4 max-w-[460px] text-[16px] leading-[1.7] text-muted-foreground">
              Whether you are a regular member, a church elder, a pastor, or a mission administrator — AdventFlow has something for you.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                bg: "bg-red-500/[0.07]",
                stroke: "#dc2626",
                path: "M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l6 6v10a2 2 0 0 1-2 2zM17 21V13H7v8M7 3v5h8",
                title: "Church Bulletin",
                desc: "Read the latest announcements, sermons, and news from your church leaders — posted online so you never miss a thing, even when you're away.",
                tag: "Announcements · Sermons · News",
              },
              {
                bg: "bg-green-500/[0.07]",
                stroke: "#16a34a",
                path: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
                title: "Tithes & Offerings",
                desc: "Submit your weekly tithe and offerings easily from your phone. Treasurers can view and manage all records transparently — no more lost papers.",
                tag: "Easy to submit · Transparent · Tracked",
              },
              {
                bg: "bg-blue-500/[0.07]",
                stroke: "#2563eb",
                path: "M3 4h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM16 2v4M8 2v4M2 10h20",
                title: "Church Events Calendar",
                desc: "See all upcoming Sabbath programs, prayer meetings, youth events, and mission gatherings in one simple calendar — across your local church and beyond.",
                tag: "Local · District · Mission-wide",
              },
              {
                bg: "bg-purple-500/[0.07]",
                stroke: "#9333ea",
                path: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
                title: "Member Directory",
                desc: "A secure directory of members, elders, and leaders in your congregation. Find who to contact, and know who serves in which role in your church family.",
                tag: "Private · Up to date · Role-aware",
              },
              {
                bg: "bg-amber-500/[0.07]",
                stroke: "#d97706",
                path: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
                title: "Study Resources",
                desc: "Access Bible studies, Sabbath School materials, and church resources organized by the 28 Fundamental Beliefs — all in one place for members and leaders alike.",
                tag: "28 Beliefs · Bible studies · Sermons",
              },
              {
                bg: "bg-primary/10",
                stroke: "#1e3a8a",
                path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
                title: "Daily Bible Verse",
                desc: "Every time you open AdventFlow, a fresh Bible verse greets you — a simple reminder of God's Word to start your day with purpose and peace.",
                tag: "Daily · Uplifting · Scripture-based",
                accent: true,
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`group rounded-[22px] border p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(30,58,138,0.08)] ${
                  card.accent
                    ? "border-primary/15 bg-gradient-to-br from-primary/[0.03] to-primary/[0.06]"
                    : "border-border bg-card hover:border-primary/20"
                }`}
              >
                <div className={`mb-6 flex h-[50px] w-[50px] items-center justify-center rounded-[14px] ${card.bg}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={card.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={card.path} />
                  </svg>
                </div>
                <div className="mb-2.5 font-serif text-[20px] tracking-[-0.2px] text-foreground">{card.title}</div>
                <div className="text-[14px] leading-[1.7] text-muted-foreground">{card.desc}</div>
                <span className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
                  {card.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section id="who" className="border-t border-border bg-card py-[100px]">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mx-auto mb-[52px] max-w-[560px] text-center">
            <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">Who Is AdventFlow For?</div>
            <div className="mx-auto mt-3.5 mb-3.5 h-[3px] w-12 rounded-full bg-gradient-to-r from-gold to-gold-light" />
            <h2 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.5px] text-foreground">
              Built for <em className="not-italic text-foreground italic">every member</em> of your church
            </h2>
            <p className="mx-auto mt-4 text-[16px] leading-[1.7] text-muted-foreground">
              Whether you sit in the pew or lead the congregation — AdventFlow has a role for you.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                status: "done",
                forLabel: "For Members",
                title: "Regular Church Members",
                desc: "Read the church bulletin, see upcoming events, access Bible studies, and stay connected with your church family — all from your phone or computer.",
              },
              {
                status: "done",
                forLabel: "For Leaders",
                title: "Elders & Deacons",
                desc: "Approve new members, coordinate Sabbath programs, and communicate with your congregation through the bulletin — all in one place.",
              },
              {
                status: "active",
                forLabel: "For Pastors",
                title: "District Pastors",
                desc: "Oversee multiple churches in your district. See attendance, finances, and activities across all your congregations with one simple dashboard.",
              },
              {
                status: "planned",
                forLabel: "For Treasurers",
                title: "Church Treasurers",
                desc: "Receive and record tithes and offerings from members. Generate weekly and monthly financial reports instantly — no more spreadsheets.",
              },
              {
                status: "planned",
                forLabel: "For Media Teams",
                title: "Media & Communications",
                desc: "Publish announcements, upload sermons, and share event updates with the whole congregation — with a simple, easy-to-use editor.",
              },
              {
                status: "planned",
                forLabel: "For Administrators",
                title: "Mission Administrators",
                desc: "Get a bird's-eye view of all churches in your mission territory — financial health, membership growth, and upcoming events — in one place.",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-[22px] border p-7 transition-all hover:shadow-[0_4px_20px_rgba(30,58,138,0.07)] ${
                  card.status === "active"
                    ? "border-primary/30 bg-gradient-to-br from-primary/[0.02] to-transparent"
                    : "border-border bg-card hover:border-primary/20"
                }`}
              >
                {/* Status dot */}
                <span
                  className={`absolute right-5 top-5 h-2 w-2 rounded-full ${
                    card.status === "done"
                      ? "bg-green-500"
                      : card.status === "active"
                      ? "bg-primary animate-pulse"
                      : "bg-border"
                  }`}
                />
                <div className={`mb-2 text-[11px] font-bold uppercase tracking-[0.15em] ${card.status === "active" ? "text-primary" : "text-muted-foreground/60"}`}>
                  {card.forLabel}
                </div>
                <div className="mb-2 text-[15px] font-semibold text-foreground">{card.title}</div>
                <div className="text-[13px] leading-[1.6] text-muted-foreground">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-primary py-[100px]">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 80% at 80% 50%, rgba(255,255,255,0.05), transparent)" }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/15" />
        <div className="relative mx-auto max-w-[640px] px-8 text-center">
          <div className="mb-5 text-[11px] font-bold uppercase tracking-[0.15em] text-white/55">
            Free for every congregation
          </div>
          <h2 className="mb-4 font-serif text-[clamp(36px,5vw,54px)] leading-[1.1] tracking-[-0.5px] text-white">
            Ready to bring your church <em className="not-italic text-white/75">online?</em>
          </h2>
          <p className="mb-11 text-[16px] leading-[1.7] text-white/60">
            Join your congregation on AdventFlow. Sign up in minutes and connect with your church family, your leaders, and your mission.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-[14px] font-semibold text-primary no-underline shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(0,0,0,0.2)]"
            >
              Join your congregation
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-[14px] font-medium text-white/80 no-underline transition-all hover:border-white/35 hover:bg-white/15"
            >
              Already a member? Sign in
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
