"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Building2, 
  MapPin, 
  GitBranch, 
  Church as ChurchIcon,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Users,
  ShieldAlert,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  getMissionsList, 
  getAreasByMission, 
  getDivisionsByArea, 
  getChurchesByDivision,
  submitOnboardingRequest 
} from "@/services/onboarding"
import { cn } from "@/lib/utils"

const ROLE_OPTIONS = [
  { value: 'MEMBER', label: 'Church Member', description: 'Access to local church resources and digital bulletin.' },
  { value: 'ELDER', label: 'Elder', description: 'Management of church members and service scheduling.' },
  { value: 'TREASURER', label: 'Treasurer', description: 'Financial reporting and tithe/offering remittance.' },
  { value: 'PASTOR', label: 'Pastor', description: 'Oversight of multiple churches and division leadership.' },
  { value: 'AREA_COORD', label: 'Area Coordinator', description: 'Regional coordination across multiple divisions.' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  // Selection state
  const [level, setLevel] = React.useState<'CHURCH' | 'DIVISION' | 'AREA' | 'MISSION' | null>(null)
  const [selectedMission, setSelectedMission] = React.useState<string | null>(null)
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null)
  const [selectedDivision, setSelectedDivision] = React.useState<string | null>(null)
  const [selectedChurch, setSelectedChurch] = React.useState<string | null>(null)
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null)

  // Data lists
  const [missions, setMissions] = React.useState<any[]>([])
  const [areas, setAreas] = React.useState<any[]>([])
  const [divisions, setDivisions] = React.useState<any[]>([])
  const [churches, setChurches] = React.useState<any[]>([])

  // Load initial data
  React.useEffect(() => {
    getMissionsList().then(setMissions).catch(console.error)
  }, [])

  // Cascade loads
  React.useEffect(() => {
    if (selectedMission) {
      getAreasByMission(selectedMission).then(setAreas).catch(console.error)
    }
  }, [selectedMission])

  React.useEffect(() => {
    if (selectedArea) {
      getDivisionsByArea(selectedArea).then(setDivisions).catch(console.error)
    }
  }, [selectedArea])

  React.useEffect(() => {
    if (selectedDivision) {
      getChurchesByDivision(selectedDivision).then(setChurches).catch(console.error)
    }
  }, [selectedDivision])

  const handleLevelSelect = (l: typeof level) => {
    setLevel(l)
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!selectedRole) return
    setSaving(true)
    try {
      await submitOnboardingRequest({
        mission_id: selectedMission || undefined,
        area_id: selectedArea || undefined,
        division_id: selectedDivision || undefined,
        church_id: selectedChurch || undefined,
        role: selectedRole
      })
      setStep(5) // Success
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-dots">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-700">
        
        {/* Step Indicator */}
        <div className="flex justify-center gap-4 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={cn(
                "h-1.5 w-16 rounded-full transition-all duration-500",
                step >= s ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* 1. Selection Mode */}
        {step === 1 && (
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-5xl font-black uppercase tracking-tighter italic">Welcome to the Mission</h1>
              <p className="text-muted-foreground font-semibold italic text-lg shadow-text">Where do you currently serve within the Adventist Sanctuary Hub?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: ChurchIcon, label: "Local Church", level: 'CHURCH', desc: "Regular members, Elders, and local Treasurers." },
                { icon: GitBranch, label: "Division / District", level: 'DIVISION', desc: "District Pastors and regional administrators." },
                { icon: MapPin, label: "Strategic Area", level: 'AREA', desc: "Provincial coordinators and area mission leaders." },
                { icon: Building2, label: "Mission HQ", level: 'MISSION', desc: "Union administrators and system-wide stakeholders." },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleLevelSelect(item.level as any)}
                  className="p-8 bg-card border border-border/50 rounded-[3rem] text-left hover:border-primary group transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight italic mb-2">{item.label}</h3>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. Drill-down Search */}
        {step === 2 && (
          <Card className="bg-card border border-border/60 shadow-2xl rounded-[3rem] overflow-hidden p-8 animate-in slide-in-from-right-4">
            <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-black uppercase italic tracking-tighter">Locate your Sanctuary</CardTitle>
                <CardDescription className="italic font-semibold">Select the specific entity you are affiliated with</CardDescription>
              </div>
              <Button variant="ghost" onClick={() => setStep(1)} className="rounded-full font-black uppercase italic text-xs tracking-widest gap-2">
                <ChevronLeft className="w-4 h-4" /> Change Level
              </Button>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4">1. Mission</label>
                  <select 
                    className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 font-bold uppercase tracking-tight outline-none focus:ring-2 ring-primary/20"
                    onChange={(e) => {
                      setSelectedMission(e.target.value); 
                      setSelectedArea(null);
                      setSelectedDivision(null);
                      setSelectedChurch(null);
                    }}
                    value={selectedMission || ""}
                  >
                    <option value="" disabled>Select Mission</option>
                    {missions.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>

                {(level === 'AREA' || level === 'DIVISION' || level === 'CHURCH') && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4">2. Area</label>
                    <select 
                      disabled={!selectedMission}
                      className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 font-bold uppercase tracking-tight outline-none focus:ring-2 ring-primary/20 disabled:opacity-50"
                      onChange={(e) => {
                        setSelectedArea(e.target.value);
                        setSelectedDivision(null);
                        setSelectedChurch(null);
                      }}
                      value={selectedArea || ""}
                    >
                      <option value="" disabled>Select Area / Province</option>
                      {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                )}

                {(level === 'DIVISION' || level === 'CHURCH') && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4">3. Division / District</label>
                    <select 
                      disabled={!selectedArea}
                      className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 font-bold uppercase tracking-tight outline-none focus:ring-2 ring-primary/20 disabled:opacity-50"
                      onChange={(e) => {
                        setSelectedDivision(e.target.value);
                        setSelectedChurch(null);
                      }}
                      value={selectedDivision || ""}
                    >
                      <option value="" disabled>Select Division</option>
                      {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                )}

                {level === 'CHURCH' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4">4. Local Church</label>
                    <select 
                      disabled={!selectedDivision}
                      className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 font-bold uppercase tracking-tight outline-none focus:ring-2 ring-primary/20 disabled:opacity-50"
                      onChange={(e) => setSelectedChurch(e.target.value)}
                      value={selectedChurch || ""}
                    >
                      <option value="" disabled>Select Church</option>
                      {churches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-0 mt-10">
              <Button 
                onClick={() => setStep(3)}
                disabled={
                  (level === 'MISSION' && !selectedMission) ||
                  (level === 'AREA' && !selectedArea) ||
                  (level === 'DIVISION' && !selectedDivision) ||
                  (level === 'CHURCH' && !selectedChurch)
                }
                className="w-full h-16 bg-primary text-primary-foreground font-black uppercase italic tracking-widest rounded-2xl text-lg shadow-xl shadow-primary/20"
              >
                Proceed to Role Selection <ChevronRight className="w-5 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* 3. Role Selection */}
        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
             <div className="space-y-4 text-center">
              <h1 className="text-4xl font-black uppercase tracking-tighter italic">Define your Role</h1>
              <p className="text-muted-foreground font-semibold italic">What responsibility have you been entrusted with?</p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={cn(
                    "p-6 border rounded-[2rem] text-left transition-all flex items-center justify-between group",
                    selectedRole === role.value 
                      ? "border-primary bg-primary/5 shadow-lg" 
                      : "bg-card border-border/50 hover:border-primary/50"
                  )}
                >
                  <div className="space-y-1">
                    <h4 className="text-xl font-black uppercase italic tracking-tight">{role.label}</h4>
                    <p className="text-xs font-medium text-muted-foreground italic">{role.description}</p>
                  </div>
                  {selectedRole === role.value && <CheckCircle2 className="w-6 h-6 text-primary" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 pt-8">
              <Button variant="ghost" onClick={() => setStep(2)} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest italic text-xs">Back</Button>
              <Button 
                onClick={() => setStep(4)} 
                disabled={!selectedRole}
                className="h-14 px-12 bg-primary text-primary-foreground font-black uppercase tracking-widest italic rounded-2xl shadow-xl"
              >
                Final Review
              </Button>
            </div>
          </div>
        )}

        {/* 4. Final Review */}
        {step === 4 && (
          <Card className="bg-card border border-border/60 shadow-2xl rounded-[3rem] overflow-hidden p-12 max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in-95">
             <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
                <ShieldAlert className="w-10 h-10" />
             </div>
             <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic">Declaration of Intent</h3>
                <p className="text-muted-foreground text-sm font-semibold italic">By submitting, you are requesting to join the sanctuary system with the following credentials:</p>
             </div>

             <div className="bg-muted/30 p-8 rounded-[2rem] space-y-4 text-left">
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Placement</span>
                   <span className="font-bold uppercase tracking-tight italic text-sm">
                      {selectedChurch ? churches.find(c => c.id === selectedChurch)?.name : 
                       selectedDivision ? divisions.find(d => d.id === selectedDivision)?.name :
                       selectedArea ? areas.find(a => a.id === selectedArea)?.name :
                       missions.find(m => m.id === selectedMission)?.name}
                   </span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entrusted Role</span>
                   <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase italic">{selectedRole}</Badge>
                </div>
             </div>

             <div className="flex flex-col gap-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={saving}
                  className="h-16 bg-primary text-primary-foreground font-black uppercase tracking-widest italic text-lg rounded-[2rem] shadow-2xl shadow-primary/30"
                >
                  {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm & Submit Request"}
                </Button>
                <Button variant="ghost" onClick={() => setStep(3)} className="font-bold uppercase italic text-xs tracking-widest opacity-60">Back to roles</Button>
             </div>
          </Card>
        )}

        {/* 5. Success State */}
        {step === 5 && (
          <Card className="bg-card border border-border/60 shadow-2xl rounded-[3rem] overflow-hidden p-12 max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in-95">
             <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 className="w-12 h-12" />
             </div>
             <div className="space-y-4">
                <h3 className="text-4xl font-black uppercase tracking-tighter italic">Request Transmitted</h3>
                <p className="text-muted-foreground font-semibold italic leading-relaxed">
                  Your ecclesiastical placement request has been recorded. Your role remains <span className="text-primary italic">"Pending Approval"</span> by the respective administrative office.
                </p>
             </div>
             <Button 
                onClick={() => router.push('/dashboard')} 
                className="h-16 px-12 bg-primary text-primary-foreground font-black uppercase tracking-widest italic text-lg rounded-[2rem] shadow-xl"
              >
                Go to Dashboard
              </Button>
          </Card>
        )}

      </div>
    </div>
  )
}
