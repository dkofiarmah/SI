import { ReactNode } from 'react';
import { Info, Shield, Lock } from 'lucide-react';

type DashboardHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  showInfoTip?: boolean;
  infoTipContent?: string;
  bgColor?: 'white' | 'transparent';
  sticky?: boolean;
  classificationType?: 'unclassified' | 'confidential' | 'secret' | 'top-secret';
};

export default function DashboardHeader({
  title,
  description,
  children,
  showInfoTip = false,
  infoTipContent,
  bgColor = 'transparent',
  sticky = false,
  classificationType = 'unclassified'
}: DashboardHeaderProps) {
  
  // Define classification banner color based on classification type
  const getClassificationColor = () => {
    switch(classificationType) {
      case 'confidential': return 'bg-blue-700';
      case 'secret': return 'bg-amber-600';
      case 'top-secret': return 'bg-accent';
      default: return 'bg-green-700';
    }
  };
  
  return (
    <div className={`intel-header flex flex-col w-full ${
      sticky ? 'sticky top-0 z-20' : ''
    }`}>
      {/* Classification banner */}
      <div className={`classified-banner ${getClassificationColor()} w-full flex justify-center items-center py-1`}>
        <Lock className="h-3 w-3 mr-1.5" />
        <span>{classificationType.toUpperCase()}</span>
      </div>
      
      <div className={`flex flex-wrap justify-between items-center p-4 gap-y-4 ${
        bgColor === 'white' ? 'bg-white' : 'bg-primary'
      }`}>
        <div className="flex items-start gap-2">
          <div>
            <h1 className="text-2xl font-bold text-white font-headings tracking-tight">{title}</h1>
            {description && (
              <p className="text-neutral-200 mt-1 text-sm">{description}</p>
            )}
          </div>
          {showInfoTip && infoTipContent && (
            <div className="group relative">
              <button
                className="p-1 hover:bg-primary-light rounded-full transition-colors"
                aria-label="Show information"
              >
                <Info className="h-5 w-5 text-neutral-300" />
              </button>
              <div className="hidden group-hover:block absolute left-full ml-2 top-0 bg-primary-dark text-white text-sm rounded-md p-2 w-64 z-20 shadow-lg border border-primary-light">
                {infoTipContent}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}
