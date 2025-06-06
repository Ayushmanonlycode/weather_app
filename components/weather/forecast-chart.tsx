'use client';

import { FC, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HourForecast } from '@/types';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { formatTime } from '@/lib/utils';

interface ForecastChartProps {
  hourlyData: HourForecast[];
  title?: string;
}

interface ChartData {
  time: string;
  temp: number;
  originalTime: string;
}

const CHART_CONFIG = {
  height: 300,
  margin: { top: 10, right: 30, bottom: 20, left: 10 },
  area: {
    strokeWidth: 2,
    dotRadius: 3,
    activeDotRadius: 5,
  },
  axis: {
    fontSize: 11,
    padding: { left: 5, right: 5, top: 5, bottom: 5 },
  },
} as const;

const CustomTooltip = ({ active, payload, label, isMetric }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 border rounded-lg shadow-lg">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-primary font-semibold">{`${payload[0].value}${isMetric ? '°C' : '°F'}`}</p>
      </div>
    );
  }
  return null;
};

export const ForecastChart: FC<ForecastChartProps> = ({ hourlyData, title }) => {
  const { preferences } = useUserPreferences();
  const isMetric = preferences.temperatureUnit === 'celsius';
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Map all hourly data points without any filtering
    const allHourlyData = hourlyData.map(hour => ({
      time: formatTime(hour.time, 'h a'),
      temp: isMetric ? hour.temp_c : hour.temp_f,
      originalTime: hour.time,
    }));
    setChartData(allHourlyData);
  }, [hourlyData, isMetric]);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent>
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className={`h-[${CHART_CONFIG.height}px] w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={CHART_CONFIG.margin}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="temp"
                stroke="hsl(var(--primary))"
                strokeWidth={CHART_CONFIG.area.strokeWidth}
                fill="url(#colorTemp)"
                dot={{ r: CHART_CONFIG.area.dotRadius, fill: "hsl(var(--primary))" }}
                activeDot={{ r: CHART_CONFIG.area.activeDotRadius, fill: "hsl(var(--primary))" }}
              />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: CHART_CONFIG.axis.fontSize, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                padding={CHART_CONFIG.axis.padding}
                interval={0}
                minTickGap={20}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: CHART_CONFIG.axis.fontSize, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
                padding={CHART_CONFIG.axis.padding}
              />
              <Tooltip content={(props) => <CustomTooltip {...props} isMetric={isMetric} />} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};