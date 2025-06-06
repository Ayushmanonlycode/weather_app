import { WeatherData } from '@/types';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo_key';
console.log('API Key being used:', WEATHER_API_KEY); // Debug log
const BASE_URL = 'https://api.openweathermap.org';

export interface CitySuggestion {
  name: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
}

export async function getCitySuggestions(query: string): Promise<CitySuggestion[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      const error = await response.json();
       console.error('Error fetching city suggestions:', error);
       return []; // Return empty array on error
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
    console.error('Error fetching city suggestions:', error);
    return [];
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
       throw new Error(error.message || 'Failed to fetch weather data. Please try again.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error; // Re-throw to handle in the hook
  }
}

export async function getWeatherByLocation(
  location: string
): Promise<WeatherData | null> {
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
            locationName = `${geoData[0].name}, ${geoData[0].country}`;
             if (geoData[0].state) {
                 locationName = `${geoData[0].name}, ${geoData[0].state}, ${geoData[0].country}`;
             }
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
      .slice(0, 5) // Only take first 5 days
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

         return {
            date: day,
            day: {
               maxtemp_c: Math.max(...items.map((item: any) => item.main.temp_max)),
               maxtemp_f: Math.max(...items.map((item: any) => item.main.temp_max * 9/5 + 32)),
               mintemp_c: Math.min(...items.map((item: any) => item.main.temp_min)),
               mintemp_f: Math.min(...items.map((item: any) => item.main.temp_min * 9/5 + 32)),
               avgtemp_c: items.reduce((sum: number, item: any) => sum + item.main.temp, 0) / items.length,
               avgtemp_f: items.reduce((sum: number, item: any) => sum + (item.main.temp * 9/5 + 32), 0) / items.length,
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
               temp_f: item.main.temp * 9/5 + 32,
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
         temp_f: currentWeatherItem.main.temp * 9/5 + 32,
         condition: {
            text: currentWeatherItem.weather[0].description,
            icon: currentWeatherItem.weather[0].icon,
            code: currentWeatherItem.weather[0].id,
         },
         wind_kph: currentWeatherItem.wind.speed * 3.6,
         wind_mph: currentWeatherItem.wind.speed * 2.237,
         wind_dir: getWindDirection(currentWeatherItem.wind.deg),
         pressure_mb: currentWeatherItem.main.pressure,
         precip_mm: currentWeatherItem.rain?.['3h'] || 0,
         humidity: currentWeatherItem.main.humidity,
         cloud: currentWeatherItem.clouds.all,
         feelslike_c: currentWeatherItem.main.feels_like,
         feelslike_f: currentWeatherItem.main.feels_like * 9/5 + 32,
         uv: 0,
         gust_kph: currentWeatherItem.wind.gust * 3.6,
         gust_mph: currentWeatherItem.wind.gust * 2.237,
         visibility_km: currentWeatherItem.visibility / 1000,
      },
      forecast: daily,
   };
}