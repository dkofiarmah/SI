import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  fullScreen?: boolean;
  message?: string;
  transparent?: boolean;
}

export default function LoadingIndicator({ 
  fullScreen = false, 
  message = 'Loading...', 
  transparent = false 
}: LoadingIndicatorProps) {
  
  if (fullScreen) {
    return (
      <div className={`fixed inset-0 ${transparent ? 'bg-white/80' : 'bg-white'} z-50 flex items-center justify-center`}>
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          {message && <p className="mt-4 text-gray-600">{message}</p>}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center p-6">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
