import { ReactNode } from 'react';
import { Info } from 'lucide-react';

type DashboardHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  showInfoTip?: boolean;
  infoTipContent?: string;
  bgColor?: 'white' | 'transparent';
  sticky?: boolean;
};

export default function DashboardHeader({
  title,
  description,
  children,
  showInfoTip = false,
  infoTipContent,
  bgColor = 'transparent',
  sticky = false
}: DashboardHeaderProps) {
  return (
    <div className={`flex flex-wrap justify-between items-center mb-6 gap-y-4 ${
      bgColor === 'white' ? 'bg-white' : ''
    } ${
      sticky ? 'sticky top-0 z-20 p-4 border-b border-gray-200' : ''
    }`}>
      <div className="flex items-start gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {showInfoTip && infoTipContent && (
          <div className="group relative">
            <button
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Show information"
            >
              <Info className="h-5 w-5 text-gray-400" />
            </button>
            <div className="hidden group-hover:block absolute left-full ml-2 top-0 bg-gray-800 text-white text-sm rounded-md p-2 w-64 z-20 shadow-lg">
              {infoTipContent}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
}
