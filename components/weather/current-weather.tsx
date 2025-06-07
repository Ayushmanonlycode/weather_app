'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CurrentWeather as CurrentWeatherType, Location } from '@/types';
import { WeatherIcon } from '@/components/weather/weather-icon';
import { Droplets, Wind, Thermometer, Eye, Sun, Gauge, Compass, Cloud } from 'lucide-react';
import { cn, formatDate, getWeatherBackground } from '@/lib/utils';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface CurrentWeatherProps {
  current: CurrentWeatherType;
  location: Location;
}

export const CurrentWeather: FC<CurrentWeatherProps> = ({ current, location }) => {
  const { preferences } = useUserPreferences();
  const isMetric = preferences.temperatureUnit === 'celsius';
  
  const temperature = isMetric ? current.temp_c : current.temp_f;
  const feelsLike = isMetric ? current.feelslike_c : current.feelslike_f;
  const windSpeed = isMetric ? current.wind_kph : current.wind_mph;
  const windUnit = isMetric ? 'km/h' : 'mph';
  const tempUnit = isMetric ? '°C' : '°F';
  
  const localTime = new Date(location.localtime);
  const formattedDate = formatDate(location.localtime, 'EEEE, MMMM d, yyyy');
  
  return (
    <Card className={cn(
      "overflow-hidden border-0 shadow-lg",
      getWeatherBackground(current.condition.code)
    )}>
      <CardContent className="p-6 text-foreground">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold flex items-center text-foreground">
              {location.name}
              {location.country !== 'United States of America' && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {location.country}
                </span>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
          
          <div className="flex items-center">
            <WeatherIcon code={current.condition.code} size={64} className="mr-4 text-foreground" />
            <div>
              <div className="text-5xl font-bold text-foreground">{Math.round(temperature)}{tempUnit}</div>
              <p className="text-sm font-semibold text-foreground capitalize">{current.condition.text}</p>
              <p className="text-xs text-muted-foreground">
                {current.condition.code >= 200 && current.condition.code < 300 ? 'Thunderstorm' :
                 current.condition.code >= 300 && current.condition.code < 400 ? 'Drizzle' :
                 current.condition.code >= 500 && current.condition.code < 600 ? 'Rain' :
                 current.condition.code >= 600 && current.condition.code < 700 ? 'Snow' :
                 current.condition.code >= 700 && current.condition.code < 800 ? 'Atmosphere' :
                 current.condition.code === 800 ? 'Clear' :
                 current.condition.code > 800 ? 'Clouds' : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Feels Like</p>
              <p className="font-semibold text-foreground">{feelsLike.toFixed(1)}{tempUnit}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Wind className="h-5 w-5 mr-2 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
              <p className="font-semibold text-foreground">{windSpeed.toFixed(1)} {windUnit}</p>
              <p className="text-xs text-muted-foreground">{current.wind_dir}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Droplets className="h-5 w-5 mr-2 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="font-semibold text-foreground">{current.humidity}%</p>
              <p className="text-xs text-muted-foreground">Relative</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Eye className="h-5 w-5 mr-2 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Visibility</p>
              <p className="font-semibold text-foreground">{current.visibility_km.toFixed(1)} km</p>
              <p className="text-xs text-muted-foreground">Clear</p>
            </div>
          </div>

          <div className="flex items-center">
            <Gauge className="h-5 w-5 mr-2 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Pressure</p>
              <p className="font-semibold text-foreground">{current.pressure_mb.toFixed(1)} mb</p>
              <p className="text-xs text-muted-foreground">
                {current.pressure_mb < 1000 ? 'Low' : 
                 current.pressure_mb < 1013 ? 'Normal' : 'High'}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Compass className="h-5 w-5 mr-2 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Wind Direction</p>
              <p className="font-semibold text-foreground">{current.wind_dir}</p>
              <p className="text-xs text-muted-foreground">
                {current.wind_dir === 'N' ? 'North' :
                 current.wind_dir === 'NE' ? 'Northeast' :
                 current.wind_dir === 'E' ? 'East' :
                 current.wind_dir === 'SE' ? 'Southeast' :
                 current.wind_dir === 'S' ? 'South' :
                 current.wind_dir === 'SW' ? 'Southwest' :
                 current.wind_dir === 'W' ? 'West' :
                 current.wind_dir === 'NW' ? 'Northwest' : 'Variable'}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Cloud className="h-5 w-5 mr-2 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Cloud Coverage</p>
              <p className="font-semibold text-foreground">{current.cloud}%</p>
              <p className="text-xs text-muted-foreground">
                {current.cloud < 25 ? 'Clear' :
                 current.cloud < 50 ? 'Partly Cloudy' :
                 current.cloud < 75 ? 'Mostly Cloudy' : 'Overcast'}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Wind className="h-5 w-5 mr-2 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Wind Gust</p>
              <p className="font-semibold text-foreground">
                {isMetric ? current.gust_kph.toFixed(1) : current.gust_mph.toFixed(1)} {windUnit}
              </p>
              <p className="text-xs text-muted-foreground">
                {current.gust_kph > 50 ? 'Strong' :
                 current.gust_kph > 30 ? 'Moderate' : 'Light'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};