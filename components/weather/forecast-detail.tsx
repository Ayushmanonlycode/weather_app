'use client';

import { FC, useState } from 'react';
import { ForecastDay } from '@/types';
import { ForecastDayCard } from '@/components/weather/forecast-day-card';
import { ForecastChart } from '@/components/weather/forecast-chart';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ForecastDetailProps {
  forecast: ForecastDay[];
  selectedDayIndex: number;
  onDaySelect: (index: number) => void;
}

export const ForecastDetail: FC<ForecastDetailProps> = ({ 
  forecast,
  selectedDayIndex,
  onDaySelect
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { preferences } = useUserPreferences();
  const isMetric = preferences.temperatureUnit === 'celsius';
  const tempUnit = isMetric ? '°C' : '°F';

  // Prepare data for the 5-day trend chart
  const dailyChartData = forecast.map(day => ({
    date: formatDate(day.date, 'EEE'), // Format date for chart axis (e.g., Mon)
    minTemp: isMetric ? day.day.mintemp_c : day.day.mintemp_f,
    maxTemp: isMetric ? day.day.maxtemp_c : day.day.maxtemp_f,
  }));

  // Get hourly data for the selected day
  const selectedDayHourlyData = forecast[selectedDayIndex]?.hour || [];

  // Handle day selection with loading state
  const handleDaySelect = (index: number) => {
    setIsLoading(true);
    onDaySelect(index);
    // Simulate a small delay for smooth transition
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="space-y-6">
      {/* 5-Day Temperature Trend Chart */}
      <div className="w-full h-[300px] bg-background rounded-md p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Temperature Trend (5 Days)</h3>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={dailyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `${value}${tempUnit}`} 
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                fontSize: 12,
              }}
              labelStyle={{ fontWeight: 'bold', fill: "hsl(var(--foreground))" }}
              itemStyle={{ fill: "hsl(var(--foreground))" }}
              formatter={(value: number) => `${value}${tempUnit}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="maxTemp" 
              name={`Max Temp (${tempUnit})`} 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="minTemp" 
              name={`Min Temp (${tempUnit})`} 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Forecast Chart for Selected Day */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {selectedDayHourlyData.length > 0 && (
          <ForecastChart 
            hourlyData={selectedDayHourlyData} 
            title={`Hourly Forecast for ${formatDate(forecast[selectedDayIndex].date, 'EEEE, MMM d')}`} 
          />
        )}
      </div>
    </div>
  );
};