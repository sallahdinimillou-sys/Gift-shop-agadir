
"use client"

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { personalizationAssistant, PersonalizationAssistantOutput } from '@/ai/flows/personalization-assistant';
import { Sparkles, Copy, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PersonalizationAIPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PersonalizationAssistantOutput | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    occasion: '',
    recipient: '',
    tone: 'Heartfelt',
    keywords: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const output = await personalizationAssistant(formData);
      setResult(output);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard."
    });
  };

  return (
    <main className="min-h-screen pt-24">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">AI <span className="text-gradient-primary">Personalization</span> Assistant</h1>
            <p className="text-muted-foreground text-lg">Finding the right words for a gift shouldn't be hard. Let our AI help you craft the perfect message.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-white/5 bg-white/5 h-fit">
              <CardHeader>
                <CardTitle>Gift Details</CardTitle>
                <CardDescription>Tell us about the occasion and recipient.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Occasion</Label>
                    <Input 
                      placeholder="e.g., Wedding, Graduation" 
                      required 
                      value={formData.occasion}
                      onChange={e => setFormData({...formData, occasion: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Recipient</Label>
                    <Input 
                      placeholder="e.g., Best Friend, Boss" 
                      required 
                      value={formData.recipient}
                      onChange={e => setFormData({...formData, recipient: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Desired Tone</Label>
                    <Input 
                      placeholder="e.g., Professional, Humorous, Loving" 
                      required 
                      value={formData.tone}
                      onChange={e => setFormData({...formData, tone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Specific Keywords (Optional)</Label>
                    <Textarea 
                      placeholder="e.g., Thank you, Together forever" 
                      value={formData.keywords}
                      onChange={e => setFormData({...formData, keywords: e.target.value})}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 rounded-full h-12">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 w-4 h-4" />}
                    Generate Messages
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {result ? (
                <>
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-lg">Best Suggestion</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-xl font-medium italic">"{result.suggestion}"</p>
                      <Button onClick={() => copyToClipboard(result.suggestion)} variant="secondary" size="sm" className="rounded-full">
                        <Copy className="w-4 h-4 mr-2" /> Copy
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-muted-foreground">Other Variations:</h3>
                    {result.variations.map((v, i) => (
                      <Card key={i} className="border-white/5 bg-white/5">
                        <CardContent className="p-4 flex justify-between items-center gap-4">
                          <p className="flex-1 italic">"{v}"</p>
                          <Button onClick={() => copyToClipboard(v)} variant="ghost" size="icon" className="shrink-0">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl opacity-50">
                  <Sparkles className="w-12 h-12 mb-4 text-primary" />
                  <p>Generated messages will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
