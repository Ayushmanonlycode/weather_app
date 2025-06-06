'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';
type TemperatureUnit = 'celsius' | 'fahrenheit';

interface UserPreferences {
  theme: Theme;
  temperatureUnit: TemperatureUnit;
  favoriteLocations: string[];
  version: number;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  toggleTheme: () => void;
  toggleTemperatureUnit: () => void;
  addFavoriteLocation: (location: string) => void;
  removeFavoriteLocation: (location: string) => void;
  resetPreferences: () => void;
  hasError: boolean;
  error: string | null;
}

const CURRENT_VERSION = 1;

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  temperatureUnit: 'celsius',
  favoriteLocations: [],
  version: CURRENT_VERSION,
};

const STORAGE_KEY = 'userPreferences';

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

function validatePreferences(preferences: any): preferences is UserPreferences {
  return (
    preferences &&
    typeof preferences === 'object' &&
    ['light', 'dark'].includes(preferences.theme) &&
    ['celsius', 'fahrenheit'].includes(preferences.temperatureUnit) &&
    Array.isArray(preferences.favoriteLocations) &&
    typeof preferences.version === 'number'
  );
}

function migratePreferences(preferences: any): UserPreferences {
  if (!preferences) return defaultPreferences;

  // Handle version 0 (no version field)
  if (!preferences.version) {
    return {
      ...defaultPreferences,
      theme: preferences.theme || defaultPreferences.theme,
      temperatureUnit: preferences.temperatureUnit || defaultPreferences.temperatureUnit,
      favoriteLocations: Array.isArray(preferences.favoriteLocations) 
        ? preferences.favoriteLocations 
        : defaultPreferences.favoriteLocations,
      version: CURRENT_VERSION,
    };
  }

  // Add future migrations here
  return preferences as UserPreferences;
}

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreferences = useCallback(() => {
    try {
      const savedPreferences = localStorage.getItem(STORAGE_KEY);
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        const migrated = migratePreferences(parsed);
        if (validatePreferences(migrated)) {
          setPreferences(migrated);
          setHasError(false);
          setError(null);
        } else {
          throw new Error('Invalid preferences format');
        }
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
      setHasError(true);
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
      setPreferences(defaultPreferences);
    }
  }, []);

  const savePreferences = useCallback((newPreferences: UserPreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      setHasError(false);
      setError(null);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setHasError(true);
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    savePreferences(preferences);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(preferences.theme);
  }, [preferences, savePreferences]);

  const toggleTheme = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  }, []);

  const toggleTemperatureUnit = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      temperatureUnit: prev.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius'
    }));
  }, []);

  const addFavoriteLocation = useCallback((location: string) => {
    if (!location.trim()) return;
    
    setPreferences(prev => {
      if (prev.favoriteLocations.includes(location)) return prev;
      
      const newFavorites = [...prev.favoriteLocations];
      if (newFavorites.length >= 3) {
        newFavorites.pop();
      }
      newFavorites.unshift(location);
      
      return {
        ...prev,
        favoriteLocations: newFavorites
      };
    });
  }, []);

  const removeFavoriteLocation = useCallback((location: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteLocations: prev.favoriteLocations.filter(loc => loc !== location)
    }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, []);

  return (
    <UserPreferencesContext.Provider 
      value={{ 
        preferences, 
        toggleTheme, 
        toggleTemperatureUnit,
        addFavoriteLocation,
        removeFavoriteLocation,
        resetPreferences,
        hasError,
        error,
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