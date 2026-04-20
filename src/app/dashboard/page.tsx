import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DashboardShell } from "@/components/dashboard-shell";
import { getUserProfile, getMissionOverview } from "@/services/dashboard";
import { redirect } from "next/navigation";
import { creatorRepos } from "@/lib/config";

export default async function DashboardPage() {
  const session = await getUserProfile();
  
  if (!session?.user) {
    redirect("/login");
  }

  const { user, profile, roles = [] } = session;

  // Redirect to onboarding if no placement is set
  if (profile && !profile.mission_id && !profile.area_id && !profile.division_id && !profile.church_id) {
    redirect("/onboarding");
  }
  const overview = await getMissionOverview();
  const repos = creatorRepos;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic leading-none">
            Mission Control
          </h1>
          <p className="mt-2 text-muted-foreground font-semibold italic">
            Welcome back, {profile?.first_name || user.email?.split("@")[0]}. Systems are nominal.
          </p>
        </div>

        <DashboardShell 
          user={user} 
          profile={profile} 
          roles={roles}
          overview={overview} 
          repos={repos} 
        />
      </main>

      <Footer />
    </div>
  );
}
