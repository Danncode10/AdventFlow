"use client";

import { useState, useEffect } from "react";
import { updateProfile, getAvailableRoles, requestRole } from "@/services/users";
import { User, Calendar, CircleUser, Loader2, CheckCircle2, ShieldCheck, ShieldAlert, ShieldX, History, MapPin, Church, Compass, Layout, PlusCircle, Check, Info, Music, Video, PenTool, Calculator, Scale, Users, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Reusable input class — semantic tokens only, consistent height
const inputClass =
  "w-full bg-secondary border border-border rounded-2xl py-4 pl-12 pr-5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all";

// Role Icon Mapping
const roleIcons: Record<string, any> = {
  'Member': User,
  'Elder': Scale,
  'Pastor': Scale,
  'Deacon': Users,
  'Deaconess': Users,
  'Head Deacon': Users,
  'Head Deaconess': Users,
  'Church Clerk': PenTool,
  'Clerk': PenTool,
  'Treasurer': Calculator,
  'Church Treasurer': Calculator,
  'Mission Treasurer': Banknote,
  'Area Treasurer': Banknote,
  'Division Treasurer': Banknote,
  'Scheduler': Calendar,
  'Media Team': Video,
  'Music Director': Music,
  'Church Youth Leader': Users,
  'Youth Leader': Users,
  'Mission Youth Leader': Users,
  'Area Youth Leader': Users,
  'Division Youth Leader': Users,
  'Mission Admin': ShieldCheck,
  'Area Admin': ShieldCheck,
  'Division Admin': ShieldCheck,
  'Church Admin': ShieldCheck,
  'Area Coordinator': Compass,
};

// Simplified Tooltip component for better UX
function RoleTooltip({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.95 }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-card border border-border rounded-xl shadow-xl z-50 pointer-events-none"
    >
      <div className="text-[10px] text-foreground font-semibold italic text-center leading-tight">
        {text}
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-card" />
    </motion.div>
  );
}

function RoleChip({ 
  role, 
  profile, 
  requestingRole, 
  setRequestingRole, 
  requestRole, 
  queryClient 
}: { 
  role: any, 
  profile: any, 
  requestingRole: string | null, 
  setRequestingRole: (val: string | null) => void,
  requestRole: (name: string) => Promise<any>,
  queryClient: any
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isApproved = profile?.approved_roles?.includes(role.name);
  const isPending = profile?.pending_roles?.includes(role.name);
  const isRequestedInSession = requestingRole === role.name;
  const isDisabled = isApproved || isPending;
  
  const Icon = roleIcons[role.name] || Info;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={isDisabled || isRequestedInSession}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={async () => {
          setRequestingRole(role.name);
          try {
            await requestRole(role.name);
            toast.success("Request Manifested", { description: `${role.name} is now pending verification.` });
            queryClient.invalidateQueries({ queryKey: ["profiles-db"] });
          } catch (err: any) {
            toast.error(err.message);
          } finally {
            setRequestingRole(null);
          }
        }}
        className={`
          group flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all duration-300
          ${isDisabled 
            ? 'bg-primary/10 border-primary/20 text-primary opacity-60 cursor-not-allowed' 
            : 'bg-background border-border text-foreground hover:border-primary/60 hover:shadow-md active:scale-95'
          }
          ${isRequestedInSession ? 'animate-pulse' : ''}
        `}
      >
        <Icon className={`w-3.5 h-3.5 ${isDisabled ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'}`} />
        <span className="text-[11px] font-bold tracking-tight uppercase italic whitespace-nowrap">
          {role.name}
        </span>
        {isApproved && <Check className="w-3 h-3 text-emerald-500 ml-1" />}
        {isPending && <History className="w-3 h-3 text-amber-500 ml-1" />}
        {isRequestedInSession && <Loader2 className="w-3 h-3 animate-spin text-primary ml-1" />}
      </button>

      <AnimatePresence>
        {isHovered && role.description && (
          <RoleTooltip text={role.description} />
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProfileForm({ profile }: { profile: any }) {
  const [success, setSuccess] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [requestingRole, setRequestingRole] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    getAvailableRoles().then(setAvailableRoles).catch(console.error);
  }, []);

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 mb-12 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-8">
        <div>
          <h3 className="text-4xl font-black text-foreground tracking-tighter uppercase italic leading-tight">
            Profile Settings
          </h3>
          <p className="text-sm text-muted-foreground mt-2 font-semibold italic">
            Manage your digital identity and ecclesiastical standing within the AdventFlow network.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest hidden md:block">
            Status: Synchronized with Supabase
          </p>
          <Badge
            variant={profile?.role === "admin" ? "default" : "secondary"}
            className="uppercase tracking-widest px-4 py-1.5 text-[11px] font-black shrink-0 rounded-full"
          >
            {profile?.role || "User Account"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* ── LEFT COLUMN: Personal & Org Placement ── */}
        <div className="lg:col-span-5 space-y-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/80 flex items-center gap-2">
                <CircleUser className="w-4 h-4" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
            >
              {mutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : success ? (
                <><CheckCircle2 className="w-5 h-5" /> Saved Successfully</>
              ) : (
                <><CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> Update Node State</>
              )}
            </button>
          </form>

          {/* Organizational Placement */}
          <div className="space-y-6 pt-10 border-t border-border/40">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/80 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Organizational Placement
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Mission', val: profile?.hierarchy?.mission, icon: Compass },
                { label: 'Area', val: profile?.hierarchy?.area, icon: MapPin },
                { label: 'Division', val: profile?.hierarchy?.division, icon: Layout },
                { label: 'Church', val: profile?.hierarchy?.church, icon: Church },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-secondary/10 border border-border/40 rounded-[2rem] space-y-2 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-2 text-primary">
                    <item.icon className="w-4 h-4 opacity-60" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{item.label}</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-tight line-clamp-1 italic">{item.val || '---'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Roles & Recruitment ── */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Status Section */}
          <div className="space-y-6 bg-secondary/5 p-8 rounded-[3rem] border border-border/20">
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Ecclesiastical Credentials
              </h4>
              <p className="text-[10px] text-muted-foreground font-semibold italic">
                Active and pending verification tokens for your roles.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'approved', label: 'approved', data: profile?.approved_roles || [] },
                { id: 'pending', label: 'pending', data: profile?.pending_roles || [] }
              ].map((statusGroup) => {
                const { id, label, data } = statusGroup;
                return (
                  <div key={id} className="p-6 bg-background/40 rounded-[2.5rem] border border-border/40">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 
                        ${id === 'approved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {id === 'approved' ? <ShieldCheck className="w-4 h-4" /> : <History className="w-4 h-4" />}
                        {label} Nodes
                      </span>
                      <Badge variant="outline" className="text-[10px] px-3 h-6 border-muted-foreground/20 uppercase font-black">
                        {data.length}
                      </Badge>
                    </div>
                    {data.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {data.map((roleName: string, idx: number) => (
                          <div key={idx} className="bg-background border border-border/60 px-5 py-2.5 rounded-2xl flex items-center gap-3">
                            <span className="text-xs font-black uppercase tracking-tight italic">{roleName}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-semibold italic text-muted-foreground/50">No {label} roles detected.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role Recruitment */}
          <div className="space-y-10">
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-primary" />
                Request New Roles
              </h4>
              <p className="text-[10px] text-muted-foreground font-semibold italic">
                Expand your capacity to serve within the organizational structure.
              </p>
            </div>

            <div className="space-y-12">
              {[
                { 
                  title: 'Local Church', 
                  roles: ['Member', 'Elder', 'Deacon', 'Head Deacon', 'Head Deaconess', 'Church Clerk', 'Clerk', 'Church Treasurer', 'Treasurer', 'Scheduler', 'Media Team', 'Music Director', 'Church Youth Leader', 'Youth Leader', 'Church Admin'] 
                },
                { 
                  title: 'Division Level', 
                  roles: ['Division Admin', 'Division Treasurer', 'Division Youth Leader'] 
                },
                { 
                  title: 'Area & Mission', 
                  roles: ['Area Coordinator', 'Pastor', 'Mission Admin', 'Mission Treasurer', 'Mission Youth Leader', 'Area Admin', 'Area Treasurer', 'Area Youth Leader'] 
                }
              ].map((tier) => {
                const filteredRoles = availableRoles.filter(r => tier.roles.includes(r.name));
                if (filteredRoles.length === 0) return null;

                const hasPendingInTier = filteredRoles.some(r => profile?.pending_roles?.includes(r.name));

                return (
                  <div key={tier.title} className="space-y-4">
                    <h5 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">
                      {tier.title}
                    </h5>
                    
                    <div className="flex flex-wrap gap-3">
                      {filteredRoles.map((role) => (
                        <RoleChip 
                          key={role.id}
                          role={role}
                          profile={profile}
                          requestingRole={requestingRole}
                          setRequestingRole={setRequestingRole}
                          requestRole={requestRole}
                          queryClient={queryClient}
                        />
                      ))}
                    </div>

                    {hasPendingInTier && (
                      <div className="flex items-center gap-2 px-1 mt-2">
                        <History className="w-3 h-3 text-amber-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-500/80 italic">
                          ⏳ Pending Verification in Node Cluster
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
