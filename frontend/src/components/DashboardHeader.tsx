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
  
  return (
    <div className={`intel-header flex flex-col w-full ${
      sticky ? 'sticky top-0 z-20' : ''
    }`}>
      <div className="flex flex-wrap justify-between items-center p-4 gap-y-4 bg-white" style={{
        background: '#14213d',
        color: 'white',
      }}>
        <div className="flex items-start gap-2">
          <div>
            <h1 className="text-2xl font-bold font-headings tracking-tight text-primary" style={{
              color: 'white',
            }}>{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-gray-600" style={{
                color: '#c3c3c3',
              }}>{description}</p>
            )}
          </div>
          {showInfoTip && infoTipContent && (
            <div className="group relative">
              <button
                className="p-1 hover:bg-primary-light rounded-full transition-colors"
                aria-label="Show information"
              >
                <Info className="h-5 w-5 text-primary" />
              </button>
              <div className="hidden group-hover:block absolute left-full ml-2 top-0 bg-primary-dark text-white text-sm rounded-md p-2 w-64 z-20 shadow-lg border border-primary-light" style={{
                background: '#14213d',
              }}>
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
