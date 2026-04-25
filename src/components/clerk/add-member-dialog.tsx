"use client";

import * as React from "react";
import { UserPlus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addChurchMember } from "@/services/clerk";
import type { ChurchMember } from "@/services/clerk";

interface Props {
  children: React.ReactNode;
  onMemberAdded: (member: ChurchMember) => void;
}

export function AddMemberDialog({ children, onMemberAdded }: Props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [form, setForm] = React.useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    membership_date: "",
    baptism_date: "",
    contact_number: "",
    address: "",
    transfer_from: "",
    notes: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError("First and last name are required.");
      return;
    }
    setLoading(true);
    try {
      const member = await addChurchMember(form) as ChurchMember;
      onMemberAdded(member);
      setOpen(false);
      setForm({ first_name: "", last_name: "", middle_name: "", membership_date: "", baptism_date: "", contact_number: "", address: "", transfer_from: "", notes: "" });
    } catch (err: any) {
      setError(err.message ?? "Failed to add member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-[2rem] border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-lg font-black uppercase tracking-tight">Add Member</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">First Name *</Label>
              <Input value={form.first_name} onChange={set("first_name")} className="h-12 rounded-2xl" placeholder="Juan" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Name *</Label>
              <Input value={form.last_name} onChange={set("last_name")} className="h-12 rounded-2xl" placeholder="Dela Cruz" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Middle Name</Label>
            <Input value={form.middle_name} onChange={set("middle_name")} className="h-12 rounded-2xl" placeholder="Santos" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Membership Date</Label>
              <Input type="date" value={form.membership_date} onChange={set("membership_date")} className="h-12 rounded-2xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Baptism Date</Label>
              <Input type="date" value={form.baptism_date} onChange={set("baptism_date")} className="h-12 rounded-2xl" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Number</Label>
            <Input value={form.contact_number} onChange={set("contact_number")} className="h-12 rounded-2xl" placeholder="09XX-XXX-XXXX" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Address</Label>
            <Input value={form.address} onChange={set("address")} className="h-12 rounded-2xl" placeholder="Purok / Barangay / Municipality" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Transferred From (optional)</Label>
            <Input value={form.transfer_from} onChange={set("transfer_from")} className="h-12 rounded-2xl" placeholder="Previous church name" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Notes</Label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Any additional notes…"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive font-bold bg-destructive/10 px-4 py-3 rounded-2xl">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 shadow-lg shadow-primary/20">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? "Saving…" : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
