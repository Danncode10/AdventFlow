"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Item {
  id: string
  name: string
}

interface SearchableSelectorProps {
  label: string
  items: Item[]
  value: string | null
  onSelect: (id: string) => void
  placeholder: string
  disabled?: boolean
  loading?: boolean
}

export function SearchableSelector({
  label,
  items,
  value,
  onSelect,
  placeholder,
  disabled = false,
  loading = false
}: SearchableSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedItem = items.find((item) => item.id === value)

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between transition-all outline-none focus:ring-2 ring-primary/20",
          "hover:border-primary/50 group",
          disabled && "opacity-50 cursor-not-allowed",
          open && "border-primary ring-2 ring-primary/10"
        )}
      >
        <span className={cn(
          "font-bold uppercase tracking-tight truncate",
          !selectedItem && "text-muted-foreground"
        )}>
          {selectedItem ? selectedItem.name : placeholder}
        </span>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : (
          <ChevronsUpDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>

      {open && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border/60 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
          <div className="p-3 border-b border-border/50 bg-muted/20 flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              placeholder="Search..."
              className="bg-transparent border-none outline-none w-full text-sm font-semibold uppercase tracking-tight"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="p-4 text-center text-xs font-bold text-muted-foreground uppercase italic">
                No matches found
              </div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id)
                    setOpen(false)
                    setSearch("")
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl flex items-center justify-between transition-all group",
                    value === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted font-semibold uppercase tracking-tight text-sm"
                  )}
                >
                  <span>{item.name}</span>
                  {value === item.id && <Check className="w-4 h-4" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
