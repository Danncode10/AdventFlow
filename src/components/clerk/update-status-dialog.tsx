"use client";

import * as React from "react";
import { ArrowRightLeft, Loader2, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMemberStatus } from "@/services/clerk";
import type { ChurchMember, MemberStatus } from "@/services/clerk";

const STATUS_OPTIONS: { value: MemberStatus; label: string; desc: string; color: string; bg: string }[] = [
  { value: "active",          label: "Active",          desc: "Current member in good standing.",       color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { value: "inactive",        label: "Inactive",        desc: "Member not currently participating.",    color: "text-amber-500",   bg: "bg-amber-500/10" },
  { value: "transferred_out", label: "Transferred Out", desc: "Member moved to another congregation.",  color: "text-blue-500",    bg: "bg-blue-500/10" },
  { value: "deceased",        label: "Deceased",        desc: "Member has passed away.",                color: "text-muted-foreground", bg: "bg-muted" },
  { value: "missing",         label: "Missing",         desc: "Member whereabouts unknown.",            color: "text-red-500",     bg: "bg-red-500/10" },
];

interface Props {
  member: ChurchMember;
  onUpdated: (member: ChurchMember) => void;
  onClose: () => void;
}

export function UpdateStatusDialog({ member, onUpdated, onClose }: Props) {
  const [selected, setSelected] = React.useState<MemberStatus>(member.membership_status);
  const [transferTo, setTransferTo] = React.useState(member.transfer_to ?? "");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const extra = selected === "transferred_out" ? { transfer_to: transferTo.trim() || undefined } : undefined;
      await updateMemberStatus(member.id, selected, extra);
      onUpdated({ ...member, membership_status: selected, transfer_to: extra?.transfer_to ?? member.transfer_to });
    } catch (e: any) {
      setError(e.message ?? "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-[2rem] border-border max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black uppercase tracking-tight">Update Status</DialogTitle>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {member.first_name} {member.last_name}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                  selected === opt.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-muted/30 hover:bg-muted/60"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl ${opt.bg} flex items-center justify-center shrink-0`}>
                  <div className={`w-2 h-2 rounded-full ${opt.color.replace("text-", "bg-")}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                </div>
                {selected === opt.value && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {selected === "transferred_out" && (
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Destination Church
              </Label>
              <Input
                value={transferTo}
                onChange={e => setTransferTo(e.target.value)}
                className="h-11 rounded-2xl"
                placeholder="Name of receiving church"
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-destructive font-bold bg-destructive/10 px-4 py-3 rounded-2xl">{error}</p>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11 rounded-2xl font-black uppercase tracking-widest text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || selected === member.membership_status}
              className="flex-1 h-11 rounded-2xl font-black uppercase tracking-widest text-xs gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {loading ? "Saving…" : "Save Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
