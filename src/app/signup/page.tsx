"use client";

import { useState, useEffect } from 'react';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, Lock, User, Phone, CheckCircle2, 
  ChevronRight, ChevronLeft, ShieldCheck, 
  Sparkles, Loader2, Globe, Building2, MapPin, Church as ChurchIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MISSION_HIERARCHY } from '@/lib/mission-config';
import { signUpWithEmail } from '@/services/auth';
import { 
  getMissionsList, 
  getAreasByMission, 
  getDivisionsByArea, 
  getChurchesByDivision 
} from "@/services/onboarding";
import { SearchableSelector } from "@/components/searchable-selector";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';

const STEPS = [
  { id: 1, title: 'Identity' },
  { id: 2, title: 'Placement' },
  { id: 3, title: 'Roles' }
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    surname: '',
    firstName: '',
    mission: '',
    area: '',
    division: '',
    church: '',
    dpaConsent: false,
    roles: ['MEMBER']
  });

  // Data lists
  const [missions, setMissions] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [churches, setChurches] = useState<any[]>([]);

  // Loading states
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingChurches, setLoadingChurches] = useState(false);

  // Load initial missions
  React.useEffect(() => {
    setLoadingMissions(true);
    getMissionsList()
      .then(setMissions)
      .catch(console.error)
      .finally(() => setLoadingMissions(false));
  }, []);

  // Cascade loads
  React.useEffect(() => {
    if (formData.mission) {
      setLoadingAreas(true);
      getAreasByMission(formData.mission)
        .then(setAreas)
        .catch(console.error)
        .finally(() => setLoadingAreas(false));
    } else {
      setAreas([]);
    }
  }, [formData.mission]);

  React.useEffect(() => {
    if (formData.area) {
      setLoadingDivisions(true);
      getDivisionsByArea(formData.area)
        .then(setDivisions)
        .catch(console.error)
        .finally(() => setLoadingDivisions(false));
    } else {
      setDivisions([]);
    }
  }, [formData.area]);

  React.useEffect(() => {
    if (formData.division) {
      setLoadingChurches(true);
      getChurchesByDivision(formData.division)
        .then(setChurches)
        .catch(console.error)
        .finally(() => setLoadingChurches(false));
    } else {
      setChurches([]);
    }
  }, [formData.division]);

  const availableRoles = MISSION_HIERARCHY.CHURCH.roles
    .concat(MISSION_HIERARCHY.DIVISION.roles)
    .concat(MISSION_HIERARCHY.AREA.roles)
    .concat(MISSION_HIERARCHY.MISSION.roles)
    .filter(r => r.id !== 'MEMBER' && r.id !== 'SYSTEM_ADMIN');

  const toggleRole = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId) 
        ? prev.roles.filter(id => id !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.email || !formData.password)) {
      toast.error('Identity Required', { description: 'Please provide valid credentials.' });
      return;
    }
    if (step === 2 && (!formData.surname || !formData.firstName || !formData.mission || !formData.area || !formData.division || !formData.church || !formData.dpaConsent)) {
      toast.error('Placement Incomplete', { description: 'All location fields and DPA consent are mandatory.' });
      return;
    }
    setStep(s => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await signUpWithEmail(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.surname,
        mission_id: formData.mission,
        area_id: formData.area,
        division_id: formData.division,
        church_id: formData.church,
        roles: formData.roles,
        dpa_consent: formData.dpaConsent,
        onboarding_completed: true
      });
      toast.success('Enrollment Initiated', { 
        description: 'Verify your identity via email to complete placement.' 
      });
      router.push('/login');
    } catch (err: any) {
      toast.error('Enrollment Failed', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans px-4 py-8 sm:py-16 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />
      <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[540px] mx-auto z-10 flex flex-col gap-10">
        
        {/* Progress Header */}
        <header className="flex flex-col gap-6 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-10 h-10 text-primary drop-shadow-sm" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground italic uppercase">Create an Account</h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Join AdventFlow today</p>
          </div>
          
          {/* Enhanced Progress Indicator */}
          <nav className="flex items-center justify-center gap-1 sm:gap-4 mt-2 px-4">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-2 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 z-10 ${
                    step === s.id ? 'bg-primary text-primary-foreground shadow-xl scale-110' : 
                    step > s.id ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground/30 border border-border/40'
                  }`}>
                    {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                  </div>
                  <span className={`text-[9px] uppercase font-black tracking-[0.2em] absolute -bottom-6 whitespace-nowrap transition-colors duration-300 ${
                    step === s.id ? 'text-primary' : 'text-muted-foreground/30'
                  }`}>{s.title}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="w-12 sm:w-20 h-[2px] mx-2 bg-gradient-to-r from-transparent via-border to-transparent opacity-40" />
                )}
              </div>
            ))}
          </nav>
        </header>

        <Card className="border-border/40 shadow-2xl bg-card/60 backdrop-blur-xl overflow-hidden rounded-5xl mt-4">
          <CardContent className="p-8 sm:p-14">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.section 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-10"
                >
                  <div className="space-y-8">
                    <div className="space-y-2 border-l-4 border-primary pl-4">
                      <h2 className="text-xl font-black tracking-tight uppercase italic">Account Details</h2>
                      <p className="text-xs text-muted-foreground font-medium">Set up your login credentials.</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2.5">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                          <Input 
                            type="email" 
                            placeholder="personnel@church.org" 
                            className="h-14 pl-12 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/10 transition-all text-base placeholder:text-muted-foreground/30 font-medium"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                          <Input 
                            type="password" 
                            placeholder="Min. 8 characters" 
                            className="h-14 pl-12 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/10 transition-all text-base placeholder:text-muted-foreground/30 font-medium"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button 
                      onClick={handleNext}
                      className="h-14 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                    >
                      Next Step <ChevronRight className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline"
                      className="h-14 border-border/60 bg-transparent font-black text-xs uppercase tracking-widest text-foreground rounded-2xl hover:bg-muted/50 transition-all flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Sign up with Google
                    </Button>
                  </div>
                </motion.section>
              )}

              {step === 2 && (
                <motion.section 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-10"
                >
                  <div className="space-y-8">
                    <div className="space-y-2 border-l-4 border-primary pl-4">
                      <h2 className="text-xl font-black tracking-tight uppercase italic">Your Information</h2>
                      <p className="text-xs text-muted-foreground font-medium">Tell us a bit about yourself.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Surname</Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                          <Input 
                            type="text" 
                            placeholder="Dela Cruz" 
                            className="h-14 pl-12 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/10 transition-all text-base font-medium"
                            value={formData.surname}
                            onChange={e => setFormData({...formData, surname: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">First Name</Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                          <Input 
                            type="text" 
                            placeholder="Juana A." 
                            className="h-14 pl-12 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/10 transition-all text-base font-medium"
                            value={formData.firstName}
                            onChange={e => setFormData({...formData, firstName: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 pt-2">
                       <SearchableSelector
                        label="Mission / Union"
                        items={missions}
                        value={formData.mission}
                        loading={loadingMissions}
                        placeholder="Search Mission..."
                        onSelect={(id) => setFormData({
                          ...formData, 
                          mission: id,
                          area: '',
                          division: '',
                          church: ''
                        })}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <SearchableSelector
                          label="Strategic Area"
                          items={areas}
                          value={formData.area}
                          loading={loadingAreas}
                          disabled={!formData.mission}
                          placeholder={formData.mission ? "Search Area..." : "Select Mission"}
                          onSelect={(id) => setFormData({
                            ...formData, 
                            area: id,
                            division: '',
                            church: ''
                          })}
                        />
                        <SearchableSelector
                          label="Division / District"
                          items={divisions}
                          value={formData.division}
                          loading={loadingDivisions}
                          disabled={!formData.area}
                          placeholder={formData.area ? "Search Division..." : "Select Area"}
                          onSelect={(id) => setFormData({
                            ...formData, 
                            division: id,
                            church: ''
                          })}
                        />
                      </div>

                      <SearchableSelector
                        label="Local Church"
                        items={churches}
                        value={formData.church}
                        loading={loadingChurches}
                        disabled={!formData.division}
                        placeholder={formData.division ? "Search Church..." : "Select Division"}
                        onSelect={(id) => setFormData({...formData, church: id})}
                      />
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-primary/5 border border-primary/10 rounded-[2rem] transition-all hover:bg-primary/[0.08]">
                      <input 
                        type="checkbox"
                        id="dpa"
                        className="w-5 h-5 mt-0.5 rounded-lg border-muted text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                        checked={formData.dpaConsent}
                        onChange={e => setFormData({...formData, dpaConsent: e.target.checked})}
                      />
                      <Label htmlFor="dpa" className="text-[11px] leading-relaxed text-muted-foreground font-semibold cursor-pointer">
                        I acknowledge the collection of my records under <span className="text-foreground font-black">RA 10173</span>. This data is for ecclesiastical administration and Mission Hub membership.
                      </Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline"
                      onClick={handleBack}
                      className="h-14 border-border/60 bg-transparent font-black text-xs uppercase tracking-widest text-muted-foreground rounded-2xl hover:bg-muted/50 transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" /> Back
                    </Button>
                    <Button 
                      onClick={handleNext}
                      className="h-14 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                    >
                      Next Step <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.section>
              )}

              {step === 3 && (
                <motion.section 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-10"
                >
                  <div className="space-y-8">
                    <div className="space-y-2 border-l-4 border-primary pl-4">
                      <h2 className="text-xl font-black tracking-tight uppercase italic">Select Roles</h2>
                      <p className="text-xs text-muted-foreground font-medium">What are your roles in the church?</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {/* Auto-assigned membership card */}
                      <div className="flex items-center justify-between p-4 bg-muted border border-border rounded-2xl font-sans cursor-default">
                        <div className="flex flex-col gap-1 pr-4">
                          <span className="text-[11px] font-black text-foreground uppercase tracking-[0.15em]">Church Member</span>
                          <span className="text-[10px] text-muted-foreground font-medium leading-relaxed whitespace-normal break-words">Verified at {formData.church || 'Local Hub'}</span>
                        </div>
                        <div className="w-8 h-8 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        </div>
                      </div>

                      {/* Role selector with semantic grid */}
                      <div className="grid grid-cols-1 gap-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                        {availableRoles.map(role => (
                          <button
                            key={role.id}
                            onClick={() => toggleRole(role.id)}
                            className={`group flex flex-col items-start p-4 border rounded-2xl text-left w-full transition-all duration-300 relative ${
                              formData.roles.includes(role.id) 
                                ? 'bg-primary/10 border-primary ring-1 ring-primary shadow-sm' 
                                : 'bg-card border-border hover:bg-muted/30 hover:border-primary/30'
                            }`}
                          >
                            <span className={`text-[11px] font-black uppercase tracking-[0.15em] mb-1 transition-colors ${
                              formData.roles.includes(role.id) ? 'text-primary' : 'text-foreground'
                            }`}>
                              {role.label}
                            </span>
                            <span className={`text-[10px] font-medium leading-relaxed whitespace-normal break-words mb-1 ${
                              formData.roles.includes(role.id) ? 'text-primary/70' : 'text-muted-foreground'
                            }`}>
                              {role.description}
                            </span>
                            
                            <AnimatePresence>
                              {formData.roles.includes(role.id) && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                  animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                  className="bg-primary/20 px-3 py-1 rounded-full border border-primary/30"
                                >
                                  <span className="text-[9px] font-black tracking-tighter uppercase text-primary">⌛ Verification Pending</span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted/20 p-5 rounded-[1.5rem] border border-border/40">
                      <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest leading-relaxed opacity-60 italic">
                        "Official roles require formal board verification by local authorities."
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline"
                      onClick={handleBack}
                      className="h-14 border-border/60 bg-transparent font-black text-xs uppercase tracking-widest text-muted-foreground rounded-2xl hover:bg-muted/50 transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" /> Back
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={loading}
                      className="h-14 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 group"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:animate-pulse" />}
                      {loading ? 'Processing...' : 'Sign Up'}
                    </Button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <footer className="text-center mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
            Already have an account? <a href="/login" className="text-primary hover:underline underline-offset-8 transition-all">Log in</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
