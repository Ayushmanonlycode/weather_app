/**
 * Represents the complete weather data structure returned by the API
 */
export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  forecast: ForecastDay[];
}

/**
 * Represents a geographical location
 */
export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  localtime: string;
}

/**
 * Represents the current weather conditions
 */
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
  pressure_mb: number;
  visibility_km: number;
  precip_mm: number;
  cloud: number;
  gust_kph: number;
  gust_mph: number;
}

/**
 * Represents weather condition information
 */
export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

/**
 * Represents a day's weather forecast
 */
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

/**
 * Represents an hour's weather forecast
 */
export interface HourForecast {
  time: string;
  temp_c: number;
  temp_f: number;
  condition: WeatherCondition;
  chance_of_rain: number;
}

/**
 * Represents user preferences for the application
 */
export interface UserPreferences {
  tempUnit: 'celsius' | 'fahrenheit';
  favoriteLocations: string[];
  theme: 'light' | 'dark' | 'system';
}

/**
 * Represents an API error response
 */
export interface ApiError {
  code: string;
  message: string;
  status: number;
}

/**
 * Type guard to check if an object is a valid WeatherData
 */
export function isWeatherData(data: unknown): data is WeatherData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'location' in data &&
    'current' in data &&
    'forecast' in data
  );
}