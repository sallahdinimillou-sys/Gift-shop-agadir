
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';

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
    if (!userLoading && user && user.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      router.push('/admin');
    }
  }, [user, userLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({ title: "Error", description: "Firebase is not initialized.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedUser = userCredential.user;
      
      if (loggedUser.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        toast({ title: "Access Granted", description: "Welcome to the administration panel." });
        router.push('/admin');
      } else {
        toast({ 
          title: "Unauthorized", 
          description: "This account is not permitted to access this area.", 
          variant: "destructive" 
        });
      }
    } catch (error: any) {
      let message = "An error occurred during authentication.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        message = "The email or password you entered is incorrect.";
      }
      toast({ 
        title: "Login Failed", 
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
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-primary/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-accent/20 blur-[100px] rounded-full" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-white/5 bg-card/80 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <CardHeader className="text-center space-y-4 pt-10 pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center rotate-3 border border-primary/20 shadow-inner">
            <ShieldCheck className="text-primary w-8 h-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold uppercase tracking-tighter text-gradient-primary">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Please sign in to manage your shop
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="sallahdinimillou@gmail.com"
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
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
                  Authenticating...
                </span>
              ) : "Sign In"}
            </Button>

            <Button variant="ghost" className="w-full h-10 rounded-xl text-muted-foreground" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Homepage
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
