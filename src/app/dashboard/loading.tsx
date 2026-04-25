import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* We can pass null or a dummy user to Navbar, or just render a skeleton navbar if needed. Since Navbar is client-side or takes user, we might need a generic Navbar or just use the same Navbar without user if it supports it. Wait, Navbar requires user in page.tsx: <Navbar user={user} />. Let's just create a mock navbar or skip it for the skeleton if we can't easily mock the user. Actually, maybe we can just make a generic loading UI that looks like the page structure. */}
      {/* For simplicity, we'll build a skeleton header that looks similar. */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="mb-12 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Dashboard Shell Skeleton */}
        <div className="grid gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-[120px] w-full rounded-xl" />
              <Skeleton className="h-[120px] w-full rounded-xl" />
              <Skeleton className="h-[120px] w-full rounded-xl" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
