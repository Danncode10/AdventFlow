"use client"

import * as React from "react"
import {
  Sparkles,
  User,
  Shield,
  BookOpen,
  Activity,
  Lock,
  Settings,
  ShieldCheck,
  Church as ChurchIcon,
  Users2,
  Wallet,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  MapPin,
  GitBranch,
  ShieldAlert
} from "lucide-react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProfileForm } from "./profile-form"
import { SecurityForm } from "./security-form"
import { PillTabs } from "@/components/ui/pill-tabs"
import { motion } from "framer-motion"

interface DashboardShellProps {
  overview: {
    areas: number;
    divisions: number;
    churches: number;
    members: number;
  }
  user: any
  profile: any
  roles: any[]
  repos: any[]
}

export function DashboardShell({ overview, user, profile, roles }: DashboardShellProps) {
  const [activeTab, setActiveTab] = React.useState("hub")

  const DASHBOARD_TABS = [
    { id: "hub", label: "Hub", icon: LayoutDashboard },
    { id: "personnel", label: "Personnel", icon: Users2 },
    { id: "sanctuary", label: "Sanctuary", icon: BookOpen },
    { id: "treasury", label: "Treasury", icon: Wallet },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "settings", label: "Profile", icon: Settings },
  ]

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Premium Tab Navigation */}
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <PillTabs items={DASHBOARD_TABS} active={activeTab} onChange={setActiveTab} className="mb-0" />
          
          <div className="flex items-center gap-3 self-center md:self-auto">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 gap-1.5 px-4 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Sanctuary: Online
            </Badge>
          </div>
        </div>
      </div>

      {/* 1. Hub (Overview) */}
      <TabsContent value="hub" className="space-y-10 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personnel Status Card */}
          <Card className="bg-card border border-border/60 shadow-xl rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all p-1">
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <Badge className="bg-primary/5 text-primary border-primary/10 font-black uppercase text-[9px] px-3">Personnel Profile</Badge>
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight italic">
                  {profile ? `${profile.first_name} ${profile.last_name}` : 'Personnel'}
                </h3>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60">
                  {profile?.approved_roles?.[0] || 'Member'}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                View Credentials <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Card>

          {/* Local Church Placement */}
          <Card className="bg-card border border-border/60 shadow-xl rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all p-1">
            <div className="p-8 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <ChurchIcon className="w-6 h-6" />
                </div>
                <Badge className="bg-primary/5 text-primary border-primary/10 font-black uppercase text-[9px] px-3">Ecclesiastical Placement</Badge>
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight italic">
                  {profile?.entity_name || 'Unassigned Structure'}
                </h3>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60">Ecclesiastical Location</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                Church Directory <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Card>

          {/* Sanctuary Status */}
          <Card className="bg-card border border-border/60 shadow-xl rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all p-1">
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-primary/50 rounded-2xl flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <Badge className="bg-primary/5 text-primary border-primary/10 font-black uppercase text-[9px] px-3">System Integrity</Badge>
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight italic">Active Pulse</h3>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60">Session Fully Authenticated</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                Security Audit <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Card>
        </div>

        {/* Action Banner / Status Alert */}
        {profile?.approved_roles?.length > 0 ? (
          <Card className="bg-primary text-primary-foreground border-none shadow-2xl rounded-[3rem] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none" />
            <CardContent className="p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> Digital Remittance Update
                </div>
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-tight">
                  Authorize Your Local Mission Financials
                </h3>
                <p className="text-primary-foreground/70 text-lg font-medium tracking-tight">
                  The new Tithe & Offering reporting portal is now live for all Church Treasurers. Submit weekly returns directly to the Mission Hub.
                </p>
                <div className="pt-4">
                  <button className="px-8 py-4 bg-primary-foreground text-primary font-black rounded-2xl uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all">
                    Access Treasury
                  </button>
                </div>
              </div>
              <div className="hidden md:flex w-48 h-48 bg-white/5 rounded-full border border-white/10 items-center justify-center backdrop-blur-3xl shrink-0">
                <Wallet className="w-20 h-20 opacity-40 text-primary-foreground" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-amber-500 text-amber-950 border-none shadow-2xl rounded-[3rem] overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10 pointer-events-none" />
            <CardContent className="p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <ShieldAlert className="w-3 h-3" /> Verification Pending
                </div>
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-tight">
                  Ecclesiastical Access is restricted
                </h3>
                <p className="text-amber-950/70 text-lg font-medium tracking-tight">
                  Your request to join <strong>{profile?.entity_name}</strong> as a <strong>{profile?.pending_roles?.[0] || 'Personnel'}</strong> is currently under review by the Mission Administration.
                </p>
                <div className="pt-4">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">Status: Waiting for Elder/Pastor Approval</p>
                </div>
              </div>
              <div className="hidden md:flex w-48 h-48 bg-black/5 rounded-full border border-black/10 items-center justify-center backdrop-blur-3xl shrink-0">
                <Clock className="w-20 h-20 opacity-40" />
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* 2. Mission Statistics */}
      <TabsContent value="personnel" className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Mission Statistics</h2>
          <p className="text-muted-foreground font-semibold italic">Organizational growth and ecclesiastical scale</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Mission Personnel", value: overview.members, icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Strategic Areas", value: overview.areas, icon: MapPin, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Divisions & Districts", value: overview.divisions, icon: GitBranch, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Local Churches", value: overview.churches, icon: ChurchIcon, color: "text-primary", bg: "bg-primary/10" },
          ].map((stat, i) => (
            <Card key={i} className="bg-card border border-border/50 rounded-[2rem] overflow-hidden group hover:border-primary/20 transition-all">
              <CardContent className="p-8 space-y-6">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                  <h4 className="text-4xl font-black tracking-tight text-foreground">{stat.value}</h4>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-secondary/30 border border-border/40 p-10 rounded-[3rem]">
          <h3 className="text-xl font-black uppercase italic mb-4">Hierarchical integrity</h3>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed italic italic">
            The counts above represent live nodes within the Adventist Sanctuary Hub. 
            Every Church belongs to a verified District, ensuring ecclesiastical transparency and reporting accuracy.
          </p>
        </Card>
      </TabsContent>

      {/* 3. Sanctuary (Resources) */}
      <TabsContent value="sanctuary" className="space-y-10 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">The Sanctuary</h2>
          <p className="text-muted-foreground font-semibold italic">Core resources and the 28 Fundamental Beliefs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((i) => (
            <Card key={i} className="bg-card border border-border/60 hover:bg-muted/30 transition-all cursor-pointer rounded-[2.5rem] p-4 flex flex-col gap-6 group">
              <div className="aspect-[4/3] bg-muted/40 rounded-[2rem] flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
              </div>
              <div className="px-2 pb-2 space-y-2">
                <h4 className="text-lg font-black uppercase tracking-tight leading-none italic group-hover:text-primary transition-colors">Belief #{i}: The Holy Scriptures</h4>
                <p className="text-muted-foreground text-xs font-medium leading-relaxed italic opacity-70">"The Holy Scriptures are the infallible revelation of His will."</p>
                <div className="pt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary">
                  Study Guide <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* 4. Treasury (Placeholder) */}
      <TabsContent value="treasury" className="animate-in slide-in-from-bottom-2 duration-500">
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-muted/20 border border-dashed border-border rounded-[3rem] gap-6">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
            <Lock className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter">Treasury Restricted</h3>
            <p className="text-muted-foreground font-semibold italic max-w-md">Financial remittance modules require explicit authorization from the Mission Treasurer or Conference Office.</p>
          </div>
          <button className="px-6 py-3 bg-primary text-primary-foreground font-black rounded-xl uppercase text-xs tracking-widest shadow-lg">Request Access</button>
        </div>
      </TabsContent>

      {/* 5. Security & Settings */}
      <TabsContent value="security" className="animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-center w-full py-6 md:py-12">
          <Card className="bg-card text-card-foreground border border-border/60 p-10 md:p-16 max-w-3xl w-full shadow-2xl rounded-[3rem] relative overflow-hidden backdrop-blur-xl">
             <SecurityForm />
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="settings" className="animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex justify-center w-full py-6 md:py-12">
          <Card className="bg-card text-card-foreground border border-border/60 p-10 md:p-16 max-w-3xl w-full shadow-2xl rounded-[3rem] relative overflow-hidden backdrop-blur-xl">
            <ProfileForm profile={profile} />
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}

