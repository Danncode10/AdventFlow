import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
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
      
      <main className="flex-1">
        {/* Generic Hero Skeleton */}
        <div className="w-full h-[50vh] md:h-[400px] bg-muted/20 flex flex-col items-center justify-center gap-6 p-8 text-center border-b">
          <Skeleton className="h-4 w-48 rounded-full" />
          <Skeleton className="h-12 md:h-16 w-full max-w-3xl" />
          <Skeleton className="h-5 w-full max-w-xl" />
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-40 rounded-xl hidden sm:block" />
          </div>
        </div>
        
        {/* Generic Content Skeleton */}
        <div className="container mx-auto py-16 px-4 md:px-8 space-y-12">
          <div className="space-y-4 flex flex-col items-center text-center max-w-2xl mx-auto">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-8 border border-border bg-card rounded-[22px] space-y-4">
                <Skeleton className="h-12 w-12 rounded-[14px]" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-24 mt-6" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
