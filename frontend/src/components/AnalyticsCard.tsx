import { ReactNode } from 'react';

type AnalyticsCardProps = {
  title: string;
  children: ReactNode;
  headerIcon?: ReactNode;
  headerAction?: ReactNode;
  variant?: 'default' | 'bordered' | 'highlighted';
  className?: string;
};

export default function AnalyticsCard({
  title,
  children,
  headerIcon,
  headerAction,
  variant = 'default',
  className = ''
}: AnalyticsCardProps) {
  const variantClasses = {
    'default': 'bg-white',
    'bordered': 'bg-white border-l-4 border-blue-500',
    'highlighted': 'bg-blue-50 border border-blue-200'
  };

  return (
    <div className={`rounded-lg shadow-sm border border-gray-200 overflow-hidden ${variantClasses[variant]} ${className}`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center">
          {headerIcon && <div className="mr-2">{headerIcon}</div>}
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}