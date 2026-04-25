import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"

export default function MissionLoading() {
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

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        {/* Back link */}
        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-10">
          <ChevronLeft className="w-4 h-4" />
          <Skeleton className="h-3 w-32" />
        </div>

        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16">
          <Skeleton className="w-24 h-24 rounded-3xl shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-12 md:h-16 w-[300px] md:w-[500px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="bg-card border border-border/50 rounded-[2rem] overflow-hidden"
            >
              <CardContent className="p-8 space-y-6">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div>
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-10 w-16 mb-3" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission details card */}
        <Card className="bg-secondary/30 border border-border/40 rounded-[3rem] p-10 md:p-14 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-3/4 max-w-lg" />
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
