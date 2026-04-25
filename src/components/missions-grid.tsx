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
      <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl">
        {/* Animated gradient top border */}
        <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-primary to-primary/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardContent className="flex flex-1 flex-col gap-4 p-6 pt-7">
          {/* Icon + Badge row */}
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary/20">
              {mission.logo_url ? (
                <img
                  src={mission.logo_url}
                  alt={mission.name}
                  className="h-6 w-6 object-contain"
                />
              ) : (
                <Globe className="h-5 w-5" />
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
          <div className="flex-1 space-y-1.5">
            <h2 className="font-serif text-[17px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
              {mission.name}
            </h2>
            {mission.address ? (
              <p className="flex items-start gap-1.5 text-[12px] text-muted-foreground">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                {mission.address}
              </p>
            ) : (
              <p className="text-[12px] italic text-muted-foreground/40">
                No address on file
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1 border-t border-border pt-4 text-[11px] font-bold uppercase tracking-widest text-primary transition-all duration-200 group-hover:gap-2.5">
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-4">
          {/* Prev */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Ellipsis logic */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === page
            const isEdge = p === 1 || p === totalPages
            const isNear = Math.abs(p - page) <= 1
            if (!isEdge && !isNear) {
              if (p === 2 || p === totalPages - 1) {
                return (
                  <span key={p} className="flex h-9 w-5 items-center justify-center text-sm text-muted-foreground">
                    …
                  </span>
                )
              }
              return null
            }
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                {p}
              </button>
            )
          })}

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
