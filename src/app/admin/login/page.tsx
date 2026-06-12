
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isLoading: userLoading } = useUser();

  useEffect(() => {
    if (!userLoading && user) {
      router.push('/admin');
    }
  }, [user, userLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Welcome back!", description: "Logged in successfully." });
      router.push('/admin');
    } catch (error: any) {
      console.error(error);
      toast({ 
        title: "Login failed", 
        description: error.message || "Invalid credentials.", 
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
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-white/5 bg-card/80 backdrop-blur-xl shadow-2xl rounded-3xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Lock className="text-primary w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold uppercase tracking-tighter text-gradient-primary">
            Gift Shop Agadir
          </CardTitle>
          <CardDescription>Administrator Control Center</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@giftshopagadir.com" 
                  className="pl-10 h-12 rounded-xl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10 h-12 rounded-xl"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl font-bold" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Sign In to Dashboard"}
            </Button>
          </form>
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-muted-foreground">Authorized personnel only. All access attempts are logged.</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
