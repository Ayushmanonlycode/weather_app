'use client';

import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/hooks/useUserPreferences';

/**
 * TemperatureUnitToggle component for switching between Celsius and Fahrenheit
 * Features:
 * - Uses user preferences hook for state management
 * - Outline variant button
 * - Small size
 * - Displays current unit (°C or °F)
 * - Toggles between units on click
 */
export function TemperatureUnitToggle() {
  const { preferences, toggleTemperatureUnit } = useUserPreferences();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTemperatureUnit}
      className="h-8 px-3"
    >
      {preferences.temperatureUnit === 'celsius' ? '°C' : '°F'}
    </Button>
  );
}