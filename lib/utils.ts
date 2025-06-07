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
  // Map OpenWeatherMap condition codes to Lucide icons
  const codeMap: Record<number, string> = {
    // Clear
    800: 'sun', // Clear sky
    
    // Clouds
    801: 'cloud-sun', // Few clouds
    802: 'cloud-sun', // Scattered clouds
    803: 'cloud', // Broken clouds
    804: 'cloud', // Overcast clouds
    
    // Atmosphere
    701: 'cloud-fog', // Mist
    711: 'cloud-fog', // Smoke
    721: 'cloud-fog', // Haze
    731: 'cloud-fog', // Dust
    741: 'cloud-fog', // Fog
    751: 'cloud-fog', // Sand
    761: 'cloud-fog', // Dust
    762: 'cloud-fog', // Ash
    771: 'cloud-fog', // Squall
    781: 'cloud-fog', // Tornado
    
    // Rain
    300: 'cloud-drizzle', // Light intensity drizzle
    301: 'cloud-drizzle', // Drizzle
    302: 'cloud-drizzle', // Heavy intensity drizzle
    310: 'cloud-drizzle', // Light intensity drizzle rain
    311: 'cloud-drizzle', // Drizzle rain
    312: 'cloud-drizzle', // Heavy intensity drizzle rain
    313: 'cloud-drizzle', // Shower rain and drizzle
    314: 'cloud-drizzle', // Heavy shower rain and drizzle
    321: 'cloud-drizzle', // Shower drizzle
    500: 'cloud-drizzle', // Light rain
    501: 'cloud-rain', // Moderate rain
    502: 'cloud-rain', // Heavy intensity rain
    503: 'cloud-rain', // Very heavy rain
    504: 'cloud-rain', // Extreme rain
    511: 'cloud-snow', // Freezing rain
    520: 'cloud-drizzle', // Light intensity shower rain
    521: 'cloud-rain', // Shower rain
    522: 'cloud-rain', // Heavy intensity shower rain
    531: 'cloud-rain', // Ragged shower rain
    
    // Snow
    600: 'cloud-snow', // Light snow
    601: 'cloud-snow', // Snow
    602: 'cloud-snow', // Heavy snow
    611: 'cloud-snow', // Sleet
    612: 'cloud-snow', // Light shower sleet
    613: 'cloud-snow', // Shower sleet
    615: 'cloud-snow', // Light rain and snow
    616: 'cloud-snow', // Rain and snow
    620: 'cloud-snow', // Light shower snow
    621: 'cloud-snow', // Shower snow
    622: 'cloud-snow', // Heavy shower snow
    
    // Thunderstorm
    200: 'cloud-lightning', // Thunderstorm with light rain
    201: 'cloud-lightning', // Thunderstorm with rain
    202: 'cloud-lightning', // Thunderstorm with heavy rain
    210: 'cloud-lightning', // Light thunderstorm
    211: 'cloud-lightning', // Thunderstorm
    212: 'cloud-lightning', // Heavy thunderstorm
    221: 'cloud-lightning', // Ragged thunderstorm
    230: 'cloud-lightning', // Thunderstorm with light drizzle
    231: 'cloud-lightning', // Thunderstorm with drizzle
    232: 'cloud-lightning', // Thunderstorm with heavy drizzle
  };
  
  return codeMap[code] || 'cloud-question';
}

export function getWeatherBackground(code: number): string {
  // Clear
  if (code === 800) {
    return 'bg-gradient-to-br from-blue-400 to-blue-600';
  }
  
  // Partly cloudy
  if ([801, 802].includes(code)) {
    return 'bg-gradient-to-br from-blue-300 to-blue-500';
  }
  
  // Cloudy/Overcast
  if ([803, 804].includes(code)) {
    return 'bg-gradient-to-br from-gray-300 to-gray-500';
  }
  
  // Rain/Drizzle
  if ([300, 301, 302, 310, 311, 312, 313, 314, 321, 500, 501, 502, 503, 504, 511, 520, 521, 522, 531].includes(code)) {
    return 'bg-gradient-to-br from-blue-500 to-blue-700';
  }
  
  // Snow
  if ([600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622].includes(code)) {
    return 'bg-gradient-to-br from-blue-200 to-blue-400';
  }
  
  // Thunderstorm
  if ([200, 201, 202, 210, 211, 212, 221, 230, 231, 232].includes(code)) {
    return 'bg-gradient-to-br from-gray-600 to-gray-800';
  }
  
  // Atmosphere (Mist, Fog, etc.)
  if ([701, 711, 721, 731, 741, 751, 761, 762, 771, 781].includes(code)) {
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