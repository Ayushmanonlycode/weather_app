'use client';

import { useState, useEffect, useCallback } from 'react';
import { getWeatherByLocation, getWeatherByCoordinates } from '@/lib/api';
import { WeatherData } from '@/types';
import { debounce } from '@/lib/utils';

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function useWeatherSearch(defaultLocation: string = 'New York') {
  const [location, setLocation] = useState(defaultLocation);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // In-memory cache
  const cache = new Map<string, CacheEntry>();

  const getCachedWeather = (key: string): WeatherData | null => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return isWeatherData(cached.data) ? cached.data : null;
    }
    cache.delete(key);
    return null;
  };

  const setCachedWeather = (key: string, data: WeatherData) => {
    cache.set(key, { data, timestamp: Date.now() });
  };

  const isWeatherData = (data: any): data is WeatherData => {
    return data && 
           typeof data === 'object' && 
           'location' in data && 
           'current' in data && 
           'forecast' in data;
  };

  const fetchWithRetry = async (
    fetchFn: () => Promise<WeatherData | null>,
    retryKey: string
  ): Promise<WeatherData> => {
    try {
      const data = await fetchFn();
      if (!data || !isWeatherData(data)) {
        throw new Error('Invalid weather data received');
      }
      setCachedWeather(retryKey, data);
      setRetryCount(0);
      return data;
    } catch (err) {
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(fetchFn, retryKey);
      }
      throw err;
    }
  };

  const fetchWeather = useCallback(async (searchLocation: string) => {
    if (!searchLocation.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    const cacheKey = `weather_${searchLocation}`;
    const cachedData = getCachedWeather(cacheKey);
    
    if (cachedData && isWeatherData(cachedData)) {
      setWeather(cachedData as WeatherData);
      setLocation(searchLocation);
      setIsLoading(false);
      return;
    }
    
    try {
      const data = await fetchWithRetry(
        () => getWeatherByLocation(searchLocation),
        cacheKey
      );
      setWeather(data);
      setLocation(searchLocation);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      
      // If we have cached data, keep showing it
      const cachedWeather = getCachedWeather(cacheKey);
      if (cachedWeather && isWeatherData(cachedWeather)) {
        setWeather(cachedWeather as WeatherData);
        setLocation(searchLocation);
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  // Debounced search function
  const debouncedFetchWeather = useCallback(
    debounce((searchLocation: string) => {
      fetchWeather(searchLocation);
    }, 500),
    [fetchWeather]
  );

  // Fetch weather for coordinates
  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    
    const cacheKey = `weather_coords_${lat}_${lon}`;
    const cachedData = getCachedWeather(cacheKey);
    
    if (cachedData && isWeatherData(cachedData)) {
      setWeather(cachedData as WeatherData);
      setLocation((cachedData as WeatherData).location.name);
      setIsLoading(false);
      return;
    }
    
    try {
      const data = await fetchWithRetry(
        async () => {
          const result = await getWeatherByCoordinates(lat, lon);
          if (!result || !isWeatherData(result)) {
            throw new Error('No weather data received');
          }
          return result;
        },
        cacheKey
      );
      setWeather(data);
      setLocation(data.location.name);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to get weather for your location. Please try again.';
      setError(errorMessage);
      
      // If we have cached data, keep showing it
      if (cachedData && isWeatherData(cachedData)) {
        setWeather(cachedData as WeatherData);
        setLocation((cachedData as WeatherData).location.name);
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchWeather(defaultLocation);
  }, [defaultLocation, fetchWeather]);

  // Handle location change
  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    debouncedFetchWeather(newLocation);
  };

  return {
    location,
    weather,
    isLoading,
    error,
    handleLocationChange,
    fetchWeatherByCoords,
    refetch: () => fetchWeather(location),
    retryCount,
  };
}