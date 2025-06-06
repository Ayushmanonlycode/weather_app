'use client';

import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
  accuracy: number | null;
  lastUpdated: number | null;
  watching: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  retryCount?: number;
  retryDelay?: number;
}

const DEFAULT_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 30000,
  retryCount: 3,
  retryDelay: 2000,
};

export function useGeolocation(options: GeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    permissionDenied: false,
    accuracy: null,
    lastUpdated: null,
    watching: false,
  });

  const [watchId, setWatchId] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      error: null,
      loading: false,
      permissionDenied: false,
      accuracy: position.coords.accuracy,
      lastUpdated: position.timestamp,
      watching: !!watchId,
    });
    setRetryCount(0);
  }, [watchId]);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Unable to get your location';
    let permissionDenied = false;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Please allow location access to see weather for your area';
        permissionDenied = true;
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable. Please check your GPS settings.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out. Please check your GPS signal and try again.';
        break;
      default:
        errorMessage = 'An unknown error occurred while getting your location.';
        break;
    }

    setState(prev => ({
      ...prev,
      error: errorMessage,
      loading: false,
      permissionDenied,
    }));

    // Retry logic with exponential backoff
    if (retryCount < (mergedOptions.retryCount || 0)) {
      setRetryCount(prev => prev + 1);
      const baseDelay = mergedOptions.retryDelay || 2000; // Default to 2000ms if not specified
      const delay = baseDelay * Math.pow(2, retryCount);
      setTimeout(() => {
        setState(prev => ({ ...prev, loading: true }));
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          handleError,
          mergedOptions
        );
      }, delay);
    }
  }, [mergedOptions, retryCount, handleSuccess]);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }

    const id = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      mergedOptions
    );

    setWatchId(id);
    setState(prev => ({ ...prev, watching: true }));
  }, [mergedOptions, handleSuccess, handleError, watchId]);

  const stopWatching = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setState(prev => ({ ...prev, watching: false }));
    }
  }, [watchId]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      mergedOptions
    );

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [mergedOptions, handleSuccess, handleError, watchId]);

  return {
    ...state,
    startWatching,
    stopWatching,
    retryCount,
  };
}