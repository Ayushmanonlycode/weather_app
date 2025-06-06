'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { getCitySuggestions, type CitySuggestion } from '@/lib/api';
import { debounce } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WeatherSearchProps {
  location: string;
  onLocationChange: (location: string) => void;
  onUseCurrentLocation: (lat: number, lon: number) => void;
  disabled?: boolean;
}

export const WeatherSearch: FC<WeatherSearchProps> = ({ 
  location, 
  onLocationChange,
  onUseCurrentLocation,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(location);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { latitude, longitude, loading, error } = useGeolocation();
  const { 
    preferences, 
    addFavoriteLocation, 
    removeFavoriteLocation 
  } = useUserPreferences();
  
  // Update input when location prop changes
  useEffect(() => {
    setInputValue(location);
  }, [location]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions
  const fetchSuggestions = debounce(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await getCitySuggestions(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    fetchSuggestions(value);
    setShowSuggestions(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onLocationChange(inputValue.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    const fullLocation = `${suggestion.name}, ${suggestion.region}`;
    setInputValue(fullLocation);
    onLocationChange(fullLocation);
    setShowSuggestions(false);
  };
  
  const handleLocationClick = () => {
    if (latitude && longitude && !disabled) {
      onUseCurrentLocation(latitude, longitude);
    }
  };
  
  const isLocationFavorite = preferences.favoriteLocations.includes(location);
  
  const toggleFavorite = () => {
    if (disabled) return;
    
    if (isLocationFavorite) {
      removeFavoriteLocation(location);
    } else {
      addFavoriteLocation(location);
    }
  };
  
  return (
    <div className="space-y-2 relative" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search city or zip code..."
          className="pl-9 pr-24"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          disabled={disabled}
        />
        <div className="absolute right-1 top-1 flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={toggleFavorite}
                  disabled={!location || disabled}
                >
                  <Star
                    className={`h-4 w-4 ${
                      isLocationFavorite ? 'fill-yellow-400 text-yellow-400' : ''
                    }`}
                  />
                  <span className="sr-only">
                    {isLocationFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isLocationFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleLocationClick}
                  disabled={!latitude || !longitude || loading || disabled}
                >
                  <MapPin className="h-4 w-4" />
                  <span className="sr-only">Use current location</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {error ? 'Location access denied' : 'Use current location'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                setInputValue('');
                setSuggestions([]);
              }}
              disabled={disabled}
            >
              <XCircle className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (inputValue.trim() || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-2 text-sm text-muted-foreground">Loading suggestions...</div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={`${suggestion.name}-${index}`}>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-accent focus:bg-accent focus:outline-none"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="font-medium">{suggestion.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {suggestion.region}, {suggestion.country}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : inputValue.trim() ? (
            <div className="p-2 text-sm text-muted-foreground">No cities found</div>
          ) : null}
        </div>
      )}
      
      {preferences.favoriteLocations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {preferences.favoriteLocations.map((favLocation) => (
            <Button
              key={favLocation}
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onLocationChange(favLocation)}
              disabled={disabled}
            >
              <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
              {favLocation}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};