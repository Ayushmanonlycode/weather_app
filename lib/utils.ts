import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { UserPreferences } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatStr: string = 'EEEE, MMMM d'): string {
  return format(new Date(date), formatStr);
}

export function formatTime(dateTimeString: string, formatStr: string = 'h:mm a'): string {
  const date = new Date(dateTimeString);
  return format(date, formatStr);
}

export function getWeatherIcon(code: number): string {
  // Map WeatherAPI condition codes to more descriptive icon names for use with Lucide icons
  const codeMap: Record<number, string> = {
    1000: 'sun', // Sunny
    1003: 'cloud-sun', // Partly cloudy
    1006: 'cloud', // Cloudy
    1009: 'cloud', // Overcast
    1030: 'cloud-fog', // Mist
    1063: 'cloud-drizzle', // Patchy rain possible
    1066: 'cloud-snow', // Patchy snow possible
    1069: 'cloud-hail', // Patchy sleet possible
    1072: 'cloud-drizzle', // Patchy freezing drizzle possible
    1087: 'cloud-lightning', // Thundery outbreaks possible
    1114: 'wind-snow', // Blowing snow
    1117: 'snowflake', // Blizzard
    1135: 'cloud-fog', // Fog
    1147: 'cloud-fog', // Freezing fog
    1150: 'cloud-drizzle', // Patchy light drizzle
    1153: 'cloud-drizzle', // Light drizzle
    1168: 'cloud-drizzle', // Freezing drizzle
    1171: 'cloud-rain', // Heavy freezing drizzle
    1180: 'cloud-drizzle', // Patchy light rain
    1183: 'cloud-rain', // Light rain
    1186: 'cloud-rain', // Moderate rain at times
    1189: 'cloud-rain', // Moderate rain
    1192: 'cloud-rain', // Heavy rain at times
    1195: 'cloud-rain', // Heavy rain
    1198: 'cloud-snow', // Light freezing rain
    1201: 'cloud-snow', // Moderate or heavy freezing rain
    1204: 'cloud-snow', // Light sleet
    1207: 'cloud-snow', // Moderate or heavy sleet
    1210: 'cloud-snow', // Patchy light snow
    1213: 'cloud-snow', // Light snow
    1216: 'cloud-snow', // Patchy moderate snow
    1219: 'cloud-snow', // Moderate snow
    1222: 'cloud-snow', // Patchy heavy snow
    1225: 'cloud-snow', // Heavy snow
    1237: 'cloud-hail', // Ice pellets
    1240: 'cloud-drizzle', // Light rain shower
    1243: 'cloud-rain', // Moderate or heavy rain shower
    1246: 'cloud-rain', // Torrential rain shower
    1249: 'cloud-hail', // Light sleet showers
    1252: 'cloud-hail', // Moderate or heavy sleet showers
    1255: 'cloud-snow', // Light snow showers
    1258: 'cloud-snow', // Moderate or heavy snow showers
    1261: 'cloud-hail', // Light showers of ice pellets
    1264: 'cloud-hail', // Moderate or heavy showers of ice pellets
    1273: 'cloud-lightning', // Patchy light rain with thunder
    1276: 'cloud-lightning', // Moderate or heavy rain with thunder
    1279: 'cloud-lightning', // Patchy light snow with thunder
    1282: 'cloud-lightning', // Moderate or heavy snow with thunder
  };
  
  return codeMap[code] || 'cloud-question';
}

export function getWeatherBackground(code: number): string {
  // Clear/Sunny
  if (code === 1000) {
    return 'bg-gradient-to-br from-blue-400 to-blue-600';
  }
  // Partly cloudy
  if (code === 1003) {
    return 'bg-gradient-to-br from-blue-300 to-blue-500';
  }
  // Cloudy/Overcast
  if ([1006, 1009].includes(code)) {
    return 'bg-gradient-to-br from-gray-300 to-gray-500';
  }
  // Rain/Drizzle
  if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) {
    return 'bg-gradient-to-br from-blue-500 to-blue-700';
  }
  // Snow
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) {
    return 'bg-gradient-to-br from-blue-200 to-blue-400';
  }
  // Thunderstorm
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    return 'bg-gradient-to-br from-gray-600 to-gray-800';
  }
  // Fog/Mist
  if ([1030, 1135, 1147].includes(code)) {
    return 'bg-gradient-to-br from-gray-400 to-gray-600';
  }
  // Default
  return 'bg-gradient-to-br from-blue-400 to-blue-600';
}

// Debounce function for search input
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}