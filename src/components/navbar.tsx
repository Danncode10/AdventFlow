"use client";

import { useState } from "react";
import { Menu, X, ShieldCheck, LayoutDashboard, Settings, LogOut, ChevronDown, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { signOut } from "@/services/auth";
import { useRouter } from "next/navigation";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Mission", href: "/#mission" },
  { label: "Community", href: "/#community" },
  { label: "Ecclesiastical", href: "/#ecclesiastical" },
  { label: "Sanctuary", href: "/#sanctuary" },
];

export function Navbar({ user }: { user: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.refresh();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 py-2">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 sm:px-10">
        
        {/* Logo - Sanctuary Style */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              AdventFlow
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary leading-none ml-0.5">
              Sanctuary Hub
            </span>
          </div>
        </a>

        {/* Desktop Nav - Centered & Elegant */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-5 py-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 rounded-full hover:text-primary hover:bg-primary/5 transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Layer */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 bg-card/40 hover:bg-card active:scale-[0.98] transition-all rounded-2xl p-1.5 border border-border/40 shadow-sm group cursor-pointer backdrop-blur-md">
                <Avatar className="h-8 w-8 border border-border/50 shadow-sm transition-transform group-hover:scale-105">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-black text-xs">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2.5 pr-2">
                  <span className="text-sm font-black text-foreground uppercase tracking-tight truncate max-w-[120px]">
                    {user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-72 mt-4 p-2 rounded-[2rem] shadow-2xl border-border/60 bg-card/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                <DropdownMenuLabel className="p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-black text-foreground uppercase tracking-widest truncate">
                      Authorized Personnel
                    </p>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-tight truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="opacity-50 mx-2" />
                
                <div className="p-1 space-y-1">
                  <DropdownMenuItem onClick={() => router.push("/dashboard")} className="rounded-2xl p-3 flex items-center gap-3 focus:bg-primary/5 group cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <LayoutDashboard className="h-4 w-4" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-[10px]">Mission Control</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push("/dashboard?tab=settings")} className="rounded-2xl p-3 flex items-center gap-3 focus:bg-primary/5 group cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                      <Settings className="h-4 w-4" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-[10px]">Portal Settings</span>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="opacity-50 mx-2" />

                <DropdownMenuItem onClick={handleSignOut} className="rounded-[1.5rem] m-1 p-3 flex items-center gap-3 text-red-500 focus:bg-red-500/10 focus:text-red-600 cursor-pointer transition-all">
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-[10px]">Sign Out of Hub</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
              >
                Entrance
              </a>
              <a
                href="/signup"
                className="px-8 py-3 text-[11px] font-black uppercase tracking-widest rounded-2xl bg-primary text-primary-foreground hover:opacity-95 shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                Join Sanctuary <Sparkles className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground bg-secondary/50 rounded-xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed inset-x-0 top-14 bg-background/95 backdrop-blur-2xl border-b border-border/60 p-6 space-y-6 shadow-2xl z-[60]"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl text-xs font-black uppercase tracking-widest text-foreground active:scale-[0.98] transition-all"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-4 space-y-3">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-[2rem] border border-primary/20">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary text-primary-foreground font-black italic">{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-black uppercase tracking-tight text-foreground truncate">{user.email?.split("@")[0]}</span>
                      <span className="text-[10px] font-bold text-muted-foreground truncate opacity-70">{user.email}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => { router.push("/dashboard"); setMobileOpen(false); }}
                      className="flex flex-col items-center justify-center gap-2 p-6 bg-card border border-border/60 rounded-[2.5rem] shadow-xl"
                    >
                      <LayoutDashboard className="w-6 h-6 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Hub</span>
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="flex flex-col items-center justify-center gap-2 p-6 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] shadow-xl text-red-500"
                    >
                      <LogOut className="w-6 h-6" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Exit</span>
                    </button>
                  </div>
                </div>
              ) : (
                <a
                  href="/login"
                  className="flex items-center justify-center w-full p-5 text-[11px] font-black uppercase tracking-widest rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20"
                >
                  Join the Mission
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
