import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { getUserProfile } from "@/services/dashboard";
import { getChurchMembers, getMemberStats, getChurchProfiles } from "@/services/clerk";
import { ClerkDashboardShell } from "@/components/clerk/clerk-dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, LayoutDashboard } from "lucide-react";

export default async function ClerkDashboardPage() {
  const session = await getUserProfile();

  if (!session?.user) redirect("/login");

  const { user, profile } = session;

  if (!profile?.church_id) redirect("/onboarding");

  // Non-clerk users get a notice page instead of a silent redirect
  const isClerk = profile?.approved_roles?.includes("Church Clerk");

  if (!isClerk) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <main className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6">
          <Card className="bg-card border border-border rounded-[2.5rem] shadow-sm w-full max-w-md">
            <CardContent className="p-10 flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-destructive" />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Access Restricted
                </p>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic text-foreground leading-tight">
                  Clerk Role Required
                </h1>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  This area is reserved for designated Church Clerks. Your account
                  does not currently have the <strong className="text-foreground">Church Clerk</strong> role.
                </p>
                <p className="text-xs text-muted-foreground">
                  If you believe this is an error, contact your church Elder or Pastor to request the role.
                </p>
              </div>

              <Link href="/dashboard">
                <div className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity min-h-[48px]">
                  <LayoutDashboard className="w-4 h-4" />
                  Back to Dashboard
                </div>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const [members, stats, churchProfiles] = await Promise.all([
    getChurchMembers(),
    getMemberStats(),
    getChurchProfiles(),
  ]);

  // Church name comes from the hierarchy resolved by getUserProfile
  const churchName = (profile as any).hierarchy?.church ?? "Your Church";

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
