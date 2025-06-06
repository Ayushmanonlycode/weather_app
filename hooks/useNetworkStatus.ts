'use client';

import { useState, useEffect, useCallback } from 'react';

interface NetworkState {
  isOnline: boolean;
  isReconnecting: boolean;
  networkType: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  downlink: number | null;
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | null;
  rtt: number | null;
  saveData: boolean | null;
}

const DEFAULT_STATE: NetworkState = {
  isOnline: true,
  isReconnecting: false,
  networkType: 'unknown',
  downlink: null,
  effectiveType: null,
  rtt: null,
  saveData: null,
};

export function useNetworkStatus() {
  const [state, setState] = useState<NetworkState>(DEFAULT_STATE);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 1000;

  const updateNetworkInfo = useCallback(() => {
    const connection = (navigator as any).connection;
    if (!connection) {
      setState(prev => ({
        ...prev,
        networkType: 'unknown',
        downlink: null,
        effectiveType: null,
        rtt: null,
        saveData: null,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      networkType: connection.type || 'unknown',
      downlink: connection.downlink,
      effectiveType: connection.effectiveType,
      rtt: connection.rtt,
      saveData: connection.saveData,
    }));
  }, []);

  const handleOnline = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOnline: true,
      isReconnecting: false,
    }));
    setReconnectAttempts(0);
    updateNetworkInfo();
  }, [updateNetworkInfo]);

  const handleOffline = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOnline: false,
      isReconnecting: true,
    }));

    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      setReconnectAttempts(prev => prev + 1);
      setTimeout(() => {
        if (!navigator.onLine) {
          handleOffline();
        } else {
          handleOnline();
        }
      }, RECONNECT_DELAY);
    } else {
      setState(prev => ({
        ...prev,
        isReconnecting: false,
      }));
    }
  }, [reconnectAttempts, handleOnline]);

  const handleConnectionChange = useCallback(() => {
    updateNetworkInfo();
  }, [updateNetworkInfo]);

  useEffect(() => {
    // Set initial state
    setState(prev => ({
      ...prev,
      isOnline: navigator.onLine,
    }));
    updateNetworkInfo();

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [handleOnline, handleOffline, handleConnectionChange, updateNetworkInfo]);

  return state;
} 