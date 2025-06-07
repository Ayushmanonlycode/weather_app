'use client';

import { FC, useEffect, useState } from 'react';
import { useWeatherSearch } from '@/hooks/useWeatherSearch';
import { CurrentWeather } from '@/components/weather/current-weather';
import { ForecastDetail } from '@/components/weather/forecast-detail';
import { WeatherSearch } from '@/components/weather/weather-search';
import { TemperatureUnitToggle } from '@/components/ui/temperature-unit-toggle';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { OfflineAlert } from '@/components/ui/offline-alert';
import { ForecastDayCard } from '@/components/weather/forecast-day-card';
import { LocalDateTime } from '@/components/ui/local-datetime';

export const WeatherApp: FC = () => {
  const [location, setLocation] = useState('');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const { isOnline } = useNetworkStatus();
  const { 
    weather, 
    isLoading, 
    error, 
    handleLocationChange, 
    fetchWeatherByCoords 
  } = useWeatherSearch();
  const { 
    latitude,
    longitude,
    loading: isGeoLoading,
    error: geoError,
    permissionDenied
  } = useGeolocation();
  
  // Update location when weather data changes
  useEffect(() => {
    if (weather?.location?.name) {
      setLocation(weather.location.name);
    }
  }, [weather]);

  // Get weather for user's location on initial load if geolocation is available
  useEffect(() => {
    if (latitude && longitude && !isGeoLoading && !geoError && isOnline) {
      fetchWeatherByCoords(latitude, longitude);
    }
  }, [latitude, longitude, isGeoLoading, geoError, fetchWeatherByCoords, isOnline]);

  // Show error toast if geolocation fails
  useEffect(() => {
    if (geoError && !isGeoLoading) {
      toast(geoError, {
        description: permissionDenied ? 'Please allow location access in your browser settings' : undefined,
        duration: permissionDenied ? 10000 : 5000,
      });
    }
  }, [geoError, isGeoLoading, permissionDenied]);

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
    <div className="h-screen flex flex-col">
      <div className="flex-none p-4 md:pl-2 md:pr-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex  items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Weather Forecast</h1>
              <p className="text-muted-foreground text-white">
                {permissionDenied 
                  ? 'Please allow location access or search for a location'
                  : 'Getting weather for your location...'}
              </p>
            </div>
            <LocalDateTime />
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
      </div>
      
      {!isOnline && <OfflineAlert />}
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:pl-2 md:pr-6 overflow-hidden">
        {/* Left Column - Search and Tiles */}
        <div className="space-y-4 overflow-y-auto">
          <WeatherSearch
            location={location}
            onLocationChange={handleLocationChange}
            onUseCurrentLocation={fetchWeatherByCoords}
            disabled={!isOnline}
          />
          
          {isLoading && (
            <div className="flex justify-center items-center py-8">
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
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              <CurrentWeather 
                current={weather.current} 
                location={weather.location} 
              />
              
              {/* Day Forecast Cards - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-4">
                {weather.forecast.slice(1, 5).map((day, index) => (
                  <ForecastDayCard
                    key={day.date}
                    forecast={day}
                    isSelected={index + 1 === selectedDayIndex}
                    onClick={() => setSelectedDayIndex(index + 1)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Only Graphs */}
        <div className="space-y-4 overflow-y-auto">
          {weather && !isLoading && (
            <ForecastDetail 
              forecast={weather.forecast} 
              selectedDayIndex={selectedDayIndex}
              onDaySelect={setSelectedDayIndex}
            />
          )}
        </div>
      </div>
    </div>
  );
};