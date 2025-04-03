import { ReactNode } from 'react';
import { Activity } from 'lucide-react';

type AnalyticsChartProps = {
  title: string;
  children: ReactNode;
  legend?: ReactNode;
  controls?: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  className?: string;
};

export default function AnalyticsChart({
  title,
  children,
  legend,
  controls,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No data available',
  className = ''
}: AnalyticsChartProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-800">{title}</h3>
        {controls && <div className="flex items-center space-x-2">{controls}</div>}
      </div>
      
      <div className="p-4 relative">
        {isLoading ? (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <Activity className="h-8 w-8 text-blue-500 animate-pulse" />
              <p className="mt-2 text-sm text-gray-600">Loading data...</p>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
            {emptyMessage}
          </div>
        ) : (
          <>
            <div className="min-h-[200px]">
              {children}
            </div>
            {legend && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                {legend}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}