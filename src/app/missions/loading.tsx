import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function MissionsLoading() {
  return (
    <div className="min-h-screen bg-background">
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

      <section className="relative overflow-hidden border-b border-border bg-card py-20">
        <div className="relative mx-auto max-w-7xl px-6 flex flex-col items-center text-center">
          <Skeleton className="mb-3 h-3 w-48" />
          <div className="mx-auto mb-5 h-[3px] w-12 rounded-full bg-muted" />
          <Skeleton className="mb-4 h-14 w-[300px] sm:w-[450px]" />
          <Skeleton className="h-4 w-[250px] sm:w-[350px]" />
          <Skeleton className="mt-2 h-4 w-[200px] sm:w-[300px]" />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-full rounded-full sm:w-[300px]" />
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
              <Skeleton className="mb-4 h-12 w-12 rounded-xl" />
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="mb-6 h-4 w-1/2" />
              <div className="mt-auto flex items-center justify-between">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
