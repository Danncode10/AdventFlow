"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  ChevronRight,
  Church,
  Menu,
  X,
  BarChart3,
  UserCheck,
  UserX,
  PlaneTakeoff,
  HeartCrack,
  HelpCircle,
  TrendingUp,
  Link2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { MemberRegistry } from "./member-registry";
import { AddMemberDialog } from "./add-member-dialog";
import type { ChurchMember } from "@/services/clerk";

const NAV_ITEMS = [
  { id: "overview",  label: "Overview",        icon: LayoutDashboard },
  { id: "members",   label: "Member Registry", icon: Users },
  { id: "transfers", label: "Transfers",        icon: ArrowLeftRight },
  { id: "reports",   label: "Reports",          icon: FileText },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  active:         { label: "Active",          color: "text-emerald-500", bg: "bg-emerald-500/10", icon: UserCheck },
  inactive:       { label: "Inactive",        color: "text-amber-500",   bg: "bg-amber-500/10",   icon: UserX },
  transferred_out:{ label: "Transferred Out", color: "text-blue-500",    bg: "bg-blue-500/10",    icon: PlaneTakeoff },
  deceased:       { label: "Deceased",        color: "text-muted-foreground", bg: "bg-muted",     icon: HeartCrack },
  missing:        { label: "Missing",         color: "text-red-500",     bg: "bg-red-500/10",     icon: HelpCircle },
};

interface Props {
  user: any;
  profile: any;
  members: ChurchMember[];
  stats: {
    total: number;
    active: number;
    inactive: number;
    transferred_out: number;
    deceased: number;
    missing: number;
    linked: number;
  };
  churchProfiles: any[];
  churchName: string;
}

export function ClerkDashboardShell({ user, profile, members, stats, churchProfiles, churchName }: Props) {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [localMembers, setLocalMembers] = React.useState<ChurchMember[]>(members);
  const [localStats, setLocalStats] = React.useState(stats);

  const refreshStats = (updated: ChurchMember[]) => {
    setLocalMembers(updated);
    setLocalStats({
      total: updated.length,
      active: updated.filter(m => m.membership_status === "active").length,
      inactive: updated.filter(m => m.membership_status === "inactive").length,
      transferred_out: updated.filter(m => m.membership_status === "transferred_out").length,
      deceased: updated.filter(m => m.membership_status === "deceased").length,
      missing: updated.filter(m => m.membership_status === "missing").length,
      linked: updated.filter(m => m.linked_profile_id !== null).length,
    });
  };

  const SidebarContent = () => (
    <nav className="flex flex-col h-full">
      {/* Branding */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Church className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clerk Office</p>
            <p className="text-sm font-black text-foreground truncate">{churchName}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </button>
          );
        })}
      </div>

      {/* Back to main dashboard */}
      <div className="p-4 border-t border-border">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full rounded-2xl font-bold text-xs uppercase tracking-widest gap-2">
            <LayoutDashboard className="w-4 h-4" /> Main Dashboard
          </Button>
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-card sticky top-16 h-[calc(100vh-64px)]">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Clerk Office</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        {/* Mobile header */}
        <div className="flex items-center gap-4 mb-8 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-3 rounded-2xl bg-card border border-border shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clerk Office</p>
            <p className="text-lg font-black text-foreground">{churchName}</p>
          </div>
        </div>

        {/* Desktop page header */}
        <div className="hidden lg:block mb-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Clerk Dashboard</p>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground leading-none">
            {NAV_ITEMS.find(n => n.id === activeTab)?.label}
          </h1>
          <p className="mt-2 text-muted-foreground font-medium text-sm">
            {churchName} · {profile?.first_name} {profile?.last_name}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" && (
              <OverviewTab stats={localStats} members={localMembers} setActiveTab={setActiveTab} />
            )}
            {activeTab === "members" && (
              <MemberRegistry
                members={localMembers}
                churchProfiles={churchProfiles}
                onMembersChange={refreshStats}
              />
            )}
            {activeTab === "transfers" && (
              <TransfersTab members={localMembers} onMembersChange={refreshStats} />
            )}
            {activeTab === "reports" && (
              <ReportsTab stats={localStats} members={localMembers} churchName={churchName} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ─── Overview Tab ──────────────────────────────────────────────── */
function OverviewTab({ stats, members, setActiveTab }: { stats: Props["stats"]; members: ChurchMember[]; setActiveTab: (t: string) => void }) {
  const statCards = [
    { label: "Total Members",    value: stats.total,          icon: Users,       color: "text-primary",      bg: "bg-primary/10" },
    { label: "Active",           value: stats.active,         icon: UserCheck,   color: "text-emerald-500",  bg: "bg-emerald-500/10" },
    { label: "Linked Accounts",  value: stats.linked,         icon: Link2,       color: "text-blue-500",     bg: "bg-blue-500/10" },
    { label: "Transferred Out",  value: stats.transferred_out,icon: PlaneTakeoff,color: "text-amber-500",    bg: "bg-amber-500/10" },
  ];

  const recentMembers = [...members]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Card key={i} className="bg-card border border-border/60 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-black tracking-tight text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status breakdown */}
      <Card className="bg-card border border-border/60 rounded-[2rem]">
        <CardHeader className="p-6 pb-0">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Membership Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const count = stats[key as keyof typeof stats] as number;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center ${cfg.color} shrink-0`}>
                    <cfg.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">{cfg.label}</span>
                      <span className="text-xs font-black text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${cfg.bg.replace("/10", "/60")}`}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground w-10 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent additions */}
      <Card className="bg-card border border-border/60 rounded-[2rem]">
        <CardHeader className="p-6 pb-0 flex-row items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Recently Added
          </CardTitle>
          <button onClick={() => setActiveTab("members")} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
            View all
          </button>
        </CardHeader>
        <CardContent className="p-6">
          {recentMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No members added yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMembers.map((m) => {
                const cfg = STATUS_CONFIG[m.membership_status];
                return (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 hover:bg-muted transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-black text-primary">
                        {m.first_name[0]}{m.last_name[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {m.last_name}, {m.first_name} {m.middle_name ? m.middle_name[0] + "." : ""}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Added {new Date(m.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <Badge className={`text-[9px] font-black uppercase tracking-widest rounded-full px-2.5 py-0.5 border-0 ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </Badge>
                    {m.linked_profile_id && (
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Link2 className="w-3 h-3 text-blue-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Transfers Tab ─────────────────────────────────────────────── */
function TransfersTab({ members, onMembersChange }: { members: ChurchMember[]; onMembersChange: (m: ChurchMember[]) => void }) {
  const transfers = members.filter(m => m.membership_status === "transferred_out");
  const incoming = members.filter(m => m.transfer_from);

  return (
    <div className="space-y-6">
      {/* Transfer Out */}
      <Card className="bg-card border border-border/60 rounded-[2rem]">
        <CardHeader className="p-6 pb-0">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <PlaneTakeoff className="w-4 h-4 text-blue-500" /> Transferred Out
            <Badge className="ml-1 text-[9px] font-black bg-blue-500/10 text-blue-500 border-0 rounded-full">{transfers.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {transfers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No transfer records.</p>
          ) : (
            <div className="space-y-3">
              {transfers.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-black text-blue-500">{m.first_name[0]}{m.last_name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{m.last_name}, {m.first_name}</p>
                    {m.transfer_to && (
                      <p className="text-[10px] text-muted-foreground">To: {m.transfer_to}</p>
                    )}
                  </div>
                  {m.membership_date && (
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {new Date(m.membership_date).toLocaleDateString("en-PH", { month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transfer In (members who have transfer_from) */}
      <Card className="bg-card border border-border/60 rounded-[2rem]">
        <CardHeader className="p-6 pb-0">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-500" /> Transferred In
            <Badge className="ml-1 text-[9px] font-black bg-emerald-500/10 text-emerald-500 border-0 rounded-full">{incoming.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {incoming.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No incoming transfer records.</p>
          ) : (
            <div className="space-y-3">
              {incoming.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-black text-emerald-500">{m.first_name[0]}{m.last_name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{m.last_name}, {m.first_name}</p>
                    <p className="text-[10px] text-muted-foreground">From: {m.transfer_from}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Reports Tab ───────────────────────────────────────────────── */
function ReportsTab({ stats, members, churchName }: { stats: Props["stats"]; members: ChurchMember[]; churchName: string }) {
  const handlePrint = () => window.print();

  const statusRows = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    status: cfg.label,
    count: stats[key as keyof typeof stats] as number,
    pct: stats.total > 0 ? Math.round(((stats[key as keyof typeof stats] as number) / stats.total) * 100) : 0,
  }));

  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border/60 rounded-[2rem]">
        <CardHeader className="p-6 pb-0 flex-row items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Membership Report
          </CardTitle>
          <Button onClick={handlePrint} variant="outline" size="sm" className="rounded-xl font-bold text-xs uppercase tracking-widest gap-2">
            Print / Export
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="p-4 bg-muted/50 rounded-2xl text-sm space-y-1">
            <p className="font-black text-foreground">{churchName}</p>
            <p className="text-muted-foreground text-xs">Report generated: {new Date().toLocaleDateString("en-PH", { dateStyle: "full" })}</p>
            <p className="text-muted-foreground text-xs">Total members on record: <strong className="text-foreground">{stats.total}</strong></p>
          </div>

          {/* Summary table */}
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Count</th>
                  <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">%</th>
                </tr>
              </thead>
              <tbody>
                {statusRows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="p-4 font-medium text-foreground">{row.status}</td>
                    <td className="p-4 text-right font-black text-foreground">{row.count}</td>
                    <td className="p-4 text-right text-muted-foreground">{row.pct}%</td>
                  </tr>
                ))}
                <tr className="bg-primary/5 font-black">
                  <td className="p-4 font-black text-foreground text-xs uppercase tracking-widest">Total</td>
                  <td className="p-4 text-right font-black text-primary">{stats.total}</td>
                  <td className="p-4 text-right text-muted-foreground">100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Full member list */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Full Member List</p>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="p-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">#</th>
                    <th className="p-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Name</th>
                    <th className="p-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">Membership Date</th>
                    <th className="p-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...members]
                    .sort((a, b) => `${a.last_name}${a.first_name}`.localeCompare(`${b.last_name}${b.first_name}`))
                    .map((m, i) => {
                      const cfg = STATUS_CONFIG[m.membership_status];
                      return (
                        <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                          <td className="p-3 text-muted-foreground text-xs">{i + 1}</td>
                          <td className="p-3 font-medium text-foreground">{m.last_name}, {m.first_name}{m.middle_name ? ` ${m.middle_name[0]}.` : ""}</td>
                          <td className="p-3 text-muted-foreground hidden md:table-cell">
                            {m.membership_date ? new Date(m.membership_date).toLocaleDateString("en-PH", { dateStyle: "medium" }) : "—"}
                          </td>
                          <td className="p-3">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                              {cfg.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
