"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin, Search, ChevronRight, ChevronLeft } from "lucide-react"

type Mission = {
  id: string
  name: string
  slug: string
  address: string | null
  logo_url: string | null
}

const ITEMS_PER_PAGE = 6

function MissionCard({ mission }: { mission: Mission }) {
  return (
    <a href={`/missions/${mission.slug}`} className="group block h-full">
      <Card className="relative h-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardContent className="flex h-full flex-col gap-5 p-6">
          {/* Icon row */}
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
              {mission.logo_url ? (
                <img
                  src={mission.logo_url}
                  alt={mission.name}
                  className="h-7 w-7 object-contain"
                />
              ) : (
                <Globe className="h-6 w-6" />
              )}
            </div>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary"
            >
              Mission
            </Badge>
          </div>

          {/* Name + address */}
          <div className="flex-1 space-y-2">
            <h2 className="font-serif text-[18px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
              {mission.name}
            </h2>
            {mission.address ? (
              <p className="flex items-start gap-1.5 text-[12px] text-muted-foreground">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                {mission.address}
              </p>
            ) : (
              <p className="text-[12px] italic text-muted-foreground/50">
                No address on file
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1 border-t border-border pt-4 text-[11px] font-bold uppercase tracking-widest text-primary transition-all duration-200 group-hover:gap-2">
            View Mission
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </CardContent>
      </Card>
    </a>
  )
}

function EmptySearch({ query }: { query: string }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Search className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-lg text-foreground">No results for &ldquo;{query}&rdquo;</h3>
        <p className="text-sm text-muted-foreground">Try a different mission name or location.</p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Globe className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-lg text-foreground">No missions configured</h3>
        <p className="text-sm text-muted-foreground">Mission records will appear here once added.</p>
      </div>
    </div>
  )
}

export function MissionsGrid({ missions }: { missions: Mission[] }) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return missions
    return missions.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.address?.toLowerCase().includes(q)
    )
  }, [missions, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  if (missions.length === 0) return <EmptyState />

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <div className="relative mx-auto max-w-lg">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by mission name or location…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-12 rounded-xl border-border pl-10 text-sm focus-visible:ring-ring"
        />
      </div>

      {/* Result count */}
      <p className="text-center text-sm text-muted-foreground">
        {filtered.length === missions.length
          ? `${missions.length} mission${missions.length !== 1 ? "s" : ""}`
          : `${filtered.length} of ${missions.length} missions`}
      </p>

      {/* Grid */}
      {paginated.length === 0 ? (
        <EmptySearch query={search} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
