'use client';

import { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getWeatherByCoordinates } from '@/lib/api';

interface LocalDateTime {
  date: string;
  time: string;
  timezone: string;
  offset: string;
  loading: boolean;
  error: string | null;
}

export function useLocalDateTime() {
  const [localDateTime, setLocalDateTime] = useState<LocalDateTime>({
    date: '',
    time: '',
    timezone: '',
    offset: '',
    loading: true,
    error: null
  });

  const { latitude, longitude, loading: isGeoLoading, error: geoError } = useGeolocation();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchLocalTime = async () => {
      if (!latitude || !longitude || isGeoLoading) return;

      try {
        const weatherData = await getWeatherByCoordinates(latitude, longitude);
        if (!weatherData) throw new Error('Failed to fetch local time data');

        // Parse the localtime string from OpenWeather API
        const [dateStr, timeStr] = weatherData.location.localtime.split(' ');
        const localtime = new Date(`${dateStr}T${timeStr}`);
        
        // Get timezone info
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offset = localtime.getTimezoneOffset() / -60; // Convert to positive hours
        const offsetStr = `UTC${offset >= 0 ? '+' : ''}${offset}`;

        setLocalDateTime({
          date: localtime.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          time: localtime.toLocaleTimeString('en-US', { 
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          timezone,
          offset: offsetStr,
          loading: false,
          error: null
        });

        // Update time every second
        timer = setInterval(() => {
          const now = new Date();
          setLocalDateTime(prev => ({
            ...prev,
            time: now.toLocaleTimeString('en-US', { 
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          }));
        }, 1000);

      } catch (error) {
        setLocalDateTime(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch local time'
        }));
      }
    };

    fetchLocalTime();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [latitude, longitude, isGeoLoading]);

  return localDateTime;
} 