'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface UserPreferences {
  theme: Theme;
  temperatureUnit: 'celsius' | 'fahrenheit';
  favoriteLocations: string[];
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  toggleTheme: () => void;
  toggleTemperatureUnit: () => void;
  addFavoriteLocation: (location: string) => void;
  removeFavoriteLocation: (location: string) => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  temperatureUnit: 'celsius',
  favoriteLocations: [],
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(preferences.theme);
  }, [preferences]);

  const toggleTheme = () => {
    setPreferences(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const toggleTemperatureUnit = () => {
    setPreferences(prev => ({
      ...prev,
      temperatureUnit: prev.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius'
    }));
  };

  const addFavoriteLocation = (location: string) => {
    // Limit to 3 favorites
    if (preferences.favoriteLocations.includes(location)) return;
    
    const newFavorites = [...preferences.favoriteLocations];
    if (newFavorites.length >= 3) {
      newFavorites.pop();
    }
    newFavorites.unshift(location);
    
    setPreferences(prev => ({
      ...prev,
      favoriteLocations: newFavorites
    }));
  };

  const removeFavoriteLocation = (location: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteLocations: prev.favoriteLocations.filter(loc => loc !== location)
    }));
  };

  return (
    <UserPreferencesContext.Provider 
      value={{ 
        preferences, 
        toggleTheme, 
        toggleTemperatureUnit,
        addFavoriteLocation,
        removeFavoriteLocation
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
} 