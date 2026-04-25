"use client";

import * as React from "react";
import { Link2, Search, Loader2, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { linkProfileToMember } from "@/services/clerk";
import type { ChurchMember } from "@/services/clerk";

interface Props {
  member: ChurchMember;
  churchProfiles: any[];
  onLinked: (memberId: string, profileId: string) => void;
  onClose: () => void;
}

export function LinkAccountDialog({ member, churchProfiles, onLinked, onClose }: Props) {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const filtered = churchProfiles.filter(p => {
    const name = `${p.first_name ?? ""} ${p.last_name ?? ""}`.toLowerCase();
    return name.includes(search.toLowerCase()) && p.id !== member.linked_profile_id;
  });

  const handleLink = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      await linkProfileToMember(member.id, selected);
      onLinked(member.id, selected);
    } catch (e: any) {
      setError(e.message ?? "Failed to link account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-[2rem] border-border max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black uppercase tracking-tight">Link Account</DialogTitle>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Linking to: <strong className="text-foreground">{member.first_name} {member.last_name}</strong>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <p className="text-xs text-muted-foreground">
            Select an existing account from <strong className="text-foreground">this church</strong> to link to this member record.
          </p>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-11 h-11 rounded-2xl"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No accounts found.</p>
            ) : (
              filtered.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(selected === p.id ? null : p.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                    selected === p.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-muted/30 hover:bg-muted/60"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-black text-primary">
                      {(p.first_name?.[0] ?? "?")}{(p.last_name?.[0] ?? "?")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {p.last_name}, {p.first_name}
                    </p>
                    {p.approved_roles?.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-0.5">
                        {p.approved_roles.slice(0, 3).map((r: string) => (
                          <span key={r} className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {selected === p.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))
            )}
          </div>

          {error && (
            <p className="text-xs text-destructive font-bold bg-destructive/10 px-4 py-3 rounded-2xl">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11 rounded-2xl font-black uppercase tracking-widest text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleLink}
              disabled={!selected || loading}
              className="flex-1 h-11 rounded-2xl font-black uppercase tracking-widest text-xs gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
              {loading ? "Linking…" : "Link Account"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
