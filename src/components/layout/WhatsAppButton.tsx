
"use client"

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BUSINESS_INFO } from '@/lib/constants';

export function WhatsAppButton() {
  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello Gift Shop Agadir! I'm interested in your products.");
    window.open(`https://wa.me/${BUSINESS_INFO.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-40 group">
      <div className="absolute -top-12 right-0 bg-white text-navy-black px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-xl whitespace-nowrap pointer-events-none">
        Chat with us!
      </div>
      <Button 
        onClick={openWhatsApp}
        className="w-16 h-16 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl flex items-center justify-center p-0 transition-transform hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-8 h-8 fill-current" />
      </Button>
    </div>
  );
}
