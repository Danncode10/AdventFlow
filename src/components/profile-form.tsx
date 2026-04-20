"use client";

import { useState, useEffect } from "react";
import { updateProfile } from "@/services/users";
import { User, Calendar, CircleUser, Loader2, CheckCircle2, ShieldCheck, ShieldAlert, ShieldX, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Reusable input class — semantic tokens only, consistent height
const inputClass =
  "w-full bg-secondary border border-border rounded-2xl py-4 pl-12 pr-5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all";

export function ProfileForm({ profile, roles = [] }: { profile: any, roles?: any[] }) {
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
  });

  // Auto-calculate age from birthday
  useEffect(() => {
    if (formData.birthday) {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age >= 0 && formData.age !== String(age)) {
        setFormData(prev => ({ ...prev, age: String(age) }));
      }
    }
  }, [formData.birthday]);

  const mutation = useMutation({
    mutationFn: (data: typeof formData) =>
      updateProfile(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["profiles-db"] });
      const previousProfiles = queryClient.getQueryData(["profiles-db"]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return { previousProfiles };
    },
    onError: (err: any, _newProfile, context) => {
      if (context?.previousProfiles) {
        queryClient.setQueryData(["profiles-db"], context.previousProfiles);
      }
      toast.error(err.message || "Failed to mutate node. Rate limit exceeded.");
    },
    onSuccess: () => {
      toast.success("Profile Node successfully updated in cluster!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles-db"] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto md:max-w-2xl">
      {/* ── Header — stacks on mobile, row on sm+ ── */}
      <div className="flex flex-col gap-3 mb-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-tight">
            Profile Settings
          </h3>
          <p className="text-sm text-muted-foreground mt-1 font-semibold italic">
            Manage your identity and personal details.
          </p>
        </div>
        <Badge
          variant={profile?.role === "admin" ? "default" : "secondary"}
          className="self-start sm:self-auto uppercase tracking-widest px-3 py-1 text-[10px] font-black shrink-0"
        >
          {profile?.role || "User"}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* First Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black uppercase tracking-widest text-muted-foreground px-1">
              First Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="John"
                className={inputClass}
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black uppercase tracking-widest text-muted-foreground px-1">
              Surname
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Doe"
                className={inputClass}
              />
            </div>
          </div>

        </div>
        
        {/* ── Ecclesiastical Credentials Section ── */}
        <div className="space-y-6 pt-10">
          <div className="space-y-1">
            <h4 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Ecclesiastical Credentials
            </h4>
            <p className="text-[10px] text-muted-foreground font-semibold italic">
              Verification status of your assigned roles within the Mission Hub.
            </p>
          </div>

          <div className="space-y-4">
            {/* Group Roles by Status */}
            {['approved', 'pending', 'rejected'].map((status) => {
              const statusRoles = roles.filter(r => r.status === status);
              if (statusRoles.length === 0 && status === 'rejected') return null; // Only show rejected if any exist

              return (
                <div key={status} className="p-5 bg-secondary/30 rounded-3xl border border-border/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 
                      ${status === 'approved' ? 'text-emerald-500' : status === 'pending' ? 'text-amber-500' : 'text-destructive'}`}>
                      {status === 'approved' && <ShieldCheck className="w-3 h-3" />}
                      {status === 'pending' && <History className="w-3 h-3" />}
                      {status === 'rejected' && <ShieldX className="w-3 h-3" />}
                      {status}
                    </span>
                    <Badge variant="outline" className="text-[8px] px-1.5 h-4 border-muted-foreground/20 opacity-50 uppercase font-mono tracking-tighter">
                      {statusRoles.length} NODE{statusRoles.length !== 1 && 'S'}
                    </Badge>
                  </div>

                  {statusRoles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {statusRoles.map((r, idx) => (
                        <div key={idx} className="bg-background/80 border border-border/60 px-4 py-2 rounded-xl flex items-center gap-2 group hover:border-primary/40 transition-colors">
                          <span className="text-xs font-black uppercase tracking-tight italic">
                            {r.role}
                          </span>
                          <span className="text-[9px] text-muted-foreground font-mono opacity-50">
                            ID: {String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] font-semibold italic text-muted-foreground opacity-50 pl-1">
                      No {status} roles found in current session.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footer / Submit ── */}
        <div className="pt-6 border-t border-border mt-4 flex flex-col gap-4">
          <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
            Syncing with Supabase public.profiles
          </p>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-sm shadow-primary/20"
          >
            {mutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : success ? (
              <><CheckCircle2 className="w-5 h-5" /> Saved</>
            ) : (
              <><CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> Save Node State</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
