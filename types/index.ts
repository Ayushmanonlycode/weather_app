export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  forecast: ForecastDay[];
}

export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  localtime: string;
}

export interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  condition: WeatherCondition;
  wind_kph: number;
  wind_mph: number;
  wind_dir: string;
  humidity: number;
  feelslike_c: number;
  feelslike_f: number;
  uv: number;
  pressure_mb: number;
  visibility_km: number;
  precip_mm: number;
  cloud: number;
  gust_kph: number;
  gust_mph: number;
}

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    condition: WeatherCondition;
    daily_chance_of_rain: number;
    daily_chance_of_snow: number;
  };
  hour: HourForecast[];
}

export interface HourForecast {
  time: string;
  temp_c: number;
  temp_f: number;
  condition: WeatherCondition;
  chance_of_rain: number;
}

export interface UserPreferences {
  tempUnit: 'celsius' | 'fahrenheit';
  favoriteLocations: string[];
  theme: 'light' | 'dark' | 'system';
}