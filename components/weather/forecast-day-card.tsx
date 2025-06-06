'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ForecastDay } from '@/types';
import { WeatherIcon } from '@/components/weather/weather-icon';
import { Droplets } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ForecastDayCardProps {
  forecast: ForecastDay;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ForecastDayCard: FC<ForecastDayCardProps> = ({ 
  forecast, 
  isSelected = false,
  onClick
}) => {
  const { preferences } = useUserPreferences();
  const isMetric = preferences.temperatureUnit === 'celsius';
  
  const minTemp = Math.round(isMetric ? forecast.day.mintemp_c : forecast.day.mintemp_f);
  const maxTemp = Math.round(isMetric ? forecast.day.maxtemp_c : forecast.day.maxtemp_f);
  const tempUnit = isMetric ? '°C' : '°F';
  
  const formattedDate = formatDate(forecast.date);
  
  const rainChance = forecast.day.daily_chance_of_rain;
  const snowChance = forecast.day.daily_chance_of_snow;
  const precipChance = Math.max(rainChance, snowChance);
  const precipType = snowChance > rainChance ? 'snow' : 'rain';
  
  return (
    <Card 
      className={`cursor-pointer hover:bg-accent transition-colors ${
        isSelected ? 'border-primary bg-accent' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h3 className="font-medium text-center">{formattedDate}</h3>
        
        <div className="flex justify-center my-2">
          <WeatherIcon code={forecast.day.condition.code} size={36} />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{forecast.day.condition.text}</p>
          <p className="font-semibold mt-1">
            <span>{maxTemp}{tempUnit}</span>
            <span className="mx-1 text-muted-foreground">/</span>
            <span className="text-muted-foreground">{minTemp}{tempUnit}</span>
          </p>
        </div>
        
        {precipChance > 0 && (
          <div className="flex items-center justify-center mt-2 text-sm">
            <Droplets className="h-3 w-3 mr-1" />
            <span>{precipChance}% {precipType}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};