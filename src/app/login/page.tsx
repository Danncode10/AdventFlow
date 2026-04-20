"use client";

import { useState } from 'react';
import { signInWithEmail } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Lock, Loader2, Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signInWithEmail(email, password);
      
      if (result.requiresMFA) {
        toast.info('MFA Required', { description: 'Please enter your verification code.' });
        router.push('/auth/mfa');
      } else {
        toast.success('Login successful!', { description: 'Welcome to the Mission Hub.' });
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      toast.error('Access Denied', { description: err.message || 'Check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans px-4 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] z-10"
      >
        <Card className="border-border/40 shadow-2xl bg-card/60 backdrop-blur-xl overflow-hidden rounded-5xl">
          <CardHeader className="flex flex-col gap-4 text-center pt-10 sm:pt-14">
            <motion.div 
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-2 shadow-inner"
            >
              <ShieldCheck className="w-12 h-12 text-primary drop-shadow-sm" />
            </motion.div>
            <div className="space-y-1.5">
              <h1 className="text-4xl font-black tracking-tight text-foreground italic uppercase">
                AdventFlow
              </h1>
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                Welcome Back
              </p>
            </div>
            <p className="text-muted-foreground text-sm font-medium max-w-[300px] mx-auto leading-relaxed pt-2">
              Sign in to access your dashboard and manage your account.
            </p>
          </CardHeader>
          
          <CardContent className="px-8 sm:px-12 pb-10">
            <form onSubmit={handleLogin} className="flex flex-col gap-8">
              <div className="space-y-6">
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="name@example.com" 
                      className="h-14 pl-12 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/10 transition-all text-base placeholder:text-muted-foreground/30 font-medium"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Password
                    </Label>
                    <a href="/forgot-password" 
                      className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors opacity-60"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input 
                      id="password"
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      className="h-14 pl-12 pr-12 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/10 transition-all text-base placeholder:text-muted-foreground/30 font-medium"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5 opacity-50" /> : <Eye className="w-5 h-5 opacity-50" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="h-14 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 group"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:animate-pulse" />}
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push('/signup')}
                  disabled={loading} 
                  className="h-14 border-border/60 bg-transparent font-black text-xs uppercase tracking-widest text-foreground rounded-2xl hover:bg-muted/50 transition-all"
                >
                  Create an Account
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-0 pb-10">
            <div className="w-1/3 h-[1px] bg-border/40 mx-auto" />
            <p className="text-[9px] text-muted-foreground uppercase tracking-[0.4em] font-black leading-tight text-center opacity-40 px-10">
              System Protected by Data Privacy Act 2012 <br /> 
              Seventh-day Adventist Church Union Hub
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
