'use client';

import { FC, useEffect } from 'react';
import { useWeatherSearch } from '@/hooks/useWeatherSearch';
import { CurrentWeather } from '@/components/weather/current-weather';
import { ForecastDetail } from '@/components/weather/forecast-detail';
import { WeatherSearch } from '@/components/weather/weather-search';
import { TemperatureUnitToggle } from '@/components/ui/temperature-unit-toggle';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OfflineAlert } from '@/components/ui/offline-alert';
import { WeatherData } from '@/types';

export const WeatherApp: FC = () => {
  const { 
    location, 
    weather, 
    isLoading, 
    error, 
    handleLocationChange, 
    fetchWeatherByCoords 
  } = useWeatherSearch();
  
  const { latitude, longitude, loading: geoLoading, error: geoError, permissionDenied } = useGeolocation();
  const { toast } = useToast();
  const isOnline = useNetworkStatus();
  
  // Get weather for user's location on initial load if geolocation is available
  useEffect(() => {
    if (latitude && longitude && !geoLoading && !geoError && isOnline) {
      fetchWeatherByCoords(latitude, longitude);
    }
  }, [latitude, longitude, geoLoading, geoError, fetchWeatherByCoords, isOnline]);
  
  // Show error toast if geolocation fails
  useEffect(() => {
    if (geoError && !geoLoading) {
      toast({
        title: 'Location Access',
        description: geoError,
        variant: permissionDenied ? 'default' : 'destructive',
        duration: permissionDenied ? 10000 : 5000,
      });
    }
  }, [geoError, geoLoading, toast, permissionDenied]);

  const handleRetryLocation = () => {
    if (latitude && longitude && isOnline) {
      fetchWeatherByCoords(latitude, longitude);
    }
  };

  const handleDownload = () => {
    if (!weather) return;
    
    const dataStr = JSON.stringify(weather, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `weather-data-${weather.location.name}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Weather Forecast</h1>
          <p className="text-muted-foreground text-white">
            {permissionDenied 
              ? 'Please allow location access or search for a location'
              : 'Getting weather for your location...'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <TemperatureUnitToggle />
          <ThemeToggle />
          {weather && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              title="Download Weather Data"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {!isOnline && <OfflineAlert />}
      
      <WeatherSearch
        location={location}
        onLocationChange={handleLocationChange}
        onUseCurrentLocation={fetchWeatherByCoords}
        disabled={!isOnline}
      />
      
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {permissionDenied && !weather && !isLoading && (
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <span>Please allow location access to see weather for your area</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryLocation}
              className="ml-4"
              disabled={!isOnline}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {weather && !isLoading && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <CurrentWeather 
            current={weather.current} 
            location={weather.location} 
          />
          
          <ForecastDetail forecast={weather.forecast} />
        </div>
      )}
    </div>
  );
};