import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { getUserProfile } from "@/services/dashboard";
import { getChurchMembers, getMemberStats, getChurchProfiles } from "@/services/clerk";
import { ClerkDashboardShell } from "@/components/clerk/clerk-dashboard-shell";

export default async function ClerkDashboardPage() {
  const session = await getUserProfile();

  if (!session?.user) redirect("/login");

  const { user, profile } = session;

  if (!profile?.church_id) redirect("/onboarding");

  if (!profile?.approved_roles?.includes("Church Clerk")) redirect("/dashboard");

  const [members, stats, churchProfiles] = await Promise.all([
    getChurchMembers(),
    getMemberStats(),
    getChurchProfiles(),
  ]);

  const churchName = (profile as any).churches?.name ?? "Your Church";

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <ClerkDashboardShell
        user={user}
        profile={profile}
        members={members}
        stats={stats}
        churchProfiles={churchProfiles}
        churchName={churchName}
      />
    </div>
  );
}
