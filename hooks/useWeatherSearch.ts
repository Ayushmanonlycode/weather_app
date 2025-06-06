'use client';

import { useState, useEffect, useCallback } from 'react';
import { getWeatherByLocation, getWeatherByCoordinates } from '@/lib/api';
import { WeatherData } from '@/types';
import { debounce } from '@/lib/utils';

export function useWeatherSearch(defaultLocation: string = 'New York') {
  const [location, setLocation] = useState(defaultLocation);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (searchLocation: string) => {
    if (!searchLocation.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getWeatherByLocation(searchLocation);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    
    try {
      const data = await getWeatherByCoordinates(lat, lon);
      if (data) {
        setWeather(data);
        setLocation(data.location.name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get weather for your location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
  };
}