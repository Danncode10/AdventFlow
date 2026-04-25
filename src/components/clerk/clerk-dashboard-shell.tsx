"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
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
import type { ChurchMember } from "@/services/clerk";

const NAV_ITEMS = [
  { id: "overview",  label: "Overview",        icon: LayoutDashboard },
  { id: "members",   label: "Member Registry", icon: Users },
  { id: "transfers", label: "Transfers",        icon: ArrowLeftRight },
  { id: "reports",   label: "Reports",          icon: FileText },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  active:          { label: "Active",          color: "text-primary",            bg: "bg-primary/10",   icon: UserCheck },
  inactive:        { label: "Inactive",        color: "text-muted-foreground",   bg: "bg-muted",        icon: UserX },
  transferred_out: { label: "Transferred Out", color: "text-foreground",         bg: "bg-secondary",    icon: PlaneTakeoff },
  deceased:        { label: "Deceased",        color: "text-muted-foreground",   bg: "bg-muted",        icon: HeartCrack },
  missing:         { label: "Missing",         color: "text-destructive",        bg: "bg-destructive/10", icon: HelpCircle },
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

  const activeNavItem = NAV_ITEMS.find(n => n.id === activeTab);

  const sidebarNav = (
    <nav className="flex flex-col h-full">
      {/* Church identity */}
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

      {/* Nav items */}
      <div className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 min-h-[48px] rounded-2xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
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

      {/* Back link */}
      <div className="p-4 border-t border-border">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full min-h-[48px] rounded-2xl font-bold text-xs uppercase tracking-widest gap-2">
            <LayoutDashboard className="w-4 h-4" /> Main Dashboard
          </Button>
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Desktop / Tablet Sidebar — visible from md (768px) up */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border bg-card sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
        {sidebarNav}
      </aside>

      {/* Mobile sidebar overlay — phone only (below md) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Clerk Office</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {sidebarNav}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto min-w-0">
        {/* Phone-only top bar with hamburger */}
        <div className="flex items-center gap-4 mb-8 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-card border border-border shadow-sm hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clerk Office</p>
            <p className="text-lg font-black text-foreground truncate">{churchName}</p>
          </div>
        </div>

        {/* Desktop / Tablet page header */}
        <div className="hidden md:block mb-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
            Clerk Dashboard · {churchName}
          </p>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground leading-none">
            {activeNavItem?.label}
          </h1>
          <p className="mt-2 text-muted-foreground font-medium text-sm">
            {profile?.first_name} {profile?.last_name}
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
              <OverviewTab stats={localStats} members={localMembers} setActiveTab={setActiveTab} churchName={churchName} />
            )}
            {activeTab === "members" && (
              <MemberRegistry
                members={localMembers}
                churchProfiles={churchProfiles}
                onMembersChange={refreshStats}
              />
            )}
            {activeTab === "transfers" && (
              <TransfersTab members={localMembers} />
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
function OverviewTab({
  stats,
  members,
  setActiveTab,
  churchName,
}: {
  stats: Props["stats"];
  members: ChurchMember[];
  setActiveTab: (t: string) => void;
  churchName: string;
}) {
  const statCards = [
    { label: "Total Members",   value: stats.total,           icon: Users,       color: "text-foreground",         bg: "bg-muted" },
    { label: "Active",          value: stats.active,          icon: UserCheck,   color: "text-primary",            bg: "bg-primary/10" },
    { label: "Linked Accounts", value: stats.linked,          icon: Link2,       color: "text-foreground",         bg: "bg-secondary" },
    { label: "Transferred Out", value: stats.transferred_out, icon: PlaneTakeoff,color: "text-muted-foreground",   bg: "bg-muted" },
  ];

  const recentMembers = [...members]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Church identity banner */}
      <Card className="bg-primary text-primary-foreground border-none rounded-[2rem] shadow-md">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-foreground/10 flex items-center justify-center shrink-0">
            <Church className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/60">
              Registered Church
            </p>
            <p className="text-xl font-black tracking-tighter uppercase italic text-primary-foreground leading-none truncate">
              {churchName}
            </p>
          </div>
          <div className="ml-auto shrink-0 hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary-foreground/10 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary-foreground/80">Active</span>
          </div>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Card key={i} className="bg-card border border-border rounded-[2rem] shadow-sm">
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

      {/* Status breakdown + recent additions side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership breakdown */}
        <Card className="bg-card border border-border rounded-[2rem]">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Membership Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-3">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const count = stats[key as keyof typeof stats] as number;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              const Icon = cfg.icon;
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center ${cfg.color} shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
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
                        className="h-full rounded-full bg-primary/40"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recently added */}
        <Card className="bg-card border border-border rounded-[2rem]">
          <CardHeader className="p-6 pb-4 flex-row items-center justify-between">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Recently Added
            </CardTitle>
            <button
              onClick={() => setActiveTab("members")}
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
            >
              View all
            </button>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {recentMembers.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">No members yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentMembers.map((m) => {
                  const cfg = STATUS_CONFIG[m.membership_status];
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 hover:bg-muted transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-black text-primary">
                          {m.first_name[0]}{m.last_name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">
                          {m.last_name}, {m.first_name}
                          {m.middle_name ? ` ${m.middle_name[0]}.` : ""}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(m.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color} shrink-0`}>
                        {cfg.label}
                      </span>
                      {m.linked_profile_id && (
                        <Link2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ─── Transfers Tab ─────────────────────────────────────────────── */
function TransfersTab({ members }: { members: ChurchMember[] }) {
  const transferredOut = members.filter(m => m.membership_status === "transferred_out");
  const transferredIn  = members.filter(m => m.transfer_from);

  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border rounded-[2rem]">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <PlaneTakeoff className="w-4 h-4 text-muted-foreground" /> Transferred Out
            <Badge className="ml-1 text-[9px] font-black bg-muted text-muted-foreground border-0 rounded-full">
              {transferredOut.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {transferredOut.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No transfer-out records.</p>
          ) : (
            <div className="space-y-2">
              {transferredOut.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 border border-border">
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-black text-foreground">{m.first_name[0]}{m.last_name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{m.last_name}, {m.first_name}</p>
                    {m.transfer_to && (
                      <p className="text-[10px] text-muted-foreground">→ {m.transfer_to}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border border-border rounded-[2rem]">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-primary" /> Transferred In
            <Badge className="ml-1 text-[9px] font-black bg-primary/10 text-primary border-0 rounded-full">
              {transferredIn.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {transferredIn.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No transfer-in records.</p>
          ) : (
            <div className="space-y-2">
              {transferredIn.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-black text-primary">{m.first_name[0]}{m.last_name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{m.last_name}, {m.first_name}</p>
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
function ReportsTab({
  stats,
  members,
  churchName,
}: {
  stats: Props["stats"];
  members: ChurchMember[];
  churchName: string;
}) {
  const statusRows = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    label: cfg.label,
    count: stats[key as keyof typeof stats] as number,
    pct: stats.total > 0 ? Math.round(((stats[key as keyof typeof stats] as number) / stats.total) * 100) : 0,
  }));

  const sorted = [...members].sort((a, b) =>
    `${a.last_name}${a.first_name}`.localeCompare(`${b.last_name}${b.first_name}`)
  );

  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border rounded-[2rem]">
        <CardHeader className="p-6 pb-4 flex-row items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Membership Report
          </CardTitle>
          <Button onClick={() => window.print()} variant="outline" size="sm" className="rounded-xl font-bold text-xs uppercase tracking-widest gap-2 min-h-[40px]">
            Print / Export
          </Button>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
          {/* Report meta */}
          <div className="p-5 bg-muted rounded-2xl space-y-1">
            <p className="font-black text-foreground text-sm">{churchName}</p>
            <p className="text-muted-foreground text-xs">
              Report date: {new Date().toLocaleDateString("en-PH", { dateStyle: "full" })}
            </p>
            <p className="text-muted-foreground text-xs">
              Total on record: <strong className="text-foreground">{stats.total}</strong>
            </p>
          </div>

          {/* Summary table */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Summary</p>
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
                      <td className="p-4 font-medium text-foreground">{row.label}</td>
                      <td className="p-4 text-right font-black text-foreground">{row.count}</td>
                      <td className="p-4 text-right text-muted-foreground">{row.pct}%</td>
                    </tr>
                  ))}
                  <tr className="bg-primary/5">
                    <td className="p-4 font-black text-foreground text-xs uppercase tracking-widest">Total</td>
                    <td className="p-4 text-right font-black text-primary">{stats.total}</td>
                    <td className="p-4 text-right text-muted-foreground">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                    <th className="p-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">Date</th>
                    <th className="p-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((m, i) => {
                    const cfg = STATUS_CONFIG[m.membership_status];
                    return (
                      <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                        <td className="p-3 text-muted-foreground text-xs">{i + 1}</td>
                        <td className="p-3 font-medium text-foreground">
                          {m.last_name}, {m.first_name}{m.middle_name ? ` ${m.middle_name[0]}.` : ""}
                        </td>
                        <td className="p-3 text-muted-foreground hidden md:table-cell text-xs">
                          {m.membership_date
                            ? new Date(m.membership_date).toLocaleDateString("en-PH", { dateStyle: "medium" })
                            : "—"}
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
