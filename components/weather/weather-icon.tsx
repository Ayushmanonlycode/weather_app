import { FC } from 'react';
import * as LucideIcons from 'lucide-react';
import { getWeatherIcon } from '@/lib/utils';

interface WeatherIconProps {
  code: number;
  className?: string;
  size?: number;
}

export const WeatherIcon: FC<WeatherIconProps> = ({ 
  code, 
  className = '', 
  size = 24 
}) => {
  const iconName = getWeatherIcon(code);
  
  // Dynamically get the icon from lucide-react
  const Icon = (LucideIcons as any)[
    iconName.split('-').map((part, i) => 
      i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    ).join('')
  ] || LucideIcons.Cloud;
  
  return <Icon size={size} className={className} />;
};