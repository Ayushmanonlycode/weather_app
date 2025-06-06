'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

/**
 * OfflineAlert component that displays a warning when the user is offline
 * Features:
 * - Destructive variant styling
 * - WifiOff icon
 * - Animated entrance
 * - Informative message about mock data
 */
export function OfflineAlert() {
  return (
    <Alert variant="destructive" className="animate-in fade-in-50 duration-300">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="ml-2">
        You are currently offline. This is just mock data. Please enable internet to get real-time weather updates.
      </AlertDescription>
    </Alert>
  );
} 