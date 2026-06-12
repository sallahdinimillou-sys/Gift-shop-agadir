
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In production, you might want to log this to a service like Sentry
      // For development, we show a toast with the context
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: `You don't have permission to ${error.context.operation} on ${error.context.path}.`,
      });
      
      // We throw the error so it shows up in the Next.js dev overlay
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
