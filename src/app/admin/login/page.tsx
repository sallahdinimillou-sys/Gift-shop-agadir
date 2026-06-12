
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const AUTHORIZED_ADMIN_EMAIL = 'sallahdinimillou@gmail.com';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isLoading: userLoading } = useUser();

  useEffect(() => {
    // If user is already logged in with the correct email, go to dashboard
    if (!userLoading && user && user.email === AUTHORIZED_ADMIN_EMAIL) {
      router.push('/admin');
    }
  }, [user, userLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({ title: "Configuration Error", description: "Firebase is not initialized correctly.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      if (email === AUTHORIZED_ADMIN_EMAIL) {
        toast({ title: "Welcome back!", description: "Logged in successfully." });
        router.push('/admin');
      } else {
        // The AdminLayout will catch the wrong email and show Access Denied
        router.push('/admin'); 
      }
    } catch (error: any) {
      console.error(error);
      let message = "Invalid credentials.";
      if (error.code === 'auth/invalid-api-key') {
        message = "Firebase API Key is invalid. Please check your configuration.";
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Invalid email or password.";
      }
      
      toast({ 
        title: "Login failed", 
        description: message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-primary/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-accent/20 blur-[100px] rounded-full animate-pulse" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-white/5 bg-card/80 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <CardHeader className="text-center space-y-4 pt-10 pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center rotate-3 border border-primary/20 shadow-inner">
            <ShieldCheck className="text-primary w-8 h-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold uppercase tracking-tighter text-gradient-primary">
              Admin Gateway
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Authorized Personnel Access Only
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Admin Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder={AUTHORIZED_ADMIN_EMAIL} 
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Security Key</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" />
                  Verifying...
                </span>
              ) : "Authenticate Access"}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Secure Environment
            </p>
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              All login attempts are monitored and logged for security purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
