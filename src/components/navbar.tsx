"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";
import { signOut } from "@/services/auth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#tools" },
  { label: "Who Is It For", href: "#who" },
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
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white p-[3px] shadow-sm">
            <Image src="/logo-sda.png" alt="SDA Logo" width={30} height={30} className="object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-xl tracking-[-0.3px] text-foreground">AdventFlow</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary leading-none">
              For Your Church
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground rounded-lg hover:text-primary hover:bg-primary/10 transition-all duration-150 no-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-1.5 shadow-sm backdrop-blur-md transition-all hover:bg-card active:scale-[0.98] cursor-pointer group">
                <Avatar className="h-8 w-8 border border-border/50">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 pr-2">
                  <span className="max-w-[120px] truncate text-sm font-semibold text-foreground">
                    {user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="mt-4 w-64 rounded-2xl border-border/60 bg-card/95 p-2 shadow-2xl backdrop-blur-xl">
                <DropdownMenuLabel className="p-4">
                  <p className="text-xs font-bold text-foreground truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-2 opacity-50" />
                <div className="space-y-1 p-1">
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer rounded-xl p-3 flex items-center gap-3 focus:bg-primary/5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <LayoutDashboard className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard?tab=settings")}
                    className="cursor-pointer rounded-xl p-3 flex items-center gap-3 focus:bg-primary/5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                      <Settings className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">Settings</span>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="mx-2 opacity-50" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="m-1 cursor-pointer rounded-xl p-3 flex items-center gap-3 text-red-500 focus:bg-red-500/10 focus:text-red-600"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <a
                href="/login"
                className="px-[18px] py-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors no-underline"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="rounded-[10px] bg-primary px-[22px] py-[9px] text-[13px] font-semibold text-white shadow-[0_1px_3px_rgba(30,58,138,0.3),0_4px_12px_rgba(30,58,138,0.2)] hover:bg-primary/90 hover:-translate-y-px transition-all no-underline"
              >
                Get access
              </a>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-[60] border-b border-border/60 bg-background/95 p-6 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-2xl bg-muted/30 p-4 text-xs font-semibold uppercase tracking-widest text-foreground no-underline active:scale-[0.98] transition-all"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 space-y-3">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary font-bold text-primary-foreground">
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-semibold text-foreground">{user.email?.split("@")[0]}</span>
                      <span className="truncate text-[10px] text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { router.push("/dashboard"); setMobileOpen(false); }}
                      className="flex flex-col items-center justify-center gap-2 rounded-[2.5rem] border border-border/60 bg-card p-6 shadow-xl"
                    >
                      <LayoutDashboard className="h-6 w-6 text-primary" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Dashboard</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex flex-col items-center justify-center gap-2 rounded-[2.5rem] border border-red-500/10 bg-red-500/5 p-6 shadow-xl text-red-500"
                    >
                      <LogOut className="h-6 w-6" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <a
                  href="/signup"
                  className="flex w-full items-center justify-center rounded-3xl bg-primary p-5 text-[11px] font-bold uppercase tracking-widest text-white shadow-2xl shadow-primary/20 no-underline"
                >
                  Get Access
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
