"use client";

import * as React from "react";
import { Search, UserPlus, Link2, MoreVertical, Pencil, Trash2, ArrowRightLeft, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddMemberDialog } from "./add-member-dialog";
import { LinkAccountDialog } from "./link-account-dialog";
import { UpdateStatusDialog } from "./update-status-dialog";
import { deleteChurchMember } from "@/services/clerk";
import type { ChurchMember } from "@/services/clerk";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active:          { label: "Active",          color: "text-emerald-500", bg: "bg-emerald-500/10" },
  inactive:        { label: "Inactive",        color: "text-amber-500",   bg: "bg-amber-500/10" },
  transferred_out: { label: "Transferred Out", color: "text-blue-500",    bg: "bg-blue-500/10" },
  deceased:        { label: "Deceased",        color: "text-muted-foreground", bg: "bg-muted" },
  missing:         { label: "Missing",         color: "text-red-500",     bg: "bg-red-500/10" },
};

const STATUS_FILTERS = ["all", "active", "inactive", "transferred_out", "deceased", "missing"];

interface Props {
  members: ChurchMember[];
  churchProfiles: any[];
  onMembersChange: (members: ChurchMember[]) => void;
}

export function MemberRegistry({ members, churchProfiles, onMembersChange }: Props) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [linkTarget, setLinkTarget] = React.useState<ChurchMember | null>(null);
  const [statusTarget, setStatusTarget] = React.useState<ChurchMember | null>(null);

  const filtered = members.filter(m => {
    const name = `${m.first_name} ${m.last_name} ${m.middle_name ?? ""}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || m.membership_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this member record? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteChurchMember(id);
      onMembersChange(members.filter(m => m.id !== id));
    } catch (e) {
      alert("Failed to delete member.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleMemberAdded = (newMember: ChurchMember) => {
    onMembersChange([...members, newMember]);
  };

  const handleStatusUpdated = (updated: ChurchMember) => {
    onMembersChange(members.map(m => m.id === updated.id ? updated : m));
    setStatusTarget(null);
  };

  const handleLinked = (memberId: string, profileId: string) => {
    onMembersChange(members.map(m => m.id === memberId ? { ...m, linked_profile_id: profileId } : m));
    setLinkTarget(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-11 h-12 rounded-2xl border-border bg-card font-medium"
            />
          </div>
          <AddMemberDialog onMemberAdded={handleMemberAdded}>
            <Button className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 shadow-lg shadow-primary/20">
              <UserPlus className="w-4 h-4" /> Add Member
            </Button>
          </AddMemberDialog>
        </div>

        {/* Status filter pills */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s]?.label ?? s}
              {s !== "all" && (
                <span className="ml-1.5 opacity-70">
                  {members.filter(m => m.membership_status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Member list */}
        <Card className="bg-card border border-border/60 rounded-[2rem] overflow-hidden">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground">
              {filtered.length} {filtered.length === 1 ? "Member" : "Members"}
              {search && <span className="font-medium text-muted-foreground"> matching "{search}"</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {filtered.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-bold text-foreground">No members found</p>
                <p className="text-sm text-muted-foreground">
                  {search ? "Try a different search term." : "Add your first member to get started."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(m => {
                  const cfg = STATUS_CONFIG[m.membership_status];
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 hover:bg-muted/60 transition-colors group"
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-primary">
                          {m.first_name[0]}{m.last_name[0]}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-foreground">
                            {m.last_name}, {m.first_name}{m.middle_name ? ` ${m.middle_name[0]}.` : ""}
                          </p>
                          {m.linked_profile_id && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                              <Link2 className="w-2.5 h-2.5" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Linked</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          {m.membership_date && (
                            <span className="text-[10px] text-muted-foreground">
                              Since {new Date(m.membership_date).toLocaleDateString("en-PH", { month: "short", year: "numeric" })}
                            </span>
                          )}
                          {m.contact_number && (
                            <span className="text-[10px] text-muted-foreground">{m.contact_number}</span>
                          )}
                        </div>
                      </div>

                      {/* Status badge */}
                      <Badge className={`hidden sm:flex text-[9px] font-black uppercase tracking-widest rounded-full px-2.5 py-0.5 border-0 shrink-0 ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </Badge>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-muted">
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-2xl border-border">
                          <DropdownMenuItem
                            onClick={() => setStatusTarget(m)}
                            className="gap-2 font-medium rounded-xl cursor-pointer"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" /> Update Status
                          </DropdownMenuItem>
                          {!m.linked_profile_id && (
                            <DropdownMenuItem
                              onClick={() => setLinkTarget(m)}
                              className="gap-2 font-medium rounded-xl cursor-pointer"
                            >
                              <Link2 className="w-3.5 h-3.5" /> Link Account
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deletingId !== m.id && handleDelete(m.id)}
                            className="gap-2 font-medium rounded-xl text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> {deletingId === m.id ? "Deleting…" : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      {linkTarget && (
        <LinkAccountDialog
          member={linkTarget}
          churchProfiles={churchProfiles}
          onLinked={handleLinked}
          onClose={() => setLinkTarget(null)}
        />
      )}
      {statusTarget && (
        <UpdateStatusDialog
          member={statusTarget}
          onUpdated={handleStatusUpdated}
          onClose={() => setStatusTarget(null)}
        />
      )}
    </>
  );
}
