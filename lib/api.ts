import { WeatherData } from '@/types';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo_key';
const BASE_URL = 'https://api.openweathermap.org';

export interface CitySuggestion {
  name: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
}

// Utility function for temperature conversion
function celsiusToFahrenheit(celsius: number): number {
  return celsius * 9/5 + 32;
}

function handleApiError(error: unknown, context: string): never {
  console.error(`Error ${context}:`, error);
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  throw new Error(`An unexpected error occurred while ${context}`);
}

export async function getCitySuggestions(query: string): Promise<CitySuggestion[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch city suggestions');
    }

    const data = await response.json();
    return data.map((city: any) => ({
      name: city.name,
      country: city.country,
      region: city.state || '',
      lat: city.lat,
      lon: city.lon,
    }));
  } catch (error) {
    handleApiError(error, 'fetch city suggestions');
  }
}

async function fetchWeatherByCoordsInternal(
  lat: number,
  lon: number
): Promise<any> {
  try {
    const response = await fetch(
      `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch weather data');
    }

    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    handleApiError(error, 'fetch weather data');
  }
}

export async function getWeatherByLocation(
  location: string
): Promise<WeatherData | null> {
  // Check if input is a ZIP code (any length of numbers)
  const isZipCode = /^\d+$/.test(location);
  
  if (isZipCode) {
    try {
      // Try with IN (India) first for 6-digit codes
      if (location.length === 6) {
        const response = await fetch(
          `${BASE_URL}/data/2.5/forecast?zip=${location},IN&appid=${WEATHER_API_KEY}&units=metric`
        );

        if (response.ok) {
          const weatherData = await response.json();
          return transformOpenWeatherResponse(weatherData, { 
            name: weatherData.city.name, 
            country: weatherData.city.country, 
            region: '' 
          });
        }
      }

      // Try with US for 5-digit codes
      if (location.length === 5) {
        const response = await fetch(
          `${BASE_URL}/data/2.5/forecast?zip=${location},US&appid=${WEATHER_API_KEY}&units=metric`
        );

        if (response.ok) {
          const weatherData = await response.json();
          return transformOpenWeatherResponse(weatherData, { 
            name: weatherData.city.name, 
            country: weatherData.city.country, 
            region: '' 
          });
        }
      }

      // If all attempts fail, try city search
      const suggestions = await getCitySuggestions(location);
      if (suggestions && suggestions.length > 0) {
        const { name, country, region } = suggestions[0];
        const weatherData = await fetchWeatherByCoordsInternal(suggestions[0].lat, suggestions[0].lon);
        return transformOpenWeatherResponse(weatherData, { name, country, region });
      }

      throw new Error(`Location not found: ${location}. Please check the spelling and try again.`);
    } catch (error) {
      handleApiError(error, 'fetch weather data for ZIP code');
    }
  }

  // If not a ZIP code, proceed with city search
  const suggestions = await getCitySuggestions(location);
  
  if (!suggestions || suggestions.length === 0) {
    throw new Error(`Location not found: ${location}. Please check the spelling and try again.`);
  }
  
  const { name, country, region } = suggestions[0];
  const weatherData = await fetchWeatherByCoordsInternal(suggestions[0].lat, suggestions[0].lon);

  return transformOpenWeatherResponse(weatherData, { name, country, region });
}

export async function getWeatherByCoordinates(
  lat: number,
  lon: number
): Promise<WeatherData | null> {
  let locationName = 'Unknown Location';
  try {
    const geoResponse = await fetch(
      `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`
    );
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      if (geoData && geoData.length > 0) {
        locationName = geoData[0].state
          ? `${geoData[0].name}, ${geoData[0].state}, ${geoData[0].country}`
          : `${geoData[0].name}, ${geoData[0].country}`;
      }
    }
  } catch (error) {
    console.error('Error fetching location name for coordinates:', error);
  }

  const weatherData = await fetchWeatherByCoordsInternal(lat, lon);
  return transformOpenWeatherResponse(weatherData, { name: locationName, country: '', region: '' });
}

// Helper function to convert wind degrees to cardinal directions
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
  return directions[index];
}

// Function to transform OpenWeatherMap API response to the WeatherData interface
function transformOpenWeatherResponse(apiData: any, locationInfo: { name: string, country: string, region: string }): WeatherData {
  console.log('Raw API response:', apiData);
  
  // Group data by day
  const dailyData = new Map<string, any[]>();
  apiData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0];
    if (!dailyData.has(day)) {
      dailyData.set(day, []);
    }
    dailyData.get(day)?.push(item);
  });

  // Create daily forecast (5 days)
  const daily = Array.from(dailyData.entries())
    .slice(0, 5)
    .map(([day, items]) => {
      // Find the item closest to noon for the day's forecast
      const noonItem = items.reduce((closest, current) => {
        const currentHour = new Date(current.dt * 1000).getHours();
        const closestHour = new Date(closest.dt * 1000).getHours();
        return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
      });

      // Get the most common weather condition for the day
      const weatherCounts = new Map<number, number>();
      items.forEach((item: any) => {
        const code = item.weather[0].id;
        weatherCounts.set(code, (weatherCounts.get(code) || 0) + 1);
      });
      const representativeCondition = Array.from(weatherCounts.entries())
        .sort((a, b) => b[1] - a[1])[0][0];

      console.log('Day forecast condition code:', representativeCondition);

      const maxTempC = Math.max(...items.map((item: any) => item.main.temp_max));
      const minTempC = Math.min(...items.map((item: any) => item.main.temp_min));
      const avgTempC = items.reduce((sum: number, item: any) => sum + item.main.temp, 0) / items.length;

      return {
        date: day,
        day: {
          maxtemp_c: maxTempC,
          maxtemp_f: celsiusToFahrenheit(maxTempC),
          mintemp_c: minTempC,
          mintemp_f: celsiusToFahrenheit(minTempC),
          avgtemp_c: avgTempC,
          avgtemp_f: celsiusToFahrenheit(avgTempC),
          condition: {
            text: noonItem.weather[0].description,
            icon: noonItem.weather[0].icon,
            code: representativeCondition,
          },
          daily_chance_of_rain: Math.round(
            items.reduce((sum: number, item: any) => sum + (item.pop * 100), 0) / items.length
          ),
          daily_chance_of_snow: 0,
        },
        hour: items.map((item: any) => ({
          time: new Date(item.dt * 1000).toISOString(),
          temp_c: item.main.temp,
          temp_f: celsiusToFahrenheit(item.main.temp),
          condition: {
            text: item.weather[0].description,
            icon: item.weather[0].icon,
            code: item.weather[0].id,
          },
          chance_of_rain: Math.round(item.pop * 100),
        })),
      };
    });
 
  const currentWeatherItem = apiData.list[0];
  console.log('Current weather condition code:', currentWeatherItem.weather[0].id);
  
  return {
    location: {
      name: locationInfo.name,
      region: locationInfo.region,
      country: locationInfo.country,
      lat: apiData.city.coord.lat,
      lon: apiData.city.coord.lon,
      localtime: new Date(currentWeatherItem.dt * 1000).toISOString().replace('T', ' ').substring(0, 16),
    },
    current: {
      temp_c: currentWeatherItem.main.temp,
      temp_f: celsiusToFahrenheit(currentWeatherItem.main.temp),
      condition: {
        text: currentWeatherItem.weather[0].description,
        icon: currentWeatherItem.weather[0].icon,
        code: currentWeatherItem.weather[0].id,
      },
      wind_kph: currentWeatherItem.wind.speed * 3.6,
      wind_mph: currentWeatherItem.wind.speed * 2.237,
      wind_dir: getWindDirection(currentWeatherItem.wind.deg),
      humidity: currentWeatherItem.main.humidity,
      feelslike_c: currentWeatherItem.main.feels_like,
      feelslike_f: celsiusToFahrenheit(currentWeatherItem.main.feels_like),
      pressure_mb: currentWeatherItem.main.pressure,
      visibility_km: currentWeatherItem.visibility / 1000,
      precip_mm: currentWeatherItem.rain?.['3h'] || 0,
      cloud: currentWeatherItem.clouds.all,
      gust_kph: currentWeatherItem.wind.gust ? currentWeatherItem.wind.gust * 3.6 : 0,
      gust_mph: currentWeatherItem.wind.gust ? currentWeatherItem.wind.gust * 2.237 : 0,
    },
    forecast: daily,
  };
}