'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalDateTime } from '@/hooks/useLocalDateTime';
import { Loader2, Clock, Globe } from 'lucide-react';

export const LocalDateTime: FC = () => {
  const { date, time, timezone, offset, loading, error } = useLocalDateTime();

  if (loading) {
    return (
      <Card className="bg-black/50 backdrop-blur-sm border-0">
        <CardContent className="p-2 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-black/50 backdrop-blur-sm border-0">
        <CardContent className="p-2 text-white">
          <p className="text-xs text-red-400">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/50 backdrop-blur-sm border-0">
      <CardContent className="p-2">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-white" />
          <div>
            <p className="text-white font-medium text-sm">
              {time}
            </p>
            <div className="flex items-center space-x-1 text-white/60 text-xs">
              <Globe className="h-3 w-3" />
              <span>{timezone}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 