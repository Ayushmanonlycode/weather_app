import { FC } from 'react';
import { Cloud, CloudSun, Sun, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';
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
  console.log('Weather condition code:', code);
  const iconName = getWeatherIcon(code);
  console.log('Mapped icon name:', iconName);
  
  // Map icon names to their corresponding Lucide components
  const iconMap: Record<string, any> = {
    'sun': Sun,
    'cloud': Cloud,
    'cloud-sun': CloudSun,
    'cloud-drizzle': CloudDrizzle,
    'cloud-rain': CloudRain,
    'cloud-snow': CloudSnow,
    'cloud-lightning': CloudLightning,
    'cloud-fog': CloudFog,
    'cloud-question': Cloud
  };
  
  const Icon = iconMap[iconName] || Cloud;
  
  console.log('Selected icon component:', Icon.name);
  
  return <Icon size={size} className={className} />;
};